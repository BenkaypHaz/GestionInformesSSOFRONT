<!-- src/components/informeCalor/FormularioCriterios.vue -->
<script setup>
import CardBox from '@/components/base/CardBox.vue'
import TablaCriterios from '@/components/forms/TablaCriterios.vue'

const emit = defineEmits(['tasa-cambiada'])

const handleTasaCambiada = (tasa) => {
  emit('tasa-cambiada', tasa)
}
</script>

<template>
  <CardBox has-table>
    <h3 class="text-lg font-semibold mb-4">Criterios de Evaluación</h3>
    
    <TablaCriterios @tasa-cambiada="handleTasaCambiada" />
    
    <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
      <p class="text-sm text-yellow-700 dark:text-yellow-300">
        <strong>Nota:</strong> Los criterios seleccionados determinarán la tasa metabólica estimada 
        que se utilizará en el cálculo del informe.
      </p>
    </div>
  </CardBox>
</template>