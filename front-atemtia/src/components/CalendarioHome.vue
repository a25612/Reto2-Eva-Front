<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCalendarioHomeStore } from '../stores/calendariohome'
import { useAuthStore } from '../stores/login'

enum EstadoSesion {
  PENDIENTE = 0,
  CONFIRMADA = 1,
  CANCELADA = 2
}

const calendarioStore = useCalendarioHomeStore()
const authStore = useAuthStore()

onMounted(() => {
  calendarioStore.fetchSesiones()
})

const today = new Date()
const month = ref(today.getMonth())
const year = ref(today.getFullYear())
const currentDay = today.getDate()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const monthNamesLong = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const daysInMonthDefault = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

const daysInMonth = computed(() => {
  const days = [...daysInMonthDefault]
  if (isLeapYear(year.value)) days[1] = 29
  return days
})

const monthName = computed(() => monthNamesLong[month.value])

const firstDay = computed(() => {
  const jsDay = new Date(year.value, month.value, 1).getDay()
  return jsDay === 0 ? 6 : jsDay - 1
})

const calendarDayMatrix = computed(() => {
  const matrix: (number | null)[][] = []
  const totalDays = daysInMonth.value[month.value]
  let day = 1
  let offset = firstDay.value
  const rows = Math.ceil((offset + totalDays) / 6)
  for (let i = 0; i < rows; i++) {
    const row: (number | null)[] = []
    for (let j = 0; j < 6; j++) {
      if (i === 0 && j < offset) {
        row.push(null)
      } else if (day > totalDays) {
        row.push(null)
      } else {
        const date = new Date(year.value, month.value, day)
        if (date.getDay() === 0) {
          day++
          j--
          continue
        }
        row.push(day++)
      }
    }
    matrix.push(row)
  }
  return matrix
})

const calendarRows = computed(() =>
  calendarDayMatrix.value.filter(row => row.some(cell => cell !== null))
)

const sesiones = computed(() => calendarioStore.sesiones)
const sesionesPorDia = (dia: number) => {
  const mes = String(month.value + 1).padStart(2, '0')
  const diaStr = String(dia).padStart(2, '0')
  const fecha = `${year.value}-${mes}-${diaStr}`
  return sesiones.value.filter(s => s.fecha?.startsWith(fecha))
}

const selectedSesion = ref<any>(null)
const showModal = ref(false)

const usuariosGrupo = ref<any[]>([])
const usuariosGrupoLoading = ref(false)
const usuariosGrupoError = ref<string | null>(null)

const esSesionGrupal = (sesion: any) => {
  if (!sesion) return false
  const nombre = sesion.servicio?.nombre?.toLowerCase() || ''
  return nombre === 'matronatación' || nombre === 'iniciación'
}

const openModal = async (sesion: any) => {
  selectedSesion.value = sesion
  showModal.value = true

  const rol = authStore.rol?.toUpperCase()
  if (rol === 'PROFESIONAL' && esSesionGrupal(sesion)) {
    usuariosGrupoLoading.value = true
    usuariosGrupoError.value = null
    usuariosGrupo.value = []
    try {
      usuariosGrupo.value = await calendarioStore.fetchUsuariosGrupo(sesion.id)
    } catch (e: any) {
      usuariosGrupoError.value = e.message || 'Error al obtener los usuarios del grupo'
    } finally {
      usuariosGrupoLoading.value = false
    }
  } else {
    usuariosGrupo.value = []
  }
}

const closeModal = () => {
  showModal.value = false
  selectedSesion.value = null
  showDatePicker.value = false
  newDate.value = ''
  motivo.value = ''
  showMotivoCancelacion.value = false
  motivoCancelacion.value = ''
  usuariosGrupo.value = []
  usuariosGrupoError.value = null
  usuariosGrupoLoading.value = false
}

const showDatePicker = ref(false)
const newDate = ref('')
const motivo = ref('')

const showMotivoCancelacion = ref(false)
const motivoCancelacion = ref('')

const showConfirmCambio = ref(false)

const showAlertModal = ref(false)
const alertMessage = ref('')
const alertCallback = ref<null | (() => void)>(null)
function openAlert(message: string, callback?: () => void) {
  alertMessage.value = message
  showAlertModal.value = true
  alertCallback.value = callback || null
}
function closeAlert() {
  showAlertModal.value = false
  if (alertCallback.value) {
    alertCallback.value()
    alertCallback.value = null
  }
}

function esSesionPasada(sesion: any): boolean {
  if (!sesion?.fecha) return false
  const fechaSesion = new Date(sesion.fecha)
  const ahora = new Date()
  return fechaSesion < ahora
}

function getFechaInputValue(fechaStr?: string): string {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  const yyyy = fecha.getFullYear()
  const mm = String(fecha.getMonth() + 1).padStart(2, '0')
  const dd = String(fecha.getDate()).padStart(2, '0')
  const hh = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

const solicitarMoverSesion = async () => {
  showConfirmCambio.value = true
}

function faltanMenosDeDosHoras(sesion: any): boolean {
  if (!sesion?.fecha) return false
  const fechaSesion = new Date(sesion.fecha)
  const ahora = new Date()
  const diffMs = fechaSesion.getTime() - ahora.getTime()
  const diffHoras = diffMs / (1000 * 60 * 60)
  return diffHoras < 2
}

function isDomingo(fechaStr: string): boolean {
  if (!fechaStr) return false
  const fecha = new Date(fechaStr)
  return fecha.getDay() === 0
}

const confirmarMoverSesion = async () => {
  if (!newDate.value || !motivo.value || !selectedSesion.value) return

  const nuevaFecha = new Date(newDate.value)
  const fechaReservaActual = new Date(selectedSesion.value.fecha)

  if (nuevaFecha < fechaReservaActual) {
    showConfirmCambio.value = false
    openAlert('No puedes seleccionar una fecha anterior a la reserva actual.')
    return
  }
  if (esSesionPasada(selectedSesion.value)) {
    showConfirmCambio.value = false
    openAlert('No se puede mover una sesión pasada.')
    return
  }
  if (isDomingo(newDate.value)) {
    showConfirmCambio.value = false
    openAlert('No se puede seleccionar domingo.')
    return
  }

  if (!esHoraValidaParaSesion(newDate.value)) {
    showConfirmCambio.value = false
    openAlert('Solo puedes mover la sesión entre 7:30 y 14:00 o entre 15:00 y 20:00.');
    return
  }

  const ahora = new Date()
  const diffMs = fechaReservaActual.getTime() - ahora.getTime()
  const diffHoras = diffMs / (1000 * 60 * 60)
  if (diffHoras < 2) {
    showConfirmCambio.value = false
    openAlert('No se puede mover la sesión con menos de 2 horas de antelación.')
    return
  }

  await calendarioStore.solicitarMoverSesion(selectedSesion.value.id, newDate.value, motivo.value)
  showConfirmCambio.value = false

  openAlert('Solicitud de cambio enviada. El profesional debe confirmar el cambio.', () => {
    showDatePicker.value = false
    showModal.value = false
    newDate.value = ''
    motivo.value = ''
  })
}

const cancelarYCerrar = () => {
  showMotivoCancelacion.value = true
  motivoCancelacion.value = ''
  showDatePicker.value = false
  newDate.value = ''
  motivo.value = ''
}

const confirmarCancelarSesion = async () => {
  if (!selectedSesion.value) return
  if (esSesionPasada(selectedSesion.value)) {
    showMotivoCancelacion.value = false
    openAlert('No se puede cancelar una sesión pasada.')
    return
  }
  if (!motivoCancelacion.value.trim()) {
    openAlert('Por favor, indica un motivo para la cancelación.')
    return
  }
  await calendarioStore.cancelarSesion(selectedSesion.value.id, motivoCancelacion.value)
  showMotivoCancelacion.value = false
  motivoCancelacion.value = ''
  closeModal()
}

const getColorForService = (serviceName: string) => {
  const colors: { [key: string]: string } = {
    'matronatación': '#B5E3FF',
    'iniciación': '#D6F5D6',
    'natación y natación adaptada': '#E2E2FF',
    'natación': '#FFE5A3',
    'aquagym': '#FFD6F5',
    'natación individual niños y adultos': '#FFFFC2',
    'reserva de calle libre': '#E0E0E0',
    'fisioterapia': '#E5C6FF',
    'psicología': '#FFC2C2',
    'logopedia': '#FFD6B3',
    'grupo de habilidades sociales': '#B3FFD6',
    'grupo de comunicación': '#C2F0FF'
  }
  return colors[serviceName?.toLowerCase()] || '#FFFFFF'
}

const getFiguraByUsuario = (usuarioId: number) => {
  const figuras = ['cuadrado', 'rombo', 'triangulo', 'circulo']
  return figuras[usuarioId % figuras.length]
}

const formatFecha = (fechaStr?: string) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  return fecha.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function estadoSesionTexto(estado: number | undefined) {
  switch (estado) {
    case EstadoSesion.PENDIENTE: return 'Pendiente de confirmación'
    case EstadoSesion.CONFIRMADA: return 'Confirmada'
    case EstadoSesion.CANCELADA: return 'Cancelada'
    default: return estado ?? ''
  }
}

function esHoraValidaParaSesion(fechaStr: string, duracionMinutos = 60): boolean {
  if (!fechaStr) return false;
  const fecha = new Date(fechaStr);
  const inicioMinutos = fecha.getHours() * 60 + fecha.getMinutes();
  const finMinutos = inicioMinutos + duracionMinutos;

  const enManana = inicioMinutos >= 450 && finMinutos <= 840;
  const enTarde = inicioMinutos >= 900 && finMinutos <= 1200;

  return enManana || enTarde;
}

</script>


<template>
  <div class="app">
    <div class="calendar container">
      <div class="calendar-date-header">
        <h1>{{ monthName }} {{ year }}</h1>
        <select class="month-select" v-model="month">
          <option v-for="(name, index) in monthNamesLong" :key="index" :value="index">
            {{ name }}
          </option>
        </select>
      </div>
      <table class="table calendar-table">
        <tr class="calendar-header">
          <td v-for="day in dayNamesShort" :key="day" class="calendar-header-day">
            {{ day }}
          </td>
        </tr>
        <tr v-for="(row, i) in calendarRows" :key="i">
          <td v-for="(cell, j) in row" :key="j" class="calendar-day" :class="{ dead: !cell }">
            <div v-if="cell" class="calendar-cell-content">
              <span :class="{
                'day-number': true,
                'day-number--today': cell === currentDay && month === currentMonth && year === currentYear
              }">
                {{ cell }}
              </span>
              <ul v-if="sesionesPorDia(cell).length" class="sesion-list">
                <li v-for="(sesion, index) in sesionesPorDia(cell)" :key="index" class="sesion-item"
                  :class="{ 'sesion-cancelada': sesion.estado === EstadoSesion.CANCELADA }" @click="openModal(sesion)"
                  :style="sesion.estado === EstadoSesion.CANCELADA
                    ? { backgroundColor: '#F2F2F2', color: '#999', textDecoration: 'line-through', }
                    : { backgroundColor: getColorForService(sesion.servicio?.nombre) }">
                  <div class="sesion-name">
                    {{ sesion.servicio?.nombre }}
                    <span v-if="sesion.usuario?.id" :class="['figura', getFiguraByUsuario(sesion.usuario.id)]"
                      title="Identificador de usuario"></span>
                  </div>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- MODAL PRINCIPAL -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 style="color:#19b7e6;text-align:center;">Información de la Sesión</h2>
        <p><strong>Servicio:</strong> {{ selectedSesion?.servicio?.nombre }}</p>
        <p><strong>Usuario:</strong> {{ selectedSesion?.usuario?.nombre }}</p>
        <!-- Mostrar usuarios del grupo si es profesional y la sesión es grupal -->
        <div v-if="authStore.rol.toUpperCase() === 'PROFESIONAL' && esSesionGrupal(selectedSesion)">
          <p><strong>Usuarios del grupo:</strong></p>
          <div v-if="usuariosGrupoLoading">Cargando usuarios...</div>
          <div v-else-if="usuariosGrupoError" style="color:red">{{ usuariosGrupoError }}</div>
          <ul v-else>
            <li v-for="usuario in usuariosGrupo" :key="usuario.id">
              {{ usuario.nombre }}
            </li>
            <li v-if="usuariosGrupo.length === 0" style="color: #888;">No hay usuarios en este grupo</li>
          </ul>
        </div>

        <p><strong>Fecha:</strong> {{ formatFecha(selectedSesion?.fecha) }}</p>
        <p><strong>Centro:</strong> {{ selectedSesion?.centro?.nombre }}</p>
        <p v-if="selectedSesion?.estado !== EstadoSesion.CONFIRMADA">
          <strong>Estado:</strong> {{ estadoSesionTexto(selectedSesion?.estado) }}
        </p>

        <div class="botones-modal">
          <!-- Botón Mover: solo si faltan al menos 2 horas Y NO se muestra motivo cancelación -->
          <button v-if="authStore.rol.toUpperCase() === 'TUTOR'
            && !showDatePicker
            && selectedSesion?.estado !== EstadoSesion.CANCELADA
            && selectedSesion?.estado !== EstadoSesion.PENDIENTE
            && !esSesionPasada(selectedSesion)
            && !faltanMenosDeDosHoras(selectedSesion)
            && !showMotivoCancelacion" class="mover"
            @click="showDatePicker = true; newDate = getFechaInputValue(selectedSesion?.fecha); motivo = '';">
            Mover
          </button>

          <!-- Inputs para mover solo si la sesión NO es pasada -->
          <div
            v-if="showDatePicker && selectedSesion?.estado !== EstadoSesion.CANCELADA && !esSesionPasada(selectedSesion)"
            style="margin: 1rem 0; width: 100%;">
            <label for="nueva-fecha">Selecciona la nueva fecha y hora:</label>
            <input id="nueva-fecha" type="datetime-local" v-model="newDate" style="margin-left: 8px;"
              :min="getFechaInputValue(selectedSesion?.fecha)" />
            <span v-if="isDomingo(newDate)" style="color:red; font-size:0.9em;">
              No se puede seleccionar domingo
            </span>
            <div class="motivo-centrado">
              <label for="motivo" style="margin-bottom: 0.25rem;"><strong>Motivo:</strong></label>
              <textarea id="motivo" v-model="motivo" rows="3" placeholder="Escribe el motivo..." />
            </div>
            <div class="botones-modal" style="margin-top:1rem;">
              <button class="mover" :disabled="!newDate || !motivo || isDomingo(newDate)" @click="solicitarMoverSesion"
                style="background: #ffb326; color: white; margin-left: 1rem;">
                Solicitar cambio
              </button>
            </div>
          </div>

          <!-- Botón Cancelar sesión -->
          <button v-if="['TUTOR', 'PROFESIONAL'].includes(authStore.rol.toUpperCase())
            && selectedSesion?.estado !== EstadoSesion.CANCELADA
            && selectedSesion?.estado !== EstadoSesion.PENDIENTE
            && !esSesionPasada(selectedSesion)
            && !showMotivoCancelacion" class="cancelar" @click="cancelarYCerrar">
            Cancelar
          </button>

          <!-- Campo motivo cancelación -->
          <div v-if="showMotivoCancelacion" class="motivo-centrado">
            <label for="motivo-cancelacion"><strong>Motivo de la cancelación:</strong></label>
            <textarea id="motivo-cancelacion" v-model="motivoCancelacion" rows="3" placeholder="Escribe el motivo..." />
            <div class="botones-modal">
              <button class="cancelar" :disabled="!motivoCancelacion.trim()" @click="confirmarCancelarSesion">
                Sí, cancelar sesión
              </button>
              <button class="cerrar" @click="showMotivoCancelacion = false; motivoCancelacion = '';">
                No, volver
              </button>
            </div>
          </div>

          <!-- El botón cerrar siempre aparece -->
          <button class="cerrar" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMAR SOLICITAR CAMBIO -->
    <div v-if="showConfirmCambio" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <h2>¿Seguro que quieres solicitar el cambio de fecha?</h2>
        <p><strong>Nueva fecha:</strong> {{ formatFecha(newDate) }}</p>
        <p><strong>Motivo:</strong> {{ motivo }}</p>
        <div class="botones-modal">
          <button class="mover" @click="confirmarMoverSesion">Sí, solicitar cambio</button>
          <button class="cerrar" @click="showConfirmCambio = false">No, volver</button>
        </div>
      </div>
    </div>

    <!-- MODAL ALERTA PERSONALIZADO -->
    <div v-if="showAlertModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <h2>Atención</h2>
        <p>{{ alertMessage }}</p>
        <div class="botones-modal">
          <button class="cerrar" @click="closeAlert">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.app {
  font-family: $fuente-principal;
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

  .sesion-cancelada {
    background-color: #F2F2F2;
    color: #999;
    text-decoration: line-through;

  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  z-index: 10000;
  font-family: $fuente-principal;
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
    color: $color-titulos;
  }

  p {
    margin: 1rem 0;
    font-size: 1rem;
  }

  .botones-modal {
    justify-content: center;
    gap: 1rem;
    margin-top: 25px;
  }

  .mover {
    background-color: #f5a01b;
    margin-left: 10px;
    color: #ffffff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      background-color: #c77800;
      color: #ffffff;
    }
  }

  .cancelar {
    background-color: #E53935;
    margin-left: 10px;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s;

    &:hover {
      background-color: #B71C1C;
      color: #fff;
    }
  }

  .cerrar {
    background-color: $color-boton;
    margin-left: 10px;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.figura {
  display: inline-block;
  vertical-align: middle;
  width: 12px;
  height: 12px;
  background: transparent;
}

.figura.cuadrado {
  background: #333;
  border-radius: 4px;
}

.figura.circulo {
  background: #3498db;
  border-radius: 50%;
}

.figura.rombo {
  background: #e67e22;
  transform: rotate(45deg);
  border-radius: 4px;
}

.figura.triangulo {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid #0dac35;
  border-radius: 0;
  margin-left: 10px;
  vertical-align: middle;
}

.motivo-centrado {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

.custom-select-motivo {
  position: relative;
  width: 210px;
  margin-top: 0.2rem;
}

.custom-select-motivo select {
  width: 110%;
  font-size: 1rem;
  padding: 0.5em 2.2em 0.5em 1em;
  border: 1px solid #caced1;
  border-radius: 8px;
  color: #394066;
  background: #fff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-sizing: border-box;
  cursor: pointer;
  height: 40px;
  line-height: 1.2;
}

.custom-select-motivo select:focus {
  border-color: #007bff;
  outline: none;
}

.custom-select-motivo::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 2.5px;
  width: 0;
  height: 0;
  pointer-events: none;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid #394066;
  transform: translateY(-50%);
}

.motivo-centrado {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  padding: 1.2rem 1rem 1rem 1rem;
  background: #fafbfc;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(80, 80, 80, 0.07);

  label {
    font-size: 1.08rem;
    color: #333;
    margin-bottom: 0.5rem;
    font-weight: 600;
    align-self: flex-start;
  }

  textarea {
    width: 100%;
    min-height: 70px;
    max-height: 180px;
    padding: 0.7em 1em;
    border: 1.5px solid #caced1;
    border-radius: 8px;
    font-size: 1rem;
    color: #222;
    background: #fff;
    resize: vertical;
    margin-bottom: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px #007bff22;
      outline: none;
    }
  }

  .botones-modal {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: flex-end;

    button {
      min-width: 120px;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }

    .cancelar {
      background: #e53935;
      color: #fff;

      &:hover:enabled {
        background: #b71c1c;
      }

      &:disabled {
        background: #f7bdbd;
        color: #fff;
        cursor: not-allowed;
      }
    }

    .cerrar {
      background: #e0e0e0;
      color: #333;

      &:hover {
        background: #bdbdbd;
      }
    }
  }
}


@media (max-width: 768px) {
  .modal-content {

    max-width: 85vw;
    width: 85vw;
    border-radius: 0;
    font-size: 0.95rem;
    border-radius: 8px;

    h2 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.95rem;
    }

    .botones-modal {
      flex-direction: column;
      gap: 0.5rem;
      align-items: stretch;
    }

    .mover,
    .cancelar,
    .cerrar {
      margin-top: 10px;
      width: 100%;
      font-size: 1rem;
      padding: 0.75rem 0.5rem;
    }
  }

  .motivo-centrado {
    padding: 1rem 0.2rem;

    textarea {
      font-size: 0.98rem;
    }

    .botones-modal {
      flex-direction: column;
      gap: 0.5rem;
    }

    button {
      width: 100%;
    }
  }
}
</style>
