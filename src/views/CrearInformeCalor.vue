<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { empresasService } from '@/services/EmpresasService'
import { userService } from '@/services/UsuariosService'
import { EquiposService } from '@/services/EquiposService'
import { InformeCalorService } from '@/services/InformeCalor' 
import Swal from 'sweetalert2';
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
import CheckButton from '../components/forms/CheckButton.vue';
import TimeSlider from '@/components/forms/TimeSlider.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import TablaEquipos from '@/components/forms/TablaEquipos.vue';
import TablaCriterios from '@/components/forms/TablaCriterios.vue';
import dayjs from 'dayjs'; 
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType);


const form = reactive({
  idEmpresa: 1,
  activo: true,
  tasaestimada: 0.00,
  pesoestimado:0.00,
  idRopaUtilizada:1,
  archivos: [],
  equiposSeleccionados: [],
  idTecnico: null, 
  diasEvaluacion: [], 
});


const equiposOpciones = ref([])
const empresasOpciones = ref([])
const empresasaAfiliadasOpciones = ref([])
const usuariosOpciones = ref([])
const listaNoAfiliadas = ref(false);
const fechainicio = ref(null);
const fechafinal = ref(null);
const daysBetween = ref([]);
const equipoSeleccionado = ref(null);
const time = ref(null);

const ropaOpciones = ref([]);

const fetchRopaUtilizada = async () => {
  try {
    const response = await InformeCalorService.getRopaUtilizada();
    if (response.success) {
      ropaOpciones.value = response.data.map(ropa => ({
        id: ropa.idRopa,
        label: `${ropa.nombre} - (${ropa.cyF})`,
      }));
    }
  } catch (error) {
    console.error('Error cargando ropa utilizada:', error);
  }
};

const submitForm = async () => {
    try {
        // Validación previa
        const errores = [];
        if (!form.idEmpresa) errores.push('Empresa evaluada no seleccionada.');
        if (!fechainicio.value) errores.push('Fecha de inicio no seleccionada.');
        if (!fechafinal.value) errores.push('Fecha de fin no seleccionada.');
        if (form.equiposSeleccionados.length === 0) errores.push('No se han seleccionado equipos.');
        if (!form.archivos || form.archivos.length === 0) errores.push('No se ha subido ningún archivo.');
        if (!form.tasaestimada) errores.push('La tasa estimada no puede ser cero.');
        if (!form.pesoestimado) errores.push('El peso promedio no puede ser cero.');

        if (errores.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: errores.map(error => `<p>${error}</p>`).join(''),
                background: '#181c2c',
            });
            return;
        }

        // Crear el payload estructurado correctamente
        const payload = {
            IdEmpresa: form.idEmpresa,
            EsAfiliada: listaNoAfiliadas.value ? false : true,
            FechaInicia: fechainicio.value ? new Date(fechainicio.value).toISOString() : null,
            FechaFinaliza: fechafinal.value ? new Date(fechafinal.value).toISOString() : null,
            IdTecnico: form.idTecnico,
            Tasa_Estimada: form.tasaestimada,
            Peso_Promedio: form.pesoestimado, 
            IdRopaUtilizada: form.idRopaUtilizada, 
            EquiposUtilizados: form.equiposSeleccionados.map(equipo => ({
                IdEquipo: equipo.id, // Coincide con EquipoUtilizadoRequest
            })),
            DiasEvaluacion: form.diasEvaluacion.map(dia => ({
                Dia: dia.dia, // Coincide con DiaEvaluacionRequest
                HumedadRelativa: dia.humedadRelativa || '', // Asegura string
                ParcialmenteNublado: dia.parcialmenteNublado || '', // Asegura string
                TemperaturaMaxima: dia.temperaturaMaxima || '', // Asegura string
                TemperaturaMinima: dia.temperaturaMinima || '', // Asegura string
            })),
        };

        // Llamada al endpoint de creación del informe
        const response = await InformeCalorService.crearInforme(payload);

        // Obtener el informeId del response
        const informeId = response.data;

        // Subir el archivo Excel
        const formData = new FormData();
        formData.append('file', form.archivos[0]); // Archivo
        formData.append('informeId', informeId); // informeId separado

        const response2 = await InformeCalorService.subirArchivoExcel(formData);

        const pdfBlob = await InformeCalorService.descargarInformePDF(informeId);
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Informe_Calor.pdf';
        a.click();
        window.URL.revokeObjectURL(url); // Liberar memoria

        Swal.fire({
            title: '¡Éxito!',
            text: response2.message || 'Informe y archivo procesados correctamente.',
            icon: 'success',
            background: '#181c2c',
        });

        clearForm();
    } catch (error) {
        console.error('Error enviando el formulario:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || error.message || 'No se pudo enviar la información.',
            background: '#181c2c',
        });
    }
};

const mostrarInforme = async () => {
  try {

  console.log('Iniciando mostrarInforme');
  console.log('ID del Informe:', form.idInforme);


    const pdfBlob = await InformeCalorService.descargarInformePDF(7);
    pdfUrl.value = URL.createObjectURL(pdfBlob);

    // Renderiza el PDF en el contenedor
    await loadPdf(pdfUrl.value);
  } catch (error) {
    console.error('Error al mostrar el informe:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'No se pudo mostrar el informe.',
      background: '#181c2c',
    });
  }
};


const onFileAdded = (error, file) => {
  console.log('Evento onFileAdded disparado:', { error, file });

  if (!error && file?.file) {
    // Accede al archivo real dentro de `file.file`
    form.archivos = [file.file]; // Almacena solo la referencia al archivo real
    console.log('Archivo agregado correctamente:', form.archivos);
  } else {
    console.error('Error al agregar archivo o archivo no válido:', error);
  }
};


const onFileRemoved = (error, file) => {
  if (!error) {
    console.log('Archivo eliminado:', file);
    console.log('Archivos actuales en form.archivos:', form.archivos);
  } else {
    console.error('Error al eliminar el archivo:', error);
  }
};


watch(time, (newTime) => {
  console.log("Hora seleccionada:", newTime);
});


const clearForm = () => {
  form.idEmpresa = 1;
  form.archivos = [];
  form.equiposSeleccionados = [];
  fechainicio.value = null;
  fechafinal.value = null;
  daysBetween.value = [];
};

const generateDynamicDays = () => {
  if (fechainicio.value && fechafinal.value) {
    const start = dayjs(fechainicio.value);
    const end = dayjs(fechafinal.value);
    const diff = end.diff(start, 'day'); 

    if (diff >= 0) {
      form.diasEvaluacion = Array.from({ length: diff + 1 }, (_, i) => ({
        dia: `Día ${i + 1}`,
        humedadRelativa: '',
        parcialmenteNublado: '',
        temperaturaMaxima: '',
        temperaturaMinima: '',
      }));
    } else {
      form.diasEvaluacion = [];
    }
  } else {
    form.diasEvaluacion = [];
  }
};

watch([fechainicio, fechafinal], generateDynamicDays);

const agregarEquipoSeleccionado = () => {
  if (equipoSeleccionado.value) {
    const existe = form.equiposSeleccionados.some(
      (equipo) => equipo.id === equipoSeleccionado.value
    );
    if (!existe) {
      const equipo = equiposOpciones.value.find(
        (eq) => eq.id === equipoSeleccionado.value
      );
      if (equipo) {
        form.equiposSeleccionados.push({
          id: equipo.id,
          label: equipo.label,
          modelo: equipo.modelo,
          marca: equipo.marca,
          serie: equipo.serie,
        }); 
        equipoSeleccionado.value = null; 
      }
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'El equipo ya está en la lista.',
        icon: 'warning',
        background: '#181c2c',
      });
    }
  }
};

watch(equipoSeleccionado, () => {
  agregarEquipoSeleccionado();
});

const fetchEquipos = async () => {
  try {
    const response = await EquiposService.getAllEquipos();
    if (response.success) {
      equiposOpciones.value = response.data.map((equ) => ({
        id: equ.idEquipo,
        label: equ.nombre,
        modelo: equ.modelo,
        marca: equ.marca,
        serie: equ.serie,
      }));
    }
  } catch (error) {
    console.error('Error cargando equipos:', error);
  }
};

const fetchUsuarios = async () => {
  try {
    const response = await userService.getAllUsers()
    if (response.success) {
      usuariosOpciones.value = response.data.map(usu => ({
        id: usu.idUsuario,
        label: usu.nombre
      }))
    }
  } catch (error) {
    console.error("Error cargando empresas no afiliadas:", error)
  }
}


const fetchEmpresasAfiliadas = async () => {
  try {
    const response = await empresasService.getAllEmpresasSac()
    if (response.success) {
      empresasaAfiliadasOpciones.value = response.data.map(emp => ({
        id: emp.id_empresa,
        label: emp.nombre_empresa
      }))
    }
  } catch (error) {
    console.error("Error cargando empresas no afiliadas:", error)
  }
}

const fetchEmpresasNoAfiliadas = async () => {
  try {
    const response = await empresasService.getAllEmpresas()
    if (response.success) {
      empresasOpciones.value = response.data.map(emp => ({
        id: emp.IdEmpresa,
        label: emp.nombre
      }))
    }
  } catch (error) {
    console.error("Error cargando empresas no afiliadas:", error)
  }
}
const pdfUrl = ref('');

async function generateReport() {

      try {
        const pdfBlob = await InformeCalorService.descargarInformePDF(form.idInforme);
        if (pdfBlob instanceof Blob) {
          pdfUrl.value = URL.createObjectURL(pdfBlob);
          await loadPdf(pdfUrl.value);
        } else {
          console.error('Fetched data is not a Blob:', pdfBlob);
        }
      } catch (error) {
        console.error('Error during report fetching or Blob creation:', error);
        Swal.fire({
          title: "<h3 style='color:white'>Error</h3>",
          html: "<h1 style='color:white'>" + error.message + "</h1>",
          icon: 'error',
          background: '#181c2c',
        });
      }
    }

    async function loadPdf(url) {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const container = document.getElementById('pdfContainer');
        container.innerHTML = ''; // Clear previous PDF content

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          canvas.style.display = 'block';
          canvas.style.marginBottom = '20px';

          container.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
        }
      } catch (error) {
        console.error('Error during PDF loading or rendering:', error);
      }
    }

onMounted(() => {
  fetchEmpresasNoAfiliadas()
  fetchEmpresasAfiliadas()
  fetchUsuarios()
  fetchEquipos()
  fetchRopaUtilizada();
})


</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Informacion General del Informe" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submitForm">
        <FormField label="Empresa Evaluada">
          <div>
            <FormControl v-if="!listaNoAfiliadas" :options="empresasaAfiliadasOpciones" v-model="form.idEmpresa"
              label="Empresa Afiliada" />
            <FormControl v-else :options="empresasOpciones" v-model="form.idEmpresa" label="Empresa No Afiliada" />
          </div>
          <CheckButton v-model="listaNoAfiliadas" label="Listado no Afiliadas" />
        </FormField>

        <FormField label="Fechas de evaluación">
          <VueDatePicker v-model="fechainicio" class="custom-datepicker" :month-change-on-scroll="false" dark
            :enable-time-picker="false" auto-apply placeholder="Desde:" />
          <VueDatePicker v-model="fechafinal" class="custom-datepicker" :month-change-on-scroll="false" dark
            :enable-time-picker="false" auto-apply placeholder="Hasta:" />
        </FormField>

        <FormField label="Tasa estimada y Peso Promedio">
          <InputControl type="cantidad" name="Tasa" id="Tasa" label="Tasa" v-model="form.tasaestimada" />
          <InputControl type="cantidad" name="Peso" id="Peso" label="Peso(Libras)" v-model="form.pesoestimado" />
        </FormField>
        <FormField label="Ropa Utilizada">
  <FormControl :options="ropaOpciones" v-model="form.idRopaUtilizada" label="Ropa Usada" />
</FormField>

        <FormField label="Nombre del técnico y equipo utilizado">
          <FormControl
          :options="usuariosOpciones"
          v-model="form.idTecnico"
          label="Usuarios"
        />
          <FormControl :options="[{ id: null, label: 'Seleccione una opción' }, ...equiposOpciones]"
            v-model="equipoSeleccionado" label="Equipos" />
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
      <br>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Factores personales y de trabajo considerados" main>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
          <TablaCriterios/>
        </CardBox>
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Subir archivo Excel" main>
        </SectionTitleLineWithButton>
     <CardBox>
        <FormField label="Subir Archivos"> 
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
        <div style="position: relative;">
          <div style="position: absolute; left: 0; display: flex;">
            <ButtonAdd @add-click="submitForm" buttonText="Generar" />
          </div>
       
        </div>

        <template #footer>
        </template>  
        <div class="report-container" v-if="pdfUrl">
          <div id="pdfContainer" class="pdf-container"></div>
        </div>
      </CardBox>

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


</style>