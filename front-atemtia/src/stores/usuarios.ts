import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

interface Usuario {
  id: number;
  nombre: string;
  dni: string;
  codigoFacturacion: string;
}

const API_URL = 'https://localhost:7163/api/Usuarios';

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios: Ref<Usuario[]> = ref([]);
  const cargandoUsuarios: Ref<boolean> = ref(false);
  const error: Ref<string> = ref('');
  const terminoBusqueda: Ref<string> = ref('');
  const usuarioParaActualizar: Ref<Usuario | null> = ref(null);

  async function cargarUsuarios() {
    cargandoUsuarios.value = true;
    error.value = '';

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error al cargar los usuarios: ${response.status}`);

      usuarios.value = await response.json();
    } catch (err) {
      handleError(err, 'Error al cargar usuarios');
    } finally {
      cargandoUsuarios.value = false;
    }
  }

  async function addUsuario(usuario: Usuario) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error(`Error al agregar el usuario: ${response.status}`);

      const nuevoUsuario = await response.json();
      usuarios.value.push(nuevoUsuario);
    } catch (err) {
      handleError(err, 'Error al agregar el usuario');
    }
  }

  async function updateUsuario(usuario: Usuario) {
    try {
      const response = await fetch(`${API_URL}/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error(`Error al actualizar el usuario: ${response.status}`);

      const usuarioActualizado = await response.json();
      usuarios.value = usuarios.value.map(u => (u.id === usuario.id ? usuarioActualizado : u));
    } catch (err) {
      handleError(err, 'Error al actualizar el usuario');
    }
  }

  async function deleteUsuario(usuarioId: number) {
    try {
      const response = await fetch(`${API_URL}/${usuarioId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Obtiene el mensaje de error de la API
        throw new Error(`Error al eliminar el usuario: ${response.status} - ${errorMessage}`);
      }

      usuarios.value = usuarios.value.filter(u => u.id !== usuarioId);
    } catch (err) {
      handleError(err, 'Error al eliminar el usuario');
    }
  }

  function selectUsuarioToUpdate(usuario: Usuario) {
    usuarioParaActualizar.value = usuario;
  }

  function handleError(err: unknown, message: string) {
    error.value = err instanceof Error ? err.message : message;
    console.error(message, err);
  }

  const usuariosFiltrados = computed(() => {
    if (!terminoBusqueda.value) return usuarios.value;
    return usuarios.value.filter(usuario =>
      usuario.nombre.toLowerCase().includes(terminoBusqueda.value.toLowerCase()) ||
      usuario.dni.includes(terminoBusqueda.value) ||
      usuario.codigoFacturacion.includes(terminoBusqueda.value)
    );
  });

  return {
    usuarios,
    usuariosFiltrados,
    cargandoUsuarios,
    error,
    terminoBusqueda,
    usuarioParaActualizar,
    cargarUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    selectUsuarioToUpdate,
  };
});
