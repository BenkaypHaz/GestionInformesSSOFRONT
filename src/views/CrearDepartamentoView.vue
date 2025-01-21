<script setup>
import { ref } from 'vue';
import { departamentoService } from '@/services/DepartamentoService.js';
import { mdiBallotOutline } from '@mdi/js'
import LayoutAuthenticated from '@/components/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/layouts/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/layouts/SectionTitleLineWithButton.vue';
import CardBox from '@/components/base/CardBox.vue';
import FormField from '@/components/forms/FormField.vue';
import ButtonAdd from '../components/forms/ButtonAdd.vue'
import InputControl from '@/components/forms/InputControl.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import ButtonDelete from '../components/forms/ButtonDelete.vue'
import Swal from 'sweetalert2';

const form = ref({
  idDepartamento:0,
  nombre: '',
});

const submitForm = async () => {
  try {
    const response = await departamentoService.addDepartamento(form.value);
    Swal.fire({
      title: "<h3 style='color:white'>" + 'Guardado!' + '</h3>',
      html: "<h1 style='color:white'>" + 'Departamento creado exitosamente.' + '</h1>',
      icon: 'success',
      background: '#181c2c',
    });
    form.value.nombre = '';
    form.value.usu_responsable = '';
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'No se pudo crear el departamento',
      icon: 'error',
      background: '#181c2c',
    });
  }
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Crear Departamento" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Nombre del Departamento">
          <InputControl type="input" name="floating_email" id="floating_email" label="Descripcion"  v-model="form.nombre"/> 

        </FormField>
        <div style="position: relative;">
            <div style="position: absolute; left: 0; display: flex;">
              <ButtonDelete buttonText="Borrar" class="mr-2"></ButtonDelete> 
              <ButtonAdd @add-click="submitForm"></ButtonAdd>
            </div>
          </div>
        <template #footer>
        </template>  
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
