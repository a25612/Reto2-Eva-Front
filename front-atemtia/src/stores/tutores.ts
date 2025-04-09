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
      console.log("Datos a enviar al servidor:", tutor);

      let response;
      if (tutor.id) {
        console.log("Enviando actualización del tutor con id:", tutor.id);
        response = await fetch(`https://localhost:7163/api/Tutor/${tutor.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tutor),
        });
      } else {
        console.log("Enviando nuevo tutor para creación");
        response = await fetch("https://localhost:7163/api/Tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tutor),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al guardar tutor:", errorData);
        throw new Error(tutor.id ? "Error al actualizar tutor" : "Error al crear tutor");
      }

      if (tutor.id) {
        tutores.value = tutores.value.map((t) => (t.id === tutor.id ? tutor : t));
      } else {
        const newTutor = await response.json();
        console.log("Nuevo tutor creado:", newTutor);
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
      // Verificar si el tutor tiene relaciones con usuarios
      const relacionesResponse = await fetch(`https://localhost:7163/api/UsuarioTutores/tutor/${id}`);
      if (!relacionesResponse.ok) throw new Error("Error al verificar relaciones");
  
      const relaciones = await relacionesResponse.json();
  
      if (relaciones.length > 0) {
        alert("Este tutor tiene relaciones con usuarios. Por favor elimine antes la relación para poder eliminarlo.");
        return;
      }
  
      // ✅ Confirmación antes de eliminar
      const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este tutor?");
      if (!confirmar) return;
  
      // Proceder con la eliminación
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
