<script setup lang="ts">

</script>

<template>

<div class="div-mi-espacio">
    <h2>Mi Espacio</h2>

    <!-- SEPARADOR -->
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>
    <div class="mi-espacio-grid">
      <div class="espacio-item mensajes">
        <span class="notificacion">2</span>
        <div class="icono"></div>
        <p>Mensajes</p>
      </div>
      <div class="espacio-item reservas">
        <div class="icono"></div>
        <p>Reservas</p>
      </div>
      <div class="espacio-item incidencias">
        <span class="notificacion">1</span>
        <div class="icono"></div>
        <p>Incidencias</p>
      </div>
      <div class="espacio-item mi-cuenta">
        <div class="icono"></div>
        <p>Mi cuenta</p>
      </div>
    </div>
  </div>

</template>

<style lang="scss">
@import '../assets/styles/variables.scss';
// Aplicando las variables al código
.separador-abajo {
  display: flex;
  justify-content: center;

  .bar-separador {
    margin-top: -19px;
    margin-bottom: 25px;
    display: block;
    width: 350px;
    height: 1px;
    background: rgba($color-secundario, 0.6);
  }
}

.div-mi-espacio {
  h2 {
    margin-bottom: 40px;
    margin-left: 40px;
    color: $color-titulos;
    font-size: 22px;
    font-family: $fuente-principal;
  }

  .mi-espacio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    max-width: 350px;
    margin: 0 auto;
  }

  .espacio-item {
    position: relative;
    padding: 1rem;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 66px;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    font-family: $fuente-principal;
    font-weight: 600;
    color: $color-fondo;

    &:hover {
      transform: scale(1.05);
      box-shadow: 6px 6px 14px rgba(0, 0, 0, 0.25);
    }

    &.mensajes,
    &.reservas,
    &.incidencias,
    &.mi-cuenta {
    background: linear-gradient(135deg,   lighten($color-principal, 10%) 10%,   $color-principal 40%, 
    $color-secundario 60%, 
    darken($color-secundario, 10%) 90%
);

    }

    .icono {
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    p {
      margin-top: -1.45rem;
      font-size: 15px;
    }

    .notificacion {
      position: absolute;
      top: -8px;
      left: -8px;
      background: $color-secundario;
      color: $color-fondo;
      font-size: 0.8rem;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 50%;
    }
  }
}


</style> 
