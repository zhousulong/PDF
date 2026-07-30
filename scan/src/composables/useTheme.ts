import { ref, watch } from 'vue'

export type ThemeMode = 'dark' | 'light' | 'system'
const STORAGE_KEY = 'pdfscn-theme'

const themeMode = ref<ThemeMode>(
  (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system'
)

const activeTheme = ref<'dark' | 'light'>('light')

function updateThemeAttr() {
  const root = document.documentElement
  if (themeMode.value === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    activeTheme.value = prefersDark ? 'dark' : 'light'
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    activeTheme.value = themeMode.value
    root.setAttribute('data-theme', themeMode.value)
  }
}

// Watch themeMode and update DOM attribute
watch(themeMode, () => {
  updateThemeAttr()
}, { immediate: true })

// Listen to system theme changes
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', () => {
    if (themeMode.value === 'system') {
      updateThemeAttr()
    }
  })
}

export function useTheme() {
  const setTheme = (next: ThemeMode) => {
    themeMode.value = next
    localStorage.setItem(STORAGE_KEY, next)
  }

  return {
    themeMode,
    activeTheme,
    setTheme
  }
}
