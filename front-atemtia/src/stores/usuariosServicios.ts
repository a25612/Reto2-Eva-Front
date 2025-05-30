import { defineStore } from "pinia";
import { ref } from "vue";

interface Usuario {
  id: number;
  nombre: string;
}

interface Servicio {
  id: number;
  nombre: string;
}

interface Relacion {
  id: number;
  usuarioId: number;
  servicioId: number;
  usuarioNombre: string;
  servicioNombre: string;
}

export const useUsuarioServiciosStore = defineStore("usuarioServiciosStore", () => {
  const relaciones = ref<Relacion[]>([]);
  const relacionesFiltradas = ref<Relacion[]>([]);
  const usuarios = ref<Usuario[]>([]);
  const servicios = ref<Servicio[]>([]);

  const mostrarFormularioCrear = ref(false);
  const relacionActual = ref<Relacion | null>(null);

  const cargarRelaciones = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/UsuarioServicios");
      if (!res.ok) throw new Error("Error al obtener relaciones");
      const data = await res.json();
      relaciones.value = data.map((rel: any) => ({
        id: rel.id,
        usuarioId: rel.usuarioId,
        servicioId: rel.servicioId,
        usuarioNombre: rel.usuario.nombre,
        servicioNombre: rel.servicio.nombre,
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

const guardarRelacion = async (relacion: { idUsuario: number; idServicio: number; id?: number }) => {
  try {
    let response;
    if (relacion.id) {
      // PUT para actualizar
      response = await fetch(`https://localhost:7163/api/UsuarioServicios/${relacion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario: relacion.idUsuario, idServicio: relacion.idServicio }),
      });
    } else {
      // POST para crear
      response = await fetch("https://localhost:7163/api/UsuarioServicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario: relacion.idUsuario, idServicio: relacion.idServicio }),
      });
    }

    if (!response.ok) throw new Error("Error al guardar relación");
    await cargarRelaciones();
  } catch (error) {
    console.error("Error al guardar relación:", error);
  }
};

  const eliminarRelacion = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7163/api/UsuarioServicios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar relación");
      await cargarRelaciones();
    } catch (err) {
      console.error("Error al eliminar relación:", err);
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

  const abrirFormularioEdicion = (relacion: Relacion) => {
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
    eliminarRelacion,
    filtrarRelaciones,
    toggleFormCreate,
    abrirFormularioEdicion,
  };
});
