<template>
        <div class="mb-4">
          <form class="max-w-md mx-auto">
            <div class="relative z-0 w-full mb-5 group">
              <input type="email" name="floating_email" id="floating_email"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
              <label for="floating_email"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Usuario</label>
            </div>
  
            <div class="relative z-0 w-full mb-5 group">
              <input type="password" name="floating_password" id="floating_password"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
              <label for="floating_password"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Contraseña</label>
            </div>
  
            <div class="relative z-0 w-full mb-5 group">
              <input type="password" name="floating_password" id="floating_repeat_password"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
              <label for="floating_repeat_password"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Confirme
                Contraseña</label>
            </div>
  
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="floating_first_name" id="floating_first_name"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
                <label for="floating_first_name"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Nombres</label>
              </div>
  
              <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="floating_password" id="floating_password"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
                <label for="floating_password"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Apellidos</label>
              </div>
  
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="floating_password" id="floating_password"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
                <label for="floating_password"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Telefono
                  ej: 504-96474955</label>
              </div>
  
              <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="floating_password" id="floating_password"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required />
                <label for="floating_password"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Empresa</label>
              </div>
            </div>
  
            <div class="relative z-0 w-full mb-5 group">
              <textarea name="floating_email" id="floating_email"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);" placeholder=" " required></textarea>
              <label for="floating_email"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0">Usuario</label>
            </div>
  
  
            <div class="paste-button">
              <button class="button">Dropdown &nbsp; ▼</button>
              <div class="dropdown-content">
                <a id="top" href="#">Honduras</a>
                <a id="middle" href="#">Nicaragua</a>
                <a id="bottom" href="#">Guatemala</a>
              </div>
            </div>
            <br />
            <button class="cta">
              <span>Aceptar</span>
              <svg width="15px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </button>
            <br />
            <button class="send-button">
              <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path fill="currentColor"
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z">
                    </path>
                  </svg>
                </div>
              </div>
              <span>Aceptar</span>
            </button>
            <br />
            <div class="delete-button-container">
              <button @click="showAlert" class="delete-button noselect">
                <span class="delete-text">Borrar</span>
                <span class="delete-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
                    </path>
                  </svg>
                </span>
              </button>
              <br>
              <div class="flex justify-center">
                <button @click="showSuccessAlert"
                  class="rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500">
                  <span
                    class="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300">Agregar</span>
                  <span
                    class="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                    <svg class="svg w-8 text-white" fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                      xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" x2="12" y1="5" y2="19"></line>
                      <line x1="5" x2="19" y1="12" y2="12"></line>
                    </svg>
                  </span>
                </button>
              </div>
  
            </div>
          </form>
  
        </div>
  </template>
    
  <script>
  
  
  
  import { ref } from 'vue'
  export default {
    methods: {
      showAlert() {
        this.$swal({
          title: "¿Esta seguro de eliminar esto?",
          text: "Confirme la decision.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#86ff6b",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si,eliminar.",
          cancelButtonText: "No, cancelar.",
          background: '#f74548'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$swal.fire({
              title: "¡Eliminado!",
              text: "El archivo fue eliminado.",
              icon: "success",
              background: '#dbfad4'
            });
          }
        });
      },
      showSuccessAlert(){
        this.$swal.fire({
    position: "top-end",
    icon: "success",
    title: "Se realizo con exito.",
    showConfirmButton: false,
    timer: 2000,
    width: '150px',
    allowOutsideClick:true,
    backdrop:false,
    background: '#dbfad4',
    customClass: {
      title: 'my-title-class',
      icon: 'my-icon-class'
    }
  });
      },
    },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    }
  }
  </script>
    
  <style>
  .paste-button {
    position: relative;
    display: block;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .button {
    background-color: #633394;
    color: white;
    padding: 10px 15px;
    font-size: 15px;
    font-weight: bold;
    border: 2px solid transparent;
    border-radius: 15px;
    cursor: pointer;
  
  }
  
  .dropdown-content {
    display: none;
    font-size: 13px;
    position: absolute;
    z-index: 1;
    min-width: 200px;
    background-color: white;
    border: 2px solid #633394;
    border-radius: 0px 15px 15px 15px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    left: 50%;
    /* Add this line */
    transform: translateX(-34%);
    /* Add this line */
  }
  
  .dropdown-content a {
    color: black;
    padding: 8px 10px;
    text-decoration: none;
    display: block;
    transition: 0.1s;
    text-align: center;
  }
  
  .dropdown-content a:hover {
    background-color: #633394;
    color: #212121;
  }
  
  .dropdown-content a:focus {
    background-color: #212121;
    color: #633394;
  }
  
  .dropdown-content #top:hover {
    border-radius: 0px 13px 0px 0px;
  }
  
  .dropdown-content #bottom:hover {
    border-radius: 0px 0px 13px 13px;
  }
  
  .paste-button:hover button {
    border-radius: 15px 15px 0px 0px;
  }
  
  .paste-button:hover .dropdown-content {
    display: block;
  }
  
  .cta {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: auto;
    padding: 12px 18px;
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  .cta:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-radius: 50px;
    background: #b1dae7;
    width: 45px;
    height: 45px;
    transition: all 0.3s ease;
  }
  
  .cta span {
    position: relative;
    font-family: "Ubuntu", sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #234567;
  }
  
  .cta svg {
    position: relative;
    top: 0;
    margin-left: 10px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #234567;
    stroke-width: 2;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }
  
  .cta:hover:before {
    width: 100%;
    background-color: #633394;
  }
  
  .cta:hover span {
    color: white;
    /* Add this line */
  }
  
  .cta:hover svg {
    transform: translateX(0);
    stroke: white;
  }
  
  .cta span,
  .cta svg {
    margin: 0 5px;
    /* adjust as needed */
    color: #234567;
  }
  
  .cta:active {
    transform: scale(0.95);
  }
  
  .send-button {
    font-family: inherit;
    font-size: 16px;
    background: #633394;
    color: white;
    padding: 0.7em 1em;
    padding-left: 0.9em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
    margin: 0 auto;
  }
  
  .send-button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }
  
  .send-button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }
  
  .send-button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }
  
  .send-button:hover svg {
    transform: translateX(1.6em) rotate(45deg) scale(1.1);
  }
  
  .send-button:hover span {
    transform: translateX(5em);
  }
  
  .send-button:active {
    transform: scale(0.95);
  }
  
  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }
  
    to {
      transform: translateY(-0.1em);
    }
  }
  
  .delete-button {
    width: 140px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    background: red;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
    background: #e62222;
    margin: 0 auto;
  }
  
  .delete-button,
  .delete-button span {
    transition: 200ms;
  }
  
  .delete-button .delete-text {
    transform: translateX(32px);
    color: white;
    font-weight: bold;
  }
  
  .delete-button .delete-icon {
    position: absolute;
    border-left: 1px solid #c41b1b;
    transform: translateX(110px);
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .delete-button svg {
    width: 12px;
    fill: #eee;
  }
  
  .delete-button:hover {
    background: #ff3636;
  }
  
  .delete-button:hover .delete-text {
    color: transparent;
  }
  
  .delete-button:hover .delete-icon {
    width: 150px;
    border-left: none;
    transform: translateX(0);
  }
  
  .delete-button:focus {
    outline: none;
  }
  
  .delete-button:active .delete-icon svg {
    transform: scale(0.8);
  }
  .my-title-class {
    font-size: 15px; /* Change the font size of the title */
  }
  
  
  </style>