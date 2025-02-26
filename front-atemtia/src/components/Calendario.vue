<script setup lang="ts">
import { useCalendario } from '../ts/calendario';

const { contenedor, nav, btn, abrirCalendario, cambiarDia, fechaActual, actividadesDelDia } = useCalendario();
</script>

<template>
  <div ref="contenedor" class="calendario-desplegable">
    <button ref="btn" class="btn-calendario" @click="abrirCalendario">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" class="svg-icon">
        <g stroke-width="2" stroke-linecap="round" stroke="#fff">
          <rect y="5" x="4" width="16" rx="2" height="16"></rect>
          <path d="m8 3v4"></path>
          <path d="m16 3v4"></path>
          <path d="m4 11h16"></path>
        </g>
      </svg>    
    </button>

    <nav ref="nav" class="nav-calendario">
      <div class="nav-calendario-header">
        <h2>Mi agenda</h2>
        <div class="nav-controls">
          <button @click="cambiarDia(-1)">‹</button>
          <span>{{ fechaActual.toLocaleDateString("es-ES") }}</span>
          <button @click="cambiarDia(1)">›</button>
        </div>
      </div>

      <div class="nav-calendario-content">
        <!-- Mostrar las actividades dinámicamente -->
        <div v-if="actividadesDelDia.length === 0">
          <p>No hay actividades para este día.</p>
        </div>
        <div v-else>
          <div v-for="(actividad, index) in actividadesDelDia" :key="index" class="agenda-item">
            <div class="time">{{ actividad.hora }}</div>
            <div class="details">
              <div class="title">{{ actividad.titulo }}</div>
              <div class="location">{{ actividad.ubicacion }}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

  

<style lang="scss">
@import '../assets/styles/variables.scss';
// Botón de calendario
.calendario-desplegable {
    position: relative;

    .btn-calendario {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 9px 12px;
        gap: 8px;
        height: 40px;
        width: 50px;
        border: none;
        margin-top: 12px;
        background: $color-secundario;
        border-radius: 20px;
        cursor: pointer;
        right: 4%;
        z-index: 1001;
        transition: right 0.5s ease-out; 
        
        &:hover {
            background: $color-principal;

            .svg-icon {
                animation: slope 1s linear infinite;
            }
        }
        
        &.disabled {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .nav-calendario {
        position: fixed;
        top: 1px;
        right: -56%;
        width: 56%;
        height: 100%;
        margin-top: 101px;
        background: $color-fondo;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
        transition: right 0.5s ease-out; 
        z-index: 2000;
        display: flex;
        flex-direction: column;
        padding: 1.5rem;

        &-header {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;

            h2 {
                margin: 0;
                color: $color-principal;
                font-size: 1.5rem;
                margin-left: 20px;
            }

            .nav-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                button {
                    background: none;
                    border: none;
                    color: $color-secundario;
                    cursor: pointer;
                    font-size: 1.5rem;
                    padding: 0.5rem;
                    
                    &:hover {
                        color: $color-principal;
                    }
                }

                span {
                    color: #333;
                    font-size: 1rem;
                }
            }
        }

        &-content {
            .agenda-item {
                display: flex;
                margin-bottom: 1.5rem;
                
                .time {
                    min-width: 60px;
                    color: #333;
                    font-weight: bold;
                }
                
                .details {
                    margin-left: 1rem;
                    padding-left: 1rem;
                    border-left: 2px solid $color-secundario;
                    
                    .title {
                        color: #333;
                        margin-bottom: 0.25rem;
                        font-weight: 500;
                    }
                    
                    .location {
                        color: #666;
                        font-size: 0.9rem;
                    }
                }
            }
        }

        &.active {
            right: 0;
            margin-top: 101px;
        }
    }

    &.active {
        .btn-calendario {
            right: 58%;
        }
    }
}

// Animación del icono del calendario
@keyframes slope {
  0% {}

  50% {
    transform: rotate(10deg);
  }

  100% {}
}
@media (min-width: 768px) {
  .calendario-desplegable {
    .btn-calendario {
      display: none; 
    }

    .nav-calendario {
      position: fixed;
      top: 10%; // Ajusta la posición vertical
      right: 10px; // Separa un poco del borde derecho
      width: 15%; // Reduce el ancho
      height: 100vh; // Reduce la altura al 80% de la pantalla
      margin-top: 0;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
      transition: none; 
      z-index: 2000;
      display: flex;
      flex-direction: column;
      padding: 1rem; // Reduce el padding
      border-radius: 10px; 
    }

    &.active {
      .btn-calendario {
        display: none;
      }
    }
  }
}

</style> 
