<template>
  <nav class="floating-nav" aria-label="功能页导航">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :class="['nav-item', { active: isActive(item.to), primary: item.primary }]"
      :title="item.label"
    >
      <span class="nav-icon" v-html="item.icon" />
      <span class="nav-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const navItems = [
  {
    to: '/',
    label: '首页',
    primary: false,
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  {
    to: '/stamp',
    label: 'PDF骑缝章',
    primary: true,
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="11" r="5"/><path d="M12 6V3H9m6 0h-3"/><path d="M4 21h16"/></svg>`
  },
  {
    to: '/scan',
    label: '转扫描件',
    primary: false,
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="14" rx="2"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`
  },
  {
    to: '/print',
    label: '打印效果',
    primary: false,
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>`
  }
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
.floating-nav {
  position: fixed;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--color-surface, #111116);
  border: 1px solid var(--color-border, #2a2a38);
  border-radius: var(--radius-lg);
  padding: 8px 6px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted, #9898b0);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--color-accent-glow);
  color: var(--color-accent);
}

.nav-item.active {
  background: var(--color-accent-glow);
  color: var(--color-accent);
}

.nav-item.primary {
  color: var(--color-accent);
}

.nav-item.primary:not(.active) {
  background: var(--color-accent-glow);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Tooltip label on hover */
.nav-label {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-surface-3, #1e1e2a);
  border: 1px solid var(--color-border, #2a2a38);
  color: var(--color-text, #e8e8f0);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  transform: translateY(-50%) translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.nav-item:hover .nav-label {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* 当前页分隔线（首页和功能页之间） */
.nav-item:first-child {
  margin-bottom: 2px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border, #2a2a38);
  height: 44px;
}

/* Mobile: hide */
@media (max-width: 768px) {
  .floating-nav {
    display: none;
  }
}
</style>
