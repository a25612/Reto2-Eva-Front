import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  activo: boolean;
  id_empleado: number;
}

export const useServiciosStore = defineStore('servicios', () => {
  const servicios = ref<Servicio[]>([]);
  const error = ref<string>('');
  const showFormCreate = ref(false);
  const showFormUpdate = ref(false);
  const showFormDelete = ref(false);
  const showModalDelete = ref(false);
  const servicioSearch = ref('');
  const servicioToDelete = ref<number | null>(null);
  const newServicio = ref<Omit<Servicio, 'id'>>({
    nombre: '',
    descripcion: '',
    precio: null,
    activo: false,
    id_empleado: 0,
  });

  const updatedServicio = ref<Servicio>({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: null,
    activo: false,
    id_empleado: 0,
  });

  // Función para obtener servicios
  const fetchServicios = async () => {
    try {
      const response = await fetch('https://localhost:7163/api/Servicios');
      if (!response.ok) {
        throw new Error('Error al obtener los servicios');
      }
      servicios.value = await response.json();
    } catch (err: any) {
      error.value = err.message || 'Error al obtener los servicios';
    }
  };

  // Función para crear un nuevo servicio
  const addServicio = async () => {
    try {
      const response = await fetch('https://localhost:7163/api/Servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServicio.value),
      });

      if (!response.ok) {
        throw new Error('Error al crear el servicio');
      }

      await fetchServicios();
      showFormCreate.value = false;
      newServicio.value = { nombre: '', descripcion: '', precio: null, activo: false, id_empleado: 0 };
    } catch (err: any) {
      error.value = err.message || 'Error al crear el servicio';
    }
  };

  // Función para actualizar un servicio
  const updateServicio = async () => {
    try {
      const response = await fetch(`https://localhost:7163/api/Servicios/${updatedServicio.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedServicio.value),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el servicio');
      }

      await fetchServicios();
      showFormUpdate.value = false;
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar el servicio';
    }
  };

  // Función para eliminar un servicio
  const deleteServicio = async () => {
    try {
      if (servicioToDelete.value === null) return;

      const response = await fetch(`https://localhost:7163/api/Servicios/${servicioToDelete.value}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el servicio');
      }

      await fetchServicios();
      showModalDelete.value = false;
      showFormDelete.value = false;
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar el servicio';
    }
  };

  // Computada para filtrar servicios por búsqueda
  const filteredServicios = computed(() => {
    if (servicioSearch.value === '') {
      return servicios.value;
    }
    return servicios.value.filter(servicio =>
      servicio.nombre.toLowerCase().includes(servicioSearch.value.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(servicioSearch.value.toLowerCase())
    );
  });

  // Funciones para mostrar/ocultar formularios y modales
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

  const openModalDelete = (servicioId: number) => {
    servicioToDelete.value = servicioId;
    showModalDelete.value = true;
  };

  const confirmDelete = () => {
    deleteServicio();
    servicioToDelete.value = null;
  };

  const cancelDelete = () => {
    showModalDelete.value = false;
    servicioToDelete.value = null;
  };

  const selectServicioToUpdate = (servicio: Servicio) => {
    updatedServicio.value = { ...servicio };
    showFormUpdate.value = true;
  };

  const filterServiciosByTerm = (term: string) => {
    servicioSearch.value = term;
  };

  return {
    servicios,
    error,
    showFormCreate,
    showFormUpdate,
    showFormDelete,
    showModalDelete,
    servicioSearch,
    servicioToDelete,
    newServicio,
    updatedServicio,
    fetchServicios,
    addServicio,
    updateServicio,
    deleteServicio,
    filteredServicios,
    toggleFormCreate,
    toggleFormUpdate,
    toggleFormDelete,
    openModalDelete,
    confirmDelete,
    cancelDelete,
    selectServicioToUpdate,
    filterServiciosByTerm,
  };
});