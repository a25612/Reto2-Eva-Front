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

  const usuarioSeleccionadoId = ref(localStorage.getItem('ultimoUsuarioSeleccionado') || '');

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
        const usuariosResponse = await fetch(`https://localhost:7163/api/Tutor/${data.iduser}/usuarios`, {
          headers: { 'Authorization': `Bearer ${data.token}`, 'Content-Type': 'application/json' },
        });
      
        if (!usuariosResponse.ok) {
          throw new Error('Error al cargar los usuarios asociados');
        }
      
        const usuariosData = await usuariosResponse.json() as Usuario[];
      
        // Find the first user assigned to this tutor
        const assignedUser = usuariosData.find((usuario: Usuario) => usuario.id === data.iduser.toString());
      
        if (assignedUser) {
          usuarioSeleccionadoId.value = assignedUser.id;
          localStorage.setItem('ultimoUsuarioSeleccionado', assignedUser.id);
          console.log('Usuario asignado automáticamente:', assignedUser.id);
        } else {
          console.log('No se encontró un usuario asignado a este tutor');
          usuarioSeleccionadoId.value = '';
          localStorage.removeItem('ultimoUsuarioSeleccionado');
        }
      }
      
      router.push('/home-app-atemtia'); 
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión';
    }
  }
  
  function setSelectedUser(id: string) {
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
