import { ref } from 'vue';
import type { Ref } from 'vue';

interface Centro {
  id: number;
  nombre: string;
  direccion: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: string;
}

export function useServicios() {
  const centros: Ref<Centro[]> = ref([]);
  const servicios: Ref<Servicio[]> = ref([]);
  const centroSeleccionado: Ref<number | null> = ref(null);
  const nombreCentroSeleccionado: Ref<string> = ref('');
  const cargandoCentros: Ref<boolean> = ref(true);
  const cargandoServicios: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');

  // Cargar todos los centros
  async function cargarCentros() {
    cargandoCentros.value = true;
    error.value = '';
    
    try {
      const response = await fetch('https://localhost:7163/api/Centro');
      if (!response.ok) {
        throw new Error(`Error al cargar los centros: ${response.status}`);
      }
      
      centros.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar centros';
      console.error('Error al cargar centros:', err);
    } finally {
      cargandoCentros.value = false;
    }
  }

  // Cargar servicios por centro
  async function cargarServiciosPorCentro(centroId: number) {
    if (!centroId) return;
    
    centroSeleccionado.value = centroId;
    cargandoServicios.value = true;
    servicios.value = [];
    error.value = '';
    
    // Guardar el nombre del centro seleccionado
    const centroSeleccionadoObj = centros.value.find(c => c.id === centroId);
    if (centroSeleccionadoObj) {
      nombreCentroSeleccionado.value = centroSeleccionadoObj.nombre;
    }
    
    try {
      const response = await fetch(`https://localhost:7163/api/Servicios/porCentro/${centroId}`);
      if (!response.ok) {
        throw new Error(`Error al cargar los servicios: ${response.status}`);
      }
      
      servicios.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar servicios';
      console.error('Error al cargar servicios:', err);
    } finally {
      cargandoServicios.value = false;
    }
  }

  // Formatear precio como moneda
  function formatPrecio(precio: number): string {
    return precio.toFixed(2) + ' €';
  }

  return {
    centros,
    servicios,
    centroSeleccionado,
    nombreCentroSeleccionado,
    cargandoCentros,
    cargandoServicios,
    error,
    cargarCentros,
    cargarServiciosPorCentro,
    formatPrecio
  };
}
