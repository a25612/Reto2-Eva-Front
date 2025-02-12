<template>
  <div class="home">
    <div class="bienvenida">
      <div class="bienvenida-content">
        <h1>Bienvenido a la App de ATEMTIA</h1>
        <p>La plataforma de gestión de reservas diseñada para facilitar el acceso a los tutores.</p>
      </div>
    </div>

    <router-link class="boton-app" to="/login">Visita la app</router-link>

    <section class="info-container">
      <div class="info">
        <h2>¿Qué ofrecemos?</h2>
        <p>
          ATEMTIA App es una aplicación web que permite a los tutores gestionar sus reservas e incidencias 
          de forma sencilla y rápida.
        </p>
      </div>

      <div class="info">
        <h2>¿Qué puedes hacer?</h2>
        <p>
          Dentro de la app podrás cancelar, mover o hacer reservas de nuestros servicios. 
          También podrás comunicarte con los profesionales.
        </p>
      </div>

      <div class="info">
        <h2>Más información sobre Atemtia</h2>
        <p>
          Si quieres saber más información sobre Atemtia y sus servicios, visita nuestra página web.
        </p>
        <button class="boton-web-atemtia" @click="redirigirAWeb">
          Más información
        </button>
      </div>
    </section>

    <button 
    class="boton-scroll-top" 
    :class="{ mostrar: mostrarBotonScroll }" 
    @click="scrollToTop">
    ↑
  </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mostrarBotonScroll: false,
    };
  },
  methods: {
    redirigirAWeb() {
      window.location.href = "https://espacioatemtia.es/";
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    handleScroll() {
      this.mostrarBotonScroll = window.scrollY > 100;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
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
  display: inline-block;
  text-decoration: none;
  padding: 10px 15px;
  font-size: 19px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, 
              transform 0.2s ease, box-shadow 0.3s ease;
  background-color: $color-boton;
  color: $color-fondo;
  overflow: hidden;

  &:hover {
    background-color: $color-secundario;
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
}

.boton-web-atemtia {
  margin-top: 20px;
  background-color: $color-boton;
  color: $color-fondo;
  
  overflow: hidden;

  &:hover {
    background-color: $color-secundario;
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
}


.info-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
  }
}


.info {
  flex: 1;
  background-color: $color-principal;
  color: $color-fondo;
  padding: 40px 20px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 24px;
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

  @media (min-width: 1024px) {
    padding: 40px;
    max-width: 33%;
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
  transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  visibility: hidden;
}

.boton-scroll-top.mostrar {
  opacity: 1;
  visibility: visible;
}

.boton-scroll-top:active,
.boton-scroll-top:focus {
  background-color: $color-boton;
}
</style>
