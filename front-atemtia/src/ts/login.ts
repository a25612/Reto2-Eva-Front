import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useLogin() {
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();

  async function login() {
    error.value = ''; // Resetear error antes de realizar la solicitud

    try {
      const response = await fetch('https://localhost:7163/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
      });

      if (!response.ok) {
        let errorMessage = 'Error al iniciar sesión';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error('Error al analizar la respuesta JSON:', err);
        }
        throw new Error(errorMessage);
      }

      // Obtener los datos del usuario y el token
      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      // Guardar el token y el rol en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('userId', data.iduser);

      console.log('Token guardado en localStorage:', localStorage.getItem('token'));
      console.log('Id de usuario guardado en localStorage:', localStorage.getItem('userId'));

      // Redirigir según el rol del usuario
      if (data.rol === 'Empleado') {
        router.push('/');
      } else {
        router.push('/home-app-atemtia');
      }

    } catch (err: any) {
      // Mostrar mensaje de error si algo falla
      error.value = err.message || 'Error al iniciar sesión';
    }
  }

  return { username, password, error, login };
}
