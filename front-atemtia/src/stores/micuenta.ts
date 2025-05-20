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

export interface Profesional {
  id: string;
  nombre: string;
  dni: string;
}

export const useMiCuentaStore = defineStore('miCuenta', () => {
  const tutor = ref<Tutor | null>(null);
  const usuarios = ref<Usuario[]>([]);
  const profesionales = ref<Profesional[]>([]);
  const cargandoTutor = ref(false);
  const cargandoUsuarios = ref(false);
  const cargandoProfesionales = ref(false);
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
      const userId = authStore.userId;  // Asegúrate de obtener también el userId del store
      let response;
      if (rol === 'Tutor') {
        cargandoTutor.value = true;
        response = await fetch(`https://localhost:7163/api/Tutor/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error al cargar datos del tutor: ${response.status}`);
        tutor.value = await response.json();
        cargandoTutor.value = false;
      }
      if (rol === 'Tutor') {
        cargandoUsuarios.value = true;
        response = await fetch(`https://localhost:7163/api/Tutor/${userId}/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error al cargar usuarios: ${response.status}`);
        usuarios.value = await response.json();
        cargandoUsuarios.value = false;
      } else if (rol === 'Profesional') {
        cargandoProfesionales.value = true;
        response = await fetch(`https://localhost:7163/api/Profesional/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`Error al cargar datos del profesional: ${response.status}`);
        profesionales.value = [await response.json()];  // Empaquetamos en un array
        cargandoProfesionales.value = false;
      } else {
        throw new Error('Rol no válido');
      }    

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    }
    
  }

  function cerrarSesion() {
    const authStore = useAuthStore();
    authStore.logout();
  }

  function seleccionarUsuario(id: string) {
    usuarioSeleccionadoId.value = id;
    localStorage.setItem('ultimoUsuarioSeleccionado', id);
  }

  return {
    tutor,
    usuarios,
    profesionales,
    cargandoTutor,
    cargandoUsuarios,
    cargandoProfesionales,
    error,
    usuarioSeleccionadoId,  
    cargarTodosDatos,
    cerrarSesion,
    seleccionarUsuario, 
  };
});