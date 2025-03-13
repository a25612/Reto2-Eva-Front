import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const rol = ref(localStorage.getItem('rol') || '');
  const userId = ref(localStorage.getItem('userId') || '');
  const error = ref('');
  const router = useRouter();

  const usuarioSeleccionadoId = ref(localStorage.getItem('ultimoUsuarioSeleccionado') || '');

  async function login(username: string, password: string) {
    error.value = '';

    try {
      const response = await fetch('http://servicios-atemtia-api.retocsv.es/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      token.value = data.token;
      rol.value = data.rol;
      userId.value = data.iduser;

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('userId', data.iduser);

      router.push('/home-app-atemtia');
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión';
    }
  }

  function setSelectedUser(id: string) {
    // Solo guardar usuario seleccionado si el rol no es "Empleado"
    if (rol.value !== 'Empleado') {
      usuarioSeleccionadoId.value = id;
      localStorage.setItem('ultimoUsuarioSeleccionado', id);
    }
  }

  function logout() {
    token.value = '';
    rol.value = '';
    userId.value = '';
    usuarioSeleccionadoId.value = '';

    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    localStorage.removeItem('ultimoUsuarioSeleccionado');

    router.push('/login');
  }

  return { token, rol, userId, usuarioSeleccionadoId, error, login, logout, setSelectedUser };
});
