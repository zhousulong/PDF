/**
 * stampAlgorithm.ts
 * 骑缝章分割核心算法（翻译自 C# Form1.cs subImages）
 *
 * 规则：首页占 1/3 宽度，其余页均分剩余宽度
 * 分组：当页数超过 maxfgs 时，自动将章分组处理
 */

/**
 * 分割印章图片为 n 个条形切片（对应 C# subImages）
 * @param imgBlob 印章图片 Blob
 * @param n 分割数（等于参与骑缝章的页数）
 * @returns 各切片的 Blob 数组，index 0 对应第一页（最宽），最后一个对应最后页
 */
export async function subImages(imgBlob: Blob, n: number): Promise<Blob[]> {
  const bitmap = await createImageBitmap(imgBlob);
  const W = bitmap.width;
  const H = bitmap.height;

  // 首页宽度 = 1/3
  const w1 = Math.floor(W / 3);
  // 其余页均分
  const wRest = Math.floor((W - w1) / n); // n 在 C# 原版里进入循环前已是 n-1（其余页数）

  const slices: Blob[] = [];
  let x = 0; // 当前裁切起始 x

  for (let i = 0; i < n; i++) {
    let sw: number;
    if (i === 0) {
      // 第一页（首页）：占 1/3
      sw = w1;
    } else if (i === n - 1) {
      // 最后一页：占剩余所有宽度（消除取整误差）
      sw = W - x;
    } else {
      sw = wRest;
    }

    const canvas = new OffscreenCanvas(sw, H);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, x, 0, sw, H, 0, 0, sw, H);
    slices.push(await canvas.convertToBlob({ type: 'image/png' }));
    x += sw;
  }

  return slices;
}

/**
 * 根据模式生成参与骑缝章的页码列表
 * @param totalPages PDF 总页数
 * @param mode 0=全部, 2=奇数页, 3=偶数页
 */
export function calcQfzPageList(totalPages: number, mode: 0 | 2 | 3): number[] {
  const list: number[] = [];
  if (mode === 0) {
    for (let i = 1; i <= totalPages; i++) list.push(i);
  } else if (mode === 2) {
    for (let i = 1; i <= totalPages; i += 2) list.push(i);
  } else if (mode === 3) {
    for (let i = 2; i <= totalPages; i += 2) list.push(i);
  }
  return list;
}

/**
 * 将骑缝章页码列表按最大分割数分组
 * （对应 C# PDFWatermark 中的分组逻辑）
 *
 * 分组算法（与 C# 完全一致）：
 *  ss = ceil(qfzPages / maxfgs)
 *  sy = qfzPages - ss * maxfgs / 2
 *  sys = sy / ss
 *  syy = sy % ss
 *  pp = maxfgs / 2 + sys
 *  第 i 组（i < syy）：pp+1 页，其余：pp 页
 */
export interface QfzGroup {
  pageIndices: number[]; // 实际页码（1-indexed）
  sliceCount: number;    // 本组分割数（等于 pageIndices.length）
}

export function calcQfzGroups(pageList: number[], maxfgs: number): QfzGroup[] {
  const qfzPages = pageList.length;
  if (qfzPages === 0) return [];

  const ss = Math.ceil(qfzPages / maxfgs);          // 组数
  const sy = qfzPages - Math.floor(ss * maxfgs / 2);
  const sys = Math.floor(sy / ss);
  const syy = sy % ss;
  const pp = Math.floor(maxfgs / 2) + sys;

  const groups: QfzGroup[] = [];
  let startIndex = 0;

  for (let i = 0; i < ss; i++) {
    const tmp = i < syy ? pp + 1 : pp;
    groups.push({
      pageIndices: pageList.slice(startIndex, startIndex + tmp),
      sliceCount: tmp,
    });
    startIndex += tmp;
  }

  return groups;
}
