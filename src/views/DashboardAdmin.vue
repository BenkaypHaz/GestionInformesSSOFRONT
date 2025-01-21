<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiReload,
  mdiGithub,
  mdiChartPie,
  mdiCash,
  mdiCashClock,
  mdiCashCheck
} from '@mdi/js';
import HorizontalStackBarChart from '../components/Charts/HorizontalStackBarChart.vue';
import HorizontalBarChart from '../components/Charts/HorizontalBarChart.vue';
import BarChart from '../components/Charts/BarChart.vue';
import PieChart from '../components/Charts/PieChart.vue';
import SectionMain from '../components/layouts/SectionMain.vue';
import LayoutAuthenticated from '../components/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '../components/layouts/SectionTitleLineWithButton.vue';
import CardBoxWidget from '../components/base/CardBoxWidget.vue';
import CardBoxChar from '@/components/base/CardBoxChar.vue';
import permissionsStore from '@/stores/stores';
import FormControlDashBoard from '../components/forms/FormControlDashBoard.vue';
import { userService } from '@/services/UsuariosService';
import YearPicker from '@/components/forms/YearPicker.vue';

const yearOptions = ref([2024, 2025, 2026]);
const selectedYear = ref(null);
const isPanelToggled = ref(true);
const selectedOption = ref(0);
const tipoPresu = ref(1);
const total = ref(0);
const disponible = ref(0);
const utilizado = ref(0);
const summary = ref({});
const summaryDepto = ref({});
const departamentosOptions = ref([{ id: 0, label: 'Informe General' }]);
const user = computed(() => permissionsStore.getUser());
const userRol = computed(() => user.value?.idRol || null);
const idDepto = computed(() => user.value?.idDepartamento || null);

// Data Objects for Charts
const stackedBarDataPresupuestoPorDepartamento = ref({
  labels: [],
  datasets: [
    { label: 'Total Ejecutado', data: [], backgroundColor: '#19b9b6' },
    { label: 'Restante', data: [], backgroundColor: '#137876' }
  ]
});

const barDataAnualPresupuesto = ref({
  labels: [],
  datasets: [
    { label: 'Presupuesto', data: [], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }
  ]
});

const barDataPresupuestoPorDepartamento = ref({
  labels: [],
  datasets: [
    {
      label: 'Presupuesto',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BC0C0', '#9966FF', '#FF6384', '#36A2EB']
    }
  ]
});

const pieDataEjecutadas = ref({
  labels: ['Disponible', 'Ejecutado'],
  datasets: [
    {
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      hoverBorderColor: '#000',
      hoverBorderWidth: 3,
    },
  ],
});

// Chart Options
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          label += new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(context.raw).replace('HNL', 'Lps.');
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
          }).format(value);
        }
      }
    }
  }
};const stackedBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          label += new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(context.raw).replace('HNL', 'Lps.');
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
          }).format(value);
        }
      }
    },
    y: {
      stacked: true
    }
  }
};
const horizontalBarChartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          label += new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(context.raw).replace('HNL', 'Lps.');
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
          }).format(value);
        }
      }
    }
  }
};const pieChartOptions = {
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
        label: function (context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.raw !== null) {
            const formattedValue = new Intl.NumberFormat('es-HN', {
              style: 'currency',
              currency: 'HNL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(context.raw);

            label += formattedValue.replace("HNL", "Lps.");
          }
          return label;
        }
      }
    }
  }
};

// Fetch Functions
const fetchAnualPresupuestoData = async (year) => {
  try {
    const response = await DashboardService.GetAnualPresupuestos(tipoPresu.value, year);
    const data = response.data;
    barDataAnualPresupuesto.value.labels = data.map(item => item.anio);
    barDataAnualPresupuesto.value.datasets[0].data = data.map(item => item.cantidad);
  } catch (error) {
    console.error('Error fetching annual budget data:', error);
  }
};

const fetchBarChartData = async (year) => {
  try {
    const response = await DashboardService.fetchBarChartData(year,tipoPresu.value);
    const departments = response.data;
    barDataPresupuestoPorDepartamento.value.labels = departments.map(dept => dept.nombre);
    barDataPresupuestoPorDepartamento.value.datasets[0].data = departments.map(dept => dept.totalCantidad);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
  }
};

const fetchSummary = async (tipopresu, year) => {
  try {
    const response = await DashboardService.GetSummaryByTipo(tipopresu, year);
    summary.value = response.data;
    total.value = summary.value.presupuesto;
    disponible.value = summary.value.disponible;
    utilizado.value = summary.value.gastado;
    pieDataEjecutadas.value.datasets[0].data = [disponible.value, utilizado.value];
  } catch (error) {
    console.error("Failed to fetch summary:", error);
  }
};

const fetchSummaryDepto = async (idDepto, tipoPresu, year) => {
  try {
    const response = await DashboardService.getSummaryByIdDepto(idDepto, tipoPresu, year);
    summaryDepto.value = response.data;
    total.value = summaryDepto.value.presupuesto;
    disponible.value = summaryDepto.value.disponible;
    utilizado.value = summaryDepto.value.gastado;
    pieDataEjecutadas.value.datasets[0].data = [disponible.value, utilizado.value];
  } catch (error) {
    console.error("Failed to fetch summary:", error);
  }
};

const fetchDepartamentos = async () => {
  try {
    const departamentos = await userService.getDepartamentos();
    departamentosOptions.value = [{ id: 0, label: 'Informe General' }, ...departamentos.data.map(cat => ({
      id: cat.idDepartamento,
      label: cat.nombre
    }))];
    selectedOption.value = departamentosOptions.value[0].id;
    handleOptionChange(selectedOption.value);
  } catch (error) {
    console.error("Fallo al buscar los departamentos:", error.message);
  }
};

const GetStatsDepartamento = async (year) => {
  try {
    const response = await DashboardService.GetStatsDepartamentos(year, tipoPresu.value);
    const data = response.data;
    stackedBarDataPresupuestoPorDepartamento.value.labels = data.map(dept => dept.departamento);

    if (isPanelToggled.value) {
      // En modo Egresos, la resta funciona normalmente
      stackedBarDataPresupuestoPorDepartamento.value.datasets[0].data = data.map(dept => dept.totalEjecutado);
      stackedBarDataPresupuestoPorDepartamento.value.datasets[1].data = data.map(dept => dept.totalAsignado - dept.totalEjecutado);
    } else {
      // En modo Ingresos, evitar valores negativos mostrando el excedente como positivo
      stackedBarDataPresupuestoPorDepartamento.value.datasets[0].data = data.map(dept => dept.totalEjecutado);
      stackedBarDataPresupuestoPorDepartamento.value.datasets[1].data = data.map(dept => {
        const restante = dept.totalAsignado - dept.totalEjecutado;
        return restante < 0 ? 0 : restante; // Mostrar 0 en lugar de negativo si hay excedente
      });

      // Añadir dataset opcional para "Ingreso Extra" si se ha superado el presupuesto
      stackedBarDataPresupuestoPorDepartamento.value.datasets[2] = {
        label: 'Ingreso Extra',
        data: data.map(dept => Math.max(dept.totalEjecutado - dept.totalAsignado, 0)),
        backgroundColor: '#FFD700' // Color distintivo para "Ingreso Extra"
      };
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};


// Computed Properties
const labelTrend2 = computed(() => {
  return summaryDepto.value.ingresoExtra || summary.value.ingresoExtra ? 'Ingreso Extra Recibido' : 'Ingreso por Ejecutar';
});

const prefix = computed(() => (summaryDepto.value.ingresoExtra || summary.value.ingresoExtra ? '+Lps.' : 'Lps.'));

// Watchers
watch(isPanelToggled, (newVal) => {
  tipoPresu.value = newVal ? 1 : 2;
  if (userRol.value === 1) {
    selectedOption.value = 0;
    handleOptionChange(selectedOption.value);
    fetchSummary(tipoPresu.value, selectedYear.value);
  } else {
    fetchSummaryDepto(idDepto.value, tipoPresu.value, selectedYear.value);
  }
});

watch(selectedYear, async (newYear) => {
  // Re-fetch data for each chart when the year changes
  await fetchAnualPresupuestoData(newYear);
  await fetchBarChartData(newYear);
  await fetchSummary(tipoPresu.value, newYear);
  await GetStatsDepartamento(newYear);
  if (userRol.value !== 1) {
    await fetchSummaryDepto(idDepto.value, tipoPresu.value, newYear);
  }
});

watch(tipoPresu, async () => {
  await GetStatsDepartamento(selectedYear.value);
});

watch(isPanelToggled, async (newVal) => {
  tipoPresu.value = newVal ? 1 : 2;

  selectedYear.value = yearOptions.value[0];
  
    selectedOption.value = 0;
    handleOptionChange(selectedOption.value);
    await fetchSummary(tipoPresu.value, selectedYear.value);
 
  await fetchAnualPresupuestoData(selectedYear.value);
  await fetchBarChartData(selectedYear.value);
  await GetStatsDepartamento(selectedYear.value);
});


// Event Handlers
const handleOptionChange = (newOption) => {
  if (newOption !== undefined && newOption !== null) {
    selectedOption.value = newOption;
    if (userRol.value === 1) {
      selectedOption.value === 0
        ? fetchSummary(tipoPresu.value, selectedYear.value)
        : fetchSummaryDepto(selectedOption.value, tipoPresu.value, selectedYear.value);
    }
  }
};

// Data Loading Functions
const cargarData = async () => {
  if (userRol.value === 1) {
    await fetchSummary(1, selectedYear.value);
  } else {
    await fetchSummaryDepto(idDepto.value, 1, selectedYear.value);
  }
};

// Lifecycle Hooks
onMounted(async () => {
  await fetchBarChartData(selectedYear.value);
  await cargarData();
  await fetchDepartamentos();
  await GetStatsDepartamento(selectedYear.value);
  await fetchAnualPresupuestoData(selectedYear.value);
});

</script>


<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-center mb-6">
        <label class="rocker rocker-large">
          <input type="checkbox" v-model="isPanelToggled">
          <span class="switch-left">Egresos</span>
          <span class="switch-right">Ingresos</span>
        </label>
      </div>

      <div class="flex justify-center mb-6 gap-x-6">
        <YearPicker :options="yearOptions" v-model="selectedYear" defaultLabel="Seleccione Año" />
      </div>

      <div v-if="isPanelToggled">


        <SectionTitleLineWithButton v-if="userRol == 1" :icon="mdiChartPie" title="Estadística Presupuestos (Egreso)">
        </SectionTitleLineWithButton>
        <CardBoxChar v-if="userRol == 1" title="Total Presupuestado por Departamento">
          <HorizontalBarChart v-if="barDataPresupuestoPorDepartamento.labels.length"
            :data="barDataPresupuestoPorDepartamento" :options="horizontalBarChartOptions" class="w-full h-96" />
        </CardBoxChar>
        <br>
        <CardBoxChar title="Presupuesto Asignado vs Ejecutado por Departamento" class="w-full h-96">
          <HorizontalStackBarChart :data="stackedBarDataPresupuestoPorDepartamento" :options="stackedBarChartOptions"
            class="w-full h-96" />
        </CardBoxChar>
        <br>

        <div class="flex flex-wrap lg:flex-nowrap justify-around gap-6">
          <CardBoxChar title="Disponible global vs Ejecutado global" class="w-full lg:w-1/2 chart-box">
            <div class="chart-container">
              <PieChart :data="pieDataEjecutadas" :options="pieChartOptions" class="w-full h-full" />
            </div>
          </CardBoxChar>

          <CardBoxChar title="Presupuesto Anual Asignado" class="w-full lg:w-1/2 chart-box">
            <div class="chart-container">
              <BarChart v-if="barDataAnualPresupuesto.labels.length" :data="barDataAnualPresupuesto"
                :options="barChartOptions" class="w-full h-full" />
            </div>
          </CardBoxChar>
        </div>
      </div>

      <div v-else>
        <SectionTitleLineWithButton v-if="userRol == 1" :icon="mdiChartPie" title="Estadística Presupuestos (Ingreso)">
        </SectionTitleLineWithButton>
        <CardBoxChar v-if="userRol == 1" title="Total Presupuestado por Departamento">
          <HorizontalBarChart v-if="barDataPresupuestoPorDepartamento.labels.length"
            :data="barDataPresupuestoPorDepartamento" :options="horizontalBarChartOptions" class="w-full h-96" />
        </CardBoxChar>
        <br>
        <CardBoxChar title="Presupuesto Asignado vs Ejecutado por Departamento" class="w-full h-96">
          <HorizontalStackBarChart :data="stackedBarDataPresupuestoPorDepartamento" :options="stackedBarChartOptions"
            class="w-full h-96" />
        </CardBoxChar>
        <br>

        <div class="flex flex-wrap lg:flex-nowrap justify-around gap-6">
          <CardBoxChar title="Disponible global vs Ejecutado global" class="w-full lg:w-1/2 chart-box">
            <div class="chart-container">
              <PieChart :data="pieDataEjecutadas" :options="pieChartOptions" class="w-full h-full" />
            </div>
          </CardBoxChar>

          <CardBoxChar title="Presupuesto Anual Asignado" class="w-full lg:w-1/2 chart-box">
            <div class="chart-container">
              <BarChart v-if="barDataAnualPresupuesto.labels.length" :data="barDataAnualPresupuesto"
                :options="barChartOptions" class="w-full h-full" />
            </div>
          </CardBoxChar>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.chart-container {
  height: 400px;
  /* Adjust to your preferred height */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Additional styling for consistent padding and alignment */
.chart-box {
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
}

.rocker {
  display: inline-block;
  position: relative;
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #888;
  width: 11.25em;
  /* Adjusted width for larger text */
  height: 4em;
  overflow: hidden;
  border-bottom: 0.5em solid #eee;
}

.rocker-large {
  font-size: 1.5em;
  margin: 1em;
}

.rocker::before {
  content: "";
  position: absolute;
  top: 0.5em;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999;
  border: 0.5em solid #eee;
  border-bottom: 0;
}

.rocker input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-left,
.switch-right {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 5em;
  /* Adjusted width for larger text */
  transition: 0.2s;
  user-select: none;
}

.switch-left {
  height: 2.4em;
  width: 5em;
  /* Adjusted width for larger text */
  left: 0.85em;
  bottom: 0.4em;
  background-color: #ddd;
  transform: rotate(15deg) skewX(15deg);
}

.switch-right {
  right: 0.5em;
  bottom: 0;
  background-color: #bd5757;
  color: #fff;
}

.switch-left::before,
.switch-right::before {
  content: "";
  position: absolute;
  width: 0.4em;
  height: 2.45em;
  bottom: -0.45em;
  background-color: #ccc;
  transform: skewY(-65deg);
}

.switch-left::before {
  left: -0.4em;
}

.switch-right::before {
  right: -0.375em;
  background-color: transparent;
  transform: skewY(65deg);
}

input:checked+.switch-left {
  background-color: #0084d0;
  color: #fff;
  bottom: 0px;
  left: 0.5em;
  height: 2.5em;
  width: 5em;
  /* Adjusted width for larger text */
  transform: rotate(0deg) skewX(0deg);
}

input:checked+.switch-left::before {
  background-color: transparent;
  width: 5.0833em;
  /* Adjusted width for larger text */
}

input:checked+.switch-left+.switch-right {
  background-color: #ddd;
  color: #888;
  bottom: 0.4em;
  right: 0.8em;
  height: 2.4em;
  width: 5em;
  /* Adjusted width for larger text */
  transform: rotate(-15deg) skewX(-15deg);
}

input:checked+.switch-left+.switch-right::before {
  background-color: #ccc;
}

/* Keyboard Users */
input:focus+.switch-left {
  color: #333;
}

input:checked:focus+.switch-left {
  color: #fff;
}

input:focus+.switch-left+.switch-right {
  color: #fff;
}

input:checked:focus+.switch-left+.switch-right {
  color: #333;
}

/* Custom height for LineChart */
.h-custom-height {
  height: 500px;
  /* Adjust the height as needed */
}

.custom-select {
  background-color: #181c2c;
  color: white;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 5px;
  font-size: 1rem;
}

.custom-select option {
  background-color: #181c2c;
  color: white;
}
</style>

<style scoped>
.rocker {
  display: inline-block;
  position: relative;
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #888;
  width: 11.25em;
  /* Adjusted width for larger text */
  height: 4em;
  overflow: hidden;
  border-bottom: 0.5em solid #eee;
}

.rocker-large {
  font-size: 1.5em;
  margin: 1em;
}

.rocker::before {
  content: "";
  position: absolute;
  top: 0.5em;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999;
  border: 0.5em solid #eee;
  border-bottom: 0;
}

.rocker input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-left,
.switch-right {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 5em;
  /* Adjusted width for larger text */
  transition: 0.2s;
  user-select: none;
}

.switch-left {
  height: 2.4em;
  width: 5em;
  /* Adjusted width for larger text */
  left: 0.85em;
  bottom: 0.4em;
  background-color: #ddd;
  transform: rotate(15deg) skewX(15deg);
}

.switch-right {
  right: 0.5em;
  bottom: 0;
  background-color: #bd5757;
  color: #fff;
}

.switch-left::before,
.switch-right::before {
  content: "";
  position: absolute;
  width: 0.4em;
  height: 2.45em;
  bottom: -0.45em;
  background-color: #ccc;
  transform: skewY(-65deg);
}

.switch-left::before {
  left: -0.4em;
}

.switch-right::before {
  right: -0.375em;
  background-color: transparent;
  transform: skewY(65deg);
}

input:checked+.switch-left {
  background-color: #0084d0;
  color: #fff;
  bottom: 0px;
  left: 0.5em;
  height: 2.5em;
  width: 5em;
  /* Adjusted width for larger text */
  transform: rotate(0deg) skewX(0deg);
}

input:checked+.switch-left::before {
  background-color: transparent;
  width: 5.0833em;
  /* Adjusted width for larger text */
}

input:checked+.switch-left+.switch-right {
  background-color: #ddd;
  color: #888;
  bottom: 0.4em;
  right: 0.8em;
  height: 2.4em;
  width: 5em;
  /* Adjusted width for larger text */
  transform: rotate(-15deg) skewX(-15deg);
}

input:checked+.switch-left+.switch-right::before {
  background-color: #ccc;
}

/* Keyboard Users */
input:focus+.switch-left {
  color: #333;
}

input:checked:focus+.switch-left {
  color: #fff;
}

input:focus+.switch-left+.switch-right {
  color: #fff;
}

input:checked:focus+.switch-left+.switch-right {
  color: #333;
}

/* Custom height for LineChart */
.h-custom-height {
  height: 500px;
  /* Adjust the height as needed */
}

.custom-select {
  background-color: #181c2c;
  color: white;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 5px;
  font-size: 1rem;
  padding-right: 2rem;
  /* Added padding to prevent text collision with the arrow */
}

.custom-select option {
  background-color: #181c2c;
  color: white;
}
</style>