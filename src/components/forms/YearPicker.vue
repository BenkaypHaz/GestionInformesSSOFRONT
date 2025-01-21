<template>
  <div class="dropdown" @click="toggleDropdown">
    <div class="dropdown-select bg-transparent py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 peer" style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);">
      <span class="dropdown-label">{{ currentLabel }}</span>
      <i :class="{ 'transform rotate-180': isOpen, 'transform rotate-0': !isOpen }" class="arrow down ml-2"></i>
    </div>
    <div class="dropdown-list bg-gray-800" v-if="isOpen" @click.stop>
      <div 
        class="dropdown-option bg-transparent text-white py-2.5 px-3 hover:bg-blue-500 cursor-pointer text-sm text-center font-bold"
        v-for="(year, index) in filteredOptions" 
        :key="year" 
        @click="selectOption(year)"
        :class="{ 'highlighted': index === highlightedIndex }"
      >
        {{ year }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: Number,
    required: true
  },
  defaultLabel: {
    type: String,
    default: 'Seleccione Año'
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);
const isOpen = ref(false);
const searchQuery = ref('');
const highlightedIndex = ref(-1);

const currentLabel = computed(() => {
  return props.modelValue || props.defaultLabel;
});

const filteredOptions = computed(() => {
  return props.options.filter(year => String(year).includes(searchQuery.value));
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(year) {
  emit('update:modelValue', year);
  isOpen.value = false; // Cierra el dropdown después de seleccionar

  // Eliminar el foco del dropdown manualmente al seleccionar una opción
  const dropdownElement = document.querySelector('.dropdown-select');
  if (dropdownElement) dropdownElement.blur();
}

function filterOptions() {
  isOpen.value = true;
  highlightedIndex.value = -1;
}

// Cierra el dropdown cuando el input pierde el foco
function closeDropdown() {
  isOpen.value = false;
}
</script>

<style scoped>
.dropdown {
  position: relative;
  user-select: none;
  width: 25%; /* Ajusta según el tamaño deseado */
}

.dropdown-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #4b5563;
  cursor: pointer;
  box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);
}

.dropdown-label {
  flex-grow: 1;
  text-align: center;
  margin-right: 10px;
  margin-left: 2px;
  font-weight: bold;
}

.arrow {
  border: solid white;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transition: transform 0.3s;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  background-color: #333;
  max-height: calc(2.5rem * 3);
  overflow-y: auto;
  z-index: 100;
}

.dropdown-option {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  transition: background-color 0.3s;
}

.dropdown-option:hover, .highlighted {
  background-color: #1a202c;
  color: #fff;
}
</style>
