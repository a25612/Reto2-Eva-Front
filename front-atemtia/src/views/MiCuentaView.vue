<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const cerrarSesion = () => {

  router.push('/login'); 
};
</script>

<template>
  <div class="mi-cuenta">
    <h2 class="mi-cuentatitulo">Mi Cuenta</h2>

    <div class="mi-cuentainfo">
      <p class="mi-cuentadato"><strong>Nombre:</strong> </p>
      <p class="mi-cuentadato"><strong>Apellido:</strong> </p>
      <p class="mi-cuentadato"><strong>DNI:</strong> </p>

    </div>

    <!-- Agregado el evento @click -->
    <button class="mi-cuentaboton" @click="cerrarSesion">Cerrar Sesión</button>
  </div>
</template>



<style lang="scss">
@import '../assets/styles/variables.scss';

.mi-cuenta {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &titulo {

    font-size: 22px;
    margin-bottom: 15px;
    color: #333;
  }

  &info {
    width: 100%;
    background: $color-fondo;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: left;
  }

  &dato {
    font-size: 16px;
    color: #555;
    margin-bottom: 8px;
  }

  &boton {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    color: $color-fondo;
    background: #d9534f;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
    transition: background 0.3s ease;

    &:hover {
      background: #c9302c;
    }
  }
}


</style>