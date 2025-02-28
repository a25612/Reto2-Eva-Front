<template>
  <footer class="footer">
    <div class="footer-container">
      
      <div class="footer-section-centros">
        <h3 class="footer-title">Dónde estamos</h3>
        <p class="footer-address">
          C/ Castilla, 2<br>
          50009 Zaragoza
        </p>
        <p class="footer-address">
          C/ Octavio de Toledo, 2<br>
          50007 Zaragoza
        </p>
        <a href="mailto:consulta@espacioatemtia.es" class="footer-email">consulta@espacioatemtia.es</a>
        <p class="footer-phone">Tel. 620 844 236</p>
      </div>
      
      <div class="footer-logo">
        <a href="" class="footer-titulo-link">
          <img src="http://espacioatemtia.es/wp-content/uploads/2020/06/recursos-atemtia-casa-a@2x-240x300.png"
          alt="Servicios ATEMTIA" class="footer-logo-atemtia">
        </a>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">Síguenos</h3>
        <div class="footer-social">
          <a href="https://www.instagram.com/atemtia/" class="footer-social-link">
            <div class="social-icon instagram">
              <img src="../components/icons/Instagram.svg" alt="Instagram">
            </div>
          </a>
          <p class="footer-social-text">@Atemtia</p>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">&copy; Copyright Espacio Atemtia. Un proyecto de Atades</p>
    </div>
  </footer>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.footer {
  margin-top: 20px;
  border-top: 2px solid $color-boton;
  background-color: $color-fondo;
  color: $color-titulos;
  padding: 20px 15px;
  text-align: center;

  &-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  &-section {
    text-align: center;
  }

  &-section-centros{
    text-align: center;
  }


  &-title {

    font-size: 18px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  &-address, 
  &-phone {

    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
  }

  &-email {

    font-size: 16px;
    color: #67a5cf;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #4169b8;
    }
  }

  &-social {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  &-logo {
  a {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer-logo-atemtia {
    width: 140px;
    height: auto;
  }
}

  &-social-link {
    text-decoration: none;
    
    .social-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: $color-principal;
      
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      img {
        width: 20px;
        height: 20px;
        filter: brightness(0) invert(1); 
      }

      &:hover {
        transform: scale(1.1);
        background-color:$color-secundario;
       
      }

      
    }
  }

  &-social-text {

    font-size: 16px;
    color: #333;
    margin: 0;
  }

  &-bottom {
    margin-top: 20px;
    border-top: 1px solid #65bde1;
    padding-top: 10px;
  }

  &-copyright {
    font-family: $fuente-principal;
    font-size: 12px;
    color: #777;
  }

  @media (min-width: 768px) {
    &-container {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
    &-section {
      margin-right: 200px;
    }
    
    &-section-centros {
      margin-left: 50px;
    }	

    &-logo {
      margin-left: 150px;
    }

    &-social {
      justify-content: flex-start;
    }
    .footer-logo-atemtia {
      margin-right: 85px;
      width: 140px;
      height: auto;
  }
  }
}
</style>
