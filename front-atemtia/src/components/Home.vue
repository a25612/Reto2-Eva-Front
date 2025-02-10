<template>
    <div class="home">
      <div class="bienvenida">
        <div class="bienvenida-content">
          <h1>Bienvenido a la App de ATEMTIA</h1>
          <p>La plataforma de gestión de reservas diseñada para facilitar el acceso a los servicios.</p>
        </div>
      </div>
      <button class="boton-app">
         Visita la app
      </button>
    </div>
  </template>
  
  <style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';
  
  .home {
    text-align: center;
  }
  
  .bienvenida {
    color: $color-titulos;
    padding: 50px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .bienvenida-content h1 {
    font-size: 2.5rem;
    margin-bottom: 15px;
  }
  .boton-app {
    background-color: $color-boton;
    color: $color-fondo;
    font-size: 1.5rem;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
  </style>
  