<template>
    <header class="header">
        <div class="header-container">
            <div class="header-logo">
                <a href="home.html" class="header-titulo-link">
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
  color: $color-fondo;
  font-family: $fuente-principal;
  padding: 19px;
  position: sticky; 
  top: 0; 
  left: 0;
  width: 100%;
  border-bottom: 2px solid $color-secundario;


  &-container {
    display: flex;
    justify-content: center;
  }

  &-logo {
    a {
      display: flex;
    }

    .logo-atemtia {
      height: 62px; 
    }
  }
}
</style>