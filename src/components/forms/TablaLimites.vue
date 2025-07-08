<script setup>
import { ref,watch } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormControl from '@/components/forms/FormControl.vue'
import InputControl from '@/components/forms/InputControl.vue'
import SectionTitleLineWithButton from '../layouts/SectionTitleLineWithButton.vue'
import { mdiChartTimelineVariant } from '@mdi/js'

const projectedParams = ref([ 
  { id: 1, key: 'TemperaturaRectalFinal', parametro: 'Temperatura rectal final:', value: 0.0, unit: '°C', isEditable: true },
  { id: 2, key: 'ExcesoTempCorporal38C', parametro: 'Tiempo para alcanzar el límite de seguridad de temperatura corporal central de 38 °C (válido para el 95 % de las personas):', value: 'No excedido', unit: null, isSelectable: true },
  { id: 3, key: 'ExcesoDeshidratacion2Porciento', parametro: 'Tiempo para alcanzar el estado de deshidratación del 2% de la masa corporal (válido para el 95% de las personas):', value: 'No excedido', unit: null, isSelectable: true },
  { id: 4, key: 'TasaMediaSudoracion', parametro: 'Tasa media de sudoración:', value: 0.0, unit: 'ml/min', isEditable: true },
  { id: 5, key: 'PerdidaTotalAgua', parametro: 'Pérdida total de agua:', value: 0.0, unit: 'gramos', isEditable: true }
])

const emit = defineEmits(['update-limites'])

watch(projectedParams, () => {
  const payload = {}
  for (const item of projectedParams.value) {
    payload[item.key] = item.value
  }
  emit('update-limites', payload)
}, { deep: true })

const opcionesCondicion = [
  { id: 'No excedido', label: 'No excedido' },
  { id: 'Excedido', label: 'Excedido' }
]
</script>

<template>
  <SectionTitleLineWithButton
    :icon="mdiChartTimelineVariant"
    title="Reporte Monitoreo de las Condiciones Ambientales"
  />

  <CardBox has-table class="mb-6">
    <table>
      <thead>
        <tr>
          <th>PARAMETROS PROYECTADOS</th>
          <th>RESULTADO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in projectedParams" :key="item.id">
          <td data-label="Parametros Proyectados">
            {{ item.parametro }}
          </td>
          <td data-label="Resultado">
            <template v-if="item.isSelectable">
              <FormControl
                v-model="item.value"
                :options="opcionesCondicion"
              />
            </template>

            <template v-else-if="item.isEditable">
              <div class="editable-field">
                <InputControl
                  v-model="item.value"
                  type="input"
                  name="param"
                  :id="`input-${item.id}`"
                />
                <span class="unit-label">{{ item.unit }}</span>
              </div>
            </template>

            <template v-else>
              {{ item.value }} {{ item.unit }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </CardBox>
</template>

<style scoped>
table {
  width: 100%;
}
th, td {
  padding: 0.75rem;
  text-align: left;
  vertical-align: middle;
}



.editable-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.unit-label {
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}
</style>
