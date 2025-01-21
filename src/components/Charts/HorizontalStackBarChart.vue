<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import {
  Chart,
  BarElement,
  BarController,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title
} from 'chart.js';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // Para hacer las barras horizontales
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      },
      plugins: {
        tooltip: {
          enabled: true
        },
        title: {
          display: true,
          text: 'Presupuesto Asignado vs Ejecutado por Departamento'
        }
      }
    })
  }
});

const root = ref(null);
let chart;

// Registrar los componentes necesarios de Chart.js
Chart.register(BarElement, BarController, LinearScale, CategoryScale, Tooltip, Title);

const createChart = () => {
  if (chart) {
    chart.destroy(); // Destruye el gráfico existente
  }
  chart = new Chart(root.value, {
    type: 'bar',
    data: props.data,
    options: props.options
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
    chart.destroy();
  }
});
</script>

<template>
  <canvas ref="root"></canvas>
</template>
