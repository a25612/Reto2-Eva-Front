import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUsuarioStore = defineStore('usuario', () => {
  // Estado: ID del usuario seleccionado
  const usuarioSeleccionadoId = ref<string | null>(localStorage.getItem('ultimoUsuarioSeleccionado') || null);

  // Acción: Cambiar el usuario seleccionado
  function seleccionarUsuario(id: string) {
    usuarioSeleccionadoId.value = id;
    localStorage.setItem('ultimoUsuarioSeleccionado', id); // Guardar en localStorage
  }

  return {
    usuarioSeleccionadoId,
    seleccionarUsuario,
  };
});
