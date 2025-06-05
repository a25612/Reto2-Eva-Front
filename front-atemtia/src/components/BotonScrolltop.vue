<script setup>
import { useBotonScroll } from '../ts/boton-scrolltop';

const { mostrarBotonScroll, scrollToTop } = useBotonScroll();
</script>

<template>
  <button 
    class="boton-scroll-top" 
    :class="{ mostrar: mostrarBotonScroll }" 
    @click="scrollToTop">
    <i class="fa-solid fa-arrow-up"></i>
  </button>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.boton-scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: $color-boton;
  color: $color-fondo;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  visibility: hidden;
}

.boton-scroll-top.mostrar {
  opacity: 1;
  visibility: visible;
}

.boton-scroll-top:active {
  background-color: $color-boton;
}
</style>
