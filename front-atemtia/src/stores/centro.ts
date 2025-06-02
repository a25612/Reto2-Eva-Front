// src/stores/centros.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCentrosStore = defineStore("centrosStore", () => {
  const centros = ref<any[]>([]);
  const centrosFiltrados = ref<any[]>([]);
  const mostrarFormularioCrear = ref(false);
  const mostrarFormularioEditar = ref(false);
  const centroActual = ref<any | null>(null);

  // Cargar centros desde la API
  const cargarCentros = async () => {
    try {
      const response = await fetch("https://localhost:7163/api/centro");
      if (!response.ok) throw new Error("Error al obtener centros");
      const data = await response.json();
      centros.value = data;
      centrosFiltrados.value = data;
    } catch (error) {
      console.error("Error al cargar centros:", error);
    }
  };

  // Filtrar los centros por nombre
  const filtrarCentros = (termino: string) => {
    centrosFiltrados.value = centros.value.filter((centro) =>
      centro.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  };

  // Mostrar el formulario de creación
  const toggleFormCreate = () => {
    centroActual.value = { id: null, nombre: "", direccion: "" };
    mostrarFormularioCrear.value = true;
    mostrarFormularioEditar.value = false;
  };

  // Abrir formulario de edición
  const abrirFormularioEdicion = (centro: any) => {
    centroActual.value = { ...centro };
    mostrarFormularioCrear.value = false;
    mostrarFormularioEditar.value = true;
  };

  // Guardar cambios (crear o actualizar centro)
  const guardarCentro = async (centro: any) => {
    try {
      let response;
      // Solo enviamos nombre y direccion
      const centroPayload = {
        nombre: centro.nombre,
        direccion: centro.direccion,
      };
      if (centro.id) {
        // Actualizar centro existente
        response = await fetch(`https://localhost:7163/api/centro/${centro.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(centroPayload),
        });
      } else {
        // Crear un nuevo centro
        response = await fetch("https://localhost:7163/api/centro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(centroPayload),
        });
      }

      if (!response.ok) throw new Error(centro.id ? "Error al actualizar centro" : "Error al crear centro");

      if (centro.id) {
        centros.value = centros.value.map((c) => (c.id === centro.id ? { ...c, ...centroPayload } : c));
      } else {
        const newCentro = await response.json();
        centros.value.push(newCentro);
      }

      filtrarCentros("");
      mostrarFormularioCrear.value = false;
      mostrarFormularioEditar.value = false;
      centroActual.value = null;
    } catch (error) {
      console.error("Error al guardar centro:", error);
    }
  };

  // Eliminar un centro con confirmación y verificación de relaciones
  const eliminarCentro = async (id: number) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este centro?");
      if (!confirmar) return;

      // Verificar relaciones (ajusta el endpoint según tu backend)
      const relacionesResponse = await fetch(`https://localhost:7163/api/CentroTutores/centro/${id}`);
      if (!relacionesResponse.ok) throw new Error("Error al verificar relaciones");

      const relaciones = await relacionesResponse.json();
      if (relaciones.length > 0) {
        alert("Este Centro tiene relaciones. Por favor elimine antes la relación para poder eliminarlo.");
        return;
      }

      const response = await fetch(`https://localhost:7163/api/centro/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error en la eliminación");

      centros.value = centros.value.filter((c) => c.id !== id);
      filtrarCentros("");
    } catch (error) {
      console.error("Error al eliminar centro:", error);
    }
  };

  return {
    centros,
    centrosFiltrados,
    cargarCentros,
    filtrarCentros,
    toggleFormCreate,
    abrirFormularioEdicion,
    eliminarCentro,
    guardarCentro,
    mostrarFormularioCrear,
    mostrarFormularioEditar,
    centroActual,
  };
});
