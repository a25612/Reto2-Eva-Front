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

    <div v-if="miCuentaStore.cargandoTutor || miCuentaStore.cargandoUsuarios || miCuentaStore.cargandoEmpleados" class="loading">
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
      <div v-if="miCuentaStore.usuarios.length === 1" class="mi-cuenta__info">
        <p><strong>Usuario Seleccionado:</strong> {{ miCuentaStore.usuarios[0].nombre }}</p>
      </div>
      <div v-else-if="miCuentaStore.usuarios.length > 1" class="mi-cuenta__info">
        <p><strong>Usuarios:</strong></p>
        <div v-for="usuario in miCuentaStore.usuarios" :key="usuario.id" class="usuario-item">
          <p>{{ usuario.nombre }}</p>
        </div>
      </div>
      <p v-else>No hay usuarios asignados.</p>
    </div>

    <div v-if="authStore.rol === 'Empleado' && miCuentaStore.empleados.length > 0" class="mi-cuenta__info">
      <p><strong>Nombre:</strong> {{ miCuentaStore.empleados[0]?.nombre }}</p>
      <p><strong>DNI:</strong> {{ miCuentaStore.empleados[0]?.dni }}</p>
      <p><strong>Rol:</strong> Empleado</p>
    </div>

    <p v-else-if="!miCuentaStore.cargandoTutor && !miCuentaStore.cargandoUsuarios && !miCuentaStore.cargandoEmpleados && !miCuentaStore.tutor && miCuentaStore.empleados.length === 0 && miCuentaStore.usuarios.length === 0">
      No hay información disponible.
    </p>

    <button class="mi-cuenta__boton" @click="cerrarSesion">Cerrar Sesión</button>
  </div>
</template>




<style lang="scss">
@import '../assets/styles/variables.scss';

.mi-cuenta {
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
        width: 100%;
        background: $color-fondo;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: left;
        margin-bottom: 20px;
    }

    &__usuarios {
        font-size: 20px;
        margin-top: 20px;
        color: $color-secundario;
        font-weight: bold;
    }

    .custom-select {
        width: 100%;
        padding: 12px;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: $color-fondo;
        font-size: 16px;
        cursor: pointer;
        transition: border-color 0.3s ease;

        &:focus {
            border-color: $color-principal;
            outline: none;
        }

        option {
            padding: 10px;
        }
    }

    &__dato {
        font-size: 16px;
        color: #555;
        margin-bottom: 10px;
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

@keyframes swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: ease-out;
  }

  25% {
    transform: rotate(70deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(0deg);
    animation-timing-function: linear;
  }
}

@keyframes swing2 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: linear;
  }

  50% {
    transform: rotate(0deg);
    animation-timing-function: ease-out;
  }

  75% {
    transform: rotate(-70deg);
    animation-timing-function: ease-in;
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
        font-size: 22px;
    }

    .mi-cuenta__boton {
        padding: 18px;
        font-size: 18px;
    }
}
</style>
