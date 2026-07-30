import type { PrintRenderer } from '../types'

/**
 * PrintCacher: wraps a PrintRenderer and caches rendered pages.
 * Re-renders when the config (renderer) changes.
 */
export class PrintCacher implements PrintRenderer {
  private readonly renderer: PrintRenderer
  private readonly cache = new Map<string, Blob>()

  constructor(renderer: PrintRenderer) {
    this.renderer = renderer
  }

  async renderPage(
    image: Blob,
    options?: { signal?: AbortSignal; pageIndex?: number }
  ): Promise<{ blob: Blob }> {
    // Use image size as a simple cache key
    const cacheKey = `${image.size}-${options?.pageIndex ?? 0}`
    const cached = this.cache.get(cacheKey)
    if (cached) return { blob: cached }

    const result = await this.renderer.renderPage(image, options)
    this.cache.set(cacheKey, result.blob)
    return result
  }
}
