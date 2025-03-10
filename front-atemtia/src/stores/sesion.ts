import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useServiciosStore } from './servicios';

interface ReservaData {
  fechaHora: string | null;
  idCentro: number | null;
  idServicio: number | null;
  idOpcionServicio: number | null;
  idUsuario: number | null;
  idTutor: string | undefined;
}

export const useSesionStore = defineStore('sesion', () => {
  const fechaHoraSeleccionada = ref<string | null>(null);
  const error = ref<string | null>(null);

  // Recupera el usuario desde localStorage si existe
  const idUsuario = ref<number | null>(null);
  const idTutor = ref<string | undefined>(localStorage.getItem('userId') || undefined);

  // Si hay un usuario seleccionado, lo recuperamos
  idUsuario.value = localStorage.getItem('ultimoUsuarioSeleccionado') 
    ? Number(localStorage.getItem('ultimoUsuarioSeleccionado')) 
    : null;

  function seleccionarFechaHora(fechaHora: string) {
    fechaHoraSeleccionada.value = fechaHora;
  }

  async function confirmarSesion() {
    error.value = null;

    // Recoge los datos de los stores necesarios
    const serviciosStore = useServiciosStore();
    const idCentro = serviciosStore.centroSeleccionado;
    const idServicio = serviciosStore.servicioSeleccionado;
    const idOpcionServicio = serviciosStore.opcionSeleccionada;

    // Log para ver qué datos tenemos
    console.log('Datos antes de la validación:');
    console.log('Fecha Hora Seleccionada:', fechaHoraSeleccionada.value);
    console.log('Centro:', idCentro);
    console.log('Servicio:', idServicio);
    console.log('Opción de Servicio:', idOpcionServicio);
    console.log('Usuario:', idUsuario.value);
    console.log('Tutor:', idTutor.value);

    const reservaData: ReservaData = {
      fechaHora: fechaHoraSeleccionada.value,
      idCentro: idCentro,
      idServicio: idServicio,
      idOpcionServicio: idOpcionServicio,
      idUsuario: idUsuario.value,
      idTutor: idTutor.value,
    };

    // Validación de los datos
    if (
      !fechaHoraSeleccionada.value ||
      !idCentro ||
      !idServicio ||
      !idOpcionServicio ||
      !idUsuario.value ||
      !idTutor.value
    ) {
      error.value = 'Faltan datos para realizar la reserva.';
      return Promise.reject(new Error(error.value));
    }

    // Imprime el objeto reservaData antes de enviar a la API
    console.log('Objeto reservaData antes de enviar a la API:', JSON.stringify(reservaData, null, 2));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7163/api/Sesion', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al confirmar la sesión: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (err: any) {
      error.value = err.message || 'Error desconocido al confirmar la sesión.';
      console.error('Error al confirmar la sesión:', err);
    }
  }

  return {
    fechaHoraSeleccionada,
    error,
    seleccionarFechaHora,
    confirmarSesion,
    idUsuario,
    idTutor,
  };
});
