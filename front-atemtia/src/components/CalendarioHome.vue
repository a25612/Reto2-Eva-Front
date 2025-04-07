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
        :weekdays="weekday"
        locale="es"
        @click:event="showEventDetails"
      ></v-calendar>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="orange--text">{{ selectedEvent.title }}</v-card-title>
        <v-card-text>
          <div><strong>Fecha:</strong> {{ formatDate(selectedEvent.start) }} - {{ formatDate(selectedEvent.end) }}</div>
          <div><strong>Descripción:</strong> {{ selectedEvent.title }}</div>
          <div>Detalles adicionales del evento pueden ir aquí.</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange" text @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useDate } from 'vuetify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  data: () => ({
    type: 'month',
    weekdays: [
      { title: 'Dom - Sáb', value: [0, 1, 2, 3, 4, 5, 6] },
      { title: 'Lun - Dom', value: [1, 2, 3, 4, 5, 6, 0] },
      { title: 'Lun - Vie', value: [1, 2, 3, 4, 5] },
      { title: 'Lun, Mié, Vie', value: [1, 3, 5] },
    ],
    weekday: [0, 1, 2, 3, 4, 5, 6],
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
      const max = end
      const days = (max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24)
      const eventCount = this.rnd(days / 2, days)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp)
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
  },
}
</script>

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

</style>
