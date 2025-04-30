<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/login'
import { useMensajeConfirmacionStore } from '../stores/mensajeConfirmacion'
import type { MensajeConfirmacionAdaptado } from '../stores/mensajeConfirmacion'

const authStore = useAuthStore()
const mensajeStore = useMensajeConfirmacionStore()

const mesSeleccionado = ref<number | null>(null)
const estadosMensajes = ref<Map<number, 'pendiente' | 'procesando' | 'aceptado' | 'cancelado' | 'error'>>(new Map())
const lastAction = ref<{type: 'aceptar' | 'cancelar', id: number} | null>(null)

const getEstadoMensaje = (id: number) => {
  const mensaje = mensajeStore.mensajes.find(m => m.id === id)
  return estadosMensajes.value.get(id) || mensaje?.estado || 'pendiente'
}

const resetEstadoMensaje = (id: number) => {
  estadosMensajes.value.delete(id)
}

const retryLastAction = async () => {
  if (!lastAction.value) return
  const { type, id } = lastAction.value
  if (type === 'aceptar') {
    await handleAceptarSolicitud(id)
  } else {
    await handleCancelarSolicitud(id)
  }
}

onMounted(async () => {
  const empleadoId = authStore.userId
  if (empleadoId) {
    await mensajeStore.cargarMensajesPorEmpleado(Number(empleadoId))
  }
})

const mensajesFiltrados = computed(() => {
  return mensajeStore.mensajes.filter((mensaje: MensajeConfirmacionAdaptado) => {
    try {
      const fecha = new Date(mensaje.fechaEnvio)
      if (isNaN(fecha.getTime())) return false
      const coincideMes = mesSeleccionado.value !== null
        ? fecha.getMonth() === mesSeleccionado.value
        : true
      return coincideMes
    } catch {
      return mesSeleccionado.value === null
    }
  })
})

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const handleAceptarSolicitud = async (mensajeId: number) => {
  // Evita doble click mientras procesa
  if (getEstadoMensaje(mensajeId) === 'procesando') return
  const empleadoId = authStore.userId
  if (!empleadoId) return
  lastAction.value = { type: 'aceptar', id: mensajeId }
  estadosMensajes.value.set(mensajeId, 'procesando')
  try {
    await mensajeStore.aceptarMovimiento(mensajeId)
    estadosMensajes.value.set(mensajeId, 'aceptado')
    mensajeStore.error = null
  } catch (error) {
    estadosMensajes.value.set(mensajeId, 'error')
    mensajeStore.error = 'Error al aceptar la solicitud. Por favor, inténtalo de nuevo.'
  }
}

const handleCancelarSolicitud = async (mensajeId: number) => {
  if (getEstadoMensaje(mensajeId) === 'procesando') return
  lastAction.value = { type: 'cancelar', id: mensajeId }
  estadosMensajes.value.set(mensajeId, 'procesando')
  try {
    await mensajeStore.cancelarMovimiento(mensajeId)
    estadosMensajes.value.set(mensajeId, 'cancelado')
    mensajeStore.error = null
  } catch (error) {
    estadosMensajes.value.set(mensajeId, 'error')
    mensajeStore.error = 'Error al cancelar la solicitud. Por favor, inténtalo de nuevo.'
  }
}

const formatearFecha = (fechaStr: string) => {
  if (!fechaStr) return 'Fecha no disponible'
  try {
    const fechaIso = fechaStr.includes('T') ? fechaStr : fechaStr.replace(' ', 'T')
    const fecha = new Date(fechaIso)
    if (isNaN(fecha.getTime())) return 'Fecha no disponible'
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Fecha no disponible'
  }
}
</script>


<template>
  <div class="reservas">
    <router-link to="/home-app-atemtia" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>

    <h2 class="reservas__titulo">Mensajes de Confirmación</h2>

    <div v-if="mensajeStore.cargando" class="mensaje">Cargando mensajes...</div>
    <div v-if="mensajeStore.error" class="mensaje error">
      <p>{{ mensajeStore.error }}</p>
      <button v-if="lastAction" @click="retryLastAction" class="btn-retry">Reintentar</button>
    </div>

    <div v-if="!mensajeStore.cargando && !mensajeStore.error" class="reservas__filtros">
      <div class="sesion-list">
        <label>Filtrar por mes</label>
        <select v-model="mesSeleccionado">
          <option :value="null">Todos</option>
          <option v-for="(mes, i) in meses" :key="i" :value="i">{{ mes }}</option>
        </select>
      </div>
    </div>

    <div v-if="!mensajeStore.cargando && !mensajeStore.error" class="reservas__lista">
      <div
        v-for="mensaje in mensajesFiltrados"
        :key="mensaje.id"
        class="reserva-card"
      >
        <p><strong>Usuario:</strong> {{ mensaje.usuarioNombre || 'No disponible' }}</p>
        <p><strong>Tutor:</strong> {{ mensaje.tutorNombre || 'No disponible' }}</p>
        <p><strong>Servicio:</strong> {{ mensaje.servicioNombre || 'No disponible' }}</p>
        <p><strong>Fecha envío:</strong> {{ formatearFecha(mensaje.fechaEnvio) }}</p>
        <p><strong>Fecha original:</strong> {{ formatearFecha(mensaje.fechaOriginal ?? '') }}</p>
        <p><strong>Fecha solicitada:</strong> {{ formatearFecha(mensaje.fechaSolicitada) }}</p>
        <p><strong>Mensaje:</strong> {{ mensaje.mensaje || 'Sin mensaje' }}</p>
        
        <div v-if="getEstadoMensaje(mensaje.id) === 'aceptado'" class="estado aceptado">
          <span class="icono">✓</span> FECHA CAMBIADA
        </div>
        <div v-else-if="getEstadoMensaje(mensaje.id) === 'cancelado'" class="estado cancelado">
          <span class="icono">✗</span> FECHA CANCELADA
        </div>
        <div v-else-if="getEstadoMensaje(mensaje.id) === 'error'" class="estado error">
          <span class="icono">!</span> ERROR AL PROCESAR
          <button @click="resetEstadoMensaje(mensaje.id)" class="btn-reset">
            Reintentar
          </button>
        </div>
        <div v-else-if="getEstadoMensaje(mensaje.id) === 'procesando'" class="estado procesando">
          Procesando...
        </div>
        <div v-else class="acciones">
          <button class="btn-aceptar" @click="handleAceptarSolicitud(mensaje.id)">Aceptar</button>
          <button class="btn-cancelar" @click="handleCancelarSolicitud(mensaje.id)">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="!mensajeStore.cargando && !mensajeStore.error && mensajesFiltrados.length === 0" class="mensaje">
      No hay mensajes en este mes
    </div>
  </div>
</template>




<style lang="scss">
@import '../assets/styles/variables.scss';

.reservas {
  font-family: $fuente-principal;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .volver-atras {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    color: $color-principal;
    text-decoration: none;
    
    i {
      font-size: 1.2rem;
      transition: transform 0.2s;
    }

    &:hover i {
      transform: translateX(-4px);
    }
  }

  &__titulo {
    color: $color-titulos;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__filtros {
    margin-bottom: 2rem;
    
    .sesion-list {
      display: flex;
      align-items: center;
      gap: 1rem;

      label {
        font-weight: 600;
        color: $color-principal;
      }

      select {
        padding: 0.5rem 1rem;
        border: 2px solid $color-principal;
        border-radius: 8px;
        background: white;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }

  &__lista {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }

  .reserva-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    p {
      margin: 0.5rem 0;
      color: #333;

      strong {
        color: $color-titulos;
      }
    }

    .estado {
      padding: 0.8rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &.aceptado {
        background: #e8f5e9;
        color: #2e7d32;
        border: 2px solid #2e7d32;
      }

      &.cancelado {
        background: #ffebee;
        color: #c62828;
        border: 2px solid #c62828;
      }
      
      &.error {
        background: #fff3e0;
        color: #e65100;
        border: 2px solid #e65100;
        flex-direction: column;
        
        .btn-reset {
          margin-top: 0.5rem;
          padding: 0.3rem 0.8rem;
          font-size: 0.8rem;
          background: #ff9800;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          
          &:hover {
            background: #f57c00;
          }
        }
      }
      
      &.procesando {
        background: #e3f2fd;
        color: #1565c0;
        border: 2px solid #1565c0;
      }

      .icono {
        font-size: 1.2rem;
      }
    }

    .acciones {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      justify-content: center;

      button {
        padding: 0.6rem 1.2rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &.btn-aceptar {
          background: #4CAF50;
          color: white;

          &:hover {
            background: #45a049;
          }
        }

        &.btn-cancelar {
          background: #f44336;
          color: white;

          &:hover {
            background: #d32f2f;
          }
        }
      }
    }
  }

  .mensaje {
    text-align: center;
    padding: 2rem;
    color: #666;

    &.error {
      color: #d32f2f;
      
      .btn-retry {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        
        &:hover {
          background: #d32f2f;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .reservas {
    padding: 1rem;

    &__lista {
      grid-template-columns: 1fr;
    }

    .reserva-card {
      padding: 1rem;
    }
  }
}
</style>
