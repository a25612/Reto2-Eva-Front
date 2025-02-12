<template>
 <!-- MI ESPACIO -->
 <div class="div-mi-espacio">
    <h2>Mi Espacio</h2>

    <!-- SEPARADOR -->
    <div class="separador-abajo">
      <span class="bar-separador"></span>
    </div>
    <div class="mi-espacio-grid">
      <div class="espacio-item mensajes">
        <span class="notificacion">2</span>
        <div class="icono"></div>
        <p>Mensajes</p>
      </div>
      <div class="espacio-item reservas">
        <div class="icono"></div>
        <p>Reservas</p>
      </div>
      <div class="espacio-item incidencias">
        <span class="notificacion">1</span>
        <div class="icono"></div>
        <p>Incidencias</p>
      </div>
      <div class="espacio-item mi-cuenta">
        <div class="icono"></div>
        <p>Mi cuenta</p>
      </div>
    </div>
  </div>

  <!-- SEPARADOR -->
  <div class="separador">
    <span class="bar-separador"></span>
  </div>


</template>

<script>

</script>

<style lang="scss">
@import '../assets/styles/variables.scss';
titulo-anuncios {
  margin-top: 60px;
}

.separador {
  display: flex;
  justify-content: center;

  .bar-separador {
    margin-top: 20px;
    display: block;
    width: 350px;
    height: 1px;
    background: rgba(84, 190, 84, 0.441);
  }
}

.separador-abajo {
  display: flex;
  justify-content: center;

  .bar-separador {
    margin-top: -19px;
    margin-bottom: 25px;
    display: block;
    width: 350px;
    height: 1px;
    background: rgba(84, 190, 84, 0.441);
  }
}

.div-mi-espacio {
  h2 {
    margin-bottom: 40px;
    margin-left: 40px;
    color: $color-principal;
    font-size: 22px;
  }

  .mi-espacio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    max-width: 350px;
    margin: 0 auto;
  }

  .espacio-item {
    position: relative;
    padding: 1rem;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    color: $color-fondo;
  
    font-weight: 600;


    &:hover {
      transform: scale(1.05);
      box-shadow: 6px 6px 14px rgba(0, 0, 0, 0.25);
    }

    &.mensajes,
    &.reservas,
    &.incidencias,
    &.mi-cuenta {
        background: linear-gradient(135deg, $color-principal 20%, $color-secundario 80%);
  
    }

    .icono {
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    p {
      margin-top: -1.45rem;
      font-size: 15px;
    }

    .notificacion {
      position: absolute;
      top: -8px;
      left: -8px;

      font-size: 0.8rem;
      font-weight: bold;
      padding: 5px 8px;
      border-radius: 50%;
    }
  }
}

</style>