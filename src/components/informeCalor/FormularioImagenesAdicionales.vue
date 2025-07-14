<!-- src/components/informeCalor/FormularioImagenesAdicionales.vue -->
<script setup>
import { computed, ref, watch } from 'vue'
import CardBox from '@/components/base/CardBox.vue'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)

const props = defineProps({
  fotosAreas: {
    type: Array,
    default: () => []
  },
  graficosHumedad: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:fotosAreas', 'update:graficosHumedad'])

// Referencias a los componentes FilePond
const pondFotosAreas = ref(null)
const pondGraficosHumedad = ref(null)

// Files locales para cada FilePond
const filesFotosAreas = ref([])
const filesGraficosHumedad = ref([])

// Computed properties para manejar los arrays
const fotosAreasLocal = computed({
  get: () => props.fotosAreas,
  set: (value) => emit('update:fotosAreas', value)
})

const graficosHumedadLocal = computed({
  get: () => props.graficosHumedad,
  set: (value) => emit('update:graficosHumedad', value)
})

// Handlers para fotos de áreas
const onFotosAreasAdd = (error, fileItem) => {
  if (!error && fileItem?.file) {
    const nuevasFotos = [...fotosAreasLocal.value, fileItem.file]
    fotosAreasLocal.value = nuevasFotos
    console.log('Foto de área agregada:', fileItem.file.name)
  }
}

const onFotosAreasRemove = (error, fileItem) => {
  if (!error && fileItem?.file) {
    const index = fotosAreasLocal.value.findIndex(f => f.name === fileItem.file.name)
    if (index > -1) {
      const nuevasFotos = [...fotosAreasLocal.value]
      nuevasFotos.splice(index, 1)
      fotosAreasLocal.value = nuevasFotos
      console.log('Foto de área eliminada')
    }
  }
}

// Handlers para gráficos de humedad
const onGraficosHumedadAdd = (error, fileItem) => {
  if (!error && fileItem?.file) {
    const nuevosGraficos = [...graficosHumedadLocal.value, fileItem.file]
    graficosHumedadLocal.value = nuevosGraficos
    console.log('Gráfico de humedad agregado:', fileItem.file.name)
  }
}

const onGraficosHumedadRemove = (error, fileItem) => {
  if (!error && fileItem?.file) {
    const index = graficosHumedadLocal.value.findIndex(f => f.name === fileItem.file.name)
    if (index > -1) {
      const nuevosGraficos = [...graficosHumedadLocal.value]
      nuevosGraficos.splice(index, 1)
      graficosHumedadLocal.value = nuevosGraficos
      console.log('Gráfico de humedad eliminado')
    }
  }
}

// Watchers para limpiar FilePond cuando se limpian las props
watch(() => props.fotosAreas, (newVal) => {
  if (newVal.length === 0 && pondFotosAreas.value) {
    filesFotosAreas.value = []
  }
})

watch(() => props.graficosHumedad, (newVal) => {
  if (newVal.length === 0 && pondGraficosHumedad.value) {
    filesGraficosHumedad.value = []
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Fotos de Áreas -->
    <CardBox>
      <h3 class="text-lg font-semibold mb-4">Fotos de Áreas</h3>
      
      <div>
        <label class="block text-sm font-medium mb-2">
          Subir fotos de las áreas evaluadas
        </label>
        
        <FilePond
          ref="pondFotosAreas"
          v-model:files="filesFotosAreas"
          name="fotos_areas"
          label-idle="Arrastra y suelta tus fotos aquí o <span class='filepond--label-action'>Examinar</span>"
          accepted-file-types="image/png,image/jpeg,image/jpg"
          :server="null"
          :allow-multiple="true"
          :allow-paste="false"
          credits="false"
          @addfile="onFotosAreasAdd"
          @removefile="onFotosAreasRemove"
        />
        
        <p class="text-xs text-gray-500 mt-2">
          Formatos aceptados: PNG, JPG, JPEG - Puede subir múltiples fotos
        </p>
      </div>

      <div v-if="fotosAreasLocal.length > 0" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p class="text-sm text-green-700 dark:text-green-300">
          <strong>{{ fotosAreasLocal.length }} foto(s) cargada(s)</strong>
        </p>
      </div>
    </CardBox>

    <!-- Gráficos de Humedad -->
    <CardBox>
      <h3 class="text-lg font-semibold mb-4">Gráficos de Humedad</h3>
      
      <div>
        <label class="block text-sm font-medium mb-2">
          Subir gráficos de humedad
        </label>
        
        <FilePond
          ref="pondGraficosHumedad"
          v-model:files="filesGraficosHumedad"
          name="graficos_humedad"
          label-idle="Arrastra y suelta tus gráficos aquí o <span class='filepond--label-action'>Examinar</span>"
          accepted-file-types="image/png,image/jpeg,image/jpg"
          :server="null"
          :allow-multiple="true"
          :allow-paste="false"
          credits="false"
          @addfile="onGraficosHumedadAdd"
          @removefile="onGraficosHumedadRemove"
        />
        
        <p class="text-xs text-gray-500 mt-2">
          Formatos aceptados: PNG, JPG, JPEG - Puede subir múltiples gráficos
        </p>
      </div>

      <div v-if="graficosHumedadLocal.length > 0" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          <strong>{{ graficosHumedadLocal.length }} gráfico(s) cargado(s)</strong>
        </p>
      </div>
    </CardBox>
  </div>
</template>

<style>
/* Heredamos los estilos de FilePond del componente de archivos */
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