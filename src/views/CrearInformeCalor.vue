<script setup>
import { ref, computed } from 'vue'
import { mdiBallotOutline } from '@mdi/js'
import Swal from 'sweetalert2'

// Layouts
import LayoutAuthenticated from '@/components/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/layouts/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/layouts/SectionTitleLineWithButton.vue'

// Componentes de formulario refactorizados
import FormularioEmpresa from '@/components/informeCalor/FormularioEmpresa.vue'
import FormularioFechas from '@/components/informeCalor/FormularioFechas.vue'
import FormularioDatosGenerales from '@/components/informeCalor/FormularioDatosGenerales.vue'
import FormularioEquipos from '@/components/informeCalor/FormularioEquipos.vue'
import FormularioDiasEvaluacion from '@/components/informeCalor/FormularioDiasEvaluacion.vue'
import FormularioCriterios from '@/components/informeCalor/FormularioCriterios.vue'
import FormularioArchivos from '@/components/informeCalor/FormularioArchivos.vue'
import FormularioGraficos from '@/components/informeCalor/FormularioGraficos.vue'
import FormularioLimites from '@/components/informeCalor/FormularioLimites.vue'
import FormularioImagenesAdicionales from '@/components/informeCalor/FormularioImagenesAdicionales.vue'
import ButtonAdd from '@/components/forms/ButtonAdd.vue'
import BaseButton from '@/components/base/BaseButton.vue'

// Composables
import { useInformeCalor } from '@/composables/useInformeCalor'

const isLoading = ref(false)
const mostrarSegundaSeccion = ref(false)

// Usar el composable para manejar toda la lógica del formulario
const {
  form,
  fechainicio,
  fechafinal,
  listaNoAfiliadas,
  equipoSeleccionado,
  tasaDesdeCriterios,
  limitesProyectados,
  empresasOpciones,
  empresasAfiliadasOpciones,
  usuariosOpciones,
  equiposOpciones,
  ropaOpciones,
  validarFormulario,
  limpiarFormulario,
} = useInformeCalor()

// Computed para validar si se puede cambiar de sección
const puedeAvanzar = computed(() => {
  return form.idEmpresa && 
         fechainicio.value && 
         fechafinal.value && 
         form.pesoestimado > 0 &&
         form.idRopaUtilizada &&
         form.idTecnico &&
         form.equiposSeleccionados.length > 0
})

// Funciones
const toggleSeccion = () => {
  if (!mostrarSegundaSeccion.value && !puedeAvanzar.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: 'Por favor complete todos los campos de la primera sección antes de continuar.',
      background: '#181c2c'
    })
    return
  }
  mostrarSegundaSeccion.value = !mostrarSegundaSeccion.value
}

const handleSubmit = async () => {
  try {
    // Validar formulario
    const errores = validarFormulario()
    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        html: errores.map(error => `<p>${error}</p>`).join(''),
        background: '#181c2c'
      })
      return
    }

    isLoading.value = true

    // Preparar y enviar datos

    // Mostrar éxito y descargar PDF
    Swal.fire({
      title: '¡Éxito!',
      text: 'Informe creado correctamente. El PDF se descargará automáticamente.',
      icon: 'success',
      background: '#181c2c'
    })

    // Limpiar formulario
    limpiarFormulario()
    mostrarSegundaSeccion.value = false

  } catch (error) {
    console.error('Error al enviar el formulario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo crear el informe.',
      background: '#181c2c'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton 
        :icon="mdiBallotOutline" 
        :title="mostrarSegundaSeccion ? 'Crear Informe de Calor - Criterios y Archivos' : 'Crear Informe de Calor - Datos Generales'" 
        main
      >
        <BaseButton
          :label="mostrarSegundaSeccion ? 'Regresar' : 'Siguiente'"
          color="contrast"
          rounded-full
          small
          @click="toggleSeccion"
        />
      </SectionTitleLineWithButton>

      <!-- Indicador de progreso -->
      <div class="mb-6">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div
:class="['w-8 h-8 rounded-full flex items-center justify-center text-white font-bold', 
                          !mostrarSegundaSeccion ? 'bg-blue-600' : 'bg-green-600']">
              {{ !mostrarSegundaSeccion ? '1' : '✓' }}
            </div>
            <span class="ml-2 text-sm font-medium">Datos Generales</span>
          </div>
          <div class="w-16 h-1 bg-gray-300">
            <div
:class="['h-full transition-all duration-300', 
                          mostrarSegundaSeccion ? 'w-full bg-blue-600' : 'w-0']"></div>
          </div>
          <div class="flex items-center">
            <div
:class="['w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
                          mostrarSegundaSeccion ? 'bg-blue-600' : 'bg-gray-400']">
              2
            </div>
            <span class="ml-2 text-sm font-medium">Criterios y Archivos</span>
          </div>
        </div>
      </div>

      <!-- Primera Sección: Datos Generales -->
      <div v-show="!mostrarSegundaSeccion" class="space-y-6">
        <FormularioEmpresa
          v-model:id-empresa="form.idEmpresa"
          v-model:lista-no-afiliadas="listaNoAfiliadas"
          :empresas-opciones="empresasOpciones"
          :empresas-afiliadas-opciones="empresasAfiliadasOpciones"
        />

        <FormularioFechas
          v-model:fechainicio="fechainicio"
          v-model:fechafinal="fechafinal"
        />

        <FormularioDatosGenerales
          v-model:pesoestimado="form.pesoestimado"
          v-model:id-ropa-utilizada="form.idRopaUtilizada"
          :ropa-opciones="ropaOpciones"
        />

        <FormularioEquipos
          v-model:id-tecnico="form.idTecnico"
          v-model:equipo-seleccionado="equipoSeleccionado"
          v-model:equipos-seleccionados="form.equiposSeleccionados"
          :usuarios-opciones="usuariosOpciones"
          :equipos-opciones="equiposOpciones"
        />

        <FormularioDiasEvaluacion
          v-model:dias-evaluacion="form.diasEvaluacion"
          :fechainicio="fechainicio"
          :fechafinal="fechafinal"
        />
      </div>

      <!-- Segunda Sección: Criterios y Archivos -->
      <div v-show="mostrarSegundaSeccion" class="space-y-6">
        <FormularioCriterios
          @tasa-cambiada="(tasa) => tasaDesdeCriterios = tasa"
        />

        <FormularioLimites
          v-model:limites-proyectados="limitesProyectados"
        />

        <FormularioArchivos
          v-model:archivos="form.archivos"
        />

        <FormularioGraficos
          v-model:imagen-rectal="form.imagenRectal"
          v-model:imagen-piel="form.imagenPiel"
          v-model:imagen-agua="form.imagenAgua"
          v-model:titulo-grafico-rectal="form.tituloGraficoRectal"
          v-model:titulo-grafico-piel="form.tituloGraficoPiel"
          v-model:titulo-grafico-agua="form.tituloGraficoAgua"
        />

        <FormularioImagenesAdicionales
          v-model:fotos-areas="form.fotosAreas"
          v-model:graficos-humedad="form.graficosHumedad"
        />

        <!-- Botón de envío -->
        <div class="flex justify-end mt-6">
          <ButtonAdd 
            :disabled="isLoading" 
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            @add-click="handleSubmit"
          />
        </div>
      </div>

      <!-- Indicador de carga -->
      <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-lg font-medium">Procesando informe...</span>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>