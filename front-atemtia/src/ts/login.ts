import { ref} from 'vue';
import { useRouter} from 'vue-router';

export function useLogin() {
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();

  function login() {
    if (username.value === 'admin' && password.value === '1234') {
      router.push('/home-app-atemtia'); // ← Redirigir a la página de inicio
    } else {
      error.value = 'Usuario o contraseña incorrectos';
    }
  }

  return { username, password, error, login };
}
