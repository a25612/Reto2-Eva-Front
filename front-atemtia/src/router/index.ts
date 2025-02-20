import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Login from '../views/LoginView.vue';
import HomeAppView from '../views/HomeAppView.vue';
import ReservasView from '../views/ReservasView.vue';
import IncidenciasView from '../views/IncidenciasView.vue';
import MiCuentaView from '../views/MiCuentaView.vue';
import Error404View from '../views/Error404View.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/home-app-atemtia', name: 'home-app-atemtia', component: HomeAppView },
    { path: '/reservas', name: 'reservas', component: ReservasView },
    { path: '/incidencias', name: 'incidencias', component: IncidenciasView },
    { path: '/mi-cuenta', name: 'mi-cuenta', component: MiCuentaView },
    { path: '/error-404', name: 'error-404', component: Error404View },

    // Ruta comodín para redirigir a 404 cuando la URL no existe
    { path: '/:pathMatch(.*)*', redirect: '/error-404' },
  ],
});

// Verifica si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  console.log('Token en localStorage:', token);
  return !!token;
}

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'error-404') {
    next();
  } else if (!isAuthenticated()) {
    console.log('Usuario no autenticado, redirigiendo a /login');
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
