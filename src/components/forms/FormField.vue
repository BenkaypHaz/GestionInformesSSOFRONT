<script setup>
import { computed, useSlots } from 'vue'

defineProps({
  label: {
    type: String,
    default: null
  },
  labelFor: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  }
})

const slots = useSlots()

const wrapperClass = computed(() => {
  const base = ['grid gap-3']
  const slotsLength = slots.default().length

  if (slotsLength > 1) {
    base.push('md:grid-cols-2')
  }

  if (slotsLength === 2) {
    base.push('md:grid-cols-2')
  }

  return base
})
</script>

<template>
  <div class="mb-6 last:mb-0">
    <label v-if="label" :for="labelFor" class="block font-bold mb-2">{{ label }}</label>
    <div :class="wrapperClass">
      <slot />
    </div>
    <div v-if="help" class="text-xs text-sky-900 dark:text-slate-400 mt-1">
      {{ help }}
    </div>
  </div>


  
</template>
