<script setup>
import { containerMaxW } from '@/javascript/config.js'
</script>

<template>
  <section class="p-6" :class="containerMaxW">
    <slot />
  </section>
</template>
@/javascript/config.js