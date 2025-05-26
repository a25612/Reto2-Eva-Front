import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './login'

export const useCalendarioHomeStore = defineStore('calendariohome', () => {
  const sesiones = ref<any[]>([])
  const solicitudesCambio = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
      } else if (rol === 'PROFESIONAL') {
        if (!userId) {
          sesiones.value = []
          return
        }
        const response = await fetch(`https://localhost:7163/api/Sesion/Profesional/${userId}`)
        if (!response.ok) {
          sesiones.value = []
          error.value = 'Error al obtener sesiones de profesional'
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

  function limpiarSesionParaPut(sesion: any) {
    return {
      FECHA: sesion.fecha,
      ESTADO: sesion.estado
    }
  }

  async function moverSesion(id: number) {
    const sesion = sesiones.value.find(s => s.id === id)
    if (sesion) {
      const dto = limpiarSesionParaPut({ ...sesion, estado: 0 })
      try {
        const response = await fetch(`https://localhost:7163/api/Sesion/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto)
        })
        if (!response.ok) throw new Error('Error al poner en pendiente la sesión')
        await fetchSesiones()
      } catch (e: any) {
        error.value = e.message || 'Error al poner en pendiente la sesión'
      }
    }
  }

  async function cancelarSesion(id: number, motivo: string) {
    const sesion = sesiones.value.find(s => s.id === id)
    if (sesion) {
      const dto = limpiarSesionParaPut({ ...sesion, estado: 2 })
      try {
        const response = await fetch(`https://localhost:7163/api/Sesion/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto)
        })
        if (!response.ok) throw new Error('Error al cancelar la sesión')

        const idProfesional = sesion.iD_PROFESIONAL || sesion.id_profesional || sesion.ID_PROFESIONAL
        if (!idProfesional) throw new Error('No se ha encontrado el profesional de la sesión')

        const authStore = useAuthStore()
        const canceladaPor = authStore.rol?.toUpperCase() === 'PROFESIONAL' ? 'PROFESIONAL' : 'TUTOR'

        const mensajeCancelacion = {
          id_Sesion: id,
          id_Profesional: idProfesional,
          tipo: 'CANCELADA',
          mensaje: motivo,
          fechaMensaje: new Date().toISOString(),
          fechaSolicitada: sesion.fecha,
          estado: 0,
          canceladaPor 
        }
        const respMsg = await fetch('https://localhost:7163/api/MensajeConfirmacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mensajeCancelacion)
        })
        if (!respMsg.ok) throw new Error('Error al crear el mensaje de cancelación')

        await fetchSesiones()
      } catch (e: any) {
        error.value = e.message || 'Error al cancelar la sesión'
      }
    }
  }

  async function solicitarMoverSesion(id: number, nuevaFecha: string, motivo: string) {
    const sesion = sesiones.value.find(s => s.id === id)
    if (sesion) {
      await moverSesion(id)

      const idProfesional = sesion.iD_PROFESIONAL || sesion.id_profesional || sesion.ID_PROFESIONAL

      if (!idProfesional) {
        error.value = 'No se ha encontrado el profesional que da la sesión. Revisa los datos de la sesión.'
        console.error('Sesión sin profesional válido:', sesion)
        return
      }

      const mensajeConfirmacion = {
        id_Sesion: id,
        id_Profesional: idProfesional,
        tipo: "MOVIDA",
        mensaje: motivo,
        fechaMensaje: new Date().toISOString(),
        fechaSolicitada: nuevaFecha,
        estado: 0
      }

      try {
        const response = await fetch('https://localhost:7163/api/MensajeConfirmacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mensajeConfirmacion)
        })
        if (!response.ok) throw new Error('Error al crear el mensaje de confirmación')
      } catch (e) {
        if (e instanceof Error) {
          error.value = e.message
        } else {
          error.value = 'Error al crear el mensaje de confirmación'
        }
      }

      solicitudesCambio.value.push({
        id: sesion.id,
        fechaActual: sesion.fecha,
        nuevaFecha,
        motivo,
        confirmado: false
      })

      await fetchSesiones()
    }
  }

  async function confirmarMoverSesion(id: number) {
    const solicitud = solicitudesCambio.value.find(s => s.id === id && !s.confirmado)
    if (solicitud) {
      const sesion = sesiones.value.find(s => s.id === id)
      if (sesion) {
        const dto = {
          FECHA: solicitud.nuevaFecha,
          ESTADO: 1
        }
        try {
          const response = await fetch(`https://localhost:7163/api/Sesion/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
          })
          if (!response.ok) throw new Error('Error al confirmar la sesión')
          solicitud.confirmado = true
          await fetchSesiones()
        } catch (e) {
          if (e instanceof Error) {
            error.value = e.message
          } else {
            error.value = 'Error al confirmar la sesion'
          }
        }
      }
    }
  }

  async function fetchUsuariosGrupo(sesionId: number) {
    try {
      const response = await fetch(`https://localhost:7163/api/Sesiones/${sesionId}/usuarios`)
      if (!response.ok) throw new Error('Error al obtener los usuarios del grupo')
      return await response.json()
    } catch (e) {
      return []
    }
  }

  return {
    sesiones,
    isLoading,
    error,
    fetchSesiones,
    moverSesion,
    cancelarSesion,
    solicitarMoverSesion,
    confirmarMoverSesion,
    solicitudesCambio,
    fetchUsuariosGrupo 
  }
})
