import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

interface Centro {
  id: number;
  nombre: string;
  direccion: string;
}

interface OpcionServicio {
  id: number;
  sesionesPorSemana: number | null;
  duracionMinutos: number | null;
  precio: number;
  descripcion: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  opciones: OpcionServicio[];
}

interface Usuario {
  id: number;
  nombre: string;
}

export const useServiciosStore = defineStore('servicios', () => {
  const centros: Ref<Centro[]> = ref([]);
  const servicios: Ref<Servicio[]> = ref([]);
  const centroSeleccionado: Ref<number | null> = ref(null);
  const nombreCentroSeleccionado: Ref<string> = ref('');
  const cargandoCentros: Ref<boolean> = ref(true);
  const cargandoServicios: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');
  const tutorId: Ref<string | null> = ref(localStorage.getItem('userId'));
  const usuariosAsignados: Ref<Usuario[]> = ref([]);
  const usuarioSeleccionado: Ref<number | null> = ref(null);
  const servicioSeleccionado: Ref<number | null> = ref(null);
  const opcionSeleccionada: Ref<number | null> = ref(null);

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

  async function cargarServiciosPorCentro(centroId: number) {
    if (!centroId) return;
    
    centroSeleccionado.value = centroId;
    cargandoServicios.value = true;
    servicios.value = [];
    error.value = '';
    
    const centroSeleccionadoObj = centros.value.find(c => c.id === centroId);
    if (centroSeleccionadoObj) {
      nombreCentroSeleccionado.value = centroSeleccionadoObj.nombre;
    }
    
    try {
      const response = await fetch(`https://localhost:7163/api/Servicios/centros/${centroId}`);
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

  async function cargarUsuariosAsignados() {
    if (!tutorId.value) {
      error.value = 'No se encontró ID del tutor';
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:7163/api/Tutor/${tutorId.value}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar usuarios asignados: ${response.status}`);
      }

      usuariosAsignados.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios asignados';
      console.error('Error al cargar usuarios asignados:', err);
    }
  }

  function seleccionarUsuario(userId: number) {
    usuarioSeleccionado.value = userId;
  }

  function seleccionarServicio(servicioId: number) {
    servicioSeleccionado.value = servicioId;
  }

  function seleccionarOpcion(opcionId: number) {
    opcionSeleccionada.value = opcionId;
  }

  return {
    centros,
    servicios,
    centroSeleccionado,
    nombreCentroSeleccionado,
    cargandoCentros,
    cargandoServicios,
    error,
    tutorId,
    usuariosAsignados,
    usuarioSeleccionado,
    servicioSeleccionado,
    opcionSeleccionada,
    cargarCentros,
    cargarServiciosPorCentro,
    cargarUsuariosAsignados,
    seleccionarUsuario,
    seleccionarServicio,
    seleccionarOpcion
  };
});
