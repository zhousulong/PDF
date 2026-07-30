import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/PrintViewFeatureDetectView.vue')
    },
    {
      path: '/print',
      name: 'print',
      redirect: { name: 'index' }
    },
    {
      path: '/print-canvas',
      name: 'print-canvas',
      component: () => import('@/views/CanvasPrintView.vue')
    },
    // catch all redirect to /
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      redirect: { name: 'index' }
    }
  ]
})

export default router
