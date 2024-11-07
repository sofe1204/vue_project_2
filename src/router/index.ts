import { createRouter, createWebHistory } from 'vue-router'
import TopStoriesView from '../views/TopStoriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/TopStories',
      name: 'topStories',
      component: TopStoriesView,
    }
  ],
})

export default router
