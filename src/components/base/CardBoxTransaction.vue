<script setup>
import { computed } from 'vue'
import { mdiCashCheck,mdiCashClock,mdiCashMinus, mdiCashPlus, mdiReceipt, mdiCreditCardOutline } from '@mdi/js'
import CardBox from '@/components/base/CardBox.vue'
import BaseLevel from '@/components/base/BaseLevel.vue'
import PillTag from '@/components/base/PillTag.vue'
import IconRounded from '@/components/base/IconRounded.vue'

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  }
})

const icon = computed(() => {
  if (props.type === 'Ejecutado') {
    return {
      icon: mdiCashCheck,
      type: 'danger'
    }
  } else if (props.type === 'No Ejecutado') {
    return {
      icon: mdiCashClock,
      type: 'success'
    }
  } else if (props.type === 'invoice') {
    return {
      icon: mdiReceipt,
      type: 'warning'
    }
  }

  return {
    icon: mdiCreditCardOutline,
    type: 'info'
  }
})
</script>

<template>
  <CardBox class="mb-6 last:mb-0">
    <BaseLevel>
      <BaseLevel type="justify-start">
        <IconRounded :icon="icon.icon" :color="icon.type" class="md:mr-6" />
        <div class="text-center space-y-1  md:mr-6">
          <h4 class="text-xl"><b>{{ amount }}</b></h4>
          <p class="text-gray-500 dark:text-slate-400">
            <b>{{ mensaje }}</b>  
          </p>
        </div>
      </BaseLevel>
      <div class="text-center md:text-right space-y-2">
        <div>
          <PillTag :color="icon.type" :label="type" small />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
