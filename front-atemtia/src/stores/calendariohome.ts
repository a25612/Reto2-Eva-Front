import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './login'

export const useCalendarioHomeStore = defineStore('calendariohome', () => {
  const sesiones = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Acción para cargar sesiones según rol
  async function fetchSesiones() {
    isLoading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      const rol = (authStore.rol || localStorage.getItem('rol') || '').toUpperCase()
      const userId = authStore.userId || localStorage.getItem('userId') || ''
      const usuariosAsignadosIds = authStore.usuariosAsignadosIds

      if (rol === 'TUTOR') {
        if (!usuariosAsignadosIds.length) {
          sesiones.value = []
          return
        }
        const peticiones = usuariosAsignadosIds.map(id =>
          fetch(`https://localhost:7163/api/Sesion/Usuario/${id}`).then(res => res.json())
        )
        const resultados = await Promise.all(peticiones)
        sesiones.value = resultados.flat()
      } else if (rol === 'EMPLEADO') {
        if (!userId) {
          sesiones.value = []
          return
        }
        const response = await fetch(`https://localhost:7163/api/Sesion/Empleado/${userId}`)
        if (!response.ok) {
          sesiones.value = []
          error.value = 'Error al obtener sesiones de empleado'
          return
        }
        sesiones.value = await response.json()
      } else {
        sesiones.value = []
        error.value = 'Rol no reconocido o sin sesiones'
      }
    } catch (e: any) {
      error.value = e.message || 'Error inesperado'
      sesiones.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    sesiones,
    isLoading,
    error,
    fetchSesiones,
  }
})
