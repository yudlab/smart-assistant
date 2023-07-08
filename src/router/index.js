import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
const tezt = (function () {
  console.log(import.meta.env.BASE_URL);
})()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
