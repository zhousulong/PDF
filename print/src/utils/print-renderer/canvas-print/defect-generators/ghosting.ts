/**
 * 重影效果（激光打印机专属）
 * 模拟定影辊残留导致的前页图像残影
 * strength: 0~1
 */
export function applyGhosting(
  ctx: OffscreenCanvasRenderingContext2D,
  image: ImageBitmap,
  width: number,
  height: number,
  strength: number
): void {
  if (strength <= 0) return

  // Ghost offset = fuser roller circumference (~80px at typical scale)
  const offsetY = Math.round(80 + Math.random() * 30)
  const ghostOpacity = strength * 0.15

  ctx.save()
  ctx.globalAlpha = ghostOpacity
  ctx.filter = 'grayscale(0.8) brightness(1.8)'
  // Draw shifted ghost image
  ctx.drawImage(image, 0, offsetY, width, height - offsetY)
  ctx.restore()
}
