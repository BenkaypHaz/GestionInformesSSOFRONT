<script setup>
import { computed, useSlots } from 'vue'
import CardBoxComponentBody from './CardBoxComponentBody.vue'
import CardBoxComponentFooter from './CardBoxComponentFooter.vue'

const props = defineProps({
  rounded: {
    type: String,
    default: 'rounded-2xl'
  },
  flex: {
    type: String,
    default: 'flex-col'
  },
  hasComponentLayout: Boolean,
  hasTable: Boolean,
  isForm: Boolean,
  isHoverable: Boolean,
  isModal: Boolean,
  title: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['submit']);

const slots = useSlots();

const hasFooterSlot = computed(() => slots.footer && !!slots.footer());

const componentClass = computed(() => {
  const base = [
    props.rounded,
    props.flex,
    props.isModal ? 'dark:bg-slate-900' : 'dark:bg-slate-900/70',
    'h-full' // Ensure the CardBox takes full height
  ];

  if (props.isHoverable) {
    base.push('hover:shadow-lg transition-shadow duration-500');
  }

  return base;
});

const submit = (event) => {
  emit('submit', event);
};
</script>

<template>
  <component
    :is="isForm ? 'form' : 'div'"
    :class="componentClass"
    class="bg-white flex h-full"
    @submit="submit"
  >
    <h2 class="text-center font-bold text-xl mt-4">{{ title }}</h2>
    <slot v-if="hasComponentLayout" />
    <template v-else>
      <CardBoxComponentBody :no-padding="hasTable">
        <slot />
      </CardBoxComponentBody>
      <CardBoxComponentFooter v-if="hasFooterSlot">
        <slot name="footer" />
      </CardBoxComponentFooter>
    </template>
  </component>
</template>

<style scoped>
h2 {
  font-size: 1.5rem; /* Increase font size */
  margin-top: 1rem; /* Add margin to the top */
}
</style>
