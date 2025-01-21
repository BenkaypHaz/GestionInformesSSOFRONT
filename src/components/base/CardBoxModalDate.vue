<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const visible = ref(props.modelValue);

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
  visible.value = false;
  emit('update:modelValue', false);
  emit('cancel');
};

const confirm = () => {
  emit('confirm');
  close();
};
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="modal-container shadow-lg w-11/12 md:w-3/5 lg:w-1/2 xl:w-2/5 bg-[#141c2f] rounded-lg p-4">
      <div class="modal-header flex items-center mb-4">
        <h2 class="text-gradient text-2xl font-semibold">{{ title }}</h2>
        <button class="close-button ml-auto text-white" @click="close">&times;</button>
      </div>
      <div class="modal-content space-y-3 p-4">
        <!-- Slot for inserting any content inside the modal -->
        <slot />
      </div>
      <div class="modal-footer flex justify-center mt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  max-height: none; /* Allow the modal to grow */
  width: 50%; /* Adjust modal width */
  overflow: visible; /* Ensure content can be displayed without cutting */
  background-color: #141c2f;
}

.modal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header h2 {
  margin: 0 auto;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: auto;
  color: #ffffff;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  opacity: 0.8;
}

.datepicker-container {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  width: 100%;
}

.vue-datepicker {
  flex: 1;
  width: 48%;
}

.vue-datepicker .vdp-datepicker__calendar {
  position: absolute; /* Ensure the calendar opens over content */
  z-index: 9999; /* Ensure it stays above other elements */
  display: block;
}
</style>
