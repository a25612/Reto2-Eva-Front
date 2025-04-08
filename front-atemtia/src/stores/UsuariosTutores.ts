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
      relaciones.value = data;
      relacionesFiltradas.value = data;
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

  const guardarRelacion = async (relacion: Relacion) => {
    try {
      const isUpdate = !!relacion.id;
      const url = isUpdate 
        ? `https://localhost:7163/api/UsuarioTutores/${relacion.id}` 
        : "https://localhost:7163/api/UsuarioTutores";
  
      const method = isUpdate ? "PUT" : "POST";
  
      const bodyData = isUpdate
        ? relacion
        : {
            usuarioId: relacion.usuarioId,
            tutorId: relacion.tutorId,
          };
  
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
  
      if (!res.ok) throw new Error(isUpdate ? "Error al actualizar" : "Error al crear");
  
      const data = await res.json();
  
      if (isUpdate) {
        // Mejorar la actualización de relaciones
        const index = relaciones.value.findIndex((r) => r.id === data.id);
        if (index !== -1) relaciones.value[index] = data;
      } else {
        relaciones.value.push(data);
      }
  
      filtrarRelaciones(""); // actualizar filtro
      relacionActual.value = null;
      mostrarFormularioCrear.value = false;
    } catch (err) {
      console.error("Error al guardar relación:", err);
    }
  };

  const eliminarRelacion = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7163/api/UsuarioTutores/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar relación");

      relaciones.value = relaciones.value.filter((rel) => rel.id !== id);
      filtrarRelaciones(""); // Refiltrar después de eliminar
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
