<script setup>
import { reactive } from 'vue'
import { empresasService } from '@/services/EmpresasService'
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
  IdEmpresa: 0,
  Nombre: '',
  Direccion: ''
})



const clearForm = () => {
  form.IdEmpresa = 0;
  form.Nombre = '';
  form.Direccion = '';
}

const submitForm = async () => {

  const payload = {
    IdEmpresa: 0, // Assuming new user, so idUsuario is 0
    Nombre: form.Nombre,
    Direccion: form.Direccion,
  }

  try {
    const response = await empresasService.agregarEmpresa(payload)
    Swal.fire({
      title: "<h3 style='color:white'>¡Exito!</h3>",
      html: "<h1 style='color:white'>La empresa ha sido creada.</h1>",
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Crear Empresa" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submitForm">
        <FormField label="Informacion">
          <InputControl type="input" name="floating_email" id="floating_email" label="Nombre" v-model="form.Nombre" />
          <InputControl type="textarea" name="floating_email" id="floating_email" label="Dirección" v-model="form.Direccion" />
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
