<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import {
  Chart,
  BarElement,
  BarController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
});

const root = ref(null);
let chart;

// Registrar los componentes necesarios de Chart.js
Chart.register(BarElement, BarController, LinearScale, CategoryScale, Tooltip, Legend);

const createChart = () => {
  if (chart) {
    chart.destroy(); // Destruye el gráfico existente si ya hay uno
  }

  chart = new Chart(root.value, {
    type: 'bar',
    data: props.data,
    options: {
      responsive: true,
      indexAxis: 'y', // Configura las barras como horizontales
      maintainAspectRatio: false,
      ...props.options
    }
  });
};

onMounted(createChart);

watch(
  () => props.data,
  (newData) => {
    createChart(); // Recrea el gráfico completamente en cada cambio de datos
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy(); // Limpia el gráfico antes de desmontarlo
  }
});
</script>

<template>
  <canvas ref="root"></canvas>
</template>
