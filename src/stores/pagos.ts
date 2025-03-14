import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Pago {
  id: number;
  usuario: string;
  monto: number;
  metodoPago: string;
  fecha_pago: string;
  estado: string;
}

export const usePagosStore = defineStore('pagos', () => {
  const pagos = ref<Pago[]>([]);

  const fetchPagos = async () => {
    try {
      const response = await fetch('https://localhost:7163/api/Pago');
      if (!response.ok) {
        throw new Error('Error al obtener los pagos');
      }

      const data = await response.json();
      pagos.value = data.map((pago: any) => ({
        ...pago,
        fecha: new Date(pago.fecha_Pago),
      }));
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
    }
  };

  const deletePago = async (pagoId: number) => {
    try {
      const response = await fetch(`https://localhost:7163/api/Pago/${pagoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el pago');
      }

      pagos.value = pagos.value.filter(pago => pago.id !== pagoId);
    } catch (error) {
      console.error('Error al eliminar el pago:', error);
    }
  };

  const addPago = async (nuevoPago: Pago) => {
    try {
      // Si no tiene fecha, asigna la fecha actual
      if (!nuevoPago.fecha_pago) {
        const fechaActual = new Date();
        nuevoPago.fecha_pago = fechaActual.toISOString(); // Envía la fecha en formato ISO
      }

      console.log('Pago que se va a agregar:', JSON.stringify(nuevoPago, null, 2));

      const response = await fetch('https://localhost:7163/api/Pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iD_USUARIO: nuevoPago.usuario,
          iD_SESION: nuevoPago.metodoPago, 
          monto: nuevoPago.monto,
          metodo_Pago: nuevoPago.metodoPago,
          fecha_Pago: nuevoPago.fecha_pago, 
          estado: nuevoPago.estado,
        }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        console.error('Error al agregar el pago:', responseBody);
        throw new Error(responseBody.message || 'No se pudo agregar el pago');
      }

      console.log('Pago agregado exitosamente:', responseBody);

      pagos.value.push({
        ...responseBody,
        fecha: new Date(responseBody.fecha_Pago),  // Convierte la fecha de respuesta en Date
      });
    } catch (error: any) {
      console.error('Error al agregar el pago:', error.message || error);
    }
  };

  return {
    pagos,
    fetchPagos,
    deletePago,
    addPago,
  };
});
