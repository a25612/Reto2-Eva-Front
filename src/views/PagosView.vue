<script setup lang="ts">
import { onMounted } from 'vue';
import { usePagosStore } from '../stores/pagos';

const pagosStore = usePagosStore();

onMounted(() => {
  pagosStore.fetchPagos();
});


const toggleFormDelete = async (pagoId: number) => {
  try {
    // Confirmar la acción de eliminación
    const confirmation = confirm('¿Estás seguro de eliminar este pago?');
    if (confirmation) {
      await pagosStore.deletePago(pagoId); 
    }
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
  }
};
</script>



<template>
    <div class="pagos">
      <h2 class="pagos__titulo">Historial de Pagos</h2>
  
      <div v-if="pagosStore.cargando" class="mensaje">Cargando Pagos...</div>
  
      <div v-if="pagosStore.error" class="mensaje error">{{ pagosStore.error }}</div>
  
      <div v-if="!pagosStore.cargando && !pagosStore.error" class="pagos__lista">
        <div v-for="pago in pagosStore.pagos" :key="pago.id" class="pago-card">
          <h3>{{ pago.usuarioId }}</h3>
          <p><strong>Precio Pagado:</strong> {{ pago.monto }} €</p>
  
          <!-- Usar la propiedad 'fecha' que ya has mapeado correctamente -->
          <p><strong>Fecha de Pago:</strong> 
            {{ pago.fecha.toLocaleDateString("es-ES") }} 
            {{ pago.fecha.toLocaleTimeString("es-ES") }}
          </p>
  
          <p><strong>Estado del Pago:</strong> {{ pago.estado === 'COMPLETADO' ? "Completado" : "Pendiente" }}</p>
  
          <!-- Botón para eliminar el pago -->
          <button class="servicios__boton" @click="toggleFormDelete(pago.id)">
            Eliminar Servicio
          </button>
        </div>
      </div>
  
      <div v-if="pagosStore.pagos.length === 0 && !pagosStore.cargando && !pagosStore.error">
        <p>No hay pagos registrados.</p>
      </div>
    </div>
  </template>
  
  
  

<style lang="scss" >
@import '../assets/styles/variables.scss';

.pagos {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  &__titulo {
    font-size: 24px;
    margin-bottom: 20px;
    color: $color-titulos;
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .pago-card {
      padding: 15px;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
      background-color: #fff;

      h3 {
        font-size: 20px;
        margin-bottom: 10px;
        color: $color-secundario;
      }

      p {
        margin-bottom: 5px;
        color: #333;

        strong {
          color: $color-titulos;
        }
      }
    }
  }

  .mensaje {
    font-size: 16px;
    color: #333;

    &.error {
      color: red;
    }
  }

  .servicios__boton {
    display: inline-block;
    text-align: center;
    background-color: red;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: darken($color-boton, 10%);
      transform: scale(1.05);
    }

    &:active {
      transform: scale(1);
    }
  }
}
</style>


