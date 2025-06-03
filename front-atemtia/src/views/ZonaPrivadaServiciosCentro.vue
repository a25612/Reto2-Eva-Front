<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useServiciosCentrosStore } from "../stores/ServiciosCentro";
import { useServiciosStore } from "../stores/servicios";
import { useCentrosStore } from "../stores/centro";

const relacionesStore = useServiciosCentrosStore();
const serviciosStore = useServiciosStore();
const centrosStore = useCentrosStore();

const searchTerm = ref("");
const showFormUpdate = ref(false);
const updatedRelacion = ref<any>({ id: null, servicio: null, centro: null });
const newRelacion = ref<any>({ servicio: null, centro: null });

onMounted(() => {
  relacionesStore.cargarRelaciones();
  serviciosStore.cargarServicios();
  centrosStore.cargarCentros();
});

// Watch para edición: busca por ID, no por nombre
watch(
  () => relacionesStore.relacionActual,
  (nuevaRelacion) => {
    if (nuevaRelacion) {
      updatedRelacion.value = {
        id: nuevaRelacion.id,
        servicio: serviciosStore.servicios.find((s) => s.id === nuevaRelacion.servicioId) || null,
        centro: centrosStore.centros.find((c) => c.id === nuevaRelacion.centroId) || null,
      };
      showFormUpdate.value = true;
    } else {
      updatedRelacion.value = { id: null, servicio: null, centro: null };
      showFormUpdate.value = false;
    }
  },
  { immediate: true }
);

const saveOrUpdateRelacion = async (relacion: any) => {
  if (relacion.servicio?.id && relacion.centro?.id) {
    const datosRelacion = {
      servicioId: relacion.servicio.id,
      centroId: relacion.centro.id,
      ...(relacion.id && { id: relacion.id }),
    };

    await relacionesStore.guardarRelacion(datosRelacion);

    if (!relacion.id) {
      newRelacion.value = { servicio: null, centro: null };
      relacionesStore.mostrarFormularioCrear = false;
    }
    showFormUpdate.value = false;
  } else {
    alert("Debes seleccionar tanto un servicio como un centro.");
  }
};

const updateRelacion = async () => await saveOrUpdateRelacion(updatedRelacion.value);
const saveRelacion = async () => await saveOrUpdateRelacion(newRelacion.value);

const handleSearch = () => relacionesStore.filtrarRelaciones(searchTerm.value);
</script>

<template>
  <div class="relacion-servicios-centros">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="relacion-servicios-centros__titulo">Relación Servicios - Centros</h1>

    <div class="relacion-servicios-centros__separador-abajo">
      <span class="relacion-servicios-centros__bar-separador"></span>
    </div>

    <div class="relacion-servicios-centros__botones">
      <button class="relacion-servicios-centros__boton" @click="relacionesStore.toggleFormCreate">
        Añadir Relación
      </button>
    </div>

    <div class="relacion-servicios-centros__buscador">
      <div class="relacion-servicios-centros__buscador-contenedor">
        <input 
          v-model="searchTerm" 
          class="relacion-servicios-centros__buscador-input" 
          type="text" 
          placeholder="Buscar relación..." 
          @input="handleSearch"
        />
        <button class="relacion-servicios-centros__buscador-boton" @click="handleSearch">
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <div v-if="relacionesStore.relacionesFiltradas.length > 0" class="relacion-servicios-centros__lista">
      <div v-for="relacion in relacionesStore.relacionesFiltradas" :key="relacion.id" class="relacion-servicios-centros__item">
        <div class="relacion-servicios-centros__item-contenido">
          <h3 class="relacion-servicios-centros__item-servicio">Servicio: {{ relacion.servicioNombre }}</h3>
          <p class="relacion-servicios-centros__item-centro">Centro: {{ relacion.centroNombre }}</p>
        </div>
        <div class="relacion-servicios-centros__item-acciones">
          <button class="relacion-servicios-centros__item-boton relacion-servicios-centros__item-boton--editar" @click="relacionesStore.abrirFormularioEdicion(relacion)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="relacion-servicios-centros__item-boton relacion-servicios-centros__item-boton--eliminar" @click="relacionesStore.eliminarRelacion(relacion.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="relacion-servicios-centros__no-resultados">
      <p>No se encontraron relaciones</p>
    </div>

    <!-- Formulario de creación -->
    <div v-if="relacionesStore.mostrarFormularioCrear" class="relacion-servicios-centros__formulario">
      <h2 class="relacion-servicios-centros__formulario-titulo">Añadir Relación</h2>
      <form class="relacion-servicios-centros__formulario-contenido" @submit.prevent="saveRelacion">
        <div class="relacion-servicios-centros__formulario-grupo">
          <label class="relacion-servicios-centros__formulario-label" for="servicio-create">Servicio:</label>
          <v-autocomplete
            v-model="newRelacion.servicio"
            :items="serviciosStore.servicios"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del servicio"
            required
          />
        </div>
        <div class="relacion-servicios-centros__formulario-grupo">
          <label class="relacion-servicios-centros__formulario-label" for="centro-create">Centro:</label>
          <v-autocomplete
            v-model="newRelacion.centro"
            :items="centrosStore.centros"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del centro"
            required
          />
        </div>
        <div class="relacion-servicios-centros__formulario-grupo">
          <button class="relacion-servicios-centros__formulario-boton" type="submit">Añadir Relación</button>
        </div>
      </form>
    </div>

    <!-- Formulario de edición -->
    <div v-if="showFormUpdate && updatedRelacion.id" class="relacion-servicios-centros__formulario">
      <h2 class="relacion-servicios-centros__formulario-titulo">Actualizar Relación</h2>
      <form class="relacion-servicios-centros__formulario-contenido" @submit.prevent="updateRelacion">
        <div class="relacion-servicios-centros__formulario-grupo">
          <label class="relacion-servicios-centros__formulario-label" for="servicio-update">Servicio:</label>
          <v-autocomplete
            v-model="updatedRelacion.servicio"
            :items="serviciosStore.servicios"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del servicio"
            required
          />
        </div>
        <div class="relacion-servicios-centros__formulario-grupo">
          <label class="relacion-servicios-centros__formulario-label" for="centro-update">Centro:</label>
          <v-autocomplete
            v-model="updatedRelacion.centro"
            :items="centrosStore.centros"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del centro"
            required
          />
        </div>
        <div class="relacion-servicios-centros__formulario-grupo">
          <button class="relacion-servicios-centros__formulario-boton" type="submit">Actualizar Relación</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.relacion-servicios-centros {
  background-color: $color-fondo;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
  text-align: center;

  &__titulo {
    font-size: 24px;
    font-weight: bold;
    color: $color-titulos;
  }

  &__separador-abajo {
    margin: 10px auto;

    & .relacion-servicios-centros__bar-separador {
      display: block;
      width: 160px;
      height: 2px;
      background-color: $color-principal;
      margin: auto;
    }
  }

  &__botones {
    margin: 15px 0;
  }

  &__boton {
    background-color: $color-principal;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($color-principal, 10%);
    }
  }

  &__buscador {
    margin: 15px 0;

    &-contenedor {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 5px;
      overflow: hidden;
    }

    &-input {
      flex: 1;
      padding: 10px;
      border: none;
      outline: none;
      font-size: 16px;
    }

    &-boton {
      width: 40px;
      background-color: $color-principal;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken($color-principal, 10%);
      }
    }
  }

  &__lista {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 12px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: left;

    &-contenido {
      flex: 1;
    }

    &-servicio,
    &-centro {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px 0;
      color: $color-titulos;
    }

    &-acciones {
      display: flex;
      gap: 8px;
    }

    &-boton {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background-color 0.3s ease;

      &--editar {
        background-color: $color-principal;

        &:hover {
          background-color: darken($color-principal, 10%);
        }
      }

      &--eliminar {
        background-color: red;

        &:hover {
          background-color: darkred;
        }
      }
    }
  }

  &__no-resultados {
    margin: 15px 0;
    font-style: italic;
    color: #666;
  }

  &__formulario {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    &-titulo {
      font-size: 20px;
      font-weight: bold;
      color: $color-titulos;
    }

    &-contenido {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &-grupo {
      display: flex;
      flex-direction: column;
    }

    &-label {
      font-size: 14px;
      color: $color-titulos;
      margin-bottom: 5px;
    }

    &-input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
      outline: none;
      width: 100%;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: $color-principal;
      }
    }

    &-boton {
      padding: 12px;
      background-color: $color-principal;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken($color-principal, 10%);
      }
    }
  }
}
</style>
