<!-- src/components/informeCalor/FormularioDiasEvaluacion.vue -->
<script setup>
import { computed, watch } from 'vue'
import dayjs from 'dayjs'
import CardBox from '@/components/base/CardBox.vue'
import InputControl from '@/components/forms/InputControl.vue'

const props = defineProps({
  diasEvaluacion: {
    type: Array,
    default: () => []
  },
  fechainicio: {
    type: Date,
    default: null
  },
  fechafinal: {
    type: Date,
    default: null
  }
})

const emit = defineEmits(['update:diasEvaluacion'])

const dias = computed({
  get: () => props.diasEvaluacion,
  set: (value) => emit('update:diasEvaluacion', value)
})

// Generar días dinámicamente cuando cambien las fechas
watch(
  () => [props.fechainicio, props.fechafinal],
  ([inicio, fin]) => {
    if (inicio && fin) {
      const start = dayjs(inicio)
      const end = dayjs(fin)
      const diff = end.diff(start, 'day')

      if (diff >= 0 && diff !== dias.value.length - 1) {
        const nuevosDias = Array.from({ length: diff + 1 }, (_, i) => {
          const diaExistente = dias.value[i]
          return diaExistente || {
            dia: `Día ${i + 1}`,
            humedadRelativa: '',
            parcialmenteNublado: '',
            temperaturaMaxima: '',
            temperaturaMinima: ''
          }
        })
        dias.value = nuevosDias
      }
    }
  },
  { immediate: true }
)

const actualizarDia = (index, campo, valor) => {
  const nuevosDias = [...dias.value]
  nuevosDias[index] = {
    ...nuevosDias[index],
    [campo]: valor
  }
  dias.value = nuevosDias
}
</script>

<template>
  <CardBox v-if="dias.length > 0">
    <h3 class="text-lg font-semibold mb-4">Datos Climáticos por Día</h3>
    
    <div class="space-y-6">
      <div 
        v-for="(dia, index) in dias" 
        :key="index"
        class="border dark:border-gray-700 rounded-lg p-4"
      >
        <h4 class="font-medium mb-3 text-blue-600 dark:text-blue-400">
          {{ dia.dia }} - {{ dayjs(fechainicio).add(index, 'day').format('DD/MM/YYYY') }}
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputControl
            :id="`humedad_relativa_${index}`"
            type="input"
            :name="`humedad_relativa_${index}`"
            label="Humedad Relativa (%)"
            :model-value="dia.humedadRelativa"
            @update:model-value="(value) => actualizarDia(index, 'humedadRelativa', value)"
          />
          
          <InputControl
            :id="`parcialmente_nublado_${index}`"
            type="input"
            :name="`parcialmente_nublado_${index}`"
            label="Nubosidad (%)"
            :model-value="dia.parcialmenteNublado"
            @update:model-value="(value) => actualizarDia(index, 'parcialmenteNublado', value)"
          />
          
          <InputControl
            :id="`temperatura_maxima_${index}`"
            type="input"
            :name="`temperatura_maxima_${index}`"
            label="Temp. Máxima (°C)"
            :model-value="dia.temperaturaMaxima"
            @update:model-value="(value) => actualizarDia(index, 'temperaturaMaxima', value)"
          />
          
          <InputControl
            :id="`temperatura_minima_${index}`"
            type="input"
            :name="`temperatura_minima_${index}`"
            label="Temp. Mínima (°C)"
            :model-value="dia.temperaturaMinima"
            @update:model-value="(value) => actualizarDia(index, 'temperaturaMinima', value)"
          />
        </div>
      </div>
    </div>
  </CardBox>

<CardBox v-else class="mb-4">
      <div class="text-center py-6 text-gray-500 dark:text-gray-400">
        <BaseIcon :path="mdiCalendarMonth" size="48" class="mb-4 mx-auto" />
        <p>Seleccione las fechas de inicio y fin en la sección anterior para agregar días de evaluación</p>
      </div>
    </CardBox>
</template>