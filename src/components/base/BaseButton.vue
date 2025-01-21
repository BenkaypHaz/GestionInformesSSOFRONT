<script setup>
import { computed,ref  } from 'vue'
import { RouterLink } from 'vue-router'
import { getButtonColor } from '@/javascript/colors'
import BaseIcon from '@/components/base/BaseIcon.vue'

const props = defineProps({
  label: {
    type: [String, Number],
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  iconSize: {
    type: [String, Number],
    default: null
  },
  href: {
    type: String,
    default: null
  },
  target: {
    type: String,
    default: null
  },
  to: {
    type: [String, Object],
    default: null
  },
  type: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'white'
  },
  as: {
    type: String,
    default: null
  },
  small: Boolean,
  outline: Boolean,
  active: Boolean,
  disabled: Boolean,
  roundedFull: Boolean,
  tooltip: {
    type: String,
    default: null
  }
})

const is = computed(() => {
  if (props.as) {
    return props.as
  }

  if (props.to) {
    return RouterLink
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})

const computedType = computed(() => {
  if (is.value === 'button') {
    return props.type ?? 'button'
  }

  return null
})

const labelClass = computed(() => (props.small && props.icon ? 'px-1' : 'px-2'))

const componentClass = computed(() => {
  const base = [
    'inline-flex',
    'justify-center',
    'items-center',
    'relative', // added relative positioning
    'whitespace-nowrap',
    'focus:outline-none',
    'transition-colors',
    'focus:ring',
    'duration-150',
    'border',
    props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    props.roundedFull ? 'rounded-full' : 'rounded',
    getButtonColor(props.color, props.outline, !props.disabled, props.active)
  ]

  if (!props.label && props.icon) {
    base.push('p-1')
  } else if (props.small) {
    base.push('text-sm', props.roundedFull ? 'px-3 py-1' : 'p-1')
  } else {
    base.push('py-2', props.roundedFull ? 'px-6' : 'px-3')
  }

  if (props.disabled) {
    base.push(props.outline ? 'opacity-50' : 'opacity-70')
  }

  return base
})

const tooltipVisible = ref(false);
  
  const showTooltip = () => {
    tooltipVisible.value = true;
  };
  
  const hideTooltip = () => {
    tooltipVisible.value = false;
  };

</script>

<template>
        <button @mouseover="showTooltip" @mouseleave="hideTooltip">
          <component
    :is="is"
    :class="componentClass"
    :href="href"
    :type="computedType"
    :to="to"
    :target="target"
    :disabled="disabled" 
  >
    <BaseIcon v-if="icon" :path="icon" :size="iconSize" />
    <span v-if="label" :class="labelClass">{{ label }}</span>
    <span v-if="tooltipVisible" class="tooltip">{{ tooltip }}</span>
  </component>
          
        </button>

</template>

<style scoped>
 .tooltip {
    visibility: visible;
    background-color: #1e293b;
    color: #fff;
    text-align: center;
    font-weight: 490;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position the tooltip above the button */
    left: 50%;
    transform: translateX(-50%);
    opacity: 1;
    transition: opacity 0.3s;
    white-space: nowrap;
  }
.component:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
