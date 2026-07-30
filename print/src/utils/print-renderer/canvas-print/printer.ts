import type { PrintConfig } from '../config.types'
import type { PrintRenderer } from '../types'
import PrintWorker from './print.worker?worker'
import { createPaperTextureBlob } from './defect-generators/paper-texture'

// Pre-warm workers
const workers = [
  new PrintWorker(),
  new PrintWorker(),
  new PrintWorker(),
  new PrintWorker(),
  new PrintWorker()
]

const paperTextureBlobCache = new Map<string, Blob>()

export class CanvasPrinter implements PrintRenderer {
  config: PrintConfig

  constructor(config: PrintConfig) {
    this.config = config
  }

  async renderPage(
    image: Blob,
    options?: {
      signal?: AbortSignal
      pageIndex?: number
    }
  ): Promise<{ blob: Blob }> {
    if (options?.signal?.aborted) throw new Error('Aborted')

    const worker = workers.shift() ?? new PrintWorker()
    workers.push(new PrintWorker())

    options?.signal?.addEventListener('abort', () => worker.terminate())

    const paperTexture = await getPaperTextureBlob(this.config.paperTexture, this.config.paperType)

    const blob = await new Promise<Blob>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<Blob>) => {
        resolve(e.data)
        worker.terminate()
      }
      worker.onerror = (e: ErrorEvent) => {
        console.error(e)
        reject(e)
        worker.terminate()
      }
      worker.postMessage({
        page: image,
        config: JSON.parse(JSON.stringify(this.config)),
        paperTexture,
        pageIndex: options?.pageIndex ?? 0
      })
    })

    return { blob }
  }
}

async function getPaperTextureBlob(strength: number, paperType: string): Promise<Blob> {
  const key = `${strength.toFixed(2)}-${paperType}`
  const cached = paperTextureBlobCache.get(key)
  if (cached) return cached
  const blob = await createPaperTextureBlob(strength, paperType, 800, 800)
  paperTextureBlobCache.set(key, blob)
  return blob
}
