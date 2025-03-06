<script setup lang="ts">
import { useAnunciosStore } from '../stores/anuncios';
import { onMounted } from 'vue';

const anunciosStore = useAnunciosStore();

// Llamar al método fetchAnuncios cuando el componente se monta
onMounted(() => {
  anunciosStore.fetchAnuncios();
});
</script>


<template>
  <div class="anuncios">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="anuncios__titulo">ANUNCIOS</h1>

    <div class="anuncios__separador-abajo">
      <span class="anuncios__bar-separador"></span>
    </div>

    <div class="anuncios__botones">
      <button class="anuncios__boton" @click="anunciosStore.toggleFormCreate">
        Añadir Anuncio
      </button>
      <button class="anuncios__boton" @click="anunciosStore.toggleFormUpdate" :disabled="!anunciosStore.updatedAnuncio.id">
        Actualizar Anuncio
      </button>
      <button class="anuncios__boton" @click="anunciosStore.toggleFormDelete">
        Eliminar Anuncio
      </button>
    </div>

    <!-- Formulario para crear anuncio -->
    <div v-if="anunciosStore.showFormCreate" class="anuncios__formulario">
      <h2 class="anuncios__formulario-titulo">Crear Anuncio</h2>
      <form class="anuncios__formulario-contenido" @submit.prevent="anunciosStore.addAnuncio">
        <div class="anuncios__formulario-grupo">
          <label class="anuncios__formulario-label" for="titulo">Título:</label>
          <input v-model="anunciosStore.newAnuncio.title" class="anuncios__formulario-input" type="text" id="titulo" placeholder="Título del anuncio" required />
        </div>
        <div class="anuncios__formulario-grupo">
          <label class="anuncios__formulario-label" for="descripcion">Descripción:</label>
          <input v-model="anunciosStore.newAnuncio.description" class="anuncios__formulario-input" type="text" id="descripcion" placeholder="Descripción del anuncio" required />
        </div>
       
        <div class="anuncios__formulario-grupo">
          <button class="anuncios__formulario-boton" type="submit">Crear Anuncio</button>
        </div>
      </form>
    </div>

    <!-- Formulario para actualizar anuncio -->
    <div v-if="anunciosStore.showFormUpdate && anunciosStore.updatedAnuncio.id" class="anuncios__formulario">
      <h2 class="anuncios__formulario-titulo">Actualizar Anuncio</h2>
      <form class="anuncios__formulario-contenido" @submit.prevent="anunciosStore.updateAnuncio">
        <div class="anuncios__formulario-grupo">
          <label class="anuncios__formulario-label" for="titulo-update">Título:</label>
          <input v-model="anunciosStore.updatedAnuncio.title" class="anuncios__formulario-input" type="text" id="titulo-update" placeholder="Título del anuncio" required />
        </div>
        <div class="anuncios__formulario-grupo">
          <label class="anuncios__formulario-label" for="descripcion-update">Descripción:</label>
          <input v-model="anunciosStore.updatedAnuncio.description" class="anuncios__formulario-input" type="text" id="descripcion-update" placeholder="Descripción del anuncio" required />
        </div>
        
        <div class="anuncios__formulario-grupo">
          <button class="anuncios__formulario-boton" type="submit">Actualizar Anuncio</button>
        </div>
      </form>
    </div>

    <!-- Formulario para eliminar anuncio -->
    <div v-if="anunciosStore.showFormDelete" class="anuncios__formulario">
      <h2 class="anuncios__formulario-titulo">Eliminar Anuncio</h2>
      <div class="anuncios__formulario-grupo">
        <input class="anuncios__formulario-input" v-model="anunciosStore.anuncioSearch" type="text" placeholder="Buscar por título o descripción" />
      </div>

      <div v-if="anunciosStore.filteredAnuncios.length > 0" class="anuncios__anuncios-encontrados">
        <ul>
          <li v-for="anuncio in anunciosStore.filteredAnuncios" :key="anuncio.id">
            <div>{{ anuncio.title }} - {{ anuncio.description }}</div>
            <button class="anuncios__eliminar-boton" @click="anunciosStore.openModalDelete(anuncio.id)">
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
    <div v-if="anunciosStore.showModalDelete" class="anuncios__modal">
      <div class="anuncios__modal-contenido">
        <p>¿Estás seguro de que deseas eliminar este anuncio?</p>
        <div class="anuncios__modal-botones">
          <button class="anuncios__btn-confirmar" @click="anunciosStore.confirmDelete">Confirmar</button>
          <button class="anuncios__btn-cancelar" @click="anunciosStore.cancelDelete">Cancelar</button>
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