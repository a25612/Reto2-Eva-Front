import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSesionStore = defineStore('sesiones', () => {
  const sesionEnProceso = ref<{
    centroId: number | null;
    servicioId: number | null;
    opcionServicioId: number | null;
    usuarioId: number | null;
    tutorId: number | null;
    fechaHora: string | null; // Fecha y hora seleccionadas
  }>({
    centroId: null,
    servicioId: null,
    opcionServicioId: null,
    usuarioId: null,
    tutorId: null,
    fechaHora: null,
  });

  const error = ref<string>('');

  function seleccionarFechaHora(fechaHora: string) {
    sesionEnProceso.value.fechaHora = fechaHora;
  }

  async function confirmarSesion() {
    if (!sesionEnProceso.value.fechaHora) {
      throw new Error('Faltan datos para confirmar la sesión.');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7163/api/Sesiones/Reservar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sesionEnProceso.value),
      });

      if (!response.ok) throw new Error('Error al confirmar la sesión.');

      const data = await response.json();
      console.log('Sesión confirmada:', data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    sesionEnProceso,
    error,
    seleccionarFechaHora,
    confirmarSesion,
  };
});