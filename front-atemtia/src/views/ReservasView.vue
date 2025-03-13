<script setup lang="ts">
import { onMounted } from 'vue';
import { useReservasStore } from '../stores/reservas';

const reservasStore = useReservasStore();

// Cargar las reservas al montar el componente
onMounted(() => {
  reservasStore.cargarReservas();
});
</script>

<template>
  <div class="reservas">
    <router-link to="/home-app-atemtia" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>

    <h2 class="reservas__titulo">Historial de Reservas</h2>

    <!-- Mostrar mensajes de carga o error -->
    <div v-if="reservasStore.cargando" class="mensaje">Cargando reservas...</div>
    <div v-if="reservasStore.error" class="mensaje error">{{ reservasStore.error }}</div>

    <!-- Mostrar lista de reservas -->
    <div v-if="!reservasStore.cargando && !reservasStore.error" class="reservas__lista">
      <div
        v-for="reserva in reservasStore.reservas"
        :key="reserva.id"
        class="reserva-card"
      >
        <h3>{{ reserva.usuario.nombre }}</h3>
        <p><strong>Servicio:</strong> {{ reserva.servicio.nombre }}</p>
        <p><strong>Empleado:</strong> {{ reserva.empleado.nombre }}</p>
        <p><strong>Centro:</strong> {{ reserva.centro.nombre }}</p>
        <p><strong>Precio:</strong> {{ reserva.opcionServicio.precio }} €</p>
        <p><strong>Fecha:</strong> {{ new Date(reserva.fecha).toLocaleString() }}</p>
        <p><strong>Facturado:</strong> {{ reserva.facturar ? "Sí" : "No" }}</p>
      </div>
    </div>

    <!-- Mostrar mensaje si no hay reservas -->
    <div v-if="!reservasStore.cargando && !reservasStore.error && reservasStore.reservas.length === 0" class="mensaje">
      No hay reservas disponibles.
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.reservas {
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
    flex-direction: column;
    gap: 15px;

    .reserva-card {
      color: $color-fondo;
      padding: 15px;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;

      h3 {
        font-size: 20px;
        margin-bottom: 10px;
        color: $color-secundario;
      }

      p {
        margin-bottom: 5px;
        color:black;

        strong {
          color: $color-titulos;
        }
      }
    }
  }

  .mensaje {
    font-size: 16px;

    &.error {
      color: red;
    }
  }
}
</style>
```