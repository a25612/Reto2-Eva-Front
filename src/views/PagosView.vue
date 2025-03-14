<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePagosStore } from '../stores/pagos';

const pagosStore = usePagosStore();
const showAddForm = ref(false);
const nuevoPago = ref({
  usuario: '',
  monto: 0,
  metodoPago: '',
  fecha_pago: '',
  estado: ''
});

// Cargar pagos al montar el componente
onMounted(() => {
  pagosStore.fetchPagos();
});

// Toggle para mostrar y ocultar el formulario de agregar pago
const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

// Función para agregar un nuevo pago
const addPago = async () => {
  try {
    // Validación básica para evitar enviar datos vacíos
    if (!nuevoPago.value.usuario || nuevoPago.value.monto <= 0 || !nuevoPago.value.metodoPago || !nuevoPago.value.estado) {
      console.error('Por favor complete todos los campos.');
      return;
    }

    // Asignar fecha actual si no está presente
    if (!nuevoPago.value.fecha_pago) {
      nuevoPago.value.fecha_pago = new Date().toISOString();
    }

    console.log('Nuevo pago a agregar:', nuevoPago.value);

    // Agregar el pago
    await pagosStore.addPago({
      ...nuevoPago.value
    });

    // Limpiar el formulario después de agregar el pago
    nuevoPago.value = {
      usuario: '',
      monto: 0,
      metodoPago: '',
      fecha_pago: '',
      estado: ''
    };

    // Ocultar el formulario de agregar pago
    showAddForm.value = false;

    // Agregar mensaje de éxito
    alert('Pago agregado correctamente');

  } catch (error) {
    console.error('Error al agregar el pago:', error);
    alert('Hubo un error al agregar el pago');
  }
};

// Función para eliminar un pago
const toggleFormDelete = async (pagoId: number) => {
  try {
    const confirmation = confirm('¿Estás seguro de eliminar este pago?');
    if (confirmation) {
      await pagosStore.deletePago(pagoId);
      alert('Pago eliminado correctamente');
    }
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
    alert('Hubo un error al eliminar el pago');
  }
};
</script>

<template>
  <div class="pagos">
    <h2 class="pagos__titulo">Historial de Pagos</h2>

    <!-- Mostrar estado de carga y error -->
    <div v-if="pagosStore.cargando" class="mensaje">Cargando Pagos...</div>
    <div v-if="pagosStore.error" class="mensaje error">{{ pagosStore.error }}</div>

    <!-- Mostrar la lista de pagos -->
    <div v-if="!pagosStore.cargando && !pagosStore.error" class="pagos__lista">
      <div v-for="pago in pagosStore.pagos" :key="pago.id" class="pago-card">
        <h3>{{ pago.usuarioId }}</h3>
        <p><strong>Precio Pagado:</strong> {{ pago.monto }} €</p>
        <p><strong>Fecha de Pago:</strong> {{ pago.fecha.toLocaleDateString("es-ES") }} {{ pago.fecha.toLocaleTimeString("es-ES") }}</p>
        <p><strong>Estado del Pago:</strong> {{ pago.estado === 'COMPLETADO' ? "Completado" : "Pendiente" }}</p>

        <button class="servicios__boton" @click="toggleFormDelete(pago.id)">Eliminar Pago</button>
      </div>
    </div>

    <!-- Formulario para agregar un nuevo pago -->
    <div v-if="showAddForm" class="add-pago-form">
      <h3>Agregar Nuevo Pago</h3>
      <div>
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" v-model="nuevoPago.usuario" placeholder="Nombre del usuario" />

        <label for="monto">Monto (€)</label>
        <input type="number" id="monto" v-model="nuevoPago.monto" placeholder="Monto" />

        <label for="metodoPago">Método de Pago</label>
        <input type="text" id="metodoPago" v-model="nuevoPago.metodoPago" placeholder="Método de pago" />

        <label for="estado">Estado</label>
        <select id="estado" v-model="nuevoPago.estado">
          <option value="PENDIENTE">Pendiente</option>
          <option value="COMPLETADO">Completado</option>
        </select>

        <button @click="addPago">Agregar Pago</button>
        <button @click="toggleAddForm">Cancelar</button>
      </div>
    </div>

    <!-- Botón para mostrar el formulario de agregar pago -->
    <div v-if="!showAddForm">
      <button @click="toggleAddForm" class="servicios__boton">Agregar Pago</button>
    </div>

    <!-- Mensaje si no hay pagos -->
    <div v-if="pagosStore.pagos.length === 0 && !pagosStore.cargando && !pagosStore.error">
      <p>No hay pagos registrados.</p>
    </div>
  </div>
</template>

  
  

<style lang="scss">
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

  .add-pago-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;

    label {
      font-size: 16px;
    }

    input, select {
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button {
      margin-top: 10px;
      background-color: green;
      color: white;
      font-size: 16px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      
      &:hover {
        background-color: darkgreen;
        transform: scale(1.05);
      }

      &:active {
        transform: scale(1);
      }
    }
  }
}
</style>
