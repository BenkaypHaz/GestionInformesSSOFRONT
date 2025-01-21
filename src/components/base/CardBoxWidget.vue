<script setup>
import { mdiCog } from '@mdi/js'
import CardBox from './CardBox.vue'
import NumberDynamic from './NumberDynamic.vue'
import BaseIcon from './BaseIcon.vue'
import BaseLevel from './BaseLevel.vue'
import PillTagTrend from './PillTagTrend.vue'
import BaseButton from './BaseButton.vue'

defineProps({
  number: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: null
  },
  prefix: {
    type: String,
    default: null
  },
  suffix: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  },
  trend: {
    type: String,
    default: null
  },
  trendType: {
    type: String,
    default: null
  }
})


</script>
<template>
  <CardBox>
    <BaseLevel v-if="trend" class="mb-3" mobile>
      <PillTagTrend :trend="trend" :trend-type="trendType" small />
    </BaseLevel>
    <BaseLevel mobile>
      <div>
        <h3 class="text-lg leading-tight text-gray-500 dark:text-slate-400">
          {{ label }}
        </h3>
        <h1 class="responsive-h1 text-3xl leading-tight font-semibold">
          <NumberDynamic :value="number" :prefix="prefix" :suffix="suffix" />
        </h1>
      </div>
      <BaseIcon v-if="icon" :path="icon" size="48" w="" h="h-16" :class="color" />
    </BaseLevel>
  </CardBox>
</template>

<style scoped>
@media (max-width: 640px) {
  .responsive-h1 {
    font-size: 1.5rem; /* Equivalent to text-xl in Tailwind */
    line-height: 1.75rem; /* Adjust line-height as needed */
  }
  
  /* Adjust h3 size for smaller screens if necessary */
  .responsive-h1 + h3 {
    font-size: 1rem; 
  }
}
</style>
