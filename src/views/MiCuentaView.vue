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
      Cargando...
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
        <label for="usuarioSelect"><strong>Selecciona un usuario:</strong></label>
        <select id="usuarioSelect" class="custom-select" v-model="usuarioSeleccionado">
          <option v-for="usuario in miCuentaStore.usuarios" :key="usuario.id" :value="usuario.id">
            {{ usuario.nombre }}
          </option>
        </select>
      </div>
      <p v-else>No hay usuarios asignados.</p>
    </div>

    <div v-if="authStore.rol === 'Empleado' && miCuentaStore.empleados.length > 0" class="mi-cuenta__info">
      <p><strong>Nombre:</strong> {{ miCuentaStore.empleados[0]?.nombre }}</p>
      <p><strong>DNI:</strong> {{ miCuentaStore.empleados[0]?.dni }}</p>
      <p><strong>Rol:</strong> Empleado</p>
    </div>

    <p v-else-if="
        !miCuentaStore.cargandoTutor &&
        !miCuentaStore.cargandoUsuarios &&
        !miCuentaStore.cargandoEmpleados &&
        !miCuentaStore.tutor &&
        miCuentaStore.empleados.length === 0 &&
        miCuentaStore.usuarios.length === 0"
      >
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
    background: #f8f8f8;
    border-radius: 12px;
    max-width: 400px;
    margin: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &__titulo {
        font-size: 22px;
        margin-bottom: 15px;
        color: #333;
    }

    &__info {
        width: 100%;
        background: $color-fondo;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        text-align: left;
    }

    &__usuarios {
        font-size: 20px;
        margin-top: 15px;
        color: #333;
    }

    .custom-select {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        background-color: $color-fondo;
        font-size: 16px;
        cursor: pointer;

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
        margin-bottom: 8px;
    }

    &__boton {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        color: $color-fondo;
        background: #d9534f;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 15px;

        &:hover {
            background: #c9302c;
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
        box-shadow: 0 4px 8px rgba(0, 0, 0, .2);
    }
}

@media (min-width: 768px) {
    .mi-cuenta {
        max-width: 500px;
    }
}
</style>
