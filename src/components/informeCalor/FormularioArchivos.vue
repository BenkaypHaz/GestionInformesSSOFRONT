<!-- src/components/informeCalor/FormularioArchivos.vue -->
<script setup>
import { computed } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const props = defineProps({
  archivos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:archivos'])

const archivosLocales = computed({
  get: () => props.archivos,
  set: (value) => emit('update:archivos', value)
})

const onFileAdded = (error, file) => {
  if (!error && file?.file) {
    archivosLocales.value = [file.file]
    console.log('Archivo Excel agregado:', file.file.name)
  } else {
    console.error('Error al agregar archivo:', error)
  }
}

const onFileRemoved = () => {
  archivosLocales.value = []
  console.log('Archivo Excel eliminado')
}
</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Archivo de Datos</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">
          Archivo Excel con datos de medición
        </label>
        
        <FilePond
          name="archivo_excel"
          label-idle="Arrastra y suelta tu archivo Excel aquí o <span class='filepond--label-action'>Examinar</span>"
          accepted-file-types="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :server="null"
          :allow-multiple="false"
          credits="false"
          @addfile="onFileAdded"
          @removefile="onFileRemoved"
        />
        
        <p class="text-xs text-gray-500 mt-2">
          Formatos aceptados: .xls, .xlsx - Tamaño máximo: 10MB
        </p>
      </div>

      <div v-if="archivosLocales.length > 0" class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p class="text-sm text-green-700 dark:text-green-300">
          <strong>Archivo cargado:</strong> {{ archivosLocales[0].name }}
        </p>
      </div>
    </div>
  </CardBox>
</template>

<style>
.filepond--root {
  font-family: inherit;
}

.filepond--drop-label {
  color: #4a5568;
}

.dark .filepond--drop-label {
  color: #e2e8f0;
}

.filepond--label-action {
  text-decoration-color: #3182ce;
}

.filepond--panel-root {
  background-color: #f7fafc;
  border: 2px dashed #cbd5e0;
}

.dark .filepond--panel-root {
  background-color: #2d3748;
  border-color: #4a5568;
}
</style>