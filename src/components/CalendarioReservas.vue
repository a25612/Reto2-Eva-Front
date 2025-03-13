<script setup lang="ts">
import { ref } from 'vue';

const fechaSeleccionada = ref('');
const horaSeleccionada = ref('');
const error = ref('');

const emit = defineEmits(['confirmarFechaHora', 'cancelarFechaHora']);

function cancelarSeleccion() {
  console.log("Cancelado");
  emit('cancelarFechaHora');
}

function confirmarSeleccion() {
  if (!fechaSeleccionada.value || !horaSeleccionada.value) {
    error.value = 'Por favor, selecciona una fecha y hora validas.';
    return;
  }

  emit('confirmarFechaHora', {
    fecha: fechaSeleccionada.value,
    hora: horaSeleccionada.value,
  });
}
</script>

<template>
  <div class="calendario-reservas">
    <h2>Selecciona Fecha y Hora</h2>
    <input type="date" v-model="fechaSeleccionada" />
    <input type="time" v-model="horaSeleccionada" />

    <div class="botones-calendario">
      <button @click="confirmarSeleccion">Aceptar</button>
      <button @click="cancelarSeleccion">Cancelar</button>
    </div>

    <p v-if="error">{{ error }}</p>
  </div>
</template>



<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.calendario-reservas {
  padding: 20px;
  border: 1px solid $color-secundario;
  border-radius: 8px;
  background-color: $color-fondo;

  .botones-calendario {
    display: flex; 
    justify-content: space-around; 
    margin-top: 20px;
  }

  button {
    padding: 8px 12px;
    background-color: $color-boton;
    color: $color-fondo;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: darken($color-boton, 10%);
    }

    &:disabled {
      background-color: lighten($color-boton, 20%);
      cursor: not-allowed;
    }
  }
}

h2 {
  color: $color-titulos;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

input[type="date"],
input[type="time"] {
  margin-right: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid $color-principal;

  &:focus {
    outline: none;
    border-color: $color-secundario;
  }
}

p {
  color: red;
}
</style>
