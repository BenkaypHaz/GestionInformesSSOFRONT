<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex items-center justify-center mb-3">
    <h1 class="text-2xl text-center">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>
