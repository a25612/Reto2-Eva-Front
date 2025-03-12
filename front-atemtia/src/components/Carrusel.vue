<script setup lang="ts">
import { onMounted } from "vue";
import { useCarruselStore } from "../stores/carrusel";
import { iniciarCarrusel } from "../stores/carrusel"; 
import { computed } from 'vue';


const carruselStore = useCarruselStore();

onMounted(() => {
  carruselStore.obtenerAnuncios();
  iniciarCarrusel(); // Iniciar el carrusel al montar el componente
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

// Ordenar los anuncios por fecha de creación
const anunciosOrdenados = computed(() => {
  return carruselStore.anuncios.slice().sort((a, b) => {
    const fechaA = new Date(a.fecha_Publicacion).getTime();
    const fechaB = new Date(b.fecha_Publicacion).getTime();
    return fechaB - fechaA; // Orden descendente, de la más reciente a la más antigua
  });
});
</script>


<template>
  <!-- CARRUSEL DE ANUNCIOS -->
  <div class="carrusel">
    <div class="carrusel-container">
      <!-- Mostrar anuncios dinámicamente -->
      <div
        class="carrusel-tarjeta"
        v-for="anuncio in carruselStore.anuncios"
        :key="anuncio.id"
      >
        <img
          src="https://espacioatemtia.es/wp-content/uploads/2023/07/Piscina-Atemtia-Terapias-Acu%C3%A1ticas2-scaled-1280x852.jpg"
          class="carrusel-imagen"
          alt="Imagen del curso"
        />
        <div class="carrusel-content">
          <h3 class="carrusel-titulo">{{ anuncio.titulo }}</h3>
          <!-- Mostrar la fecha de publicación correctamente -->
          <p class="carrusel-fecha"> 📅 {{ formatFecha(anuncio.fecha_Publicacion) }}</p>
          <p class="carrusel-descripcion">{{ anuncio.descripcion }}</p>
        </div>
      </div>
    </div>

    <!-- SCROLL PARA EL CARRUSEL -->
    <div class="carrusel-scroll">
      <div class="carrusel-scrollbar"></div>
    </div>
  </div>
</template>





<style lang="scss" scoped>
@import "../assets/styles/variables.scss";

.carrusel {
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
    .carrusel-container {
      gap: 24px;
      padding: 0 20px;
    }

    .carrusel-tarjeta {
      width: 20%;
      height: 380px;
    }

    .carrusel-scroll {
      display: none;
    }
  }
}
</style>
