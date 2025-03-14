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

  return {
    pagos,
    fetchPagos,
    deletePago,
  };
});
