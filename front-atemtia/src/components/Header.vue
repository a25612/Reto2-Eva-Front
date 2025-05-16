<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const irAHome = () => {
  if (route.path.includes('/home-app-atemtia')) {
    router.push('/home-app-atemtia'); 
  } else {
    router.push('/'); 
  }
};
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="header-logo">
        <a @click.prevent="irAHome" class="header-titulo-link">
          <img src="/public/TERAPIAS-ACUATICAS.PNG"
            alt="Servicios ATEMTIA" class="logo-atemtia">
        </a>
      </div>
    </div>
  </header>
</template>


<style lang="scss">
@import '../assets/styles/variables.scss';

.header {
  font-family: $fuente-principal;
  background-color: 	$color-principal;
  padding: 19px;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 2px solid $color-secundario;
  z-index: 3000; 
  display: flex; 
  align-items: center;
  justify-content: center;

  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &-logo {
    a {
      display: flex;
      cursor: pointer;
    }

    .logo-atemtia {
      height: 88px;
    }
  }
}
</style>
