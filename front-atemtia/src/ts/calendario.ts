import { ref, onMounted, onUnmounted, computed } from 'vue';

export function useCalendario() {
  const contenedor = ref<HTMLElement | null>(null);
  const nav = ref<HTMLElement | null>(null);
  const btn = ref<HTMLElement | null>(null);
  const fechaActual = ref(new Date());
  const actividades = ref<Record<string, { hora: string; titulo: string; ubicacion: string }[]>>({
    "2025-02-05": [{ hora: "15:55", titulo: "Desarrollo web", ubicacion: "2SWD - S1 (Ordenadores)" }],
    "2025-02-03": [
      { hora: "10:00", titulo: "Revisión de proyecto", ubicacion: "Sala 3" },
      { hora: "12:30", titulo: "Reunión con equipo", ubicacion: "Sala 2" },
    ],
    "2025-02-04": [{ hora: "09:00", titulo: "Taller de innovación", ubicacion: "Auditorio" }],
  });

  // Computed para filtrar las actividades por fecha
  const actividadesDelDia = computed(() => {
    const diaClave = fechaActual.value.toISOString().split("T")[0];
    return actividades.value[diaClave] || [];
  });

  function abrirCalendario() {
    if (contenedor.value && nav.value) {
      contenedor.value.classList.toggle('active');
      nav.value.classList.toggle('active');
      if (nav.value.classList.contains('active')) {
        document.addEventListener('click', cerrarCalendarioFuera);
      } else {
        document.removeEventListener('click', cerrarCalendarioFuera);
      }
    }
  }

  function cerrarCalendarioFuera(event: Event) {
    if (nav.value && contenedor.value && btn.value) {
      if (!nav.value.contains(event.target as Node) && !btn.value.contains(event.target as Node)) {
        contenedor.value.classList.remove('active');
        nav.value.classList.remove('active');
        document.removeEventListener('click', cerrarCalendarioFuera);
      }
    }
  }

  function esLaborable(fecha: Date): boolean {
    const diaSemana = fecha.getDay();
    return diaSemana !== 0 && diaSemana !== 6;
  }

  function cambiarDia(direccion: number) {
    do {
      fechaActual.value.setDate(fechaActual.value.getDate() + direccion);
    } while (!esLaborable(fechaActual.value));
    actualizarCalendario();
  }

  function actualizarCalendario() {
    const opcionesFecha: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const fechaElemento = document.getElementById("fecha-actual");
    if (fechaElemento) {
      fechaElemento.innerText = fechaActual.value.toLocaleDateString("es-ES", opcionesFecha);
    }

    const agenda = actividadesDelDia.value;
    const contenidoAgenda = document.getElementById("contenido-agenda");
    if (contenidoAgenda) {
      contenidoAgenda.innerHTML = "";
      if (agenda.length === 0) {
        contenidoAgenda.innerHTML = "<p>No hay actividades para este día.</p>";
      } else {
        agenda.forEach((actividad) => {
          const item = document.createElement("div");
          item.className = "agenda-item";
          item.innerHTML = `
            <div class="time">${actividad.hora}</div>
            <div class="details">
              <div class="title">${actividad.titulo}</div>
              <div class="location">${actividad.ubicacion}</div>
            </div>
          `;
          contenidoAgenda.appendChild(item);
        });
      }
    }
  }

  onMounted(() => {
    if (!esLaborable(fechaActual.value)) {
      cambiarDia(1);
    } else {
      actualizarCalendario();
    }
  });

  onUnmounted(() => {
    document.removeEventListener('click', cerrarCalendarioFuera);
  });

  return { contenedor, nav, btn, abrirCalendario, cambiarDia, fechaActual, actividadesDelDia };
}
