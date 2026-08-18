<template>
  <div class="home-layout">
    <header class="header">
      <div class="logo">
        <div class="logo-seal" aria-hidden="true">章</div>
        <div class="logo-text">
          <span class="logo-name">PDF骑缝章</span>
          <span class="logo-sub">免费在线盖章</span>
        </div>
      </div>
      <nav class="header-nav" aria-label="工具">
        <RouterLink to="/stamp" class="nav-link current">PDF加盖骑缝章</RouterLink>
        <RouterLink to="/scan" class="nav-link">PDF转扫描件</RouterLink>
        <RouterLink to="/print" class="nav-link">PDF打印效果</RouterLink>
      </nav>
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
      </div>
    </header>

    <main class="main-content">
      <section class="hero">
        <div class="hero-copy">
          <p class="kicker">合同 / 标书 / 公文</p>
          <h1 class="hero-title">PDF加盖骑缝章</h1>
          <p class="hero-sub">免费在线给 PDF 盖骑缝章和公章，不用下载软件。</p>
          <p class="hero-desc">
            把印章按页切开，盖在多页合同或标书的边缘，防止单页被换。也支持点选盖公章。
            Word、Excel、图片可直接上传，浏览器里转成 PDF 再盖，文件不离开这台电脑。
          </p>
          <div class="hero-cta-row">
            <RouterLink to="/stamp" class="hero-cta">
              给 PDF 盖骑缝章
            </RouterLink>
            <span class="hero-formats">PDF · Word · Excel · 图片</span>
          </div>
        </div>

        <div class="hero-stage" aria-hidden="true">
          <div class="paper-stack">
            <article class="sheet s1">
              <span class="rule"></span><span class="rule short"></span><span class="rule"></span>
            </article>
            <article class="sheet s2">
              <span class="rule"></span><span class="rule"></span><span class="rule short"></span>
            </article>
            <article class="sheet s3">
              <span class="sheet-label">合同</span>
              <span class="rule"></span><span class="rule"></span><span class="rule short"></span>
              <span class="split-seal">
                <i></i>
              </span>
            </article>
          </div>
        </div>
      </section>

      <section class="workbench" aria-labelledby="qfz-heading">
        <div class="workbench-head">
          <h2 id="qfz-heading">PDF 骑缝章小工具</h2>
          <p>按大家常搜的用法做：先上传文件和印章，再选骑缝章或普通盖章，最后下载。</p>
        </div>
        <ol class="steps">
          <li>
            <b>1</b>
            <h3>上传 PDF 或原件</h3>
            <p>合同、标书 PDF，也可以是 Word、Excel、拍照图片。</p>
          </li>
          <li>
            <b>2</b>
            <h3>加盖骑缝章</h3>
            <p>印章按页数切开，左右上下都能盖；也可以点选盖公章。</p>
          </li>
          <li>
            <b>3</b>
            <h3>下载盖好的 PDF</h3>
            <p>批量处理多个文件，打成 ZIP 一次带走。</p>
          </li>
        </ol>
        <ul class="points">
          <li>骑缝章按页精确分割，页数多会自动分组</li>
          <li>正片叠底，印泥盖在字上仍能看清</li>
          <li>Word / Excel / 图片在本地转成 PDF 再盖</li>
          <li>文件不上传，断网也能盖</li>
        </ul>
        <RouterLink to="/stamp" class="workbench-cta">打开骑缝章工具</RouterLink>
      </section>

      <section class="more-tools">
        <h2 class="more-title">另外两个小工具</h2>
        <div class="more-grid">
          <RouterLink to="/scan" class="more-card">
            <h3>PDF 转扫描件</h3>
            <p>电子版做成纸质扫描效果，带倾斜和噪点。</p>
          </RouterLink>
          <RouterLink to="/print" class="more-card">
            <h3>PDF 打印效果</h3>
            <p>模拟激光、喷墨、针式打印的复印件质感。</p>
          </RouterLink>
        </div>
      </section>

      <section class="faq-section">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <article class="faq-card">
            <h3>怎么给 PDF 盖骑缝章？</h3>
            <p>打开骑缝章工具，上传 PDF 和印章图片，选好左右上下位置，点盖章后下载。多页合同、标书都按这个流程。</p>
          </article>
          <article class="faq-card">
            <h3>在线盖骑缝章安全吗？文件会上传吗？</h3>
            <p>不会上传。切割印章、写回 PDF 都在浏览器里完成。可以先断网再试。</p>
          </article>
          <article class="faq-card">
            <h3>Word、Excel、图片能直接盖骑缝章吗？</h3>
            <p>可以。docx、xlsx 和常见图片会先在本地转成 PDF，再盖骑缝章或公章。旧版 .doc / .xls 请先另存为 .docx / .xlsx。</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>PDF加盖骑缝章 · 免费在线给PDF盖骑缝章 · 文件不上传</p>
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
  --seal: #b42318;
  --seal-deep: #8c1810;
  --paper: #f4efe4;
  --ink: #1c1712;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: var(--color-text);
  background:
    radial-gradient(1200px 480px at 12% -10%, color-mix(in srgb, var(--seal) 16%, transparent), transparent 60%),
    var(--color-bg);
}

.home-layout::before {
  content: '';
  pointer-events: none;
  position: fixed;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  z-index: 0;
}

.header,
.main-content,
.footer {
  position: relative;
  z-index: 1;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: color-mix(in srgb, var(--color-surface) 86%, transparent);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(14px);
}

.logo { display: flex; align-items: center; gap: 10px; }

.logo-seal {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.6px solid var(--seal);
  color: var(--seal);
  font-family: "Songti SC", "STSong", "Noto Serif SC", serif;
  font-size: 15px;
  font-weight: 700;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--seal) 35%, transparent);
}

.logo-text { display: flex; flex-direction: column; }
.logo-name {
  font-size: 15px;
  font-weight: 750;
  line-height: 1.15;
}
.logo-sub {
  font-size: 11px;
  color: var(--color-text-muted);
}

.header-nav {
  display: flex;
  gap: 22px;
}

.nav-link {
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
}
.nav-link.current,
.nav-link:hover {
  color: var(--seal);
}

.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.main-content {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 36px 20px 64px;
}

.hero {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 36px;
  align-items: center;
  margin-bottom: 36px;
}

.kicker {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: var(--seal);
  margin: 0 0 10px;
}

.hero-title {
  margin: 0 0 12px;
  font-family: "Songti SC", "STSong", "Noto Serif SC", "Songti TC", serif;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.08;
}

.hero-sub {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.hero-desc {
  margin: 0;
  max-width: 36em;
  font-size: 14px;
  line-height: 1.75;
  color: var(--color-text-dim);
}

.hero-cta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 26px;
  flex-wrap: wrap;
}

.hero-cta,
.workbench-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 22px;
  background: var(--seal);
  color: #fff8f3;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  border-radius: 2px 14px 2px 14px;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--seal) 28%, transparent);
}
.hero-cta:hover,
.workbench-cta:hover {
  background: var(--seal-deep);
}

.hero-formats {
  font-size: 12px;
  color: var(--color-text-muted);
}

.hero-stage {
  min-height: 280px;
  display: grid;
  place-items: center;
}

.paper-stack {
  position: relative;
  width: 280px;
  height: 250px;
}

.sheet {
  position: absolute;
  width: 168px;
  height: 214px;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 17px, rgba(180, 35, 24, 0.05) 18px),
    var(--paper);
  border: 1px solid #d7cbb6;
  box-shadow: 8px 14px 28px rgba(40, 22, 14, 0.16);
  padding: 22px 18px;
}

.s1 { left: 18px; top: 22px; transform: rotate(-11deg); opacity: 0.72; }
.s2 { left: 54px; top: 14px; transform: rotate(-3deg); opacity: 0.88; }
.s3 { left: 92px; top: 10px; transform: rotate(5deg); }

.sheet-label {
  display: block;
  font-family: "Songti SC", "STSong", serif;
  font-size: 13px;
  color: #6a5848;
  margin-bottom: 10px;
}

.rule {
  display: block;
  height: 1px;
  background: #cbbba4;
  margin: 10px 0;
}
.rule.short { width: 62%; }

.split-seal {
  position: absolute;
  right: -27px;
  top: 58px;
  width: 54px;
  height: 108px;
  overflow: hidden;
}
.split-seal i {
  position: absolute;
  left: -27px;
  top: 0;
  width: 54px;
  height: 108px;
  border: 3px solid var(--seal);
  border-radius: 50%;
  box-shadow: inset 0 0 0 6px color-mix(in srgb, var(--seal) 18%, transparent);
}
.split-seal i::after {
  content: '骑缝';
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--seal);
  font-family: "Songti SC", "STSong", serif;
  font-size: 13px;
  letter-spacing: 0.2em;
  writing-mode: vertical-rl;
}

.workbench {
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--seal) 28%, var(--color-border));
  padding: 28px 28px 26px;
  margin-bottom: 40px;
  box-shadow: 0 18px 40px rgba(28, 23, 18, 0.06);
}

.workbench-head h2 {
  margin: 0 0 6px;
  font-size: 22px;
}
.workbench-head p {
  margin: 0 0 20px;
  color: var(--color-text-dim);
  font-size: 14px;
}

.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 0 0 18px;
  padding: 0;
}
.steps li {
  background: var(--color-surface-2);
  padding: 16px;
  border: 1px solid var(--color-border);
}
.steps b {
  display: inline-block;
  color: var(--seal);
  font-family: "Songti SC", "STSong", serif;
  font-size: 22px;
  line-height: 1;
  margin-bottom: 8px;
}
.steps h3 {
  margin: 0 0 6px;
  font-size: 15px;
}
.steps p,
.points li {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-dim);
}

.points {
  margin: 0 0 20px;
  padding-left: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 20px;
}

.workbench-cta { width: fit-content; }

.more-tools { margin-bottom: 42px; }
.more-title {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.06em;
}
.more-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.more-card {
  display: block;
  padding: 16px 18px;
  text-decoration: none;
  color: inherit;
  background: transparent;
  border: 1px dashed var(--color-border);
}
.more-card h3 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 650;
}
.more-card p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}
.more-card:hover { border-color: color-mix(in srgb, var(--seal) 40%, var(--color-border)); }

.section-title {
  margin: 0 0 16px;
  font-size: 20px;
}

.faq-list { display: flex; flex-direction: column; gap: 10px; }
.faq-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 16px 18px;
}
.faq-card h3 {
  margin: 0 0 6px;
  font-size: 14px;
  color: var(--seal);
}
.faq-card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-dim);
}

.footer {
  border-top: 1px solid var(--color-border);
  padding: 18px 24px;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-muted);
  background: var(--color-surface);
}
.footer p { margin: 0; }

@media (max-width: 860px) {
  .header-nav { display: none; }
  .hero { grid-template-columns: 1fr; }
  .hero-stage { order: -1; min-height: 220px; }
  .paper-stack { transform: scale(0.86); }
  .steps,
  .points,
  .more-grid { grid-template-columns: 1fr; }
  .workbench { padding: 20px 16px; }
}
</style>
