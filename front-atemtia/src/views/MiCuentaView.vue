<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMiCuentaStore } from '../stores/micuenta';
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '../stores/login';

const router = useRouter();
const authStore = useAuthStore();
const miCuentaStore = useMiCuentaStore();

const usuarioSeleccionado = ref<string | null>(null);

onMounted(async () => {
  await miCuentaStore.cargarTodosDatos();
  usuarioSeleccionado.value = miCuentaStore.usuarioSeleccionadoId;

  if (miCuentaStore.usuarios.length > 0 && !miCuentaStore.usuarioSeleccionadoId) {
    usuarioSeleccionado.value = miCuentaStore.usuarios[0].id;
    miCuentaStore.seleccionarUsuario(miCuentaStore.usuarios[0].id);
  }
});

watch(
  () => miCuentaStore.usuarios,
  (newUsuarios) => {
    if (newUsuarios.length > 0 && !miCuentaStore.usuarioSeleccionadoId) {
      usuarioSeleccionado.value = newUsuarios[0].id;
      miCuentaStore.seleccionarUsuario(newUsuarios[0].id);
    }
  },
  { deep: true }
);

watch(usuarioSeleccionado, (nuevoUsuario) => {
  if (nuevoUsuario) {
    miCuentaStore.seleccionarUsuario(nuevoUsuario);
  }
});

const cerrarSesion = () => {
  miCuentaStore.cerrarSesion();
  router.push('/login');
};
</script>

<template>
  <div class="mi-cuenta">
    <router-link to="/home-app-atemtia" class="volver-atras">
      <i class="fa-solid fa-arrow-left"></i>
    </router-link>

    <h2 class="mi-cuenta__titulo">Mi Cuenta</h2>

    <p v-if="miCuentaStore.error" class="error">{{ miCuentaStore.error }}</p>

    <div v-if="miCuentaStore.cargandoTutor || miCuentaStore.cargandoUsuarios || miCuentaStore.cargandoEmpleados"
      class="loading">
      <div class="newtons-cradle">
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
      </div>
    </div>

    <div v-if="authStore.rol === 'Tutor' && miCuentaStore.tutor" class="mi-cuenta__info">
      <p class="mi-cuenta__dato"><strong>Nombre:</strong> {{ miCuentaStore.tutor?.nombre }}</p>
      <p class="mi-cuenta__dato"><strong>Email:</strong> {{ miCuentaStore.tutor?.email }}</p>
      <p class="mi-cuenta__dato"><strong>Rol:</strong> {{ miCuentaStore.tutor?.rol }}</p>
    </div>

    <div v-if="authStore.rol === 'Tutor'">
      <h2 class="mi-cuenta__usuarios">Mis Usuarios</h2>
      <div v-if="miCuentaStore.usuarios.length > 0" class="mi-cuenta__usuarios-tarjeta">
        <p v-for="usuario in miCuentaStore.usuarios" :key="usuario.id" class="mi-cuenta__dato">
          {{ usuario.nombre }}
        </p>
      </div>
      <p v-else>No hay usuarios asignados.</p>
    </div>

    <div v-if="authStore.rol === 'Empleado' && miCuentaStore.empleados.length > 0" class="mi-cuenta__info">
      <p><strong>Nombre:</strong> {{ miCuentaStore.empleados[0]?.nombre }}</p>
      <p><strong>DNI:</strong> {{ miCuentaStore.empleados[0]?.dni }}</p>
      <p><strong>Rol:</strong> Empleado</p>
    </div>

    <p
      v-else-if="!miCuentaStore.cargandoTutor && !miCuentaStore.cargandoUsuarios && !miCuentaStore.cargandoEmpleados && !miCuentaStore.tutor && miCuentaStore.empleados.length === 0 && miCuentaStore.usuarios.length === 0">
      No hay información disponible.
    </p>

    <button class="mi-cuenta__boton" @click="cerrarSesion">Cerrar Sesión</button>
  </div>
</template>





<style lang="scss">
@import '../assets/styles/variables.scss';

@import '../assets/styles/variables.scss';

.mi-cuenta {
  font-family: $fuente-principal;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  max-width: 400px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &__titulo {
    font-size: 24px;
    margin-bottom: 20px;
    color: $color-principal;
    font-weight: bold;
  }

  &__info {
    
    background: $color-fondo;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    margin-bottom: 20px;
  }

  &__usuarios {
    font-size: 22px;
    margin-top: 32px;
    margin-bottom: 18px;
    color: $color-principal;
    font-weight: bold;
    text-align: center;
  }

  &__usuarios-tarjeta {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 24px 24px 18px 24px;
    margin: 0 auto 24px auto;
    max-width: 320px;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__dato {
    font-size: 16px;
    color: #222;
    margin-bottom: 8px;
    font-weight: 500;
  }

  &__boton {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    color: #fff;
    background: rgba(255, 0, 0, 0.785);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: background 0.3s ease;

    &:hover {
      background: darken($color-principal, 10%);
    }
  }

  .volver-atras {
    margin-right: auto;
    background-color: $color-boton;
    color: #fff;
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
    transition: background 0.3s ease;

    &:hover {
      background-color: darken($color-boton, 10%);
    }
  }
}

.newtons-cradle {
  $uib-size: 50px;
  $uib-speed: 1.2s;
  $uib-color: #474554;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $uib-size;
  height: $uib-size;

  &__dot {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    width: 25%;
    transform-origin: center top;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 25%;
      border-radius: 50%;
      background-color: $uib-color;
    }

    &:first-child {
      animation: swing $uib-speed linear infinite;
    }

    &:last-child {
      animation: swing2 $uib-speed linear infinite;
    }
  }
}

@media (min-width: 768px) {
  .mi-cuenta {
    max-width: 600px;
    padding: 30px;
  }

  .mi-cuenta__titulo {
    font-size: 28px;
  }

  .mi-cuenta__info {
    padding: 25px;
  }

  .mi-cuenta__usuarios {
    font-size: 24px;
  }

  .mi-cuenta__usuarios-tarjeta {
    max-width: 400px;
    padding: 32px 32px 24px 32px;
  }

  .mi-cuenta__boton {
    padding: 18px;
    font-size: 18px;
  }
}

</style>
