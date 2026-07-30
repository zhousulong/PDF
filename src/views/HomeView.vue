<template>
  <div class="home-layout">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b7cfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-name">PDF小工具箱</span>
          <span class="logo-sub">免费·安全·无水印</span>
        </div>
      </div>
      <div class="header-center">
        <span class="tagline">100% 浏览器本地计算 · 零上传 · 免费无水印</span>
      </div>
      <div class="header-right">
        <button class="theme-toggle-btn" @click="cycleTheme" :title="'当前主题：' + themeLabel">
          <svg v-if="mode === 'dark'" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="mode === 'light'" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M10.89 4.11l1.06-1.06M3.05 11.95l1.06-1.06" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 13h6M7 10v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span class="theme-label">{{ themeLabel }}</span>
        </button>
        <span class="privacy-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>零上传·本地渲染</span>
        </span>
      </div>
    </header>

    <main class="main-content">
      <!-- Hero -->
      <section class="hero animate-fade-in">
        <div class="privacy-badge-hero">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>物理级隐私安全 · 文件绝不上传 · 100% 本地渲染</span>
        </div>
        <h1 class="hero-title">免费在线 PDF 工具箱</h1>
        <p class="hero-sub">PDF 转扫描件 / 打印效果模拟 / 电子骑缝章盖章</p>
        <p class="hero-desc">无需打印机或扫描仪，无需排队上传大文件，所有转换在您的浏览器内高速完成，合同与敏感文件绝不离开您的设备。</p>
      </section>

      <!-- Tools Cards -->
      <section class="tools-grid">
        <!-- Card 1 -->
        <div class="tool-card">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="5" width="16" height="14" rx="2"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="#5b7cfa" stroke-width="2" class="scanner-beam"/>
                <line x1="8" y1="9" x2="16" y2="9" opacity="0.4"/>
                <line x1="8" y1="15" x2="12" y2="15" opacity="0.4"/>
              </svg>
            </div>
            <div class="card-title-group">
              <div class="card-title-row">
                <h2 class="card-title">PDF 转扫描件</h2>
                <span class="card-tag">Lookscanned 替代</span>
              </div>
              <span class="card-sub">一键将电子 PDF 变成逼真纸质扫描件</span>
            </div>
          </div>
          <p class="card-desc">将干净的电子版 PDF 转为含偏角倾斜、黑白噪点、对比度调效及复古纸张纹理的扫描效果件。</p>
          <ul class="card-features">
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>旋转、噪点、模糊、对比度、纸张泛黄自由调节</span>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>双视图实时对比预览，所见即所得</span>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>无需扫描仪，文件不离电脑，绝对私密</span>
            </li>
          </ul>
          <RouterLink to="/scan" class="card-btn">
            <span>在线生成 PDF 扫描件</span>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.667 2.333L9.334 7 4.667 11.667" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>

        <!-- Card 2 -->
        <div class="tool-card">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <path d="M6 9V3h12v6"/>
                <rect x="6" y="14" width="12" height="8" rx="1" fill="rgba(255,255,255,0.08)"/>
              </svg>
            </div>
            <div class="card-title-group">
              <div class="card-title-row">
                <h2 class="card-title">PDF 打印效果模拟</h2>
                <span class="card-tag">发票/复印件质感</span>
              </div>
              <span class="card-sub">模拟真实打印机瑕疵与复印质感</span>
            </div>
          </div>
          <p class="card-desc">模拟激光打印发虚、家用喷墨晕染、草稿模式及针式发票点阵瑕疵，支持多种打印机类型预设。</p>
          <ul class="card-features">
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>激光 / 喷墨 / 针式打印机多场景预设</span>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>送纸抖动、辊轮划痕、墨水晕染等细节还原</span>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Web Worker 并行渲染，大文件秒级导出</span>
            </li>
          </ul>
          <RouterLink to="/print" class="card-btn">
            <span>在线模拟 PDF 打印效果</span>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.667 2.333L9.334 7 4.667 11.667" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>

        <!-- Card 3 -->
        <div class="tool-card">
          <div class="card-header">
            <div class="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="11" r="5" stroke-width="1.6"/>
                <path d="M12 6V3H9m6 0h-3"/>
                <path d="M4 21h16" stroke-width="2"/>
              </svg>
            </div>
            <div class="card-title-group">
              <div class="card-title-row">
                <h2 class="card-title">PDF 骑缝章·电子盖章</h2>
                <span class="card-tag">合同公文必备</span>
              </div>
              <span class="card-sub">多页智能分割·正片叠底·批量处理</span>
            </div>
          </div>
          <p class="card-desc">专为公文与合同流转设计，智能将公章图片按多页精确分割加盖电子骑缝章，支持正片叠底。</p>
          <ul class="card-features">
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>智能多页骑缝章分割（支持左右上下四向）</span>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>正片叠底物理混合，盖章不遮挡文字</span>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>多文件批量盖章，一键导出 ZIP 打包下载</span>
            </li>
          </ul>
          <RouterLink to="/stamp" class="card-btn">
            <span>在线加盖电子骑缝章</span>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.667 2.333L9.334 7 4.667 11.667" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </RouterLink>
        </div>
      </section>

      <!-- Advantages -->
      <section class="features-section">
        <div class="section-header">
          <h2 class="section-title">为什么选择本地处理的 PDF 工具？</h2>
          <p class="section-desc">对比传统需要将文件上传到第三方服务器的在线工具：</p>
        </div>
        <div class="features-box-grid">
          <div class="feature-box">
            <div class="feature-box-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b7cfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="feature-box-title">物理级隐私安全</h3>
            <p class="feature-box-desc">合同与保密文件不离开您的本地设备。在浏览器内存中直接渲染，杜绝商业信息泄露。</p>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b7cfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3 class="feature-box-title">无需等待上传，速度更快</h3>
            <p class="feature-box-desc">省去上传文件的网络瓶颈，直接调用本机 CPU 渲染，处理速度比服务端快数倍。</p>
          </div>
          <div class="feature-box">
            <div class="feature-box-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b7cfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </div>
            <h3 class="feature-box-title">完全免费，无强制水印</h3>
            <p class="feature-box-desc">导出的 PDF 保持高清矢量质感，无任何商业水印或付费限制，真正开箱即用。</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq-section">
        <div class="section-header">
          <h2 class="section-title">常见问题解答</h2>
        </div>
        <div class="faq-list">
          <div class="faq-card">
            <h3 class="faq-q">如何把清晰的电子 PDF 做成逼真的纸质扫描件？</h3>
            <p class="faq-a">使用本站的"PDF 转扫描件"功能，上传 PDF 后自由调节倾斜角度、黑白噪点和对比度，几秒钟即可导出带有复印扫描质感的 PDF 文件，无需任何硬件。</p>
          </div>
          <div class="faq-card">
            <h3 class="faq-q">电子骑缝章是如何加盖到多页合同上的？</h3>
            <p class="faq-a">在"电子骑缝章"工具中上传公章图片与合同 PDF，系统会自动将印章等分切割并准确加盖到多页 PDF 的边缘，支持正片叠底，效果自然逼真。</p>
          </div>
          <div class="faq-card">
            <h3 class="faq-q">文件真的不会被上传到服务器吗？断网也能用吗？</h3>
            <p class="faq-a">是的，您可以断开网络后再试，功能完全不受影响。所有代码均在浏览器本地运行，没有服务器端处理。首次访问后还可离线使用（PWA）。</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© 2026 PDF小工具箱 · 100% 浏览器本地计算 · 零文件上传 · 完全免费</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const { mode, cycleTheme } = useTheme()

const themeLabel = computed(() => {
  if (mode.value === 'dark') return '暗黑'
  if (mode.value === 'light') return '明亮'
  return '跟随系统'
})
</script>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg, #0a0a0c);
  color: var(--color-text, #e8e8f0);
  transition: background 0.3s ease, color 0.3s ease;
}

/* ── Header ── */
.header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--color-surface, rgba(17,17,22,0.88));
  border-bottom: 1px solid var(--color-border, #2a2a38);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.logo { display: flex; align-items: center; gap: 10px; }

.logo-icon {
  width: 34px; height: 34px;
  border-radius: var(--radius-md);
  background: rgba(91,124,250,0.12);
  border: 1px solid rgba(91,124,250,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.logo-text { display: flex; flex-direction: column; gap: 1px; }
.logo-name { font-size: 15px; font-weight: 700; color: var(--color-text, #e8e8f0); line-height: 1.2; }
.logo-sub  { font-size: 11px; color: var(--color-text-muted, #9898b0); line-height: 1.2; white-space: nowrap; }

.tagline { font-size: 12px; color: var(--color-text-muted, #9898b0); white-space: nowrap; }

.header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.theme-toggle-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: var(--radius-sm);
  background: var(--color-surface-2, rgba(255,255,255,0.05));
  border: 1px solid var(--color-border, #2a2a38);
  color: var(--color-text, #e8e8f0);
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; white-space: nowrap;
}
.theme-toggle-btn:hover { border-color: #5b7cfa; background: rgba(91,124,250,0.1); }

.privacy-badge {
  font-size: 11px; padding: 4px 10px; border-radius: var(--radius-lg);
  background: rgba(91,124,250,0.1); border: 1px solid rgba(91,124,250,0.25);
  color: #5b7cfa; font-weight: 600;
  display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
}

/* ── Main ── */
.main-content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px 56px;
  width: 100%;
}

/* ── Hero ── */
.hero {
  text-align: center;
  margin-bottom: 44px;
}

.privacy-badge-hero {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 20px;
  background: rgba(91,124,250,0.1); border: 1px solid rgba(91,124,250,0.25);
  color: #5b7cfa; font-size: 12px; font-weight: 600;
  margin-bottom: 18px;
}

.hero-title {
  font-size: 36px; font-weight: 800;
  color: var(--color-text, #e8e8f0);
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  line-height: 1.2;
}

.hero-sub {
  font-size: 15px;
  color: var(--color-text-dim, #7878a0);
  margin: 0 0 14px;
  line-height: 1.4;
}

.hero-desc {
  font-size: 14px;
  color: var(--color-text-muted, #9898b0);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.65;
}

/* ── Tool Cards ── */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 52px;
}

.tool-card {
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex; flex-direction: column;
  transition: all 0.25s ease;
}
.tool-card:hover {
  transform: translateY(-3px);
  border-color: #5b7cfa;
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
}

.card-header {
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 12px;
}

.card-icon-wrapper {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  background: rgba(91,124,250,0.12);
  display: flex; align-items: center; justify-content: center;
  color: #5b7cfa; flex-shrink: 0;
}

.card-title-group { min-width: 0; }

.card-title-row {
  display: flex; align-items: center;
  gap: 7px; flex-wrap: nowrap; margin-bottom: 3px;
}

.card-title {
  font-size: 16px; font-weight: 700;
  color: var(--color-text, #e8e8f0);
  white-space: nowrap;
}

.card-tag {
  font-size: 10px; padding: 2px 7px; border-radius: var(--radius-sm);
  background: rgba(91,124,250,0.18); color: #5b7cfa; font-weight: 600;
  white-space: nowrap; flex-shrink: 0;
}

.card-sub {
  font-size: 12px;
  color: var(--color-text-muted, #9898b0);
  line-height: 1.3;
}

.card-desc {
  font-size: 13px; color: var(--color-text-muted, #9898b0);
  line-height: 1.6; margin-bottom: 14px;
}

.card-features {
  list-style: none; padding: 0; margin: 0 0 20px;
  display: flex; flex-direction: column; gap: 8px; flex: 1;
}

.card-features li {
  display: flex; align-items: flex-start; gap: 7px;
  font-size: 13px; color: var(--color-text, #e8e8f0);
  line-height: 1.45;
}

.card-features li svg { color: #5b7cfa; flex-shrink: 0; margin-top: 1px; }

.card-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 18px; border-radius: var(--radius-md);
  background: #5b7cfa; color: #fff;
  font-weight: 600; font-size: 13px;
  text-decoration: none; transition: all 0.2s ease;
}
.card-btn:hover { background: #4a6be8; }

/* ── Features ── */
.features-section {
  margin-top: 36px; padding-top: 36px;
  border-top: 1px solid var(--color-border, #2a2a38);
}

.section-header { text-align: center; margin-bottom: 28px; }

.section-title {
  font-size: 22px; font-weight: 700;
  color: var(--color-text, #e8e8f0);
  margin: 0 0 8px; line-height: 1.3;
}

.section-desc {
  font-size: 13px; color: var(--color-text-muted, #9898b0); margin: 0;
}

.features-box-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feature-box {
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: var(--radius-lg); padding: 20px;
}

.feature-box-icon {
  width: 38px; height: 38px; border-radius: var(--radius-md);
  background: rgba(91,124,250,0.1);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}

.feature-box-title {
  font-size: 15px; font-weight: 700;
  color: var(--color-text, #e8e8f0);
  margin: 0 0 6px; line-height: 1.3;
}

.feature-box-desc {
  font-size: 13px; color: var(--color-text-muted, #9898b0);
  line-height: 1.6; margin: 0;
}

/* ── FAQ ── */
.faq-section {
  margin-top: 36px; padding-top: 36px;
  border-top: 1px solid var(--color-border, #2a2a38);
}

.faq-list {
  display: flex; flex-direction: column; gap: 12px;
}

.faq-card {
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: var(--radius-lg); padding: 18px 20px;
}

.faq-q {
  font-size: 14px; font-weight: 700;
  color: #5b7cfa; margin: 0 0 6px; line-height: 1.4;
}

.faq-a {
  font-size: 13px; color: var(--color-text-muted, #9898b0);
  line-height: 1.65; margin: 0;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--color-border, #2a2a38);
  padding: 18px 24px; text-align: center;
  font-size: 12px; color: var(--color-text-muted, #9898b0);
  background: var(--color-surface, #111116);
}
.footer p { margin: 0; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .tools-grid { grid-template-columns: 1fr; }
  .features-box-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .header-center { display: none; }
  .privacy-badge { display: none; }
  .hero-title { font-size: 26px; }
  .main-content { padding: 28px 16px 44px; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 22px; }
  .privacy-badge-hero { font-size: 11px; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.5s ease both; }

/* scanner beam animation */
.scanner-beam {
  animation: beam 2s ease-in-out infinite;
}
@keyframes beam {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
