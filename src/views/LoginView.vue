<script setup>
import { reactive,computed,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2';
import InputControl from '../components/forms/InputControl.vue';
import FormField from '../components/forms/FormField.vue';
import { userService } from '@/services/UsuariosService'; 
import permissionsStore from '@/stores/stores'; 
import { useDarkModeStore } from '@/stores/darkMode'

const darkModeStore = useDarkModeStore()


darkModeStore.set(true)

const form = reactive({
  Username: '',
  Password: '',
})

const router = useRouter();

const submitLogin = async () => {
  try {
    const response = await userService.loginUser(form);
    if (response.success) {
      permissionsStore.setUser(response.data.user); 
      permissionsStore.setPermissions(response.data.permisos); 
       router.push('/dashboard'); 
    
    } else {
      throw new Error('Usuario o clave incorrectos');
    }
  } catch (error) {
    Swal.fire({
      title: "<h3 style='color:white'>" + '¡Error!' + "</h3>",
          html:  "<h1 style='color:white'>" + 'Usuario o clave incorrectos' + "</h1>",
          icon: "error",
          background: '#181c2c',
    });
  }
};

const isSmallScreen = computed(() => window.innerWidth < 1024);

onMounted(() => {
  window.addEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 1024;
  });
});


</script>

<template>
  <div class="flex min-h-screen bg-[rgb(16,20,40)]"> 
    <!-- Left side for sign-in inputs -->
    <div class="flex-1-left flex flex-col justify-center items-center p-12" :style="{ backgroundColor: dynamicBackgroundColor }">
      <div class="w-full max-w-md">
        <h2 class="text-center text-4xl text-[white] font-semibold mb-12">Iniciar Sesion</h2>
        <form @submit.prevent="submitLogin">
          <FormField label="">
            <InputControl type="input" name="floating_email" id="floating_email" label="Ingrese su usuario" v-model="form.Username" />
          </FormField>
          <FormField label="">
            <InputControl type="password" name="password" id="password" label="Ingrese su clave" v-model="form.Password"/>
          </FormField>
          <div class="mt-10">
            <button class="group group-hover:before:duration-500 group-hover:after:duration-1000 after:duration-500 hover:border-sky-300 duration-500 before:duration-500 hover:duration-500  hover:after:-right-2 hover:before:top-8 hover:before:right-16 hover:after:scale-150 hover:after:blur-none hover:before:-bottom-8 hover:before:blur-none hover:bg-sky-300 hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-sky-900 relative bg-sky-800 h-16 w-full border  p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-sky-400 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-cyan-600 after:right-8 after:top-3 after:rounded-full after:blur">
              Aceptar
            </button>
          </div>
        </form>
        <div class="mt-12 text-sm text-gray-700 text-center">
          ¿Se ha olvidado de su contraseña? <a class="text-[#633394] hover:text-indigo-800 cursor-pointer">Click aqui</a>
        </div>
      </div>
    </div>

    <div v-if="!isSmallScreen" class="hidden lg:flex flex-1-right items-center justify-center p-12 bg-indigo-300">
      <img src="../assets/images/logo-sso.png" alt="Logo" class="image-fit animate-enter">
    </div>

  </div>
</template>


  

<script>
export default {
  computed: {
    dynamicBackgroundColor() {
      // Generate your RGB color dynamically, for example, using a function or a variable
      const red = 32;
      const green = 44;
      const blue = 60;

      return `rgb(${red}, ${green}, ${blue})`;
    },
  }
}
</script>

<style scoped>

.image-fit {
  width: 100%;
  height: 100%; 
  object-fit: cover; 
  object-position: center; 
  max-width: 100%; 
  max-height: 100%;
}

.flex-1-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  box-shadow: 12px 0 20px rgba(0, 0, 0, 0.40); /* Adds shadow to the right edge */
  z-index: 10;         /* Lower z-index than the left side */

}

/* Right side container */
.flex-1-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  z-index: 5;         /* Lower z-index than the left side */

}

.wave-group {
  position: relative;
}

@media (max-width: 1024px) {
  .flex-1 {
    padding: 0;       /* Adjust smaller screens padding if necessary */
  }
}

@media (max-height: 650px) {
  .flex-1 {
    padding: 0;       /* Further adjustments for very small heights */
  }
}

@keyframes enter {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-enter {
  animation: enter 0.5s ease-out forwards;
}

.wave-group .input {
  color: #999;
  font-size: 18px;
  font-weight: 500;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 396px;
  border: none;
  border-bottom: 1px solid #515151;
  background: transparent;
}

.wave-group .input:focus {
  outline: none;
}

.wave-group .label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  display: flex;
}

.wave-group .label-char {
  transition: 0.2s ease all;
  transition-delay: calc(var(--index) * .05s);
}

.wave-group .input:focus~label .label-char,
.wave-group .input:valid~label .label-char {
  transform: translateY(-20px);
  font-size: 14px;
  color: #5264AE;
}

.wave-group .bar {
  position: relative;
  display: block;
  width: 396px;
}

.wave-group .bar:before,
.wave-group .bar:after {
  content: '';
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #5264AE;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

.wave-group .bar:before {
  left: 50%;
}

.wave-group .bar:after {
  right: 50%;
}

.wave-group .input:focus~.bar:before,
.wave-group .input:focus~.bar:after {
  width: 50%;
}

.inputbox {
  position: relative;
  width: 396px;
}

.inputbox input {
  position: relative;
  width: 100%;
  padding: 20px 10px 10px;
  background: transparent;
  outline: none;
  box-shadow: none;
  border: none;
  color: white;
  font-size: 1em;
  letter-spacing: 0.05em;
  transition: 0.5s;
  z-index: 10;
}

.inputbox span {
  position: absolute;
  left: 0;
  padding: 20px 10px 10px;
  font-size: 1em;
  color: #8f8f8f;
  letter-spacing: 00.05em;
  transition: 0.5s;
  pointer-events: none;
}

.inputbox input:valid~span,
.inputbox input:focus~span {
  color: #45f3ff;
  transform: translateX(-10px) translateY(-34px);
  font-size: 0, 75em;
}

.inputbox i {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #45f3ff;
  border-radius: 4px;
  transition: 0.5s;
  pointer-events: none;
  z-index: 9;
}

.inputbox input:valid~i,
.inputbox input:focus~i {
  height: 44px;
}

.lg\:w-1\/2 {
  box-shadow: 8px 0 15px -4px rgba(0,0,0,0.5);
}


@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50px); 
  }
  to {
    opacity: 1;
    transform: translateX(0); 
  }
}

.image-slide-fade-in {
  animation: slideFadeIn 2s ease-out forwards;
}


@keyframes enter {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-enter {
  animation: enter 0.5s ease-out forwards;
}

.flex-1 {
  flex: 1;
  transition: all 0.5s ease;
}

@media (max-width: 1024px) {
  .flex-1 {
    padding: 8px;
  }
}

@media (max-height: 650px) {
  .form-field {
    margin-bottom: 10px;
  }
}

</style>