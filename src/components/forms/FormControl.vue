<template>
  <div class="dropdown">
    <input 
      type="text" 
      class="dropdown-select bg-transparent py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 appearance-none dark:text-white peer"
      :class="[hasError ? 'border-red-600 focus:border-red-600 dark:border-red-600 dark:focus:border-red-600' : 'border-gray-300 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-500']"
      v-model="searchQuery"
      @focus="openDropdown"
      @input="filterOptions"
      :placeholder="currentLabel"
      @keydown.down="navigateOptions(1)"
      @keydown.up="navigateOptions(-1)"
      @keydown.enter.prevent="selectHighlightedOption"
      @keydown.tab="handleTabKey"
      @blur="closeDropdown"
      tabindex="0"
    />
    <div class="dropdown-list bg-gray-800" v-if="isOpen" @mousedown.stop>
      <div 
        class="dropdown-option bg-transparent text-white py-2.5 px-3 hover:bg-blue-500 cursor-pointer text-sm"
        v-for="(option, index) in filteredOptions" 
        :key="option.id" 
        @mousedown="selectOption(option)"
        :class="{ 'highlighted': index === highlightedIndex }"
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
  modelValue: [Number, String, null],
  defaultLabel: {
    type: String,
    default: 'Seleccione una opción'
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
const hasSelectedOnTab = ref(false); // New ref to track Tab key state

const currentLabel = computed(() => {
  const selected = props.options.find(option => option.id === props.modelValue);
  return selected ? selected.label : props.defaultLabel;
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options;
  }
  return props.options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function openDropdown() {
  isOpen.value = true;
}

function closeDropdown() {
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
}

function selectOption(option) {
  emit('update:modelValue', option.id);
  searchQuery.value = option.label;
  isOpen.value = false;
}

function clearSelection() {
  emit('update:modelValue', null); 
  searchQuery.value = ''; 
  isOpen.value = false; 
  highlightedIndex.value = -1;
}

defineExpose({ clearSelection });


function focusNextInput(event) {
  const formElements = event.target.form.elements;
  const index = Array.prototype.indexOf.call(formElements, event.target);
  if (index >= 0 && index < formElements.length - 1) {
    formElements[index + 1].focus(); 
  }
}

function filterOptions() {
  isOpen.value = true;
  highlightedIndex.value = -1;
}

function navigateOptions(direction) {
  if (!isOpen.value) {
    isOpen.value = true;
  }
  highlightedIndex.value = (highlightedIndex.value + direction + filteredOptions.value.length) % filteredOptions.value.length;
}

function selectHighlightedOption() {
  if (highlightedIndex.value >= 0) {
    selectOption(filteredOptions.value[highlightedIndex.value]);
  }
}

// Handle the Tab key to select the first option and then move focus to the next input
function handleTabKey(event) {
  if (!hasSelectedOnTab.value && filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0]); // Select the first option
    closeDropdown(); // Close the dropdown
    focusNextInput(event); // Move focus to the next input field
    event.preventDefault(); // Prevent default Tab behavior for the first time
  } else {
    hasSelectedOnTab.value = false; // Allow normal Tab behavior on the next press
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  user-select: none;
  width: 100%; /* Full width to match input style */
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
  transition: background-color 0.3s;
}

.dropdown-option:hover, .highlighted {
  background-color: #1a202c;
  color: #fff;
}

input:focus {
  outline: none;
}
</style>
