<script setup lang="ts">
</script>



<template>

    <!-- SEPARADOR -->
    <div class="separador">
      <span class="bar-separador"></span>
    </div>
  
  <div class="div-mi-espacio">
    <h2>Mi Espacio</h2>

    <!-- Separador -->
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>

    <div class="mi-espacio-grid">
      <router-link class="espacio-item reservas" to="/home-app-atemtia/Reservas">
        <div class="icono"></div>
        <p>Reservas</p>
      </router-link>

      <router-link class="espacio-item incidencias" to="/home-app-atemtia/incidencias">
        <div class="icono"></div>
        <p>Incidencias</p>
      </router-link>

      <router-link class="espacio-item mi-cuenta" to="/home-app-atemtia/mi-cuenta">
        <div class="icono"></div>
        <p>Mi cuenta</p>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.div-mi-espacio {
  h2 {
    margin: 0px 0px 40px 40px;
    color: $color-titulos;
    font-size: 22px;

  }

  .separador-abajo {
    display: flex;
    justify-content: center;
    

    .bar-separador {
      margin-bottom: 25px;
      width: 350px;
      height: 1px;

    }
  }

  .mi-espacio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    justify-items: center;
    max-width: 350px;
    margin: 0 auto;
  }

  .espacio-item {
    padding: 1rem;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 97px;
    height: 93px;
    border-radius: 16px;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
    font-weight: 600;
    color: #FFFFFF;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 6px 6px 14px rgba(0, 0, 0, 0.25);
    }

    &.reservas,
    &.incidencias,
    &.mi-cuenta {
      background: linear-gradient(
        135deg,
        lighten($color-boton, 10%) 0%,
        $color-principal 50%,
        $color-boton 70%
      );
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .icono {
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    p {
      margin-top: -33px;
      font-size: 14px;
    }
  }
}
@media (min-width: 768px) { 
  .div-mi-espacio {
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    text-align: center;


    .mi-espacio-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr); 
      gap: 2rem; 

    }

    .espacio-item {
      width: 120px; 
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.25);
      }
    }
  }
}

</style>
