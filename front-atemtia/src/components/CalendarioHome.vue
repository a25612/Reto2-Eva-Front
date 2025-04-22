<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const monthNamesLong = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const daysInMonthDefault = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const today = new Date()
const month = ref(today.getMonth())
const year = ref(today.getFullYear())

const currentDay = today.getDate()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

const daysInMonth = computed(() => {
  const days = [...daysInMonthDefault]
  if (isLeapYear(year.value)) days[1] = 29
  return days
})

const monthName = computed(() => monthNamesLong[month.value])
const firstDay = computed(() => new Date(year.value, month.value, 1).getDay())
const rowCount = computed(() =>
  Math.ceil((firstDay.value + daysInMonth.value[month.value]) / 7)
)

const calendarDayMatrix = computed(() => {
  const matrix: (number | null)[][] = []
  const totalDays = daysInMonth.value[month.value]
  const offset = firstDay.value

  for (let i = 0; i < rowCount.value; i++) {
    const row: (number | null)[] = []
    for (let j = 0; j < 7; j++) {
      const dayIndex = i * 7 + j
      if (dayIndex >= offset && dayIndex < offset + totalDays) {
        row.push(dayIndex - offset + 1)
      } else {
        row.push(null)
      }
    }
    matrix.push(row)
  }

  return matrix
})

const yearsRange = computed(() => {
  const base = currentYear
  return Array.from({ length: 4 }, (_, i) => base + i)
})

const sesiones = ref<any[]>([])
const selectedSesion = ref<any>(null)
const showModal = ref(false)

const fetchSesiones = async () => {
  try {
    const response = await fetch('https://localhost:7163/api/Sesion')
    if (!response.ok) {
      throw new Error('Error al obtener las sesiones')
    }
    const data = await response.json()
    sesiones.value = data
  } catch (error) {
    console.error('Error:', error)
  }
}

const sesionesPorDia = (dia: number) => {
  const mes = String(month.value + 1).padStart(2, '0')
  const diaStr = String(dia).padStart(2, '0')
  const fecha = `${year.value}-${mes}-${diaStr}`
  return sesiones.value.filter(s => s.fecha?.startsWith(fecha))
}

const openModal = (sesion: any) => {
  selectedSesion.value = sesion
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSesion.value = null
}

const getColorForService = (serviceName: string) => {
  const colors: { [key: string]: string } = {
    'matronatación': '#ADD8E6',
    'iniciación': '#90EE90',
    'natación y natación adaptada': '#00008B',
    'natación adultos': '#FFA500',
    'aquagym': '#FF69B4',
    'natación individual niños y adultos': '#FFFF00',
    'reserva de calle libre': '#808080',
    'fisioterapia': '#800080',
    'psicología': '#FF0000',
    'logopedia': '#A52A2A',
    'grupo de habilidades sociales': '#006400',
    'grupo de comunicación': '#87CEEB'
  }
  return colors[serviceName.toLowerCase()] || '#FFFFFF'
}

onMounted(() => {
  fetchSesiones()
})
</script>

<template>
  <div class="app">
    <div class="calendar container">
      <!-- Encabezado con mes y año -->
      <div class="calendar-date-header">
        <h1>{{ monthName }} {{ year }}</h1>

        <select class="month-select" v-model="month">
          <option v-for="(name, index) in monthNamesLong" :key="index" :value="index">
            {{ name }}
          </option>
        </select>
      </div>

      <!-- Tabla del calendario -->
      <table class="table calendar-table">
        <!-- Cabecera con los días de la semana -->
        <tr class="calendar-header">
          <td v-for="day in dayNamesShort" :key="day" class="calendar-header-day">
            {{ day }}
          </td>
        </tr>

        <!-- Días del mes -->
        <tr v-for="(row, i) in calendarDayMatrix" :key="i">
          <td
            v-for="(cell, j) in row"
            :key="j"
            class="calendar-day"
            :class="{ dead: !cell }"
          >
            <div v-if="cell" class="calendar-cell-content">
              <!-- Número del día -->
              <span
                :class="{
                  'day-number': true,
                  'day-number--today': cell === currentDay && month === currentMonth && year === currentYear
                }"
              >
                {{ cell }}
              </span>

              <!-- Lista de sesiones para el día -->
              <ul v-if="sesionesPorDia(cell).length" class="sesion-list">
                <li
                  v-for="(sesion, index) in sesionesPorDia(cell)"
                  :key="index"
                  class="sesion-item"
                  @click="openModal(sesion)"
                  :style="{ backgroundColor: getColorForService(sesion.servicio.nombre) }"
                >
                  <div class="sesion-name">
                    {{ sesion.servicio.nombre }}
                  </div>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Modal de información -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Información de la Sesión</h2>
        <p>Servicio: {{ selectedSesion?.servicio.nombre }}</p>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "Open Sans", sans-serif;
  background-color: #ffffff;
  color: #2c2c2c;
}

.app {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.calendar {
  .calendar-date-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #222;

    h1 {
      margin: 0;
      font-size: 2rem;
    }

    .month-select {
      font-size: 1rem;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    select {
      -webkit-appearance: auto;
      -moz-appearance: auto;
      appearance: auto;
      margin-right: 10px;
    }
  }

  .calendar-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.1);

    td {
      border: 1px solid #ddd;
      width: 100px;
      height: 100px;
      position: relative;
      padding: 0.25rem;
    }

    .calendar-header-day {
      font-weight: bold;
      background-color: #f7f7f7;
      color: #444;
      text-align: center;
    }

    .calendar-day {
      &.dead {
        background-color: #f0f0f0;
        color: #ccc;
      }

      .day-number {
        position: absolute;
        top: 8px;
        left: 8px;
        font-size: 0.95rem;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        display: inline-block;
      }

      .day-number--today {
        background-color: #007bff;
        color: white;
        font-weight: bold;
      }
    }
  }
}

.calendar-cell-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sesion-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #333;

  li {
    padding: 4px 6px;
    border-radius: 4px;
    line-height: 1.2;
    overflow-wrap: break-word;
    font-weight: 500;
    margin-top: 10px;
    cursor: pointer;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
  }

  p {
    margin: 1rem 0;
    font-size: 1rem;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>