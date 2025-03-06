// src/stores/anuncios.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Definimos un tipo para los anuncios
interface Anuncio {
  id: number;
  title: string;
  description: string;
  publicationDate: string;
}

export const useAnunciosStore = defineStore('anuncios', () => {
  const anuncios = ref<Anuncio[]>([]); // Estado de los anuncios
  const error = ref<string>('');
  const showFormCreate = ref(false);
  const showFormUpdate = ref(false);
  const showFormDelete = ref(false);
  const showModalDelete = ref(false);
  const anuncioSearch = ref('');
  const anuncioToDelete = ref<number | null>(null);
const newAnuncio = ref<Anuncio>({
    id: 0, 
    title: '',
    description: '',
    publicationDate: new Date().toISOString()
});
  const updatedAnuncio = ref<Anuncio>({
    id: 0,
    title: '',
    description: '',
    publicationDate: ''
  });

  // Función para obtener los anuncios desde el backend
  const fetchAnuncios = async () => {
    try {
      const response = await fetch('https://localhost:7163/api/Anuncios');
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
      const response = await fetch('https://localhost:7163/api/Anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnuncio.value)
      });

      if (!response.ok) {
        console.log(newAnuncio.value);
      }

      await fetchAnuncios(); // Refrescar la lista de anuncios
      showFormCreate.value = false; // Cerrar el formulario
    } catch (err: any) {
      error.value = err.message || 'Error al crear el anuncio';
    }
  };

  // Función para actualizar un anuncio
  const updateAnuncio = async () => {
    try {
      const response = await fetch(`https://localhost:7163/api/Anuncios/${updatedAnuncio.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAnuncio.value)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el anuncio');
      }

      await fetchAnuncios(); // Refrescar la lista de anuncios
      showFormUpdate.value = false; // Cerrar el formulario
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar el anuncio';
    }
  };

  // Función para eliminar un anuncio
  const deleteAnuncio = async () => {
    try {
      if (anuncioToDelete.value === null) return;

      const response = await fetch(`https://localhost:7163/api/Anuncios/${anuncioToDelete.value}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el anuncio');
      }

      await fetchAnuncios(); // Refrescar la lista de anuncios
      showModalDelete.value = false; // Cerrar el modal de confirmación
      showFormDelete.value = false; // Cerrar el formulario
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar el anuncio';
    }
  };

  // Filtrar los anuncios por título o descripción
  const filteredAnuncios = computed(() => {
    if (anuncioSearch.value === '') {
      return anuncios.value;
    }
    return anuncios.value.filter(anuncio => 
      anuncio.title.toLowerCase().includes(anuncioSearch.value.toLowerCase()) || 
      anuncio.description.toLowerCase().includes(anuncioSearch.value.toLowerCase())
    );
  });

  // Toggle para mostrar los formularios
  const toggleFormCreate = () => {
    showFormCreate.value = !showFormCreate.value;
    if (showFormCreate.value) {
      showFormUpdate.value = false;
      showFormDelete.value = false;
    }
  };

  const toggleFormUpdate = () => {
    showFormUpdate.value = !showFormUpdate.value;
    if (showFormUpdate.value) {
      showFormCreate.value = false;
      showFormDelete.value = false;
    }
  };

  const toggleFormDelete = () => {
    showFormDelete.value = !showFormDelete.value;
    if (showFormDelete.value) {
      showFormCreate.value = false;
      showFormUpdate.value = false;
    }
  };

  // Abrir modal para eliminar un anuncio
  const openModalDelete = (anuncioId: number) => {
    anuncioToDelete.value = anuncioId;
    showModalDelete.value = true;
  };

  // Confirmar la eliminación
  const confirmDelete = () => {
    deleteAnuncio();
    anuncioToDelete.value = null;
  };

  // Cancelar la eliminación
  const cancelDelete = () => {
    showModalDelete.value = false;
    anuncioToDelete.value = null;
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
    cancelDelete
  };
});
