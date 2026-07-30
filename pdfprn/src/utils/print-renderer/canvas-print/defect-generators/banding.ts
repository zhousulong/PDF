/**
 * 条纹/色带效果
 * strength: 0~1，条纹强度
 * direction: 'horizontal' | 'vertical'
 * printerType 影响条纹的间距和柔和度
 */
export function createBandingOverlay(
  width: number,
  height: number,
  strength: number,
  direction: 'horizontal' | 'vertical',
  printerType: string
): HTMLCanvasElement | OffscreenCanvas {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  if (!ctx) return canvas

  // 基础周期跨度：激光打印机有较宽的鼓周期条纹 (60px)，喷墨有细密的光栅步进纹 (12px)
  const baseSpacing = printerType === 'laser' ? 70 : 12
  const softness = printerType === 'laser' ? 0.25 : 0.65
  const opacity = strength * 0.42

  if (direction === 'horizontal') {
    let y = Math.random() * baseSpacing
    while (y < height) {
      // 引入随机步长抖动 (0.6 ~ 1.5 倍基础跨度)，模拟非绝对匀速的机械输纸偏差
      const currentSpacing = baseSpacing * (0.6 + Math.random() * 0.9)
      const bandOpacity = opacity * (0.4 + Math.random() * 0.9)
      const bandWidth = baseSpacing * (0.12 + Math.random() * 0.28)

      const gradient = ctx.createLinearGradient(0, y, 0, y + bandWidth)
      gradient.addColorStop(0, `rgba(0,0,0,0)`)
      gradient.addColorStop(softness, `rgba(0,0,0,${bandOpacity})`)
      gradient.addColorStop(1 - softness, `rgba(0,0,0,${bandOpacity})`)
      gradient.addColorStop(1, `rgba(0,0,0,0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, y, width, bandWidth)
      y += currentSpacing
    }
  } else {
    let x = Math.random() * baseSpacing
    while (x < width) {
      const currentSpacing = baseSpacing * (0.6 + Math.random() * 0.9)
      const bandOpacity = opacity * (0.4 + Math.random() * 0.9)
      const bandWidth = baseSpacing * (0.12 + Math.random() * 0.28)

      const gradient = ctx.createLinearGradient(x, 0, x + bandWidth, 0)
      gradient.addColorStop(0, `rgba(0,0,0,0)`)
      gradient.addColorStop(softness, `rgba(0,0,0,${bandOpacity})`)
      gradient.addColorStop(1 - softness, `rgba(0,0,0,${bandOpacity})`)
      gradient.addColorStop(1, `rgba(0,0,0,0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(x, 0, bandWidth, height)
      x += currentSpacing
    }
  }

  return canvas
}
