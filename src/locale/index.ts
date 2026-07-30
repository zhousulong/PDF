import { ref } from 'vue'

export const zhDict: Record<string, any> = {
  base: {
    title: 'PDF小工具箱',
    subtitle: '100% 本地浏览器计算 · 零上传 · 隐私保密',
    tagline: '免费在线 PDF 转扫描件 / 打印效果模拟 / 电子骑缝章',
    changelog: {
      title: '更新日志',
      latest: '最新',
      viewBtn: '查看更新日志',
      close: '关闭'
    },
    theme: {
      dark: '暗黑模式',
      light: '明亮模式',
      system: '跟随系统',
      current: '当前主题：{theme}'
    }
  },
  actions: {
    generateSuccess: '已成功生成 PDF 文件！'
  }
}

export function getNestedValue(obj: Record<string, any>, path: string): string {
  const keys = path.split('.')
  let current: any = obj
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

export function t(key: string, params?: Record<string, any>): string {
  let val = getNestedValue(zhDict, key)
  if (params && typeof val === 'string') {
    Object.keys(params).forEach(p => {
      val = val.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p])
    })
  }
  return val
}

const currentLocale = ref('zh-CN')

export function useI18n() {
  return {
    t,
    locale: currentLocale
  }
}
