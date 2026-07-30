import { createI18n } from 'vue-i18n'
import { zhCN as scanZhCN } from '../../scan/src/locale/zh-CN'
import { zhCN as printZhCN } from '../../print/src/locale/zh-CN'

const messages = {
  zh: {
    ...scanZhCN,
    ...printZhCN
  }
}

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  legacy: false,
  messages
})

export default i18n
