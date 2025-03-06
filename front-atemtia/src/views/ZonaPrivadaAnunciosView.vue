<script setup lang="ts">
import { ref, computed } from 'vue';

const showFormCreate = ref(false);
const showFormUpdate = ref(false);
const showFormDelete = ref(false);
const showModalDelete = ref(false); 
const anuncioSearch = ref('');
const anuncioToDelete = ref<number | null>(null);

const anuncios = ref([
  { id: 1, title: 'Anuncio 1', description: 'Descripción del anuncio 1', publicationDate: '2025-01-01' },
  { id: 2, title: 'Anuncio 2', description: 'Descripción del anuncio 2', publicationDate: '2025-02-01' },
  { id: 3, title: 'Anuncio 3', description: 'Descripción del anuncio 3', publicationDate: '2025-03-01' },
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

const filteredAnuncios = computed(() => {
  if (anuncioSearch.value === '') {
    return [];
  }
  return anuncios.value.filter(anuncio => anuncio.title.toLowerCase().includes(anuncioSearch.value.toLowerCase()) || anuncio.description.toLowerCase().includes(anuncioSearch.value.toLowerCase()));
});


const openModalDelete = (anuncioId: number) => {
  anuncioToDelete.value = anuncioId;
  showModalDelete.value = true;
};


const confirmDelete = () => {
  if (anuncioToDelete.value !== null) {
    anuncios.value = anuncios.value.filter(anuncio => anuncio.id !== anuncioToDelete.value);
    anuncioSearch.value = '';
    showModalDelete.value = false;
    showFormDelete.value = false;
  }
};


const cancelDelete = () => {
  showModalDelete.value = false;
  anuncioToDelete.value = null;
};
</script>


<template>
    <div class="anuncios">
      <router-link to="/home-app-atemtia/zona-privada" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
      <h1 class="anuncios__titulo">ANUNCIOS</h1>
  
      <div class="anuncios__separador-abajo">
        <span class="anuncios__bar-separador"></span>
      </div>
  
      <div class="anuncios__botones">
        <button class="anuncios__boton" @click="toggleFormCreate">
          Añadir Anuncio
        </button>
        <button class="anuncios__boton" @click="toggleFormUpdate">
          Actualizar Anuncio
        </button>
        <button class="anuncios__boton" @click="toggleFormDelete">
          Eliminar Anuncio
        </button>
      </div>
  
      <!-- Formulario para crear anuncio -->
      <div v-if="showFormCreate" class="anuncios__formulario">
        <h2 class="anuncios__formulario-titulo">Crear Anuncio</h2>
        <form class="anuncios__formulario-contenido">
          <div class="anuncios__formulario-grupo">
            <label class="anuncios__formulario-label" for="titulo">Título:</label>
            <input class="anuncios__formulario-input" type="text" id="titulo" placeholder="Título del anuncio" required />
          </div>
          <div class="anuncios__formulario-grupo">
            <label class="anuncios__formulario-label" for="descripcion">Descripción:</label>
            <input class="anuncios__formulario-input" type="text" id="descripcion" placeholder="Descripción del anuncio" required />
          </div>
          <div class="anuncios__formulario-grupo">
            <label class="anuncios__formulario-label" for="fecha-publicacion">Fecha de publicación:</label>
            <input class="anuncios__formulario-input" type="date" id="fecha-publicacion" required />
          </div>
          <div class="anuncios__formulario-grupo">
            <button class="anuncios__formulario-boton" type="submit">Crear Anuncio</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para actualizar anuncio -->
      <div v-if="showFormUpdate" class="anuncios__formulario">
        <h2 class="anuncios__formulario-titulo">Actualizar Anuncio</h2>
        <form class="anuncios__formulario-contenido">
          <div class="anuncios__formulario-grupo">
            <label class="anuncios__formulario-label" for="titulo-update">Título:</label>
            <input class="anuncios__formulario-input" type="text" id="titulo-update" placeholder="Título del anuncio" required />
          </div>
          <div class="anuncios__formulario-grupo">
            <label class="anuncios__formulario-label" for="descripcion-update">Descripción:</label>
            <input class="anuncios__formulario-input" type="text" id="descripcion-update" placeholder="Descripción del anuncio" required />
          </div>
          <div class="anuncios__formulario-grupo">
            <label class="anuncios__formulario-label" for="fecha-publicacion-update">Fecha de publicación:</label>
            <input class="anuncios__formulario-input" type="date" id="fecha-publicacion-update" required />
          </div>
          <div class="anuncios__formulario-grupo">
            <button class="anuncios__formulario-boton" type="submit">Actualizar Anuncio</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para eliminar anuncio -->
      <div v-if="showFormDelete" class="anuncios__formulario">
        <h2 class="anuncios__formulario-titulo">Eliminar Anuncio</h2>
        <div class="anuncios__formulario-grupo">
          <input 
            class="anuncios__formulario-input" 
            v-model="anuncioSearch" 
            type="text" 
            placeholder="Buscar por título o descripción" 
          />
        </div>
  
        <div v-if="filteredAnuncios.length > 0" class="anuncios__anuncios-encontrados">
          <ul>
            <li v-for="anuncio in filteredAnuncios" :key="anuncio.id">
              <div>{{ anuncio.title }} - {{ anuncio.description }}</div>
              <button 
                class="anuncios__eliminar-boton" 
                @click="openModalDelete(anuncio.id)">
                Eliminar
              </button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No se encontraron anuncios</p>
        </div>
      </div>
  
      <!-- Modal de confirmación para eliminar anuncio -->
      <div v-if="showModalDelete" class="anuncios__modal">
        <div class="anuncios__modal-contenido">
          <p>¿Estás seguro de que deseas eliminar este anuncio?</p>
          <div class="anuncios__modal-botones">
            <button class="anuncios__btn-confirmar" @click="confirmDelete">Confirmar</button>
            <button class="anuncios__btn-cancelar" @click="cancelDelete">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<style lang="scss">
@import '../assets/styles/variables.scss';

.anuncios {
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

    & .anuncios__bar-separador {
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

    & .anuncios__boton {
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

  &__anuncios-encontrados {
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