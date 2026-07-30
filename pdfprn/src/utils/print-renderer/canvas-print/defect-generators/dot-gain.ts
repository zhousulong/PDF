/**
 * 墨点扩散/晕染（喷墨打印机专属）
 * strength: 0~1，扩散强度
 */
export function applyDotGain(imageData: ImageData, strength: number): void {
  if (strength <= 0) return
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const original = new Uint8ClampedArray(data)

  const radius = Math.max(1, Math.round(strength * 2))

  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const i = (y * width + x) * 4
      const lum = (original[i] * 0.299 + original[i + 1] * 0.587 + original[i + 2] * 0.114) / 255

      // Only apply to darker areas (ink-heavy regions)
      if (lum < 0.6) {
        // Sample surrounding pixels to simulate ink spread
        let rSum = 0, gSum = 0, bSum = 0, count = 0
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist <= radius) {
              const ni = ((y + dy) * width + (x + dx)) * 4
              const nlum = (original[ni] * 0.299 + original[ni + 1] * 0.587 + original[ni + 2] * 0.114) / 255
              // Weight by darkness (darker neighbors spread more)
              const w = (1 - nlum) * (1 - dist / radius)
              rSum += original[ni] * w
              gSum += original[ni + 1] * w
              bSum += original[ni + 2] * w
              count += w
            }
          }
        }
        if (count > 0) {
          const spreadFactor = strength * 0.4
          data[i] = Math.round(original[i] * (1 - spreadFactor) + (rSum / count) * spreadFactor)
          data[i + 1] = Math.round(original[i + 1] * (1 - spreadFactor) + (gSum / count) * spreadFactor)
          data[i + 2] = Math.round(original[i + 2] * (1 - spreadFactor) + (bSum / count) * spreadFactor)
        }
      }
    }
  }
}
