import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_Publicacion: string;
  activo: boolean;
}

export const useAnunciosStore = defineStore('anuncios', () => {
  const anuncios = ref<Anuncio[]>([]);
  
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

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('http://servicios-atemtia-api.retocsv.es/api/Anuncio');
      if (!response.ok) throw new Error('Error al obtener anuncios');
      
      const data = await response.json();
      anuncios.value = data
        .filter((anuncio: Anuncio) => anuncio.activo) // Filtrar solo anuncios activos
        .map((anuncio: Anuncio) => ({
          ...anuncio,
          fecha_Publicacion: formatFecha(anuncio.fecha_Publicacion),
        }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    anuncios,
    fetchAnuncios,
  };
});
