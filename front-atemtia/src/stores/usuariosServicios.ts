// src/stores/usuarioServicios.ts

import { defineStore } from "pinia";
import { ref } from "vue";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
}

interface Servicio {
  id: number;
  nombre: string;
}

interface RelacionUsuarioServicio {
  id: number;
  usuarioId: number;
  servicioId: number;
  usuarioNombre: string;
  servicioNombre: string;
}

export const useUsuarioServiciosStore = defineStore("usuarioServiciosStore", () => {
  const relaciones = ref<RelacionUsuarioServicio[]>([]);
  const relacionesFiltradas = ref<RelacionUsuarioServicio[]>([]);
  const usuarios = ref<Usuario[]>([]);
  const servicios = ref<Servicio[]>([]);

  const mostrarFormularioCrear = ref(false);
  const relacionActual = ref<RelacionUsuarioServicio | null>(null);

  // ======================
  // Cargar datos
  // ======================

  const cargarRelaciones = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/UsuarioServicios");
      if (!res.ok) throw new Error("Error al obtener relaciones");

      const data = await res.json();

      relaciones.value = data.map((rel: any) => ({
        id: rel.id,
        usuarioId: rel.iD_USUARIO,
        servicioId: rel.iD_SERVICIO,
        usuarioNombre: rel.usuario?.nombre || "",
        servicioNombre: rel.servicio?.nombre || "",
      }));

      relacionesFiltradas.value = relaciones.value;
    } catch (err) {
      console.error("Error al cargar relaciones:", err);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");

      const data = await res.json();
      usuarios.value = data;
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
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

  // ======================
  // Guardar y eliminar relación
  // ======================

  const guardarRelacion = async (relacion: { idUsuario: number; idServicio: number; id?: number }) => {
    try {
      let response;
      if (relacion.id) {
        // Actualizar relación existente
        response = await fetch(`https://localhost:7163/api/UsuarioServicios/${relacion.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relacion),
        });
      } else {
        // Crear una nueva relación
        response = await fetch("https://localhost:7163/api/UsuarioServicios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relacion),
        });
      }

      if (!response.ok) throw new Error(relacion.id ? "Error al actualizar relación" : "Error al crear relación");

      const data = await response.json();

      if (relacion.id) {
        // Si es una actualización, actualizar la relación existente en la lista
        relaciones.value = relaciones.value.map((r) =>
          r.id === data.id
            ? {
                id: data.id,
                usuarioId: data.iD_USUARIO,
                servicioId: data.iD_SERVICIO,
                usuarioNombre: data.usuario?.nombre || "",
                servicioNombre: data.servicio?.nombre || "",
              }
            : r
        );
      } else {
        // Si es una creación, añadir la nueva relación a la lista
        const nuevaRelacion = {
          id: data.id,
          usuarioId: data.iD_USUARIO,
          servicioId: data.iD_SERVICIO,
          usuarioNombre: data.usuario?.nombre || "",
          servicioNombre: data.servicio?.nombre || "",
        };
        relaciones.value = [...relaciones.value, nuevaRelacion];
      }

      relacionesFiltradas.value = [...relaciones.value];
      filtrarRelaciones("");
      await cargarRelaciones();

    } catch (error) {
      console.error("Error al guardar relación:", error);
    }
  };

  

  const filtrarRelaciones = (termino: string) => {
    relacionesFiltradas.value = relaciones.value.filter((relacion) =>
      relacion.usuarioNombre.toLowerCase().includes(termino.toLowerCase()) ||
      relacion.servicioNombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  const toggleFormCreate = () => {
    relacionActual.value = null;
    mostrarFormularioCrear.value = !mostrarFormularioCrear.value;
  };

  const abrirFormularioEdicion = (relacion: RelacionUsuarioServicio) => {
    relacionActual.value = { ...relacion };
    mostrarFormularioCrear.value = false;
  };

  return {
    relaciones,
    relacionesFiltradas,
    usuarios,
    servicios,
    relacionActual,
    mostrarFormularioCrear,
    cargarRelaciones,
    cargarUsuarios,
    cargarServicios,
    guardarRelacion,
    filtrarRelaciones,
    toggleFormCreate,
    abrirFormularioEdicion,
  };
});
