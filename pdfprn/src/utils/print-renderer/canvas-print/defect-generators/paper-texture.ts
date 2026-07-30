/**
 * 纸张纹理效果
 * 采用高效 Canvas 像素级噪点与纤维合成，支持 100% 同步执行以规避异步 SVG 加载失败与闪烁问题
 */
export async function createPaperTextureBlob(
  strength: number,
  paperType: string,
  width: number,
  height: number
): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  if (!ctx) return new Blob()

  // 1. 初始化纯白底色
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  if (strength <= 0) {
    return canvas.convertToBlob({ type: 'image/png' })
  }

  // 2. 噪点强度配置
  const grainAmount = paperType === 'photo' ? 4 : paperType === 'coated' ? 6 : paperType === 'recycled' ? 26 : 16
  const grainStrength = strength * grainAmount

  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  // 3. 生成高斯/随机质感纸张底噪
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainStrength
    // 噪点只允许微弱偏暗/偏亮，避免破坏纸张基本白度
    const val = Math.min(255, Math.max(0, 255 + noise))
    data[i] = val
    data[i + 1] = val
    data[i + 2] = val
  }
  ctx.putImageData(imgData, 0, 0)

  // 4. 针对于“再生纸 (recycled)”绘制粗糙的暗色纤维丝
  if (paperType === 'recycled') {
    // 绘制暗褐色、灰色的细小纤维
    const colors = [
      'rgba(90, 80, 70, 0.35)',
      'rgba(120, 110, 100, 0.25)',
      'rgba(60, 60, 60, 0.2)'
    ]
    const flecksCount = Math.round(width * height * 0.00015 * strength)
    ctx.lineWidth = 1.2

    for (let k = 0; k < flecksCount; k++) {
      const sx = Math.random() * width
      const sy = Math.random() * height
      const length = 3 + Math.random() * 8
      const angle = Math.random() * Math.PI * 2
      
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      // 稍微带有一点弯曲的纤维丝
      const cx = sx + Math.cos(angle) * length * 0.5 + (Math.random() - 0.5) * 2
      const cy = sy + Math.sin(angle) * length * 0.5 + (Math.random() - 0.5) * 2
      const ex = sx + Math.cos(angle) * length
      const ey = sy + Math.sin(angle) * length
      
      ctx.quadraticCurveTo(cx, cy, ex, ey)
      ctx.stroke()
    }
  }

  return canvas.convertToBlob({ type: 'image/png' })
}
