<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useServiciosStore } from '../stores/servicios';
import { useSesionStore } from '../stores/sesion';
import { storeToRefs } from 'pinia';
import BotonScrolltop from '../components/BotonScrolltop.vue';
import CalendarioReservas from '../components/CalendarioReservas.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const serviciosStore = useServiciosStore();
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

const { idOpcionServicio } = storeToRefs(sesionStore);
const { seleccionarFechaHora } = sesionStore;

const servicioSeleccionado = ref<string | null>(null);
const servicioSeleccionadoId = ref<number | null>(null);
const mostrarCalendario = ref<boolean>(false);
const reservaConfirmada = ref<boolean>(false);
const fechaReserva = ref<string | null>(null);
const horaReserva = ref<string | null>(null);

onMounted(() => {
  serviciosStore.cargarCentros();

  if (centroSeleccionado.value) {
    serviciosStore.cargarServiciosPorCentro(Number(centroSeleccionado.value));
  }
});

watch(centroSeleccionado, (newCentro) => {
  if (newCentro) {
    serviciosStore.cargarServiciosPorCentro(Number(newCentro));
  }
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

function mostrarConfirmacion(servicio: string, servicioId: number, opcionId: number) {
  servicioSeleccionado.value = servicio;
  servicioSeleccionadoId.value = servicioId;
  idOpcionServicio.value = opcionId;
}

function cerrarConfirmacion() {
  servicioSeleccionado.value = null;
}

function abrirCalendario() {
  if (servicioSeleccionadoId.value && idOpcionServicio.value !== null) {
    serviciosStore.seleccionarServicio(servicioSeleccionadoId.value);
    mostrarCalendario.value = true;
  } else {
    alert('Por favor, selecciona una opción de servicio antes de proceder.');
  }
}

function handleFechaHoraSeleccionada(fechaHora: { fecha: string; hora: string }) {
  const fechaSeleccionada = new Date(fechaHora.fecha);
  const diaSemana = fechaSeleccionada.getDay(); // 0 = Domingo, 6 = Sábado
  const horaSeleccionada = parseInt(fechaHora.hora.split(':')[0]); // Extrae la hora como número entero

  // Verifica si es fin de semana
  if (diaSemana === 0 || diaSemana === 6) {
    alert('Solo se pueden seleccionar días laborables (lunes a viernes).');
    return;
  }

  // Verifica si la hora está en los rangos permitidos
  const esHoraValida = 
    (horaSeleccionada >= 9 && horaSeleccionada <= 13) || 
    (horaSeleccionada >= 16 && horaSeleccionada <= 20);

  if (!esHoraValida) {
    alert('Las reservas solo están permitidas entre las 9:00-13:00 y 16:00-20:00 en horas exactas.');
    return;
  }

  const fechaHoraISO = `${fechaHora.fecha}T${fechaHora.hora}:00.000Z`;

  seleccionarFechaHora(fechaHoraISO);

  const datosReserva = {
    fechaHora: fechaHoraISO,
    idCentro: Number(centroSeleccionado.value),
    idServicio: servicioSeleccionadoId.value,
    idOpcionServicio: idOpcionServicio.value,
    idUsuario: 1,
    idTutor: 1,
    idEmpleado: 1 
  };

  fetch('https://localhost:7163/api/Sesion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosReserva),
  })
    .then(response => response.json())
    .then(data => {
      reservaConfirmada.value = true;
      fechaReserva.value = fechaHora.fecha;
      horaReserva.value = fechaHora.hora;
      mostrarCalendario.value = false;
      alert('Reserva confirmada exitosamente!');
    })
    .catch(error => {
      alert('Error al confirmar la reserva: ' + error.message);
    });
}

function handleCancelarFechaHora() {
  mostrarCalendario.value = false;
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
              <button class="btn-reservar" @click="mostrarConfirmacion(servicio.nombre, servicio.id, opcion.id)">
                RESERVAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="servicioSeleccionado && !mostrarCalendario && !reservaConfirmada" class="modal" @click.self="cerrarConfirmacion">
    <div class="modal-content">
      <p>¿Quieres reservar el servicio: <strong>{{ servicioSeleccionado }}</strong>?</p>
      <div class="modal-buttons">
        <button class="boton-si" @click="abrirCalendario">SI</button>
        <button class="boton-no" @click="cerrarConfirmacion">NO</button>
      </div>
    </div>
  </div>

  <div v-if="mostrarCalendario" class="modal">
    <div class="modal-content">
      <CalendarioReservas
        @confirmarFechaHora="handleFechaHoraSeleccionada"
        @cancelarFechaHora="handleCancelarFechaHora"
      />
    </div>
  </div>

  <div v-if="reservaConfirmada" class="modal">
    <div class="modal-content">
      <h2>Reserva Confirmada</h2>
      <p>Tu reserva ha sido confirmada para:</p>
      <ul>
        <li><strong>Día:</strong> {{ fechaReserva }}</li>
        <li><strong>Hora:</strong> {{ horaReserva }}</li>
      </ul>
      <button @click="irHome">Aceptar</button>
    </div>
  </div>

  <BotonScrolltop />
</template>


<style lang="scss">
@import '../assets/styles/variables.scss';

.volver-atras{
  margin-top: 15px;
  margin-left: 15px;
}

.servicios-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  h1 {
    color: $color-titulos;
    margin-bottom: 30px;
    text-align: center;
  }
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  p {
    margin: 0;
  }
}

.loading {
  padding: 15px;
  text-align: center;
  color: $color-principal;
  
  p {
    margin: 0;
    font-style: italic;
  }
}

.selector-centro {
  margin-bottom: 40px;
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: $color-titulos;
    font-size: 1.1rem;
  }
  
  select {
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid #ddd;
    width: 100%;
    max-width: 400px;
    font-size: 1rem;
    background-color: $color-fondo;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    &:focus {
      border-color: $color-principal;
      outline: none;
      box-shadow: 0 0 0 3px rgba($color-principal, 0.2);
    }
  }
}

.servicios-seccion {
  h2 {
    color: $color-titulos;
    margin-bottom: 25px;
    font-weight: 600;
    border-bottom: 2px solid $color-secundario;
    padding-bottom: 10px;
  }
}

.no-servicios {
  padding: 30px;
  background-color: $color-fondo;
  border-radius: 8px;
  text-align: center;
  color: #757575;
  
  p {
    margin: 0;
    font-size: 1.1rem;
  }
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.servicio-card {
  background-color: $color-fondo;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: $color-titulos;
    margin-bottom: 15px;
    font-size: 1.3rem;
  }
  
  .descripcion {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 15px;
  }
  
  .opcion-servicio {
    padding: 10px 0;
    
    .opcion-descripcion {
      font-size: 1.1rem;
      color: #333;
      margin-bottom: 5px;
    }
    
    .sesiones {
      font-size: 1rem;
      color: #777;
    }
    
    .duracion {
      font-size: 1rem;
      color: #777;
    }
    
    .precio-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      
      .precio {
        font-size: 1.3rem;
        font-weight: bold;
        color: $color-principal;
      }
      
      .btn-reservar {
         background-color: $color-secundario;
         color: white;
         border: none;
         padding: 8px 11px;
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
  }

.modal {
  background: white;
  padding: 60px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.modal-content {
  border-radius: 8px;
  background: $color-fondo;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: $fuente-principal;

  h2 {
    color: $color-titulos;
    margin-bottom: 15px;
    font-size: 1.5rem;
  }

  p {
    color: #444;
    font-size: 1.1rem;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;

    li {
      font-size: 1rem;
      color: #333;
      margin-bottom: 8px;
    }

    strong {
      color: $color-principal;
    }
  }
  button {
    background-color:$color-secundario;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: darken($color-boton, 10%);
      transform: scale(1.05);
    }
  }
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 10px;
}

.boton-si,
.boton-no {
  background-color: $color-secundario;
  border: none;
  padding: 10px 15px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #5e9422;
  }
}

.boton-no {
  background-color: rgb(194, 15, 15);
  
  &:hover {
    background-color: darken(#ddd, 10%);
  }
}
@media (max-width: 768px) {
  .servicios-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  
  .servicio-card {
    padding: 20px;
  &:hover {
    background-color: darken(#ddd, 10%);
  }
}

  .modal {
    width: 100%;
  }
}
}

</style>
