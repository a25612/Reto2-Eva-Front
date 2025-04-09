import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsuariosStore = defineStore("usuariosStore", () => {
  const usuarios = ref<any[]>([]);
  const usuariosFiltrados = ref<any[]>([]);
  const mostrarFormularioCrear = ref(false);
  const mostrarFormularioEditar = ref(false); 
  const usuarioActual = ref<any | null>(null);

  // Cargar usuarios desde la API
  const cargarUsuarios = async () => {
    try {
      const response = await fetch("https://localhost:7163/api/Usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");

      const data = await response.json();
      usuarios.value = data;
      usuariosFiltrados.value = data;
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Filtrar los usuarios por nombre
  const filtrarUsuarios = (termino: string) => {
    usuariosFiltrados.value = usuarios.value.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  // Mostrar el formulario de creación
  const toggleFormCreate = () => {
    usuarioActual.value = { id: null, nombre: "", dni: "", codigoFacturacion: "" };
    mostrarFormularioCrear.value = true;
    mostrarFormularioEditar.value = false; 
  };

  // Abrir formulario de edición
  const abrirFormularioEdicion = (usuario: any) => {
    usuarioActual.value = { ...usuario };
    mostrarFormularioCrear.value = false;
    mostrarFormularioEditar.value = true; 
  };

  // Guardar cambios (crear o actualizar usuario)
  const guardarUsuario = async (usuario: any) => {
    try {
      let response;
      if (usuario.id) {
        // Actualizar usuario existente
        response = await fetch(`https://localhost:7163/api/Usuarios/${usuario.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        });
      } else {
        // Crear un nuevo usuario
        response = await fetch("https://localhost:7163/api/Usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        });
      }

      if (!response.ok) throw new Error(usuario.id ? "Error al actualizar usuario" : "Error al crear usuario");

      if (usuario.id) {
        // Si es una actualización, actualizar el usuario en la lista
        usuarios.value = usuarios.value.map((u) => (u.id === usuario.id ? usuario : u));
      } else {
        // Si es una creación, añadir el nuevo usuario a la lista
        const newUser = await response.json();
        usuarios.value.push(newUser);
      }

      filtrarUsuarios(""); 
      mostrarFormularioCrear.value = false;
      mostrarFormularioEditar.value = false;
      usuarioActual.value = null;
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // Eliminar un usuario
  const eliminarUsuario = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7163/api/Usuarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error en la eliminación");

      usuarios.value = usuarios.value.filter((user) => user.id !== id);
      filtrarUsuarios("");
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
    guardarUsuario,
    mostrarFormularioCrear,
    mostrarFormularioEditar,
    usuarioActual,
  };
});
