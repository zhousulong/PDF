import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { isStampOnlyHost } from '../config/site'

const stampView = () => import('../views/StampView.vue')

const suiteRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/scan',
    name: 'scan',
    component: () => import('../views/ScanView.vue')
  },
  {
    path: '/pdfscn',
    redirect: '/scan'
  },
  {
    path: '/print',
    name: 'print',
    component: () => import('../views/PrintView.vue')
  },
  {
    path: '/pdfprn',
    redirect: '/print'
  },
  {
    path: '/stamp',
    name: 'stamp',
    component: stampView
  },
  {
    path: '/pdfqfz',
    redirect: '/stamp'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

/** qfz.9ump.com is the stamp tool only — no homepage, no other tools. */
const stampOnlyRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'stamp',
    component: stampView
  },
  {
    path: '/stamp',
    redirect: '/'
  },
  {
    path: '/pdfqfz',
    redirect: '/'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes: isStampOnlyHost() ? stampOnlyRoutes : suiteRoutes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
