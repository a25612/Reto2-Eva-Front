import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

interface Usuario {
  id: number;
  nombre: string;
  dni: string;
  codigoFacturacion: string;
}

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios: Ref<Usuario[]> = ref([]);
  const cargandoUsuarios: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');
  const usuariosFiltrados: Ref<Usuario[]> = ref([]);  // Aquí agregamos un array para los usuarios filtrados

  async function cargarUsuarios() {
    cargandoUsuarios.value = true;
    error.value = '';

    try {
      const response = await fetch('https://localhost:7163/api/Usuarios');
      if (!response.ok) {
        throw new Error(`Error al cargar los usuarios: ${response.status}`);
      }

      usuarios.value = await response.json();
      usuariosFiltrados.value = usuarios.value;  // Inicializamos los usuarios filtrados con todos los usuarios
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios';
      console.error('Error al cargar usuarios:', err);
    } finally {
      cargandoUsuarios.value = false;
    }
  }

  async function addUsuario(usuario: Usuario) {
    try {
      const response = await fetch('https://localhost:7163/api/Usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error(`Error al agregar el usuario: ${response.status}`);
      }

      const nuevoUsuario = await response.json();
      usuarios.value.push(nuevoUsuario);
      usuariosFiltrados.value.push(nuevoUsuario); // Agregamos el nuevo usuario a los filtrados también
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al agregar el usuario';
      console.error('Error al agregar usuario:', err);
    }
  }

  async function updateUsuario(usuario: Usuario) {
    try {
      const response = await fetch(`https://localhost:7163/api/Usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el usuario: ${response.status}`);
      }

      const usuarioActualizado = await response.json();
      const index = usuarios.value.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        usuarios.value[index] = usuarioActualizado;
        usuariosFiltrados.value[index] = usuarioActualizado; // Actualizamos los usuarios filtrados también
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al actualizar el usuario';
      console.error('Error al actualizar usuario:', err);
    }
  }

  async function deleteUsuario(usuarioId: number) {
    try {
      const response = await fetch(`https://localhost:7163/api/Usuarios/${usuarioId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el usuario: ${response.status}`);
      }

      usuarios.value = usuarios.value.filter(u => u.id !== usuarioId);
      usuariosFiltrados.value = usuariosFiltrados.value.filter(u => u.id !== usuarioId); // Eliminamos de los filtrados también
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido al eliminar el usuario';
      console.error('Error al eliminar usuario:', err);
    }
  }

  // Función para filtrar usuarios por el término de búsqueda
  function filterUsuariosByTerm(term: string) {
    if (!term) {
      usuariosFiltrados.value = usuarios.value;  // Si no hay término de búsqueda, mostramos todos
    } else {
      usuariosFiltrados.value = usuarios.value.filter(usuario =>
        usuario.nombre.toLowerCase().includes(term.toLowerCase()) ||
        usuario.dni.includes(term) ||
        usuario.codigoFacturacion.includes(term)
      );
    }
  }

  return {
    usuarios,
    usuariosFiltrados,  // Exponemos los usuarios filtrados
    cargandoUsuarios,
    error,
    cargarUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    filterUsuariosByTerm,  // Exponemos la función de filtrado
  };
});
