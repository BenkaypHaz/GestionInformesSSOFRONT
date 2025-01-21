<script setup>
import { ref, watch, defineProps,defineEmits,computed,toRefs  } from 'vue';
import { PresupuestoCuentasService } from '@/services/PresupuestoCuentaService';
import { mdiTrashCan,mdiClose } from '@mdi/js';
import BaseButton from './BaseButton.vue';
import BaseButtons from './BaseButtons.vue';
import Swal from 'sweetalert2';
import BaseIcon from './BaseIcon.vue';
import { emit, on } from '@/javascript/eventBus.js';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  ejecucionesParciales: {
    type: Array,
    default: () => []
  },
  idEntry: {
    type: Number,
    default: 1
  },
  tipoPresu: {
    type:Number,
    required:false
  }
});

const visible = ref(props.modelValue);
const tableData = ref([...props.ejecucionesParciales]);
const emision = defineEmits(['update:modelValue', 'entry-deleted']);
const { tipoPresu } = toRefs(props);

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

watch(() => props.ejecucionesParciales, (newVal) => {
  tableData.value = [...newVal];
});

const close = () => {
  visible.value = false;
  emision('update:modelValue', false)
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value.replace(/,/g, ''));
  }
  
  value = value.toFixed(2);

  return `Lps.${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const confirmRemoveEntry = (index) => {
  Swal.fire({
    title: "<h3 style='color:white'>¿Está seguro de eliminar esto?</h3>",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f7a0d',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar.',
    cancelButtonText: 'No, cancelar.',
    background: '#181c2c'
  }).then((result) => {
    if (result.isConfirmed) {
      desactivarEjeParcial(index);
    }
  });
};

async function desactivarEjeParcial(id) {
  try {
    await PresupuestoCuentasService.desactivarEjecucionParcial(id);
    Swal.fire({
      title: "<h3 style='color:white'>¡Eliminado!</h3>",
      html: "<h1 style='color:white'>La entrada ha sido eliminada</h1>",
      icon: 'success',
      background: '#181c2c'
    });
    emision('parcialActualizada');
    await refreshTableData(props.idEntry);

    } catch (error) {
    console.error('Failed to fetch presupuesto:', error.message);
  }
}

const refreshTableData = async (id) => {
  try {
    const response = await PresupuestoCuentasService.getSummaryCuenta(id);
    if (response.success) {
      tableData.value = response.data.ejecucionesParciales;
    } else {
      console.error('Failed to fetch summary:', response.message);
    }
  } catch (error) {
    console.error('Error fetching summary:', error.message);
  }
};

const columnaTitulo = computed(() => {
  return tipoPresu.value === 1 ? 'Proveedor' : 'Servicio';
});

const labelFecha = computed(() => {
  return tipoPresu.value === 1 ? 'Fecha Compra' : 'Fecha Recibido';
});

</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="modal-container shadow-lg bg-[#141c2f] rounded-lg p-4 overflow-visible">
      <div class="modal-header flex justify-center items-center mb-4">
        <h2 class="text-gradient text-2xl font-semibold">{{ title }}</h2>
        <button class="close-button text-white" @click="close">
          <BaseIcon :path="mdiClose" size="24" />
        </button>
      </div>
      <div class="modal-body flex space-x-4 h-full">
        <div class="table-container overflow-y-auto p-4">
          <table class="table-auto w-full text-white mb-4">
            <thead>
              <tr>
                <th class="px-4 py-2">{{ columnaTitulo }}</th>
                <th class="px-4 py-2">Observaciones</th>
                <th class="px-4 py-2">Cantidad</th>
                <th class="px-4 py-2">{{ labelFecha }}</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id_ejecupar">
                <td class="border px-4 py-2">{{ item.proveedorName }}</td>
                <td class="border px-4 py-2">{{ item.observaciones }}</td>
                <td class="border px-4 py-2">{{ formatCurrency(item.cantidad) }}</td>
                <td class="border px-4 py-2">{{ formatDate(item.fecha_compra) }}</td>
                <td class="center-text">
                <BaseButtons  v-if="!item.bloqueado" type="justify-center" no-wrap>
                  <BaseButton color="danger" :icon="mdiTrashCan" small @click="confirmRemoveEntry(item.id_ejecupar)" />
                </BaseButtons>
              </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="components-container overflow-y-auto p-4 flex-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  width: 90vw; /* Adjust the width as needed */
  max-height: 90vh; /* Adjust the height as needed */
  overflow-y: auto;
  background-color: #141c2f;
}

.modal-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem; /* Padding to ensure space on the sides */
}

.modal-body {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  height: 70vh; /* Ensure the modal body has sufficient height */
}

.table-container {
  width: 65%; /* Adjust the table container width */
  border-right: 1px solid #2d3748;
}

.components-container {
  width: 35%; /* Adjust the components container width */
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
}

.vdp-datepicker {
  z-index: 10000; /* Ensure the date picker is on top of other elements */
  position: relative;
}

.close-button {
  position: absolute;
  right: 1rem; /* Align to the right edge with some padding */
  top: 50%;
  transform: translateY(-50%);
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 0px; /* Fixed width */
  height: 30px; /* Fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  opacity: 0.8;
  transition: 0.2s;
}

.close-button:hover {
  opacity: 0.8;
}
</style>

