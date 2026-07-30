import { ref, watch, onMounted, onUnmounted } from 'vue'

export type ThemeMode = 'dark' | 'light' | 'system'

const STORAGE_KEY = '9ump-theme'

const themeMode = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system')
const activeTheme = ref<'dark' | 'light'>('dark')
const systemIsDark = ref(typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true)

let mediaQuery: MediaQueryList | null = null

function updateDOM() {
  const isDark = themeMode.value === 'dark' || (themeMode.value === 'system' && systemIsDark.value)
  activeTheme.value = isDark ? 'dark' : 'light'
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }
}

function handleMediaChange(e: MediaQueryListEvent) {
  systemIsDark.value = e.matches
  if (themeMode.value === 'system') {
    updateDOM()
  }
}

export function useTheme() {
  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemIsDark.value = mediaQuery.matches
    mediaQuery.addEventListener('change', handleMediaChange)
    updateDOM()
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  })

  watch(themeMode, (newMode) => {
    localStorage.setItem(STORAGE_KEY, newMode)
    updateDOM()
  }, { immediate: true })

  function setTheme(newMode: ThemeMode) {
    themeMode.value = newMode
  }

  function cycleTheme() {
    const cycle: ThemeMode[] = ['dark', 'light', 'system']
    const idx = cycle.indexOf(themeMode.value)
    themeMode.value = cycle[(idx + 1) % cycle.length]
  }

  return {
    mode: themeMode,
    themeMode,
    activeTheme,
    setTheme,
    cycleTheme
  }
}
