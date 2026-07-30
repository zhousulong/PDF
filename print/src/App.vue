<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <main class="view"><RouterView :key="route.fullPath" /></main>
      <ServieWorkerReloadPrompt />
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { darkTheme, NConfigProvider, NGlobalStyle, NMessageProvider } from 'naive-ui'
import { RouterView } from 'vue-router'
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ServieWorkerReloadPrompt from '@/components/Misc/ServiceWorkerReloadPrompt.vue'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { activeTheme } = useTheme()
const { t, locale } = useI18n()

const theme = computed(() => (activeTheme.value === 'dark' ? darkTheme : null))

function updateSeoMeta() {
  const currentLang = locale.value
  const title = t('base.pageTitle')
  const description = t('base.pageDescription')
  const keywords = t('base.pageKeywords')

  document.title = title
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en'

  const setMeta = (selector: string, content: string) => {
    let el = document.querySelector(selector)
    if (el) {
      el.setAttribute('content', content)
    }
  }

  setMeta('meta[name="description"]', description)
  setMeta('meta[name="keywords"]', keywords)
  setMeta('meta[property="og:title"]', title)
  setMeta('meta[property="og:description"]', description)
  setMeta('meta[name="twitter:title"]', title)
  setMeta('meta[name="twitter:description"]', description)

  // Inject/update dynamic JSON-LD structured data
  let script = document.getElementById('seo-jsonld') as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = 'seo-jsonld'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://prn.9ump.com/#webapp',
        name: title,
        url: 'https://prn.9ump.com/',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires HTML5 and WebAssembly support',
        'offers': {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        description: description
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://prn.9ump.com/#faq',
        mainEntity:
          currentLang === 'zh'
            ? [
                {
                  '@type': 'Question',
                  name: '如何在不使用打印机的情况下将 PDF 变为扫描件或打印效果？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '使用在线 PDF 打印效果模拟器，只需选择或上传您的电子 PDF，系统即会在浏览器本地为您模拟真实打印机的色彩发灰、旋转倾斜、噪点重影与纸张质感，一键导出压平后的逼真扫描件。'
                  }
                },
                {
                  '@type': 'Question',
                  name: '本工具处理文件安全吗？会上传我的敏感文档吗？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '绝对安全！本工具采用 100% 纯前端浏览器本地处理（WebAssembly / Web Worker），您的 PDF 文件永远不会被上传到任何服务器，完全保证个人隐私与合同安全。'
                  }
                }
              ]
            : [
                {
                  '@type': 'Question',
                  name: 'How to make a PDF look scanned without a physical printer?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Upload your PDF to our online PDF printer simulator. It adds authentic scanner artifacts like tilt, noise, blur, and paper texture directly in your browser, generating a realistic flattened scanned copy in seconds.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Is this tool safe to use? Are my files uploaded?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '100% Safe. This tool operates entirely within your local browser. Your documents never leave your device and are never uploaded to any remote server.'
                  }
                }
              ]
      }
    ]
  }

  script.textContent = JSON.stringify(jsonLd)
}

watchEffect(() => {
  updateSeoMeta()
})

// Overrides for Naive UI to match the "Dark Precision" Vanilla CSS design tokens
const themeOverrides = computed(() => {
  const isDark = theme.value === darkTheme
  return {
    common: {
      primaryColor: isDark ? '#5b7cfa' : '#3b5df5',
      primaryColorHover: isDark ? '#3a5ae8' : '#2545dc',
      primaryColorPressed: isDark ? '#3a5ae8' : '#2545dc',
      bodyColor: isDark ? '#0a0a0c' : '#f4f5f7',
      cardColor: isDark ? '#111116' : '#ffffff',
      borderColor: isDark ? '#2a2a38' : '#d8dae8',
      textColor1: isDark ? '#e8e8f0' : '#1a1a2e',
      textColor2: isDark ? '#9898b0' : '#4a4a6a',
      textColor3: isDark ? '#55556a' : '#8888a8',
      borderRadius: '8px'
    },
    Card: {
      borderRadius: '12px',
      borderColor: isDark ? '#2a2a38' : '#d8dae8',
      color: isDark ? '#111116' : '#ffffff'
    },
    Button: {
      borderRadiusMedium: '8px'
    },
    Input: {
      borderRadius: '8px',
      color: isDark ? '#18181f' : '#f0f1f5',
      colorFocus: isDark ? '#18181f' : '#f0f1f5',
      border: `1px solid ${isDark ? '#2a2a38' : '#d8dae8'}`,
      borderFocus: `1px solid ${isDark ? '#5b7cfa' : '#3b5df5'}`,
      borderHover: `1px solid ${isDark ? '#38384a' : '#c4c6d8'}`
    },
    Switch: {
      railColorActive: isDark ? '#5b7cfa' : '#3b5df5'
    }
  }
})
</script>
