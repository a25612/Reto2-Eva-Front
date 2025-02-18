<script setup lang="ts">
  import Carrusel from '../components/Carrusel.vue';
  import BotonScrolltop from '../components/BotonScrolltop.vue';
  import MenuDesplegable from '../components/Menu-Desplegable.vue';
  import Calendario from '../components/Calendario.vue';
  import MiEspacio from '../components/MiEspacio.vue';

</script>
<template>

  <Calendario />

  <MenuDesplegable />
  
  <div class="titulo-anuncios">
    <!-- SEPARADOR -->
    <div class="separador">
      <span class="bar-separador"></span>
    </div>

    <!-- ANUNCIOS -->
    <div class="div-mi-espacio">
      <h2>Anuncios</h2>
    </div>

    <!-- SEPARADOR -->
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>
  </div>

  <Carrusel />

  <BotonScrolltop />
  <MiEspacio />



</template>

<style lang="scss">
@import '../assets/styles/variables.scss';
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

.div-mi-espacio {
  h2 {
    margin-top: 10px;
    margin-bottom: 30px;
    margin-left: 40px;
    color: $color-secundario;
    font-size: 22px;
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
}
</style>