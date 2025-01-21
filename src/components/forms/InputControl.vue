<template>
  <div class="relative z-0 w-full mb-5 group">
    <input
      v-if="type === 'input' || type === 'cantidad'"
      :type="type"
      :name="name"
      :id="id"
      autocomplete="off"
      ref="inputElement"
      :class="['block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white peer', hasError ? 'border-red-600 focus:border-red-600 dark:border-red-600 dark:focus:border-red-600' : 'border-gray-300 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-500']"
      style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);"
      placeholder=" "
      required
      v-model="displayValue"
      @input="handleInput"
      @blur="handleBlur"
      :readonly="readonly"
    />
    <textarea
      v-if="type === 'textarea'"
      :name="name"
      :id="id"
      autocomplete="off"
      ref="inputElement"
      :class="['block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white peer', hasError ? 'border-red-600 focus:border-red-600 dark:border-red-600 dark:focus:border-red-600' : 'border-gray-300 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-500']"
      style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);"
      placeholder=" "
      required
      v-model="computedValue"
      :readonly="readonly"
    />
    <input
      v-if="type === 'password'"
      :type="type"
      :name="name"
      :id="id"
      autocomplete="off"
      ref="inputElement"
      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      style="box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.25);"
      placeholder=" "
      required
      v-model="computedValue"
      :readonly="readonly"
    />
    <label
      :for="id"
      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-0"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const inputElement = ref(null); // Reference to the actual input or textarea element

// Expose the focus method so it can be called from the parent component
defineExpose({
  focus() {
    inputElement.value?.focus();
  }
});

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const displayValue = computed({
  get() {
    if (props.type === 'cantidad') {
      return computedValue.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return computedValue.value;
  },
  set(value) {
    if (props.type === 'cantidad') {
      const numericValue = value.replace(/,/g, '');
      computedValue.value = numericValue;
    } else {
      computedValue.value = value;
    }
  }
});

const handleInput = (event) => {
  let value = event.target.value;

  if (props.type === 'cantidad') {
    value = value.replace(/[^\d.]/g, '');

    if (value.split('.').length > 2) {
      value = value.replace(/\.+$/, ""); 
    }

    const parts = value.split('.');
    if (parts[1]?.length > 2) {
      value = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }

    displayValue.value = value;
  } else {
    displayValue.value = value;
  }
};

const handleBlur = () => {
  if (props.type === 'cantidad') {
    let value = displayValue.value;

    if (value) { 
      if (!value.includes('.')) {
        value += '.00';
      } else {
        const parts = value.split('.');
        if (parts[1]?.length === 1) {
          value = `${parts[0]}.${parts[1]}0`;
        } else if (parts[1]?.length === 0) {
          value = `${parts[0]}.00`;
        }
      }
    }

    displayValue.value = value;
  }
};
</script>

<style scoped>
input:focus {
  outline: none; /* Removes the default outline */
}
</style>