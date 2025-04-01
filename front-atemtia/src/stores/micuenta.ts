import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './login';

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

export const useMiCuentaStore = defineStore('miCuenta', () => {
  const tutor = ref<Tutor | null>(null);
  const usuarios = ref<Usuario[]>([]);
  const empleados = ref<Empleado[]>([]);
  const cargandoTutor = ref(false);
  const cargandoUsuarios = ref(false);
  const cargandoEmpleados = ref(false);
  const error = ref('');
  const usuarioSeleccionadoId = ref<string>(localStorage.getItem('ultimoUsuarioSeleccionado') || '');

  async function cargarTodosDatos() {
    const authStore = useAuthStore();
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
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error al cargar datos del tutor: ${response.status}`);
        tutor.value = await response.json();
        cargandoTutor.value = false;
  
        cargandoUsuarios.value = true;
        response = await fetch(`https://localhost:7163/api/Tutor/${userId}/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error al cargar usuarios: ${response.status}`);
        usuarios.value = await response.json();
        cargandoUsuarios.value = false;
  
          if (usuarios.value.length > 0) {
          seleccionarUsuario(usuarios.value[0].id);
        } else {
          console.log('No se encontró un usuario asignado a este tutor');
        }
  
      } else if (rol === 'Empleado') {

      } else {
        throw new Error('Rol no válido');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    }
  }
  

  function seleccionarUsuario(id: string) {
    const authStore = useAuthStore();

    if (authStore.rol !== 'Empleado') {
      usuarioSeleccionadoId.value = id;
      localStorage.setItem('ultimoUsuarioSeleccionado', id);

      if (authStore.usuarioSeleccionadoId !== undefined) {
        authStore.usuarioSeleccionadoId = id;
      }
      console.log('Usuario seleccionado:', id);
    } else {
      console.log('El rol empleado no tiene usuarios asignados.');
    }
  }

  function cerrarSesion() {
    const authStore = useAuthStore();
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

    cargarTodosDatos,
    seleccionarUsuario,
    cerrarSesion,
  };
});
