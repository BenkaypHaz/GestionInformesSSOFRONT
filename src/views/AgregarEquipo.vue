
<script setup>
import { reactive } from 'vue'
import { EquiposService } from '@/services/EquiposService'
import Swal from 'sweetalert2';
import { mdiBallotOutline } from '@mdi/js'
import SectionMain from '../components/layouts/SectionMain.vue'
import CardBox from '../components/base/CardBox.vue'
import FormField from '../components/forms/FormField.vue'
import LayoutAuthenticated from '../components/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '../components/layouts/SectionTitleLineWithButton.vue'
import InputControl from '../components/forms/InputControl.vue'
import ButtonAdd from '../components/forms/ButtonAdd.vue'
import ButtonDelete from '../components/forms/ButtonDelete.vue'

const form = reactive({
  idEquipo: 0,
  modelo: '',
  nombre: '',
  marca: '',
  serie: ''
})



const clearForm = () => {
  form.idEquipo = 0;
  form.nombre = '';
  form.modelo = '';
  form.marca = '';
  form.serie = ''
}

const submitForm = async () => {

  const payload = {
    idEquipo: 0, 
    nombre: form.nombre,
    modelo: form.modelo,
    marca: form.marca,
    serie: form.serie
  }

  try {
    const response = await EquiposService.agregarEquipo(payload)
    Swal.fire({
      title: "<h3 style='color:white'>¡Exito!</h3>",
      html: "<h1 style='color:white'>El Equipo ha sido creado.</h1>",
      icon: 'success',
      background: '#181c2c'
    });
    clearForm(); 
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      background: '#181c2c',
      text: error.message,
    });
  }
}



</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Crear Equipo" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submitForm">
        <FormField label="Informacion general">
          <InputControl type="input" name="floating_email" id="floating_email" label="Nombre" v-model="form.nombre" />
          <InputControl type="input" name="floating_email" id="floating_email" label="Modelo" v-model="form.modelo" />
          <InputControl type="input" name="floating_email" id="floating_email" label="Marca" v-model="form.marca" />
          <InputControl type="input" name="floating_email" id="floating_email" label="Serie" v-model="form.serie" />
        </FormField>
        
        <div style="position: relative;">
          <div style="position: absolute; left: 0; display: flex;">
            <ButtonDelete buttonText="Borrar" class="mr-2"></ButtonDelete>
            <ButtonAdd @add-click="submitForm"></ButtonAdd>
          </div>
        </div>
        <template #footer></template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
