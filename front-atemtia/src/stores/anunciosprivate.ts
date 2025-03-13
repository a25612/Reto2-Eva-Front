import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  activo: boolean; // Agregado el campo "activo"
}

export const useAnunciosStore = defineStore('anuncios', () => {
  const anuncios = ref<Anuncio[]>([]);
  const error = ref<string>('');
  const showFormCreate = ref(false);
  const showFormUpdate = ref(false);
  const showFormDelete = ref(false);
  const showModalDelete = ref(false);
  const anuncioSearch = ref('');
  const anuncioToDelete = ref<number | null>(null);
  const newAnuncio = ref<Omit<Anuncio, 'id'>>({
    titulo: '',
    descripcion: '',
    activo: false // Inicializar el campo "activo"
  });

  const updatedAnuncio = ref<Anuncio>({
    id: 0,
    titulo: '',
    descripcion: '',
    activo: false // Incluir el campo "activo" en la actualización
  });

  // Función para obtener anuncios
  const fetchAnuncios = async () => {
    try {
      const response = await fetch('http://servicios-atemtia-api.retocsv.es/api/Anuncio');
      if (!response.ok) {
        throw new Error('Error al obtener los anuncios');
      }
      anuncios.value = await response.json();
    } catch (err: any) {
      error.value = err.message || 'Error al obtener los anuncios';
    }
  };

  // Función para crear un nuevo anuncio
  const addAnuncio = async () => {
    try {
      const response = await fetch('http://servicios-atemtia-api.retocsv.es/api/Anuncio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnuncio.value)
      });

      if (!response.ok) {
        throw new Error('Error al crear el anuncio');
      }

      await fetchAnuncios();
      showFormCreate.value = false;
      newAnuncio.value = { titulo: '', descripcion: '', activo: false }; // Reiniciar el formulario
    } catch (err: any) {
      error.value = err.message || 'Error al crear el anuncio';
    }
  };

  // Función para actualizar un anuncio
  const updateAnuncio = async () => {
    try {
      const response = await fetch(`http://servicios-atemtia-api.retocsv.es/api/Anuncio/${updatedAnuncio.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAnuncio.value)
      });

      if (!response.ok) {
        console.log(updateAnuncio);
        throw new Error('Error al actualizar el anuncio');
      }

      await fetchAnuncios();
      showFormUpdate.value = false;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar el anuncio';
    }
  };

  // Función para eliminar un anuncio
  const deleteAnuncio = async () => {
    try {
      if (anuncioToDelete.value === null) return;

      const response = await fetch(`http://servicios-atemtia-api.retocsv.es/api/Anuncio/${anuncioToDelete.value}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el anuncio');
      }

      await fetchAnuncios();
      showModalDelete.value = false;
      showFormDelete.value = false;
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar el anuncio';
    }
  };

  // Computada para filtrar anuncios por búsqueda
  const filteredAnuncios = computed(() => {
    if (anuncioSearch.value === '') {
      return anuncios.value;
    }
    return anuncios.value.filter(anuncio =>
      anuncio.titulo.toLowerCase().includes(anuncioSearch.value.toLowerCase()) ||
      anuncio.descripcion.toLowerCase().includes(anuncioSearch.value.toLowerCase())
    );
  });

  // Función para mostrar/ocultar el formulario de creación
  const toggleFormCreate = () => {
    showFormCreate.value = !showFormCreate.value;
    if (showFormCreate.value) {
      showFormUpdate.value = false;
      showFormDelete.value = false;
    }
  };

  // Función para mostrar/ocultar el formulario de actualización
  const toggleFormUpdate = () => {
    showFormUpdate.value = !showFormUpdate.value;
    if (showFormUpdate.value) {
      showFormCreate.value = false;
      showFormDelete.value = false;
    }
  };

  // Función para mostrar/ocultar el formulario de eliminación
  const toggleFormDelete = () => {
    showFormDelete.value = !showFormDelete.value;
    if (showFormDelete.value) {
      showFormCreate.value = false;
      showFormUpdate.value = false;
    }
  };

  // Función para abrir el modal de eliminación
  const openModalDelete = (anuncioId: number) => {
    anuncioToDelete.value = anuncioId;
    showModalDelete.value = true;
  };

  // Confirmar eliminación de un anuncio
  const confirmDelete = () => {
    deleteAnuncio();
    anuncioToDelete.value = null;
  };

  // Cancelar eliminación de un anuncio
  const cancelDelete = () => {
    showModalDelete.value = false;
    anuncioToDelete.value = null;
  };

  // Función para seleccionar un anuncio a actualizar
  const selectAnuncioToUpdate = (anuncio: Anuncio) => {
    updatedAnuncio.value = { ...anuncio }; // Copiar los datos del anuncio seleccionado al objeto de actualización
    showFormUpdate.value = true; // Mostrar el formulario de actualización
  };

  return {
    anuncios,
    error,
    showFormCreate,
    showFormUpdate,
    showFormDelete,
    showModalDelete,
    anuncioSearch,
    anuncioToDelete,
    newAnuncio,
    updatedAnuncio,
    fetchAnuncios,
    addAnuncio,
    updateAnuncio,
    deleteAnuncio,
    filteredAnuncios,
    toggleFormCreate,
    toggleFormUpdate,
    toggleFormDelete,
    openModalDelete,
    confirmDelete,
    cancelDelete,
    selectAnuncioToUpdate, 
  };
});
