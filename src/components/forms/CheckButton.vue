<template>
    <div
      class="check-button"
      :class="{ 'is-checked': isChecked }"
      @click="toggleCheck"
    >
      <span v-if="isChecked" class="check-icon">✔</span>
      <span class="check-label">{{ label }}</span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // Definir las props
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false, // Valor inicial por defecto
    },
    label: {
      type: String,
      default: '',
    },
  });
  
  // Emitir eventos para `v-model`
  const emit = defineEmits(['update:modelValue']);
  
  // Computed property para sincronizar `modelValue`
  const isChecked = computed({
    get: () => props.modelValue, // Acceso directo a `modelValue`
    set: (value) => emit('update:modelValue', value),
  });
  
  // Método para alternar el estado
  const toggleCheck = () => {
    isChecked.value = !isChecked.value;
  };
  </script>
  
  <style scoped>

.check-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: 2px solid #141b26; /* Verde consistente */
  border-radius: 8px; 
  background-color: #1a202c; 
  color: white; /* Texto blanco */
  font-size: 1rem; /* Tamaño de fuente consistente */
  font-weight: 500; /* Texto más grueso para visibilidad */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  user-select: none;
  width: fit-content; /* Ajusta al contenido */
  min-height: 2.5rem; /* Altura mínima fija */
}

.check-button.is-checked {
  background-color: #1e293b; /* Verde de activado */
  border-color: #1e293b;
  color: white;
}

.check-icon {
  font-size: 1.2rem;
  line-height: 1; /* Asegura que no expanda la altura */
}

.check-label {
  font-size: 1rem;
  color: white;
}

.check-button:hover {
  background-color: #141b26; /* Verde oscuro al pasar el ratón */
  border-color: #141b26;
}


</style>