<script setup lang="ts">
import { ref, computed } from 'vue';

const showFormCreate = ref(false);
const showFormUpdate = ref(false);
const showFormDelete = ref(false);
const showModalDelete = ref(false); // Variable para controlar la visibilidad del modal de eliminación
const userSearch = ref('');
const userToDelete = ref<number | null>(null);

const users = ref([
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
  { id: 2, name: 'Ana García', email: 'ana@example.com' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com' },
]);

const toggleFormCreate = () => {
  showFormCreate.value = !showFormCreate.value;
  if (showFormCreate.value) {
    showFormUpdate.value = false;
    showFormDelete.value = false;
  }
};

const toggleFormUpdate = () => {
  showFormUpdate.value = !showFormUpdate.value;
  if (showFormUpdate.value) {
    showFormCreate.value = false;
    showFormDelete.value = false;
  }
};

const toggleFormDelete = () => {
  showFormDelete.value = !showFormDelete.value;
  if (showFormDelete.value) {
    showFormCreate.value = false;
    showFormUpdate.value = false;
  }
};

const filteredUsers = computed(() => {
  if (userSearch.value === '') {
    return [];
  }
  return users.value.filter(user => user.name.toLowerCase().includes(userSearch.value.toLowerCase()) || user.email.toLowerCase().includes(userSearch.value.toLowerCase()));
});

// Función para abrir el modal de eliminación
const openModalDelete = (userId: number) => {
  userToDelete.value = userId;
  showModalDelete.value = true;
};

// Función para confirmar la eliminación del usuario
const confirmDelete = () => {
  if (userToDelete.value !== null) {
    users.value = users.value.filter(user => user.id !== userToDelete.value);
    userSearch.value = '';
    showModalDelete.value = false;
    showFormDelete.value = false;
  }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
  showModalDelete.value = false;
  userToDelete.value = null;
};
</script>


<template>
    <div class="usuarios">
      <h1 class="usuarios__titulo">USUARIOS</h1>
  
      <div class="usuarios__separador-abajo">
        <span class="usuarios__bar-separador"></span>
      </div>
  
      <div class="usuarios__botones">
        <button class="usuarios__boton" @click="toggleFormCreate">
          Añadir Usuario
        </button>
        <button class="usuarios__boton" @click="toggleFormUpdate">
          Actualizar Usuario
        </button>
        <button class="usuarios__boton" @click="toggleFormDelete">
          Eliminar Usuario
        </button>
      </div>
  
      <!-- Formulario para crear usuario -->
      <div v-if="showFormCreate" class="usuarios__formulario">
        <h2 class="usuarios__formulario-titulo">Crear Usuario</h2>
        <form class="usuarios__formulario-contenido">
          <div class="usuarios__formulario-grupo">
            <label class="usuarios__formulario-label" for="nombre">Nombre:</label>
            <input class="usuarios__formulario-input" type="text" id="nombre" placeholder="Nombre del usuario" required />
          </div>
          <div class="usuarios__formulario-grupo">
            <label class="usuarios__formulario-label" for="email">Email:</label>
            <input class="usuarios__formulario-input" type="email" id="email" placeholder="Email del usuario" required />
          </div>
          <div class="usuarios__formulario-grupo">
            <label class="usuarios__formulario-label" for="contraseña">Contraseña:</label>
            <input class="usuarios__formulario-input" type="password" id="contraseña" placeholder="Contraseña" required />
          </div>
          <div class="usuarios__formulario-grupo">
            <button class="usuarios__formulario-boton" type="submit">Crear Usuario</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para actualizar usuario -->
      <div v-if="showFormUpdate" class="usuarios__formulario">
        <h2 class="usuarios__formulario-titulo">Actualizar Usuario</h2>
        <form class="usuarios__formulario-contenido">
          <div class="usuarios__formulario-grupo">
            <label class="usuarios__formulario-label" for="nombre-update">Nombre:</label>
            <input class="usuarios__formulario-input" type="text" id="nombre-update" placeholder="Nombre del usuario" required />
          </div>
          <div class="usuarios__formulario-grupo">
            <label class="usuarios__formulario-label" for="email-update">Email:</label>
            <input class="usuarios__formulario-input" type="email" id="email-update" placeholder="Email del usuario" required />
          </div>
          <div class="usuarios__formulario-grupo">
            <label class="usuarios__formulario-label" for="contraseña-update">Contraseña:</label>
            <input class="usuarios__formulario-input" type="password" id="contraseña-update" placeholder="Contraseña" />
          </div>
          <div class="usuarios__formulario-grupo">
            <button class="usuarios__formulario-boton" type="submit">Actualizar Usuario</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para eliminar usuario -->
      <div v-if="showFormDelete" class="usuarios__formulario">
        <h2 class="usuarios__formulario-titulo">Eliminar Usuario</h2>
        <div class="usuarios__formulario-grupo">
          <input 
            class="usuarios__formulario-input" 
            v-model="userSearch" 
            type="text" 
            placeholder="Buscar por nombre o email" 
          />
        </div>
  
        <div v-if="filteredUsers.length > 0" class="usuarios__usuarios-encontrados">
          <ul>
            <li v-for="user in filteredUsers" :key="user.id">
              <div>{{ user.name }} - {{ user.email }}</div>
              <button 
                class="usuarios__eliminar-boton" 
                @click="openModalDelete(user.id)">
                Eliminar
              </button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No se encontraron usuarios</p>
        </div>
      </div>
  
      <!-- Modal de confirmación para eliminar usuario -->
      <div v-if="showModalDelete" class="usuarios__modal">
        <div class="usuarios__modal-contenido">
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
          <div class="usuarios__modal-botones">
            <button class="usuarios__btn-confirmar" @click="confirmDelete">Confirmar</button>
            <button class="usuarios__btn-cancelar" @click="cancelDelete">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<style lang="scss">
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


</style>
