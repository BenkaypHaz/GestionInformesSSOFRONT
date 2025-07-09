<!-- src/components/informeCalor/FormularioGraficos.vue -->
<script setup>
import { computed } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import FormField from '@/components/forms/FormField.vue'
import InputControl from '@/components/forms/InputControl.vue'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const props = defineProps({
  imagenRectal: { type: Array, default: () => [] },
  imagenPiel: { type: Array, default: () => [] },
  imagenAgua: { type: Array, default: () => [] },
  tituloGraficoRectal: { type: String, required: true },
  tituloGraficoPiel: { type: String, required: true },
  tituloGraficoAgua: { type: String, required: true }
})

const emit = defineEmits([
  'update:imagenRectal',
  'update:imagenPiel',
  'update:imagenAgua',
  'update:tituloGraficoRectal',
  'update:tituloGraficoPiel',
  'update:tituloGraficoAgua'
])

// Computed properties para v-model
const tituloRectal = computed({
  get: () => props.tituloGraficoRectal,
  set: (value) => emit('update:tituloGraficoRectal', value)
})

const tituloPiel = computed({
  get: () => props.tituloGraficoPiel,
  set: (value) => emit('update:tituloGraficoPiel', value)
})

const tituloAgua = computed({
  get: () => props.tituloGraficoAgua,
  set: (value) => emit('update:tituloGraficoAgua', value)
})

// Handlers para las imágenes
const handleImagenRectal = (error, file) => {
  if (!error && file?.file) {
    emit('update:imagenRectal', [file.file])
  }
}

const handleImagenPiel = (error, file) => {
  if (!error && file?.file) {
    emit('update:imagenPiel', [file.file])
  }
}

const handleImagenAgua = (error, file) => {
  if (!error && file?.file) {
    emit('update:imagenAgua', [file.file])
  }
}

const removeImagenRectal = () => emit('update:imagenRectal', [])
const removeImagenPiel = () => emit('update:imagenPiel', [])
const removeImagenAgua = () => emit('update:imagenAgua', [])
</script>

<template>
  <CardBox>
    <h3 class="text-lg font-semibold mb-4">Gráficos de Proyección</h3>
    
    <div class="space-y-6">
      <!-- Gráfico de Temperatura Rectal -->
      <div class="border dark:border-gray-700 rounded-lg p-4">
        <h4 class="font-medium mb-3 text-red-600 dark:text-red-400">
          Proyección de Temperatura Rectal
        </h4>
        
        <FormField label="Título del gráfico">
          <InputControl
            id="titulo_rectal"
            v-model="tituloRectal"
            type="input"
            name="titulo_rectal"
            label="Título"
          />
        </FormField>

        <div class="mt-4">
          <label class="block text-sm font-medium mb-2">Imagen del gráfico</label>
          <FilePond
            name="imagen_rectal"
            label-idle="Arrastra la imagen aquí o <span class='filepond--label-action'>Examinar</span>"
            accepted-file-types="image/png,image/jpeg,image/jpg"
            :server="null"
            :allow-multiple="false"
            credits="false"
            @addfile="handleImagenRectal"
            @removefile="removeImagenRectal"
          />
        </div>
      </div>

      <!-- Gráfico de Temperatura de Piel -->
      <div class="border dark:border-gray-700 rounded-lg p-4">
        <h4 class="font-medium mb-3 text-orange-600 dark:text-orange-400">
          Proyección de Temperatura de Piel
        </h4>
        
        <FormField label="Título del gráfico">
          <InputControl
            id="titulo_piel"
            v-model="tituloPiel"
            type="input"
            name="titulo_piel"
            label="Título"
          />
        </FormField>

        <div class="mt-4">
          <label class="block text-sm font-medium mb-2">Imagen del gráfico</label>
          <FilePond
            name="imagen_piel"
            label-idle="Arrastra la imagen aquí o <span class='filepond--label-action'>Examinar</span>"
            accepted-file-types="image/png,image/jpeg,image/jpg"
            :server="null"
            :allow-multiple="false"
            credits="false"
            @addfile="handleImagenPiel"
            @removefile="removeImagenPiel"
          />
        </div>
      </div>

      <!-- Gráfico de Pérdida de Agua -->
      <div class="border dark:border-gray-700 rounded-lg p-4">
        <h4 class="font-medium mb-3 text-blue-600 dark:text-blue-400">
          Proyección de Pérdida de Agua
        </h4>
        
        <FormField label="Título del gráfico">
          <InputControl
            id="titulo_agua"
            v-model="tituloAgua"
            type="input"
            name="titulo_agua"
            label="Título"
          />
        </FormField>

        <div class="mt-4">
          <label class="block text-sm font-medium mb-2">Imagen del gráfico</label>
          <FilePond
            name="imagen_agua"
            label-idle="Arrastra la imagen aquí o <span class='filepond--label-action'>Examinar</span>"
            accepted-file-types="image/png,image/jpeg,image/jpg"
            :server="null"
            :allow-multiple="false"
            credits="false"
            @addfile="handleImagenAgua"
            @removefile="removeImagenAgua"
          />
        </div>
      </div>
    </div>

    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p class="text-sm text-blue-700 dark:text-blue-300">
        <strong>Nota:</strong> Las imágenes deben estar en formato PNG o JPG. 
        Se recomienda usar imágenes de alta calidad para mejor visualización en el informe.
      </p>
    </div>
  </CardBox>
</template>