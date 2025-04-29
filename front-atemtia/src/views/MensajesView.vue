<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/login'
import { useMensajeConfirmacionStore } from '../stores/mensajeConfirmacion'
import type { MensajeConfirmacionAdaptado } from '../stores/mensajeConfirmacion'

const authStore = useAuthStore()
const mensajeStore = useMensajeConfirmacionStore()

const mesSeleccionado = ref<number | null>(null)

onMounted(async () => {
  const empleadoId = authStore.userId
  if (empleadoId) {
    await mensajeStore.cargarMensajesPorEmpleado(Number(empleadoId))
  }
})

const mensajesFiltrados = computed(() => {
  return mensajeStore.mensajes.filter((mensaje: MensajeConfirmacionAdaptado) => {
    const fecha = new Date(mensaje.fechaEnvio)
    const coincideMes = mesSeleccionado.value !== null
      ? fecha.getMonth() === mesSeleccionado.value
      : true
    return coincideMes
  })
})

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

// Acciones para aceptar o cancelar mover sesión
const aceptarSolicitud = async (mensajeId: number) => {
  const empleadoId = authStore.userId
  if (empleadoId) {
    await mensajeStore.aceptarMovimiento(mensajeId, Number(empleadoId))
  }
}
const cancelarSolicitud = async (mensajeId: number) => {
  const empleadoId = authStore.userId
  if (empleadoId) {
    await mensajeStore.cancelarMovimiento(mensajeId, Number(empleadoId))
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
      <div v-if="mensajeStore.error" class="mensaje error">{{ mensajeStore.error }}</div>
  
      <!-- Filtro mes -->
      <div v-if="!mensajeStore.cargando && !mensajeStore.error" class="reservas__filtros">
        <div class="sesion-list">
          <label>Filtrar por mes</label>
          <select v-model="mesSeleccionado">
            <option :value="null">Todos</option>
            <option v-for="(mes, i) in meses" :key="i" :value="i">{{ mes }}</option>
          </select>
        </div>
      </div>
  
      <!-- Lista de mensajes -->
      <div v-if="!mensajeStore.cargando && !mensajeStore.error" class="reservas__lista">
        <div
          v-for="mensaje in mensajesFiltrados"
          :key="mensaje.id"
          class="reserva-card"
        >
          <p><strong>Usuario:</strong> {{ mensaje.usuarioNombre }}</p>
          <p><strong>Tutor:</strong> {{ mensaje.tutorNombre }}</p>
          <p><strong>Servicio:</strong> {{ mensaje.servicioNombre }}</p>
          <p><strong>Fecha envío:</strong> {{ new Date(mensaje.fechaEnvio).toLocaleString() }}</p>
          <p><strong>Mensaje:</strong> {{ mensaje.mensaje }}</p>
          <div class="acciones">
            <button class="btn-aceptar" @click="aceptarSolicitud(mensaje.id)">Aceptar</button>
            <button class="btn-cancelar" @click="cancelarSolicitud(mensaje.id)">Cancelar</button>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .volver-atras {
    align-self: flex-start;
    margin-bottom: 20px;
    background-color: $color-boton;
    color: $color-fondo;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;

    i {
      font-size: 20px;
    }
  }

  &__titulo {
    color: $color-titulos;
    font-size: 24px;
    margin-bottom: 20px;
  }

  &__lista {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;

    .reserva-card {
      color: $color-fondo;
      padding: 15px;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
      min-width: 270px;
      background: #e8f7ff;

      h3 {
        font-size: 20px;
        margin-bottom: 10px;
        color: $color-secundario;
      }

      p {
        margin-bottom: 5px;
        color:rgb(0, 0, 0);

        strong {
          color: $color-titulos;
        }
      }

      .acciones {
        margin-top: 10px;
        display: flex;
        gap: 10px;

        .btn-aceptar {
          background: #6fcf97;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
          &:hover { background: #4caf50; }
        }
        .btn-cancelar {
          background: #ff8585;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
          &:hover { background: #e53935; }
        }
      }
    }
  }

  .mensaje {
    font-size: 16px;

    &.error {
      color: $color-secundario;
    }
  }

  .sesion-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;

    label {
      font-family: $fuente-principal;
      font-weight: 600;
      color: #007bff;
      margin-right: 8px;
      font-size: 1rem;
    }

    select {
      font-family: $fuente-principal;
      font-size: 1rem;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid #a3d6f2;
      background: #f5fbff;
      color: #222;
      outline: none;
      transition: border 0.2s, box-shadow 0.2s;

      &:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.15);
      }
    }
  }
}
@media (max-width: 768px) {
  .reservas {
    &__lista {
      flex-direction: column;
      align-items: center;
    }
    .sesion-list {
      justify-content: center;
    }
    .reserva-card {
      width: 100%;
      max-width: 320px;
    }
  }
}
</style>
