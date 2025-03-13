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

    try {
      const token = authStore.token;
      let url = '';
      
      // Manejo correcto de la zona horaria
      const fechaParaFiltrar = fecha || diaActual.value;
      const fechaLocal = new Date(fechaParaFiltrar);
      fechaLocal.setMinutes(fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset());
      const fechaFiltro = fechaLocal.toISOString().split('T')[0];

      if (authStore.rol === 'Tutor') {
        url = `http://servicios-atemtia-api.retocsv.es/api/Sesion/Usuario/${userId}?fecha=${fechaFiltro}`;
      } else if (authStore.rol === 'Empleado') {
        url = `http://servicios-atemtia-api.retocsv.es/api/Sesion/Empleado/${userId}?fecha=${fechaFiltro}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al cargar sesiones: ${response.status}`);
      }

      sesiones.value = await response.json();
      if (fecha) diaActual.value = fecha;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error desconocido al cargar sesiones.';
    } finally {
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
