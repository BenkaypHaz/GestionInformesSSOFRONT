<template>
  <div class="delete-button-container">
    <button @click="handleClick" class="delete-button noselect">
      <span class="delete-text">{{ buttonText }}</span>
      <span class="delete-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
          </path>
        </svg>
      </span>
    </button>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
  props: {
    buttonText: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClick() {
      Swal.fire({
        title: "¿Esta seguro de eliminar esto?",
        text: "Confirme la decision.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#86ff6b",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar.",
        cancelButtonText: "No, cancelar.",
        background: '#f74548'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "¡Eliminado!",
            text: "El archivo fue eliminado.",
            icon: "success",
            background: '#dbfad4'
          });
        }
      })
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
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

@media (max-width: 480px) {
  .delete-button {
    width: 120px;
    height: 35px;
  }
  
  .delete-button .delete-text {
    font-size: 15px; /* Smaller text for mobile */
    transform: translateX(20px);
  }

  .delete-button .delete-icon {
    transform: translateX(90px);
    width: 20px;
    height: 20px;
  }

  .delete-button svg {
    width: 10px;
  }
}
</style>
