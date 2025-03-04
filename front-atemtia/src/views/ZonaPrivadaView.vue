<script setup lang="ts">
import { ref } from 'vue';

const mostrarConfirmacion = ref(false);

const eliminarElemento = () => {
  // Aquí iría la lógica para eliminar el elemento
  console.log('Elemento eliminado');
  mostrarConfirmacion.value = false; // Cerrar el modal después de la acción
};

const cancelarEliminacion = () => {
  mostrarConfirmacion.value = false; // Solo cierra el modal sin eliminar
};
</script>

<template>
  <router-link to="/home-app-atemtia" class="volver-atras">
    <i class="fa-solid fa-arrow-left"></i>
  </router-link>

  <div class="zona-privada">
    <h1 class="titulo">Zona Privada</h1>

    <!-- Separador abajo -->
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>

    <div class="botones">
      <router-link to="/home-app-atemtia/zona-privada/usuarios" class="btn-accion">Usuarios</router-link>
      <router-link to="/home-app-atemtia/zona-privada/tutores" class="btn-accion">Tutores</router-link>
      <router-link to="/home-app-atemtia/zona-privada/servicios" class="btn-accion">Servicios</router-link>
      <router-link to="/home-app-atemtia/zona-privada/anuncios" class="btn-accion">Anuncios</router-link>
      <router-link to="/home-app-atemtia/zona-privada/incidencias" class="btn-accion">Incidencias</router-link>
    </div>

  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.zona-privada {
  font-family: $fuente-principal;
  background-color: $color-fondo;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 20px auto;
  text-align: center;

  .titulo {
    font-size: 24px;
    font-weight: bold;
    color: $color-titulos;
  }

  .separador-abajo {
    margin: 10px auto;
    
    .bar-separador {
      display: block;
      width: 160px;
      height: 2px;
      background-color: $color-principal;
      margin: auto;
    }
  }

  .botones {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;

    .btn-accion {
      display: inline-block;
      text-align: center;
      background-color: $color-boton;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        background-color: darken($color-boton, 10%);
      }
    }
  }

  .volver-atras {
    margin-left: 10px;
    margin-top: 10px;
    background-color: $color-boton;
    color: $color-fondo;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
}

// Modal de confirmación
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-contenido {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;

  h3 {
    margin-bottom: 20px;
  }

  .modal-botones {
    display: flex;
    justify-content: space-around;

    .btn-confirmar, .btn-cancelar {
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
    }

    .btn-confirmar {
      background-color: green;
      color: white;
    }

    .btn-cancelar {
      background-color: red;
      color: white;
    }

    .btn-confirmar:hover {
      background-color: darkgreen;
    }

    .btn-cancelar:hover {
      background-color: darkred;
    }
  }
}
</style>
