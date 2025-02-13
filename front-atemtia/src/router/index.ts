import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import HomeAppView from '../views/HomeAppView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,  
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home-app-atemtia',
      name: 'home-app-atemtia',
      component: HomeAppView,
    },
  ],
})

export default router
