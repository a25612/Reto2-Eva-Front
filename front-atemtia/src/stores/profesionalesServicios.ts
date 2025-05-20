import { defineStore } from "pinia";
import { ref } from "vue";

interface Profesional {
  id: number;
  nombre: string;
}

interface Servicio {
  id: number;
  nombre: string;
}

interface RelacionPS {
  idProfesional: number;
  idServicio: number;
  profesionalNombre: string;
  servicioNombre: string;
}

export const useProfesionalesServiciosStore = defineStore("profesionalesServiciosStore", () => {
  const relaciones = ref<RelacionPS[]>([]);
  const relacionesFiltradas = ref<RelacionPS[]>([]);
  const profesionales = ref<Profesional[]>([]);
  const servicios = ref<Servicio[]>([]);

  const mostrarFormularioCrear = ref(false);
  const relacionActual = ref<RelacionPS | null>(null);

  const cargarRelaciones = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/ProfesionalesServicios");
      if (!res.ok) throw new Error("Error al obtener relaciones");
      const data = await res.json();
      relaciones.value = data.map((rel: any) => ({
        idProfesional: rel.idProfesional ?? rel.iD_PROFESIONAL,
        idServicio: rel.idServicio ?? rel.iD_SERVICIO,
        profesionalNombre: rel.profesional?.nombre ?? "",
        servicioNombre: rel.servicio?.nombre ?? "",
      }));
      relacionesFiltradas.value = relaciones.value;
    } catch (err) {
      console.error("Error al cargar relaciones:", err);
    }
  };

  const cargarProfesionales = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Profesionales");
      if (!res.ok) throw new Error("Error al obtener profesionales");
      const data = await res.json();
      profesionales.value = data;
    } catch (err) {
      console.error("Error al cargar profesionales:", err);
    }
  };

  const cargarServicios = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Servicios");
      if (!res.ok) throw new Error("Error al obtener servicios");
      const data = await res.json();
      servicios.value = data;
    } catch (err) {
      console.error("Error al cargar servicios:", err);
    }
  };

  const guardarRelacion = async (relacion: { idProfesional: number; idServicio: number }) => {
    try {
      // PUT y POST usan los dos IDs como identificador compuesto
      const existe = relaciones.value.find(
        r => r.idProfesional === relacion.idProfesional && r.idServicio === relacion.idServicio
      );
      let response;
      if (existe) {
        // PUT
        response = await fetch(
          `https://localhost:7163/api/ProfesionalesServicios/${relacion.idProfesional}/${relacion.idServicio}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idProfesional: relacion.idProfesional, idServicio: relacion.idServicio }),
          }
        );
      } else {
        // POST
        response = await fetch("https://localhost:7163/api/ProfesionalesServicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idProfesional: relacion.idProfesional, idServicio: relacion.idServicio }),
        });
      }
      if (!response.ok) throw new Error("Error al guardar relación");
      await cargarRelaciones();
    } catch (error) {
      console.error("Error al guardar relación:", error);
    }
  };

  const eliminarRelacion = async (idProfesional: number, idServicio: number) => {
    try {
      const res = await fetch(
        `https://localhost:7163/api/ProfesionalesServicios/${idProfesional}/${idServicio}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar relación");
      await cargarRelaciones();
    } catch (err) {
      console.error("Error al eliminar relación:", err);
    }
  };

  const filtrarRelaciones = (termino: string) => {
    relacionesFiltradas.value = relaciones.value.filter(
      (relacion) =>
        relacion.profesionalNombre.toLowerCase().includes(termino.toLowerCase()) ||
        relacion.servicioNombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  const toggleFormCreate = () => {
    relacionActual.value = null;
    mostrarFormularioCrear.value = !mostrarFormularioCrear.value;
  };

  const abrirFormularioEdicion = (relacion: RelacionPS) => {
    relacionActual.value = { ...relacion };
    mostrarFormularioCrear.value = false;
  };

  return {
    relaciones,
    relacionesFiltradas,
    profesionales,
    servicios,
    relacionActual,
    mostrarFormularioCrear,
    cargarRelaciones,
    cargarProfesionales,
    cargarServicios,
    guardarRelacion,
    eliminarRelacion,
    filtrarRelaciones,
    toggleFormCreate,
    abrirFormularioEdicion,
  };
});
