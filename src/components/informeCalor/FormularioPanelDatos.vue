<!-- src/components/informeCalor/FormularioPanelDatos.vue -->
<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import InputControl from '@/components/forms/InputControl.vue'
import CheckButton from '@/components/forms/CheckButton.vue'
import { InformeCalorService } from '@/services/InformeCalor'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      cantidadAreas: 1,
      usarMismaDatos: true,
      datosPorArea: []
    })
  }
})

const emit = defineEmits(['update:modelValue'])

// Estado local
const cantidadAreas = ref(props.modelValue.cantidadAreas || 1)
const usarMismaDatos = ref(props.modelValue.usarMismaDatos ?? true)
const datosPorArea = ref([])
const tasasMetabolicas = ref([])
const ropaOpciones = ref([])

// Opciones para los selectores
const opcionesPostura = [
  { value: 'De pie', label: 'De pie' },
  { value: 'Sentado', label: 'Sentado' },
  { value: 'Agachado', label: 'Agachado' },
  { value: 'En movimiento', label: 'En movimiento' }
]

const opcionesAmbiente = [
  { value: 'Interior', label: 'Interior' },
  { value: 'Exterior', label: 'Exterior' },
  { value: 'Mixto', label: 'Mixto' }
]

// Inicializar datos
const inicializarDatosPorArea = () => {
  datosPorArea.value = []
  
  for (let i = 1; i <= cantidadAreas.value; i++) {
    const areaExistente = props.modelValue.datosPorArea?.find(a => a.idArea === i)
    
    datosPorArea.value.push({
      idArea: i,
      wbgt: areaExistente?.wbgt || '',
      bulboSeco: areaExistente?.bulboSeco || '',
      bulboHumedo: areaExistente?.bulboHumedo || '',
      cuerpoNegro: areaExistente?.cuerpoNegro || '',
      indiceTermico: areaExistente?.indiceTermico || '',
      humedadPromedio: areaExistente?.humedadPromedio || '',
      generarGraficoCampana: areaExistente?.generarGraficoCampana || false,
      tasaEstimada: areaExistente?.tasaEstimada || 0,
      ajustePorRopa: areaExistente?.ajustePorRopa || 0.5, // Default 0.5
      postura: areaExistente?.postura || 'De pie',
      ambiente: areaExistente?.ambiente || 'Interior'
    })
  }
}

// Cargar tasas metabólicas
const cargarTasasMetabolicas = async () => {
  try {
    const response = await InformeCalorService.obtenerTasasMetabolicas()
    tasasMetabolicas.value = response.data
  } catch (error) {
    console.error('Error cargando tasas metabólicas:', error)
  }
}

const cargarRopaUtilizada = async () => {
  try {
    const response = await InformeCalorService.getRopaUtilizada()
    if (response.success) {
      ropaOpciones.value = response.data.map(ropa => ({
        id: ropa.idRopa,
        label: `${ropa.nombre} - (${ropa.cyF} clo)`,
        cyF: ropa.cyF
      }))
    }
  } catch (error) {
    console.error('Error cargando ropa utilizada:', error)
  }
}

// Watchers
watch(cantidadAreas, (newVal) => {
  if (newVal > 0 && newVal <= 20) {
    inicializarDatosPorArea()
  }
})

watch(
  [cantidadAreas, usarMismaDatos, datosPorArea],
  () => {
    emit('update:modelValue', {
      cantidadAreas: cantidadAreas.value,
      usarMismaDatos: usarMismaDatos.value,
      datosPorArea: datosPorArea.value
    })
  },
  { deep: true }
)

// Computed
 
const datosCompletos = computed(() => {
  return datosPorArea.value.every(area => 
    area.wbgt !== '' &&
    area.bulboSeco !== '' &&
    area.bulboHumedo !== '' &&
    area.cuerpoNegro !== '' &&
    area.indiceTermico !== '' &&
    area.humedadPromedio !== '' &&
    area.tasaEstimada > 0 &&
    area.ajustePorRopa !== '' &&
    area.postura !== '' &&
    area.ambiente !== ''
  )
})

// Lifecycle

  inicializarDatosPorArea()
  cargarTasasMetabolicas()
  cargarRopaUtilizada()

</script>

<template>
  <div class="space-y-6">
    <!-- Configuración inicial -->
    <CardBox>
      <h3 class="text-lg font-semibold mb-4">Configuración de Áreas de Trabajo</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Cantidad de áreas a evaluar">
          <InputControl
            v-model="cantidadAreas"
            type="cantidad"
            :min="1"
            :max="20"
            label="Número de áreas"
          />
          <p class="text-xs text-gray-500 mt-1">
            Ingrese el número de áreas de trabajo a evaluar (máximo 20)
          </p>
        </FormField>

        <FormField label="Tipo de datos">
          <CheckButton 
            v-model="usarMismaDatos" 
            label="Generalizar datos para áreas"
          />
          <p class="text-xs text-gray-500 mt-1">
            Active si todas las áreas tienen las mismas condiciones ambientales
          </p>
        </FormField>
      </div>
    </CardBox>

    <!-- Panel de datos por área -->
    <CardBox>
      <h3 class="text-lg font-semibold mb-4">{{ tituloSeccion }}</h3>
      
      <div v-if="usarMismaDatos" class="space-y-4">
        <!-- Un solo formulario para todas las áreas -->
        <div class="border dark:border-gray-700 rounded-lg p-4">
          <h4 class="font-medium mb-3 text-blue-600 dark:text-blue-400">
            Datos ambientales y ajustes
          </h4>
          
          <!-- Sección de Tasa Metabólica y Ajustes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField label="Tasa Metabólica Estimada">
              <select v-model="datosPorArea[0].tasaEstimada" class="form-select">
                <option value="0">Seleccione una actividad</option>
                <option
                  v-for="tasa in tasasMetabolicas"
                  :key="tasa.id"
                  :value="tasa.tasaMetabolicaMax"
                >
                  {{ tasa.actividad }} - {{ tasa.tasaMetabolicaMin }}–{{ tasa.tasaMetabolicaMax }} W/m²
                </option>
              </select>
            </FormField>

     <FormField label="Ajuste por Ropa">
              <select v-model="datosPorArea[0].idRopaUtilizada" class="form-select">
                <option :value="null">Seleccione tipo de ropa</option>
                <option
                  v-for="ropa in ropaOpciones"
                  :key="ropa.id"
                  :value="ropa.id"
                >
                  {{ ropa.label }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                Factor de aislamiento térmico de la vestimenta
              </p>
            </FormField>
            <FormField label="Postura de Trabajo">
              <select v-model="datosPorArea[0].postura" class="form-select">
                <option 
                  v-for="opcion in opcionesPostura" 
                  :key="opcion.value"
                  :value="opcion.value"
                >
                  {{ opcion.label }}
                </option>
              </select>
            </FormField>

            <FormField label="Ambiente de Trabajo">
              <select v-model="datosPorArea[0].ambiente" class="form-select">
                <option 
                  v-for="opcion in opcionesAmbiente" 
                  :key="opcion.value"
                  :value="opcion.value"
                >
                  {{ opcion.label }}
                </option>
              </select>
            </FormField>
          </div>

          <!-- Sección de Datos Ambientales -->
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Mediciones Ambientales</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputControl
              v-model="datosPorArea[0].wbgt"
              type="cantidad"
              step="0.01"
              label="WBGT (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].bulboSeco"
              type="cantidad"
              step="0.01"
              label="Temperatura bulbo seco (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].bulboHumedo"
              type="cantidad"
              step="0.01"
              label="Temperatura bulbo húmedo (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].cuerpoNegro"
              type="cantidad"
              step="0.01"
              label="Temperatura cuerpo negro (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].indiceTermico"
              type="cantidad"
              step="0.01"
              label="Índice térmico (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].humedadPromedio"
              type="cantidad"
              step="0.01"
              label="Humedad promedio (%)"
            />
          </div>
          
          <div class="mt-4">
            <CheckButton 
              v-model="datosPorArea[0].generarGraficoCampana"
              label="Generar gráfico de campana (calcular PMV/PPD)"
            />
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <!-- Formularios individuales por área -->
        <div 
          v-for="(area) in datosPorArea"
          :key="area.idArea"
          class="border dark:border-gray-700 rounded-lg p-4"
        >
          <h4 class="font-medium mb-3 text-blue-600 dark:text-blue-400">
            Área {{ area.idArea }}
          </h4>
          
          <!-- Sección de Tasa Metabólica y Ajustes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField label="Tasa Metabólica Estimada">
              <select v-model="area.tasaEstimada" class="form-select">
                <option value="0">Seleccione una actividad</option>
                <option
                  v-for="tasa in tasasMetabolicas"
                  :key="tasa.id"
                  :value="tasa.tasaMetabolicaMax"
                >
                  {{ tasa.actividad }} - {{ tasa.tasaMetabolicaMin }}–{{ tasa.tasaMetabolicaMax }} W/m²
                </option>
              </select>
            </FormField>

    <FormField label="Ajuste por Ropa">
              <select v-model="area.idRopaUtilizada" class="form-select">
                <option :value="null">Seleccione tipo de ropa</option>
                <option
                  v-for="ropa in ropaOpciones"
                  :key="ropa.id"
                  :value="ropa.id"
                >
                  {{ ropa.label }}
                </option>
              </select>
            </FormField>
            <FormField label="Postura">
              <select v-model="area.postura" class="form-select">
                <option 
                  v-for="opcion in opcionesPostura" 
                  :key="opcion.value"
                  :value="opcion.value"
                >
                  {{ opcion.label }}
                </option>
              </select>
            </FormField>

            <FormField label="Ambiente">
              <select v-model="area.ambiente" class="form-select">
                <option 
                  v-for="opcion in opcionesAmbiente" 
                  :key="opcion.value"
                  :value="opcion.value"
                >
                  {{ opcion.label }}
                </option>
              </select>
            </FormField>
          </div>

          <!-- Sección de Datos Ambientales -->
          <h5 class="font-medium mb-2 text-gray-700 dark:text-gray-300">Mediciones Ambientales</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputControl
              v-model="area.wbgt"
              type="cantidad"
              step="0.01"
              label="WBGT (°C)"
            />
            <InputControl
              v-model="area.bulboSeco"
              type="cantidad"
              step="0.01"
              label="Temperatura bulbo seco (°C)"
            />
            <InputControl
              v-model="area.bulboHumedo"
              type="cantidad"
              step="0.01"
              label="Temperatura bulbo húmedo (°C)"
            />
            <InputControl
              v-model="area.cuerpoNegro"
              type="cantidad"
              step="0.01"
              label="Temperatura cuerpo negro (°C)"
            />
            <InputControl
              v-model="area.indiceTermico"
              type="cantidad"
              step="0.01"
              label="Índice térmico (°C)"
            />
            <InputControl
              v-model="area.humedadPromedio"
              type="cantidad"
              step="0.01"
              label="Humedad promedio (%)"
            />
          </div>
          
          <div class="mt-4">
            <CheckButton 
              v-model="area.generarGraficoCampana"
              label="Generar gráfico de campana (calcular PMV/PPD)"
            />
          </div>
        </div>
      </div>
      
      <!-- Resumen de estado -->
      <div v-if="cantidadAreas > 0" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p class="text-sm">
          <span class="font-medium">Estado:</span>
          <span v-if="datosCompletos" class="text-green-600 dark:text-green-400 ml-2">
            ✓ Todos los datos están completos
          </span>
          <span v-else class="text-yellow-600 dark:text-yellow-400 ml-2">
            ⚠ Complete todos los campos requeridos
          </span>
        </p>
      </div>
    </CardBox>
  </div>
</template>

<style scoped>
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
         dark:text-white;
}
</style>