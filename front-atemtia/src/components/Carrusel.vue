<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useCarruselStore } from "../stores/carrusel";
import { iniciarCarrusel } from "../stores/carrusel"; 

const carruselStore = useCarruselStore();

onMounted(() => {
  carruselStore.obtenerAnuncios();
  iniciarCarrusel();
});

const formatFecha = (fecha: string): string => {
    if (!fecha) return 'Fecha no disponible';
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    return dateObj.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
};

const anunciosRecientes = computed(() => {
  return carruselStore.anuncios
    .slice()
    .sort((a, b) => new Date(b.fecha_Publicacion).getTime() - new Date(a.fecha_Publicacion).getTime())
    .slice(0, 3);
});
</script>

<template>
  <div class="carrusel">
    <div class="carrusel-container">
      <div
        class="carrusel-tarjeta"
        v-for="anuncio in anunciosRecientes"
        :key="anuncio.id"
      >
        <img
          src="https://espacioatemtia.es/wp-content/uploads/2023/07/Piscina-Atemtia-Terapias-Acu%C3%A1ticas2-scaled-1280x852.jpg"
          class="carrusel-imagen"
          alt="Imagen del curso"
        />
        <div class="carrusel-content">
          <h3 class="carrusel-titulo">{{ anuncio.titulo }}</h3>
          <p class="carrusel-fecha"> 📅 {{ formatFecha(anuncio.fecha_Publicacion) }}</p>
          <p class="carrusel-descripcion">{{ anuncio.descripcion }}</p>
        </div>
      </div>
    </div>
    <div class="carrusel-scroll">
      <div class="carrusel-scrollbar"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/styles/variables.scss";

.carrusel {
  font-family: $fuente-principal;
  margin-top: -95px;
  overflow: hidden;
  padding: 90px 10px 0;
  margin-left: 40px;

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

  &-content {
    flex-direction: column;
    text-align: center;
  }

  &-tarjeta {
    flex: 0 0 66%;
    background-color: $color-fondo;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 320px; 
    overflow: hidden;

    &-imagen {
      width: 100%;
      height: 80px; 
      object-fit: cover;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }

  &-titulo {
    color: $color-secundario;
    font-size: 1.2rem;
    font-weight: bold;  
    margin: 10px 0;
    line-height: 1.4;
    transition: color 0.3s ease, font-size 0.3s ease;

    &:hover {
      font-size: 1.3rem;
    }
  }

  &-descripcion {
    color: black;
    font-size: 1rem;
    margin-bottom: 10px;
    line-height: 1.5;
    transition: color 0.3s ease;
  }

  &-scroll {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: #eeeeee;
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

  @media (min-width: 768px) {
  .carrusel {
    margin-top: -95px;
    overflow: hidden;
    padding: 90px 20px 0;
    display: flex;
    justify-content: center;  // Para centrar el contenido horizontalmente

    &-container {
      gap: 24px;
      padding: 11 ;
      display: flex;
      justify-content: center;  
      align-items: center;  
    }

    &-tarjeta {
      flex: 0 0 20%;
      height: 380px;
      display: flex;
     
    }

    &-scroll {
      display: none;
    }
  }
}
}
</style>
