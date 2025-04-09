import { defineStore } from "pinia";
import { ref } from "vue";

interface Usuario {
  id: number;
  nombre: string;
}

interface Tutor {
  id: number;
  nombre: string;
}

interface Relacion {
  id: number;
  usuarioId: number;
  tutorId: number;
  usuarioNombre: string;
  tutorNombre: string;
}

export const useRelacionesStore = defineStore("relacionesStore", () => {
  const relaciones = ref<Relacion[]>([]);
  const relacionesFiltradas = ref<Relacion[]>([]);
  const usuarios = ref<Usuario[]>([]);
  const tutores = ref<Tutor[]>([]);

  const mostrarFormularioCrear = ref(false);
  const relacionActual = ref<Relacion | null>(null);

  // ======================
  // Cargar datos
  // ======================
  
  const cargarRelaciones = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/UsuarioTutores");
      if (!res.ok) throw new Error("Error al obtener relaciones");
  
      const data = await res.json();

      relaciones.value = data.map((rel: any) => ({
        id: rel.id,
        usuarioId: rel.iD_USUARIO,
        tutorId: rel.iD_TUTOR,
        usuarioNombre: rel.usuario.nombre,
        tutorNombre: rel.tutor.nombre,
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

  const cargarTutores = async () => {
    try {
      const res = await fetch("https://localhost:7163/api/Tutor");
      if (!res.ok) throw new Error("Error al obtener tutores");

      const data = await res.json();
      tutores.value = data;
    } catch (err) {
      console.error("Error al cargar tutores:", err);
    }
  };

  // ====================== 
  // Guardar y eliminar relación
  // ======================

  const guardarRelacion = async (relacion: { idUsuario: number; idTutor: number; id?: number }) => {
    try {
      let response;
      if (relacion.id) {
        // Actualizar relación existente
        response = await fetch(`https://localhost:7163/api/UsuarioTutores/${relacion.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relacion),
        });
      } else {
        // Crear una nueva relación
        response = await fetch("https://localhost:7163/api/UsuarioTutores", {
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
                tutorId: data.iD_TUTOR,
                usuarioNombre: data.usuario?.nombre || "",
                tutorNombre: data.tutor?.nombre || "",
              }
            : r
        );
      } else {
        // Si es una creación, añadir la nueva relación a la lista
        const nuevaRelacion = {
          id: data.id,
          usuarioId: data.iD_USUARIO,
          tutorId: data.iD_TUTOR,
          usuarioNombre: data.usuario?.nombre || "",
          tutorNombre: data.tutor?.nombre || "",
        };
        relaciones.value = [...relaciones.value, nuevaRelacion]; // Crear una nueva referencia del array
      }
  
      // Asegúrate de actualizar también las relaciones filtradas
      relacionesFiltradas.value = [...relaciones.value]; // Esto asegura que la vista se actualice
  
      // Llamar a la función de filtrado para reflejar cualquier cambio en la lista
      filtrarRelaciones(""); // Si tienes un filtro activo, lo volverá a aplicar
  
      // Llamar explícitamente para recargar relaciones
      await cargarRelaciones(); // Recarga las relaciones después de crear/actualizar una relación
  
    } catch (error) {
      console.error("Error al guardar relación:", error);
    }
  };
  
  
  const eliminarRelacion = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7163/api/UsuarioTutores/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar relación");

      relaciones.value = relaciones.value.filter((rel) => rel.id !== id);
      filtrarRelaciones(""); 
    } catch (err) {
      console.error("Error al eliminar relación:", err);
    }
  };

  const filtrarRelaciones = (termino: string) => {
    relacionesFiltradas.value = relaciones.value.filter((relacion) =>
      relacion.usuarioNombre.toLowerCase().includes(termino.toLowerCase()) ||
      relacion.tutorNombre.toLowerCase().includes(termino.toLowerCase())
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
    tutores,
    relacionActual,
    mostrarFormularioCrear,
    cargarRelaciones,
    cargarUsuarios,
    cargarTutores,
    guardarRelacion,
    eliminarRelacion,
    filtrarRelaciones,
    toggleFormCreate,
    abrirFormularioEdicion,
  };
});
