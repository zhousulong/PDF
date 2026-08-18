/**
 * Convert images to PDF in the browser. PDF files pass through unchanged.
 * Word / Excel are not converted — export PDF from the office app first.
 */

import { A4_HEIGHT_PT, A4_WIDTH_PT } from './pdfProcessor'

export type SourceKind = 'pdf' | 'image' | 'unsupported'

const A4_CSS_W = 794
const A4_CSS_H = 1123
const SNAPSHOT_SCALE = 2

export function detectSourceKind(file: File): SourceKind {
  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()

  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'

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
