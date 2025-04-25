<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReservasStore } from '../stores/reservas'

const reservasStore = useReservasStore()

const usuarioSeleccionado = ref<number | null>(null)
const mesSeleccionado = ref<number | null>(null) // 0 = enero, 1 = febrero, etc.

onMounted(() => {
  reservasStore.cargarReservas()
})

const reservasFiltradas = computed(() => {
  return reservasStore.reservas.filter(reserva => {
    const fecha = new Date(reserva.fecha)
    const coincideUsuario = usuarioSeleccionado.value
      ? reserva.usuario.id === usuarioSeleccionado.value
      : true
    const coincideMes = mesSeleccionado.value !== null
      ? fecha.getMonth() === mesSeleccionado.value
      : true
    return coincideUsuario && coincideMes
  })
})

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
</script>

<template>
  <div class="reservas">
    <router-link to="/home-app-atemtia" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>

    <h2 class="reservas__titulo">Historial de Reservas</h2>

    <div v-if="reservasStore.cargando" class="mensaje">Cargando reservas...</div>
    <div v-if="reservasStore.error" class="mensaje error">{{ reservasStore.error }}</div>

    <!-- Filtros -->
    <div v-if="!reservasStore.cargando && !reservasStore.error" class="reservas__filtros">
      <!-- Filtro usuario -->
      <div class="sesion-list" v-if="reservasStore.usuariosAsignados.length > 1">
        <label>Filtrar</label>
        <select v-model="usuarioSeleccionado">
          <option :value="null">Todos</option>
          <option v-for="u in reservasStore.usuariosAsignados" :key="u.id" :value="u.id">
            {{ u.nombre }}
          </option>
        </select>
      </div>
      <!-- Filtro mes -->
      <div class="sesion-list">
        <label>Filtrar</label>
        <select v-model="mesSeleccionado">
          <option :value="null">Todos</option>
          <option v-for="(mes, i) in meses" :key="i" :value="i">{{ mes }}</option>
        </select>
      </div>
    </div>

    <!-- Lista de reservas -->
    <div v-if="!reservasStore.cargando && !reservasStore.error" class="reservas__lista">
      <div
        v-for="reserva in reservasFiltradas"
        :key="reserva.id"
        class="reserva-card"
      >
        <h3>{{ reserva.usuario.nombre }}</h3>
        <p><strong>Servicio:</strong> {{ reserva.servicio.nombre }}</p>
        <p><strong>Empleado:</strong> {{ reserva.empleado.nombre }}</p>
        <p><strong>Centro:</strong> {{ reserva.centro.nombre }}</p>
        <p><strong>Precio:</strong> {{ reserva.tarifa.precio }} €</p>
        <p><strong>Fecha:</strong> {{ new Date(reserva.fecha).toLocaleString() }}</p>
        <p><strong>Facturado:</strong> {{ reserva.facturar ? "Sí" : "No" }}</p>
      </div>
    </div>

    <div v-if="!reservasStore.cargando && !reservasStore.error && reservasFiltradas.length === 0" class="mensaje">
      No hay reservas en este mes
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
        color:rgb(0, 0, 0);

        strong {
          color: $color-titulos;
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

  li,
  .sesion-item {
    display: inline-block;
    background: #b5e3ff;
    color: #222;
    font-family: $fuente-principal;
    font-weight: 600;
    font-size: 1rem;
    padding: 6px 18px;
    border-radius: 12px;
    border: 1px solid #a3d6f2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: box-shadow 0.15s, background 0.15s, transform 0.12s;
    cursor: pointer;
    margin: 0;
    line-height: 1.3;
    min-width: 120px;
    text-align: center;

    &:hover {
      background: #a3d6f2;
      box-shadow: 0 6px 18px rgba(0,0,0,0.10);
      color: #1a1a1a;
      border-color: #7fc9e9;
      transform: translateY(-2px) scale(1.04);
    }
  }
}

/* Filtro de mes */
.sesion-list label {
  font-family: $fuente-principal;
  font-weight: 600;
  color: #007bff;
  margin-right: 8px;
  font-size: 1rem;
}

.sesion-list select {
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

/* Opcional: más separación si necesitas */
.sesion-list {
  margin-bottom: 1.2rem;
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