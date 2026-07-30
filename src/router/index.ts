import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/pdfscn',
      name: 'pdfscn',
      component: () => import('../../pdfscn/src/views/CanvasScanView.vue')
    },
    {
      path: '/scan',
      redirect: '/pdfscn'
    },
    {
      path: '/pdfprn',
      name: 'pdfprn',
      component: () => import('../../pdfprn/src/views/CanvasPrintView.vue')
    },
    {
      path: '/print',
      redirect: '/pdfprn'
    },
    {
      path: '/pdfqfz',
      name: 'pdfqfz',
      component: () => import('../views/QfzView.vue')
    },
    {
      path: '/stamp',
      redirect: '/pdfqfz'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
