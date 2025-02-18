import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import HomeAppView from '../views/HomeAppView.vue';
import ReservasView from '../views/ReservasView.vue';
import IncidenciasView from '../views/IncidenciasView.vue';
import MiCuentaView from '../views/MiCuentaView.vue';

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
      path: '/reservas',
      name: 'reservas',
      component: ReservasView,
    },
    {
      path: '/incidencias',
      name: 'incidencias',
      component: IncidenciasView,
    },

    {
      path: '/mi-cuenta',
      name: 'mi-cuenta',
      component: MiCuentaView,
    },
  ],
})

export default router
