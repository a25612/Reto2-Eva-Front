<script setup lang="ts">
import { ref, computed } from 'vue';

const showFormCreate = ref(false);
const showFormUpdate = ref(false);
const showFormDelete = ref(false);
const showModalDelete = ref(false); // Variable para controlar la visibilidad del modal de eliminación
const serviceSearch = ref('');
const serviceToDelete = ref<number | null>(null);

const services = ref([
  { id: 1, name: 'Servicio 1', description: 'Descripción del servicio 1' },
  { id: 2, name: 'Servicio 2', description: 'Descripción del servicio 2' },
  { id: 3, name: 'Servicio 3', description: 'Descripción del servicio 3' },
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

const filteredServices = computed(() => {
  if (serviceSearch.value === '') {
    return [];
  }
  return services.value.filter(service => service.name.toLowerCase().includes(serviceSearch.value.toLowerCase()) || service.description.toLowerCase().includes(serviceSearch.value.toLowerCase()));
});

// Función para abrir el modal de eliminación
const openModalDelete = (serviceId: number) => {
  serviceToDelete.value = serviceId;
  showModalDelete.value = true;
};

// Función para confirmar la eliminación del servicio
const confirmDelete = () => {
  if (serviceToDelete.value !== null) {
    services.value = services.value.filter(service => service.id !== serviceToDelete.value);
    serviceSearch.value = '';
    showModalDelete.value = false;
    showFormDelete.value = false;
  }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
  showModalDelete.value = false;
  serviceToDelete.value = null;
};
</script>


<template>
    <div class="servicios">
      <router-link to="/home-app-atemtia/zona-privada" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
      <h1 class="servicios__titulo">SERVICIOS</h1>
  
      <div class="servicios__separador-abajo">
        <span class="servicios__bar-separador"></span>
      </div>
  
      <div class="servicios__botones">
        <button class="servicios__boton" @click="toggleFormCreate">
          Añadir Servicio
        </button>
        <button class="servicios__boton" @click="toggleFormUpdate">
          Actualizar Servicio
        </button>
        <button class="servicios__boton" @click="toggleFormDelete">
          Eliminar Servicio
        </button>
      </div>
  
      <!-- Formulario para crear servicio -->
      <div v-if="showFormCreate" class="servicios__formulario">
        <h2 class="servicios__formulario-titulo">Crear Servicio</h2>
        <form class="servicios__formulario-contenido">
          <div class="servicios__formulario-grupo">
            <label class="servicios__formulario-label" for="nombre">Nombre:</label>
            <input class="servicios__formulario-input" type="text" id="nombre" placeholder="Nombre del servicio" required />
          </div>
          <div class="servicios__formulario-grupo">
            <label class="servicios__formulario-label" for="descripcion">Descripción:</label>
            <input class="servicios__formulario-input" type="text" id="descripcion" placeholder="Descripción del servicio" required />
          </div>
          <div class="servicios__formulario-grupo">
            <button class="servicios__formulario-boton" type="submit">Crear Servicio</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para actualizar servicio -->
      <div v-if="showFormUpdate" class="servicios__formulario">
        <h2 class="servicios__formulario-titulo">Actualizar Servicio</h2>
        <form class="servicios__formulario-contenido">
          <div class="servicios__formulario-grupo">
            <label class="servicios__formulario-label" for="nombre-update">Nombre:</label>
            <input class="servicios__formulario-input" type="text" id="nombre-update" placeholder="Nombre del servicio" required />
          </div>
          <div class="servicios__formulario-grupo">
            <label class="servicios__formulario-label" for="descripcion-update">Descripción:</label>
            <input class="servicios__formulario-input" type="text" id="descripcion-update" placeholder="Descripción del servicio" required />
          </div>
          <div class="servicios__formulario-grupo">
            <button class="servicios__formulario-boton" type="submit">Actualizar Servicio</button>
          </div>
        </form>
      </div>
  
      <!-- Formulario para eliminar servicio -->
      <div v-if="showFormDelete" class="servicios__formulario">
        <h2 class="servicios__formulario-titulo">Eliminar Servicio</h2>
        <div class="servicios__formulario-grupo">
          <input 
            class="servicios__formulario-input" 
            v-model="serviceSearch" 
            type="text" 
            placeholder="Buscar por nombre o descripción" 
          />
        </div>
  
        <div v-if="filteredServices.length > 0" class="servicios__servicios-encontrados">
          <ul>
            <li v-for="service in filteredServices" :key="service.id">
              <div>{{ service.name }} - {{ service.description }}</div>
              <button 
                class="servicios__eliminar-boton" 
                @click="openModalDelete(service.id)">
                Eliminar
              </button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No se encontraron servicios</p>
        </div>
      </div>
  
      <!-- Modal de confirmación para eliminar servicio -->
      <div v-if="showModalDelete" class="servicios__modal">
        <div class="servicios__modal-contenido">
          <p>¿Estás seguro de que deseas eliminar este servicio?</p>
          <div class="servicios__modal-botones">
            <button class="servicios__btn-confirmar" @click="confirmDelete">Confirmar</button>
            <button class="servicios__btn-cancelar" @click="cancelDelete">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<style lang="scss" scoped>
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

  &__servicios-encontrados {
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