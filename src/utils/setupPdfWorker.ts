import pdfJsWorkerURL from 'pdfjs-dist/build/pdf.worker.min.js?url'
import { GlobalWorkerOptions } from 'pdfjs-dist'

/**
 * Resolve worker script URL. Blob + importScripts keeps the Worker
 * same-origin as the page even if the hashed worker asset is on another path.
 */
export function setupPdfWorker(): void {
  if (typeof window === 'undefined') return

  try {
    const workerUrl = new URL(pdfJsWorkerURL, window.location.href).href
    const workerBlob = new Blob([`importScripts(${JSON.stringify(workerUrl)});`], {
      type: 'application/javascript'
    })
    GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob)
  } catch {
    GlobalWorkerOptions.workerSrc = pdfJsWorkerURL
  }
}
