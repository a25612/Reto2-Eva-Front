import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './login';

export interface Sesion {
  id: number;
  fecha: string;
  servicio: {
    nombre: string;
  };
  centro: {
    nombre: string;
  };
}

export const useCalendarioStore = defineStore('calendario', () => {
  const sesiones = ref<Sesion[]>([]);
  const cargando = ref(false);
  const error = ref('');
  const diaActual = ref<Date>(new Date());

  async function cargarSesiones(fecha?: Date) {
    const authStore = useAuthStore();
    const userId =
      authStore.rol === 'Tutor'
        ? localStorage.getItem('ultimoUsuarioSeleccionado')
        : authStore.userId;
  
    if (!userId) {
      error.value = 'No se encontró información del usuario o empleado.';
      return;
    }
  
    cargando.value = true;
    error.value = '';
  
    const fechaParaFiltrar = fecha || diaActual.value;
  
    try {
      const token = authStore.token;
      let url = '';
  
      // Manejo correcto de la zona horaria
      const fechaLocal = new Date(fechaParaFiltrar);
      fechaLocal.setMinutes(fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset());
      const fechaFiltro = fechaLocal.toISOString().split('T')[0];
  
      if (authStore.rol === 'Tutor') {
        url = `https://localhost:7163/api/Sesion/Usuario/${userId}/PorFecha?fecha=${fechaFiltro}`;
      } else if (authStore.rol === 'Empleado') {
        url = `https://localhost:7163/api/Sesion/Empleado/${userId}/PorFecha?fecha=${fechaFiltro}`;
      }
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 404) {
        sesiones.value = [];
        error.value = ''; 
        return;
      }
  
      if (!response.ok) {
        throw new Error(`Error al cargar sesiones: ${response.status}`);
      }
  
      sesiones.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error desconocido al cargar sesiones.';
    } finally {
      diaActual.value = fechaParaFiltrar; 
      cargando.value = false;
    }
  }
  
  

  function cambiarDia(direccion: 'anterior' | 'siguiente') {
    const nuevoDia = new Date(diaActual.value);
    nuevoDia.setDate(diaActual.value.getDate() + (direccion === 'anterior' ? -1 : 1));
    cargarSesiones(nuevoDia);
  }
  

  const actividadesDelDia = computed(() => {
    return sesiones.value.map((sesion) => ({
      hora: new Date(sesion.fecha).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      titulo: sesion.servicio.nombre,
      ubicacion: sesion.centro.nombre,
    }));
  });

  return { 
    sesiones,
    cargando,
    error,
    diaActual,
    actividadesDelDia,
    cargarSesiones,
    cambiarDia
  };
});
