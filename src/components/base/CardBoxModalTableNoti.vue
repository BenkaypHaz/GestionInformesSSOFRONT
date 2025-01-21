<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, computed } from 'vue';
import { userService } from '@/services/UsuariosService';
import { mdiCheckCircle, mdiAlertCircle,mdiClose } from '@mdi/js'; 
import BaseButton from './BaseButton.vue';
import BaseButtons from './BaseButtons.vue';
import Swal from 'sweetalert2';
import { on, emit } from '@/javascript/eventBus'; 
import permissionsStore from '@/stores/stores';
import BaseIcon from './BaseIcon.vue';

const user = computed(() => permissionsStore.getUser());

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const visible = ref(props.modelValue);
const tableData = ref([]);
const emision = defineEmits(['update:modelValue', 'entry-deleted']);

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    dataTable();
  }
});

const close = () => {
  visible.value = false;
  emision('update:modelValue', false);
};

const dataTable = async () => {
  try {
    const response = await userService.getNotificacionesUsuario(user.value.idUsuario);
    if (response.success) {
      tableData.value = response.data;
    } else {
      console.error('Failed to fetch summary:', response.message);
    }
  } catch (error) {
    console.error('Error fetching summary:', error.message);
  }
};

const marcarComoLeidos = async () => {
  try {
    const ids = tableData.value.map(item => item.idNoti);
    const response = await userService.marcarNotificacionesLeidas(ids);
    if (response.success) {
      Swal.fire({
        title: "<h3 style='color:white'>" + '¡Éxito!' + "</h3>",
        html:  "<h1 style='color:white'>" + 'Las notificaciones se marcaron como leídas.' + "</h1>",
        icon: "success",
        background: '#181c2c',
      });
      emit('update-notifications');
      dataTable(); 
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error"
    });
  }
};
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="close">
    <div class="modal-container shadow-lg bg-[#141c2f] rounded-lg p-4 overflow-visible lg:max-w-4xl w-full lg:w-auto lg:max-h-[90vh]">
      <div class="modal-header flex items-center mb-4">
        <h2 class="text-gradient text-2xl font-semibold">{{ title }}</h2>
    
        <button class="mark-read-button absolute left-1/2 transform -translate-x-1/2" @click="marcarComoLeidos">
          Marcar como Leídos
        </button>

        <button class="close-button text-white" @click="close">
          <BaseIcon :path="mdiClose" size="24" />
        </button>
      </div>
      <div class="modal-body flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full">
        <div class="table-container overflow-y-auto p-4 lg:max-h-[70vh]">
          <table class="table-auto w-full text-white mb-4">
            <thead>
              <tr>
                <th class="px-4 py-2">Modificación</th>
                <th class="px-4 py-2">Leída</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.idNoti">
                <td data-label="Modificación"  class="border px-2 py-1 lg:px-4 lg:py-2 text-left">{{ item.modificacion }}</td>
                <td data-label="Leída"  class="border px-2 py-1 lg:px-4 lg:py-2 text-left">
                  <BaseIcon :path="item.leida ? mdiCheckCircle : mdiAlertCircle" size="24" :class="item.leida ? 'text-green-500' : 'text-yellow-500'" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.modal-container {
  width: 100%; 
  height: 100%; 
  max-width: 90vw; 
  max-height: 90vh; 
  overflow-y: auto;
  background-color: #141c2f;
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensure other elements stay on the sides */
}

.modal-header h2 {
  position: relative;
  left: 25px; /* Adjust this value to control the title position */
  top: 50%;
  transform: translateY(-50%);
  margin-right: auto; /* Pushes other content (like the button) away */
}

.mark-read-button {
  position: absolute;
  left: 53%;
  transform: translateX(-50%);
}

.close-button {
  position: relative;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: auto; /* Ensure the button stays on the right */
  color: #ffffff;
  padding: 0;
  margin: 0;
  width: 30px; /* Set a fixed width */
  height: 30px; /* Set a fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
}


.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-container {
  width: 100%; /* Adjust the table container width */
}

button:hover {
  opacity: 1;
}

button:active {
  top: 4px;
  box-shadow: #1d2566 0px 3px 2px, #000 0px 3px 5px;
}

/* Specific styles for mark-read button */
.mark-read-button {
  background-color: #1d2566;
  color: #ffffff;
  border-radius: 5px;
  padding: 0 10px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: #151c52 0px 7px 2px, #000 0px 8px 5px;
}

.mark-read-button:hover {
  background-color: #1a3d7c;
}

@media (max-width: 768px) {
  .mark-read-button {
    width: 100%;
  }

  .modal-container {
    padding: 16px;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-body {
    flex-direction: column;
  }

  .table-container {
    padding: 8px;
  }

  h2 {
    font-size: 1rem; /* Adjust title font size */
  }

  th, td {
    font-size: 0.775rem; /* Adjust table font size */
    padding: 8px; /* Adjust padding for table cells */
  }

  button {
    font-size: 10px; /* Adjust button text size */
    height: 36px; /* Adjust button height */
  }
}
</style>
