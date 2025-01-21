<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttonLabel: {
    type: String,
    default: 'Aceptar'
  },
  hasCancel: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    // Prevent body scrolling when the modal is visible
    document.body.style.overflow = 'hidden';
  } else {
    // Re-enable body scrolling when the modal is hidden
    document.body.style.overflow = '';
  }
});


const close = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="modal-container shadow-lg w-11/12 md:w-2/5 lg:w-1/3 xl:w-1/4 bg-[#141c2f] rounded-lg p-4 overflow-hidden">
      <div class="modal-header flex items-center mb-4">
        <h2 class="text-gradient text-2xl font-semibold">{{ title }}</h2>
        <button class="close-button ml-auto text-white" @click="close">&times;</button>
      </div>
      <div class="modal-content space-y-3 overflow-y-auto p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  max-height: 150vh;
  overflow-y: auto;
  background-color: #141c2f;
}

.modal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; /* Center the title */
}

.modal-header h2 {
  position: relative;
  margin: 0 auto; /* Center the title within the modal header */
}

.close-button {
  position: relative;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: auto; /* Ensure the button stays on the right */
  color: #ffffff;
  padding: 0;
  margin: 0;
  width: 30px; /* Set a fixed width */
  height: 30px; /* Set a fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  opacity: 0.8;
}
</style>
