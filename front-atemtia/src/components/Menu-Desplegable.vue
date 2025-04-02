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
          <router-link to="/home-app-atemtia/servicios" class="menu-izquierda-link">
            <i class="fas fa-cogs"></i> 
            Servicios
          </router-link>
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
        <li>
          <button 
            @click="cerrarSesionHandler" 
            class="menu-izquierda-link-cerrar-sesion" 
            :style="{ marginTop: userRole === 'EMPLEADO' ? '520px' : userRole === 'TUTOR' ? '555px' : '0' }">
             <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>


<style lang="scss">
@import '../assets/styles/variables.scss';
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

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .bar-izquierda {
    display: block;
    width: 25px;
    height: 3px;
    background: $color-secundario;
    border-radius: 2px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;

    &:nth-child(1) {
      transform-origin: top left;
    }

    &:nth-child(2) {
      transform-origin: center;
    }

    &:nth-child(3) {
      transform-origin: bottom left;
    }
  }
}

.desplegable-izquierda {
  position: relative;

  .nav-tutor {
    position: fixed;
    top: 1px;
    left: -44%;
    width: 43%;
    height: 100%;
    margin-top: 101px;
    background: $color-secundario;
    box-shadow: 2px 0 8px $color-principal;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .nav-empleado {
    position: fixed;
    top: 1px;
    left: -44%;
    width: 43%;
    height: 100%;
    margin-top: 101px;
    background: $color-secundario;
    box-shadow: 2px 0 8px $color-principal;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .nav-izquierda {
    &-menu {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin: 1rem 0;

        .menu-izquierda-link-cerrar-sesion{
          display: flex;
          align-items: center;
          text-decoration: none;
          color: $color-fondo;

          i {
            margin-right: 15px;
            font-size: 1.2rem;
          }

          &:hover {
            color: #dedfe1;
          }
        }

        .menu-izquierda-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: $color-fondo;

          i {
            margin-right: 15px;
            font-size: 1.2rem;
          }

          &:hover {
            color: #dedfe1;
          }
        }
      }
    }

    &.active {
      left: 0;
      margin-top: 101px;
    }
  }

  &.active {
    .btn-menudesplegable {
      left: 31%;
    }
  }

  .btn-menudesplegable {
    .bar-izquierda {
      &.active {
        &:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }

        &:nth-child(2) {
          opacity: 0;
        }

        &:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .desplegable-izquierda {
    .nav-izquierda {
      width: 9%;
      left: 0;
      position: fixed;
      margin-top: 80px;
    }

    &.active {
      .btn-menudesplegable {
        left: 19%;
      }
    }
  }

  .btn-menudesplegable {
    display: none;
  }
  .nav-izquierda.nav-empleado .menu-izquierda-link-cerrar-sesion {
    margin-top: 640px !important; 

  }

  .nav-izquierda.nav-tutor .menu-izquierda-link-cerrar-sesion {
    margin-top: 680px !important; 
  }
}
</style>
