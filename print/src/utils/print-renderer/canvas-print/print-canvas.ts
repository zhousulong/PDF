import type { PrintConfig } from '../config.types'
import { applyColorShift } from './defect-generators/color-shift'
import { applyTonerDensity } from './defect-generators/toner-density'
import { applyHalftone } from './defect-generators/halftone'
import { applyDotGain } from './defect-generators/dot-gain'
import { applyNeedleMatrix } from './defect-generators/needle-matrix'
import { createBandingOverlay } from './defect-generators/banding'
import { applyGhosting } from './defect-generators/ghosting'
import { applyFuserStreak } from './defect-generators/fuser-streak'
import { applyRegistrationOffset } from './defect-generators/registration'

export async function printCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  page: Blob,
  config: PrintConfig,
  paperTextureBlob: Blob,
  signal?: AbortSignal,
  pageIndex: number = 0
): Promise<void> {
  if (signal?.aborted) throw new Error('Aborted')

  const imgPromise = createImageBitmap(page)
  const texturePromise = paperTextureBlob.size > 1000
    ? createImageBitmap(paperTextureBlob)
    : null

  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
  if (!ctx) throw new Error('Canvas not supported')

  const img = await imgPromise
  if (signal?.aborted) throw new Error('Aborted')

  const width = img.width
  const height = img.height
  canvas.width = width
  canvas.height = height

  // Fill white background (paper color)
  const whiteness = config.paperWhiteness
  const paperColor = Math.round(whiteness * 255)
  ctx.fillStyle = `rgb(${paperColor}, ${paperColor - 2}, ${Math.round(paperColor * 0.97)})`
  ctx.fillRect(0, 0, width, height)

  // --- Base image rendering ---
  let filterStr = ''

  // Grayscale
  if (config.colorMode === 'grayscale') {
    filterStr += 'grayscale(1) '
  }

  // Blur (clarity)
  if (config.blur > 0) {
    filterStr += `blur(${config.blur}px) `
  }

  // Fuser quality: low quality = blurry text (laser)
  if (config.printerType === 'laser' && config.fuserQuality < 1.0) {
    const fuserBlur = (1 - config.fuserQuality) * 1.5
    filterStr += `blur(${fuserBlur}px) `
  }

  // Edge fringe (slight blur for color text edges)
  if (config.edgeFringe > 0 && config.colorMode === 'color') {
    filterStr += `blur(${config.edgeFringe * 0.8}px) `
  }

  // Continuous fade: pages printed later are lighter
  const fadeBrightness = 1 + config.continuousFade * 0.3 * pageIndex
  if (fadeBrightness !== 1) {
    filterStr += `brightness(${fadeBrightness}) `
  }

  if (filterStr) ctx.filter = filterStr.trim()

  // Ghosting effect (before main image, behind)
  if (config.printerType === 'laser' && config.ghosting > 0) {
    applyGhosting(ctx as OffscreenCanvasRenderingContext2D, img, width, height, config.ghosting)
  }

  // Draw main image
  ctx.globalAlpha = 1
  ctx.drawImage(img, 0, 0)
  ctx.filter = 'none'

  // Registration offset (color CMYK misalignment)
  if (config.colorMode === 'color' &&
    (Math.abs(config.registrationOffsetX) > 0.1 || Math.abs(config.registrationOffsetY) > 0.1)) {
    applyRegistrationOffset(
      ctx as OffscreenCanvasRenderingContext2D,
      img, width, height,
      config.registrationOffsetX,
      config.registrationOffsetY
    )
  }

  // --- Pixel-level effects ---
  const imageData = (ctx as OffscreenCanvasRenderingContext2D).getImageData(0, 0, width, height)

  // 1. Toner density & uniformity
  applyTonerDensity(
    imageData,
    config.tonerDensity,
    config.densityUniformity,
    config.blackDepth,
    config.colorMode === 'grayscale'
  )

  // 2. Color shift (only for color mode)
  if (config.colorMode === 'color') {
    applyColorShift(imageData, config.colorShiftRed, config.colorShiftBlue, config.inkOutColor)
  }

  // 3. Halftone (laser only)
  if (config.printerType === 'laser' && config.halftone > 0) {
    applyHalftone(imageData, config.halftone)
  }

  // 4. Dot gain (inkjet only)
  if (config.printerType === 'inkjet' && config.dotGain > 0) {
    applyDotGain(imageData, config.dotGain)
  }

  // 5. Needle matrix (needle only)
  if (config.printerType === 'needle') {
    applyNeedleMatrix(imageData, config.needleDotMatrix, config.needleRibbonFade)
  }

  ;(ctx as OffscreenCanvasRenderingContext2D).putImageData(imageData, 0, 0)

  // --- Overlay effects ---

  // Banding stripes
  if (config.banding > 0) {
    const bandingCanvas = createBandingOverlay(
      width, height, config.banding,
      config.bandingDirection, config.printerType
    )
    ctx.drawImage(bandingCanvas as any, 0, 0)
  }

  // Nozzle clog (inkjet): horizontal white lines
  if (config.printerType === 'inkjet' && config.nozzleClog > 0) {
    const clogOpacity = config.nozzleClog * 0.6
    const lineSpacing = Math.max(4, Math.round(8 / config.nozzleClog))
    for (let y = 0; y < height; y += lineSpacing) {
      if (Math.random() < config.nozzleClog * 0.3) {
        ctx.fillStyle = `rgba(255,255,255,${clogOpacity})`
        ctx.fillRect(0, y, width, 1 + Math.random() * 2)
      }
    }
  }

  // Fuser streaks (laser)
  if (config.printerType === 'laser' && config.fuserStreak > 0) {
    applyFuserStreak(ctx as OffscreenCanvasRenderingContext2D, width, height, config.fuserStreak)
  }

  // Paper texture overlay
  if (texturePromise) {
    const textureImg = await texturePromise
    ctx.globalAlpha = config.paperTexture * 0.4
    ctx.globalCompositeOperation = 'multiply'
    ctx.drawImage(textureImg, 0, 0, width, height)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }
}
