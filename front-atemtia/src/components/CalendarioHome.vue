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
    background-color: #e6f0ff; /* color de fondo azul */
    padding: 4px 6px;
    border-radius: 4px;
    line-height: 1.2;
    overflow-wrap: break-word;
    font-weight: 500;
  }
}



</style>
