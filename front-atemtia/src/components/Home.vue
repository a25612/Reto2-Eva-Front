<template>
    <div class="home">
      <div class="bienvenida">
        <div class="bienvenida-content">
          <h1>Bienvenido a la App de ATEMTIA</h1>
          <p>La plataforma de gestión de reservas diseñada para facilitar el acceso a los tutores.</p>
        </div>
      </div>

      <li><router-link  class="boton-app" to="/login">Visita la app</router-link></li>

      <section class="info">
        <h2>¿Qué ofrecemos?</h2>
        <p>
          ATEMTIA App es una aplicación web que permite a los tutores gestionar sus reservas e incidencias 
          de forma sencilla y rápida.
        </p>
      </section>
  
      <section class="info">
        <h2>¿Qué puedes hacer?</h2>
        <p>
          Dentro de la app podrás cancelar, mover o hacer reservas de nuestros servicios. 
          También podrás comunicarte con los profesionales.
        </p>
      </section>
  
      <section class="info">
        <h2>Más información sobre Atemtia</h2>
        <p>
          Si quieres saber más información sobre Atemtia y sus servicios, visita nuestra página web.
        </p>
        <button 
          class="boton-web-atemtia" 
          @click="redirigirAWeb"
        >
          Más información
        </button>
      </section>
      <button class="boton-scroll-top" @click="scrollToTop">↑</button>

    </div>
  </template>
  
  <script>
 export default {
  methods: {
    redirigirAWeb() {
      window.location.href = "https://espacioatemtia.es/";
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth" // Hace que la transición sea suave
      });
    }
  }
};

  
  </script>
  
  <style lang="scss" scoped>
  @import '../assets/styles/variables.scss';
  .home {
    text-align: center;
  }
  
  .bienvenida {
    color: $color-titulos;
    padding: 45px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    .bienvenida-content h1 {
      font-size: 26px;
    }
  }
  
  button {
    padding: 10px 15px;
    font-size: 19px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, 
                transform 0.2s ease, box-shadow 0.3s ease;
  }
  
  .boton-app {
    margin-top: -13px;
    background-color: $color-boton;
    color: $color-fondo;
  
    &:hover {
      background-color: $color-secundario;
      color: $color-fondo;
      transform: scale(1.05);
    }
  }
  
  .boton-web-atemtia {
    margin-top: 20px;
    background-color: $color-boton;
    color: $color-fondo;
    position: relative;
    overflow: hidden;
  
    &:hover {
      background-color: $color-secundario;
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
      transition: left 0.4s ease-in-out;
    }
  
    &:hover::after {
      left: 100%;
    }
  }
  
  .info {
    background-color: $color-principal;
    color: $color-fondo;
    padding: 40px 20px;
    margin-top: 20px;
    text-align: center;
  
    h2 {
      font-size: 24px;
      color: $color-fondo;
      margin-bottom: 12px;
      font-family: $fuente-principal;
    }
  
    p {
      font-size: 18px;
      font-family: $fuente-principal;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
    }
  }
  .boton-scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: $color-boton;
  color: $color-fondo;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: $color-secundario;
    transform: scale(1.1);
  }
}

  </style>
  