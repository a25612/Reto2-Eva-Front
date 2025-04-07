<script>
import { useDate } from 'vuetify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  data: () => ({
    type: 'month',
    filteredWeekdays: [1, 2, 3, 4, 5], // Solo lunes a viernes
    value: [new Date()],
    events: [],
    dialog: false,
    selectedEvent: {},
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange'],
    titles: ['Reunión', 'Vacaciones', 'PTO', 'Viaje', 'Evento', 'Cumpleaños'],
  }),
  mounted() {
    const adapter = useDate()
    this.getEvents({
      start: adapter.startOfDay(adapter.startOfMonth(new Date())),
      end: adapter.endOfDay(adapter.endOfMonth(new Date())),
    })
  },
  methods: {
    getEvents({ start, end }) {
      const events = []
      const min = start
      const max = end // Definir correctamente la variable max
      const days = (max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24)
      const eventCount = this.rnd(days / 2, days)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp)

        // Asegurarse de que el evento no caiga en sábado o domingo
        if (first.getDay() === 0 || first.getDay() === 6) {
          continue; // Saltar sábado (0) o domingo (6)
        }

        const secondTimestamp = this.rnd(2, allDay ? (24 * 60) : (8 * 60)) * (60 * 1000)
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          title: this.titles[this.rnd(0, this.titles.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          allDay,
        })
      }

      this.events = events
    },
    rnd(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    showEventDetails(event) {
      this.selectedEvent = event
      this.dialog = true
    },
    formatDate(date) {
      return format(new Date(date), "PPPP p", { locale: es })
    },
    customDayFormat(date) {
      const day = date.getDay()
      // Si es sábado o domingo, no mostrar el día
      if (day === 0 || day === 6) {
        return ''; // Devolver una cadena vacía para sábado y domingo
      }
      return format(date, 'd'); // Para otros días, mostrar el número de día
    },
  },
}
</script>
<template>
  <div class="calendariohome">
    <v-sheet class="d-flex align-center justify-space-between" tile>
      <v-btn-toggle v-model="type" class="ma-2">
        <v-btn value="month">Mes</v-btn>
        <v-btn value="week">Semana</v-btn>
        <v-btn value="day">Día</v-btn>
      </v-btn-toggle>
    </v-sheet>

    <v-sheet>
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="filteredWeekdays"
        locale="es"
        @click:event="showEventDetails"
        :day-format="customDayFormat"
        :event-overlap-threshold="0"
        :event-overlap-mode="'stack'"
      >
        <template v-slot:event="{ event }">
          <v-btn
            class="event-button"
            @click="showEventDetails(event)"
            :color="event.color"
            text
          >
            {{ event.title }}
          </v-btn>
        </template>
      </v-calendar>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="orange--text">{{ selectedEvent.title }}</v-card-title>
        <v-card-text>
          <div><strong>Fecha:</strong> {{ formatDate(selectedEvent.start) }} - {{ formatDate(selectedEvent.end) }}</div>
          <div><strong>Descripción:</strong> {{ selectedEvent.title }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange" text @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<style lang="scss">
@import '../assets/styles/variables.scss';

.calendariohome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
}

@media (min-width: 768px) {
  .v-btn-group--density-default {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .v-theme--light {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .v-calendar-month__days > .v-calendar-month__day {
    min-height: 85px;
  }
}

/* Ocultar columnas de fines de semana */
.v-calendar-weekly__day--sat,
.v-calendar-weekly__day--sun {
  display: none;
}

/* Estilos para los botones de eventos */
.event-button {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 500;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    background-color: #e0e0e0;
    color: #000;
  }
}
.v-btn.v-btn--density-default {
  height: 20px;
}

</style>