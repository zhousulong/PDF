import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/locale'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/ScanViewFeatureDetectView.vue')
    },
    {
      path: '/scan',
      name: 'scan',
      redirect: { name: 'index' }
    },
    {
      path: '/scan-canvas',
      name: 'scan-canvas',
      component: () => import('@/views/CanvasScanView.vue')
    },
    {
      path: '/scan-magica',
      name: 'scan-magica',
      component: () => import('@/views/MagicaScanView.vue')
    },
    // catch all redirect to /
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      redirect: { name: 'index' }
    }
  ]
})

router.beforeEach((to) => {
  if (to.query.lang) {
    const lang = String(to.query.lang).toLowerCase()
    if (lang === 'en') {
      i18n.global.locale.value = 'en'
    } else if (lang === 'zh' || lang === 'zh-cn') {
      i18n.global.locale.value = 'zh'
    }
  }
})

export default router

