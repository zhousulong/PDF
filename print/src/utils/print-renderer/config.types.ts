export const printerTypes = ['laser', 'inkjet', 'needle'] as const
export const colorModes = ['color', 'grayscale'] as const
export const paperTypes = ['plain', 'coated', 'recycled', 'photo'] as const
export const inkOutColors = ['none', 'cyan', 'magenta', 'yellow'] as const
export const bandingDirections = ['horizontal', 'vertical'] as const

export interface PrintConfig {
  // ── 基础设置 ──
  printerType: (typeof printerTypes)[number]
  colorMode: (typeof colorModes)[number]
  paperType: (typeof paperTypes)[number]
  scale: number

  // ── 颜色/灰度表现 ──
  colorShiftRed: number     // -1.0 ~ 1.0，偏红(+)/偏绿(-)
  colorShiftBlue: number    // -1.0 ~ 1.0，偏蓝(+)/偏黄(-)
  colorConsistency: number  // 0 ~ 1.0，批次颜色不一致程度
  blackDepth: number        // 0 ~ 1.0，黑色纯度（0=发灰，1=纯黑）
  grayGradation: number     // 0 ~ 1.0，灰阶断层程度（0=平滑，1=断层严重）

  // ── 墨水/碳粉 ──
  tonerDensity: number      // 0.3 ~ 1.8，整体浓度
  densityUniformity: number // 0 ~ 1.0，页内不均程度
  continuousFade: number    // 0 ~ 1.0，连续打印衰减

  // ── 清晰度 ──
  blur: number              // 0 ~ 3，整体模糊
  edgeFringe: number        // 0 ~ 1.0，边缘虚化
  thinLineBreak: number     // 0 ~ 1.0，细线断笔

  // ── 图像特效 ──
  halftone: number          // 0 ~ 1.0，半调网点（激光）
  dotGain: number           // 0 ~ 1.0，墨点扩散（喷墨）
  banding: number           // 0 ~ 1.0，条纹强度
  bandingDirection: (typeof bandingDirections)[number]

  // ── 设备状态 ──
  nozzleClog: number        // 0 ~ 1.0，喷头堵塞（喷墨）
  inkOutColor: (typeof inkOutColors)[number]
  fuserQuality: number      // 0 ~ 1.0，定影质量（激光，0=发虚）
  fuserStreak: number       // 0 ~ 1.0，定影划痕
  ghosting: number          // 0 ~ 1.0，重影强度（激光）

  // ── 针式专属 ──
  needleDotMatrix: number   // 0 ~ 1.0，点阵清晰度
  needleRibbonFade: number  // 0 ~ 1.0，色带衰减

  // ── 纸张 ──
  paperTexture: number      // 0 ~ 1.0，纸张纹理
  paperWhiteness: number    // 0.7 ~ 1.0，纸张白度

  // ── 套色偏移（彩色）──
  registrationOffsetX: number  // -3 ~ 3，px偏移
  registrationOffsetY: number  // -3 ~ 3，px偏移

  // ── 输出 ──
  output_format: 'image/png' | 'image/jpeg'
}

export const defaultConfig: PrintConfig = {
  printerType: 'laser',
  colorMode: 'color',
  paperType: 'plain',
  scale: 2,
  colorShiftRed: 0,
  colorShiftBlue: 0,
  colorConsistency: 0,
  blackDepth: 1.0,
  grayGradation: 0,
  tonerDensity: 1.0,
  densityUniformity: 0,
  continuousFade: 0,
  blur: 0,
  edgeFringe: 0,
  thinLineBreak: 0,
  halftone: 0,
  dotGain: 0,
  banding: 0,
  bandingDirection: 'horizontal',
  nozzleClog: 0,
  inkOutColor: 'none',
  fuserQuality: 1.0,
  fuserStreak: 0,
  ghosting: 0,
  needleDotMatrix: 0,
  needleRibbonFade: 0,
  paperTexture: 0,
  paperWhiteness: 1.0,
  registrationOffsetX: 0,
  registrationOffsetY: 0,
  output_format: 'image/jpeg'
}

// Preset configurations
export const presets: { name: string; nameZh: string; config: Partial<PrintConfig> }[] = [
  {
    name: 'Laser (HD Color)',
    nameZh: '激光高清彩打',
    config: {
      printerType: 'laser',
      colorMode: 'color',
      paperType: 'plain',
      tonerDensity: 1.0,
      blackDepth: 1.0,
      fuserQuality: 1.0,
      halftone: 0.15,
      paperTexture: 0.05
    }
  },
  {
    name: 'Toner Saving Mode',
    nameZh: '日常省墨/省粉模式',
    config: {
      printerType: 'laser',
      colorMode: 'grayscale',
      tonerDensity: 0.78,
      densityUniformity: 0.3,
      blackDepth: 0.88,
      continuousFade: 0.12,
      fuserQuality: 0.95
    }
  },
  {
    name: 'Minor Roller Smudges',
    nameZh: '硒鼓微脏（少许尘迹/轻微划痕）',
    config: {
      printerType: 'laser',
      colorMode: 'grayscale',
      tonerDensity: 0.95,
      fuserStreak: 0.22,
      ghosting: 0.15,
      fuserQuality: 0.9,
      paperTexture: 0.1
    }
  },
  {
    name: 'Standard Home Inkjet',
    nameZh: '家用喷墨日常打印',
    config: {
      printerType: 'inkjet',
      colorMode: 'color',
      nozzleClog: 0.12,
      banding: 0.2,
      bandingDirection: 'horizontal',
      dotGain: 0.25
    }
  },
  {
    name: 'Minor Ink Bleed',
    nameZh: '普通纸轻微化水（纸张微糙）',
    config: {
      printerType: 'inkjet',
      colorMode: 'color',
      dotGain: 0.42,
      blur: 0.28,
      paperTexture: 0.2,
      tonerDensity: 1.0
    }
  },
  {
    name: 'Typical Dot-Matrix Receipt',
    nameZh: '常见针式票据（机打发票）',
    config: {
      printerType: 'needle',
      colorMode: 'grayscale',
      needleDotMatrix: 0.45,
      needleRibbonFade: 0.25,
      blackDepth: 0.85,
      tonerDensity: 0.85,
      paperTexture: 0.15
    }
  },
  {
    name: 'Subtle Color Alignment Shift',
    nameZh: '套色微偏移（边缘彩虹重影）',
    config: {
      printerType: 'inkjet',
      colorMode: 'color',
      registrationOffsetX: 0.6,
      registrationOffsetY: -0.4,
      edgeFringe: 0.2,
      tonerDensity: 0.98
    }
  }
]
