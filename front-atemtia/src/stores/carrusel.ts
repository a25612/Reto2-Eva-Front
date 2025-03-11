import { defineStore } from "pinia";

export const useCarruselStore = defineStore("carrusel", {
  state: () => ({
    anuncios: [] as Array<{
      id: number;
      titulo: string;
      descripcion: string;
      fecha_Publicacion: string;
      autor: string;
    }>,
  }),

  actions: {
    // Función para obtener los anuncios desde la API
    async obtenerAnuncios() {
      try {
        const response = await fetch("https://localhost:7163/api/Anuncio", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los anuncios");
        }

        const data = await response.json();

        // Convertir la fecha de publicación a tipo Date
        this.anuncios = data.map((anuncio: any) => ({
          ...anuncio,
          fecha_PUBLICACION: new Date(anuncio.fecha_PUBLICACION), // Convertir la fecha a Date
        }));
      } catch (error) {
        console.error("Error al obtener los anuncios:", error);
      }
    },
  },
});

// Función para iniciar y controlar el carrusel
export function iniciarCarrusel() {
  const contenedor = document.querySelector('.carrusel-container') as HTMLElement;
  const scrollbar = document.querySelector('.carrusel-scrollbar') as HTMLElement;
  const scroll = document.querySelector('.carrusel-scroll') as HTMLElement;

  // Sincronizar el movimiento del carrusel con la barra de desplazamiento
  contenedor.addEventListener('scroll', () => {
    const scrollPercentage = contenedor.scrollLeft / (contenedor.scrollWidth - contenedor.clientWidth);
    scrollbar.style.transform = `translateX(${scrollPercentage * (scroll.clientWidth - scrollbar.clientWidth)}px)`;
  });

  // Funcionalidad para arrastrar la barra de desplazamiento (pulgar)
  let isDragging = false;
  let startX: number;

  scrollbar.addEventListener('mousedown', (e: MouseEvent) => {
    isDragging = true;
    startX = e.clientX;
    document.body.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;

    const move = e.clientX - startX;
    const scrollPosition = contenedor.scrollLeft + move;
    contenedor.scrollLeft = scrollPosition;
    startX = e.clientX;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
  });
}
