<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUsuariosStore } from "../stores/usuarios";

// Obtener la tienda de usuarios
const usuariosStore = useUsuariosStore();
const searchTerm = ref("");

// Datos del formulario para actualización
const showFormUpdate = ref(false);
const updatedUsuario = ref({
  id: null,
  nombre: "",
  dni: "",
  codigoFacturacion: "",
});

// Datos del formulario para creación
const newUsuario = ref({
  nombre: "",
  dni: "",
  codigoFacturacion: "",
});

// Cargar los usuarios cuando el componente se monta
onMounted(() => {
  usuariosStore.cargarUsuarios();
});

// Watcher para cargar el usuario cuando se edita
watch(
  () => usuariosStore.usuarioActual,
  (nuevoUsuario) => {
    if (nuevoUsuario) {
      updatedUsuario.value = { ...nuevoUsuario };
      showFormUpdate.value = true;
    } else {
      updatedUsuario.value = { id: null, nombre: "", dni: "", codigoFacturacion: "" };
      showFormUpdate.value = false;
    }
  },
  { immediate: true }
);

// Función para actualizar el usuario
const updateUsuario = async () => {
  await usuariosStore.guardarUsuario(updatedUsuario.value);
  showFormUpdate.value = false;
};

// Función para crear un usuario
const saveUsuario = async () => {
  await usuariosStore.guardarUsuario(newUsuario.value);
  newUsuario.value = { nombre: "", dni: "", codigoFacturacion: "" }; // Resetear los campos
  usuariosStore.mostrarFormularioCrear = false; // Cerrar el formulario
};

// Función para buscar usuarios
const handleSearch = () => {
  usuariosStore.filtrarUsuarios(searchTerm.value);
};
</script>

<template>
  <div class="usuarios">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="usuarios__titulo">USUARIOS</h1>

    <div class="usuarios__separador-abajo">
      <span class="usuarios__bar-separador"></span>
    </div>

    <div class="usuarios__botones">
      <button class="usuarios__boton" @click="usuariosStore.toggleFormCreate">
        Añadir Usuario
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="usuarios__buscador">
      <div class="usuarios__buscador-contenedor">
        <input 
          v-model="searchTerm" 
          class="usuarios__buscador-input" 
          type="text" 
          placeholder="Buscar usuario..." 
          @input="handleSearch"
        />
        <button class="usuarios__buscador-boton" @click="handleSearch">
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div v-if="usuariosStore.usuariosFiltrados.length > 0" class="usuarios__lista">
      <div v-for="usuario in usuariosStore.usuariosFiltrados" :key="usuario.dni" class="usuarios__item">
        <div class="usuarios__item-contenido">
          <h3 class="usuarios__item-nombre">{{ usuario.nombre }}</h3>
          <p class="usuarios__item-dni">DNI: {{ usuario.dni }}</p>
          <p class="usuarios__item-codigo">Código Facturación: {{ usuario.codigoFacturacion }}</p>
        </div>
        <div class="usuarios__item-acciones">
          <button class="usuarios__item-boton usuarios__item-boton--editar" @click="usuariosStore.abrirFormularioEdicion(usuario)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="usuarios__item-boton usuarios__item-boton--eliminar" @click="usuariosStore.eliminarUsuario(usuario.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="usuarios__no-resultados">
      <p>No se encontraron usuarios</p>
    </div>
    <!-- Formulario de creación -->
    <div v-if="usuariosStore.mostrarFormularioCrear" class="usuarios__formulario">
      <h2 class="usuarios__formulario-titulo">Añadir Usuario</h2>
      <form class="usuarios__formulario-contenido" @submit.prevent="saveUsuario">
        <div class="usuarios__formulario-grupo">
          <label class="usuarios__formulario-label" for="nombre-create">Nombre:</label>
          <input v-model="newUsuario.nombre" class="usuarios__formulario-input" type="text" id="nombre-create" placeholder="Nombre del usuario" required />
        </div>
        <div class="usuarios__formulario-grupo">
          <label class="usuarios__formulario-label" for="dni-create">DNI:</label>
          <input v-model="newUsuario.dni" class="usuarios__formulario-input" type="text" id="dni-create" placeholder="DNI del usuario" required />
        </div>
        <div class="usuarios__formulario-grupo">
          <label class="usuarios__formulario-label" for="codigo-create">Código Facturación:</label>
          <input v-model="newUsuario.codigoFacturacion" class="usuarios__formulario-input" type="text" id="codigo-create" placeholder="Código de Facturación" required />
        </div>
        <div class="usuarios__formulario-grupo">
          <button class="usuarios__formulario-boton" type="submit">Añadir Usuario</button>
        </div>
      </form>
    </div>

    <!-- Formulario de edición -->
    <div v-if="showFormUpdate && updatedUsuario.id" class="usuarios__formulario">
      <h2 class="usuarios__formulario-titulo">Actualizar Usuario</h2>
      <form class="usuarios__formulario-contenido" @submit.prevent="updateUsuario">
        <div class="usuarios__formulario-grupo">
          <label class="usuarios__formulario-label" for="nombre-update">Nombre:</label>
          <input v-model="updatedUsuario.nombre" class="usuarios__formulario-input" type="text" id="nombre-update" placeholder="Nombre del usuario" required />
        </div>
        <div class="usuarios__formulario-grupo">
          <label class="usuarios__formulario-label" for="dni-update">DNI:</label>
          <input v-model="updatedUsuario.dni" class="usuarios__formulario-input" type="text" id="dni-update" placeholder="DNI del usuario" required />
        </div>
        <div class="usuarios__formulario-grupo">
          <label class="usuarios__formulario-label" for="codigo-update">Código Facturación:</label>
          <input v-model="updatedUsuario.codigoFacturacion" class="usuarios__formulario-input" type="text" id="codigo-update" placeholder="Código de Facturación" required />
        </div>
        <div class="usuarios__formulario-grupo">
          <button class="usuarios__formulario-boton" type="submit">Actualizar Usuario</button>
        </div>
      </form>
    </div>
  </div>
</template>



<style lang="scss">
// Variables
@import '../assets/styles/variables.scss';

.usuarios {
  font-family: $fuente-principal;
  background-color: $color-fondo;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
  text-align: center;

  &__titulo {
    font-size: 24px;
    font-weight: bold;
    color: $color-titulos;
  }

  &__separador-abajo {
    margin: 10px auto;

    & .usuarios__bar-separador {
      display: block;
      width: 160px;
      height: 2px;
      background-color: $color-principal;
      margin: auto;
    }
  }

  // Estilos para la barra de búsqueda
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

  // Estilos para la lista de usuarios
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

    &-nombre {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px 0;
      color: $color-titulos;
    }

    &-dni {
      font-size: 14px;
      margin: 0;
      color: #666;
    }

    &-codigo {
      font-size: 14px;
      margin: 0;
      color: #666;
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

  &__botones {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;

    & .usuarios__boton {
      display: inline-block;
      text-align: center;
      background-color: $color-boton;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken($color-boton, 10%);
      }
    }
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

  &__usuarios-encontrados {
    margin-top: 20px;

    & ul {
      list-style-type: none;
      padding: 0;
    }

    & li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  &__eliminar-boton {
    padding: 5px 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darkred;
    }
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  &__modal-contenido {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &__modal-botones {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  &__btn-confirmar, &__btn-cancelar {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  &__btn-confirmar {
    background-color: green;
    color: white;
  }

  &__btn-cancelar {
    background-color: gray;
    color: white;
  }

  &__btn-confirmar:hover {
    background-color: darkgreen;
  }

  &__btn-cancelar:hover {
    background-color: darkgray;
  }
}

.volver-atras {
  margin-right: 310px;
  background-color: $color-boton;
  color: $color-fondo;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0,0,0,.2);
}
</style>