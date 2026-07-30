# PDFQFZ · 专业 PDF 骑缝章与印章工具

PDFQFZ 是一款纯客户端运行的高性能 PDF 盖章工具。专为工业级办公需求设计，支持复杂的骑缝章算法与多点自定义盖章。

[English Description below]

## ✨ 核心特性

- 🛡️ **隐私至上**：所有 PDF 处理均在浏览器本地完成，**文件永不上传服务器**，确保您的数据安全。
- 📐 **骑缝章 (QFZ)**：
  - 自动根据页面数量与印章尺寸计算切割比例。
  - 支持多页连续骑缝预览与生成。
- 🎨 **普通印章 (YZ)**：
  - 支持首页、尾页、全页自动盖章。
  - **自定义模式**：支持在单页上点击添加多个印章，灵活控制位置。
  - **正片叠底 (Multiply)**：支持印章与文档内容融合，模拟真实盖章效果。
- 🖥️ **工业级交互**：
  - 高分辨率预览（适配 Retina 屏幕，3x 高清渲染）。
  - 精准坐标计算，确保预览与生成结果 100% 一致。
- 🌓 **智能主题**：完美适配系统深色/浅色模式，支持手动切换。
- 📱 **极致兼容**：针对 **微信桌面版**、360 浏览器等特殊内核深度优化，确保在各种环境下稳定运行。
- 🌍 **多语言支持**：内置中英文（ZH/EN）双语界面。

## 🚀 技术栈

- **框架**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **PDF 处理**: [pdf-lib](https://pdf-lib.js.org/) & [pdfjs-dist](https://mozilla.github.io/pdf.js/) (v3.11.174 Optimized)
- **语言**: TypeScript
- **部署**: Cloudflare Pages / Workers

## 📦 快速开始

1. **安装依赖**:
   ```bash
   npm install
   ```
2. **本地开发**:
   ```bash
   npm run dev
   ```
3. **构建生产版本**:
   ```bash
   npm run build
   ```

---

# PDFQFZ · Professional PDF Seal & Stamper

PDFQFZ is a high-performance, client-side PDF stamping utility. Designed for professional workflows, it supports advanced ride-seam seal algorithms and custom multi-point stamping.

## ✨ Key Features

- 🛡️ **Privacy First**: All processing happens locally in your browser. **Files are never uploaded to any server**.
- 📐 **Ride-seam Seal (QFZ)**:
  - Automatic split rendering based on page count and seal dimensions.
  - Continuous multi-page preview and generation.
- 🎨 **Regular Stamps (YZ)**:
  - Auto-stamping for first, last, or all pages.
  - **Custom Mode**: Click to place multiple stamps on any page.
  - **Multiply Blend Mode**: Realistic blending of stamps with PDF content.
- 🖥️ **Industrial UX**:
  - High-res preview (3x scaling for Retina displays).
  - Accurate coordinate system for WYSIWYG results.
- 🌓 **Smart Theme**: Seamlessly follows system Dark/Light preferences.
- 📱 **Robust Compatibility**: Optimized for **WeChat Desktop**, internal browsers, and mobile environments.

## ⚖️ License

[MIT License](LICENSE)
