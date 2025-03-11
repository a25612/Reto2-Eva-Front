<script setup lang="ts">
import { onMounted } from "vue";
import { useCarruselStore } from "../stores/carrusel"; // Importamos la tienda de carrusel

// Usamos la tienda de carrusel
const carruselStore = useCarruselStore();

// Obtenemos los anuncios cuando el componente se monte
onMounted(() => {
  carruselStore.obtenerAnuncios();
});

const formatFecha = (fecha: string): string => {
    if (!fecha) return 'Fecha no disponible';
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    return dateObj.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          <p class="carrusel-fecha">{{ formatFecha(anuncio.fecha_Publicacion) }}</p>
          <p class="carrusel-descripcion">{{ anuncio.descripcion }}</p>
          <p class="carrusel-autor">{{ anuncio.autor }}</p>
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
@import "../assets/styles/variables.scss";

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
    height: 320px; /* Altura fija para todas las tarjetas */
    overflow: hidden;

    &-content {
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between; /* Para distribuir el contenido uniformemente */
      height: 100%; /* Asegurar que el contenido ocupe todo el espacio disponible */

      .carrusel-titulo {
        font-size: 16px;
        color: #333;
        margin: 0 0 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; /* Para evitar que el título se desborde */
      }

      .carrusel-fecha,
      .carrusel-autor {
        font-size: 14px;
        color: #666;
      }

      .carrusel-descripcion {
        font-size: 14px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Limitar la descripción a 2 líneas */
        -webkit-box-orient: vertical;
      }
    }

    &-imagen {
      width: 100%;
      height: 80px; /* Imagen más pequeña */
      object-fit: cover;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      margin-right: 70px;
      justify-content: center;
      align-items: center;
      overflow-x: visible;
      padding-bottom: 0;
    }

    .carrusel-tarjeta {
      flex: initial;
      width: 22%;
      height: 320px; /* Asegurar que en pantallas más grandes las tarjetas tengan la misma altura */
    }

    .carrusel-scroll {
      display: none;
    }
  }

  /* Media query para pantallas grandes */
  @media (min-width: 1200px) {
    .carrusel-container {
      gap: 24px; /* Más espacio entre tarjetas en pantallas grandes */
      margin-left: 100px;
      padding: 0 20px;
    }

    .carrusel-tarjeta {
      width: 20%; /* Aumentar el tamaño de las tarjetas */
      height: 380px; /* Altura mayor para las pantallas grandes */
    }
  }
}


</style>
