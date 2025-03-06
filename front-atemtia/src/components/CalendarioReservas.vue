<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSesionStore } from '../stores/sesion';

import { storeToRefs } from 'pinia';
import CalendarioReservas from '../components/CalendarioReservas.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const sesionStore = useSesionStore();
const {
  centros,
  servicios,
  centroSeleccionado,
  nombreCentroSeleccionado,
  cargandoCentros,
  cargandoServicios,
  error
} = storeToRefs(serviciosStore);

onMounted(() => {
  serviciosStore.cargarCentros();
});

function handleCentroChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  if (select && select.value) {
    serviciosStore.cargarServiciosPorCentro(Number(select.value));
  }
}

function formatPrecio(precio: number): string {
  return precio.toFixed(2) + ' €';
}

function formatDuracion(minutos: number | null): string {
  return minutos ? `${minutos} min` : '';
}

const servicioSeleccionado = ref<string | null>(null);
const mostrarCalendario = ref<boolean>(false);
const reservaConfirmada = ref<boolean>(false);
const fechaReserva = ref<string | null>(null);
const horaReserva = ref<string | null>(null);

function mostrarConfirmacion(servicio: string) {
  servicioSeleccionado.value = servicio;
}

function cerrarConfirmacion() {
  servicioSeleccionado.value = null;
}

function abrirCalendario() {
  mostrarCalendario.value = true;
}

function cerrarCalendario() {
  mostrarCalendario.value = false;
}

function confirmarFechaHora({ fecha, hora }: { fecha: string; hora: string }) {
  try {
    fechaReserva.value = fecha;
    horaReserva.value = hora;

    sesionStore.seleccionarFechaHora(`${fecha}T${hora}`);

    sesionStore.confirmarSesion()
      .then(() => {
        reservaConfirmada.value = true;
        mostrarCalendario.value = false;
      })
      .catch((err) => {
        error.value = err.message || 'Error al confirmar la reserva';
      });
  } catch (err) {
    console.error('Error en confirmarFechaHora:', err);
    error.value = 'Ocurrió un error al procesar la reserva.';
  }
}



function irHome() {
  router.push('/home-app-atemtia');
}
</script>

<template>
  <router-link to="/home-app-atemtia" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
  
  <div class="servicios-container">
    <h1>Nuestros Servicios</h1>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div class="selector-centro">
      <label for="centro">Selecciona tu centro:</label>

      <div v-if="cargandoCentros" class="loading">
        <p>Cargando centros...</p>
      </div>

      <select v-else id="centro" @change="handleCentroChange">
        <option value="">Selecciona un centro</option>
        <option v-for="centro in centros" :key="centro.id" :value="centro.id">
          {{ centro.nombre }}
        </option>
      </select>
    </div>

    <div v-if="centroSeleccionado" class="servicios-seccion">
      <h2>Servicios disponibles en {{ nombreCentroSeleccionado }}</h2>

      <div v-if="cargandoServicios" class="loading">
        <p>Cargando servicios...</p>
      </div>

      <div v-else-if="servicios.length === 0" class="no-servicios">
        <p>No hay servicios disponibles para este centro.</p>
      </div>

      <div v-else class="servicios-grid">
        <div v-for="servicio in servicios" :key="servicio.id" class="servicio-card">
          <h3>{{ servicio.nombre }}</h3>
          <p class="descripcion">{{ servicio.descripcion }}</p>
          <div v-for="opcion in servicio.opciones" :key="opcion.id" class="opcion-servicio">
            <p class="opcion-descripcion">{{ opcion.descripcion }}</p>
            <p v-if="opcion.sesionesPorSemana" class="sesiones">
              {{ opcion.sesionesPorSemana }}
              {{ opcion.sesionesPorSemana === 1 ? 'sesión por semana' : 'sesiones por semana' }}
            </p>
            <p class="duracion">{{ formatDuracion(opcion.duracionMinutos) }}</p>
            <div class="precio-container">
              <p class="precio">{{ formatPrecio(opcion.precio) }}</p>
              <button class="btn--reservar" @click="mostrarConfirmacion(servicio.nombre)">
                RESERVAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación -->
  <div v-if="servicioSeleccionado && !mostrarCalendario && !reservaConfirmada" class="modal" @click.self="cerrarConfirmacion">
    <div class="modal-content">
      <p>¿Quieres reservar el servicio: <strong>{{ servicioSeleccionado }}</strong>?</p>
      <div class="modal-buttons">
        <button class="boton-si" @click="abrirCalendario">SI</button>
        <button class="boton-no" @click="cerrarConfirmacion">NO</button>
      </div>
    </div>
  </div>

  <!-- Modal del calendario -->
  <div v-if="mostrarCalendario && !reservaConfirmada" class="modal" @click.self="">
    <CalendarioReservas @confirmarFechaHora="confirmarFechaHora" />
  </div>

  <!-- Modal de reserva confirmada -->
  <div v-if="reservaConfirmada" class="modal">
    <div class="modal-content">
      <h2>Reserva Confirmada</h2>
      <p>Tu reserva ha sido confirmada para:</p>
      <ul>
        <li><strong>Día:</strong> {{ fechaReserva }}</li>
        <li><strong>Hora:</strong> {{ horaReserva }}</li>
      </ul>
      <!-- Puedes añadir más detalles, como el empleado asignado -->
      <button @click="irHome">Aceptar</button>
    </div>
  </div>
</template>
  
  <style lang="scss">
  @import '../assets/styles/variables.scss';
  
  .calendario-reservas {
    max-width: 600px;
    margin: auto;
    background-color: $color-fondo;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  
    h2 {
      color: $color-titulos;
      font-family: $fuente-principal;
      margin-bottom: 15px;
      text-align: center;
      font-size: 1.4rem;
      font-weight: bold;
      border-bottom: solid $color-secundario;
      padding-bottom: .5rem;
      
  } 
     
  .error {
       color:red;}
       .calendario-reservas {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: $color-fondo;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    font-family: $fuente-principal;
    color: $color-titulos;
    font-size: 1.5rem;
    margin-bottom: 15px;
    border-bottom: solid $color-secundario;
    padding-bottom: .5rem;
  }

  .instrucciones {
    font-family: $fuente-principal;
    color: $color-principal;
    font-size: 1rem;
    margin-bottom: 20px;
  }

  input[type="datetime-local"] {
    width: calc(100% - 40px);
    max-width: 400px;
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
    border: solid 1px #ddd;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 15px;

    &:focus {
      outline: none;
      border-color: $color-secundario;
      box-shadow: inset 0px 2px 6px rgba($color-secundario, 0.3);
    }
  }

  .error {
    color: red;
    font-family: $fuente-principal;
    margin-bottom: 15px;
    font-size: .9rem;
    font-weight: bold;
  }

  .btn-confirmar {
  background-color: $color-secundario;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-size: 0.8rem;

  &:hover {
    background-color: $color-principal;
  }
}

}
  }
  </style>