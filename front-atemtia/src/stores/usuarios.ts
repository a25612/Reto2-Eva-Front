import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUsuariosStore = defineStore("usuariosStore", () => {
  const usuarios = ref<any[]>([]);
  const usuariosFiltrados = ref<any[]>([]);
  const mostrarFormulario = ref(false);
  const usuarioActual = ref<any | null>(null);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch("https://localhost:7163/api/Usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");

      usuarios.value = await response.json();
      usuariosFiltrados.value = usuarios.value;
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const filtrarUsuarios = (termino: string) => {
    usuariosFiltrados.value = usuarios.value.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  const toggleFormCreate = () => {
    usuarioActual.value = null;
    mostrarFormulario.value = true;
  };

  const abrirFormularioEdicion = (usuario: any) => {
    usuarioActual.value = usuario;
    mostrarFormulario.value = true;
  };

  const eliminarUsuario = async (id: number) => {
    try {
      console.log(`Intentando eliminar usuario con ID: ${id}`);
      
      const response = await fetch(`https://localhost:7163/api/Usuarios/${id}`, { 
        method: "DELETE" 
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error en la eliminación: ${response.status} ${response.statusText} - ${errorMessage}`);
      }

      usuarios.value = usuarios.value.filter((user) => user.id !== id);
      filtrarUsuarios("");

      console.log(`Usuario con ID ${id} eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return {
    usuarios,
    usuariosFiltrados,
    cargarUsuarios,
    filtrarUsuarios,
    toggleFormCreate,
    abrirFormularioEdicion,
    eliminarUsuario,
    mostrarFormulario,
    usuarioActual,
  };
});
