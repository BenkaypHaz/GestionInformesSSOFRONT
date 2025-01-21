<template>
  <div class="cards">
    <div
      v-for="(card, index) in cards"
      :key="index"
      :class="['card', colorClass]"
      @click="handleClick(card.idPresu, card.estado)"
    >
      <p class="tip">{{ card.tipText }}</p>
      <p class="second-text">{{ formatCurrency(card.secondText) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cards: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: 'blue-ocean' 
  }
});

const emit = defineEmits(['card-click']);

const colorClass = computed(() => props.color);

const handleClick = (id, estado) => {
  emit('card-click', id, estado);
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value);
    if (isNaN(value)) return ''; 
  }
  
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace('L', 'Lps');
};

</script>

<style scoped>
.cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%; /* Take full width of the parent */
}

.blue-ocean {
  background-color: #181c2c;
}

.cards .card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100px;
  width: 100%; /* Expand to full width */
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: 400ms;
}

.cards .card p.tip {
  font-size: 1em;
  font-weight: 700;
}

.cards .card p.second-text {
  font-size: 0.7em;
}

.cards .card:hover {
  transform: scale(1.1, 1.1);
}

.cards:hover > .card:not(:hover) {
  filter: blur(10px);
  transform: scale(0.9, 0.9);
}
</style>
