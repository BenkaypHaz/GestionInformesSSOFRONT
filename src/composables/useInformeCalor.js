// src/composables/useInformeCalor.js
import { ref, reactive, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import { empresasService } from '@/services/EmpresasService'
import { userService } from '@/services/UsuariosService'
import { EquiposService } from '@/services/EquiposService'
import { InformeCalorService } from '@/services/InformeCalor'

export function useInformeCalor() {
  // Estado del formulario
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
    fotosAreas: [],
    graficosHumedad: [],
    tituloGraficoAgua: 'Proyección de pérdida de agua',
    tituloGraficoPiel: 'Proyección de temperatura de piel',
    tituloGraficoRectal: 'Proyección de temperatura rectal',
    idInforme: null
  })

  // Referencias reactivas
  const equiposOpciones = ref([])
  const empresasOpciones = ref([])
  const empresasAfiliadasOpciones = ref([])
  const usuariosOpciones = ref([])
  const listaNoAfiliadas = ref(false)
  const fechainicio = ref(null)
  const fechafinal = ref(null)
  const equipoSeleccionado = ref(null)
  const ropaOpciones = ref([])
  const tasaDesdeCriterios = ref(0)
  const limitesProyectados = ref({
    TemperaturaRectalFinal: 0,
    ExcesoTempCorporal38C: 'No excedido',
    ExcesoDeshidratacion2Porciento: 'No excedido',
    TasaMediaSudoracion: 0,
    PerdidaTotalAgua: 0
  })

  // Funciones de carga de datos
  const fetchEmpresas = async () => {
    try {
      const [responseSac, responseNoAfiliadas] = await Promise.all([
        empresasService.getAllEmpresasSac(),
        empresasService.getAllEmpresas()
      ])

      if (responseSac.success) {
        empresasAfiliadasOpciones.value = responseSac.data.map(empresa => ({
          id: empresa.id_empresa,
          label: empresa.nombre_empresa
        }))
      }

      if (responseNoAfiliadas.success) {
        empresasOpciones.value = responseNoAfiliadas.data.map(empresa => ({
          id: empresa.idEmpresa,
          label: empresa.nombre
        }))
      }
    } catch (error) {
      console.error('Error cargando empresas:', error)
    }
  }

  const fetchUsuarios = async () => {
    try {
      const response = await userService.getAllUsers()
      if (response.success) {
        usuariosOpciones.value = response.data.map(user => ({
          id: user.idUsuario,
          label: user.nombre
        }))
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
  }

  const fetchEquipos = async () => {
    try {
      const response = await EquiposService.getAllEquipos()
      if (response.success) {
        equiposOpciones.value = response.data.map(equipo => ({
          id: equipo.idEquipo,
          label: equipo.nombre,
          modelo: equipo.modelo,
          marca: equipo.marca,
          serie: equipo.serie
        }))
      }
    } catch (error) {
      console.error('Error cargando equipos:', error)
    }
  }

  const fetchRopaUtilizada = async () => {
    try {
      const response = await InformeCalorService.getRopaUtilizada()
      if (response.success) {
        ropaOpciones.value = response.data.map(ropa => ({
          id: ropa.idRopa,
          label: `${ropa.nombre} - (${ropa.cyF})`
        }))
      }
    } catch (error) {
      console.error('Error cargando ropa utilizada:', error)
    }
  }

  // Generar días dinámicamente basado en las fechas
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

  // Validación del formulario
  const validarFormulario = () => {
    const errores = []

    // Validaciones primera sección
    if (!form.idEmpresa) errores.push('Empresa evaluada no seleccionada.')
    if (!fechainicio.value) errores.push('Fecha de inicio no seleccionada.')
    if (!fechafinal.value) errores.push('Fecha de fin no seleccionada.')
    if (form.equiposSeleccionados.length === 0) errores.push('No se han seleccionado equipos.')
    if (!form.pesoestimado) errores.push('El peso promedio no puede ser cero.')
    if (!form.idTecnico) errores.push('Técnico no seleccionado.')
    if (!form.idRopaUtilizada) errores.push('Ropa utilizada no seleccionada.')

    // Validaciones segunda sección
    if (!form.archivos || form.archivos.length === 0) {
      errores.push('No se ha subido ningún archivo Excel.')
    }
    if (form.imagenRectal.length === 0) {
      errores.push('No se ha subido la imagen para Proyección de temperatura rectal.')
    }
    if (form.imagenPiel.length === 0) {
      errores.push('No se ha subido la imagen para Proyección de temperatura de piel.')
    }
    if (form.imagenAgua.length === 0) {
      errores.push('No se ha subido la imagen para Proyección de pérdida de agua.')
    }
    if (form.fotosAreas.length === 0) {
      errores.push('No se han subido fotos de áreas.')
    }
    if (form.graficosHumedad.length === 0) {
      errores.push('No se han subido gráficos de humedad.')
    }
    if (!form.tituloGraficoRectal.trim()) {
      errores.push('El título para Proyección de temperatura rectal no puede estar vacío.')
    }
    if (!form.tituloGraficoPiel.trim()) {
      errores.push('El título para Proyección de temperatura de piel no puede estar vacío.')
    }
    if (!form.tituloGraficoAgua.trim()) {
      errores.push('El título para Proyección de pérdida de agua no puede estar vacío.')
    }

    // Validación de fechas
    if (fechainicio.value && fechafinal.value && dayjs(fechafinal.value).isBefore(dayjs(fechainicio.value))) {
      errores.push('La fecha de fin no puede ser anterior a la fecha de inicio.')
    }

    // Validación de días de evaluación
    const diasInvalidos = form.diasEvaluacion.some(dia => 
      !dia.humedadRelativa || !dia.temperaturaMaxima || !dia.temperaturaMinima
    )
    if (diasInvalidos) {
      errores.push('Todos los días de evaluación deben tener datos completos.')
    }

    return errores
  }

  // Preparar y enviar el payload
  const prepararPayload = async () => {
    const payload = {
      IdEmpresa: form.idEmpresa,
      EsAfiliada: !listaNoAfiliadas.value,
      FechaInicia: fechainicio.value ? new Date(fechainicio.value).toISOString() : null,
      FechaFinaliza: fechafinal.value ? new Date(fechafinal.value).toISOString() : null,
      IdTecnico: form.idTecnico,
      Tasa_Estimada: tasaDesdeCriterios.value,
      Peso_Promedio: form.pesoestimado,
      IdRopaUtilizada: form.idRopaUtilizada,
      EquiposUtilizados: form.equiposSeleccionados.map(equipo => ({
        IdEquipo: equipo.id
      })),
      DiasEvaluacion: form.diasEvaluacion.map(dia => ({
        Dia: dia.dia,
        HumedadRelativa: dia.humedadRelativa || '',
        ParcialmenteNublado: dia.parcialmenteNublado || '',
        TemperaturaMaxima: dia.temperaturaMaxima || '',
        TemperaturaMinima: dia.temperaturaMinima || ''
      })),
      TitulosGraficos: [
        {
          id: 0,
          idInforme: 0,
          titulo: form.tituloGraficoRectal,
          tipo_grafico: 1 // Gráfico Rectal
        },
        {
          id: 0,
          idInforme: 0,
          titulo: form.tituloGraficoPiel,
          tipo_grafico: 2 // Gráfico Temperatura Piel
        },
        {
          id: 0,
          idInforme: 0,
          titulo: form.tituloGraficoAgua,
          tipo_grafico: 3 // Gráfico Pérdida de Agua
        }
      ]
    }

    // Crear informe
    const response = await InformeCalorService.crearInforme(payload)
    const informeId = response.data

    // Guardar los valores proyectados fisiológicos
    await InformeCalorService.guardarValoresProyectados({
      idInforme: informeId,
      TemperaturaRectalFinal: limitesProyectados.value.TemperaturaRectalFinal,
      ExcesoTempCorporal38C: limitesProyectados.value.ExcesoTempCorporal38C === 'Excedido',
      ExcesoDeshidratacion2Porciento: limitesProyectados.value.ExcesoDeshidratacion2Porciento === 'Excedido',
      TasaMediaSudoracion: limitesProyectados.value.TasaMediaSudoracion,
      PerdidaTotalAgua: limitesProyectados.value.PerdidaTotalAgua
    })

    // Subir archivo Excel
    const formData = new FormData()
    formData.append('file', form.archivos[0])
    formData.append('informeId', informeId)
    await InformeCalorService.subirArchivoExcel(formData)

    // Subir imágenes de gráficos individuales
    const imagenes = [
      { archivo: form.imagenRectal[0], tipo: 'Rectal' },
      { archivo: form.imagenPiel[0], tipo: 'Piel' },
      { archivo: form.imagenAgua[0], tipo: 'Agua' }
    ]

    for (const img of imagenes) {
      if (img.archivo) {
        const imagenData = new FormData()
        imagenData.append('Files', img.archivo)
        imagenData.append('informeId', informeId)
        imagenData.append('tipo', img.tipo)
        await InformeCalorService.subirImagen(imagenData)
      }
    }

    // Subir fotos de áreas (múltiples)
    if (form.fotosAreas.length > 0) {
      for (const archivo of form.fotosAreas) {
        const imagenData = new FormData()
        imagenData.append('Files', archivo)
        imagenData.append('informeId', informeId)
        imagenData.append('tipo', 'FotosAreas')
        await InformeCalorService.subirImagen(imagenData)
      }
    }

    // Subir gráficos de humedad (múltiples)
    if (form.graficosHumedad.length > 0) {
      for (const archivo of form.graficosHumedad) {
        const imagenData = new FormData()
        imagenData.append('Files', archivo)
        imagenData.append('informeId', informeId)
        imagenData.append('tipo', 'GraficosHumedad')
        await InformeCalorService.subirImagen(imagenData)
      }
    }

    // Descargar PDF
    const pdfBlob = await InformeCalorService.descargarInformePDF(informeId)
    const url = window.URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Informe_Calor.pdf'
    a.click()
    window.URL.revokeObjectURL(url)

    return { response, informeId }
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    form.idEmpresa = 1
    form.archivos = []
    form.equiposSeleccionados = []
    form.pesoestimado = 0.0
    form.idRopaUtilizada = 1
    form.idTecnico = null
    form.diasEvaluacion = []
    form.imagenRectal = []
    form.imagenPiel = []
    form.imagenAgua = []
    form.fotosAreas = []
    form.graficosHumedad = []
    form.tituloGraficoAgua = 'Proyección de pérdida de agua'
    form.tituloGraficoPiel = 'Proyección de temperatura de piel'
    form.tituloGraficoRectal = 'Proyección de temperatura rectal'
    fechainicio.value = null
    fechafinal.value = null
    equipoSeleccionado.value = null
    tasaDesdeCriterios.value = 0
    limitesProyectados.value = {
      TemperaturaRectalFinal: 0,
      ExcesoTempCorporal38C: 'No excedido',
      ExcesoDeshidratacion2Porciento: 'No excedido',
      TasaMediaSudoracion: 0,
      PerdidaTotalAgua: 0
    }
  }

  // Watchers
  watch([fechainicio, fechafinal], generateDynamicDays)

  watch(listaNoAfiliadas, (newValue) => {
    if (newValue) {
      form.idEmpresa = empresasOpciones.value[0]?.id || null
    } else {
      form.idEmpresa = empresasAfiliadasOpciones.value[0]?.id || null
    }
  })

  // Lifecycle
  onMounted(async () => {
    await Promise.all([
      fetchEmpresas(),
      fetchUsuarios(),
      fetchEquipos(),
      fetchRopaUtilizada()
    ])
  })

  return {
    // Estado
    form,
    fechainicio,
    fechafinal,
    listaNoAfiliadas,
    equipoSeleccionado,
    tasaDesdeCriterios,
    limitesProyectados,
    
    // Opciones
    empresasOpciones,
    empresasAfiliadasOpciones,
    usuariosOpciones,
    equiposOpciones,
    ropaOpciones,
    
    // Funciones
    validarFormulario,
    limpiarFormulario,
    prepararPayload
  }
}