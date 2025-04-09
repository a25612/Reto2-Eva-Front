<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServiciosStore } from '../stores/Serviciosprivate';

const serviciosStore = useServiciosStore();
const searchTerm = ref('');

const handleSearch = () => {
  serviciosStore.filterServiciosByTerm(searchTerm.value);
};

onMounted(() => {
  serviciosStore.fetchServicios();
});
</script>

<template>
  <div class="servicios">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="servicios__titulo">SERVICIOS</h1>

    <div class="servicios__separador-abajo">
      <span class="servicios__bar-separador"></span>
    </div>
    
    <div class="servicios__botones">
      <button class="servicios__boton" @click="serviciosStore.toggleFormCreate">
        Añadir Servicio
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="servicios__buscador">
      <div class="servicios__buscador-contenedor">
        <input 
          v-model="searchTerm" 
          class="servicios__buscador-input" 
          type="text" 
          placeholder="Buscar servicios..." 
          @input="handleSearch"
        />
        <button class="servicios__buscador-boton" @click="handleSearch">
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <!-- Formulario Crear -->
    <div v-if="serviciosStore.showFormCreate" class="servicios__formulario">
      <h2 class="servicios__formulario-titulo">Crear Servicio</h2>
      <form class="servicios__formulario-contenido" @submit.prevent="serviciosStore.addServicio">
        <div class="servicios__formulario-grupo">
          <label class="servicios__formulario-label" for="nombre">Nombre:</label>
          <input v-model="serviciosStore.newServicio.nombre" class="servicios__formulario-input" type="text" id="nombre" placeholder="Nombre del servicio" required />
        </div>
        <div class="servicios__formulario-grupo">
          <button class="servicios__formulario-boton" type="submit">Crear Servicio</button>
        </div>
      </form>
    </div>

    <!-- Formulario Actualizar -->
    <div v-if="serviciosStore.showFormUpdate && serviciosStore.updatedServicio.id" class="servicios__formulario">
      <h2 class="servicios__formulario-titulo">Actualizar Servicio</h2>
      <form class="servicios__formulario-contenido" @submit.prevent="serviciosStore.updateServicio">
        <div class="servicios__formulario-grupo">
          <label class="servicios__formulario-label" for="nombre-update">Nombre:</label>
          <input v-model="serviciosStore.updatedServicio.nombre" class="servicios__formulario-input" type="text" id="nombre-update" required />
        </div>
        <div class="servicios__formulario-grupo">
          <button class="servicios__formulario-boton" type="submit">Actualizar Servicio</button>
        </div>
      </form>
    </div>

    <!-- Lista de Servicios -->
    <div v-if="serviciosStore.filteredServicios.length > 0" class="servicios__lista">
      <div v-for="servicio in serviciosStore.filteredServicios" :key="servicio.id" class="servicios__item">
        <div class="servicios__item-contenido">
          <h3 class="servicios__item-titulo">{{ servicio.nombre }}</h3>
        </div>
        <div class="servicios__item-acciones">
          <button class="servicios__item-boton servicios__item-boton--editar" @click="serviciosStore.selectServicioToUpdate(servicio)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="servicios__item-boton servicios__item-boton--eliminar" @click="serviciosStore.openModalDelete(servicio.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="servicios__no-resultados">
      <p>No se encontraron servicios</p>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="serviciosStore.showModalDelete" class="servicios__modal">
      <div class="servicios__modal-contenido">
        <p>¿Estás seguro de que deseas eliminar este servicio?</p>
        <div class="servicios__modal-botones">
          <button class="servicios__btn-confirmar" @click="serviciosStore.confirmDelete">Confirmar</button>
          <button class="servicios__btn-cancelar" @click="serviciosStore.cancelDelete">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

@import '../assets/styles/variables.scss';

.servicios {
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

    & .servicios__bar-separador {
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

  // Estilos para la lista de servicios
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

    &-titulo {
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

  &__botones {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;

    & .servicios__boton {
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

    &:hover {
      background-color: darkgreen;
    }
  }

  &__btn-cancelar {
    background-color: gray;
    color: white;

    &:hover {
      background-color: darkgray;
    }
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
