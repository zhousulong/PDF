# 📄 PDFSCN - PDF Scan Simulator

PDFSCN is a modern, secure, and pure frontend web application that converts clean digital PDF documents into realistic-looking scanned copies. 

Everything runs directly in your web browser—your documents never leave your device, ensuring maximum security and absolute privacy.

---

## ⚡ Modernization & Key Enhancements

PDFSCN is a complete modernization of historical PDF scanning tools. Key upgrades include:
* **Modern Tech Stack**: Fully refactored to **Vue 3**, **TypeScript**, and **Vite** for blazing fast compilation and hot-module reloading.
* **"Dark Precision" Design System**: Designed a professional, industrial, and sleek interface featuring full responsive layouts and native, synchronized dark mode.
* **Dynamic SEO Integration**: Automated SEO metadata with a reactive title watcher that localized document tab titles on the fly.
* **Offline-First (PWA)**: Built-in service workers allow the simulator to run fully offline without any network connectivity.
* **Dual Rendering Engine**: Supports standard browser canvas-level rendering alongside ImageMagick-powered WebAssembly scanner pipelines for maximum flexibility.

---

## ✨ Features

* **100% Client-Side**: Zero server-side uploads or APIs. Absolute privacy.
* **Real-time Live Preview**: View original and scanned documents side-by-side.
* **Advanced Adjustments**: Fine-tune rotation angle, skew variance, brightness, contrast, noise levels, paper blur, border constraints, sepia/yellowish coloring, and more.
* **Fast Export**: Instant scanned PDF generation and local browser download.

---

## 🧑‍💻 Development

### Setup & Install
Ensure you have Node.js installed, then install dependencies:
```sh
npm install
```

### Dev Server
Run local development server:
```sh
npm run dev
```

### Production Build
Build optimized static assets to the `dist/` directory:
```sh
npm run build
```

---

## 📝 Statement & Attribution

PDFSCN is an open-source project created by building upon the excellent work of the open-source community:
* Originally adapted from the [lookscanned.io](https://github.com/lookscanned/lookscanned.io) project by [seedgou](https://github.com/seedgou) (MIT License).
* Heavily inspired by the original scanning concepts in [scanyourpdf](https://github.com/baicunko/scanyourpdf) by [baicunko](https://github.com/baicunko) (MIT License).

### Open Source Projects Used
* [ImageMagick WASM (Magica)](https://github.com/cancerberoSgx/magica) - WebAssembly port for advanced image processing.
* [PDF.js](https://github.com/mozilla/pdf.js) - PDF parsing and rendering.

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for details.
