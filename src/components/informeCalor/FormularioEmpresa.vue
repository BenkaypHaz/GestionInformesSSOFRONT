<!-- src/components/informeCalor/FormularioEmpresa.vue -->
<script setup>
import { computed } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import FormControl from '@/components/forms/FormControl.vue'
import CheckButton from '@/components/forms/CheckButton.vue'

const props = defineProps({
  idEmpresa: {
    type: Number,
    required: true
  },
  listaNoAfiliadas: {
    type: Boolean,
    required: true
  },
  empresasOpciones: {
    type: Array,
    default: () => []
  },
  empresasAfiliadasOpciones: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:idEmpresa', 'update:listaNoAfiliadas'])

const empresaSeleccionada = computed({
  get: () => props.idEmpresa,
  set: (value) => emit('update:idEmpresa', value)
})

const esNoAfiliada = computed({
  get: () => props.listaNoAfiliadas,
  set: (value) => emit('update:listaNoAfiliadas', value)
})


</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Datos de la Empresa</h3>
    
    <FormField label="Empresa Evaluada">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <FormControl
            v-if="!esNoAfiliada && empresasAfiliadasOpciones.length > 0"
            v-model="empresaSeleccionada"
            :options="empresasAfiliadasOpciones"
            label="Empresa Afiliada"
          />
          <FormControl
            v-else-if="esNoAfiliada && empresasOpciones.length > 0"
            v-model="empresaSeleccionada"
            :options="empresasOpciones"
            label="Empresa No Afiliada"
          />
          <p v-else class="text-gray-500 italic">
            No hay empresas {{ esNoAfiliada ? 'no afiliadas' : 'afiliadas' }} disponibles
          </p>
        </div>
        <CheckButton 
          v-model="esNoAfiliada" 
          label="Listado no Afiliadas" 
        />
      </div>
    </FormField>
  </CardBox>
</template>