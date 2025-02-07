<template>
    <header class="header">
        <div class="header-container">
            <div class="header-logo">
                <a href="home.html" class="header-titulo-link">
                    <img src="https://www.atades.org/wp-content/uploads/2021/10/atades-logo-atemtia-2x.png"
                        alt="Servicios ATEMTIA" class="logo-atemtia">
                </a>
            </div>
            <!-- BOTÓN INICIAR SESIÓN -->
            <label class="popup">
                <input type="checkbox" />
                <div tabindex="0" class="burger">
                    <svg viewBox="0 0 24 24" fill="white" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z">
                        </path>
                    </svg>
                </div>
                <nav class="popup-window">
                    <ul>
                        <li>
                            <button class="btn-open-modal">
                                <span>Iniciar Sesión</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </label>
        </div>
    </header>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.header {
  background-color: $color-fondo;
  color: #fff;
  font-family: $fuente-principal;
  padding: 22px;
  position: fixed; 
  top: 0; 
  left: 0;
  width: 100%;
  z-index: 2000;
  border-bottom: 2px solid $color-secundario;


  &-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  &-logo {
    a {
      display: flex;
      align-items: center;
    }

    .logo-atemtia {
      height: 55px; 
      width: auto;
    }
  }

  &-desplegable { 
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 2001;

    .bar {
      display: block;
      width: 25px;
      height: 3px;
      background: #fff;
      transition: all 0.3s ease;
    }
  }

  &-nav {
    &-menu {
      list-style: none;
      display: flex;
      gap: 24px;
      margin: 0;
      padding: 0;

      li {
        .header-link {
          text-decoration: none;
          color: #fff;
          font-size: 16px;
          transition: color 0.3s ease;

          &:hover {
            color: $color-secundario;
          }
        }
      }
    }
  }
}

// Media Query para móviles
@media (max-width: 768px) {
  .header-desplegable {
    display: flex;
  }

  .header-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: $color-principal;
    z-index: 1999;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    
    &.active {
      display: block;
      padding: 1rem 0;
    }

    &-menu {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      
      li {
        width: 100%;
        text-align: center;
        
        .header-link {
          display: block;
          padding: 0.75rem 0;
          font-size: 1.1rem;
          
          &:hover {
            background-color: rgba(255,255,255,0.1);
          }
        }
      }
    }
  }
}
</style>