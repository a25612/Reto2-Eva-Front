<script setup lang="ts">
import { ref, computed } from 'vue';


const centros = ref(['Espacio Atemtia', 'San Martín de Porres']);
const seleccion = ref(centros.value[0]);


const servicios = computed(() => {
  return seleccion.value === 'Espacio Atemtia'
    ? []
    : [];
});
</script>

<template>
  <div>
    <label for="opcion">Selecciona tu centro:</label>
    <select id="opcion" v-model="seleccion">
      <option v-for="opcion in centros" :key="opcion" :value="opcion">
        {{ opcion }}
      </option>
    </select>

    <div v-if="servicios.length">
      <h3>Servicios disponibles:</h3>
      <ul>
        <li v-for="servicio in servicios" :key="servicio">{{ servicio }}</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

ul {
  list-style: none;
  padding: 0;
}


</style>
