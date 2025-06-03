import { defineStore } from "pinia";
import { ref } from "vue";

interface Servicio {
  id: number;
  nombre: string;
}

interface Centro {
  id: number;
  nombre: string;
}

interface RelacionSC {
  id: number;
  servicioId: number;
  centroId: number;
  servicioNombre: string;
  centroNombre: string;
}

export const useServiciosCentrosStore = defineStore("serviciosCentrosStore", () => {
  const relaciones = ref<RelacionSC[]>([]);
  const relacionesFiltradas = ref<RelacionSC[]>([]);
  const servicios = ref<Servicio[]>([]);
  const centros = ref<Centro[]>([]);

  const mostrarFormularioCrear = ref(false);
  const relacionActual = ref<RelacionSC | null>(null);

  const cargarRelaciones = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/ServiciosCentros");
      if (!res.ok) throw new Error("Error al obtener relaciones");
      const data = await res.json();
      relaciones.value = data.map((rel: any) => ({
        id: rel.id,
        servicioId: rel.iD_SERVICIO ?? rel.servicioId,
        centroId: rel.iD_CENTRO ?? rel.centroId,
        servicioNombre: rel.servicio?.nombre ?? "",
        centroNombre: rel.centro?.nombre ?? "",
      }));
      relacionesFiltradas.value = relaciones.value;
    } catch (err) {
      console.error("Error al cargar relaciones:", err);
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

  const cargarCentros = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Centros");
      if (!res.ok) throw new Error("Error al obtener centros");
      const data = await res.json();
      centros.value = data;
    } catch (err) {
      console.error("Error al cargar centros:", err);
    }
  };

  // Solo hace POST si la relación NO existe
  const guardarRelacion = async (relacion: { servicioId: number; centroId: number }) => {
    try {
      const existe = relaciones.value.some(
        (r) => r.servicioId === relacion.servicioId && r.centroId === relacion.centroId
      );

      if (existe) {
        alert("Ya existe una relación con ese servicio y centro.");
        return;
      }

      const response = await fetch("https://localhost:7163/api/ServiciosCentros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idServicio: relacion.servicioId, idCentro: relacion.centroId }),
      });

      if (!response.ok) throw new Error("Error al guardar relación");
      await cargarRelaciones();
    } catch (error) {
      console.error("Error al guardar relación:", error);
    }
  };

  const eliminarRelacion = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7163/api/ServiciosCentros/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar relación");
      await cargarRelaciones();
    } catch (err) {
      console.error("Error al eliminar relación:", err);
    }
  };

  const filtrarRelaciones = (termino: string) => {
    relacionesFiltradas.value = relaciones.value.filter((relacion) =>
      relacion.servicioNombre.toLowerCase().includes(termino.toLowerCase()) ||
      relacion.centroNombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  const toggleFormCreate = () => {
    relacionActual.value = null;
    mostrarFormularioCrear.value = !mostrarFormularioCrear.value;
  };

  const abrirFormularioEdicion = (relacion: RelacionSC) => {
    relacionActual.value = { ...relacion };
    mostrarFormularioCrear.value = false;
  };

  return {
    relaciones,
    relacionesFiltradas,
    servicios,
    centros,
    relacionActual,
    mostrarFormularioCrear,
    cargarRelaciones,
    cargarServicios,
    cargarCentros,
    guardarRelacion,
    eliminarRelacion,
    filtrarRelaciones,
    toggleFormCreate,
    abrirFormularioEdicion,
  };
});
