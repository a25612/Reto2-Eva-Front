<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { abrirMenuIzquierda } from '../ts/menu-desplegable';

const userRole = ref('');
const router = useRouter();

watchEffect(() => {
  userRole.value = (localStorage.getItem('rol') || '').toUpperCase();
});

const cerrarSesionHandler = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<template>
  <div class="desplegable-izquierda">
    <button class="btn-menudesplegable" @click="abrirMenuIzquierda">
      <span class="bar-izquierda"></span>
      <span class="bar-izquierda"></span>
      <span class="bar-izquierda"></span>
    </button>
    <nav class="nav-izquierda" :class="{ 'nav-tutor': userRole === 'TUTOR', 'nav-empleado': userRole === 'EMPLEADO' }">
      <ul class="nav-izquierda-menu">
        <li>
          <a href="#" class="menu-izquierda-link">
            <i class="fas fa-home"></i>
            Inicio
          </a>
        </li>
        <li>
          <router-link to="/home-app-atemtia/mi-cuenta" class="menu-izquierda-link">
            <i class="fa-solid fa-user"></i>
            Mi cuenta
          </router-link>
        </li>
        <li v-if="userRole === 'EMPLEADO'">
          <router-link to="/home-app-atemtia/zona-privada" class="menu-izquierda-link">
            <i class="fa-solid fa-shield"></i>
            Administración
          </router-link>
        </li>
        <!-- Botón cerrar sesión SIEMPRE ABAJO -->
        <li class="cerrar-sesion-bottom">
          <button @click="cerrarSesionHandler" class="menu-izquierda-link-cerrar-sesion">
            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>




<style lang="scss">
@import '../assets/styles/variables.scss';

.desplegable-izquierda {
  position: relative;

  .nav-tutor,
  .nav-empleado,
  .nav-izquierda {
    font-family: $fuente-principal;
    position: fixed;
    top: 0;
    left: 0;
    width: 43%;
    height: 100vh;
    background: $color-secundario;
    box-shadow: 2px 0 8px $color-principal;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 1rem 0 0 0;
  }

  .nav-izquierda-menu {
    list-style: none;
    padding: 0 0.5rem 0 0.5rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
  }

  .nav-izquierda-menu li {
    margin: 1rem 0;
  }

  .menu-izquierda-link,
  .menu-izquierda-link-cerrar-sesion {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $color-fondo;
    background: none;
    border: none;
    font: inherit;
    width: 100%;
    padding: 0.75rem 1rem;
    cursor: pointer;

    i {
      margin-right: 15px;
      font-size: 1.2rem;
    }

    &:hover {
      color: #dedfe1;
    }
  }

  .cerrar-sesion-bottom {
    margin-top: auto !important;
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .desplegable-izquierda {
    .nav-tutor,
    .nav-empleado,
    .nav-izquierda {
      width: 70vw;
      min-width: 220px;
      max-width: 100vw;
    }
    .nav-izquierda-menu {
      padding-bottom: 2rem;
    }
  }
}

@media (min-width: 769px) {
  .desplegable-izquierda {
    .nav-tutor,
    .nav-empleado,
    .nav-izquierda {
      width: 18vw;
      min-width: 180px;
      max-width: 340px;
    }
  }
}

.btn-menudesplegable {
  position: fixed;
  top: 1rem;
  z-index: 2001;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  margin-top: 90px;
  cursor: pointer;
  padding: 1rem;
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  .bar-izquierda {
    display: block;
    width: 25px;
    height: 3px;
    background: $color-secundario;
    border-radius: 2px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  }
}
</style>
