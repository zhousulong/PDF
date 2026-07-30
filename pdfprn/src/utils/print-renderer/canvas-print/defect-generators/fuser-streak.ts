/**
 * 定影划痕效果（激光打印机专属）
 * 模拟定影辊表面物理磨损产生的垂直划痕（带有柔和边缘的暗色或亮色条纹）
 */
export function applyFuserStreak(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
): void {
  if (strength <= 0) return

  // 划痕条数
  const numStreaks = Math.max(1, Math.round(strength * 4))

  for (let i = 0; i < numStreaks; i++) {
    const x = Math.random() * width
    // 划痕宽度随强度变宽，并在高分辨率下自适应
    const streakWidth = (1.5 + Math.random() * 5) * (1 + strength * 1.5)
    // 提高不透明度，确保在缩放预览时清晰可见
    const opacity = strength * (0.18 + Math.random() * 0.35)
    
    // 90% 为黑色磨损痕，10% 为刮伤露白痕
    const isBright = Math.random() > 0.9
    const r = isBright ? 255 : 0
    const g = isBright ? 255 : 0
    const b = isBright ? 255 : 0

    // 采用左右渐变模拟刮痕边缘的羽化过渡，更加写实
    const grad = ctx.createLinearGradient(x - streakWidth / 2, 0, x + streakWidth / 2, 0)
    grad.addColorStop(0, `rgba(${r},${g},${b},0)`)
    grad.addColorStop(0.2, `rgba(${r},${g},${b},${opacity * 0.7})`)
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${opacity})`)
    grad.addColorStop(0.8, `rgba(${r},${g},${b},${opacity * 0.7})`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)

    ctx.fillStyle = grad
    ctx.fillRect(x - streakWidth / 2, 0, streakWidth, height)
  }
}
