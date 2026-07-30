import { createI18n } from 'vue-i18n'
import { zhCN as scanZhCN } from '../../scan/src/locale/zh-CN'
import { zhCN as printZhCN } from '../../print/src/locale/zh-CN'

// 递归深合并，避免浅展开时 settings/actions 等同名 key 互相覆盖
function deepMerge(
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const src of sources) {
    for (const key of Object.keys(src)) {
      const sv = src[key]
      if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
        result[key] = deepMerge(
          (result[key] as Record<string, unknown>) ?? {},
          sv as Record<string, unknown>
        )
      } else {
        result[key] = sv
      }
    }
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const zhMessages = deepMerge(scanZhCN as any, printZhCN as any)

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  legacy: false,
  messages: {
    zh: zhMessages as Record<string, unknown>
  }
})

export default i18n
