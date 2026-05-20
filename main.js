// =========================================================
// PDF Tools Suite · Main Application Logic
// Handles theme synchronization, translation dictionary,
// and state management.
// =========================================================

// ── Translation Dictionary ──
const i18n = {
  zh: {
    "suite.title": "PDF 极客精密工具箱",
    "suite.subtitle": "PDF Tools Suite",
    "suite.tagline": "客户端安全处理",
    "hero.badge": "🛡️ 100% 本地运行 · 绝对隐私保障",
    "hero.title": "专为安全高效而生的 PDF 精密工具箱",
    "hero.desc": "所有 PDF 处理均完全在您的本地浏览器内完成——文档绝不上传服务器，保护机密文件不受泄漏。一次加载，离线可用。",
    
    "card.scan.title": "PDFSCN",
    "card.scan.subtitle": "PDF 扫描件模拟器",
    "card.scan.tag": "高拟真",
    "card.scan.desc": "将干净的数字化 PDF 转换成真实纸张扫描件，支持微倾斜、噪点、纸张纤维、边缘阴影及黄色复古着色调节。",
    "card.scan.feat.title": "核心特性",
    "card.scan.feat.1": "细粒度扫描参数调节（旋转、噪点、对比度、模糊）",
    "card.scan.feat.2": "双渲染引擎（浏览器 Canvas + ImageMagick WASM）",
    "card.scan.feat.3": "纯本地极速计算，无需占用网络带宽",
    "card.scan.feat.4": "离线 PWA 支持，保密局级别隐私安全",
    "card.scan.btn": "立即开启扫描",

    "card.print.title": "PDFPRN",
    "card.print.subtitle": "PDF 打印机模拟器",
    "card.print.tag": "多预设",
    "card.print.desc": "模拟真实物理打印机的常见毛病，字迹微淡、辊轮划痕、喷头堵塞条纹、套色偏移和纸张纤维化水，还原逼真打印效果。",
    "card.print.feat.title": "核心特性",
    "card.print.feat.1": "10+ 种实用打印预设（激光、省粉、喷墨、针式发票）",
    "card.print.feat.2": "引入送纸抖动（Jitter）与有机去均匀化波浪算法",
    "card.print.feat.3": "Web Worker 线程池后台并行渲染，界面流畅不卡顿",
    "card.print.feat.4": "纯前端轻量化运行，完美保障商业机密",
    "card.print.btn": "立即开启打印",

    "card.stamp.title": "PDFQFZ",
    "card.stamp.subtitle": "PDF 骑缝章与印章工具",
    "card.stamp.tag": "批量化",
    "card.stamp.desc": "专为企业和公文流转设计，自动计算加盖完美缝合的骑缝章，支持首页、尾页、多点自定义位置点选盖章，支持印章正片叠底融入背景。",
    "card.stamp.feat.title": "核心特性",
    "card.stamp.feat.1": "智能多页骑缝分割盖章算法（支持上、下、左、右）",
    "card.stamp.feat.2": "可视化 PDF 预览区，直接点击任意位置自由落章",
    "card.stamp.feat.3": "完美还原正片叠底（Multiply）混合，盖章不遮挡底字",
    "card.stamp.feat.4": "支持多文件批量处理与 ZIP 打包，大幅提升工作效率",
    "card.stamp.btn": "立即开启盖章",

    "why.title": "为什么选择纯客户端工具？",
    "why.desc": "相较于传统的在线 PDF 转换网站，我们开创了全新的本地隐私处理模式：",
    "why.feat.1.title": "绝对的隐私与文件安全",
    "why.feat.1.desc": "所有计算均由您的浏览器直接执行。您的文件从不会被上传到外部服务器。不存在服务器日志，也没有数据库，完美消除数据泄漏的可能性。",
    "why.feat.2.title": "极致性能，无需等待",
    "why.feat.2.desc": "省去了漫长的上传大文件和排队等待服务器转换的时间。直接调用您本地设备的硬件算力，大文件生成几乎可以在瞬时完成。",
    "why.feat.3.title": "完全离线运行支持",
    "why.feat.3.desc": "页面一次载入后，即使在无网环境、保密机房、或飞行模式下，工具依然可以完整流畅地提供全部核心功能。",

    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "跟随系统",
    "theme.label": "当前主题",

    "footer.desc": "© 2026 PDF Tools Suite. 本地客户端精密 PDF 效率工具。保护您的绝对隐私。 基于 MIT 开源协议分发。"
  },
  en: {
    "suite.title": "PDF Tools Suite",
    "suite.subtitle": "PDF Tools Suite",
    "suite.tagline": "Client-Side Secure",
    "hero.badge": "🛡️ 100% Client-Side · Private & Secure",
    "hero.title": "Precision PDF Suite Designed for Absolute Privacy",
    "hero.desc": "All PDF manipulations are executed locally in your web browser. No files are ever sent to servers, protecting your sensitive documents from disclosure. Load once, work offline.",
    
    "card.scan.title": "PDFSCN",
    "card.scan.subtitle": "PDF Scan Simulator",
    "card.scan.tag": "Realism",
    "card.scan.desc": "Convert digital PDFs into realistic-looking scanned copies. Fine-tune rotation angle, skew, noise, paper blur, border shadows, and vintage coloring.",
    "card.scan.feat.title": "Key Features",
    "card.scan.feat.1": "Fine-grained scanner adjustments (noise, tilt, blur, contrast)",
    "card.scan.feat.2": "Dual engines (Canvas API + ImageMagick WASM compiler)",
    "card.scan.feat.3": "Superfast local rendering without consuming network data",
    "card.scan.feat.4": "PWA support for reliable offline capability and secrecy",
    "card.scan.btn": "Open Scanner",

    "card.print.title": "PDFPRN",
    "card.print.subtitle": "PDF Printer Simulator",
    "card.print.tag": "Presets",
    "card.print.desc": "Simulate common defects of physical printers. Reproduce faded print, drum scratches, inkjet line banding, colors bleeding, and subtle paper saturation.",
    "card.print.feat.title": "Key Features",
    "card.print.feat.1": "10+ print styles (Laser, toner saving, Inkjet draft, Dot-matrix)",
    "card.print.feat.2": "Physics-based roller wave simulation and paper feed jittering",
    "card.print.feat.3": "Web Worker thread pools to ensure UI responsiveness during render",
    "card.print.feat.4": "Pure frontend utility guaranteeing commercial secret security",
    "card.print.btn": "Open Printer",

    "card.stamp.title": "PDFQFZ",
    "card.stamp.subtitle": "PDF Seal Stamper",
    "card.stamp.tag": "Batching",
    "card.stamp.desc": "Designed for corporate approval. Automatically split and attach ride-seam seals. Place regular stamps on cover/back pages, or drag-and-drop custom points with multiply blend.",
    "card.stamp.feat.title": "Key Features",
    "card.stamp.feat.1": "Advanced multi-page ride-seam seal splitting (covers 4 margins)",
    "card.stamp.feat.2": "Interactive PDF workspace; place, scale, and rotate stamps on click",
    "card.stamp.feat.3": "Multiply blend mode blending stamp ink seamlessly with page text",
    "card.stamp.feat.4": "Batch process multiple files and download them as a ZIP archive",
    "card.stamp.btn": "Open Stamper",

    "why.title": "Why Local Client-Side Tools?",
    "why.desc": "Compared with traditional online converters, we introduce a privacy-first workflow:",
    "why.feat.1.title": "Absolute Secrecy & Security",
    "why.feat.1.desc": "All computations are executed by your browser. No files are uploaded to outer servers. No logs, no databases, perfectly eliminating the risk of data leakage.",
    "why.feat.2.title": "Blazing Fast Performance",
    "why.feat.2.desc": "Skip the long upload and download times of large files. Utilizing your local hardware power directly, output generations finish almost instantly.",
    "why.feat.3.title": "Offline-First Support",
    "why.feat.3.desc": "Built with Service Workers and static assets. Once loaded, all tools remain fully functional in secure intranets or internet-free zones.",

    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "theme.label": "Theme",

    "footer.desc": "© 2026 PDF Tools Suite. Local client-side PDF utility suite. Pure privacy. Distributed under the MIT License."
  }
};

// ── App State ──
let currentLang = localStorage.getItem("lang") || "zh";
let currentTheme = (localStorage.getItem("pdf-suite-theme") || "system").trim();

// ── Theme Management ──
const themeModes = ["system", "dark", "light"];
// Theme modes icons (viewBox 0 0 16 16, stroke-width 1.5 for crisp rendering without clipping)
const themeIcons = {
  light: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: block; color: currentColor;"><circle cx="8" cy="8" r="2.8" stroke="currentColor" stroke-width="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.4 1.4M11.55 11.55l1.4 1.4M11.55 4.45l1.4-1.4M3.05 12.95l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  dark: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: block; color: currentColor;"><path d="M13.5 9.5A6.5 6.5 0 017 3a6.5 6.5 0 100 13 6.5 6.5 0 006.5-6.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  system: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: block; color: currentColor;"><rect x="1.5" y="1.5" width="13" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 14.5h7M8 11.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
};

function applyTheme(theme) {
  const root = document.documentElement;
  // Defensive validation: fallback to system if theme string is not recognized
  const validTheme = themeIcons[theme] ? theme : "system";
  
  if (validTheme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", validTheme);
  }
  
  // Render correct SVG icon
  const iconContainer = document.getElementById("theme-icon-container");
  if (iconContainer) {
    iconContainer.innerHTML = themeIcons[validTheme];
  }
  
  // Sync button labels and title
  updateThemeSwitcherLabel();
}

function updateThemeSwitcherLabel() {
  const themeLabelSpan = document.getElementById("theme-mode-label");
  if (themeLabelSpan) {
    themeLabelSpan.textContent = getTranslation(`theme.${currentTheme}`);
  }
  const themeSwitcherBtn = document.getElementById("theme-switcher");
  if (themeSwitcherBtn) {
    const currentThemeText = getTranslation(`theme.${currentTheme}`);
    themeSwitcherBtn.setAttribute("title", `${getTranslation("theme.label")}: ${currentThemeText}`);
  }
}

function setWildcardCookie(name, value) {
  // Try setting on .9ump.com wildcard domain for cross-subdomain availability
  document.cookie = `${name}=${value}; domain=.9ump.com; path=/; max-age=31536000; SameSite=Lax`;
  // Fallback for localhost and direct domain testing
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

function syncThemeToCookies(theme) {
  setWildcardCookie("pdf-suite-theme", theme);
  setWildcardCookie("pdfscan-theme", theme);
  setWildcardCookie("pdfprn-theme", theme);
  setWildcardCookie("pdfqfz-theme", theme);
}

function toggleTheme() {
  const nextIndex = (themeModes.indexOf(currentTheme) + 1) % themeModes.length;
  currentTheme = themeModes[nextIndex];
  
  // Save suite theme
  localStorage.setItem("pdf-suite-theme", currentTheme);
  
  // ── Sync to Subprojects ──
  // Write to individual subproject theme storage keys
  localStorage.setItem("pdfscan-theme", currentTheme);
  localStorage.setItem("pdfprn-theme", currentTheme);
  localStorage.setItem("pdfqfz-theme", currentTheme);
  
  // Sync to cookies for cross-subdomain support
  syncThemeToCookies(currentTheme);
  
  applyTheme(currentTheme);
}

// Listen to system changes if theme is system
const systemPrefQuery = window.matchMedia("(prefers-color-scheme: dark)");
systemPrefQuery.addEventListener("change", () => {
  if (currentTheme === "system") {
    applyTheme("system");
  }
});

// ── Language Management ──
function getTranslation(key) {
  return i18n[currentLang][key] || i18n["en"][key] || key;
}

function translatePage() {
  // Translate nodes with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = getTranslation(key);
  });
  
  // Translate labels/titles if applicable
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", getTranslation(key));
  });

  // Toggle active language button class
  const zhSpan = document.getElementById("lang-zh");
  const enSpan = document.getElementById("lang-en");
  if (zhSpan && enSpan) {
    if (currentLang === "zh") {
      zhSpan.classList.add("active");
      enSpan.classList.remove("active");
      document.documentElement.lang = "zh-CN";
    } else {
      zhSpan.classList.remove("active");
      enSpan.classList.add("active");
      document.documentElement.lang = "en";
    }
  }

  // Update theme label based on language
  updateThemeSwitcherLabel();
}

function toggleLanguage() {
  currentLang = currentLang === "zh" ? "en" : "zh";
  localStorage.setItem("lang", currentLang);
  translatePage();
}

// ── Initialize App ──
document.addEventListener("DOMContentLoaded", () => {
  // Translate
  translatePage();
  
  // Apply Theme
  applyTheme(currentTheme);
  syncThemeToCookies(currentTheme);
  
  // Event Listeners
  const themeBtn = document.getElementById("theme-switcher");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }
  
  const langBtn = document.getElementById("lang-switcher");
  if (langBtn) {
    langBtn.addEventListener("click", toggleLanguage);
  }
});
