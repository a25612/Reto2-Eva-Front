import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Login from '../views/LoginView.vue';
import HomeAppView from '../views/HomeAppView.vue';
import ReservasView from '../views/ReservasView.vue';
import IncidenciasView from '../views/IncidenciasView.vue';
import MiCuentaView from '../views/MiCuentaView.vue';
import Error404View from '../views/Error404View.vue';
import ServiciosView from '../views/ServiciosView.vue';
import AnunciosView from '../views/AnunciosView.vue';
import ZonaPrivada from '../views/ZonaPrivadaView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/home-app-atemtia', name: 'home-app-atemtia', component: HomeAppView },
    { path: '/home-app-atemtia/reservas', name: 'reservas', component: ReservasView },
    { path: '/home-app-atemtia/incidencias', name: 'incidencias', component: IncidenciasView },
    { path: '/home-app-atemtia/mi-cuenta', name: 'mi-cuenta', component: MiCuentaView },
    { path: '/home-app-atemtia/error-404', name: 'error-404', component: Error404View },
    { path: '/home-app-atemtia/servicios', name: 'servicios', component: ServiciosView },
    { path: '/home-app-atemtia/anuncios', name: 'anuncios', component: AnunciosView },
    { path: '/home-app-atemtia/zona-privada', name: 'zona-privada', component: ZonaPrivada },
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

function getUserRole() {
  return localStorage.getItem('rol');
}

// Guardia de navegación para proteger rutas privadas
router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'home' || to.name === 'error-404') {
    next();
  } else if (!isAuthenticated()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    next({ name: 'login' });
  } else {
    const userRole = getUserRole();
    if (to.name === 'zona-privada') {
      if (userRole === 'Tutor') {
        console.warn('Acceso denegado: Los tutores no pueden acceder a la zona privada');
        next({ name: 'error-404' });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

export default router;
