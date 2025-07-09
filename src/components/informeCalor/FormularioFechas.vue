<!-- src/components/informeCalor/FormularioFechas.vue -->
<script setup>
import { computed } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  fechainicio: {
    type: Date,
    default: null
  },
  fechafinal: {
    type: Date,
    default: null
  }
})

const emit = defineEmits(['update:fechainicio', 'update:fechafinal'])

const fechaInicio = computed({
  get: () => props.fechainicio,
  set: (value) => emit('update:fechainicio', value)
})

const fechaFinal = computed({
  get: () => props.fechafinal,
  set: (value) => emit('update:fechafinal', value)
})
</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Período de Evaluación</h3>
    
    <FormField label="Fechas de evaluación">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VueDatePicker
          v-model="fechaInicio"
          class="custom-datepicker"
          :month-change-on-scroll="false"
          dark
          :enable-time-picker="false"
          auto-apply
          placeholder="Fecha de inicio"
          :max-date="fechaFinal"
        />
        <VueDatePicker
          v-model="fechaFinal"
          class="custom-datepicker"
          :month-change-on-scroll="false"
          dark
          :enable-time-picker="false"
          auto-apply
          placeholder="Fecha de finalización"
          :min-date="fechaInicio"
        />
      </div>
    </FormField>
    
    <div v-if="fechaInicio && fechaFinal" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p class="text-sm text-blue-700 dark:text-blue-300">
        <strong>Período seleccionado:</strong> 
        {{ new Date(fechaInicio).toLocaleDateString() }} - 
        {{ new Date(fechaFinal).toLocaleDateString() }}
      </p>
    </div>
  </CardBox>
</template>

<style scoped>
.custom-datepicker {
  width: 100%;
}
</style>