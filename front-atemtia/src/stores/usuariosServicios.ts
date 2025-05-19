import { defineStore } from "pinia";
import { ref } from "vue";

// Interfaces
export interface Usuario {
  id: number;
  nombre: string;
}

export interface Servicio {
  id: number;
  nombre: string;
}

export interface RelacionUsuarioServicio {
  id: string; // id compuesto: "usuarioId_servicioId"
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

  // GET relaciones
  const cargarRelaciones = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/UsuarioServicios");
      if (!res.ok) throw new Error("Error al obtener relaciones");

      const data = await res.json();

      relaciones.value = data.map((rel: any) => ({
        id: `${rel.id_USUARIO}_${rel.id_SERVICIO}`,
        usuarioId: rel.id_USUARIO,
        servicioId: rel.id_SERVICIO,
        usuarioNombre: rel.usuario?.nombre || "",
        servicioNombre: rel.servicio?.nombre || "",
      }));

      relacionesFiltradas.value = [...relaciones.value];
    } catch (err) {
      console.error("Error al cargar relaciones:", err);
    }
  };

  // GET usuarios
  const cargarUsuarios = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");

      const data = await res.json();
      usuarios.value = data.map((u: any) => ({
        id: u.id,
        nombre: u.nombre,
      }));
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  // GET servicios
  const cargarServicios = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Servicios");
      if (!res.ok) throw new Error("Error al obtener servicios");

      const data = await res.json();
      servicios.value = data.map((s: any) => ({
        id: s.id,
        nombre: s.nombre,
      }));
    } catch (err) {
      console.error("Error al cargar servicios:", err);
    }
  };

  // POST relación
  const guardarRelacion = async (relacion: { usuarioId: number; servicioId: number }) => {
    try {
      const response = await fetch("https://localhost:7163/api/UsuarioServicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario: relacion.usuarioId,
          idServicio: relacion.servicioId,
        }),
      });

      if (!response.ok) throw new Error("Error al crear relación");
      await cargarRelaciones();
    } catch (error) {
      console.error("Error al guardar relación:", error);
    }
  };

  // PUT relación
  const actualizarRelacion = async (relacion: RelacionUsuarioServicio) => {
    try {
      const response = await fetch(
        `https://localhost:7163/api/UsuarioServicios/${relacion.usuarioId}/${relacion.servicioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_USUARIO: relacion.usuarioId,
            id_SERVICIO: relacion.servicioId,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar relación");
      await cargarRelaciones();
    } catch (error) {
      console.error("Error al actualizar relación:", error);
    }
  };

  // DELETE relación
  const eliminarRelacion = async (usuarioId: number, servicioId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7163/api/UsuarioServicios/${usuarioId}/${servicioId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Error al eliminar relación");
      await cargarRelaciones();
    } catch (error) {
      console.error("Error al eliminar relación:", error);
    }
  };

  // Filtrar
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
    actualizarRelacion,
    eliminarRelacion,
    filtrarRelaciones,
    toggleFormCreate,
    abrirFormularioEdicion,
  };
});
