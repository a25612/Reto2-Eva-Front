<script setup lang="ts">
import { onMounted } from 'vue';
import { useServicios } from '../ts/servicios';

const {
  centros,
  servicios,
  centroSeleccionado,
  nombreCentroSeleccionado,
  cargandoCentros,
  cargandoServicios,
  error,
  cargarCentros,
  cargarServiciosPorCentro,
  formatPrecio
} = useServicios();

// Cargar los centros cuando se monta el componente
onMounted(() => {
  cargarCentros();
});

// Función para manejar el cambio de centro con tipado correcto
function handleCentroChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  if (select && select.value) {
    cargarServiciosPorCentro(Number(select.value));
  }
}
</script>

<template>
  <div class="servicios-container">
    <h1>Nuestros Servicios</h1>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- Selector de centros -->
    <div class="selector-centro">
      <label for="centro">Selecciona tu centro:</label>
      
      <div v-if="cargandoCentros" class="loading">
        <p>Cargando centros...</p>
      </div>
      
      <select 
        v-else
        id="centro" 
        @change="handleCentroChange"
      >
        <option value="">Selecciona un centro</option>
        <option v-for="centro in centros" :key="centro.id" :value="centro.id">
          {{ centro.nombre }}
        </option>
      </select>
    </div>
    
    <!-- Sección de servicios -->
    <div v-if="centroSeleccionado" class="servicios-seccion">
      <h2>Servicios disponibles en {{ nombreCentroSeleccionado }}</h2>
      
      <!-- Indicador de carga -->
      <div v-if="cargandoServicios" class="loading">
        <p>Cargando servicios...</p>
      </div>
      
      <!-- Mensaje cuando no hay servicios -->
      <div v-else-if="servicios.length === 0" class="no-servicios">
        <p>No hay servicios disponibles para este centro.</p>
      </div>
      
      <!-- Grid de servicios -->
      <div v-else class="servicios-grid">
        <div v-for="servicio in servicios" :key="servicio.id" class="servicio-card">
          <h3>{{ servicio.nombre }}</h3>
          <p class="descripcion">{{ servicio.descripcion }}</p>
          <p class="precio">{{ formatPrecio(servicio.precio) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Variables
$fuente-principal: 'Raleway', sans-serif;
$color-secundario: #76b82a;
$color-boton: #0094ca;
$color-titulos: #41add8;
$color-principal: #63bde1;
$color-fondo: #FFFFFF;

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
  background-color: #f5f5f5;
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
    margin-bottom: 20px;
    line-height: 1.6;
    flex-grow: 1;
  }
  
  .precio {
    color: $color-secundario;
    font-weight: 700;
    font-size: 1.4rem;
    margin: 0;
    text-align: right;
    background-color: rgba($color-secundario, 0.1);
    padding: 8px 15px;
    border-radius: 5px;
    align-self: flex-end;
  }
}

// Responsive
@media (max-width: 768px) {
  .servicios-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .servicio-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .servicios-grid {
    grid-template-columns: 1fr;
  }
  
  .selector-centro select {
    max-width: 100%;
  }
}
</style>
