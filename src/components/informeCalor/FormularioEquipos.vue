<!-- src/components/informeCalor/FormularioEquipos.vue -->
<script setup>
import { computed } from 'vue'
import Swal from 'sweetalert2'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import FormControl from '@/components/forms/FormControl.vue'
import TablaEquipos from '@/components/forms/TablaEquipos.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps({
  idTecnico: {
    type: Number,
    default: null
  },
  equipoSeleccionado: {
    type: Number,
    default: null
  },
  equiposSeleccionados: {
    type: Array,
    default: () => []
  },
  usuariosOpciones: {
    type: Array,
    default: () => []
  },
  equiposOpciones: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:idTecnico', 
  'update:equipoSeleccionado', 
  'update:equiposSeleccionados'
])

const tecnico = computed({
  get: () => props.idTecnico,
  set: (value) => emit('update:idTecnico', value)
})

const equipoActual = computed({
  get: () => props.equipoSeleccionado,
  set: (value) => emit('update:equipoSeleccionado', value)
})

const equiposLista = computed({
  get: () => props.equiposSeleccionados,
  set: (value) => emit('update:equiposSeleccionados', value)
})

const agregarEquipo = () => {
  if (!equipoActual.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Seleccione un equipo',
      text: 'Debe seleccionar un equipo antes de agregarlo.',
      background: '#181c2c'
    })
    return
  }

  const existe = equiposLista.value.some(
    equipo => equipo.id === equipoActual.value
  )

  if (existe) {
    Swal.fire({
      title: 'Advertencia',
      text: 'El equipo ya está en la lista.',
      icon: 'warning',
      background: '#181c2c'
    })
    return
  }

  const equipo = props.equiposOpciones.find(
    eq => eq.id === equipoActual.value
  )

  if (equipo) {
    const nuevosEquipos = [...equiposLista.value, {
      id: equipo.id,
      label: equipo.label,
      modelo: equipo.modelo,
      marca: equipo.marca,
      serie: equipo.serie
    }]
    equiposLista.value = nuevosEquipos
    equipoActual.value = null
  }
}

const eliminarEquipo = (index) => {
  const nuevosEquipos = equiposLista.value.filter((_, i) => i !== index)
  equiposLista.value = nuevosEquipos
}
</script>

<template>
  <div class="space-y-6">
    <CardBox>
      <h3 class="text-lg font-semibold mb-4">Personal y Equipos</h3>
      
      <FormField label="Técnico Responsable">
        <FormControl 
          v-model="tecnico" 
          :options="usuariosOpciones" 
          label="Seleccione el técnico"
        />
      </FormField>

      <FormField label="Equipos Utilizados" class="mt-4">
        <div class="flex gap-2">
          <div class="flex-1">
            <FormControl
              v-model="equipoActual"
              :options="[{ id: null, label: 'Seleccione un equipo' }, ...equiposOpciones]"
              label="Equipo"
            />
          </div>
          <BaseButton
            color="info"
            label="Agregar"
            :disabled="!equipoActual"
            @click="agregarEquipo"
          />
        </div>
      </FormField>
    </CardBox>

    <CardBox v-if="equiposLista.length > 0" has-table>
      <TablaEquipos 
        :equipos-seleccionados="equiposLista"
        @eliminar="eliminarEquipo"
      />
    </CardBox>

     <CardBox v-else class="mb-6">
      <div class="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-lg font-medium mb-2">No hay equipos seleccionados</p>
        <p class="text-sm">Seleccione y agregue los equipos que se utilizarán en la evaluación</p>
      </div>
    </CardBox>
  </div>
</template>