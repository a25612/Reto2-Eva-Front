import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const rol = ref(localStorage.getItem('rol') || '');
  const userId = ref(localStorage.getItem('userId') || '');
  const error = ref('');
  const router = useRouter();

  async function login(username: string, password: string) {
    error.value = '';

    try {
      const response = await fetch('https://localhost:7163/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
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

      router.push(data.rol === '' ? '/' : '/home-app-atemtia');
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión';
    }
  }

  function logout() {
    token.value = '';
    rol.value = '';
    userId.value = '';

    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');

    router.push('/login');
  }

  return { token, rol, userId, error, login, logout };
});
