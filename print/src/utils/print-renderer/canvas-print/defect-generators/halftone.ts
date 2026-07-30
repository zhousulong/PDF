/**
 * 半调网点效果（激光打印机专属）
 * strength: 0~1，越高网点越明显
 */
export function applyHalftone(imageData: ImageData, strength: number): void {
  if (strength <= 0) return
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const cellSize = Math.max(3, Math.round(4 + (1 - strength) * 4))  // 3~8px grid

  for (let cy = 0; cy < height; cy += cellSize) {
    for (let cx = 0; cx < width; cx += cellSize) {
      // Sample center pixel luminance
      const ci = (cy * width + cx) * 4
      const lum = (data[ci] * 0.299 + data[ci + 1] * 0.587 + data[ci + 2] * 0.114) / 255

      // Apply ordered dithering within the cell
      for (let dy = 0; dy < cellSize && cy + dy < height; dy++) {
        for (let dx = 0; dx < cellSize && cx + dx < width; dx++) {
          const pi = ((cy + dy) * width + (cx + dx)) * 4

          // Normalized position within cell
          const nx = (dx / cellSize - 0.5) * 2
          const ny = (dy / cellSize - 0.5) * 2
          const dist = Math.sqrt(nx * nx + ny * ny)

          // Dot radius based on luminance (darker = larger dot)
          const dotRadius = (1 - lum) * strength

          if (dist < dotRadius) {
            // Inside halftone dot: keep dark
            const factor = 1 - strength * 0.3
            data[pi] = Math.max(0, Math.round(data[pi] * factor))
            data[pi + 1] = Math.max(0, Math.round(data[pi + 1] * factor))
            data[pi + 2] = Math.max(0, Math.round(data[pi + 2] * factor))
          } else if (lum < 0.8) {
            // Outside dot in dark area: lighten slightly
            const factor = 1 + strength * 0.2
            data[pi] = Math.min(255, Math.round(data[pi] * factor))
            data[pi + 1] = Math.min(255, Math.round(data[pi + 1] * factor))
            data[pi + 2] = Math.min(255, Math.round(data[pi + 2] * factor))
          }
        }
      }
    }
  }
}
