import { ref } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '../stores/login';

interface Tutor {
  nombre: string;
  email: string;
  activo: boolean;
  rol: string;
}

export interface Usuario {
  id: string;
  nombre: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  dni: string;
}

export function useMiCuenta() {
  const authStore = useAuthStore();
  const tutor: Ref<Tutor | null> = ref(null);
  const usuarios: Ref<Usuario[]> = ref([]);
  const empleados: Ref<Empleado[]> = ref([]);
  const cargandoTutor: Ref<boolean> = ref(false);
  const cargandoUsuarios: Ref<boolean> = ref(false);
  const cargandoEmpleados: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');
  const usuarioSeleccionadoId: Ref<string> = ref('');

  async function cargarTodosDatos() {
    const userId = authStore.userId;
    const rol = authStore.rol;

    if (!userId || !rol) {
      error.value = 'No se encontró información de usuario';
      return;
    }

    error.value = '';

    try {
      const token = authStore.token;
      let response;

      if (rol === 'Tutor') {
        cargandoTutor.value = true;
        response = await fetch(`https://localhost:7163/api/Tutor/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Error al cargar datos del tutor: ${response.status}`);
        tutor.value = await response.json();
        cargandoTutor.value = false;

        cargandoUsuarios.value = true;
        response = await fetch(`https://localhost:7163/api/Tutor/${userId}/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Error al cargar usuarios: ${response.status}`);
        usuarios.value = await response.json();
        cargandoUsuarios.value = false;

      } else if (rol === 'Empleado') {
        cargandoEmpleados.value = true;
        response = await fetch(`https://localhost:7163/api/Empleado/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Error al cargar datos del empleado: ${response.status}`);
        empleados.value = [await response.json()];
        cargandoEmpleados.value = false;
      } else {
        throw new Error('Rol no válido');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    }
  }

  function seleccionarUsuario(id: string) {
    usuarioSeleccionadoId.value = id;
    localStorage.setItem('ultimoUsuarioSeleccionado', id);
  }

  function cerrarSesion() {
    authStore.logout();
  }

  return {
    tutor,
    usuarios,
    empleados,
    cargandoTutor,
    cargandoUsuarios,
    cargandoEmpleados,
    error,
    usuarioSeleccionadoId,
    cargarTodosDatos, // Se renombró correctamente
    seleccionarUsuario,
    cerrarSesion
  };
}
