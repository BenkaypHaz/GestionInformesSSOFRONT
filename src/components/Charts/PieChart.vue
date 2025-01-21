<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  Chart,
  PieController,
  ArcElement,
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

// Register required components from Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);

// Function to initialize the chart
const initializeChart = () => {
  if (chart) chart.destroy();  // Destroy existing chart instance if any

  chart = new Chart(root.value, {
    type: 'pie',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 16,
              weight: 'bold',
            },
            color: '#ffffff',
            padding: 20,
          }
        },
        tooltip: {
          enabled: true,
          titleFont: {
            size: 18,
            weight: 'bold',
          },
          bodyFont: {
            size: 18,
            weight: 'bold',
          },
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.raw !== null) {
                label += context.raw;
              }
              return label;
            }
          }
        }
      },
      ...props.options
    }
  });
};

onMounted(() => {
  initializeChart();
});

watch(
  () => props.data,
  (newData) => {
    initializeChart();  // Reinitialize the chart with the new data
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();  // Clean up the chart instance before unmounting
  }
});
</script>

<template>
  <canvas ref="root"></canvas>
</template>
