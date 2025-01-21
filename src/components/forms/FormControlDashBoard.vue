<template>
  <div class="dropdown" @click="toggleDropdown">
    <div class="dropdown-select bg-transparent py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 peer" style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);">
      <span class="dropdown-label">{{ currentLabel }}</span>
      <i :class="{ 'transform rotate-180': isOpen, 'transform rotate-0': !isOpen }" class="arrow down ml-2"></i>
    </div>
    <div class="dropdown-list bg-gray-800" v-if="isOpen" @click.stop>
      <div 
        class="dropdown-option bg-transparent text-white py-2.5 px-3 hover:bg-blue-500 cursor-pointer text-sm text-center font-bold"
        v-for="option in mergedOptions" 
        :key="option.id" 
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: [Number, String, null]
});

const emit = defineEmits(['update:modelValue', 'change']);
const isOpen = ref(false);

const mergedOptions = computed(() => {
  if (props.options.length === 0 || props.options[0].id !== 0) {
    return [{ id: 0, label: 'Todos los departamentos' }, ...props.options];
  }
  return props.options;
});

const currentLabel = computed(() => {
  const selected = mergedOptions.value.find(option => option.id === props.modelValue);
  return selected ? selected.label : 'Seleccione una opción';
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option) {
  emit('update:modelValue', option.id); // Emit the ID to the parent
  emit('change', option.id); // Emit the change event to the parent
  isOpen.value = false; // Close the dropdown
}
</script>

<style scoped>
.dropdown {
  position: relative;
  user-select: none;
  width: 25%; /* Full width to match input style */
}

.dropdown-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0; /* Padding only vertical to align with input styling */
  background-color: transparent; /* Transparent background to match inputs */
  border: none; /* Removing all borders except the underline */
  border-bottom: 2px solid #ccc; /* Only underline, matches input */
  cursor: pointer;
  box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25); /* Matching shadow */
}

.dropdown-label {
  flex-grow: 1; /* Makes the span take up all available space pushing the icon to the end */
  text-align: center; /* Center-aligns the text */
  margin-right: 10px; /* Adds some space between the text and the arrow icon */
  margin-left: 2px;
  font-weight: bold; /* Makes the text bold */
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
  border: none;
  max-height: calc(2.5rem * 3); /* Adjusted for 3 items */
  overflow-y: auto;
  z-index: 100;
}

.dropdown-option {
  padding: 10px;
  text-align: center; /* Center-align the options text */
  font-weight: bold; /* Make the options text bold */
  transition: background-color 0.3s;
}

.dropdown-option:hover {
  background-color: #1a202c;
}
</style>
