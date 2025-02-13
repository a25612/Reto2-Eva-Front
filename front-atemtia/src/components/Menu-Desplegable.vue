<script >
import menudesplegable from '../js/menu-desplegable.js';

export default {
  ...menudesplegable
};
</script>

<template>
    <div class="desplegable-izquierda">
    <button class="btn-menudesplegable" onclick="abrirMenuIzquierda()">
      <span class="bar-izquierda"></span>
      <span class="bar-izquierda"></span>
      <span class="bar-izquierda"></span>
    </button>
    <nav class="nav-izquierda">
      <ul class="nav-izquierda-menu">
        <li>
          <a href="#" class="menu-izquierda-link">
            <i class="fas fa-home"></i> 
            Inicio
          </a>
        </li>
        <li>
          <a href="#" class="menu-izquierda-link">
            <i class="fas fa-cogs"></i> 
            Servicios
          </a>
        </li>
      </ul>
    </nav>
  </div>

</template>

<style lang="scss">
@import '../assets/styles/variables.scss';
.btn-menudesplegable {
  position: fixed;
  top: 1rem;
  z-index: 2001;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  margin-top: 90px;
  cursor: pointer;
  padding: 1rem;
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .bar-izquierda {
    display: block;
    width: 25px;
    height: 3px;
    background: $color-secundario;
    border-radius: 2px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;

    &:nth-child(1) {
      transform-origin: top left;
    }

    &:nth-child(2) {
      transform-origin: center;
    }

    &:nth-child(3) {
      transform-origin: bottom left;
    }
  }
}

.desplegable-izquierda {
  position: relative;

  .nav-izquierda {
    position: fixed;
    top: 0;
    left: -36%;
    width: 27%;
    height: 100%;
    margin-top: 101px;
    background: $color-secundario;
    box-shadow: 2px 0 8px $color-principal;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    padding: 1rem;

    &-menu {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin: 1rem 0;

        .menu-izquierda-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: $color-fondo;

          i {
            margin-right: 15px;
            font-size: 1.2rem;
          }

          &:hover {
            color: #dedfe1;
          }
        }
      }
    }

    &.active {
      left: 0;
      margin-top: 101px;
    }
  }

  &.active {
    .btn-menudesplegable {
      left: 31%;
    }
  }

  .btn-menudesplegable {
    .bar-izquierda {
      &.active {
        &:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }

        &:nth-child(2) {
          opacity: 0;
        }

        &:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }
      }
    }
  }
}


</style> 
