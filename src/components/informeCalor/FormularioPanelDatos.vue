<!-- src/components/informeCalor/FormularioPanelDatos.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import InputControl from '@/components/forms/InputControl.vue'
import CheckButton from '@/components/forms/CheckButton.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      cantidadAreas: 1,
      usarMismaDatos: false,
      datosPorArea: []
    })
  }
})

const emit = defineEmits(['update:modelValue'])

// Estado local
const cantidadAreas = ref(props.modelValue.cantidadAreas || 1)
const usarMismaDatos = ref(props.modelValue.usarMismaDatos || false)
const datosPorArea = ref(props.modelValue.datosPorArea || [])

// Plantilla de datos vacíos para un área
const crearDatosVacios = (idArea) => ({
  idArea: idArea,
  wbgt: '',
  bulboSeco: '',
  bulboHumedo: '',
  cuerpoNegro: '',
  indiceTermico: '',
  humedadPromedio: '',
  generarGraficoCampana: false
})

// Inicializar datos si están vacíos
if (datosPorArea.value.length === 0) {
  datosPorArea.value = [crearDatosVacios(1)]
}

// Actualizar el modelo cuando cambien los valores
const actualizarModelo = () => {
  emit('update:modelValue', {
    cantidadAreas: cantidadAreas.value,
    usarMismaDatos: usarMismaDatos.value,
    datosPorArea: datosPorArea.value
  })
}

// Manejar cambio en cantidad de áreas
const actualizarCantidadAreas = () => {
  const cantidad = parseInt(cantidadAreas.value) || 1
  
  if (usarMismaDatos.value) {
    // Si usa mismos datos, mantener solo un conjunto
    if (datosPorArea.value.length === 0) {
      datosPorArea.value = [crearDatosVacios(1)]
    }
  } else {
    // Si usa datos diferentes, ajustar el array
    if (cantidad > datosPorArea.value.length) {
      // Agregar áreas faltantes
      for (let i = datosPorArea.value.length + 1; i <= cantidad; i++) {
        datosPorArea.value.push(crearDatosVacios(i))
      }
    } else if (cantidad < datosPorArea.value.length) {
      // Remover áreas sobrantes
      datosPorArea.value = datosPorArea.value.slice(0, cantidad)
    }
  }
  
  actualizarModelo()
}

// Manejar cambio en tipo de datos (mismos/diferentes)
const actualizarTipoDatos = () => {
  if (usarMismaDatos.value) {
    // Mantener solo el primer conjunto de datos
    datosPorArea.value = datosPorArea.value.slice(0, 1)
    datosPorArea.value[0].idArea = 1
  } else {
    // Expandir a la cantidad de áreas necesarias
    actualizarCantidadAreas()
  }
  
  actualizarModelo()
}

// Watchers
watch(cantidadAreas, actualizarCantidadAreas)
watch(usarMismaDatos, actualizarTipoDatos)
watch(datosPorArea, actualizarModelo, { deep: true })

// Computed para mostrar título dinámico
const tituloSeccion = computed(() => {
  if (usarMismaDatos.value) {
    return `Datos para todas las áreas (${cantidadAreas.value} área${cantidadAreas.value > 1 ? 's' : ''})`
  } else {
    return 'Datos por área'
  }
})

// Validar si todos los campos están completos
const datosCompletos = computed(() => {
  return datosPorArea.value.every(area => 
    area.wbgt !== '' &&
    area.bulboSeco !== '' &&
    area.bulboHumedo !== '' &&
    area.cuerpoNegro !== '' &&
    area.indiceTermico !== '' &&
    area.humedadPromedio !== ''
  )
})
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
            type="input"
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
            label="Generalizar datos para areas"
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
            Datos ambientales (se aplicarán a las {{ cantidadAreas }} áreas)
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputControl
              v-model="datosPorArea[0].wbgt"
              type="cantidad"
              label="WBGT (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].bulboSeco"
              type="cantidad"
              label="Temperatura bulbo seco (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].bulboHumedo"
              type="cantidad"
              label="Temperatura bulbo húmedo (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].cuerpoNegro"
              type="cantidad"
              label="Temperatura cuerpo negro (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].indiceTermico"
              type="cantidad"
              label="Índice térmico (°C)"
            />
            <InputControl
              v-model="datosPorArea[0].humedadPromedio"
              type="cantidad"
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
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputControl
              v-model="area.wbgt"
              type="cantidad"
              :label="`WBGT (°C) - Área ${area.idArea}`"
            />
            <InputControl
              v-model="area.bulboSeco"
              type="cantidad"
              :label="`T. bulbo seco (°C) - Área ${area.idArea}`"
            />
            <InputControl
              v-model="area.bulboHumedo"
              type="cantidad"
              :label="`T. bulbo húmedo (°C) - Área ${area.idArea}`"
            />
            <InputControl
              v-model="area.cuerpoNegro"
              type="cantidad"
              :label="`T. cuerpo negro (°C) - Área ${area.idArea}`"
            />
            <InputControl
              v-model="area.indiceTermico"
              type="cantidad"
              :label="`Índice térmico (°C) - Área ${area.idArea}`"
            />
            <InputControl
              v-model="area.humedadPromedio"
              type="cantidad"
              :label="`Humedad (%) - Área ${area.idArea}`"
            />
          </div>
          
          <div class="mt-4">
            <CheckButton 
              v-model="area.generarGraficoCampana"
              :label="`Generar gráfico de campana para Área ${area.idArea}`"
            />
          </div>
        </div>
      </div>

      <!-- Indicador de estado -->
      <div v-if="!datosCompletos" class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p class="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Atención:</strong> Complete todos los campos de temperatura y humedad para continuar.
        </p>
      </div>
      
      <div v-else class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p class="text-sm text-green-700 dark:text-green-300">
          <strong>✓ Listo:</strong> Todos los datos de las áreas están completos.
        </p>
      </div>
    </CardBox>
  </div>
</template>