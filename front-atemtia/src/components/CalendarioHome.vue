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
  { fecha: '2025-04-02', titulo: 'Piscina', descripcion: 'Clases de natación.', color: '#34d399' },
  { fecha: '2025-04-06', titulo: 'Fisioterapia', descripcion: 'Rehabilitación muscular.', color: '#f87171' },
  { fechaInicio: '2025-04-10', fechaFin: '2025-04-12', titulo: 'Reunión', descripcion: 'Proyecto importante.', color: '#facc15' },
]);

const eventoSeleccionado = ref<{ titulo: string; descripcion: string; x: number; y: number; color: string } | null>(null);

const diasDelMes = computed(() => {
  const inicio = startOfMonth(mesActual.value);
  const fin = endOfMonth(mesActual.value);
  return eachDayOfInterval({ start: inicio, end: fin });
});

const eventosPorDia = (dia: Date) => {
  const fechaFormateada = format(dia, 'yyyy-MM-dd');
  return eventos.value.filter((evento) =>
    evento.fecha === fechaFormateada ||
    (evento.fechaInicio && evento.fechaFin &&
      fechaFormateada >= evento.fechaInicio &&
      fechaFormateada <= evento.fechaFin)
  );
};

const cambiarMes = (accion: 'anterior' | 'siguiente') => {
  mesActual.value =
    accion === 'siguiente'
      ? addMonths(mesActual.value, 1)
      : subMonths(mesActual.value, 1);
};

const seleccionarEvento = (evento: { titulo: string; descripcion: string; color: string }, event: MouseEvent) => {
  eventoSeleccionado.value = {
    ...evento,
    x: event.clientX,
    y: event.clientY,
  };
};

const cerrarTooltip = () => {
  eventoSeleccionado.value = null;
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
      <div class="calendario__dia" v-for="dia in diasDelMes" :key="dia.toISOString()">
        <span class="calendario__numero">{{ format(dia, 'd') }}</span>
        <div v-if="eventosPorDia(dia).length > 0" class="evento-container">
          <div
            v-for="(evento, index) in eventosPorDia(dia)"
            :key="index"
            class="evento"
            :style="{ backgroundColor: evento.color }"
            @click="seleccionarEvento(evento, $event)"
          >
            {{ evento.titulo }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip flotante con color dinámico -->
    <div
      v-if="eventoSeleccionado"
      class="tooltip"
      :style="{
        top: `${eventoSeleccionado.y}px`,
        left: `${eventoSeleccionado.x}px`,
        backgroundColor: eventoSeleccionado.color
      }"
    >
      <div class="tooltip__header">
        <span>{{ eventoSeleccionado.titulo }}</span>
        <button @click="cerrarTooltip">✖</button>
      </div>
      <p class="tooltip__descripcion">{{ eventoSeleccionado.descripcion }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.calendario {
  max-width: 100%;
  margin: auto;
  text-align: center;
  padding: 10px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: #f3f4f6;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 5px;
  }

  &__dia {
    border: 1px solid #ddd;
    padding: 5px;
    min-height: 60px;
    background: white;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  &__numero {
    font-size: 14px;
    font-weight: bold;
  }

  .evento-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3px;
  }

  .evento {
    font-size: 10px;
    padding: 3px;
    margin-top: 2px;
    color: white;
    border-radius: 3px;
    text-align: center;
    width: 90%;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;

    &:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }
}

/* Tooltip flotante con color dinámico */
.tooltip {
  position: fixed;
  color: #333;
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  max-width: 260px;
  z-index: 1000;
  transform: translate(-50%, -100%);
  font-family: 'Arial', sans-serif;

  &__header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    color: white;
  }

  &__descripcion {
    font-size: 12px;
    margin-top: 4px;
    color: white;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: white;
  }
}

/* 📌 Estilos para pantallas más grandes (Desktop) */
@media (min-width: 768px) {
  .calendario {
    max-width: 650px;
    padding: 20px;

    &__header {
      font-size: 18px;
    }

    &__grid {
      gap: 5px;
    }

    &__dia {
      min-height: 80px;
      padding: 10px;
    }

    &__numero {
      font-size: 16px;
    }

    .evento {
      font-size: 12px;
      padding: 5px;
    }
  }

  .tooltip {
    min-width: 200px;
    max-width: 300px;
    padding: 10px;

    &__descripcion {
      font-size: 14px;
    }

    button {
      font-size: 16px;
    }
  }
}
</style>
