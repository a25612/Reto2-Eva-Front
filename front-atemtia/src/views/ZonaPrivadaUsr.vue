<script setup lang="ts">
import { ref, computed } from 'vue';

const showFormCreate = ref(false); // Variable para mostrar el formulario de creación de usuario
const showFormUpdate = ref(false); // Variable para mostrar el formulario de actualización de usuario
const showFormDelete = ref(false); // Variable para mostrar el formulario de eliminación de usuario
const userSearch = ref(''); // Variable para el valor de búsqueda del usuario

// Lista de usuarios simulada (puedes agregar más usuarios aquí para probar)
const users = ref([
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
  { id: 2, name: 'Ana García', email: 'ana@example.com' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com' },
]);

// Función para manejar la apertura del formulario de creación de usuario
const toggleFormCreate = () => {
  showFormCreate.value = !showFormCreate.value;
  if (showFormCreate.value) {
    showFormUpdate.value = false;
    showFormDelete.value = false;
  }
};

// Función para manejar la apertura del formulario de actualización de usuario
const toggleFormUpdate = () => {
  showFormUpdate.value = !showFormUpdate.value;
  if (showFormUpdate.value) {
    showFormCreate.value = false;
    showFormDelete.value = false;
  }
};

// Función para manejar la apertura del formulario de eliminación de usuario
const toggleFormDelete = () => {
  showFormDelete.value = !showFormDelete.value;
  if (showFormDelete.value) {
    showFormCreate.value = false;
    showFormUpdate.value = false;
  }
};

// Filtrar usuarios según el texto de búsqueda
const filteredUsers = computed(() => {
  return users.value.filter(user => user.name.toLowerCase().includes(userSearch.value.toLowerCase()) || user.email.toLowerCase().includes(userSearch.value.toLowerCase()));
});

// Función para eliminar el usuario
const deleteUser = (userId: number) => {
  users.value = users.value.filter(user => user.id !== userId);
  userSearch.value = ''; // Limpiar la búsqueda después de eliminar
  showFormDelete.value = false; // Cerrar el formulario de eliminación
};
</script>

<template>
  <div class="usuarios">
    <h1 class="usuarios__titulo">USUARIOS</h1>

    <!-- Separador abajo -->
    <div class="usuarios__separador-abajo">
      <span class="usuarios__bar-separador"></span>
    </div>

    <div class="usuarios__botones">
      <button class="usuarios__boton" @click="toggleFormCreate">
        Añadir Usuario
      </button>
      <button class="usuarios__boton" @click="toggleFormUpdate">
        Actualizar
      </button>
      <button class="usuarios__boton" @click="toggleFormDelete">
        Eliminar
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
              @click="deleteUser(user.id)">
              Eliminar
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No se encontraron usuarios</p>
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
    }

    &-boton {
      padding: 12px;
      background-color: $color-principal;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;

      &:hover {
        background-color: darken($color-principal, 10%);
      }
    }
  }

  &__eliminar-boton {
    background-color: red;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: darkred;
    }
  }

  &__usuarios-encontrados {
    list-style-type: none;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;

      button {
        background-color: red;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background-color: darkred;
        }
      }
    }
  }
}
</style>
