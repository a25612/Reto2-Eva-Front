import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import UsersView from '../views/UsersView.vue'
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
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
