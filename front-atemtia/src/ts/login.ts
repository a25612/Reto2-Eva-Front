import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useLogin() {
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();

  async function login() {
    error.value = '';

    try {
      const response = await fetch('http://localhost:5248/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol); 

      if (data.rol = 'Empleado') {
        router.push('/'); 
      } else {
        router.push('/home-app-atemtia'); 
      }

    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión';
    }
  }

  return { username, password, error, login };
}
