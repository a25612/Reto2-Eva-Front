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
    { path: '/home-app-atemtia/reservas', name: 'reservas', component: ReservasView },
    { path: '/home-app-atemtia/incidencias', name: 'incidencias', component: IncidenciasView },
    { path: '/home-app-atemtia/mi-cuenta', name: 'mi-cuenta', component: MiCuentaView },
    { path: '/error-404', name: 'error-404', component: Error404View },
    { path: '/:pathMatch(.*)*', redirect: '/error-404' },
  ],
});

// Función para validar si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); 
    const exp = payload.exp * 1000; 
    if (Date.now() > exp) {
      console.warn('Token expirado, eliminando y redirigiendo a login');
      localStorage.removeItem('token'); 
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error al procesar el token:', err);
    localStorage.removeItem('token');
    return false;
  }
}

// Guardia de navegación para proteger rutas privadas
router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'error-404' || to.name === 'home' ) {
    next(); 
  } else if (!isAuthenticated()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    next({ name: 'login' }); 
  } else {
    next();
  }
});

export default router;
