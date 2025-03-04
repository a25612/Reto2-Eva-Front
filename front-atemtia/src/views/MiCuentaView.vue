<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMiCuenta } from '../ts/micuenta';
import { onMounted, watch } from 'vue';

const router = useRouter();
const { tutor, usuarios, cargandoTutor, cargandoUsuarios, error, cargarTodosDatos, cerrarSesion: cerrarSesionComposable, usuarioSeleccionadoId, seleccionarUsuario, cargarUltimoUsuarioSeleccionado } = useMiCuenta();

onMounted(async () => {
  await cargarTodosDatos();
  cargarUltimoUsuarioSeleccionado();
  
  if (!usuarioSeleccionadoId.value && usuarios.value.length > 0) {
    seleccionarUsuario(usuarios.value[0].id);
  }
});

watch(usuarios, () => {
  if (usuarioSeleccionadoId.value && !usuarios.value.some(u => u.id === usuarioSeleccionadoId.value)) {
    if (usuarios.value.length > 0) {
      seleccionarUsuario(usuarios.value[0].id);
    } else {
      usuarioSeleccionadoId.value = '';
    }
  }
}, { immediate: true });

const cerrarSesion = () => {
  cerrarSesionComposable();
  router.push('/login');
};
</script>

<template>
  <div class="mi-cuenta">
    <router-link to="/home-app-atemtia" class="volver-atras"><i class="fa-solid fa-arrow-left"></i></router-link>
    
    <h2 class="mi-cuentatitulo">Mi Cuenta</h2>
    
    <p v-if="error" class="error">{{ error }}</p>
    
    <div v-if="cargandoTutor || cargandoUsuarios" class="loading">
      Cargando...
    </div>
    
    <div v-else-if="tutor" class="mi-cuentainfo">
      <p class="mi-cuentadato"><strong>Nombre:</strong> {{ tutor.nombre }}</p>
      <p class="mi-cuentadato"><strong>Email:</strong> {{ tutor.email }}</p>
      <p class="mi-cuentadato"><strong>Rol:</strong> {{ tutor.rol }}</p>
    </div>
    
    <h2 class="mi-cuentausuarios">Mis Usuarios</h2>

    <div v-if="usuarios.length > 0" class="mi-cuenta-info-usuarios">
      <label for="seleccionar-usuario"><strong>Seleccionar Usuario:</strong></label>
      <select id="seleccionar-usuario" v-model="usuarioSeleccionadoId" @change="seleccionarUsuario($event.target.value)" class="custom-select">
        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
          {{ usuario.nombre }}
        </option>
      </select>
    </div>

    <p v-else class="mi-cuentadato-usuario">No hay usuarios asignados.</p>

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
  margin: auto;
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

  &usuarios {
    margin-top: 20px;
  }

  &-info-usuarios {
    width: 100%;
    background: $color-fondo;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: left;

    label {
      margin-bottom: 10px;
      display: block; 
    }
  
    .custom-select {
      width: calc(100% - 20px);
      padding:10px; 
      border-radius:5px; 
      border:1px solid #ccc; 
      background-color: $color-fondo;
      font-size:16px; 
      cursor:pointer; 
      
      &:focus {
        border-color: $color-principal; 
        outline:none;
      }
      
      option {
        padding:10px;
      }
    }
   }

   &dato {
     font-size:16px;
     color:#555;
     margin-bottom:8px;
   }

   &boton {
     width:100%;
     padding:12px;
     font-size:16px;
     color:$color-fondo;
     background:#d9534f;
     border:none;
     border-radius:8px;
     cursor:pointer;
     margin-top:15px;

     &:hover {
       background:#c9302c;  
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
}

@media (min-width:768px) { 
   .mi-cuenta{
     
       max-width:500px; 
   }
}
</style>
