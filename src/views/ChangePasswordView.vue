<template>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiLockOpenCheck" title="Cambiar Contraseña" main />
        <CardBox form>
          <FormField label="Nueva Contraseña">
            <InputControl v-model="newPassword" type="password" placeholder="Ingrese la nueva contraseña" />
          </FormField>
          <FormField label="Confirmar Nueva Contraseña">
            <InputControl v-model="confirmPassword" type="password" placeholder="Confirme la nueva contraseña" />
          </FormField>
          <FormField>
            <BaseButton color="success" label="Cambiar Contraseña" @click="changePassword" />
          </FormField>
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </template>
  
  <script setup>
  import { ref,computed } from 'vue';
  import { mdiLockOpenCheck } from '@mdi/js';
  import LayoutAuthenticated from '../components/layouts/LayoutAuthenticated.vue';
  import SectionMain from '../components/layouts/SectionMain.vue';
  import CardBox from '../components/base/CardBox.vue';
  import SectionTitleLineWithButton from '../components/layouts/SectionTitleLineWithButton.vue';
  import FormField from '../components/forms/FormField.vue';
  import InputControl from '../components/forms/InputControl.vue';
  import BaseButton from '../components/base/BaseButton.vue';
  import Swal from 'sweetalert2';
  import { userService } from '@/services/UsuariosService.js';
  import permissionsStore from '@/stores/stores';


  const user = computed(() => permissionsStore.getUser());

  const userId = user.value.idUsuario;
  
  const newPassword = ref('');
  const confirmPassword = ref('');
  
  const changePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        background: '#181c2c',
      });
      return;
    }
  
    try {
      const payload = {
        newPassword: newPassword.value,
      };
      await userService.changePassword(userId, payload);
      Swal.fire({
        title: 'Éxito',
        text: 'La contraseña ha sido cambiada exitosamente.',
        icon: 'success',
        background: '#181c2c',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cambiar la contraseña.',
        icon: 'error',
        background: '#181c2c',
      });
      console.error('Error changing password:', error.message);
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  