/**
 * changelog.ts
 * 最近的版本更新记录（面板展示全部条目，最新在上）
 */

export interface ChangeEntry {
  version: string;
  date: string;
  changes: string[];
  changesEn?: string[];
}

export const CHANGELOG: ChangeEntry[] = [
  {
    version: '1.4.2',
    date: '2026-08-18',
    changes: [
      '不再转换 Word / Excel：请在软件里导出 PDF 后再盖章，分页与打印一致',
      '保留图片自动转 PDF',
    ],
    changesEn: [
      'Dropped Word / Excel conversion: export PDF from the office app so pages match print',
      'Image-to-PDF conversion is unchanged',
    ],
  },
  {
    version: '1.4.1',
    date: '2026-08-18',
    changes: [
      'Word / Excel 转 PDF 按打印页走：超过一页就翻页，不再把两页挤成一页',
      'Word 以纸张尺寸分页；Excel 按行完整落到每一页，并尊重横向/打印分页符',
    ],
    changesEn: [
      'Word/Excel convert to PDF using print pages: overflow goes to the next page instead of being squeezed onto one',
      'Word follows paper size; Excel keeps whole rows on a page and honours landscape/page breaks',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-08-18',
    changes: [
      '打开工具时先选择骑缝章 / 普通章（可同时选），确认后卡片收到左上角开关',
      '单页 PDF 自动关闭并禁用骑缝章，仅可使用普通章',
      '普通章预览里点选后可拖动印章改位置',
      '三个工具配色区分：骑缝章朱红、扫描件青绿、打印效果琥珀',
      '各工具左上角可返回首页',
    ],
    changesEn: [
      'Pick ride-seam and/or regular stamp on open; selected cards fly to the top-left switches',
      'Single-page PDFs turn off and lock ride-seam; only regular stamp is available',
      'Regular stamps can be dragged to a new position after placing them in preview',
      'Distinct accents: vermillion for stamp, teal for scan, amber for print',
      'Top-left logo on each tool goes back to the home page',
    ],
  },
  {
    version: '1.3.1',
    date: '2026-08-18',
    changes: [
      '修复 Word 转 PDF 一页被拆成多页：continuous 分节（报价单常见）不再当成新页；按 Word 分页符和原始页尺寸出 PDF',
    ],
    changesEn: [
      'Fixed Word-to-PDF turning one page into several: honour Word page breaks and native page size instead of squeezing into 794px and stretching to A4',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-08-18',
    changes: [
      '骑缝章 / 盖章支持上传 Word、Excel、图片等原始文档，浏览器内自动转为 PDF',
      '上传区展示格式来源与转换进度，旧版 .doc / .xls 给出明确提示',
      '文案与首页改为突出电子盖章、骑缝章，扫描件与打印效果降为辅助工具',
    ],
    changesEn: [
      'Seam-seal / stamp now accepts Word, Excel, and images, converted to PDF locally in the browser',
      'Uploader shows source format and conversion progress; legacy .doc / .xls get a clear hint',
      'Copy and homepage now lead with official-seal and seam-stamp; scan / print are secondary tools',
    ],
  },
  {
    version: '1.2.2',
    date: '2026-05-20',
    changes: [
      '盖章前自动将 PDF 页面统一归一化为 A4 画布：扫描件页面尺寸过大/过小时，印章比例不再失真',
      '支持按页面方向保留横向/纵向 A4，内容等比缩放居中并留白边',
      '可在高级选项中关闭“统一为 A4 画布”，保持原尺寸输出',
    ],
    changesEn: [
      'Automatically normalize PDF pages to A4 canvas before stamping: stamp proportion stays correct even when scanned pages are much larger or smaller than A4',
      'Preserves portrait/landscape A4 orientation based on page aspect; content is scaled proportionally, centered, and letterboxed',
      'Can disable "Normalize to A4 canvas" in advanced options to keep original page sizes',
    ],
  },
  {
    version: '1.2.1',
    date: '2026-05-15',
    changes: [
      '修复骑缝章处理扁形印章时宽高比被错误拉伸为圆形的问题',
    ],
    changesEn: [
      'Fixed an issue where the aspect ratio of flat stamps was incorrectly stretched into a circle during ride-seam processing',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-05-13',
    changes: [
      '多 PDF 文件同时预览：拖入多个文件后，所有页面在同一网格中显示',
      '骑缝章跨文件连续盖章：自动将所有文件页面合并计算骑缝章分组',
      '普通章按文件独立控制：每个 PDF 的每一页可单独设置盖章位置',
      '多文件时显示文件标签与全局页码，方便定位',
    ],
    changesEn: [
      'Simultaneous multi-PDF preview: all pages display in a unified grid after uploading multiple files',
      'Cross-file continuous ride-seam seal: automatically combines pages of all files to calculate groupings',
      'Independent per-file regular stamp control: stamp position can be configured separately for each page of each PDF',
      'Displays file labels and global page numbers for easy navigation when handling multiple files',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-10',
    changes: [
      '新增骑缝章方向：支持上、下、左、右四边盖章',
      '自定义模式支持同页多印章：可在同一页的任意位置放置多枚章',
      '印章预览叠加层支持移除单个印章（×按钮）',
      '处理面板新增批量下载 ZIP 功能（多文件时自动打包）',
    ],
    changesEn: [
      'New ride-seam directions: supports right, left, top, and bottom edges',
      'Custom mode supports multiple stamps per page: place multiple seals anywhere on the same page',
      'Preview overlay supports removing individual stamps (via × button)',
      'Batch download ZIP feature added in the processing panel (automatically packages multiple files)',
    ],
  },
  {
    version: '1.0.2',
    date: '2026-05-07',
    changes: [
      '修复 Retina 屏幕下 canvas 渲染模糊问题',
      '印章去白底算法优化，边缘处理更平滑',
      '添加 PDF 加密文件支持（ignoreEncryption）',
    ],
    changesEn: [
      'Fixed canvas rendering blurriness on Retina screens',
      'Optimized white-background removal algorithm for stamp images with smoother edges',
      'Added support for encrypted PDF files (ignoreEncryption)',
    ],
  },
  {
    version: '1.0.1',
    date: '2026-05-04',
    changes: [
      '修复骑缝章分组算法在奇偶数模式下的页码计算错误',
      '增加国际化支持（中 / EN 切换）',
      '主题切换：深色 / 浅色 / 跟随系统',
    ],
    changesEn: [
      'Fixed page numbering calculation errors in the ride-seam grouping algorithm under odd/even page modes',
      'Added internationalization support (ZH/EN switcher)',
      'Theme switching: Dark, Light, and System modes',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-01',
    changes: [
      '项目初始版本发布',
      '支持骑缝章（多页自动分割）与普通章两种盖章模式',
      '基于 pdf-lib 实现纯前端 PDF 处理，无需上传服务器',
      '印章图片支持去白底、透明度、旋转、正片叠底等参数',
    ],
    changesEn: [
      'Initial release of the project',
      'Supports two stamping modes: ride-seam seal (multi-page auto division) and regular stamp',
      'Pure client-side PDF processing powered by pdf-lib, no files uploaded to servers',
      'Supports stamp configurations including white removal, opacity, rotation, and multiply blend effect',
    ],
  },
];
