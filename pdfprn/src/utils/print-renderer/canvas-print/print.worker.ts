import type { PrintConfig } from '../config.types'
import { printCanvas } from './print-canvas'

export interface WorkerMessage {
  page: Blob
  config: PrintConfig
  paperTexture: Blob
  pageIndex: number
}

onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { page, config, paperTexture, pageIndex } = e.data
  const canvas = new OffscreenCanvas(1000, 1000)
  try {
    await printCanvas(canvas, page, config, paperTexture, undefined, pageIndex)
  } catch (err) {
    console.error('Error during printCanvas execution inside worker:', err)
    throw err
  }
  const blob = await canvas.convertToBlob({ type: config.output_format, quality: 0.92 })
  postMessage(blob)
}
