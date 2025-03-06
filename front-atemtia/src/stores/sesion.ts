import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSesionStore = defineStore('sesiones', () => {
  const sesionEnProceso = ref<{
    centroId: number | null;
    servicioId: number | null;
    opcionServicioId: number | null;
    usuarioId: number | null;
    tutorId: number | null;
  }>({
    centroId: null,
    servicioId: null,
    opcionServicioId: null,
    usuarioId: null,
    tutorId: null
  });

  const error = ref('');

  function iniciarSesion(centroId: number, servicioId: number, opcionServicioId: number, usuarioId: number, tutorId: number) {
    sesionEnProceso.value = { centroId, servicioId, opcionServicioId, usuarioId, tutorId };
  }

  async function confirmarSesion() {
    if (!sesionEnProceso.value.centroId || !sesionEnProceso.value.servicioId || 
        !sesionEnProceso.value.opcionServicioId || !sesionEnProceso.value.usuarioId || 
        !sesionEnProceso.value.tutorId) {
      error.value = 'Faltan datos para la sesión';
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7163/api/Sesiones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sesionEnProceso.value)
      });

      if (!response.ok) throw new Error('Error al confirmar la sesión');

      const sesionConfirmada = await response.json();
      console.log('Sesión confirmada:', sesionConfirmada);
      
      // Reset sesión en proceso
      sesionEnProceso.value = {
        centroId: null,
        servicioId: null,
        opcionServicioId: null,
        usuarioId: null,
        tutorId: null
      };

      return sesionConfirmada;
    } catch (err) {
      console.error('Error al confirmar la sesión:', err);
      error.value = 'Error al confirmar la sesión';
    }
  }

  return {
    sesionEnProceso,
    error,
    iniciarSesion,
    confirmarSesion
  };
});
