<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import es from 'date-fns/locale/es';

const hoy = new Date();
const mesActual = ref(hoy);

const eventos = ref([
  { fecha: '2025-04-11', titulo: 'La competencia', color: '#3b82f6' },
  { fecha: '2025-04-11', titulo: 'Ceremonia', color: '#dc2626' },
  { fecha: '2025-04-14', titulo: 'Reunión', color: '#facc15' },
  { fecha: '2025-04-11', titulo: 'La competencia', color: '#0000FF' },
]);

const diasDelMes = computed(() => {
  const inicio = startOfMonth(mesActual.value);
  const fin = endOfMonth(mesActual.value);
  return eachDayOfInterval({ start: inicio, end: fin });
});

const eventosPorDia = (dia: Date) => {
  const fechaFormateada = format(dia, 'yyyy-MM-dd');
  return eventos.value.filter((evento) => evento.fecha === fechaFormateada);
};

const cambiarMes = (accion: 'anterior' | 'siguiente') => {
  mesActual.value =
    accion === 'siguiente'
      ? addMonths(mesActual.value, 1)
      : subMonths(mesActual.value, 1);
};
</script>

<template>
  <div class="calendario">
    <div class="calendario__header">
      <button @click="cambiarMes('anterior')">⬅</button>
      <h2>{{ format(mesActual, 'MMMM yyyy', { locale: es }) }}</h2>
      <button @click="cambiarMes('siguiente')">➡</button>
    </div>

    <div class="calendario__grid">
      <div v-for="dia in diasDelMes" :key="dia.toISOString()" class="calendario__dia">
        <span class="calendario__numero">{{ format(dia, 'd') }}</span>
        
        <!-- Contenedor de eventos -->
        <div v-if="eventosPorDia(dia).length > 0" class="evento-container">
          <div
            v-for="(evento, index) in eventosPorDia(dia)"
            :key="index"
            class="evento"
            :style="{
              backgroundColor: evento.color,
              height: eventosPorDia(dia).length === 1 ? '100%' : '50%',
              width: '100%',
              position: 'absolute',
              top: eventosPorDia(dia).length === 2 && index === 1 ? '50%' : '0'
            }"
          >
            {{ evento.titulo }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.calendario {
  max-width: 600px;
  margin: auto;
  text-align: center;
  font-family: 'Open Sans', sans-serif;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #f3f4f6;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    padding: 10px;
  }

  &__dia {
    border: 1px solid #ddd;
    padding: 10px;
    min-height: 80px;
    position: relative;
    background: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden; /* Evitar que los eventos se desborden fuera de la casilla */
  }

  &__numero {
    font-size: 16px;
    font-weight: bold;
  }

  .evento-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
    position: relative;
  }

  .evento {
    font-size: 12px;
    padding: 2px 5px;
    margin-top: 3px;
    color: white;
    border-radius: 4px;
    text-align: center;
    width: 100%;
    position: absolute;
  }
}
</style>