<script setup lang="ts">

</script>

<template>
  <div class="zona-privada" v-if="usuarioRol === 'EMPLEADO'">
    <h1 class="titulo">Zona Privada</h1>
    <!-- Separador abajo -->
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>
    <p>Esta es tu zona privada.</p>
    <div class="botones">
      <button class="btn-accion">Añadir Usuarios</button>
      <button class="btn-accion">Añadir Servicios</button>
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
  margin: auto;
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
      width: 50px;
      height: 4px;
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
      background-color: $color-boton;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;

      &:hover {
        background-color: darken($color-boton, 10%);
      }
    }
  }
}

@media (min-width: 768px) {
  .botones {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>