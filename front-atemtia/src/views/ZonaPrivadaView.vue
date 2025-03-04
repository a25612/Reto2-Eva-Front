<script setup lang="ts">
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
      <!-- Corregir todas las rutas de los router-link -->
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
      text-decoration: none; // Asegurar que los enlaces no tengan subrayado

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

@media (min-width: 768px) {
  .botones {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
