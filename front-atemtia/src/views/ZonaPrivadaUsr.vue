<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUsuariosStore } from "../stores/usuarios";

const usuariosStore = useUsuariosStore();
const searchTerm = ref("");

// Cargar usuarios al montar el componente
onMounted(() => {
  usuariosStore.cargarUsuarios();
});

// Filtrar usuarios en tiempo real
const handleSearch = () => {
  usuariosStore.filtrarUsuarios(searchTerm.value);
};

// Función para abrir el formulario de edición
const editarUsuario = (usuario: any) => {
  usuariosStore.abrirFormularioEdicion(usuario);
};

// Función para eliminar usuario
const eliminarUsuario = (id: number) => {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    usuariosStore.eliminarUsuario(id);
  }
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
          <button class="usuarios__item-boton usuarios__item-boton--editar" @click="editarUsuario(usuario)">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="usuarios__item-boton usuarios__item-boton--eliminar" @click="eliminarUsuario(usuario.id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="usuarios__no-resultados">
      <p>No se encontraron usuarios</p>
    </div>

    <!-- Formulario de creación/edición -->
    <FormUsuario v-if="usuariosStore.mostrarFormulario" />
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

  &__boton {
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

    &-dni, &-codigo {
      font-size: 14px;
      margin: 0;
      color: #666;
    }

    &-acciones {
      display: flex;
      gap: 10px;

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
          background-color: #4CAF50;

          &:hover {
            background-color: darkgreen;
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
  }

  &__no-resultados {
    margin: 15px 0;
    font-style: italic;
    color: #666;
  }
}
</style>
