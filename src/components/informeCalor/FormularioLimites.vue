<!-- src/components/informeCalor/FormularioLimites.vue -->
<script setup>
import TablaLimites from '@/components/forms/TablaLimites.vue'
import CardBox from '@/components/base/CardBox.vue'


const emit = defineEmits(['update:limitesProyectados'])

const handleUpdateLimites = (nuevosValores) => {
  emit('update:limitesProyectados', nuevosValores)
}
</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Límites de Exposición Fisiológica al Calor</h3>
    
    <TablaLimites @update-limites="handleUpdateLimites" />
    
    <div class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <p class="text-sm text-amber-700 dark:text-amber-300">
        <strong>Importante:</strong> Estos valores serán utilizados para calcular los límites de exposición
        y determinar las medidas de control necesarias en el informe final.
      </p>
    </div>
  </CardBox>
</template>