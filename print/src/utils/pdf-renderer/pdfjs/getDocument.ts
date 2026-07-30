import pdfJsWorkerURL from 'pdfjs-dist/build/pdf.worker.min.js?url'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'

if (typeof window !== 'undefined') {
  try {
    const workerUrl = new URL(pdfJsWorkerURL, window.location.href).href
    const workerBlob = new Blob([`importScripts("${workerUrl}");`], {
      type: 'application/javascript'
    })
    GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob)
  } catch (e) {
    GlobalWorkerOptions.workerSrc = pdfJsWorkerURL
  }
}

export { getDocument }
