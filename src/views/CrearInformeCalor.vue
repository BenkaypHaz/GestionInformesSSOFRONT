<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { empresasService } from '@/services/EmpresasService'
import { userService } from '@/services/UsuariosService'
import { EquiposService } from '@/services/EquiposService'
import { InformeCalorService } from '@/services/InformeCalor'
import Swal from 'sweetalert2'
import { mdiBallotOutline } from '@mdi/js'
import SectionMain from '../components/layouts/SectionMain.vue'
import CardBox from '../components/base/CardBox.vue'
import FormField from '../components/forms/FormField.vue'
import FormControl from '../components/forms/FormControl.vue'
import LayoutAuthenticated from '../components/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '../components/layouts/SectionTitleLineWithButton.vue'
import InputControl from '../components/forms/InputControl.vue'
import ButtonAdd from '../components/forms/ButtonAdd.vue'
import ButtonDelete from '../components/forms/ButtonDelete.vue'
import CheckButton from '../components/forms/CheckButton.vue'
import TimeSlider from '@/components/forms/TimeSlider.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import TablaEquipos from '@/components/forms/TablaEquipos.vue'
import TablaCriterios from '@/components/forms/TablaCriterios.vue'
import dayjs from 'dayjs'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import * as pdfjsLib from 'pdfjs-dist/webpack'

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)
const isLoading = ref(false); // Nueva variable para el estado de carga

const form = reactive({
  idEmpresa: 1,
  activo: true,
  tasaestimada: 0.0,
  pesoestimado: 0.0,
  idRopaUtilizada: 1,
  archivos: [],
  equiposSeleccionados: [],
  idTecnico: null,
  diasEvaluacion: [],
  imagenRectal: [],
  imagenPiel: [],
  imagenAgua: [],
  tituloGraficoAgua: 'Proyección de pérdida de agua',
  tituloGraficoPiel: 'Proyección de temperatura de piel',
  tituloGraficoRectal: 'Proyección de temperatura rectal',
  idInforme: null
})

const equiposOpciones = ref([])
const empresasOpciones = ref([])
const empresasaAfiliadasOpciones = ref([])
const usuariosOpciones = ref([])
const listaNoAfiliadas = ref(false)
const fechainicio = ref(null)
const fechafinal = ref(null)
const daysBetween = ref([])
const equipoSeleccionado = ref(null)
const time = ref(null)
const mostrarSegundaSeccion = ref(false) // false muestra la primera sección, true muestra la segunda
const ropaOpciones = ref([])
const tasaDesdeCriterios = ref(0)

const toggleSeccion = () => {
  mostrarSegundaSeccion.value = !mostrarSegundaSeccion.value
}

const fetchRopaUtilizada = async () => {
  try {
    const response = await InformeCalorService.getRopaUtilizada()
    if (response.success) {
      ropaOpciones.value = response.data.map((ropa) => ({
        id: ropa.idRopa,
        label: `${ropa.nombre} - (${ropa.cyF})`
      }))
    }
  } catch (error) {
    console.error('Error cargando ropa utilizada:', error)
  }
}

const submitForm = async () => {
  try {
    // Validación previa
    const errores = []
    if (!form.idEmpresa) errores.push('Empresa evaluada no seleccionada.')
    if (!fechainicio.value) errores.push('Fecha de inicio no seleccionada.')
    if (!fechafinal.value) errores.push('Fecha de fin no seleccionada.')
    if (form.equiposSeleccionados.length === 0) errores.push('No se han seleccionado equipos.')
    if (!form.archivos || form.archivos.length === 0)
      errores.push('No se ha subido ningún archivo.')
    if (!form.pesoestimado) errores.push('El peso promedio no puede ser cero.')
  if (form.imagenRectal.length === 0) errores.push('No se ha subido la imagen para Proyección de temperatura rectal.')
    if (form.imagenPiel.length === 0) errores.push('No se ha subido la imagen para Proyección de temperatura de piel.')
    if (form.imagenAgua.length === 0) errores.push('No se ha subido la imagen para Proyección de pérdida de agua.')
     if (!form.tituloGraficoRectal.trim()) errores.push('El título para Proyección de temperatura rectal no puede estar vacío.');
    if (!form.tituloGraficoPiel.trim()) errores.push('El título para Proyección de temperatura de piel no puede estar vacío.');
    if (!form.tituloGraficoAgua.trim()) errores.push('El título para Proyección de pérdida de agua no puede estar vacío.');
    if (fechainicio.value && fechafinal.value && dayjs(fechafinal.value).isBefore(dayjs(fechainicio.value))) {
      errores.push('La fecha de fin no puede ser anterior a la fecha de inicio.')
    }
    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        html: errores.map((error) => `<p>${error}</p>`).join(''),
        background: '#181c2c'
      })
      return
    }
    isLoading.value = true;

    // Crear el payload estructurado correctamente
    const payload = {
      IdEmpresa: form.idEmpresa,
      EsAfiliada: listaNoAfiliadas.value ? false : true,
      FechaInicia: fechainicio.value ? new Date(fechainicio.value).toISOString() : null,
      FechaFinaliza: fechafinal.value ? new Date(fechafinal.value).toISOString() : null,
      IdTecnico: form.idTecnico,
      Tasa_Estimada: tasaDesdeCriterios.value,
      Peso_Promedio: form.pesoestimado,
      IdRopaUtilizada: form.idRopaUtilizada,
      EquiposUtilizados: form.equiposSeleccionados.map((equipo) => ({
        IdEquipo: equipo.id // Coincide con EquipoUtilizadoRequest
      })),
      DiasEvaluacion: form.diasEvaluacion.map((dia) => ({
        Dia: dia.dia, // Coincide con DiaEvaluacionRequest
        HumedadRelativa: dia.humedadRelativa || '', // Asegura string
        ParcialmenteNublado: dia.parcialmenteNublado || '', // Asegura string
        TemperaturaMaxima: dia.temperaturaMaxima || '', // Asegura string
        TemperaturaMinima: dia.temperaturaMinima || '' // Asegura string
      })),
        titulosGraficos: [
        {
          id: 0,
          idInforme: 0,
          titulo: form.tituloGraficoRectal,
          tipo_grafico: 1 // 1 para Gráfico Rectal
        },
        {
          id: 0,
          idInforme: 0,
          titulo: form.tituloGraficoPiel,
          tipo_grafico: 2 // 2 para Gráfico Temperatura Piel
        },
        {
          id: 0,
          idInforme: 0,
          titulo: form.tituloGraficoAgua,
          tipo_grafico: 3 // 3 para Gráfico Pérdida de Agua
        }
      ]
    }

    // Llamada al endpoint de creación del informe
    const response = await InformeCalorService.crearInforme(payload)

    // Obtener el informeId del response
    const informeId = response.data

    // Subir el archivo Excel
    const formData = new FormData()
    formData.append('file', form.archivos[0]) // Archivo
    formData.append('informeId', informeId) // informeId separado

    const response2 = await InformeCalorService.subirArchivoExcel(formData)

    // Subir imágenes si existen
const imagenes = [
  { archivo: form.imagenRectal[0], tipo: 'Rectal' },
  { archivo: form.imagenPiel[0], tipo: 'Piel' },
  { archivo: form.imagenAgua[0], tipo: 'Agua' }
]

console.log('Estado de las imágenes antes de subir:', {
  rectal: form.imagenRectal,
  piel: form.imagenPiel,
  agua: form.imagenAgua
})
    for (const img of imagenes) {
  console.log('Procesando imagen:', img)
      if (img.archivo) {
            console.log('Subiendo archivo válido:', img.archivo.name, 'Tipo:', img.tipo)

        const imagenData = new FormData()
        imagenData.append('file', img.archivo)
        imagenData.append('informeId', informeId)
        imagenData.append('tipo', img.tipo) // Por ejemplo para saber qué imagen es

        // Simulación de llamada a backend (haz esto cuando tengas el endpoint real)
        await InformeCalorService.subirImagen(imagenData)
      }
    }

    const pdfBlob = await InformeCalorService.descargarInformePDF(informeId)
    const url = window.URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Informe_Calor.pdf'
    a.click()
    window.URL.revokeObjectURL(url) // Liberar memoria

    Swal.fire({
      title: '¡Éxito!',
      text: response2.message || 'Informe y archivo procesados correctamente.',
      icon: 'success',
      background: '#181c2c'
    })

    clearForm()
  } catch (error) {
    console.error('Error enviando el formulario:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'No se pudo enviar la información.',
      background: '#181c2c'
    });
  }finally {
    // 6. Desactiva el loader en el bloque finally
    isLoading.value = false;
  }
}

const mostrarInforme = async () => {
  try {
    console.log('Iniciando mostrarInforme')
    console.log('ID del Informe:', form.idInforme)

    const pdfBlob = await InformeCalorService.descargarInformePDF(7)
    pdfUrl.value = URL.createObjectURL(pdfBlob)

    // Renderiza el PDF en el contenedor
    await loadPdf(pdfUrl.value)
  } catch (error) {
    console.error('Error al mostrar el informe:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo mostrar el informe.',
      background: '#181c2c'
    })
  }
}

const onFileAdded = (error, file) => {
  console.log('Evento onFileAdded disparado:', { error, file })

  if (!error && file?.file) {
    // Accede al archivo real dentro de `file.file`
    form.archivos = [file.file] // Almacena solo la referencia al archivo real
    console.log('Archivo agregado correctamente:', form.archivos)
  } else {
    console.error('Error al agregar archivo o archivo no válido:', error)
  }
}

const onFileRemoved = (error, file) => {
  if (!error) {
    console.log('Archivo eliminado:', file)
    console.log('Archivos actuales en form.archivos:', form.archivos)
  } else {
    console.error('Error al eliminar el archivo:', error)
  }
}

watch(time, (newTime) => {
  console.log('Hora seleccionada:', newTime)
})

const clearForm = () => {
  form.idEmpresa = 1
  form.archivos = []
  form.equiposSeleccionados = []
  fechainicio.value = null
  fechafinal.value = null
  daysBetween.value = []
}

const generateDynamicDays = () => {
  if (fechainicio.value && fechafinal.value) {
    const start = dayjs(fechainicio.value)
    const end = dayjs(fechafinal.value)
    const diff = end.diff(start, 'day')

    if (diff >= 0) {
      form.diasEvaluacion = Array.from({ length: diff + 1 }, (_, i) => ({
        dia: `Día ${i + 1}`,
        humedadRelativa: '',
        parcialmenteNublado: '',
        temperaturaMaxima: '',
        temperaturaMinima: ''
      }))
    } else {
      form.diasEvaluacion = []
    }
  } else {
    form.diasEvaluacion = []
  }
}

watch([fechainicio, fechafinal], generateDynamicDays)

const agregarEquipoSeleccionado = () => {
  if (equipoSeleccionado.value) {
    const existe = form.equiposSeleccionados.some(
      (equipo) => equipo.id === equipoSeleccionado.value
    )
    if (!existe) {
      const equipo = equiposOpciones.value.find((eq) => eq.id === equipoSeleccionado.value)
      if (equipo) {
        form.equiposSeleccionados.push({
          id: equipo.id,
          label: equipo.label,
          modelo: equipo.modelo,
          marca: equipo.marca,
          serie: equipo.serie
        })
        equipoSeleccionado.value = null
      }
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'El equipo ya está en la lista.',
        icon: 'warning',
        background: '#181c2c'
      })
    }
  }
}

watch(equipoSeleccionado, () => {
  agregarEquipoSeleccionado()
})

const fetchEquipos = async () => {
  try {
    const response = await EquiposService.getAllEquipos()
    if (response.success) {
      equiposOpciones.value = response.data.map((equ) => ({
        id: equ.idEquipo,
        label: equ.nombre,
        modelo: equ.modelo,
        marca: equ.marca,
        serie: equ.serie
      }))
    }
  } catch (error) {
    console.error('Error cargando equipos:', error)
  }
}

const fetchUsuarios = async () => {
  try {
    const response = await userService.getAllUsers()
    if (response.success) {
      usuariosOpciones.value = response.data.map((usu) => ({
        id: usu.idUsuario,
        label: usu.nombre
      }))
    }
  } catch (error) {
    console.error('Error cargando empresas no afiliadas:', error)
  }
}

const fetchEmpresasAfiliadas = async () => {
  try {
    const response = await empresasService.getAllEmpresasSac()
    if (response.success) {
      empresasaAfiliadasOpciones.value = response.data.map((emp) => ({
        id: emp.id_empresa,
        label: emp.nombre_empresa
      }))
    }
  } catch (error) {
    console.error('Error cargando empresas no afiliadas:', error)
  }
}

const fetchEmpresasNoAfiliadas = async () => {
  try {
    const response = await empresasService.getAllEmpresas()
    if (response.success) {
      empresasOpciones.value = response.data.map((emp) => ({
        id: emp.IdEmpresa,
        label: emp.nombre
      }))
    }
  } catch (error) {
    console.error('Error cargando empresas no afiliadas:', error)
  }
}
const pdfUrl = ref('')

async function generateReport() {
  try {
    const pdfBlob = await InformeCalorService.descargarInformePDF(form.idInforme)
    if (pdfBlob instanceof Blob) {
      pdfUrl.value = URL.createObjectURL(pdfBlob)
      await loadPdf(pdfUrl.value)
    } else {
      console.error('Fetched data is not a Blob:', pdfBlob)
    }
  } catch (error) {
    console.error('Error during report fetching or Blob creation:', error)
    Swal.fire({
      title: "<h3 style='color:white'>Error</h3>",
      html: "<h1 style='color:white'>" + error.message + '</h1>',
      icon: 'error',
      background: '#181c2c'
    })
  }
}

async function loadPdf(url) {
  try {
    const pdf = await pdfjsLib.getDocument(url).promise
    const container = document.getElementById('pdfContainer')
    container.innerHTML = '' // Clear previous PDF content

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)
      const scale = 1.5
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      canvas.style.display = 'block'
      canvas.style.marginBottom = '20px'

      container.appendChild(canvas)

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      await page.render(renderContext).promise
    }
  } catch (error) {
    console.error('Error during PDF loading or rendering:', error)
  }
}

const onFilePondAdd = (tipo, error, fileItem) => {
  console.log('Evento onFilePondAdd disparado:', { tipo, error, fileItem })
  
  if (!error && fileItem?.file) {
    // Accede al archivo real dentro de `fileItem.file`
    if (tipo === 'Rectal') {
      form.imagenRectal = [fileItem.file]
      console.log('Imagen Rectal agregada:', form.imagenRectal)
    }
    if (tipo === 'Piel') {
      form.imagenPiel = [fileItem.file]
      console.log('Imagen Piel agregada:', form.imagenPiel)
    }
    if (tipo === 'Agua') {
      form.imagenAgua = [fileItem.file]
      console.log('Imagen Agua agregada:', form.imagenAgua)
    }
  } else {
    console.error('Error al agregar imagen o archivo no válido:', error)
  }
}

onMounted(() => {
  fetchEmpresasNoAfiliadas()
  fetchEmpresasAfiliadas()
  fetchUsuarios()
  fetchEquipos()
  fetchRopaUtilizada()
})
</script>

<template>
  <LayoutAuthenticated>
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader"> <div>
          <ul>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
            <li>
              <svg fill="currentColor" viewBox="0 0 90 120">
                <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
              </svg>
            </li>
          </ul>
        </div>
        <span>Generando...</span>
      </div>
      </div>
    <SectionMain>
      <div v-if="!mostrarSegundaSeccion">
        <SectionTitleLineWithButton
          :icon="mdiBallotOutline"
          title="Informacion General del Informe"
          main
        >
        </SectionTitleLineWithButton>
        <CardBox form @submit.prevent="submitForm">
          <FormField label="Empresa Evaluada">
            <div>
              <FormControl
                v-if="!listaNoAfiliadas"
                :options="empresasaAfiliadasOpciones"
                v-model="form.idEmpresa"
                label="Empresa Afiliada"
              />
              <FormControl
                v-else
                :options="empresasOpciones"
                v-model="form.idEmpresa"
                label="Empresa No Afiliada"
              />
            </div>
            <CheckButton v-model="listaNoAfiliadas" label="Listado no Afiliadas" />
          </FormField>

          <FormField label="Fechas de evaluación">
            <VueDatePicker
              v-model="fechainicio"
              class="custom-datepicker"
              :month-change-on-scroll="false"
              dark
              :enable-time-picker="false"
              auto-apply
              placeholder="Desde:"
            />
            <VueDatePicker
              v-model="fechafinal"
              class="custom-datepicker"
              :month-change-on-scroll="false"
              dark
              :enable-time-picker="false"
              auto-apply
              placeholder="Hasta:"
            />
          </FormField>

          <FormField label="Peso Promedio">
            <InputControl
              type="cantidad"
              name="Peso"
              id="Peso"
              label="Peso(Libras)"
              v-model="form.pesoestimado"
            />
          </FormField>
          <FormField label="Ropa Utilizada">
            <FormControl
              :options="ropaOpciones"
              v-model="form.idRopaUtilizada"
              label="Ropa Usada"
            />
          </FormField>

          <FormField label="Nombre del técnico y equipo utilizado">
            <FormControl :options="usuariosOpciones" v-model="form.idTecnico" label="Usuarios" />
            <FormControl
              :options="[{ id: null, label: 'Seleccione una opción' }, ...equiposOpciones]"
              v-model="equipoSeleccionado"
              label="Equipos"
            />
          </FormField>
          <CardBox class="mb-6" has-table>
            <TablaEquipos :equiposSeleccionados="form.equiposSeleccionados" />
          </CardBox>
          <div v-for="(day, index) in form.diasEvaluacion" :key="index">
            <FormField :label="day.dia">
              <InputControl
                type="input"
                :name="`humedad_relativa_${index}`"
                id="humedad_relativa"
                label="Humedad Relativa"
                v-model="day.humedadRelativa"
              />
              <InputControl
                type="input"
                :name="`parcialmente_nublado_${index}`"
                id="parcialmente_nublado"
                label="Parcialmente nublado"
                v-model="day.parcialmenteNublado"
              />
              <InputControl
                type="input"
                :name="`temperatura_maxima_${index}`"
                id="temperatura_maxima"
                label="Temperatura máxima"
                v-model="day.temperaturaMaxima"
              />
              <InputControl
                type="input"
                :name="`temperatura_minima_${index}`"
                id="temperatura_minima"
                label="Temperatura mínima"
                v-model="day.temperaturaMinima"
              />
            </FormField>
          </div>
        </CardBox>
        <br />
        <SectionTitleLineWithButton
          :icon="mdiBallotOutline"
          title="Factores personales y de trabajo considerados"
          main
        >
        </SectionTitleLineWithButton>
        <CardBox class="mb-6" has-table>
          <TablaCriterios @tasa-cambiada="tasaDesdeCriterios = $event" />
        </CardBox>
      </div>
      <br />

     <SectionTitleLineWithButton
  :icon="mdiBallotOutline"
  title="Grafico Proyeccion de temperatura rectal"
  main
>
</SectionTitleLineWithButton>
<CardBox>
   <FormField label="Modificar Titulo del Gráfico">
            <InputControl
              type="input"
              name="rectal"
              id="rectal"
              v-model="form.tituloGraficoRectal"
            />
          </FormField>
  <FormField label="Subir Imagen">
    <FilePond
      label-idle="Arrastra y suelta tu archivo aquí o haz clic para buscar"
      :allow-multiple="false"
      :instant-upload="false"
      :accepted-file-types="['image/png', 'image/jpeg']"
      @addfile="(err, fileItem) => onFilePondAdd('Rectal', err, fileItem)"
      @removefile="(err, fileItem) => onFilePondRemove('Rectal', err, fileItem)"
    />
  </FormField>
</CardBox>

<br />

<!-- Grafico proyeccion de temperatura de piel -->
<SectionTitleLineWithButton
  :icon="mdiBallotOutline"
  title="Grafico proyeccion de temperatura de piel"
  main
>
</SectionTitleLineWithButton>
<CardBox>
   <FormField label="Modificar Titulo del Gráfico">
            <InputControl
              type="input"
              name="piel"
              id="piel"
              v-model="form.tituloGraficoPiel"
            />
          </FormField>
  <FormField label="Subir Imagen">
    <FilePond
      label-idle="Arrastra y suelta tu archivo aquí o haz clic para buscar"
      :allow-multiple="false"
      :instant-upload="false"
      :accepted-file-types="['image/png', 'image/jpeg']"
      @addfile="(err, fileItem) => onFilePondAdd('Piel', err, fileItem)"
      @removefile="(err, fileItem) => onFilePondRemove('Piel', err, fileItem)"
    />
  </FormField>
</CardBox>

<br />

<!-- Grafico proyeccion de perdida de agua -->
<SectionTitleLineWithButton
  :icon="mdiBallotOutline"
  title="Grafico proyeccion de perdida de agua"
  main
>
</SectionTitleLineWithButton>
<CardBox>
    <FormField label="Modificar Titulo del Gráfico">
              <InputControl
                type="input"
                name="agua"
                id="agua"
                v-model="form.tituloGraficoAgua"
              />
            </FormField>
  <FormField label="Subir Imagen">
    <FilePond
      label-idle="Arrastra y suelta tu archivo aquí o haz clic para buscar"
      :allow-multiple="false"
      :instant-upload="false"
      :accepted-file-types="['image/png', 'image/jpeg']"
      @addfile="(err, fileItem) => onFilePondAdd('Agua', err, fileItem)"
      @removefile="(err, fileItem) => onFilePondRemove('Agua', err, fileItem)"
    />
  </FormField>
</CardBox> 
      <br />
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Subir archivo Excel" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Subir Excel">
          <FilePond
            label-idle="Arrastra y suelta tu archivo aquí o haz clic para buscar"
            :allow-multiple="false"
            :instant-upload="false"
            :accepted-file-types="[
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]"
            v-model="form.archivos"
            @addfile="onFileAdded"
            @removefile="onFileRemoved"
          />
        </FormField>

        <div class="w-full flex justify-center mt-4">
          <ButtonAdd button-text="Generar" @add-click="submitForm" />
        </div>

        <div class="report-container" v-if="pdfUrl">
          <div id="pdfContainer" class="pdf-container"></div>
        </div>
      </CardBox>

      <div v-if="mostrarSegundaSeccion">
        <!-- Segunda sección del formulario -->
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Detalles Adicionales" main />
        <!-- Aquí puedes agregar los campos o información adicional para esta segunda sección -->
        <button class="button-3d" @click="mostrarSegundaSeccion = false">
          <div class="button-top">
            <span class="material-icons">❮</span>
          </div>
          <div class="button-bottom"></div>
          <div class="button-base"></div>
        </button>
        <!-- Aquí puedes continuar agregando otros elementos que necesitas en la segunda sección -->
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; /* Permite scroll si el contenido excede la altura */
  max-height: 500px; /* Ajusta según tu diseño */
}

canvas {
  margin-bottom: 16px;
  border: 1px solid #ddd;
  max-width: 100%;
  height: auto;
}

/* From Uiverse.io by Z4drus */
.button-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.button-3d {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  border-width: 0;
  padding: 0 8px;
  min-width: 4em;
  min-height: 4em;
  box-sizing: border-box;
  background: transparent;
  font: inherit;
  cursor: pointer;
  margin: 10px;
  border-radius: 20px;
}

.button-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 8px 16px;
  transform: translateY(0);
  color: #fff;
  background-image: linear-gradient(145deg, #6a11cb, #2575fc);
  text-shadow: 0 -1px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  transition:
    transform 0.3s,
    border-radius 0.3s,
    background 10s;
}

.button-3d:active .button-top {
  border-radius: 10px 10px 8px 8px / 8px;
  transform: translateY(2px);
  background-image: linear-gradient(145deg, #2575fc, #6a11cb);
}

.button-bottom {
  position: absolute;
  z-index: 1;
  bottom: 4px;
  left: 4px;
  border-radius: 20px;
  padding-top: 6px;
  width: calc(100% - 8px);
  height: calc(100% - 10px);
  background-image: linear-gradient(145deg, #2575fc, #6a11cb);
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.5);
  transition:
    border-radius 0.2s,
    padding-top 0.2s;
}

.button-base {
  position: absolute;
  z-index: 0;
  top: 4px;
  left: 0;
  border-radius: 20px;
  width: 100%;
  height: calc(100% - 4px);
  background-color: rgba(0, 0, 0, 0.15);
  box-shadow:
    0 1px 1px 0 rgba(255, 255, 255, 0.75),
    inset 0 2px 2px rgba(0, 0, 0, 0.25);
  transition:
    border-radius 0.2s,
    padding-top 0.2s;
}

.button-3d:active .button-bottom {
  border-radius: 10px 10px 8px 8px / 8px;
  padding-top: 0;
}

.button-3d:active .button-base {
  border-radius: 10px 10px 8px 8px / 8px;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* Un poco más oscuro si prefieres */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* INICIO: Nuevo CSS del Loader (de Uiverse.io by Nawsome) */
.loader { /* Esta es la clase principal del nuevo loader */
  --background: linear-gradient(135deg, #23C4F8, #275EFE);
  --shadow: rgba(39, 94, 254, 0.35); /* Sombra un poco más visible */
  --text: #E0E0E0; /* Color de texto "Loading" más claro para fondo oscuro */
  --page: rgba(200, 220, 255, 0.3); /* Color de página más claro/adaptado */
  --page-fold: rgba(180, 200, 235, 0.45); /* Color de pliegue de página más claro/adaptado */
  --duration: 3s;
  width: 200px;
  height: 140px;
  position: relative;
}

.loader:before, .loader:after {
  --r: -6deg;
  content: "";
  position: absolute;
  bottom: 8px; /* Sombra debajo del libro */
  width: 120px;
  top: calc(100% - 30px); /* Ajustado para que la sombra esté bajo el libro */
  height: 30px; /* Altura de la sombra */
  box-shadow: 0 16px 12px var(--shadow);
  transform: rotate(var(--r));
  z-index: 0; /* Detrás del div principal del loader si es necesario */
}

.loader:before {
  left: 4px;
}

.loader:after {
  --r: 6deg;
  right: 4px;
}

.loader div { /* El contenedor del libro animado */
  width: 100%;
  height: 100%;
  border-radius: 13px;
  position: relative;
  z-index: 1; /* Por encima de las sombras :before/:after */
  perspective: 600px;
  box-shadow: 0 4px 6px var(--shadow);
  background-image: var(--background);
}

.loader div ul {
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
}

.loader div ul li {
  --r: 180deg; /* Rotación inicial de las páginas */
  --o: 0;      /* Opacidad inicial */
  --c: var(--page); /* Color de la página */
  position: absolute;
  top: 10px;
  left: 10px;
  transform-origin: 100% 50%; /* Punto de rotación (lomo del libro) */
  color: var(--c);
  opacity: var(--o);
  transform: rotateY(var(--r));
  animation-duration: var(--duration);
  animation-timing-function: ease;
  animation-iteration-count: infinite;
}

.loader div ul li:nth-child(2) {
  --c: var(--page-fold);
  animation-name: page-2;
}

.loader div ul li:nth-child(3) {
  --c: var(--page-fold);
  animation-name: page-3;
}

.loader div ul li:nth-child(4) {
  --c: var(--page-fold);
  animation-name: page-4;
}

.loader div ul li:nth-child(5) {
  --c: var(--page-fold);
  animation-name: page-5;
}

.loader div ul li svg {
  width: 90px;
  height: 120px;
  display: block;
}

.loader div ul li:first-child { /* Página base (portada) */
  --r: 0deg;
  --o: 1;
  animation: none; /* Sin animación para la portada estática */
}

.loader div ul li:last-child { /* Última página (contraportada) */
  --o: 1;
  --r: 0deg; /* Debería estar visible y sin rotar al final */
  animation: none; /* Sin animación para que sea la base final */
   /* Nota: El CSS original haría que esta página herede la animación base,
      lo que podría no ser lo deseado. Lo ideal es que sea estática o
      tenga una animación de aparición final muy simple. Para hacerla estática
      y visible al final, pero inicialmente oculta o girada:
      Podría necesitar su propia animación para aparecer al final del ciclo,
      o simplemente ser la página que se revela cuando todas las demás se han ido.
      El original la deja con --o:1 y la animación base (que es rotateY(180deg) por defecto)
      Con animation: none y --r:0deg; --o:1; se mostrará siempre como la primera.
      Para que aparezca como la última página del libro, podría ser así:
   */
}
/* Corrección para que la última página sea el "fondo" del libro y visible */
.loader div ul li:last-child {
  --r: 0deg; /* Que mire hacia adelante */
  --o: 1;    /* Que sea visible */
  animation: none; /* Que no tenga la animación de volteo general */
  /* Esta será la página de fondo sobre la que las otras voltean. */
  /* El CSS original podría tener un error aquí, ya que la última página se superpondría a las demás */
  /* o tendría una animación no deseada. La intención es que sea la página final. */
  /* De hecho, la primera es la portada. La última es la contraportada. */
  /* El CSS original para li:last-child es solo --o:1. Lo que significa que usa la animación general. */
  /* Para simplificar y asegurar que hay una página de "fin", la dejamos estática y visible */
}


.loader span { /* Texto "Loading" */
  display: block;
  position: absolute; /* Posicionado relativo al .loader */
  left: 0;
  right: 0;
  top: 100%; /* Justo debajo del contenedor del libro */
  margin-top: 15px; /* Espacio entre el libro y el texto */
  text-align: center;
  color: var(--text);
  font-size: 1rem; /* Tamaño de fuente para "Loading" */
}

/* Keyframes (sin cambios respecto a tu provisión) */
@keyframes page-2 {
  0% { transform: rotateY(180deg); opacity: 0; }
  20% { opacity: 1; }
  35%, 100% { opacity: 0; }
  50%, 100% { transform: rotateY(0deg); }
}

@keyframes page-3 {
  15% { transform: rotateY(180deg); opacity: 0; }
  35% { opacity: 1; }
  50%, 100% { opacity: 0; }
  65%, 100% { transform: rotateY(0deg); }
}

@keyframes page-4 {
  30% { transform: rotateY(180deg); opacity: 0; }
  50% { opacity: 1; }
  65%, 100% { opacity: 0; }
  80%, 100% { transform: rotateY(0deg); }
}

@keyframes page-5 {
  45% { transform: rotateY(180deg); opacity: 0; }
  65% { opacity: 1; }
  80%, 100% { opacity: 0; }
  95%, 100% { transform: rotateY(0deg); }
}
/* FIN: Nuevo CSS del Loader */


</style>
