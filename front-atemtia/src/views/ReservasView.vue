<script setup lang="ts">
</script>

<template>


<div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>
    <router-link to="/home-app-atemtia" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
  <div class="reservas">
    <h2 class="reservas__titulo">Reservas realizadas</h2>

    <div class="reservas__lista">
     
        
      </div>
    </div>
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>
</template>



<style lang="scss">
@import '../assets/styles/variables.scss';

.reservas {
  
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &__titulo {
    color: $color-titulos;
    font-size: 22px;
  }
  .separador-abajo {
    display: flex;
    justify-content: center;

    .bar-separador {
      margin: 0 0 25px; 
      width: 350px;
      height: 1px;
      background: rgba($color-secundario, 0.6);
    }

    .volver-atras {
  margin-right: 310px;
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
}



</style>
