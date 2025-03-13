<script setup lang="ts">
import { onMounted } from "vue";
import { useAnunciosStore } from "../stores/anuncioshome";

const store = useAnunciosStore();

onMounted(() => {
  store.fetchAnuncios();
});
</script>

<template>
  <div class="contenedor-anuncios">
    <router-link to="/home-app-atemtia" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="titulo">Últimos Anuncios</h1>
    <div class="anuncios-grid">
      <div v-for="anuncio in store.anuncios" :key="anuncio.id" class="anuncio">
        <h2 class="titulo-anuncio">{{ anuncio.titulo }}</h2>
        <p class="descripcion">{{ anuncio.descripcion }}</p>
        <span class="fecha">📅 {{ anuncio.fecha_Publicacion }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped scoped>
@import '../assets/styles/variables.scss';

.contenedor-anuncios {
  text-align: center;
  padding: 20px;
}

.titulo {
  color: $color-titulos;
  font-size: 2rem;
  margin-bottom: 20px;
}

.anuncios-grid {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 96px;
  padding: 20px;
}

.anuncio {
  background-color: $color-fondo;
  border: 1px solid $color-principal;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
}

.titulo-anuncio {
  color: $color-secundario;
  font-size: 1.5rem;
  margin: 10px 0;
}

.descripcion {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
}

.fecha {
  display: block;
  font-size: 0.9rem;
  color: gray;
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


@media (min-width: 768px) {
  .anuncios-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
