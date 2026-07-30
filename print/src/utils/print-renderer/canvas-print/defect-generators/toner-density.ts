/**
 * 碳粉/墨水浓度与页内不均效果
 * tonerDensity: <1 偏淡, >1 偏深
 * densityUniformity: 页内浓度不均程度
 * blackDepth: 黑色底色深度（0 = 黑色发灰，1 = 纯黑）
 */
export function applyTonerDensity(
  imageData: ImageData,
  tonerDensity: number,
  densityUniformity: number,
  blackDepth: number,
  isGrayscale: boolean
): void {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      // 1. 模拟有机、非均匀的鼓芯磨损或墨盒出墨不均
      let localDensity = tonerDensity
      if (densityUniformity > 0) {
        // 低频二维不规则斑块波形 (模拟局部墨粉不足/纸张受潮)
        const waveX = Math.sin(x * 0.0025) * Math.cos(y * 0.0018)
        const waveY = Math.cos(x * 0.0012) * Math.sin(y * 0.0035)
        const blotch = (waveX + waveY) * 0.5 // 范围 -0.5 ~ 0.5

        // 模拟打印机硒鼓/滚轮圆柱体周期性产生的横向/纵向淡化带
        const drumWave = Math.sin(y * 0.006) * 0.35

        // 结合两者生成极具真实感的局部偏差因子
        const variance = (blotch + drumWave) * densityUniformity * 0.7
        localDensity = Math.max(0.15, tonerDensity * (1 + variance))
      }

      // 计算指数变换幂
      // localDensity < 1 时，exponent > 1，颜色曲线向上弯曲偏白（稀疏褪色）
      // localDensity > 1 时，exponent < 1，颜色曲线向下弯曲偏黑（墨重浓郁）
      const exponent = 1.0 / localDensity

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      if (isGrayscale) {
        // 灰度模式：先计算灰度值，再应用褪色曲线和黑色不黑 (blackDepth)
        const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255
        const adjustedLum = Math.pow(lum, exponent)
        
        // 黑色纯度修正：当 blackDepth < 1 时，限制最暗处的黑度，使其“发灰”
        const finalLum = (1 - blackDepth) + adjustedLum * blackDepth
        const v = Math.min(255, Math.max(0, Math.round(finalLum * 255)))

        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
      } else {
        // 彩色模式：对 RGB 三通道独立做归一化指数运算，保留色相同时模拟墨水稀薄度
        const rNorm = Math.pow(r / 255, exponent)
        const gNorm = Math.pow(g / 255, exponent)
        const bNorm = Math.pow(b / 255, exponent)

        // 同样混合 blackDepth 修正（对彩色中接近黑色的极暗部同样有效）
        const rFinal = (1 - blackDepth) + rNorm * blackDepth
        const gFinal = (1 - blackDepth) + gNorm * blackDepth
        const bFinal = (1 - blackDepth) + bNorm * blackDepth

        data[i] = Math.min(255, Math.max(0, Math.round(rFinal * 255)))
        data[i + 1] = Math.min(255, Math.max(0, Math.round(gFinal * 255)))
        data[i + 2] = Math.min(255, Math.max(0, Math.round(bFinal * 255)))
      }
    }
  }
}
