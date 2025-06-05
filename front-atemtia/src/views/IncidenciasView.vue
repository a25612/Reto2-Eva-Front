<script setup lang="ts">
import { ref } from 'vue';

const nuevaIncidencia = ref('');
const incidencias = ref<string[]>([]);

const enviarIncidencia = () => {
  if (nuevaIncidencia.value.trim()) {
    incidencias.value.push(nuevaIncidencia.value);
    nuevaIncidencia.value = ''; // Limpia el campo después de enviar
  }
};
</script>

<template>
    <div class="incidencias">
      <router-link to="/home-app-atemtia" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
      <h2 class="incidencias__titulo">Reporte de Incidencias</h2>
  
      <form class="incidencias__form" @submit.prevent="enviarIncidencia">
        <label class="incidencias__label">Descripción:</label>
        <textarea v-model="nuevaIncidencia" class="incidencias__textarea" placeholder="Describe el problema..." required></textarea>
  
        <button type="submit" class="incidencias__boton">Enviar</button>
      </form>
  
      <div class="incidencias__lista" v-if="incidencias.length">
        <h3 class="incidencias__subtitulo">Incidencias Reportadas</h3>
        <ul class="incidencias__items">
          <li v-for="(incidencia, index) in incidencias" :key="index" class="incidencias__item">
            <span class="incidencias__texto">{{ incidencia }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.incidencias {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &__titulo {
 
    font-size: 22px;
    margin-bottom: 15px;
    color: #333;
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__label {

    font-size: 16px;
    margin-bottom: 5px;
  }

  &__textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
  }

  &__boton {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    
    color: #fff;
    background: #007bff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.3s ease;

    &:hover {
      background: #0056b3;
    }
  }

  &__lista {
    width: 100%;
    margin-top: 20px;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &__subtitulo {

    font-size: 18px;
    margin-bottom: 10px;
    color: #444;
  }

  &__items {
    list-style: none;
    padding: 0;
  }

  &__item {
    padding: 10px;
    border-bottom: 1px solid #ddd;

    font-size: 14px;
    color: #555;
  }

  &__texto {
    display: block;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}


</style> 
