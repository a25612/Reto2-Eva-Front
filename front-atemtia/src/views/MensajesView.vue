<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/login'
import { useMensajeConfirmacionStore } from '../stores/mensajeConfirmacion'
import type { MensajeConfirmacionAdaptado } from '../stores/mensajeConfirmacion'

const authStore = useAuthStore()
const mensajeStore = useMensajeConfirmacionStore()
const tipoFiltro = ref<string>('')
const mesSeleccionado = ref<number | null>(null)
const estadosMensajes = ref<Map<number, 'pendiente' | 'procesando' | 'aceptado' | 'cancelado' | 'error'>>(new Map())
const lastAction = ref<{ type: 'aceptar' | 'cancelar', id: number } | null>(null)

const getEstadoMensaje = (id: number) => {
  const mensaje = mensajeStore.mensajes.find(m => m.id === id)
  return estadosMensajes.value.get(id) || mensaje?.estado || 'pendiente'
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
  const userId = authStore.userId
  if (authStore.rol && authStore.rol.toUpperCase() === 'TUTOR' && userId) {
    await mensajeStore.cargarMensajesPorTutor(Number(userId))
  } else if (userId) {
    await mensajeStore.cargarMensajesPorProfesional(Number(userId))
  }
})

const mensajesFiltrados = computed(() => {
  return mensajeStore.mensajes
    .slice()
    .sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime()) 
    .filter((mensaje: MensajeConfirmacionAdaptado) => {
      const fecha = new Date(mensaje.fechaEnvio)
      const coincideMes = mesSeleccionado.value !== null
        ? fecha.getMonth() === mesSeleccionado.value
        : true
      const coincideTipo = tipoFiltro.value
        ? mensaje.tipo === tipoFiltro.value
        : true
      return coincideMes && coincideTipo
    })
})

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const handleAceptarSolicitud = async (mensajeId: number) => {
  if (getEstadoMensaje(mensajeId) === 'procesando') return
  const userId = authStore.userId
  if (!userId) return
  lastAction.value = { type: 'aceptar', id: mensajeId }
  estadosMensajes.value.set(mensajeId, 'procesando')
  try {
    await mensajeStore.aceptarMovimiento(mensajeId)
    estadosMensajes.value.set(mensajeId, 'aceptado')
    if (authStore.rol && authStore.rol.toUpperCase() === 'TUTOR') {
      await mensajeStore.cargarMensajesPorTutor(Number(userId))
    } else {
      await mensajeStore.cargarMensajesPorProfesional(Number(userId))
    }
    mensajeStore.error = null
  } catch (error) {
    estadosMensajes.value.set(mensajeId, 'error')
    mensajeStore.error = 'Error al aceptar la solicitud. Por favor, inténtalo de nuevo.'
  }
}

const handleCancelarSolicitud = async (mensajeId: number) => {
  if (getEstadoMensaje(mensajeId) === 'procesando') return
  const userId = authStore.userId
  if (!userId) return
  lastAction.value = { type: 'cancelar', id: mensajeId }
  estadosMensajes.value.set(mensajeId, 'procesando')
  try {
    await mensajeStore.cancelarMovimiento(mensajeId)
    estadosMensajes.value.set(mensajeId, 'cancelado')
    if (authStore.rol && authStore.rol.toUpperCase() === 'TUTOR') {
      await mensajeStore.cargarMensajesPorTutor(Number(userId))
    } else {
      await mensajeStore.cargarMensajesPorProfesional(Number(userId))
    }
    mensajeStore.error = null
  } catch (error) {
    estadosMensajes.value.set(mensajeId, 'error')
    mensajeStore.error = 'Error al cancelar la solicitud. Por favor, inténtalo de nuevo.'
  }
}

const formatearFecha = (fechaStr: string) => {
  if (!fechaStr) return 'Fecha no disponible'
  try {
    let fechaIso = fechaStr.includes('T') ? fechaStr : fechaStr.replace(' ', 'T')
    // Si no tiene Z ni offset, añade Z para forzar UTC
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(fechaIso) && !/Z|[+\-]\d{2}:?\d{2}$/.test(fechaIso)) {
      fechaIso += 'Z'
    }
    const fecha = new Date(fechaIso)
    if (isNaN(fecha.getTime())) return 'Fecha no disponible'
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid'
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
        <label>Tipo de mensaje</label>
        <select v-model="tipoFiltro">
          <option value="">Todos</option>
          <option value="MOVIDA">Movida</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

    </div>

    <div v-if="!mensajeStore.cargando && !mensajeStore.error" class="reservas__lista">
      <div v-for="mensaje in mensajesFiltrados" :key="mensaje.id" class="reserva-card">
        <p>
          <strong class="titulo-info">Usuarios:</strong>
          <span v-if="mensaje.usuariosNombres && mensaje.usuariosNombres.length">
            {{ mensaje.usuariosNombres.join(', ') }}
          </span>
          <span v-else>No disponible</span>
        </p>
        <p><strong class="titulo-info">Tutor:</strong> {{ mensaje.tutorNombre}}</p>
        <p><strong class="titulo-info">Servicio:</strong> {{ mensaje.servicioNombre}}</p>
        <p><strong class="titulo-info">Servicio:</strong> {{ mensaje.servicioNombre}}</p>
        <p><strong class="titulo-info">Tipo:</strong> {{ mensaje.tipo}}</p>
        <p><strong class="titulo-info">Fecha envío:</strong> {{ formatearFecha(mensaje.fechaEnvio) }}</p>
        <p><strong class="titulo-info">Fecha original:</strong> {{ formatearFecha(mensaje.fechaOriginal ?? '') }}</p>
        <p><strong class="titulo-info">Fecha solicitada:</strong> {{ formatearFecha(mensaje.fechaSolicitada) }}</p>
        <p><strong class="titulo-info">Mensaje:</strong> {{ mensaje.mensaje || 'Sin mensaje' }}</p>

        <div v-if="mensaje.tipo === 'CANCELADA'" class="estado cancelado">
          <span class="icono">✗</span>
          SESIÓN CANCELADA
        </div>

        <div v-else>
          <div v-if="getEstadoMensaje(mensaje.id) === 'aceptado'" class="estado aceptado">
            <span class="icono">✓</span> SOLICITUD ACEPTADA
          </div>
          <div v-else-if="getEstadoMensaje(mensaje.id) === 'cancelado'" class="estado cancelado">
            <span class="icono">✗</span> SOLICITUD CANCELADA
          </div>
          <div
            v-else-if="getEstadoMensaje(mensaje.id) === 'pendiente' && authStore.rol && authStore.rol.toUpperCase() === 'TUTOR'"
            class="estado pendiente">
            <span class="icono spin-clockwise">⏳</span> PENDIENTE DE CONFIRMAR
          </div>
          <div v-else-if="getEstadoMensaje(mensaje.id) === 'error'" class="estado error">
            <span class="icono">!</span> ERROR AL PROCESAR
          </div>
          <div v-else-if="getEstadoMensaje(mensaje.id) === 'procesando'" class="estado procesando">
            Procesando...
          </div>
          <div v-else-if="authStore.rol && authStore.rol.toUpperCase() !== 'TUTOR'" class="acciones">
            <button class="btn-aceptar" @click="handleAceptarSolicitud(mensaje.id)">
              Aceptar
            </button>
            <button class="btn-cancelar" @click="handleCancelarSolicitud(mensaje.id)">
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <div v-if="!mensajeStore.cargando && !mensajeStore.error && mensajesFiltrados.length === 0" class="mensaje">
        No hay mensajes en este mes
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.reservas {
  font-family: $fuente-principal;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .volver-atras {
    margin-right: auto;
    background-color: $color-boton;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease;

    &:hover {
      background-color: darken($color-boton, 10%);
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
      margin-left: 22px;
      display: flex;
      align-items: center;
      gap: 1rem;

      label {
        font-weight: 600;
        color: $color-titulos;
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
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }

  .reserva-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-2px);
    }

    p {
      margin: 0 0 0.3rem 0;
      color: #222;
      font-size: 1rem;
      line-height: 1.5;
    }

    .titulo-info {
      color: $color-titulos;
      font-weight: 700;
      margin-right: 4px;
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

      &.pendiente {
        background: #fffde7;
        color: #fbc02d;
        border: 2px solid #fbc02d;
        padding: 0.8rem;
        font-size: 1.1rem;
        border-radius: 8px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
        width: 100%;
        box-sizing: border-box;
        gap: 0.5rem;
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

@keyframes spinClockwise {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
  }
}

.spin-clockwise {
  display: inline-block;
  animation: spinClockwise 3.5s linear infinite;
}


@media (max-width: 768px) {
  .reservas__lista {
    grid-template-columns: 1fr;
  }

  .reserva-card {
    padding: 1rem;
  }
}
</style>
