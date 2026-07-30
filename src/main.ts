import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locale'
import { createHead } from '@unhead/vue'

const app = createApp(App)
const head = createHead()
app.use(router)
app.use(i18n)
app.use(head)
app.mount('#app')

// Fade in after mount to prevent FOUC
requestAnimationFrame(() => {
  document.documentElement.style.transition = 'opacity 0.15s ease'
  document.documentElement.style.opacity = '1'
})
