/**
 * 偏色效果：逐像素调整 RGB 通道
 * colorShiftRed: +向偏红，-向偏绿
 * colorShiftBlue: +向偏蓝，-向偏黄
 */
export function applyColorShift(
  imageData: ImageData,
  colorShiftRed: number,
  colorShiftBlue: number,
  inkOutColor: string
): void {
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    // Color shift
    if (colorShiftRed > 0) {
      r = Math.min(255, r * (1 + colorShiftRed * 0.4))
      g = Math.max(0, g * (1 - colorShiftRed * 0.15))
    } else if (colorShiftRed < 0) {
      g = Math.min(255, g * (1 + Math.abs(colorShiftRed) * 0.3))
      r = Math.max(0, r * (1 - Math.abs(colorShiftRed) * 0.2))
    }

    if (colorShiftBlue > 0) {
      b = Math.min(255, b * (1 + colorShiftBlue * 0.4))
      g = Math.max(0, g * (1 - colorShiftBlue * 0.1))
    } else if (colorShiftBlue < 0) {
      // Yellow shift: boost R+G, reduce B
      r = Math.min(255, r * (1 + Math.abs(colorShiftBlue) * 0.2))
      g = Math.min(255, g * (1 + Math.abs(colorShiftBlue) * 0.15))
      b = Math.max(0, b * (1 - Math.abs(colorShiftBlue) * 0.5))
    }

    // Ink out simulation
    if (inkOutColor === 'cyan') {
      // Missing cyan: subtract cyan = add red, reduce B+G
      b = Math.max(0, b * 0.3)
      g = Math.max(0, g * 0.6)
      r = Math.min(255, r * 1.2)
    } else if (inkOutColor === 'magenta') {
      // Missing magenta: add green/cyan cast
      r = Math.max(0, r * 0.4)
      b = Math.max(0, b * 0.5)
      g = Math.min(255, g * 1.2)
    } else if (inkOutColor === 'yellow') {
      // Missing yellow: blue cast
      b = Math.min(255, b * 1.3)
      r = Math.max(0, r * 0.6)
      g = Math.max(0, g * 0.8)
    }

    data[i] = Math.round(r)
    data[i + 1] = Math.round(g)
    data[i + 2] = Math.round(b)
  }
}
