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

  // Utiliza refs para los IDs que necesitas
  const idCentro = ref<number | null>(null);
  const idServicio = ref<number | null>(null);
  const idOpcionServicio = ref<number | null>(null);
  const idUsuario = ref<number | null>(null);
  const idTutor = ref<string | undefined>(
    localStorage.getItem('userId') === null ? undefined : localStorage.getItem('userId')!
  );

  function seleccionarFechaHora(fechaHora: string) {
    fechaHoraSeleccionada.value = fechaHora;
  }

  async function confirmarSesion() {
    error.value = null;

    // Recoge los datos de los stores necesarios
    const serviciosStore = useServiciosStore();
    idCentro.value = serviciosStore.centroSeleccionado;
    idServicio.value = serviciosStore.servicioSeleccionado;
    idOpcionServicio.value = serviciosStore.opcionSeleccionada;
    idUsuario.value = serviciosStore.usuarioSeleccionado;

    if (
      !fechaHoraSeleccionada.value ||
      !idCentro.value ||
      !idServicio.value ||
      !idOpcionServicio.value ||
      !idUsuario.value ||
      !idTutor.value
    ) {
      error.value = 'Faltan datos para realizar la reserva.';
      return Promise.reject(new Error(error.value));
    }

    const reservaData: ReservaData = {
      fechaHora: fechaHoraSeleccionada.value,
      idCentro: idCentro.value,
      idServicio: idServicio.value,
      idOpcionServicio: idOpcionServicio.value,
      idUsuario: idUsuario.value,
      idTutor: idTutor.value, 
    };

    // Imprime el objeto JSON para depuración
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
    idCentro,
    idServicio,
    idOpcionServicio,
    idUsuario,
    idTutor,
  };
});
