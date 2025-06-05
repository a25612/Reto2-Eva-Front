<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRelacionesStore } from "../stores/UsuariosTutores";
import { useUsuariosStore } from "../stores/usuarios";
import { useTutoresStore } from "../stores/tutores";

const relacionesStore = useRelacionesStore();
const usuariosStore = useUsuariosStore();
const tutoresStore = useTutoresStore();

const searchTerm = ref("");
const showFormUpdate = ref(false);
const updatedRelacion = ref<any>({ id: null, usuario: null, tutor: null });
const newRelacion = ref<any>({ usuario: null, tutor: null });

onMounted(() => {
  relacionesStore.cargarRelaciones();
  usuariosStore.cargarUsuarios();
  tutoresStore.cargarTutores();
});

// Watch para edición: busca por ID, no por nombre
watch(
  () => relacionesStore.relacionActual,
  (nuevaRelacion) => {
    if (nuevaRelacion) {
      updatedRelacion.value = {
        id: nuevaRelacion.id,
        usuario: usuariosStore.usuarios.find((u) => u.id === nuevaRelacion.usuarioId) || null,
        tutor: tutoresStore.tutores.find((t) => t.id === nuevaRelacion.tutorId) || null,
      };
      showFormUpdate.value = true;
    } else {
      updatedRelacion.value = { id: null, usuario: null, tutor: null };
      showFormUpdate.value = false;
    }
  },
  { immediate: true }
);

const saveOrUpdateRelacion = async (relacion: any) => {
  // Debug log para ver los valores
  console.log("Usuario:", relacion.usuario, "Tutor:", relacion.tutor);

  if (relacion.usuario?.id && relacion.tutor?.id) {
    const datosRelacion = {
      idUsuario: relacion.usuario.id,
      idTutor: relacion.tutor.id,
      ...(relacion.id && { id: relacion.id }),
    };

    await relacionesStore.guardarRelacion(datosRelacion);

    if (!relacion.id) {
      newRelacion.value = { usuario: null, tutor: null };
      relacionesStore.mostrarFormularioCrear = false;
    }
    showFormUpdate.value = false;
  } else {
    alert("Debes seleccionar tanto un usuario como un tutor.");
  }
};

const updateRelacion = async () => await saveOrUpdateRelacion(updatedRelacion.value);
const saveRelacion = async () => await saveOrUpdateRelacion(newRelacion.value);

const handleSearch = () => relacionesStore.filtrarRelaciones(searchTerm.value);
</script>

<template>
  <div class="relacion-usuarios-tutores">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="relacion-usuarios-tutores__titulo">Relación Usuarios - Tutores</h1>

    <div class="relacion-usuarios-tutores__separador-abajo">
      <span class="relacion-usuarios-tutores__bar-separador"></span>
    </div>

    <div class="relacion-usuarios-tutores__botones">
      <button class="relacion-usuarios-tutores__boton" @click="relacionesStore.toggleFormCreate">
        Añadir Relación
      </button>
    </div>

    <div class="relacion-usuarios-tutores__buscador">
      <div class="relacion-usuarios-tutores__buscador-contenedor">
        <input 
          v-model="searchTerm" 
          class="relacion-usuarios-tutores__buscador-input" 
          type="text" 
          placeholder="Buscar relación..." 
          @input="handleSearch"
        />
        <button class="relacion-usuarios-tutores__buscador-boton" @click="handleSearch">
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <div v-if="relacionesStore.relacionesFiltradas.length > 0" class="relacion-usuarios-tutores__lista">
      <div v-for="relacion in relacionesStore.relacionesFiltradas" :key="relacion.id" class="relacion-usuarios-tutores__item">
        <div class="relacion-usuarios-tutores__item-contenido">
          <h3 class="relacion-usuarios-tutores__item-usuario">Usuario: {{ relacion.usuarioNombre }}</h3>
          <p class="relacion-usuarios-tutores__item-tutor">Tutor: {{ relacion.tutorNombre }}</p>
        </div>
        <div class="relacion-usuarios-tutores__item-acciones">
          <button class="relacion-usuarios-tutores__item-boton relacion-usuarios-tutores__item-boton--editar" @click="relacionesStore.abrirFormularioEdicion(relacion)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="relacion-usuarios-tutores__item-boton relacion-usuarios-tutores__item-boton--eliminar" @click="relacionesStore.eliminarRelacion(relacion.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="relacion-usuarios-tutores__no-resultados">
      <p>No se encontraron relaciones</p>
    </div>

    <!-- Formulario de creación -->
    <div v-if="relacionesStore.mostrarFormularioCrear" class="relacion-usuarios-tutores__formulario">
      <h2 class="relacion-usuarios-tutores__formulario-titulo">Añadir Relación</h2>
      <form class="relacion-usuarios-tutores__formulario-contenido" @submit.prevent="saveRelacion">
        <div class="relacion-usuarios-tutores__formulario-grupo">
          <label class="relacion-usuarios-tutores__formulario-label" for="usuario-create">Usuario:</label>
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
        <div class="relacion-usuarios-tutores__formulario-grupo">
          <label class="relacion-usuarios-tutores__formulario-label" for="tutor-create">Tutor:</label>
          <v-autocomplete
            v-model="newRelacion.tutor"
            :items="tutoresStore.tutores"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del tutor"
            required
          />
        </div>
        <div class="relacion-usuarios-tutores__formulario-grupo">
          <button class="relacion-usuarios-tutores__formulario-boton" type="submit">Añadir Relación</button>
        </div>
      </form>
    </div>

    <!-- Formulario de edición -->
    <div v-if="showFormUpdate && updatedRelacion.id" class="relacion-usuarios-tutores__formulario">
      <h2 class="relacion-usuarios-tutores__formulario-titulo">Actualizar Relación</h2>
      <form class="relacion-usuarios-tutores__formulario-contenido" @submit.prevent="updateRelacion">
        <div class="relacion-usuarios-tutores__formulario-grupo">
          <label class="relacion-usuarios-tutores__formulario-label" for="usuario-update">Usuario:</label>
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
        <div class="relacion-usuarios-tutores__formulario-grupo">
          <label class="relacion-usuarios-tutores__formulario-label" for="tutor-update">Tutor:</label>
          <v-autocomplete
            v-model="updatedRelacion.tutor"
            :items="tutoresStore.tutores"
            item-title="nombre"
            item-value="id"
            return-object
            label="Nombre del tutor"
            required
          />
        </div>
        <div class="relacion-usuarios-tutores__formulario-grupo">
          <button class="relacion-usuarios-tutores__formulario-boton" type="submit">Actualizar Relación</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Variables
@import '../assets/styles/variables.scss';

.relacion-usuarios-tutores {
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

    & .relacion-usuarios-tutores__bar-separador {
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
    &-tutor {
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
  .relacion-usuarios-tutores__boton{
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