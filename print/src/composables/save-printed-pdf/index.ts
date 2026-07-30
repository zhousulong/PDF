import type { Ref } from 'vue'
import { get } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import { buildPDF } from '@/utils/pdf-builder/pdf-lib'

interface PDFRenderer {
  renderPage(
    page: number,
    scale: number
  ): Promise<{
    blob: Blob
    height: number
    width: number
    ppi: number
  }>
  getNumPages(): Promise<number>
}

interface PrintRenderer {
  renderPage(
    image: Blob,
    options?: {
      signal?: AbortSignal
      pageIndex?: number
    }
  ): Promise<{
    blob: Blob
  }>
}

export function useSavePrintedPDF(
  pdf: Ref<File | undefined>,
  pdfRenderer: Ref<PDFRenderer | undefined>,
  printRenderer: Ref<PrintRenderer | undefined>,
  scale: Ref<number>
) {
  const finishedPages = ref(0)
  const totalPages = ref(0)
  const progress = computed(() => {
    if (totalPages.value === 0) {
      return 0
    }
    return finishedPages.value / totalPages.value
  })

  const saving = ref(false)
  const printedPDF = ref<File | undefined>(undefined)
  const outputFilename = computed(() => {
    const originalFilename = pdf.value?.name ?? 'doc.pdf'
    const filename = `${originalFilename.replace(/\.[^/.]+$/, '')}-printed.pdf`
    return filename
  })

  const reset = () => {
    finishedPages.value = 0
    totalPages.value = 0
    printedPDF.value = undefined
    saving.value = false
  }

  watch(pdfRenderer, reset)
  watch(printRenderer, reset)
  watch(scale, reset)

  const save = async () => {
    try {
      finishedPages.value = 0
      totalPages.value = 0
      saving.value = true

      const pdfVal = get(pdfRenderer)
      const printVal = get(printRenderer)
      const scaleVal = get(scale)

      if (!pdfVal || !printVal) {
        throw new Error('No PDF or Print Renderer')
      }

      const numPages = await pdfVal.getNumPages()
      totalPages.value = numPages

      // generate pdf pages 1...n sequentially to respect order/index
      const pages = Array.from({ length: numPages }, (_, i) => i + 1)
      const printPages = []

      for (let i = 0; i < pages.length; i++) {
        const pageNum = pages[i]
        const { blob: pdfPage, height, width } = await pdfVal.renderPage(pageNum, scaleVal)
        const { blob: printPage } = await printVal.renderPage(pdfPage, {
          pageIndex: i
        })
        finishedPages.value += 1
        printPages.push({
          blob: printPage,
          width,
          height,
          ppi: scaleVal * 72
        })
      }

      // generate pdf from print pages
      const pdfDocument = await buildPDF(printPages)

      printedPDF.value = new File([pdfDocument], outputFilename.value, {
        type: 'application/pdf'
      })

      return pdfDocument
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      saving.value = false
    }
  }

  return { save, progress, saving, printedPDF }
}
