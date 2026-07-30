import { createI18n } from 'vue-i18n'

import { en } from './en'
import { zhCN } from './zh-CN'

const getInitialLocale = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const langParam = params.get('lang')
    if (langParam === 'zh' || langParam === 'cn' || langParam === 'zh-CN') return 'zh'
    if (langParam === 'en') return 'en'
  }
  const saved = localStorage.getItem('lang')
  if (saved) return saved
  const lang = navigator?.language || 'zh'
  return lang.startsWith('en') ? 'en' : 'zh'
}

const currentLocale = getInitialLocale()

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

const i18n = createI18n({
  locale: currentLocale,
  fallbackLocale: 'zh',
  legacy: false,
  messages: {
    en,
    zh: zhCN
  } as { [key: string]: DeepPartial<typeof en> }
})

export default i18n
