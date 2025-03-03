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
  <div class="separador-abajo"> </div>

  <router-link to="/home-app-atemtia/anuncios" class="btn-anuncios">
    <button>Anuncios</button>
  </router-link>

  <div class="separador-abajo"></div>
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

.div-mi-espacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h2 {
    margin: 17px 15px 40px 40px;
    color: $color-secundario;
    font-size: 22px;
  }

  .btn-anuncios {
    margin-bottom: 20px;
    background: none;
    border: none;
    font-size: 22px;
    font-weight: bold;
    color: $color-secundario;
    cursor: pointer;
    padding: 10px;
    transition: color 0.3s ease, transform 0.2s ease;

    
  }

  .separador-abajo {
    display: flex;
    justify-content: center;
    width: 100%;

    .bar-separador {
      margin-bottom: 25px;
      width: 350px;
      height: 1px;
      
    }
  }

  .mi-espacio-grid {
    display: grid;
    justify-items: center;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    max-width: 350px;
    margin: 0 auto;
  }
}

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

@media (min-width: 768px) { 
  .titulo-anuncios {
    margin-right: 32px;
  }
}
</style>
