/**
 * Convert original documents to PDF entirely in the browser.
 *
 * Why this stack (privacy-first, no upload):
 *   - Images  → decode via <img>/canvas (respects EXIF) then embed with pdf-lib
 *   - DOCX    → docx-preview paginates Word layout, html2canvas snapshots each page
 *   - XLSX    → SheetJS parses the workbook, we paginate HTML tables onto A4
 *   - TXT     → HTML wrap + the same A4 snapshot path (CJK-safe)
 *
 * Old binary .doc / .xls cannot be decoded reliably in-browser; callers
 * should surface a "save as .docx / .xlsx" message instead.
 */

import { A4_HEIGHT_PT, A4_WIDTH_PT } from './pdfProcessor'

export type SourceKind =
  | 'pdf'
  | 'image'
  | 'docx'
  | 'xlsx'
  | 'txt'
  | 'legacy_office'
  | 'unsupported'

const A4_CSS_W = 794
const A4_CSS_H = 1123
const SNAPSHOT_SCALE = 2
const MAX_XLSX_ROWS = 2000
const MAX_SNAPSHOT_PAGES = 40

export function detectSourceKind(file: File): SourceKind {
  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()

  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'

  if (
    name.endsWith('.doc') ||
    name.endsWith('.xls') ||
    type === 'application/msword' ||
    type === 'application/vnd.ms-excel'
  ) {
    return 'legacy_office'
  }

  if (
    name.endsWith('.docx') ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx'
  }

  if (
    name.endsWith('.xlsx') ||
    name.endsWith('.xlsm') ||
    name.endsWith('.csv') ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'text/csv' ||
    type === 'application/csv'
  ) {
    return 'xlsx'
  }

  if (name.endsWith('.txt') || type === 'text/plain') return 'txt'

  if (
    type.startsWith('image/') ||
    /\.(png|jpe?g|webp|gif|bmp|tif|tiff|svg)$/.test(name)
  ) {
    if (/\.(heic|heif)$/.test(name) || type.includes('heic') || type.includes('heif')) {
      return 'unsupported'
    }
    return 'image'
  }

  return 'unsupported'
}

export function replaceExt(filename: string, ext: string): string {
  return filename.replace(/\.[^.]+$/, '') + ext
}

export async function convertToPdf(file: File): Promise<File> {
  const kind = detectSourceKind(file)
  switch (kind) {
    case 'pdf':
      return file
    case 'image':
      return convertImageToPdf(file)
    case 'docx':
      return convertDocxToPdf(file)
    case 'xlsx':
      return convertWorkbookToPdf(file)
    case 'txt':
      return convertTextToPdf(file)
    case 'legacy_office':
      throw new Error('legacy_office')
    default:
      throw new Error('unsupported_format')
  }
}

async function convertImageToPdf(file: File): Promise<File> {
  const { PDFDocument } = await import('pdf-lib')
  const img = await loadHtmlImage(file)

  const landscape = img.naturalWidth > img.naturalHeight
  const cssW = landscape ? A4_CSS_H : A4_CSS_W
  const cssH = landscape ? A4_CSS_W : A4_CSS_H
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(cssW * SNAPSHOT_SCALE)
  canvas.height = Math.round(cssH * SNAPSHOT_SCALE)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('convert_failed')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const ratio = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
  const drawW = img.naturalWidth * ratio
  const drawH = img.naturalHeight * ratio
  ctx.drawImage(img, (canvas.width - drawW) / 2, (canvas.height - drawH) / 2, drawW, drawH)

  const preferJpeg = !hasAlphaName(file)
  const bytes = preferJpeg
    ? await canvasToBytes(canvas, 'image/jpeg', 0.9)
    : await canvasToBytes(canvas, 'image/png')

  const pdf = await PDFDocument.create()
  const pageW = landscape ? A4_HEIGHT_PT : A4_WIDTH_PT
  const pageH = landscape ? A4_WIDTH_PT : A4_HEIGHT_PT
  const page = pdf.addPage([pageW, pageH])
  const embedded = preferJpeg ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes)
  page.drawImage(embedded, { x: 0, y: 0, width: pageW, height: pageH })

  return pdfBytesToFile(await pdf.save(), file.name)
}

/**
 * Word → PDF via VolodymyrBaydalka/docxjs (docx-preview).
 *
 * That library splits HTML on every <w:sectPr>, including type="continuous".
 * In Word, continuous sections stay on the same page (column / margin change).
 * Quotation templates often have 2–3 continuous sectPr and zero page breaks —
 * docx-preview then emits 3 <section> boxes for a 1-page sheet.
 *
 * We inspect document.xml first. If there is no real page break, merge those
 * sections back into one page before snapshotting.
 */
async function convertDocxToPdf(file: File): Promise<File> {
  const { renderAsync } = await import('docx-preview')
  const html2canvas = (await import('html2canvas')).default
  const { PDFDocument } = await import('pdf-lib')

  const buf = await file.arrayBuffer()
  const hint = await inspectDocxPagination(buf)

  const host = createOffscreenHost(1400)
  try {
    await renderAsync(buf, host, undefined, {
      className: 'qfz-docx',
      inWrapper: false,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      experimental: false,
      useBase64URL: true,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      renderAltChunks: true
    })

    await waitForLayout()

    const pages = Array.from(host.querySelectorAll<HTMLElement>(':scope > section.qfz-docx'))
    let targets = pages.length ? pages : Array.from(host.querySelectorAll<HTMLElement>('section.qfz-docx'))
    if (!targets.length) throw new Error('convert_failed')

    if (shouldMergeContinuousDocxSections(hint) && targets.length > 1) {
      targets = mergeDocxSections(targets)
    }

    const pdf = await PDFDocument.create()
    const limit = Math.min(targets.length, MAX_SNAPSHOT_PAGES)

    for (let i = 0; i < limit; i++) {
      const el = targets[i]
      const pageW = cssLengthToPt(el.style.width) || pxToPt(el.offsetWidth)
      const declaredH =
        cssLengthToPt(el.style.height) ||
        cssLengthToPt(el.style.minHeight) ||
        pxToPt(el.offsetHeight)
      if (pageW < 40 || declaredH < 40) continue

      el.style.boxShadow = 'none'
      el.style.margin = '0'
      el.style.background = '#ffffff'
      el.style.width = `${pageW}pt`
      el.style.height = 'auto'
      el.style.maxHeight = 'none'
      el.style.overflow = 'visible'
      el.style.boxSizing = 'border-box'
      await waitForLayout()
      const contentH = pxToPt(el.scrollHeight)
      const pageH = Math.max(declaredH, contentH)

      el.style.height = `${pageH}pt`
      el.style.minHeight = `${pageH}pt`
      el.style.maxHeight = `${pageH}pt`
      el.style.overflow = 'hidden'

      await waitForLayout()

      const cssW = Math.max(1, el.offsetWidth)
      const cssH = Math.max(1, el.offsetHeight)
      const canvas = await html2canvas(el, {
        scale: SNAPSHOT_SCALE,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: cssW,
        height: cssH,
        windowWidth: cssW,
        windowHeight: cssH,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (_doc, cloned) => {
          const node = cloned as HTMLElement
          node.style.boxShadow = 'none'
          node.style.margin = '0'
          node.style.transform = 'none'
          node.style.background = '#ffffff'
        }
      })
      await appendCanvasPage(pdf, canvas, pageW, pageH)
    }

    if (pdf.getPageCount() === 0) throw new Error('convert_failed')
    return pdfBytesToFile(await pdf.save(), file.name)
  } finally {
    host.remove()
  }
}

async function convertWorkbookToPdf(file: File): Promise<File> {
  const XLSX = await import('xlsx')
  const html2canvas = (await import('html2canvas')).default
  const { PDFDocument } = await import('pdf-lib')

  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellStyles: true })
  const pdf = await PDFDocument.create()
  const host = createOffscreenHost(A4_CSS_W)

  try {
    for (const sheetName of wb.SheetNames) {
      if (pdf.getPageCount() >= MAX_SNAPSHOT_PAGES) break
      const sheet = wb.Sheets[sheetName]
      if (!sheet || !sheet['!ref']) continue

      const clipped = clipSheetRows(XLSX, sheet, MAX_XLSX_ROWS)
      const tableHtml = XLSX.utils.sheet_to_html(clipped)
      if (!tableHtml || !/<td|<th/i.test(tableHtml)) continue

      const showTitle = wb.SheetNames.length > 1
      host.innerHTML = `
        <div class="xlsx-root" style="width:${A4_CSS_W}px;background:#fff;color:#111;box-sizing:border-box;">
          ${showTitle ? `<div style="padding:18px 28px 0;font-size:12px;color:#666;font-family:PingFang SC,Microsoft YaHei,sans-serif;">${escapeHtml(sheetName)}</div>` : ''}
          <div class="xlsx-table-wrap" style="padding:16px 24px 28px;font-family:PingFang SC,Microsoft YaHei,sans-serif;">${tableHtml}</div>
        </div>
      `
      styleExcelTable(host)
      await waitForLayout()

      const root = host.querySelector('.xlsx-root') as HTMLElement | null
      if (!root) continue

      const totalHeight = Math.max(root.scrollHeight, A4_CSS_H)
      const pageCount = Math.min(
        MAX_SNAPSHOT_PAGES - pdf.getPageCount(),
        Math.max(1, Math.ceil(totalHeight / A4_CSS_H))
      )

      for (let i = 0; i < pageCount; i++) {
        const clip = document.createElement('div')
        clip.style.cssText = `width:${A4_CSS_W}px;height:${A4_CSS_H}px;overflow:hidden;background:#fff;`
        const inner = root.cloneNode(true) as HTMLElement
        inner.style.transform = `translateY(-${i * A4_CSS_H}px)`
        clip.appendChild(inner)
        host.appendChild(clip)
        await waitForLayout()
        const canvas = await html2canvas(clip, {
          scale: SNAPSHOT_SCALE,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: A4_CSS_W,
          height: A4_CSS_H,
          windowWidth: A4_CSS_W,
          windowHeight: A4_CSS_H
        })
        clip.remove()
        await appendCanvasPage(pdf, canvas)
      }
    }

    if (pdf.getPageCount() === 0) throw new Error('convert_failed')
    return pdfBytesToFile(await pdf.save(), file.name)
  } finally {
    host.remove()
  }
}

async function convertTextToPdf(file: File): Promise<File> {
  const html2canvas = (await import('html2canvas')).default
  const { PDFDocument } = await import('pdf-lib')
  const text = await file.text()
  const host = createOffscreenHost(A4_CSS_W)

  try {
    host.innerHTML = `
      <div class="txt-root" style="width:${A4_CSS_W}px;padding:48px 56px;box-sizing:border-box;background:#fff;color:#111;white-space:pre-wrap;word-break:break-word;font:14px/1.75 PingFang SC,Microsoft YaHei,serif;">
        ${escapeHtml(text || ' ')}
      </div>
    `
    await waitForLayout()
    const root = host.firstElementChild as HTMLElement
    const totalHeight = Math.max(root.scrollHeight, A4_CSS_H)
    const pageCount = Math.min(MAX_SNAPSHOT_PAGES, Math.max(1, Math.ceil(totalHeight / A4_CSS_H)))
    const pdf = await PDFDocument.create()

    for (let i = 0; i < pageCount; i++) {
      const clip = document.createElement('div')
      clip.style.cssText = `width:${A4_CSS_W}px;height:${A4_CSS_H}px;overflow:hidden;background:#fff;`
      const inner = root.cloneNode(true) as HTMLElement
      inner.style.transform = `translateY(-${i * A4_CSS_H}px)`
      clip.appendChild(inner)
      host.appendChild(clip)
      await waitForLayout()
      const canvas = await html2canvas(clip, {
        scale: SNAPSHOT_SCALE,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: A4_CSS_W,
        height: A4_CSS_H
      })
      clip.remove()
      await appendCanvasPage(pdf, canvas)
    }

    return pdfBytesToFile(await pdf.save(), file.name)
  } finally {
    host.remove()
  }
}

function clipSheetRows(
  XLSX: typeof import('xlsx'),
  sheet: import('xlsx').WorkSheet,
  maxRows: number
): import('xlsx').WorkSheet {
  const ref = sheet['!ref']
  if (!ref) return sheet
  const range = XLSX.utils.decode_range(ref)
  if (range.e.r - range.s.r <= maxRows) return sheet
  const next = { ...sheet }
  range.e.r = range.s.r + maxRows
  next['!ref'] = XLSX.utils.encode_range(range)
  return next
}

function styleExcelTable(host: HTMLElement): void {
  const table = host.querySelector('table')
  if (!table) return
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.style.fontSize = '11px'
  table.style.tableLayout = 'fixed'
  table.querySelectorAll('td,th').forEach((cell) => {
    const el = cell as HTMLElement
    el.style.border = '1px solid #c8c8c8'
    el.style.padding = '4px 6px'
    el.style.wordBreak = 'break-word'
    el.style.verticalAlign = 'top'
  })
}

function createOffscreenHost(widthPx: number): HTMLDivElement {
  const host = document.createElement('div')
  host.setAttribute('data-doc-convert', '1')
  // Keep the stage fully painted (html2canvas mishandles opacity ≈ 0) but
  // park it off-screen so the Word page box is not squeezed by our layout.
  host.style.cssText = [
    'position:fixed',
    'left:-14000px',
    'top:0',
    `width:${widthPx}px`,
    'opacity:1',
    'pointer-events:none',
    'z-index:0',
    'background:#fff',
    'color:#111'
  ].join(';')
  document.body.appendChild(host)
  return host
}

interface DocxPageHint {
  lastRendered: number
  manualPageBreaks: number
  nextPageSections: number
  continuousSections: number
}

/** Read Word's own pagination marks out of document.xml. */
export async function inspectDocxPagination(buf: ArrayBuffer): Promise<DocxPageHint> {
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(buf)
  const xml = (await zip.file('word/document.xml')?.async('string')) || ''

  const lastRendered = (xml.match(/lastRenderedPageBreak/g) || []).length
  const manualPageBreaks =
    (xml.match(/w:type="page"/g) || []).length +
    (xml.match(/w:type='page'/g) || []).length +
    (xml.match(/pageBreakBefore/g) || []).length

  let continuousSections = 0
  let nextPageSections = 0
  const sectRe = /<w:sectPr\b[\s\S]*?<\/w:sectPr>/g
  let block: RegExpExecArray | null
  while ((block = sectRe.exec(xml))) {
    if (/<w:type\b[^>]*w:val="continuous"/.test(block[0])) continuousSections += 1
    else if (/<w:type\b[^>]*w:val="(nextPage|oddPage|evenPage)"/.test(block[0])) nextPageSections += 1
  }

  return { lastRendered, manualPageBreaks, nextPageSections, continuousSections }
}

export function shouldMergeContinuousDocxSections(hint: DocxPageHint): boolean {
  return hint.lastRendered === 0 && hint.manualPageBreaks === 0 && hint.nextPageSections === 0
}

function mergeDocxSections(sections: HTMLElement[]): HTMLElement[] {
  const first = sections[0]
  for (let i = 1; i < sections.length; i++) {
    const next = sections[i]
    while (next.firstChild) first.appendChild(next.firstChild)
    next.remove()
  }
  return [first]
}

function pxToPt(px: number): number {
  return (px * 72) / 96
}

function cssLengthToPt(value: string | undefined): number {
  if (!value) return 0
  const pt = value.trim().match(/^([\d.]+)pt$/i)
  if (pt) return parseFloat(pt[1])
  const px = value.trim().match(/^([\d.]+)px$/i)
  if (px) return pxToPt(parseFloat(px[1]))
  const mm = value.trim().match(/^([\d.]+)mm$/i)
  if (mm) return (parseFloat(mm[1]) * 72) / 25.4
  return 0
}

async function appendCanvasPage(
  pdf: import('pdf-lib').PDFDocument,
  canvas: HTMLCanvasElement,
  pageW = 0,
  pageH = 0
): Promise<void> {
  const width = pageW > 1 ? pageW : canvas.width > canvas.height ? A4_HEIGHT_PT : A4_WIDTH_PT
  const height = pageH > 1 ? pageH : canvas.width > canvas.height ? A4_WIDTH_PT : A4_HEIGHT_PT
  const bytes = await canvasToBytes(canvas, 'image/jpeg', 0.88)
  const image = await pdf.embedJpg(bytes)
  const page = pdf.addPage([width, height])
  page.drawImage(image, { x: 0, y: 0, width, height })
}

async function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('convert_failed'))
      img.src = url
    })
    if (img.decode) {
      await img.decode().catch(() => undefined)
    }
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function canvasToBytes(
  canvas: HTMLCanvasElement,
  type: 'image/png' | 'image/jpeg',
  quality?: number
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('convert_failed'))
          return
        }
        blob
          .arrayBuffer()
          .then((buf) => resolve(new Uint8Array(buf)))
          .catch(reject)
      },
      type,
      quality
    )
  })
}

async function pdfBytesToFile(bytes: Uint8Array, originalName: string): Promise<File> {
  return new File([bytes as BlobPart], replaceExt(originalName, '.pdf'), {
    type: 'application/pdf'
  })
}

function hasAlphaName(file: File): boolean {
  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()
  return type.includes('png') || type.includes('webp') || type.includes('gif') || type.includes('svg')
    || /\.(png|webp|gif|svg)$/.test(name)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}
