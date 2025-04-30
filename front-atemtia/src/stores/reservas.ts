import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Reserva {
  id: number
  fecha: string
  usuario: {
    id: number
    nombre: string
  }
  servicio: { nombre: string }
  empleado: { nombre: string }
  centro: { nombre: string }
  tarifa: { precio: number }
  facturar: boolean
}

export const useReservasStore = defineStore('reservas', () => {
  const reservas = ref<Reserva[]>([])
  const cargando = ref(false)
  const error = ref('')
  const usuariosAsignados = ref<{ id: number; nombre: string }[]>([])

  async function cargarReservas() {
    const rol = localStorage.getItem('rol')
    cargando.value = true
    error.value = ''
    reservas.value = []
    usuariosAsignados.value = []

    try {
      if (rol === 'Tutor') {

        const usuariosIds = JSON.parse(localStorage.getItem('usuariosAsignadosIds') || '[]')
        if (!usuariosIds.length) {
          error.value = 'No tienes hijos asignados.'
          return
        }
        
        const peticiones = usuariosIds.map((id: number) =>
          fetch(`https://localhost:7163/api/Sesion/Usuario/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }).then(res => res.json().then(data => ({ id, data })))
        )
        const resultados = await Promise.all(peticiones)
        reservas.value = resultados.flatMap(r => r.data)
        usuariosAsignados.value = resultados.map(r => ({
          id: r.id,
          nombre: r.data?.[0]?.usuario?.nombre || `Usuario ${r.id}`,
        }))
      } else if (rol === 'Empleado') {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          error.value = 'No se encontró el usuario'
          return
        }
        const response = await fetch(`https://localhost:7163/api/Sesion/Empleado/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        reservas.value = await response.json()
        usuariosAsignados.value = reservas.value.length
          ? [{ id: reservas.value[0].usuario.id, nombre: reservas.value[0].usuario.nombre }]
          : []
      } else {
        error.value = 'Rol no válido'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido'
    } finally {
      cargando.value = false
    }
  }

  return { reservas, cargando, error, cargarReservas, usuariosAsignados }
})
