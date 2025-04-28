import { defineStore } from 'pinia'

export interface MensajeConfirmacion {
  id: number
  empleado: { id: number, nombre: string }
  fechaEnvio: string
  tipoAccion: string
  mensaje: string
}

export const useMensajeConfirmacionStore = defineStore('mensajeConfirmacion', {
  state: () => ({
    mensajes: [] as MensajeConfirmacion[],
    cargando: false,
    error: null as string | null,
    usuariosAsignados: [] as { id: number, nombre: string }[],
  }),
  actions: {
    async cargarMensajesPorEmpleado(empleadoId: number) {
      this.cargando = true
      this.error = null
      try {
        const res = await fetch(`https://localhost:7163/api/MensajeConfirmacion/empleado/${empleadoId}`)
        if (!res.ok) throw new Error('Error al cargar los mensajes')
        const data = await res.json()
        this.mensajes = data
        // Extraer usuarios únicos de los mensajes
        const usuarios = this.mensajes.map(m => m.empleado)
        this.usuariosAsignados = usuarios.filter(
          (u, i, arr) => arr.findIndex(x => x.id === u.id) === i
        )
      } catch (err: any) {
        this.error = 'Error al cargar los mensajes'
      } finally {
        this.cargando = false
      }
    },
    async aceptarMovimiento(mensajeId: number, empleadoId: number) {
        try {
          const res = await fetch(`https://localhost:7163/api/MensajeConfirmacion/${mensajeId}/aceptar`, {
            method: 'POST'
          })
          if (!res.ok) throw new Error()
          await this.cargarMensajesPorEmpleado(empleadoId)
        } catch {
          this.error = 'No se pudo aceptar la solicitud'
        }
      },
      async cancelarMovimiento(mensajeId: number, empleadoId: number) {
        try {
          const res = await fetch(`https://localhost:7163/api/MensajeConfirmacion/${mensajeId}/cancelar`, {
            method: 'POST'
          })
          if (!res.ok) throw new Error()
          await this.cargarMensajesPorEmpleado(empleadoId)
        } catch {
          this.error = 'No se pudo cancelar la solicitud'
        }
      }      
  }
})
