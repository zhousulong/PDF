export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

export const CHANGELOG_ZH: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '2026-05-20',
    changes: [
      '全面重构为 Vue 3 + TypeScript + Vite 架构',
      '全新设计 “Dark Precision” 界面风格，深度融合全局暗黑模式',
      '优化 PDF 渲染与扫描模拟引擎，大幅提升本地处理速度',
      '全新设计并优化 A4 纸张页面对比预览，自动缩放适配各分辨率屏幕',
      '支持直连扫描工作台，去除无谓的营销入口主页，开箱即用'
    ]
  },
  {
    version: '1.2.0',
    date: '2025-11-12',
    changes: [
      '新增多语言支持（中文 / 英文）',
      '优化 PDF 旋转角度微调与亮度/对比度算法',
      '改进大文件 PDF 内存占用与生成效率'
    ]
  },
  {
    version: '1.0.0',
    date: '2025-06-01',
    changes: [
      '发布首个正式版本，支持基本扫描模拟效果',
      '支持纯前端本地处理，保证文件不上传，绝对安全私密'
    ]
  }
]

export const CHANGELOG_EN: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '2026-05-20',
    changes: [
      'Fully refactored layout to Vue 3 + TypeScript + Vite architecture.',
      'Introduced "Dark Precision" design system with deep global dark mode integration.',
      'Optimized PDF rendering and scan simulation engine for faster local processing.',
      'Redesigned side-by-side A4 paper comparison preview with auto-scaling layout.',
      'Directly launches scanning workbench, eliminating the marketing landing page.'
    ]
  },
  {
    version: '1.2.0',
    date: '2025-11-12',
    changes: [
      'Added multi-language support (Chinese / English).',
      'Optimized PDF rotation angle tuning, brightness, and contrast algorithms.',
      'Improved memory usage and generation efficiency for large PDF documents.'
    ]
  },
  {
    version: '1.0.0',
    date: '2025-06-01',
    changes: [
      'Initial official release featuring basic scan simulator capabilities.',
      '100% frontend local execution to guarantee document privacy without server uploads.'
    ]
  }
]
