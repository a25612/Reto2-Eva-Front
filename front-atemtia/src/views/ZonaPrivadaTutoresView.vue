<script setup lang="ts">
import { ref, computed } from 'vue';

const showFormCreate = ref(false);
const showFormUpdate = ref(false);
const showFormDelete = ref(false);
const showModalDelete = ref(false); 
const tutorSearch = ref('');
const tutorToDelete = ref<number | null>(null);

const tutors = ref([
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

const filteredTutors = computed(() => {
  if (tutorSearch.value === '') {
    return [];
  }
  return tutors.value.filter(tutor => tutor.name.toLowerCase().includes(tutorSearch.value.toLowerCase()) || tutor.email.toLowerCase().includes(tutorSearch.value.toLowerCase()));
});


const openModalDelete = (tutorId: number) => {
  tutorToDelete.value = tutorId;
  showModalDelete.value = true;
};


const confirmDelete = () => {
  if (tutorToDelete.value !== null) {
    tutors.value = tutors.value.filter(tutor => tutor.id !== tutorToDelete.value);
    tutorSearch.value = '';
    showModalDelete.value = false;
    showFormDelete.value = false;
  }
};


const cancelDelete = () => {
  showModalDelete.value = false;
  tutorToDelete.value = null;
};
</script>


<template>
    <div class="tutores">
      <router-link to="/home-app-atemtia/zona-privada" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
      <h1 class="tutores__titulo">TUTORES</h1>
  
      <div class="tutores__separador-abajo">
        <span class="tutores__bar-separador"></span>
      </div>
  
      <div class="tutores__botones">
        <button class="tutores__boton" @click="toggleFormCreate">
          Añadir Tutor
        </button>
        <button class="tutores__boton" @click="toggleFormUpdate">
          Actualizar Tutor
        </button>
        <button class="tutores__boton" @click="toggleFormDelete">
          Eliminar Tutor
        </button>
      </div>
  
      <!-- Formulario para crear tutor -->
      <div v-if="showFormCreate" class="tutores__formulario">
        <h2 class="tutores__formulario-titulo">Crear Tutor</h2>
        <form class="tutores__formulario-contenido">
          <div class="tutores__formulario-grupo">
            <label class="tutores__formulario-label" for="nombre">Nombre:</label>
            <input class="tutores__formulario-input" type="text" id="nombre" placeholder="Nombre del tutor" required />
          </div>
          <div class="tutores__formulario-grupo">
            <label class="tutores__formulario-label" for="email">Email:</label>
            <input class="tutores__formulario-input" type="email" id="email" placeholder="Email del tutor" required />
          </div>
          <div class="tutores__formulario-grupo">
            <label class="tutores__formulario-label" for="contraseña">Contraseña:</label>
            <input class="tutores__formulario-input" type="password" id="contraseña" placeholder="Contraseña" required />
          </div>
          <div class="tutores__formulario-grupo">
            <button class="tutores__formulario-boton" type="submit">Crear Tutor</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para actualizar tutor -->
      <div v-if="showFormUpdate" class="tutores__formulario">
        <h2 class="tutores__formulario-titulo">Actualizar Tutor</h2>
        <form class="tutores__formulario-contenido">
          <div class="tutores__formulario-grupo">
            <label class="tutores__formulario-label" for="nombre-update">Nombre:</label>
            <input class="tutores__formulario-input" type="text" id="nombre-update" placeholder="Nombre del tutor" required />
          </div>
          <div class="tutores__formulario-grupo">
            <label class="tutores__formulario-label" for="email-update">Email:</label>
            <input class="tutores__formulario-input" type="email" id="email-update" placeholder="Email del tutor" required />
          </div>
          <div class="tutores__formulario-grupo">
            <label class="tutores__formulario-label" for="contraseña-update">Contraseña:</label>
            <input class="tutores__formulario-input" type="password" id="contraseña-update" placeholder="Contraseña" />
          </div>
          <div class="tutores__formulario-grupo">
            <button class="tutores__formulario-boton" type="submit">Actualizar Tutor</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para eliminar tutor -->
      <div v-if="showFormDelete" class="tutores__formulario">
        <h2 class="tutores__formulario-titulo">Eliminar Tutor</h2>
        <div class="tutores__formulario-grupo">
          <input 
            class="tutores__formulario-input" 
            v-model="tutorSearch" 
            type="text" 
            placeholder="Buscar por nombre o email" 
          />
        </div>
  
        <div v-if="filteredTutors.length > 0" class="tutores__tutores-encontrados">
          <ul>
            <li v-for="tutor in filteredTutors" :key="tutor.id">
              <div>{{ tutor.name }} - {{ tutor.email }}</div>
              <button 
                class="tutores__eliminar-boton" 
                @click="openModalDelete(tutor.id)">
                Eliminar
              </button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No se encontraron tutores</p>
        </div>
      </div>
  
      <!-- Modal de confirmación para eliminar tutor -->
      <div v-if="showModalDelete" class="tutores__modal">
        <div class="tutores__modal-contenido">
          <p>¿Estás seguro de que deseas eliminar este tutor?</p>
          <div class="tutores__modal-botones">
            <button class="tutores__btn-confirmar" @click="confirmDelete">Confirmar</button>
            <button class="tutores__btn-cancelar" @click="cancelDelete">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<style lang="scss">
@import '../assets/styles/variables.scss';

.tutores {
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

    & .tutores__bar-separador {
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
     margin-right:310px;
     background-color:$color-boton;
     color:$color-fondo;
     border:none;
     border-radius:50%;
     width:45px;
     height:45px;
     font-size:20px;
     cursor:pointer;

     display:flex; 
     align-items:center; 
     justify-content:center; 
     text-decoration:none; 
     box-shadow:0 4px 8px rgba(0,0,0,.2);
   }

</style>
