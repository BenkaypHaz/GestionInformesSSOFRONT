<script setup>
import { reactive, ref, onMounted } from 'vue'
import { userService } from '@/services/UsuariosService'
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

const form = reactive({
  Usuario: '',
  Nombre: '',
  ClaveEncriptada: '',
  Correo: '',
  IdRol: 1,
  activo: true
})

const rolesOptions = ref([])
const passwordConfirmRef = ref(null);
const passwordConfirm = ref(''); 


const clearForm = () => {
  form.Usuario = '';
  form.Nombre = '';
  form.ClaveEncriptada = '';
  form.Correo = '';
  form.IdRol = 1;
  form.activo = true;
  passwordConfirm.value = '';
  if (passwordConfirmRef.value) {
    passwordConfirmRef.value.value = ''; 
  }
}


const fetchRoles = async () => {
  try {
    const response = await userService.getRoles()
    if (response.success) {
      rolesOptions.value = response.data.map(role => ({
        id: role.rolUsuId,
        label: role.nombre
      }))
    }
  } catch (error) {
    console.error("Error fetching roles:", error)
  }
}

onMounted(() => {
  fetchRoles()
})

const submitForm = async () => {
  if (form.ClaveEncriptada !== passwordConfirm.value) {
    Swal.fire({
      icon: 'error',
      title: "<h3 style='color:white'>Error!</h3>",
      html: "<h1 style='color:white'>Las contraseñas no coinciden.</h1>",
      background: '#181c2c'
    });
    return; // Stop the form submission if passwords don't match
  }  

  const payload = {
    idUsuario: 0, // Assuming new user, so idUsuario is 0
    usuario: form.Usuario,
    nombre: form.Nombre,
    claveEncriptada: form.ClaveEncriptada,
    correo: form.Correo,
    idRol: form.IdRol,
    activo: form.activo
  }

  try {
    const response = await userService.addUser(payload)
    Swal.fire({
      title: "<h3 style='color:white'>¡Exito!</h3>",
      html: "<h1 style='color:white'>El usuario ha sido creado.</h1>",
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Crear Usuario" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submitForm">
        <FormField label="Nombre">
          <InputControl type="input" name="floating_email" id="floating_email" label="Nombre completo"
            v-model="form.Nombre" />
        </FormField>
        <FormField label="Informacion">
          <InputControl type="input" name="floating_email" id="floating_email" label="Usuario" v-model="form.Usuario" />
          <InputControl type="input" name="floating_email" id="floating_email" label="Correo electronico"
            v-model="form.Correo" />
          <FormControl :options="rolesOptions" v-model="form.IdRol" label="Rol" />
        </FormField>
        <FormField label="Contraseña">
          <InputControl type="password" name="password" id="password" label="Escriba su contraseña"
            v-model="form.ClaveEncriptada" />
          <InputControl type="password" name="password_confirm" id="password_confirm" v-model="passwordConfirm"
            label="Repita su contraseña" ref="passwordConfirmRef" />
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
