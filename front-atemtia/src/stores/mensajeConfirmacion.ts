import { defineStore } from 'pinia'

export interface MensajeConfirmacionAdaptado {
    id: number
    id_Sesion: number
    id_Empleado: number
    tipo: string
    mensaje: string
    fechaEnvio: string
    fechaSolicitada: string
    usuarioNombre: string
    tutorNombre: string
    servicioNombre: string
    sesionId: number
    estado?: 'aceptado' | 'cancelado' | 'pendiente'
    fechaOriginal?: string
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
                    id_Sesion: m.id_Sesion,
                    id_Empleado: m.id_Empleado,
                    tipo: m.tipo,
                    mensaje: m.mensaje,
                    fechaEnvio: m.fechaMensaje,
                    fechaSolicitada: m.fechaSolicitada,
                    usuarioNombre: m.sesion?.usuario?.nombre ?? '',
                    tutorNombre: m.sesion?.tutor?.nombre ?? '',
                    servicioNombre: m.sesion?.servicio?.nombre ?? '',
                    sesionId: m.id_Sesion,
                    estado: 'pendiente',
                    fechaOriginal: m.sesion?.fecha
                }))
                this.mensajes.sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime())
            } catch (err: any) {
                this.error = 'Error al cargar los mensajes'
            } finally {
                this.cargando = false
            }
        },
        async aceptarMovimiento(mensajeId: number) {
            try {
                const mensaje = this.mensajes.find(m => m.id === mensajeId)
                if (!mensaje) throw new Error('Mensaje no encontrado')
                // PUT a Sesion: Cambia la fecha y el estado a "confirmada" (por ejemplo, estado: 1)
                const body = {
                    fecha: mensaje.fechaSolicitada, // Nueva fecha solicitada
                    estado: 1 // Cambia esto si tu backend espera otro valor para "confirmada"
                }
                const res = await fetch(`https://localhost:7163/api/Sesion/${mensaje.sesionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                if (!res.ok) throw new Error('Error al actualizar la sesión')
                mensaje.estado = 'aceptado'
                mensaje.fechaOriginal = mensaje.fechaSolicitada // Actualiza la fecha original
            } catch (error) {
                this.error = 'No se pudo aceptar la solicitud. Por favor, inténtalo de nuevo.'
                throw error
            }
        },
        async cancelarMovimiento(mensajeId: number) {
            try {
                const mensaje = this.mensajes.find(m => m.id === mensajeId)
                if (!mensaje) throw new Error('Mensaje no encontrado')
                // PUT a Sesion: Vuelve a la fecha original y cambia estado a "cancelada" (por ejemplo, estado: 2)
                const body = {
                    fecha: mensaje.fechaOriginal ?? mensaje.fechaSolicitada, // Fecha original o la solicitada si no existe
                    estado: 2 // Cambia esto si tu backend espera otro valor para "cancelada"
                }
                const res = await fetch(`https://localhost:7163/api/Sesion/${mensaje.sesionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                if (!res.ok) throw new Error('Error al cancelar la sesión')
                mensaje.estado = 'cancelado'
            } catch (error) {
                this.error = 'No se pudo cancelar la solicitud. Por favor, inténtalo de nuevo.'
                throw error
            }
        }
    }
})
