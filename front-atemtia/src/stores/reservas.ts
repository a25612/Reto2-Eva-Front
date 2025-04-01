import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Reserva {
  id: number;
  fecha: string;
  usuario: {
    nombre: string; 
  };
  servicio: {
    nombre: string;
  };
  empleado: {
    nombre: string;
  };
  centro: {
    nombre: string;
  };
  opcionServicio: {
    precio: number;
  };
  facturar: boolean;
}

export const useReservasStore = defineStore('reservas', () => {
  const reservas = ref<Reserva[]>([]);
  const cargando = ref(false);
  const error = ref('');

  async function cargarReservas() {
  const userId =
    localStorage.getItem('ultimoUsuarioSeleccionado') ||
    localStorage.getItem('userId');
  const rol = localStorage.getItem('rol');

  if (!userId || !rol) {
    error.value = 'No se encontró información de usuario o rol';
    return;
  }

  cargando.value = true;
  error.value = '';

  try {
    let url = '';
    if (rol === 'Tutor') {
      url = `https://localhost:7163/api/Sesion/Usuario/${userId}`;
    } else if (rol === 'Empleado') {
      url = `https://localhost:7163/api/Sesion/Empleado/${userId}`;
    } else {
      throw new Error('Rol no válido');
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      reservas.value = [];
      error.value = 'No hay reservas registradas de este usuario';
      return;
    }

    if (!response.ok) {
      throw new Error(`Error al cargar reservas: ${response.status}`);
    }

    reservas.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    cargando.value = false;
  }
}


  return { reservas, cargando, error, cargarReservas };
});
