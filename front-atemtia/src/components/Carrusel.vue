<script setup lang="ts">
import { onMounted } from "vue";
import { iniciarCarrusel } from "../ts/carrusel";

onMounted(() => {
  iniciarCarrusel();
});
</script>


<template>
    <!-- CARRUSEL DE ANUNCIOS -->
  <div class="carrusel">
    <div class="carrusel-container">
      <div class="carrusel-tarjeta">
        <img src="https://espacioatemtia.es/wp-content/uploads/2023/07/Piscina-Atemtia-Terapias-Acu%C3%A1ticas2-scaled-1280x852.jpg" class="carrusel-imagen">
        <div class="carrusel-content">
          <h3 class="carrusel-titulo">Curso 1</h3>
          <p class="carrusel-fecha">23 de enero de 2025</p>
          <p class="carrusel-autor">Ruben Arnadillo</p>
        </div>
      </div>
      <div class="carrusel-tarjeta">
        <img src="https://espacioatemtia.es/wp-content/uploads/2023/07/Piscina-Atemtia-Terapias-Acu%C3%A1ticas2-scaled-1280x852.jpg" class="carrusel-imagen">
        <div class="carrusel-content">
          <h3 class="carrusel-titulo">Curso 2</h3>
          <p class="carrusel-date">15 de enero de 2025</p>
          <p class="carrusel-autor">Javier Plo</p>
        </div>
      </div>
      <div class="carrusel-tarjeta">
        <img src="https://espacioatemtia.es/wp-content/uploads/2023/07/Piscina-Atemtia-Terapias-Acu%C3%A1ticas2-scaled-1280x852.jpg" class="carrusel-imagen">
        <div class="carrusel-content">
          <h3 class="carrusel-titulo">Curso 3</h3>
          <p class="carrusel-fecha">12 de febrero de 2025</p>
          <p class="carrusel-autor">Ruben Arnadillo</p>
        </div>
      </div>

      
     
    </div>

    <!-- SCROLL PARA EL CARRUSEL -->
    <div class="carrusel-scroll">
      <div class="carrusel-scrollbar"></div>
    </div>
  </div>
</template>

<style lang="scss">
 @import '../assets/styles/variables.scss';

.carrusel {
  margin-top: -95px;
  overflow: hidden;
  padding: 16px;
  margin-left: 40px;
  padding: 90px 10px 0;

  &-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding-bottom: 16px;
    scroll-behavior: smooth;
    align-items: center;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-tarjeta {
    flex: 0 0 85%; 
    background-color: $color-fondo;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  &-imagen {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }

  &-content {
    padding: 12px;

    .carrusel-titulo {
      font-size: 16px;
      color: #333;
      margin: 0 0 8px;
    }

    .carrusel-fecha,
    .carrusel-autor {
      font-size: 14px;
      color: #666;
    }
  }

  &-scroll {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: #EEEEEE;
    border-radius: 4px;
    margin-top: 8px;
    overflow: hidden;
    cursor: pointer;
  }

  &-scrollbar {
    height: 100%;
    width: 25%; 
    background-color: $color-boton;
    border-radius: 4px;
  }

  @media (min-width: 768px) { //Iniciamos la media query para pantallas de 768px 
  .carrusel-container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    justify-content: center; 
    align-items: center; 
    overflow-x: visible;
    padding-bottom: 0;
  }

  .carrusel-tarjeta {
    flex: initial;
    width: 22%;
    height: auto; 
   ; 
  }

  .carrusel-scroll {
    display: none; 
  }
}
}

</style>

