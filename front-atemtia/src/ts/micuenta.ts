import { ref } from 'vue';
import type { Ref } from 'vue';

interface Tutor {
  nombre: string;
  email: string;
  activo: boolean;
  rol: string;
}

interface Usuario {
  nombre: string;
}

export function useMiCuenta() {
  const tutor: Ref<Tutor | null> = ref(null);
  const usuarios: Ref<Usuario[]> = ref([]);
  const cargandoTutor: Ref<boolean> = ref(false);
  const cargandoUsuarios: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');

  // Obtener información del tutor
  async function cargarDatosTutor() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      error.value = 'No se encontró ID del tutor';
      return;
    }

    cargandoTutor.value = true;
    error.value = '';

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://localhost:7163/api/Tutor/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar datos del tutor: ${response.status}`);
      }

      tutor.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar datos del tutor';
      console.error('Error al cargar datos del tutor:');
    } finally {
      cargandoTutor.value = false;
    }
  }

  // Obtener usuarios asignados al tutor
  async function cargarUsuariosAsignados() {
    const userId = localStorage.getItem('userId') || localStorage.getItem('userId') || localStorage.getItem('id');

    if (!userId) {
      error.value = 'No se encontró ID del tutor';
      return;
    }

    cargandoUsuarios.value = true;
    error.value = '';

    try {
      const token = localStorage.getItem('token');
      const url = `https://localhost:7163/api/Tutor/${userId}/usuarios`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar usuarios: ${response.status}`);
      }

      usuarios.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios';
      console.error('Error al cargar usuarios:');
    } finally {
      cargandoUsuarios.value = false;
    }
  }

  // Función para cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem('tutorId');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    localStorage.removeItem('id');
  }

  // Cargar todos los datos
  async function cargarTodosDatos() {
    await cargarDatosTutor();
    await cargarUsuariosAsignados();
  }

  return {
    tutor,
    usuarios,
    cargandoTutor,
    cargandoUsuarios,
    error,
    cargarDatosTutor,
    cargarUsuariosAsignados,
    cargarTodosDatos,
    cerrarSesion
  };
}
