<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTutoresStore } from "../stores/tutores";
import { useRouter } from 'vue-router';

const router = useRouter();
const tutoresStore = useTutoresStore();
const searchTerm = ref("");

const newTutor = ref({
  nombre: "",
  dni: "",
  email: "",
  username: "",
  password: "",
  activo: true,
});

onMounted(() => {
  tutoresStore.cargarTutores();
});

const updateTutor = async () => {
  try {
    await tutoresStore.guardarTutor(tutoresStore.tutorActual);
    tutoresStore.mostrarFormularioEditar = false;
  } catch (error) {
    console.error("Error al actualizar el tutor:", error);
  }
};

const saveTutor = async () => {
  try {
    await tutoresStore.guardarTutor(newTutor.value);
    newTutor.value = { nombre: "", dni: "", email: "", username: "", password: "", activo: true };
    tutoresStore.mostrarFormularioCrear = false;
  } catch (error) {
    console.error("Error al guardar el tutor:", error);
  }
};

const handleSearch = () => {
  tutoresStore.filtrarTutores(searchTerm.value);
};

const eliminarTutor = async (id: number) => {
  try {
    await tutoresStore.eliminarTutor(id);
  } catch (error) {
    console.error("Error al eliminar el tutor:", error);
  }
};

const abrirFormularioEdicion = (tutor: any) => {
  tutoresStore.abrirFormularioEdicion(tutor);
};
</script>

<template>
  <div class="tutores">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="tutores__titulo">TUTORES</h1>

    <div class="tutores__separador-abajo">
      <span class="tutores__bar-separador"></span>
    </div>

    <div class="tutores__botones">
      <button class="tutores__boton" @click="tutoresStore.toggleFormCreate">
        Añadir Tutor
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="tutores__buscador">
      <div class="tutores__buscador-contenedor">
        <input 
          v-model="searchTerm" 
          class="tutores__buscador-input" 
          type="text" 
          placeholder="Buscar tutor..." 
          @input="handleSearch"
        />
        <button class="tutores__buscador-boton" @click="handleSearch">
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <!-- Lista de tutores -->
    <div v-if="tutoresStore.tutoresFiltrados.length > 0" class="tutores__lista">
      <div v-for="tutor in tutoresStore.tutoresFiltrados" :key="tutor.dni" class="tutores__item">
        <div class="tutores__item-contenido">
          <h3 class="tutores__item-nombre">{{ tutor.nombre }}</h3>
          <p class="tutores__item-dni">DNI: {{ tutor.dni }}</p>
          <p class="tutores__item-email">Email: {{ tutor.email }}</p>
          <p class="tutores__item-username">Username: {{ tutor.username }}</p>
        </div>
        <div class="tutores__item-acciones">
          <button class="tutores__item-boton tutores__item-boton--editar" @click="abrirFormularioEdicion(tutor)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="tutores__item-boton tutores__item-boton--eliminar" @click="eliminarTutor(tutor.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="tutores__no-resultados">
      <p>No se encontraron tutores</p>
    </div>

    <!-- Formulario de creación -->
    <div v-if="tutoresStore.mostrarFormularioCrear" class="tutores__formulario">
      <h2 class="tutores__formulario-titulo">Añadir Tutor</h2>
      <form class="tutores__formulario-contenido" @submit.prevent="saveTutor">
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="nombre-create">Nombre:</label>
          <input v-model="newTutor.nombre" class="tutores__formulario-input" type="text" id="nombre-create" placeholder="Nombre del tutor" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="dni-create">DNI:</label>
          <input v-model="newTutor.dni" class="tutores__formulario-input" type="text" id="dni-create" placeholder="DNI del tutor" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="email-create">Email:</label>
          <input v-model="newTutor.email" class="tutores__formulario-input" type="email" id="email-create" placeholder="Email del tutor" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="username-create">Username:</label>
          <input v-model="newTutor.username" class="tutores__formulario-input" type="text" id="username-create" placeholder="Username del tutor" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="password-create">Contraseña:</label>
          <input v-model="newTutor.password" class="tutores__formulario-input" type="password" id="password-create" placeholder="Contraseña del tutor" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="activo-create">Activo:</label>
          <input v-model="newTutor.activo" type="checkbox" id="activo-create" />
        </div>
        <button type="submit" class="tutores__formulario-boton">Guardar</button>
      </form>
    </div>

    <!-- Formulario de edición -->
    <div v-if="tutoresStore.mostrarFormularioEditar" class="tutores__formulario">
      <h2 class="tutores__formulario-titulo">Editar Tutor</h2>
      <form class="tutores__formulario-contenido" @submit.prevent="updateTutor">
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="nombre-edit">Nombre:</label>
          <input v-model="tutoresStore.tutorActual.nombre" class="tutores__formulario-input" type="text" id="nombre-edit" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="dni-edit">DNI:</label>
          <input v-model="tutoresStore.tutorActual.dni" class="tutores__formulario-input" type="text" id="dni-edit" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="email-edit">Email:</label>
          <input v-model="tutoresStore.tutorActual.email" class="tutores__formulario-input" type="email" id="email-edit" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="username-edit">Username:</label>
          <input v-model="tutoresStore.tutorActual.username" class="tutores__formulario-input" type="text" id="username-edit" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="password-edit">Contraseña:</label>
          <input v-model="tutoresStore.tutorActual.password" class="tutores__formulario-input" type="password" id="password-edit" required />
        </div>
        <div class="tutores__formulario-grupo">
          <label class="tutores__formulario-label" for="activo-edit">Activo:</label>
          <input v-model="tutoresStore.tutorActual.activo" type="checkbox" id="activo-edit" />
        </div>
        <button type="submit" class="tutores__formulario-boton">Actualizar</button>
      </form>
    </div>
  </div>
</template>


<style lang="scss">
// Variables
@import '../assets/styles/variables.scss';

.tutores {
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

    & .tutores__bar-separador {
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

  // Estilos para la lista de tutores
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

    &-email {
      font-size: 14px;
      margin: 0;
      color: #666;
    }

    &-username {
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

    & .tutores__boton {
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

  &__tutores-encontrados {
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
