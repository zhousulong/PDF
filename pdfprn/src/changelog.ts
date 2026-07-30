export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

export const CHANGELOG_ZH: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-05-20',
    changes: [
      'PDF 打印机模拟器 (PDFPRN) 首发版本！',
      '支持激光、喷墨、针式打印机模拟，拥有定制化的打印瑕疵引擎',
      '支持 10 种以上打印瑕疵参数配置，包括偏色、套色偏移、定影质量缺陷、喷头堵塞划痕、老旧色带等',
      '内置常用打印预设场景，如“办公室激光（旧机）”、“喷墨（堵头）”、“针式（旧色带）”等',
      '纯前端处理，文件绝不上传服务器，保证 100% 隐私安全'
    ]
  }
]

export const CHANGELOG_EN: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-05-20',
    changes: [
      'Initial release of PDF Printer Simulator (PDFPRN)!',
      'Supports Laser, Inkjet, and Dot-Matrix printer simulations with custom defect generator engine.',
      'Supports 10+ custom defect parameters including color shifts, registration offset, fuser scratches, clogged nozzle lines, and dot-matrix ribbon fading.',
      'Built-in presets such as "Office Laser (Old)", "Inkjet (Clogged)", and "Dot-Matrix (Old Ribbon)".',
      '100% local browser-side processing ensuring ultimate privacy security.'
    ]
  }
]
