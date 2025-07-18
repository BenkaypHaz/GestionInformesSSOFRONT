<script setup>
import { ref, computed, nextTick } from 'vue'
import { mdiBallotOutline } from '@mdi/js'
import Swal from 'sweetalert2'

// Layouts
import LayoutAuthenticated from '@/components/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/layouts/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/layouts/SectionTitleLineWithButton.vue'

// Componentes de formulario refactorizados
import FormularioPanelDatos from '@/components/informeCalor/FormularioPanelDatos.vue'
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
  limitesProyectados,
  empresasOpciones,
  empresasAfiliadasOpciones,
  usuariosOpciones,
  equiposOpciones,
  ropaOpciones,
  validarFormulario,
  limpiarFormulario,
  prepararPayload
} = useInformeCalor()

// Computed para validar si se puede cambiar de sección
const puedeAvanzar = computed(() => {
  // Validar panel de datos
  const panelDatosValido = form.panelDatos.cantidadAreas > 0 && 
                          form.panelDatos.datosPorArea.length > 0 &&
                          form.panelDatos.datosPorArea.every(area => 
                            area.wbgt && area.bulboSeco && area.bulboHumedo && 
                            area.cuerpoNegro && area.indiceTermico && area.humedadPromedio
                          )
  
  return panelDatosValido &&
         form.idEmpresa && 
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
    const { response } = await prepararPayload()

    // Mostrar éxito
    await Swal.fire({
      title: '¡Éxito!',
      text: response.message || 'Informe y archivo procesados correctamente.',
      icon: 'success',
      background: '#181c2c'
    })

    // Limpiar formulario y resetear a primera sección
    limpiarFormulario()
    mostrarSegundaSeccion.value = false
    
    // Forzar actualización de componentes
    await nextTick()

  } catch (error) {
    console.error('Error enviando el formulario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'No se pudo enviar la información.',
      background: '#181c2c'
    })
  } finally {
    isLoading.value = false
  }
}

const testing = async () => {

    limpiarFormulario()

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
        <FormularioPanelDatos
          v-model="form.panelDatos"
        />

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

                   <div class="flex justify-end mt-6">
          <ButtonAdd 
            :disabled="isLoading" 
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            @add-click="testing"
          />
        </div>
      </div>

      <!-- Segunda Sección: Criterios y Archivos -->
      <div v-show="mostrarSegundaSeccion" class="space-y-6">
         <FormularioCriterios v-model="form.criterios" />


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
          <div class="flex flex-col items-center space-y-4">
            <!-- Loader animado tipo documento -->
            <div class="loader">
              <div>
                <ul>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120" class="w-20 h-24">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120" class="w-20 h-24">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                  <li>
                    <svg fill="currentColor" viewBox="0 0 90 120" class="w-20 h-24">
                      <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
            <span class="text-lg font-medium dark:text-white">Procesando informe...</span>
            <p class="text-sm text-gray-600 dark:text-gray-400">Esto puede tomar unos momentos</p>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
/* Estilos para el loader animado */
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader > div > ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.loader > div > ul > li {
  height: 100px;
  width: 80px;
  margin: 0 5px;
  animation: animate 0.6s cubic-bezier(0.87, 0, 0.13, 1) infinite;
}

.loader > div > ul > li:nth-child(2) {
  animation-delay: 0.1s;
}

.loader > div > ul > li:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes animate {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.loader svg {
  fill: #3B82F6;
}

.dark .loader svg {
  fill: #60A5FA;
}
</style>