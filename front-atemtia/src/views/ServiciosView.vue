<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServiciosStore } from '../stores/servicios';
import { storeToRefs } from 'pinia';

const serviciosStore = useServiciosStore();
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

// Estado para manejar la confirmación de reserva
const servicioSeleccionado = ref<string | null>(null);

function mostrarConfirmacion(servicio: string) {
  servicioSeleccionado.value = servicio;
}

function cerrarConfirmacion() {
  servicioSeleccionado.value = null;
}

function confirmarReserva() {
  alert(`Has reservado el servicio: ${servicioSeleccionado.value}`);
  cerrarConfirmacion();
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
              <div class="btn--reservar" @click="mostrarConfirmacion(servicio.nombre)">
                RESERVAR 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación -->
  <div v-if="servicioSeleccionado" class="modal">
    <div class="modal-content">
      <p>¿Quieres reservar el servicio: <strong>{{ servicioSeleccionado }}</strong>?</p>
      <div class="modal-buttons">
        <button class="boton-si" @click="confirmarReserva">SI</button>
        <button class="boton-no" @click="cerrarConfirmacion">NO</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eee;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    color: $color-principal;
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.3rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .descripcion {
    color: #555;
    margin-bottom: 15px;
    line-height: 1.6;
    flex-grow: 1;
  }

  .opcion-servicio {
    margin-top: 15px;
    padding: 10px;
    background-color: rgba($color-secundario, 0.05);
    border-radius: 5px;

    .opcion-descripcion {
      font-weight: 600;
      margin-bottom: 5px;
    }

    .sesiones, .duracion {
      font-size: 0.9rem;
      color: #666;
      margin: 2px 0;
    }

    .precio {
      color: $color-secundario;
      font-weight: 700;
      font-size: 1.2rem;
      margin-top: 5px;
    }
  }
}

.volver-atras {
  margin-left: 10px;
  margin-top: 10px;
  background-color: $color-boton;
  color: $color-fondo;
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
  z-index: 1000;
}
.btn--reservar {
  background-color: $color-secundario;
  color: $color-fondo;
  border: none;
  padding: 6px 10px; 
  font-size: 0.8rem; 
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  display: inline-block;
  text-align: right;
  margin-left: 190px;
  
  &:hover {
    background-color: $color-fondo;
    color: $color-secundario;
  }
}

.btn--reservar-container {
  display: flex;

  margin-top: 10px;
}


@media (max-width: 768px) {
  .servicios-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .servicio-card {
    padding: 20px;
  }
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
}

.modal-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.boton-si {
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    background-color: darken($color-secundario, 10%);
  }
}

.boton-no {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    background-color: darken($color-boton, 10%);
  }
  .servicio-card {
  .precio-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
  }
  .btn--reservar {
  background-color: red;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-size: 0.8rem;
 

  &:hover {
    background-color: darkred;
  }
}

.btn--pequeno {
  font-size: 0.8rem;
  padding: 6px 10px;
}

.opcion__precio-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
  


@media (max-width: 480px) {
  .servicios-grid {
    grid-template-columns: 1fr;
  }
  
  .selector-centro select {
    max-width: 100%;
  }
}
}
</style>