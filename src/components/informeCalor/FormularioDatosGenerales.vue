<!-- src/components/informeCalor/FormularioDatosGenerales.vue -->
<script setup>
import { computed } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import FormControl from '@/components/forms/FormControl.vue'
import InputControl from '@/components/forms/InputControl.vue'

const props = defineProps({
  pesoestimado: {
    type: Number,
    required: true
  },
  idRopaUtilizada: {
    type: Number,
    required: true
  },
  ropaOpciones: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:pesoestimado', 'update:idRopaUtilizada'])

const peso = computed({
  get: () => props.pesoestimado,
  set: (value) => emit('update:pesoestimado', value)
})

const ropaSeleccionada = computed({
  get: () => props.idRopaUtilizada,
  set: (value) => emit('update:idRopaUtilizada', value)
})
</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Datos Generales del Personal</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Peso Promedio del Personal">
        <InputControl
          id="peso"
          v-model="peso"
          type="cantidad"
          name="peso"
          label="Peso (Libras)"
        />
        <p class="text-xs text-gray-500 mt-1">
          Ingrese el peso promedio del personal evaluado
        </p>
      </FormField>

      <FormField label="Ropa Utilizada">
        <FormControl
          v-model="ropaSeleccionada"
          :options="ropaOpciones"
          label="Tipo de ropa"
        />
        <p class="text-xs text-gray-500 mt-1">
          Seleccione el tipo de ropa usada durante la evaluación
        </p>
      </FormField>
    </div>
  </CardBox>
</template>