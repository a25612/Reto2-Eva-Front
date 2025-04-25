<script setup lang="ts">
import Carrusel from '../components/Carrusel.vue';
import BotonScrolltop from '../components/BotonScrolltop.vue';
import MenuDesplegable from '../components/Menu-Desplegable.vue';
import MiEspacio from '../components/MiEspacio.vue';
import CalendarioHome from '../components/CalendarioHome.vue';
import { useAuthStore } from '../stores/login';

const authStore = useAuthStore();
const usuarioSeleccionadoId = authStore.usuariosAsignadosIds;

console.log('Usuario seleccionado desde Home:', usuarioSeleccionadoId);
</script>
<template>

  <CalendarioHome/>

  <MenuDesplegable />

  <div class="titulo-anuncios">
    <!-- SEPARADOR -->
  

    <!-- ANUNCIOS -->
    <div class="div-mi-espacio">
      <router-link to="/home-app-atemtia/anuncios" class="btn-anuncios">
        <button class="button type1">
        <span class="btn-txt"> Anuncios</span>
        </button>
      </router-link>
    </div>
  </div>

  <Carrusel />

  <BotonScrolltop />

  <MiEspacio />

</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.div-mi-espacio {
  font-family: $fuente-principal;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h2 {
    margin: 17px 15px 40px 40px;
    color: $color-secundario;
    font-size: 22px;
  }

  .btn-anuncios {
    margin-bottom: 20px;
    background: none;
    border: none;
    font-size: 22px;
    font-weight: bold;
    color: $color-secundario;
    cursor: pointer;
    padding: 10px;
    transition: color 0.3s ease, transform 0.2s ease;
  }

  .separador-abajo {
    display: flex;
    justify-content: center;
    width: 100%;

    .bar-separador {
      margin-bottom: 25px;
      width: 350px;
      height: 1px;
    }
  }

  .mi-espacio-grid {
    display: grid;
    justify-items: center;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    max-width: 350px;
    margin: 0 auto;
  }
}

.titulo-anuncios {
  margin-top: 40px;
}

.separador {
  display: flex;
  justify-content: center;

  .bar-separador {
    margin-top: 20px;
    display: block;
    width: 350px;
    height: 1px;
    background: rgba(84, 190, 84, 0.441);
  }
}

.separador-abajo {
  display: flex;
  justify-content: center;

  .bar-separador {
    margin-top: -19px;
    margin-bottom: 30px;
    display: block;
    width: 350px;
    height: 1px;
    background: rgba(74, 165, 74, 0.441);
  }
}

@media (min-width: 768px) {
  .titulo-anuncios {
    margin-right: 32px;
  }
}


.button {
  height: 50px;
  width: 200px;
  position: relative;
  background-color: transparent;
  cursor: pointer;
  border: 2px solid #76b82a;
  overflow: hidden;
  border-radius: 30px;
  color: #76b82a;
  transition: all 1.0s ease-in-out;

  &:hover {
    box-shadow: 1px 1px 200px #0090a9;
    color: #fff;
    border: none;
  }

  &.type1 {
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      transition: all 0.5s ease-in-out;
      background-color: #76b82a;
      border-radius: 30px;
      visibility: hidden;
      height: 10px;
      width: 10px;
      z-index: -1;
    }

    &:hover::after {
      visibility: visible;
      transform: scale(100) translateX(2px);
    }
  }
}

.btn-txt {
  z-index: 1;
  font-weight: 800;
  letter-spacing: 4px;
}
</style>  
