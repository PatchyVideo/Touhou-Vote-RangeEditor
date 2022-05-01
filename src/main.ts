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
      path: '/character',
      alias: ['/'],
      component: () => import('./pages/Character.vue'),
    },
    {
      name: 'characterWork',
      path: '/characterWork',
      alias: [],
      component: () => import('./pages/CharacterWork.vue'),
    },
    {
      name: 'music',
      path: '/music',
      alias: [],
      component: () => import('./pages/Music.vue'),
    },
    {
      name: 'musicWork',
      path: '/musicWork',
      alias: [],
      component: () => import('./pages/MusicWork.vue'),
    },
  ],
})
app.use(router)

app.mount('#app')
