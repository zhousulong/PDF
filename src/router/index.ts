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
      path: '/scan',
      name: 'scan',
      component: () => import('../../scan/src/views/CanvasScanView.vue')
    },
    {
      path: '/pdfscn',
      redirect: '/scan'
    },
    {
      path: '/print',
      name: 'print',
      component: () => import('../../print/src/views/CanvasPrintView.vue')
    },
    {
      path: '/pdfprn',
      redirect: '/print'
    },
    {
      path: '/stamp',
      name: 'stamp',
      component: () => import('../views/StampView.vue')
    },
    {
      path: '/pdfqfz',
      redirect: '/stamp'
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
