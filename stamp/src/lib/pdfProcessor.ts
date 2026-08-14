/**
 * pdfProcessor.ts
 * PDF 盖章核心逻辑，使用 pdf-lib 写入印章
 *
 * 坐标系：
 *   - pdf-lib 使用 pt（1pt = 1/72 inch），Y轴从底部向上
 *   - 位置参数使用比例（0~1），由此换算绝对坐标
 */

import { PDFDocument, degrees, BlendMode } from 'pdf-lib';
import { subImages, calcQfzPageList, calcQfzGroups } from './stampAlgorithm';

export interface QfzConfig {
  enabled: boolean;
  mode: 0 | 2 | 3;       // 0=全部, 2=奇数, 3=偶数
  side: 'right' | 'left' | 'top' | 'bottom'; // 骑缝章位置
  verticalPos: number;    // 纵向位置 0~100
  maxfgs: number;         // 最大分割数
  sizeMm: number;         // 印章大小（长边，mm）
  opacity: number;        // 透明度 0~100
  removeWhite: boolean;
  whiteThreshold: number;
  multiply: boolean;
}

export interface YzConfig {
  enabled: boolean;
  pages: 'first' | 'last' | 'all' | 'custom'; // 盖章页面
  // customPositions: fileId -> pageNum(1-indexed) -> positions[]
  customPositions: Record<string, Record<number, Array<{ posX: number, posY: number }>>>;
  sizeMm: number;         // 印章宽度（mm）
  rotation: number;       // 旋转角度
  opacity: number;        // 透明度 0~100
  posX: number;           // X 轴比例 0~1（用于 first/last/all）
  posY: number;           // Y 轴比例 0~1（用于 first/last/all）
  removeWhite: boolean;
  whiteThreshold: number;
  random: boolean;        // 随机偏移
  multiply: boolean;
}

export interface ProcessResult {
  name: string;
  blob: Blob;
  success: true;
}

export interface ProcessError {
  name: string;
  success: false;
  error: string;
}

// 1mm = 2.8346 pt (at 72 dpi)
const MM_TO_PT = 72 / 25.4;

// A4 尺寸（pt，1pt = 1/72 inch）
export const A4_WIDTH_PT = 210 * MM_TO_PT;   // 595.28
export const A4_HEIGHT_PT = 297 * MM_TO_PT;  // 841.89

function randomOffset(): number {
  return (Math.random() * 4 - 2) / 100; // ±2%
}

/**
 * 将 PDF 每一页归一化为 A4 尺寸（盖章前调用）。
 *
 * 背景：扫描生成的 PDF 页面物理尺寸（MediaBox）可能远大于或远小于 A4，
 * 而印章大小按 mm（sizeMm）计算、预览按 A4 (210×297mm) 假设。
 * 若页面不是 A4，同一枚章在页面上会显得过小或过大。
 *
 * 处理方式（每页独立）：
 *   1. 按页面宽高比选择目标画布：横向页面 → A4 横向，纵向页面 → A4 纵向；
 *   2. 内容等比缩放（不拉伸变形），fit 进 A4 画布；
 *   3. 水平/垂直居中，剩余区域留白边。
 *
 * 已经（接近）A4 的页面保持不变，此时直接返回原字节，避免无意义重存。
 */
export async function normalizeToA4(pdfBytes: ArrayBuffer | Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  const TOLERANCE = 0.5; // pt，允许的尺寸容差
  let changed = false;

  for (const page of pages) {
    const { width: w, height: h } = page.getSize();

    // 按页面方向选择 A4 画布（横向页面保持横向）
    const landscape = w > h;
    const targetW = landscape ? A4_HEIGHT_PT : A4_WIDTH_PT;
    const targetH = landscape ? A4_WIDTH_PT : A4_HEIGHT_PT;

    // 已是目标 A4 尺寸（含容差）→ 跳过
    if (Math.abs(w - targetW) < TOLERANCE && Math.abs(h - targetH) < TOLERANCE) {
      continue;
    }

    // 等比缩放 fit 进 A4 画布
    const scale = Math.min(targetW / w, targetH / h);
    const newW = w * scale;
    const newH = h * scale;
    // 居中偏移（相对页面左下角，pdf-lib 坐标系 Y 向上）
    const offsetX = (targetW - newW) / 2;
    const offsetY = (targetH - newH) / 2;

    // setSize 保持 MediaBox 原点不变，scale/translate 均相对左下角 → 逻辑自洽
    page.setSize(targetW, targetH);
    page.scaleContent(scale, scale);      // 先缩放（相对左下角）
    page.translateContent(offsetX, offsetY); // 再平移到居中位置

    changed = true;
  }

  if (!changed) {
    return pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes);
  }
  return await pdfDoc.save();
}

/**
 * 骑缝章处理
 */
export async function addQfzStamp(
  pdfBytes: ArrayBuffer | Uint8Array,
  stampBlob: Blob,
  config: QfzConfig,
  _password?: string,
  onProgress?: (page: number, total: number) => void
): Promise<Uint8Array> {
  // pdf-lib does not support decryption; load without password option
  // For encrypted PDFs, we pass the raw bytes and let it try
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  if (totalPages < 2) {
    throw new Error('single_page_qfz');
  }

  // 预处理印章（去白底，修改透明度）
  const { processStampImage, rotateImage } = await import('./imageProcessor');
  const processedBlob = await processStampImage(stampBlob, {
    removeWhite: config.removeWhite,
    whiteThreshold: config.whiteThreshold,
    opacity: config.opacity,
  });

  // 读取原始印章尺寸，用于后续保持正确宽高比
  const origBitmap = await createImageBitmap(processedBlob);
  const origStampW = origBitmap.width;
  origBitmap.close();

  // 计算参与页面列表
  const pageList = calcQfzPageList(totalPages, config.mode);
  if (pageList.length < 2) {
    throw new Error('single_page_qfz');
  }

  const groups = calcQfzGroups(pageList, config.maxfgs);
  let processedCount = 0;

  for (const group of groups) {
    const slices = await subImages(processedBlob, group.sliceCount);

    for (let idx = 0; idx < group.pageIndices.length; idx++) {
      const pageNo = group.pageIndices[idx]; // 1-indexed
      const page = pages[pageNo - 1];
      const { width: pW, height: pH } = page.getSize();

      // 如果是顶部/底部需要旋转切片 90 度
      let slice = slices[idx];
      if (config.side === 'top' || config.side === 'bottom') {
        slice = await rotateImage(slice, 90, false);
      }

      const sliceBytes = await slice.arrayBuffer();
      const img = await pdfDoc.embedPng(new Uint8Array(sliceBytes));

      // 计算尺寸：sizeMm 与普通章一致，表示整体印章的总宽度（mm）
      // ptPerPx = 每像素对应的 pt 数，基于原始印章总宽度统一计算
      // 这样扁章的宽高比得到正确保留，与普通章行为一致
      const basePt = config.sizeMm * MM_TO_PT;
      const ptPerPx = basePt / origStampW; // 统一缩放系数

      // 对 right/left：img.width=切片宽, img.height=原始印章高（未旋转）
      // 对 top/bottom：已旋转90°，img.width=原始印章高, img.height=切片宽
      // 两种情况用同一公式均正确
      const scaleW = img.width * ptPerPx;
      const scaleH = img.height * ptPerPx;

      let xPos: number, yPos: number; // pdf-lib 坐标（左下角为原点）
      const vertFrac = config.verticalPos / 100; // 纵/横向比例

      if (config.side === 'right') {
        xPos = pW - scaleW;
        yPos = pH - scaleH - (pH - scaleH) * vertFrac;
      } else if (config.side === 'left') {
        xPos = 0;
        yPos = pH - scaleH - (pH - scaleH) * vertFrac;
      } else if (config.side === 'top') {
        // 顶部：横向骑缝章
        xPos = (pW - scaleW) * vertFrac;
        yPos = pH - scaleH;
      } else {
        // 底部
        xPos = (pW - scaleW) * vertFrac;
        yPos = 0;
      }

      page.drawImage(img, {
        x: xPos,
        y: yPos,
        width: scaleW,
        height: scaleH,
        blendMode: config.multiply ? BlendMode.Multiply : BlendMode.Normal,
      });

      processedCount++;
      onProgress?.(processedCount, pageList.length);
    }
  }

  return await pdfDoc.save();
}

/**
 * 普通章处理
 * @param fileId 当前文件的 id，用于从 customPositions 中取对应文件的位置
 */
export async function addNormalStamp(
  pdfBytes: ArrayBuffer | Uint8Array,
  stampBlob: Blob,
  config: YzConfig,
  fileId: string,
  _password?: string,
  onProgress?: (page: number, total: number) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  // 处理印章图片
  const { processStampImage } = await import('./imageProcessor');
  const processedBlob = await processStampImage(stampBlob, {
    removeWhite: config.removeWhite,
    whiteThreshold: config.whiteThreshold,
    rotation: config.rotation,
    opacity: config.opacity,
  });

  const stampBytes = await processedBlob.arrayBuffer();

  // 嵌入印章（尝试 PNG，失败则 JPEG）
  let stampImg;
  try {
    stampImg = await pdfDoc.embedPng(new Uint8Array(stampBytes));
  } catch {
    stampImg = await pdfDoc.embedJpg(new Uint8Array(stampBytes));
  }

  // 计算印章尺寸（mm → pt）
  const stampWidthPt = config.sizeMm * MM_TO_PT;
  const stampAspect = stampImg.height / stampImg.width;
  const stampHeightPt = stampWidthPt * stampAspect;

  // 确定盖章列表 [{ pageNo, posX, posY }]
  let targets: { pageNo: number; posX: number; posY: number }[] = [];

  if (config.pages === 'custom') {
    // 自定义模式下，读取当前文件的 customPositions
    const filePosMap = config.customPositions[fileId] ?? {};
    for (const [pageStr, posArr] of Object.entries(filePosMap)) {
      const pageNo = parseInt(pageStr, 10);
      if (pageNo >= 1 && pageNo <= totalPages) {
        for (const pos of posArr) {
          targets.push({ pageNo, posX: pos.posX, posY: pos.posY });
        }
      }
    }
  } else {
    // 其他模式，使用全局 posX / posY
    let pageNums: number[] = [];
    if (config.pages === 'first') {
      pageNums = [1];
    } else if (config.pages === 'last') {
      pageNums = [totalPages];
    } else {
      pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    targets = pageNums.map(pageNo => ({ pageNo, posX: config.posX, posY: config.posY }));
  }

  for (let i = 0; i < targets.length; i++) {
    const { pageNo, posX: basePosX, posY: basePosY } = targets[i];
    const page = pages[pageNo - 1];
    const { width: pW, height: pH } = page.getSize();

    let posX = basePosX;
    let posY = basePosY;

    if (config.random) {
      posX = Math.min(1, Math.max(0, posX + randomOffset()));
      posY = Math.min(1, Math.max(0, posY + randomOffset()));
    }

    // posY: 0=顶部，1=底部 → pdf-lib Y 轴翻转（0=底部，1=顶部）
    const xPos = pW * posX - stampWidthPt / 2;
    const yPos = pH * (1 - posY) - stampHeightPt / 2;

    page.drawImage(stampImg, {
      x: xPos,
      y: yPos,
      width: stampWidthPt,
      height: stampHeightPt,
      rotate: degrees(-config.rotation),
      opacity: config.opacity / 100,
      blendMode: config.multiply ? BlendMode.Multiply : BlendMode.Normal,
    });

    onProgress?.(i + 1, targets.length);
  }

  return await pdfDoc.save();
}
