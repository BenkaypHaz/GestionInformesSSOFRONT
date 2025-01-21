<script setup>
import { computed } from 'vue'
import { mdiClose } from '@mdi/js'
import BaseButton from './BaseButton.vue'
import CardBox from './CardBox.vue'
import OverlayLayer from './OverlayLayer.vue'
import CardBoxComponentTitle from './CardBoxComponentTitle.vue'

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  button: {
    type: String,
    default: 'info'
  },
  buttonLabel: {
    type: String,
    default: 'Aceptar'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  selectedCategory: Object 
})

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmCancel = (mode) => {
  value.value = false
  emit(mode)
}

const cancel = () => confirmCancel('cancel')

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && value.value) {
    cancel()
  }
})
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      class="shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50"
      is-modal
    >
    <div class="space-y-3 fixed-height overflow-y-auto p-4">

      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>
        <slot />
      </div>
    </CardBox>
  </OverlayLayer>
</template>


<style scoped>
.fixed-height {
  height: 60vh; /* Default height */
  max-height: calc(100vh - 4rem); /* Maximum height based on viewport */
  overflow-y: auto; /* Enable vertical scrolling */
}

.p-4 {
  padding: 1rem;
}
</style>
