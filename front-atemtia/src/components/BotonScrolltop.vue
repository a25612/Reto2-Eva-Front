<script>
import botonScroll from '../js/boton-scrolltop.js';

export default {
  ...botonScroll
};
</script>

<template>
  <button 
    class="boton-scroll-top" 
    :class="{ mostrar: mostrarBotonScroll }" 
    @click="scrollToTop">
    ↑
  </button>
</template>

<style lang="scss">
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
  transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  visibility: hidden;
}

.boton-scroll-top.mostrar {
  opacity: 1;
  visibility: visible;
}

.boton-scroll-top:active,
.boton-scroll-top:focus {
  background-color: $color-boton;
}
</style>
