<template>
  <div class="home-layout">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b7cfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-name">PDF小工具箱</span>
          <span class="logo-sub">www.9ump.com</span>
        </div>
      </div>
      <div class="header-center">
        <span class="tagline">100% 浏览器本地计算 · 零上传 · 免费无水印</span>
      </div>
      <div class="header-right">
        <span class="privacy-badge">🛡️ 物理级隐私安全</span>
      </div>
    </header>

    <main class="main-content">
      <!-- ── Hero Banner ── -->
      <section class="hero animate-fade-in">
        <div class="privacy-badge-hero">
          <span class="badge-icon">🛡️</span>
          <span>物理级隐私安全 · 文件绝不上传到任何服务器 · 100% 本地渲染</span>
        </div>
        <h1 class="hero-title">免费在线 PDF 工具箱 (扫描件 / 打印效果 / 电子骑缝章)</h1>
        <p class="hero-desc">
          专为公文流转、合同盖章与文档质感转换打造。无需连接打印机或扫描仪、无需排队上传大文件，所有转换均在您的本地浏览器内高速完成。
        </p>
      </section>

      <!-- ── Tools Cards Grid ── -->
      <section class="tools-grid">
        <!-- Card 1: PDF转扫描件生成器 -->
        <div class="tool-card card-scan">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="5" width="16" height="14" rx="2"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="#5b7cfa" stroke-width="2" class="scanner-beam"/>
                <line x1="8" y1="9" x2="16" y2="9" opacity="0.4"/>
                <line x1="8" y1="15" x2="12" y2="15" opacity="0.4"/>
              </svg>
            </div>
            <div class="card-title-group">
              <div class="card-title-row">
                <h2 class="card-title">PDF 转扫描件生成器</h2>
                <span class="card-tag">Lookscanned最佳替代</span>
              </div>
              <span class="card-sub">PDF 一键变成逼真纸质扫描件</span>
            </div>
          </div>
          <p class="card-desc">
            将干净的电子版 PDF 转为包含偏角倾斜、黑白噪点、对比度调效及复古纸张纹理的纸质扫描效果件。
          </p>
          <ul class="card-features">
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>角度旋转、黑白噪点、对比度与模糊度自由调校</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>左右双视图 A4 纸张自适应对比预览</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>无需硬件扫描仪，文件不离电脑，绝对私密</span>
            </li>
          </ul>
          <RouterLink to="/pdfscn" class="card-btn">
            <span>在线生成 PDF 扫描件</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.667 2.333L9.334 7 4.667 11.667" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>

        <!-- Card 2: PDF 打印效果模拟器 -->
        <div class="tool-card card-print">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <path d="M6 9V3h12v6"/>
                <rect x="6" y="14" width="12" height="8" rx="1" fill="rgba(255,255,255,0.1)"/>
              </svg>
            </div>
            <div class="card-title-group">
              <div class="card-title-row">
                <h2 class="card-title">PDF 打印效果模拟器</h2>
                <span class="card-tag">复印件质感</span>
              </div>
              <span class="card-sub">模拟真实打印机与发票瑕疵</span>
            </div>
          </div>
          <p class="card-desc">
            模拟真实打印机与复印效果，包含激光打印发虚、家用喷墨晕染、草稿模式及针式发票点阵瑕疵。
          </p>
          <ul class="card-features">
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>10+ 种实用打印机与纸张场景预设</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>模拟送纸抖动、辊轮划痕条纹与墨水晕染</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>后台 Web Worker 并行渲染，大文件秒级导出</span>
            </li>
          </ul>
          <RouterLink to="/pdfprn" class="card-btn">
            <span>在线生成 PDF 打印效果</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.667 2.333L9.334 7 4.667 11.667" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>

        <!-- Card 3: PDF 电子骑缝章与盖章 -->
        <div class="tool-card card-stamp">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="11" r="5" stroke-width="1.6"/>
                <path d="M12 6V3H9m6 0h-3"/>
                <path d="M4 21h16" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-title-group">
              <div class="card-title-row">
                <h2 class="card-title">PDF 在线骑缝章与电子盖章</h2>
                <span class="card-tag">合同公文必备</span>
              </div>
              <span class="card-sub">多页智能分割与正片叠底</span>
            </div>
          </div>
          <p class="card-desc">
            专为公文与合同流转设计，智能将公章图片按多页精确分割加盖电子骑缝章，完美支持正片叠底。
          </p>
          <ul class="card-features">
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>智能多页骑缝章分割算法（支持左右上下四向）</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>支持正片叠底 (Multiply) 物理墨迹混合，盖章不掩盖文字</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>支持单页落章与多文件批量处理，并导出 ZIP 包</span>
            </li>
          </ul>
          <RouterLink to="/pdfqfz" class="card-btn">
            <span>在线加盖电子骑缝章</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.667 2.333L9.334 7 4.667 11.667" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>
      </section>

      <!-- ── Section: Advantages ── -->
      <section class="features-section">
        <div class="section-header">
          <h2 class="section-title">为什么大家都在用纯本地计算的 PDF 工具箱？</h2>
          <p class="section-desc">对比传统需要将公密文件上传到第三方服务器的在线网站：</p>
        </div>
        <div class="features-box-grid">
          <div class="feature-box">
            <div class="feature-box-icon">🛡️</div>
            <h3 class="feature-box-title">物理级隐私安全 (零上传)</h3>
            <p class="feature-box-desc">
              合同与保密文件从不离开您的本地设备。在浏览器 WebAssembly / JS 内存中直接渲染，杜绝商业信息泄露。
            </p>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon">⚡</div>
            <h3 class="feature-box-title">不用排队上传，导出更快</h3>
            <p class="feature-box-desc">
              省去上传几万 KB 文件的网络传输瓶颈，直接调用您电脑的 CPU / GPU 芯片渲染，文件处理几乎瞬时完成。
            </p>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon">💧</div>
            <h3 class="feature-box-title">免费且无任何强制水印</h3>
            <p class="feature-box-desc">
              导出的 PDF 保持高清矢量质感，无任何强制商业水印或付费导出限制，真正开箱即用。
            </p>
          </div>
        </div>
      </section>

      <!-- ── Section: FAQ Section (Chinese SEO Impact) ── -->
      <section class="faq-section">
        <div class="section-header">
          <h2 class="section-title">常见问题解答 (FAQ)</h2>
        </div>
        <div class="faq-grid">
          <div class="faq-card">
            <h3 class="faq-q">Q: 如何把清晰的电子 PDF 做成逼真的纸质扫描件？</h3>
            <p class="faq-a">答：使用本站的“PDF转扫描件”功能，上传您的 PDF 后，可以自由调节倾斜角度、黑白噪点和对比度，几秒钟即可导出带有逼真复印扫描质感的新 PDF 文件。</p>
          </div>
          <div class="faq-card">
            <h3 class="faq-q">Q: 在线的电子骑缝章是如何加盖到多页合同上的？</h3>
            <p class="faq-a">答：在“电子骑缝章”工具中上传公章图片与 PDF 合同，系统会自动将印章等分切割并准确加盖到多页 PDF 的边缘，支持正片叠底，盖章自然逼真。</p>
          </div>
          <div class="faq-card">
            <h3 class="faq-q">Q: 文件真的不会被偷偷上传吗？无网能用吗？</h3>
            <p class="faq-a">答：是的！您可以断开电脑网络后再尝试使用，功能完全不受影响。所有代码均在您的本地浏览器中运行。</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <p>© 2026 PDF小工具箱 (www.9ump.com) · 100% 浏览器本地计算 · 零文件上传</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg, #0a0a0c);
  color: var(--color-text, #e8e8f0);
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: rgba(17, 17, 22, 0.85);
  border-bottom: 1px solid var(--color-border, #2a2a38);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(91, 124, 250, 0.12);
  border: 1px solid rgba(91, 124, 250, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text, #e8e8f0);
  display: block;
}

.logo-sub {
  font-size: 11px;
  color: var(--color-text-muted, #9898b0);
}

.tagline {
  font-size: 13px;
  color: var(--color-text-muted, #9898b0);
}

.privacy-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 14px;
  background: rgba(91, 124, 250, 0.1);
  border: 1px solid rgba(91, 124, 250, 0.25);
  color: #5b7cfa;
  font-weight: 600;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 60px;
  width: 100%;
}

.hero {
  text-align: center;
  margin-bottom: 56px;
}

.privacy-badge-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(91, 124, 250, 0.1);
  border: 1px solid rgba(91, 124, 250, 0.25);
  color: #5b7cfa;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text, #e8e8f0);
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  line-height: 1.25;
}

.hero-desc {
  font-size: 15px;
  color: var(--color-text-muted, #9898b0);
  max-width: 780px;
  margin: 0 auto;
  line-height: 1.6;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.tool-card {
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: #5b7cfa;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(91, 124, 250, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5b7cfa;
  flex-shrink: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text, #e8e8f0);
}

.card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(91, 124, 250, 0.2);
  color: #5b7cfa;
  font-weight: 600;
}

.card-sub {
  font-size: 12px;
  color: var(--color-text-muted, #9898b0);
}

.card-desc {
  font-size: 14px;
  color: var(--color-text-muted, #9898b0);
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text, #e8e8f0);
}

.card-features li svg {
  color: #5b7cfa;
  flex-shrink: 0;
}

.card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  background: #5b7cfa;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.card-btn:hover {
  background: #4a6be8;
}

.features-section, .faq-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid var(--color-border, #2a2a38);
}

.section-header {
  text-align: center;
  margin-bottom: 36px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text, #e8e8f0);
  margin-bottom: 10px;
}

.section-desc {
  font-size: 14px;
  color: var(--color-text-muted, #9898b0);
}

.features-box-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-box {
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: 14px;
  padding: 24px;
}

.feature-box-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.feature-box-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text, #e8e8f0);
  margin-bottom: 8px;
}

.feature-box-desc {
  font-size: 13px;
  color: var(--color-text-muted, #9898b0);
  line-height: 1.6;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.faq-card {
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: 12px;
  padding: 20px;
}

.faq-q {
  font-size: 15px;
  font-weight: 700;
  color: #5b7cfa;
  margin-bottom: 8px;
}

.faq-a {
  font-size: 13px;
  color: var(--color-text-muted, #9898b0);
  line-height: 1.6;
}

.footer {
  border-top: 1px solid var(--color-border, #2a2a38);
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted, #9898b0);
  background: var(--color-surface, #111116);
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }
  .hero-title {
    font-size: 24px;
  }
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
