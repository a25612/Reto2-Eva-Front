<template>
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__section">
          <h3 class="footer__title">Enlaces Rápidos</h3>
          <ul class="footer__list">
            <li class="footer__item"><a href="#" class="footer__link">Cartelera</a></li>
            <li class="footer__item"><a href="#" class="footer__link">Promociones</a></li>
            <li class="footer__item"><a href="#" class="footer__link">Contacto</a></li>
          </ul>
        </div>
  
        <div class="footer__section">
          <h3 class="footer__title">Síguenos</h3>
          <div class="footer__social">
            <a href="#" class="footer__social-link">
              <img src="../components/icons/Instagram.svg" alt="Instagram">
            </a>
          </div>
        </div>
      </div>
  
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2024. Todos los derechos reservados.</p>
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

  &__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__section {
    text-align: center;
  }

  &__title {
    font-family: $fuente-principal;
    font-size: 18px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin: 5px 0;
  }

  &__link {
    color: #1e90ff;
    text-decoration: none;
    font-family: $fuente-principal;
    font-size: 14px;
    transition: color 0.3s ease;

    &:hover {
      color: #4169b8;
    }
  }

  &__social {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }

  &__social-link img {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &__bottom {
    margin-top: 20px;
    border-top: 1px solid #333;
    padding-top: 10px;
  }

  &__copyright {
    font-family: $fuente-principal;
    font-size: 12px;
    color: #777;
  }

  @media (min-width: 768px) {
    &__container {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }
}



</style>