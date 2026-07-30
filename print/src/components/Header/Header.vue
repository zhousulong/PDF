<template>
  <header class="header">
    <!-- Logo -->
    <div class="logo">
      <span class="logo-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" fill="var(--color-accent-glow)" />
        </svg>
      </span>
      <div class="logo-text">
        <div class="logo-title-row">
          <h1 class="logo-name">{{ t('base.title') }}</h1>
          <span class="version-badge">v{{ APP_VERSION }}</span>
        </div>
        <span class="logo-sub">{{ t('base.subtitle') }}</span>
      </div>
    </div>

    <!-- Center Tagline -->
    <div class="center">
      <span class="tagline">{{ t('base.tagline') }}</span>
    </div>

    <!-- Right Actions -->
    <div class="actions">
      <!-- Changelog -->
      <div class="changelog-wrap" ref="changelogRef">
        <button
          id="changelog-btn"
          :class="['changelog-btn', { 'changelog-btn-active': changelogOpen }]"
          @click="changelogOpen = !changelogOpen"
          :aria-label="t('base.changelog.viewBtn')"
          :title="t('base.changelog.title')"
        >
          <!-- IconChangelog -->
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="1" width="11" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
            <circle cx="11" cy="11" r="2.5" fill="var(--color-accent)" stroke="var(--color-bg)" stroke-width="1"/>
            <path d="M11 9.8v1.2l.8.8" stroke="white" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="changelog-btn-label">{{ t('base.changelog.title') }}</span>
        </button>

        <div v-if="changelogOpen" class="changelog-panel" role="dialog" :aria-label="t('base.changelog.title')">
          <div class="changelog-header">
            <span class="changelog-title">{{ t('base.changelog.title') }}</span>
            <button
              class="changelog-close"
              @click="changelogOpen = false"
              :aria-label="t('base.changelog.close')"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="changelog-list">
            <div
              v-for="(entry, i) in changelogList"
              :key="entry.version"
              :class="['changelog-entry', { 'changelog-latest': i === 0 }]"
            >
              <div class="changelog-entry-header">
                <span class="changelog-version">v{{ entry.version }}</span>
                <span v-if="i === 0" class="latest-badge">{{ t('base.changelog.latest') }}</span>
                <span class="changelog-date">{{ entry.date }}</span>
              </div>
              <ul class="changelog-changes">
                <li v-for="(c, ci) in entry.changes" :key="ci">{{ c }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Switch -->
      <button
        class="theme-btn"
        @click="cycleTheme"
        :aria-label="t('base.theme.current', { theme: themeLabel })"
        id="theme-switcher"
        :title="themeLabel"
      >
        <!-- IconMoon / IconSun / IconSystem -->
        <svg v-if="themeMode === 'dark'" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else-if="themeMode === 'light'" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M10.89 4.11l1.06-1.06M3.05 11.95l1.06-1.06" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M4 13h6M7 10v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <span class="theme-btn-label">{{ themeLabel }}</span>
      </button>

      <!-- Language Switch -->
      <button
        class="lang-btn"
        @click="toggleLang"
        aria-label="Switch language"
        id="lang-switcher"
      >
        <span :class="{ 'lang-active': locale === 'zh' }">中</span>
        <span class="lang-divider">/</span>
        <span :class="{ 'lang-active': locale === 'en' }">EN</span>
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme, type ThemeMode } from '@/composables/useTheme'
import { CHANGELOG_ZH, CHANGELOG_EN } from '@/changelog'

const { t, locale } = useI18n()
const { themeMode, setTheme } = useTheme()

const changelogList = computed(() => (locale.value === 'zh' ? CHANGELOG_ZH : CHANGELOG_EN))
const APP_VERSION = CHANGELOG_ZH[0]?.version ?? '2.0.0'
const changelogOpen = ref(false)
const changelogRef = ref<HTMLElement | null>(null)

const THEME_CYCLE: ThemeMode[] = ['dark', 'light', 'system']

const cycleTheme = () => {
  const idx = THEME_CYCLE.indexOf(themeMode.value)
  setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length])
}

const toggleLang = () => {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('lang', next)
}

const themeLabel = computed(() => {
  if (themeMode.value === 'dark') return t('base.theme.dark')
  if (themeMode.value === 'light') return t('base.theme.light')
  return t('base.theme.system')
})

// Close changelog panel when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  if (changelogOpen.value && changelogRef.value && !changelogRef.value.contains(e.target as Node)) {
    changelogOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.header {
  height: var(--header-h);
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: var(--header-bg);
}

/* ── Logo ── */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-accent-glow);
  border: 1px solid rgba(91, 124, 250, 0.3);
  border-radius: var(--radius-md);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.logo-title-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.logo-name {
  font-size: var(--text-md);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--color-text);
  line-height: 1.2;
}

/* Version badge next to logo name */
.version-badge {
  font-size: 10px;
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--color-accent);
  background: var(--color-accent-glow);
  border: 1px solid rgba(91, 124, 250, 0.35);
  border-radius: 4px;
  padding: 1px 5px;
  letter-spacing: 0.04em;
  line-height: 1.5;
  white-space: nowrap;
}

.logo-sub {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

/* ── Center tagline ── */
.center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.tagline {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.tagline::before,
.tagline::after {
  content: '';
  display: block;
  width: 20px;
  height: 1px;
  background: var(--color-border-2);
}

/* ── Right actions ── */
.actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* ── Changelog ── */
.changelog-wrap {
  position: relative;
}

.changelog-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.changelog-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  background: var(--color-surface-3);
}

.changelog-btn-active {
  border-color: var(--color-accent) !important;
  color: var(--color-accent) !important;
  background: var(--color-accent-glow) !important;
}

.changelog-btn-label {
  font-family: var(--font-sans);
  letter-spacing: 0.02em;
}

/* Dropdown panel */
.changelog-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 340px;
  max-height: 420px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideDown 0.18s var(--ease) both;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.changelog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  background: var(--color-surface-2);
}

.changelog-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0.04em;
}

.changelog-close {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  background: none;
  border: none;
  transition: all var(--transition);
}

.changelog-close:hover {
  background: var(--color-surface-3);
  color: var(--color-text);
}

.changelog-list {
  overflow-y: auto;
  padding: 8px 0;
  flex: 1;
}

.changelog-entry {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition);
}

.changelog-entry:last-child {
  border-bottom: none;
}

.changelog-entry:hover {
  background: var(--color-surface-2);
}

.changelog-latest {
  background: rgba(91, 124, 250, 0.04);
}

.changelog-entry-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.changelog-version {
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-text);
  letter-spacing: 0.04em;
}

.latest-badge {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-glow);
  border: 1px solid rgba(91, 124, 250, 0.4);
  border-radius: 4px;
  padding: 1px 5px;
  letter-spacing: 0.02em;
}

.changelog-date {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-left: auto;
}

.changelog-changes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.changelog-changes li {
  font-size: 12px;
  color: var(--color-text-dim);
  padding-left: 14px;
  position: relative;
  line-height: 1.5;
}

.changelog-changes li::before {
  content: '·';
  position: absolute;
  left: 4px;
  color: var(--color-accent);
  font-weight: 700;
}

/* ── Theme button ── */
.theme-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.theme-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  background: var(--color-surface-3);
}

.theme-btn-label {
  font-family: var(--font-sans);
  letter-spacing: 0.02em;
}

/* ── Language button ── */
.lang-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-size: var(--text-sm);
  color: var(--color-text-dim);
  cursor: pointer;
  transition: all var(--transition);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
}

.lang-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  background: var(--color-surface-3);
}

.lang-divider {
  margin: 0 2px;
  opacity: 0.3;
}

.lang-active {
  color: var(--color-accent);
  font-weight: 600;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .header {
    padding: 0 var(--space-3);
    height: var(--header-h);
  }
  .center {
    display: none;
  }
  .actions {
    margin-left: auto;
  }
  .logo-name {
    font-size: var(--text-sm);
  }
  .logo-sub {
    display: none; /* hide subtitle on mobile */
  }
  .version-badge {
    display: none; /* hide version on mobile */
  }
  .theme-btn-label {
    display: none;
  }
  .theme-btn {
    padding: var(--space-2);
    min-height: 36px;
    min-width: 36px;
  }
  .lang-btn {
    padding: var(--space-2);
    font-size: var(--text-xs);
    min-height: 36px;
  }
  .changelog-btn-label {
    display: none;
  }
  .changelog-btn {
    padding: var(--space-2);
    min-height: 36px;
    min-width: 36px;
  }
  .changelog-panel {
    width: calc(100vw - var(--space-4));
    right: calc(-1 * var(--space-3));
    max-height: 70vh;
  }
}
</style>
