/**
 * 针式打印机点阵效果
 * dotMatrix: 0~1，点阵清晰度（越高越明显）
 * ribbonFade: 0~1，色带衰减（整体发灰）
 */
export function applyNeedleMatrix(imageData: ImageData, dotMatrix: number, ribbonFade: number): void {
  if (dotMatrix <= 0 && ribbonFade <= 0) return
  const data = imageData.data
  const width = imageData.width

  // 9-pin needle head simulation: 9 pins per column, ~1/72" spacing
  const pinSpacing = Math.max(2, Math.round(3 + (1 - dotMatrix) * 3))

  for (let i = 0; i < data.length; i += 4) {
    const pixelIdx = i / 4
    const y = Math.floor(pixelIdx / width)

    // Pin gap: rows between pins are slightly lighter
    const pinRow = y % pinSpacing
    const isPinGap = pinRow > 0 && dotMatrix > 0.2
    if (isPinGap) {
      const gapFactor = 1 + dotMatrix * 0.3
      data[i] = Math.min(255, Math.round(data[i] * gapFactor))
      data[i + 1] = Math.min(255, Math.round(data[i + 1] * gapFactor))
      data[i + 2] = Math.min(255, Math.round(data[i + 2] * gapFactor))
    }

    // Ribbon fade: overall density reduction + slight brown tint
    if (ribbonFade > 0) {
      const fadeFactor = 1 - ribbonFade * 0.5
      data[i] = Math.min(255, Math.round(data[i] * fadeFactor + ribbonFade * 40))
      data[i + 1] = Math.min(255, Math.round(data[i + 1] * fadeFactor + ribbonFade * 30))
      data[i + 2] = Math.min(255, Math.round(data[i + 2] * fadeFactor + ribbonFade * 10))
    }
  }
}
