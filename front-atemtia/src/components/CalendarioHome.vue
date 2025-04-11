<script>
import { useDate } from 'vuetify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default {
  data: () => ({
    type: 'month',
    filteredWeekdays: [1, 2, 3, 4, 5],
    value: [new Date()],
    events: [],
    dialog: false,
    selectedEvent: {},
    newDate: null,
    userRole: 'empleado',
    confirmationDialog: false,
    confirmationMessage: '',
    isMovingEvent: false,
    availableDates: [
      '2025-04-15',
      '2025-04-16',
      '2025-04-17',
      '2025-04-18',
      '2025-04-19',
    ],
  }),
  computed: {
    formattedAvailableDates() {
      return this.availableDates.map(date => ({
        value: date,
        text: `(${format(new Date(date), 'dd/MM/yy')})`,  // Formato de fecha modificado
      }))
    },
  },
  mounted() {
    const adapter = useDate()
    const start = adapter.startOfDay(adapter.startOfMonth(new Date()))
    const end = adapter.endOfDay(adapter.endOfMonth(new Date()))
    this.getEvents(start, end)
  },
  methods: {
    async getEvents(start, end) {
      try {
        const res = await fetch('https://localhost:7163/api/Sesion/Usuario/1/PorFecha?fecha=2025-04-10T07%3A30%3A44.624Z')
        const data = await res.json()
        this.events = data.map(evento => {
          const servicioNombre = evento.servicio ? evento.servicio.nombre : 'Servicio sin nombre'
          const servicioDescripcion = evento.servicio ? evento.servicio.descripcion : 'Descripción no disponible'
          const startDate = evento.fecha_inicio ? new Date(evento.fecha_inicio) : new Date()
          const endDate = evento.fecha_fin ? new Date(evento.fecha_fin) : new Date()
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null

          return {
            nombre: servicioNombre,
            descripcion: servicioDescripcion,
            start: startDate,
            end: endDate,
            usuario: evento.usuario?.nombre || 'Usuario sin nombre',
            empleado: evento.empleado?.nombre || 'Empleado sin nombre',
            centro: evento.centro?.nombre || 'Centro sin nombre',
          }
        }).filter(event => event !== null)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    },
    showEventDetails(event) {
      this.selectedEvent = event
      this.dialog = true
    },
    formatDate(date) {
      return format(new Date(date), "dd/MM/yy", { locale: es })  // Formato de fecha modificado
    },
    customDayFormat(date) {
      const day = date.getDay()
      if (day === 0 || day === 6) return ''
      return format(date, 'd')
    },
    requestMoveEvent() {
      if (this.userRole === 'empleado') {
        this.confirmationMessage = `Se ha solicitado mover el evento "${this.selectedEvent.nombre}" al día ${this.formatDate(this.newDate)}.`
        this.confirmationDialog = true
      } else {
        this.moveEvent()
      }
    },
    moveEvent() {
      if (this.newDate) {
        const newStartDate = new Date(this.newDate)
        if (newStartDate < new Date()) {
          alert("No puedes mover el evento a una fecha anterior al día de hoy.")
          return
        }
        const index = this.events.findIndex(e => e === this.selectedEvent)
        if (index !== -1) {
          const duracion = this.events[index].end.getTime() - this.events[index].start.getTime()
          this.events[index].start = newStartDate
          this.events[index].end = new Date(newStartDate.getTime() + duracion)
          this.dialog = false
          this.newDate = null
          this.confirmationMessage = `Se ha movido el evento "${this.events[index].nombre}" al día ${this.formatDate(newStartDate)}.`
          this.confirmationDialog = true
        }
      }
    },
    deleteEvent() {
      const index = this.events.findIndex(e => e === this.selectedEvent)
      if (index !== -1) this.events.splice(index, 1)
      this.dialog = false
    },
    confirmMove() {
      this.moveEvent()
      this.confirmationDialog = false
    },
    cancelMove() {
      this.confirmationDialog = false
    },
    handleViewChange() {
      const startDate = new Date(this.value[0])
      let endDate

      if (this.type === 'month') {
        startDate.setDate(1)
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      } else if (this.type === 'week') {
        const day = startDate.getDay()
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1)
        startDate.setDate(diff)
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
      } else if (this.type === 'day') {
        endDate = new Date(startDate)
      }

      this.getEvents(startDate, endDate)
    }
  },
  watch: {
    type() {
      this.handleViewChange()
    },
    value() {
      this.handleViewChange()
    }
  }
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
            {{ event.nombre }}
          </v-btn>
        </template>
      </v-calendar>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="orange--text">{{ selectedEvent.nombre }}</v-card-title>
        <v-card-text>
          <div><strong>Fecha:</strong> {{ formatDate(selectedEvent.start) }} - {{ formatDate(selectedEvent.end) }}</div>
          <div><strong>Descripción:</strong> {{ selectedEvent.descripcion }}</div>
          <div><strong>Usuario:</strong> {{ selectedEvent.usuario }}</div>
          <div><strong>Empleado:</strong> {{ selectedEvent.empleado }}</div>
          <div><strong>Centro:</strong> {{ selectedEvent.centro }}</div>

          <v-select
            v-model="newDate"
            :items="formattedAvailableDates"
            item-text="text"
            item-value="value"
            label="Mover a otro día"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn class="move-button" @click="requestMoveEvent">Mover</v-btn>
          <v-btn color="red" @click="deleteEvent">Eliminar</v-btn>
          <v-btn color="orange" text @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template>
  <div class="calendariohome">
    <v-dialog v-model="confirmationDialog" max-width="500px">
      <v-card>
        <v-card-title class="orange--text">Confirmar Movimiento</v-card-title>
        <v-card-text>
          <div>{{ confirmationMessage }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="confirmMove">Sí</v-btn>
          <v-btn color="red" @click="cancelMove">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

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

/* Estilos para el botón de mover */
.move-button {
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
}
.v-btn.v-btn--density-default{
  margin-top: 10px;
  height: 20px;
}
</style>
  