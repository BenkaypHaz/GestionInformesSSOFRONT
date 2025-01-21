<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import {
  Chart,
  RadarController,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Filler
} from 'chart.js';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const root = ref(null);
let chart;

// Register the necessary Chart.js components
Chart.register(
  RadarController,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Filler
);

onMounted(() => {
  chart = new Chart(root.value, {
    type: 'radar',
    data: props.data,
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          display: true // You can change this to false if you do not want to show legends
        },
        tooltip: {
          enabled: true
        },
        filler: {
          propagate: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
});

const chartData = computed(() => props.data);

watch(chartData, (data) => {
  if (chart) {
    chart.data = data;
    chart.update();
  }
});
</script>

<template>
  <canvas ref="root"></canvas>
</template>
