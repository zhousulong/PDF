export const settings = {
  settings: '打印设置',
  scale: '分辨率 (DPI)',
  blur: '整体模糊度',
  tonerDensity: '整体浓度 (碳粉/墨水)',
  densityUniformity: '页内浓度不均',
  continuousFade: '连续打印衰减 (越打越淡)',
  edgeFringe: '边缘虚化 (彩色边缘)',
  halftone: '半调网点强度',
  dotGain: '墨点扩散 (纸张吸墨晕染)',
  banding: {
    label: '条纹/色带强度',
    direction: '条纹方向',
    horizontal: '水平条纹',
    vertical: '垂直条纹'
  },
  nozzleClog: '喷头堵塞 (白线划痕)',
  inkOutColor: {
    label: '某色墨水耗尽',
    none: '无 (四色正常)',
    cyan: '缺青墨 (C)',
    magenta: '缺品红 (M)',
    yellow: '缺黄墨 (Y)'
  },
  laserStatus: {
    title: '定影状态 (激光打印)',
    fuserQuality: '定影质量 (低质量致文字发虚)',
    fuserStreak: '定影划痕'
  },
  ghosting: '定影辊重影 (前页残影)',
  needle: {
    title: '针式打印专属',
    dotMatrix: '点阵清晰度',
    ribbonFade: '色带衰减 (老旧色带发灰)'
  },
  paperType: {
    label: '纸张类型',
    plain: '普通复印纸',
    coated: '铜版纸',
    recycled: '再生纸',
    photo: '相片纸'
  },
  paperTexture: '纸张纹理强度',
  colorspace: {
    label: '颜色模式',
    colorful: '彩色打印',
    grayscale: '黑白打印'
  },
  colorShift: {
    title: '颜色表现 (彩色偏色)',
    redGreen: '偏红 (+) / 偏绿 (-)',
    blueYellow: '偏蓝 (+) / 偏黄 (-)'
  },
  registration: {
    title: 'CMYK 套色偏移',
    offsetX: '水平偏移 (px)',
    offsetY: '垂直偏移 (px)'
  },
  printerType: {
    laser: '激光打印机',
    laserDesc: '模拟定影划痕、重影及半调网点等特点',
    inkjet: '喷墨打印机',
    inkjetDesc: '模拟墨点扩散、喷头堵塞白线及颜色偏色',
    needle: '针式打印机',
    needleDesc: '模拟复古的九针/二十四针点阵及色带老化效果'
  },
  presets: {
    label: '预设打印场景'
  },
  pdfSelectLabel: '选择 PDF 文件',
  pdfNoSelectMessage: '尚未选择 PDF 文件'
}
