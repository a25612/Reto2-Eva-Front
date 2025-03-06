

<template>
  <div class="usuarios">
    <router-link to="/home-app-atemtia/zona-privada" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>
    <h1 class="usuarios__titulo">USUARIOS</h1>

    <div class="usuarios__separador-abajo">
      <span class="usuarios__bar-separador"></span>
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

    <!-- Lista de usuarios filtrados -->
    <div v-if="usuariosStore.usuariosFiltrados.length > 0" class="usuarios__lista">
      <div v-for="usuario in usuariosStore.usuariosFiltrados" :key="usuario.dni" class="usuarios__item">
        <div class="usuarios__item-contenido">
          <h3 class="usuarios__item-nombre">{{ usuario.nombre }}</h3>
          <p class="usuarios__item-dni">DNI: {{ usuario.dni }}</p>
          <p class="usuarios__item-codigo">Código de Facturación: {{ usuario.codigoFacturacion }}</p>
        </div>
      </div>
    </div>
    <div v-else class="usuarios__no-resultados">
      <p>No se encontraron usuarios</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuariosStore } from '@/stores/usuarios'; // Asegúrate de que la ruta sea correcta

const usuariosStore = useUsuariosStore();
const searchTerm = ref('');

// Función para manejar la búsqueda
const handleSearch = () => {
  usuariosStore.filterUsuariosByTerm(searchTerm.value);
};
</script>


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

    &-dni,
    &-codigo {
      font-size: 14px;
      margin: 0;
      color: #666;
    }
  }

  &__no-resultados {
    margin: 15px 0;
    font-style: italic;
    color: #666;
  }
}
</style>








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

    &-titulo {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px 0;
      color: $color-titulos;
    }

    &-email {
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

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    &-contenido {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      width: 300px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

      p {
        margin-bottom: 20px;
      }

      .usuarios__modal-botones {
        display: flex;
        justify-content: space-between;

        .usuarios__btn-confirmar,
        .usuarios__btn-cancelar {
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

        .usuarios__btn-cancelar {
          background-color: #ccc;

          &:hover {
            background-color: #999;
          }
        }
      }
    }
  }
}
</style>
