import { createApp, defineComponent, h } from 'vue'

/* CSS */
import './css'

/* Vue App */
import AppRouterView from './components/AppRouterView.vue'
const app = createApp(
  defineComponent({
    render: () => [h(AppRouterView)],
  })
)

/* Vue Router */
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: [
    {
      name: 'character',
      path: '/',
      alias: ['/character'],
      component: () => import('./pages/Character.vue'),
    },
  ],
})
app.use(router)

app.mount('#app')
