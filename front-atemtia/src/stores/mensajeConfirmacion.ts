import { defineStore } from 'pinia'

export interface MensajeConfirmacionAdaptado {
    id: number
    fechaEnvio: string
    usuarioNombre: string
    tutorNombre: string
    servicioNombre: string
    mensaje: string
}

export const useMensajeConfirmacionStore = defineStore('mensajeConfirmacion', {
    state: () => ({
        mensajes: [] as MensajeConfirmacionAdaptado[],
        cargando: false,
        error: null as string | null,
    }),
    actions: {
        async cargarMensajesPorEmpleado(empleadoId: number) {
            this.cargando = true
            this.error = null
            try {
                const res = await fetch(`https://localhost:7163/api/MensajeConfirmacion/empleado/${empleadoId}`)
                if (!res.ok) throw new Error('Error al cargar los mensajes')
                const data = await res.json()
                this.mensajes = data.map((m: any) => ({
                    id: m.id,
                    fechaEnvio: m.fecha,
                    usuarioNombre: m.usuario?.nombre ?? '',
                    tutorNombre: m.tutor?.nombre ?? '',
                    servicioNombre: m.servicio?.nombre ?? '',
                    mensaje: m.mensaje ?? '',
                }))
                this.mensajes.sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime())
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
