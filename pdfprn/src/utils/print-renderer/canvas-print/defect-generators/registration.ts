/**
 * 套色偏移效果（彩色打印机）
 * 模拟CMYK各通道对准偏差
 * offsetX, offsetY: 像素偏移量
 */
export function applyRegistrationOffset(
  ctx: OffscreenCanvasRenderingContext2D,
  image: ImageBitmap,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
): void {
  if (Math.abs(offsetX) < 0.1 && Math.abs(offsetY) < 0.1) return

  // Draw a shifted cyan/blue channel ghost
  ctx.save()
  ctx.globalAlpha = 0.4
  ctx.globalCompositeOperation = 'screen'

  // Cyan offset (simulate C plate shift)
  const tempCanvas = new OffscreenCanvas(width, height)
  const tempCtx = tempCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  tempCtx.drawImage(image, 0, 0)
  const imgData = tempCtx.getImageData(0, 0, width, height)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    // Keep only cyan component (zero out red)
    d[i] = 0  // R=0
    d[i + 1] = Math.round(d[i + 1] * 0.6)  // G retain some
    // B retain
  }
  tempCtx.putImageData(imgData, 0, 0)

  ctx.drawImage(tempCanvas, offsetX, offsetY)
  ctx.restore()
}
