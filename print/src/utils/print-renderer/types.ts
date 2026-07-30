export interface PrintRenderer {
  renderPage(
    image: Blob,
    options?: {
      signal?: AbortSignal
      pageIndex?: number  // for continuousFade
    }
  ): Promise<{ blob: Blob }>
}
