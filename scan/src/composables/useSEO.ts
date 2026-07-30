import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { SITE_ORIGIN, siteUrl } from '../../../src/config/site'

export function useSEO() {
  const { locale } = useI18n()
  const route = useRoute()

  const isEnglish = computed(() => {
    return route.query.lang === 'en' || locale.value === 'en'
  })

  const seoData = computed(() => {
    if (isEnglish.value) {
      return {
        title: 'Make PDF Look Scanned Online - Free & Private Scanned PDF Generator',
        description:
          'Transform clean digital PDFs into realistic scanned copies directly in your browser. Add noise, tilt, blur, and authentic paper textures without printing. 100% private local processing—your files never leave your device.',
        keywords:
          'make pdf look scanned, scanned pdf generator, pdf scan simulator, look scanned, pdf scan effect online, convert pdf to scanned copy, private pdf scanner, add scanner noise to pdf',
        locale: 'en_US',
        lang: 'en'
      }
    } else {
      return {
        title: '在线PDF变扫描件神器 - 免费生成逼真扫描效果 (纯前端·零上传)',
        description:
          '免费且绝对安全的在线PDF变扫描件工具。无需打印机与扫描仪，一键将干净的电子PDF转换为带噪点、斜切偏转、模糊与纸张纹理的逼真扫描件效果。100%浏览器本地处理，文件绝不上传服务器，彻底保障个人与企业合同隐私。',
        keywords:
          'PDF变扫描件, PDF扫描件效果, 在线生成扫描件PDF, PDF伪造扫描效果, 电子PDF变扫描件, PDF模拟扫描仪, 免费PDF扫描件生成器, PDF加噪点斜切',
        locale: 'zh_CN',
        lang: 'zh-CN'
      }
    }
  })

  // Monorepo route is /scan; standalone scan app may be /
  const pagePath = computed(() => {
    const p = route.path || '/'
    if (p === '/' && typeof window !== 'undefined' && !window.location.pathname.startsWith('/scan')) {
      return '/scan'
    }
    return p === '/' ? '/scan' : p
  })

  const canonicalUrl = computed(() => siteUrl(pagePath.value))

  const jsonLd = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seoData.value.title,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    url: canonicalUrl.value,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: seoData.value.description
  }))

  useHead({
    title: computed(() => seoData.value.title),
    htmlAttrs: {
      lang: computed(() => seoData.value.lang)
    },
    meta: [
      { name: 'description', content: computed(() => seoData.value.description) },
      { name: 'keywords', content: computed(() => seoData.value.keywords) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: computed(() => seoData.value.title) },
      { property: 'og:description', content: computed(() => seoData.value.description) },
      { property: 'og:url', content: computed(() => canonicalUrl.value) },
      { property: 'og:locale', content: computed(() => seoData.value.locale) },
      { property: 'og:site_name', content: 'PDF小工具箱' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: computed(() => seoData.value.title) },
      { name: 'twitter:description', content: computed(() => seoData.value.description) }
    ],
    link: [
      { rel: 'canonical', href: computed(() => canonicalUrl.value) },
      { rel: 'alternate', hreflang: 'zh-CN', href: siteUrl('/scan') },
      { rel: 'alternate', hreflang: 'en', href: `${SITE_ORIGIN}/scan?lang=en` },
      { rel: 'alternate', hreflang: 'x-default', href: siteUrl('/scan') }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: computed(() => JSON.stringify(jsonLd.value))
      }
    ]
  })
}
