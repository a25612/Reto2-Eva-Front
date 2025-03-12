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
          <img src="https://www.atades.org/wp-content/uploads/2021/10/atades-logo-atemtia-2x.png"
            alt="Servicios ATEMTIA" class="logo-atemtia">
        </a>
      </div>
    </div>
  </header>
</template>


<style lang="scss">
@import '../assets/styles/variables.scss';

.header {
  background-color: $color-fondo;
  color: $color-titulos; 
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
      height: 62px;
    }
  }
}
</style>
