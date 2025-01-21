<script setup>
import { RouterView } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode'

const darkModeStore = useDarkModeStore()


darkModeStore.set()
</script>

<template>
  <RouterView />
</template>
