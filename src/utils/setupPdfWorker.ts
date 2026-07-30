import pdfJsWorkerURL from 'pdfjs-dist/build/pdf.worker.min.js?url'
import { GlobalWorkerOptions } from 'pdfjs-dist'

/**
 * Resolve worker script URL for both same-origin and CDN absolute bases.
 * Blob + importScripts keeps the Worker same-origin as the page while the
 * script body can still be fetched from pdf.yunno.net (requires CORS).
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
