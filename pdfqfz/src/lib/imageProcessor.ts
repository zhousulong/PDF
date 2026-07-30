/**
 * imageProcessor.ts
 * 图片处理核心算法（翻译自 C# Form1.cs）
 * - 去白底（SetWhiteToTransparent）
 * - 透明度调整（SetImageOpacity）
 * - 旋转（RotateImg）
 */

/**
 * 将图片的白色/浅色背景设为透明（对应 C# SetWhiteToTransparent）
 * threshold: 判定为白色的阈值，0-255，默认 230
 */
export async function setWhiteToTransparent(
  imgBlob: Blob,
  threshold = 230
): Promise<Blob> {
  const bitmap = await createImageBitmap(imgBlob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // 如果已完全透明，跳过
    if (data[i + 3] === 0) continue;
    // 判断是否接近白色
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0; // 设为透明
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return await canvas.convertToBlob({ type: 'image/png' });
}

/**
 * 设置图片透明度（对应 C# SetImageOpacity）
 * opacity: 0~100
 */
export async function setImageOpacity(
  imgBlob: Blob,
  opacity: number
): Promise<Blob> {
  if (opacity >= 100) return imgBlob;

  const bitmap = await createImageBitmap(imgBlob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const data = imageData.data;
  const alpha = Math.round((opacity / 100) * 255);

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) {
      // 只改非透明像素
      data[i] = Math.round((data[i] * alpha) / 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return await canvas.convertToBlob({ type: 'image/png' });
}

/**
 * 旋转图片（对应 C# RotateImg）
 * angle: 角度，正值顺时针
 * keepWidth: true=保持原宽度（切角），false=扩展画布
 */
export async function rotateImage(
  imgBlob: Blob,
  angle: number,
  keepWidth = true
): Promise<Blob> {
  if (angle === 0) return imgBlob;

  const bitmap = await createImageBitmap(imgBlob);
  const w = bitmap.width;
  const h = bitmap.height;

  const radian = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radian));
  const sin = Math.abs(Math.sin(radian));

  let W = Math.ceil(w * cos + h * sin);
  let H = Math.ceil(w * sin + h * cos);

  if (keepWidth) {
    H = Math.round((H * w) / W);
    W = w;
  }

  const canvas = new OffscreenCanvas(W, H);
  const ctx = canvas.getContext('2d')!;

  ctx.translate(W / 2, H / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(bitmap, -w / 2, -h / 2);

  return await canvas.convertToBlob({ type: 'image/png' });
}

/**
 * 综合处理印章图片：去白底 + 旋转 + 透明度
 */
export async function processStampImage(
  imgBlob: Blob,
  options: {
    removeWhite?: boolean;
    whiteThreshold?: number;
    rotation?: number;
    opacity?: number;
  }
): Promise<Blob> {
  let result = imgBlob;

  if (options.removeWhite) {
    result = await setWhiteToTransparent(result, options.whiteThreshold ?? 230);
  }
  if (options.rotation && options.rotation !== 0) {
    result = await rotateImage(result, options.rotation);
  }
  if (options.opacity !== undefined && options.opacity < 100) {
    result = await setImageOpacity(result, options.opacity);
  }

  return result;
}

/**
 * 将 Blob 转为 ArrayBuffer
 */
export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}
