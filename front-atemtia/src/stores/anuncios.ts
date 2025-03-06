import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
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
    descripcion: ''
  });
  
  const updatedAnuncio = ref<Anuncio>({
    id: 0,
    titulo: '',
    descripcion: ''
  });

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('https://localhost:7163/api/Anuncio');
      if (!response.ok) {
        throw new Error('Error al obtener los anuncios');
      }
      anuncios.value = await response.json();
    } catch (err: any) {
      error.value = err.message || 'Error al obtener los anuncios';
    }
  };

  const addAnuncio = async () => {
    try {
      const response = await fetch('https://localhost:7163/api/Anuncio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnuncio.value)
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el anuncio');
      }
  
      await fetchAnuncios();
      showFormCreate.value = false;
      newAnuncio.value = { titulo: '', descripcion: '' };
    } catch (err: any) {
      error.value = err.message || 'Error al crear el anuncio';
    }
  };

  const updateAnuncio = async () => {
    try {
      const response = await fetch(`https://localhost:7163/api/Anuncio/${updatedAnuncio.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAnuncio.value)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el anuncio');
      }

      await fetchAnuncios();
      showFormUpdate.value = false;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar el anuncio';
    }
  };

  const deleteAnuncio = async () => {
    try {
      if (anuncioToDelete.value === null) return;

      const response = await fetch(`https://localhost:7163/api/Anuncio/${anuncioToDelete.value}`, {
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

  const filteredAnuncios = computed(() => {
    if (anuncioSearch.value === '') {
      return anuncios.value;
    }
    return anuncios.value.filter(anuncio => 
      anuncio.titulo.toLowerCase().includes(anuncioSearch.value.toLowerCase()) || 
      anuncio.descripcion.toLowerCase().includes(anuncioSearch.value.toLowerCase())
    );
  });

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

  const openModalDelete = (anuncioId: number) => {
    anuncioToDelete.value = anuncioId;
    showModalDelete.value = true;
  };

  const confirmDelete = () => {
    deleteAnuncio();
    anuncioToDelete.value = null;
  };

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
