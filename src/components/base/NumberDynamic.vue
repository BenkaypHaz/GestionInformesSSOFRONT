<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import numeral from 'numeral';

const props = defineProps({
  prefix: {
    type: String,
    default: null
  },
  suffix: {
    type: String,
    default: null
  },
  value: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 500
  }
});

const newValue = ref(0);

const newValueFormatted = computed(() => {
  const value = newValue.value;
  if (value < 1000 && value > -1000) {
    return value.toFixed(2);
  } else {
    return numeral(value).format('0,0.00');
  }
});


const value = computed(() => props.value);

const grow = (m) => {
  const v = Math.ceil(newValue.value + m);

  if (v > value.value) {
    newValue.value = value.value;
    return false;
  }

  newValue.value = v;

  setTimeout(() => {
    grow(m);
  }, 25);
};

const growInit = () => {
  newValue.value = 0;
  grow(props.value / (props.duration / 25));
};

watch(value, () => {
  growInit();
});

onMounted(() => {
  growInit();
});
</script>

<template>
  <div>{{ prefix }}{{ newValueFormatted }}{{ suffix }}</div>
</template>
