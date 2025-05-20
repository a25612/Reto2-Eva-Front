<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUsuarioServiciosStore } from "../stores/usuariosServicios";
import { useUsuariosStore } from "../stores/usuarios";
import { useServiciosStore } from "../stores/servicios";

const relacionesStore = useUsuarioServiciosStore();
const usuariosStore = useUsuariosStore();
const serviciosStore = useServiciosStore();

const searchTerm = ref("");
const showFormUpdate = ref(false);
const updatedRelacion = ref<any>({ id: null, usuario: null, servicio: null });
const newRelacion = ref<any>({ usuario: null, servicio: null });

onMounted(() => {
  relacionesStore.cargarRelaciones();
  usuariosStore.cargarUsuarios();
  serviciosStore.cargarServicios();
});

// Watch para edición: busca por ID, no por nombre
watch(
  () => relacionesStore.relacionActual,
  (nuevaRelacion) => {
    if (nuevaRelacion) {
      updatedRelacion.value = {
        id: nuevaRelacion.id,
        usuario: usuariosStore.usuarios.find((u) => u.id === nuevaRelacion.usuarioId) || null,
        servicio: serviciosStore.servicios.find((s) => s.id === nuevaRelacion.servicioId) || null,
      };
      showFormUpdate.value = true;
    } else {
      updatedRelacion.value = { id: null, usuario: null, servicio: null };
      showFormUpdate.value = false;
    }
  },
  { immediate: true }
);

const saveOrUpdateRelacion = async (relacion: any) => {
  if (relacion.usuario?.id && relacion.servicio?.id) {
    const datosRelacion = {
      idUsuario: relacion.usuario.id,
      idServicio: relacion.servicio.id,
      ...(relacion.id && { id: relacion.id }),
    };

    await relacionesStore.guardarRelacion(datosRelacion);

    if (!relacion.id) {
      newRelacion.value = { usuario: null, servicio: null };
      relacionesStore.mostrarFormularioCrear = false;
    }
    showFormUpdate.value = false;
  } else {
    alert("Debes seleccionar tanto un usuario como un servicio.");
  }
};

const updateRelacion = async () => await saveOrUpdateRelacion(updatedRelacion.value);
const saveRelacion = async () => await saveOrUpdateRelacion(newRelacion.value);

const handleSearch = () => relacionesStore.filtrarRelaciones(searchTerm.value);
</script>

<template>
  <div class="relacion-usuarios-servicios">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="relacion-usuarios-servicios__titulo">Relación Usuarios - Servicios</h1>

    <div class="relacion-usuarios-servicios__separador-abajo">
      <span class="relacion-usuarios-servicios__bar-separador"></span>
    </div>

    <div class="relacion-usuarios-servicios__botones">
      <button class="relacion-usuarios-servicios__boton" @click="relacionesStore.toggleFormCreate">
        Añadir Relación
      </button>
    </div>

    <div class="relacion-usuarios-servicios__buscador">
      <div class="relacion-usuarios-servicios__buscador-contenedor">
        <input 
          v-model="searchTerm" 
          class="relacion-usuarios-servicios__buscador-input" 
          type="text" 
          placeholder="Buscar relación..." 
          @input="handleSearch"
        />
        <button class="relacion-usuarios-servicios__buscador-boton" @click="handleSearch">
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <div v-if="relacionesStore.relacionesFiltradas.length > 0" class="relacion-usuarios-servicios__lista">
      <div v-for="relacion in relacionesStore.relacionesFiltradas" :key="relacion.id" class="relacion-usuarios-servicios__item">
        <div class="relacion-usuarios-servicios__item-contenido">
          <h3 class="relacion-usuarios-servicios__item-usuario">Usuario: {{ relacion.usuarioNombre }}</h3>
          <p class="relacion-usuarios-servicios__item-servicio">Servicio: {{ relacion.servicioNombre }}</p>
        </div>
        <div class="relacion-usuarios-servicios__item-acciones">
          <button class="relacion-usuarios-servicios__item-boton relacion-usuarios-servicios__item-boton--editar" @click="relacionesStore.abrirFormularioEdicion(relacion)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="relacion-usuarios-servicios__item-boton relacion-usuarios-servicios__item-boton--eliminar" @click="relacionesStore.eliminarRelacion(relacion.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="relacion-usuarios-servicios__no-resultados">
      <p>No se encontraron relaciones</p>
    </div>

    <!-- Formulario de creación -->
    <div v-if="relacionesStore.mostrarFormularioCrear" class="relacion-usuarios-servicios__formulario">
      <h2 class="relacion-usuarios-servicios__formulario-titulo">Añadir Relación</h2>
      <form class="relacion-usuarios-servicios__formulario-contenido" @submit.prevent="saveRelacion">
        <div class="relacion-usuarios-servicios__formulario-grupo">
          <label class="relacion-usuarios-servicios__formulario-label" for="usuario-create">Usuario:</label>
          <v-autocomplete
            v-model="newRelacion.usuario"
            :items="usuariosStore.usuarios"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del usuario"
            required
          />
        </div>
        <div class="relacion-usuarios-servicios__formulario-grupo">
          <label class="relacion-usuarios-servicios__formulario-label" for="servicio-create">Servicio:</label>
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
        <div class="relacion-usuarios-servicios__formulario-grupo">
          <button class="relacion-usuarios-servicios__formulario-boton" type="submit">Añadir Relación</button>
        </div>
      </form>
    </div>

    <!-- Formulario de edición -->
    <div v-if="showFormUpdate && updatedRelacion.id" class="relacion-usuarios-servicios__formulario">
      <h2 class="relacion-usuarios-servicios__formulario-titulo">Actualizar Relación</h2>
      <form class="relacion-usuarios-servicios__formulario-contenido" @submit.prevent="updateRelacion">
        <div class="relacion-usuarios-servicios__formulario-grupo">
          <label class="relacion-usuarios-servicios__formulario-label" for="usuario-update">Usuario:</label>
          <v-autocomplete
            v-model="updatedRelacion.usuario"
            :items="usuariosStore.usuarios"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del usuario"
            required
          />
        </div>
        <div class="relacion-usuarios-servicios__formulario-grupo">
          <label class="relacion-usuarios-servicios__formulario-label" for="servicio-update">Servicio:</label>
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
        <div class="relacion-usuarios-servicios__formulario-grupo">
          <button class="relacion-usuarios-servicios__formulario-boton" type="submit">Actualizar Relación</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
// Puedes copiar el mismo SCSS y solo cambiar los nombres de clase a "relacion-usuarios-servicios"
@import '../assets/styles/variables.scss';

.relacion-usuarios-servicios {
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

    & .relacion-usuarios-servicios__bar-separador {
      display: block;
      width: 160px;
      height: 2px;
      background-color: $color-principal;
      margin: auto;
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

    &-usuario,
    &-servicio {
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
  .relacion-usuarios-servicios__boton{
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
}
</style>
