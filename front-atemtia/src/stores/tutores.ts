import { defineStore } from "pinia";
import { ref } from "vue";

export const useTutoresStore = defineStore("tutoresStore", () => {
  const tutores = ref<any[]>([]);
  const tutoresFiltrados = ref<any[]>([]);
  const mostrarFormularioCrear = ref(false);
  const mostrarFormularioEditar = ref(false);
  const tutorActual = ref<any | null>(null);

  const cargarTutores = async () => {
    try {
      const response = await fetch("https://localhost:7163/api/Tutor");
      if (!response.ok) throw new Error("Error al obtener tutores");

      const data = await response.json();
      tutores.value = data;
      tutoresFiltrados.value = data;
    } catch (error) {
      console.error("Error al cargar tutores:", error);
    }
  };

  const filtrarTutores = (termino: string) => {
    tutoresFiltrados.value = tutores.value.filter(
      (tutor) =>
        tutor.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        tutor.email.toLowerCase().includes(termino.toLowerCase()) ||
        tutor.dni.toLowerCase().includes(termino.toLowerCase())
    );
  };

  const toggleFormCreate = () => {
    tutorActual.value = { id: null, nombre: "", dni: "", email: "", username: "", password: "", activo: true };
    mostrarFormularioCrear.value = true;
    mostrarFormularioEditar.value = false;
  };

  const abrirFormularioEdicion = (tutor: any) => {
    tutorActual.value = { ...tutor };
    mostrarFormularioCrear.value = false;
    mostrarFormularioEditar.value = true;
  };

  const guardarTutor = async (tutor: any) => {
    try {
      let response;
      if (tutor.id) {
        // Actualizar tutor existente
        response = await fetch(`https://localhost:7163/api/Tutor/${tutor.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tutor),
        });
      } else {
        // Crear un nuevo tutor
        response = await fetch("https://localhost:7163/api/Tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tutor),
        });
      }

      if (!response.ok) throw new Error(tutor.id ? "Error al actualizar tutor" : "Error al crear tutor");

      if (tutor.id) {
        // Si es una actualización, actualizar el tutor en la lista
        tutores.value = tutores.value.map((t) => (t.id === tutor.id ? tutor : t));
      } else {
        // Si es una creación, añadir el nuevo tutor a la lista
        const newTutor = await response.json();
        tutores.value.push(newTutor);
      }

      filtrarTutores("");
      mostrarFormularioCrear.value = false;
      mostrarFormularioEditar.value = false;
      tutorActual.value = null;
    } catch (error) {
      console.error("Error al guardar tutor:", error);
    }
  };

  const eliminarTutor = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7163/api/Tutor/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error en la eliminación");

      tutores.value = tutores.value.filter((tutor) => tutor.id !== id);
      filtrarTutores("");
    } catch (error) {
      console.error("Error al eliminar tutor:", error);
    }
  };

  return {
    tutores,
    tutoresFiltrados,
    cargarTutores,
    filtrarTutores,
    toggleFormCreate,
    abrirFormularioEdicion,
    eliminarTutor,
    guardarTutor,
    mostrarFormularioCrear,
    mostrarFormularioEditar,
    tutorActual,
  };
});
