<!-- src/components/informeCalor/FormularioCriterios.vue -->
<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import CheckButton from '@/components/forms/CheckButton.vue'
import FormField from '@/components/forms/FormField.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      aclimatacion: false,
      hidratacion: false
    })
  }
})

const emit = defineEmits(['update:modelValue'])

// Estado local
const aclimatacion = ref(props.modelValue.aclimatacion || false)
const hidratacion = ref(props.modelValue.hidratacion || false)

// Watchers
watch([aclimatacion, hidratacion], () => {
  emit('update:modelValue', {
    aclimatacion: aclimatacion.value,
    hidratacion: hidratacion.value
  })
})
</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Criterios de Evaluación</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Adaptación fisiológica">
        <CheckButton 
          v-model="aclimatacion" 
          label="Trabajador aclimatado al calor"
        />
        <p class="text-xs text-gray-500 mt-1">
          Marque si el trabajador está aclimatado a las condiciones de calor
        </p>
      </FormField>

      <FormField label="Estado de hidratación">
        <CheckButton 
          v-model="hidratacion" 
          label="Trabajador adecuadamente hidratado"
        />
        <p class="text-xs text-gray-500 mt-1">
          Marque si el trabajador mantiene una hidratación adecuada
        </p>
      </FormField>
    </div>
    
    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p class="text-sm text-blue-700 dark:text-blue-300">
        <strong>Nota:</strong> Estos criterios se aplicarán a todo el informe. 
        Los ajustes por ropa, postura y ambiente se configuran por área en la sección de datos ambientales.
      </p>
    </div>
  </CardBox>
</template>