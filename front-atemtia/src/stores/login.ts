import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Usuario {
  id: string;
  nombre: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const rol = ref(localStorage.getItem('rol') || '');
  const userId = ref(localStorage.getItem('userId') || '');
  const error = ref('');
  const router = useRouter();

  // Almacena todos los IDs de usuarios asignados al tutor
  const usuariosAsignadosIds = ref<string[]>([]);

  async function login(username: string, password: string) {
    error.value = '';
  
    try {
      const response = await fetch('https://localhost:7163/api/auth/login', {
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

      if (data.rol === 'Tutor') {
        // Fetch de usuarios asignados al tutor
        const usuariosResponse = await fetch(`https://localhost:7163/api/Tutor/${data.iduser}/usuarios`, {
          headers: { 'Authorization': `Bearer ${data.token}`, 'Content-Type': 'application/json' },
        });
      
        if (!usuariosResponse.ok) {
          throw new Error('Error al cargar los usuarios asociados');
        }
      
        const usuariosData = await usuariosResponse.json() as Usuario[];
      
        // Almacenar todos los IDs de usuarios asignados
        usuariosAsignadosIds.value = usuariosData.map((usuario) => usuario.id);
        console.log('Usuarios asignados:', usuariosAsignadosIds.value);

        // Guardar en localStorage para persistencia
        localStorage.setItem('usuariosAsignadosIds', JSON.stringify(usuariosAsignadosIds.value));
      }
      
      router.push('/home-app-atemtia'); 
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión';
    }
  }

  function logout() {
    token.value = '';
    rol.value = '';
    userId.value = '';
    usuariosAsignadosIds.value = [];

    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    localStorage.removeItem('usuariosAsignadosIds');

    router.push('/login');
  }

  return { token, rol, userId, usuariosAsignadosIds, error, login, logout };
});
