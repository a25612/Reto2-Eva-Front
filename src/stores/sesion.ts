import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useServiciosStore } from './servicios';

interface ReservaData {
  fechaHora: string | null;
  idCentro: number;
  idServicio: number;
  idOpcionServicio: number;
  idUsuario: number;
  idTutor: string;
  idEmpleado: number;
}

export const useSesionStore = defineStore('sesion', () => {
  const fechaHoraSeleccionada = ref<string | null>(null);
  const error = ref<string | null>(null);

  // Recupera el usuario y tutor desde localStorage
  const idUsuario = ref<number | null>(localStorage.getItem('ultimoUsuarioSeleccionado')
    ? Number(localStorage.getItem('ultimoUsuarioSeleccionado'))
    : null);
  
  const idTutor = ref<string>(localStorage.getItem('userId') ?? '');
  
  // Recupera el ID del empleado desde localStorage
  const idEmpleado = ref<number | null>(localStorage.getItem('idEmpleado')
    ? Number(localStorage.getItem('idEmpleado'))
    : null);

  // Añadimos la propiedad idOpcionServicio
  const idOpcionServicio = ref<number | null>(null);

  // Función para actualizar la fecha y hora seleccionada
  function seleccionarFechaHora(fechaHora: string) {
    fechaHoraSeleccionada.value = fechaHora;
  }

  // Función para confirmar la sesión
  async function confirmarSesion() {
    error.value = null;

    // Obtiene los datos del store de servicios
    const serviciosStore = useServiciosStore();
    const idCentro = serviciosStore.centroSeleccionado ?? 0;
    const idServicio = serviciosStore.servicioSeleccionado ?? 0;
    const idOpcion = idOpcionServicio.value ?? 0;  // Usamos idOpcionServicio
    const usuarioId = idUsuario.value ?? 0;
    const tutorId = idTutor.value.trim() || '';
    const empleadoId = idEmpleado.value ?? 0;  // Añadido idEmpleado

    // Log para depuración
    console.log('Datos antes de la validación:', {
      fechaHoraSeleccionada: fechaHoraSeleccionada.value,
      idCentro,
      idServicio,
      idOpcion,
      usuarioId,
      tutorId,
      empleadoId,  // Incluido empleadoId en el log
    });

    // Validación de datos requeridos
    if (!fechaHoraSeleccionada.value || !idCentro || !idServicio || !idOpcion || !usuarioId || !tutorId || !empleadoId) {
      error.value = 'Faltan datos para realizar la reserva.';
      return Promise.reject(new Error(error.value));
    }

    const reservaData: ReservaData = {
      fechaHora: fechaHoraSeleccionada.value,
      idCentro,
      idServicio,
      idOpcionServicio: idOpcion,  // Asegúrate de pasar el idOpcion correctamente
      idUsuario: usuarioId,
      idTutor: tutorId,
      idEmpleado: empleadoId,  // Asegúrate de incluir el idEmpleado
    };

    console.log('Objeto reservaData antes de enviar:', JSON.stringify(reservaData, null, 2));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://servicios-atemtia-api.retocsv.es/api/Sesion', {
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
    idOpcionServicio,  // Asegúrate de exportarlo
    idEmpleado,  // Exportamos idEmpleado
  };
});
