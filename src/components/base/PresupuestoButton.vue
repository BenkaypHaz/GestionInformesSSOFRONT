<template>
  <div :class="buttonClass" @click="handleClick">
    <div class="button" :class="buttonClass">
      <span class="button-content">
        &nbsp;{{ title }}&nbsp;
        <small :class="stateClass" class="state-text">&nbsp;{{ stateText }}&nbsp;</small>
      </span>
      <span aria-hidden="true" class="hover-text">
        &nbsp;{{ title }}&nbsp;
        <small :class="stateClass" class="state-text">&nbsp;{{ stateText }}&nbsp;</small>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  state: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
  switch (props.state) {
    case 0:
      return 'state-0'
    case 1:
      return 'state-1';
    case 2:
      return 'state-2';
    case 3:
      return 'state-3';
    default:
      return 'status-button';
  }
});

const stateClass = computed(() => {
  switch (props.state) {
    case 0:
      return 'state-0-text'
    case 1:
      return 'state-1-text';
    case 2:
      return 'state-2-text';
    case 3:
      return 'state-3-text';
    default:
      return '';
  }
});

const stateText = computed(() => {
  switch (props.state) {
        case 0:
      return 'Creándose'
    case 1:
      return 'Pendiente';
    case 2:
      return 'Revisar';
    case 3:
      return 'Aprobado';
    default:
      return '';
  }
});

const handleClick = () => {
  emit('click', props.id);
};
</script>

<style scoped>
.button {
  margin: 0;
  height: auto;
  background: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
}

/* button styling */
.button {
  --border-right: 6px;
  --text-stroke-color: rgba(255,255,255,0.6);
  --animation-color: #37FF8B;
  --fs-size: 2em;
  letter-spacing: 3px;
  text-decoration: none;
  font-size: var(--fs-size);
  font-family: "Arial";
  position: relative;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px var(--text-stroke-color);
}

.state-text {
  font-size: 0.8em;
  text-transform: none;
}


.state-0-text {
  color: #46e0e6;
}
.state-1-text {
  color: blue;
}

.state-2-text {
  color: yellow;
}

.state-3-text {
  color: red;
}

/* this is the text, when you hover on button */
.hover-text {
  position: absolute;
  box-sizing: border-box;
  content: attr(data-text);
  color: var(--animation-color);
  width: 0%;
  inset: 0;
  border-right: var(--border-right) solid var(--animation-color);
  overflow: hidden;
  transition: 0.5s;
  -webkit-text-stroke: 1px var(--animation-color);
}
/* hover */
.button:hover .hover-text {
  width: 100%;
  filter: drop-shadow(0 0 23px var(--animation-color))
}

/* State-specific hover colors */
.state-1 .hover-text {
  --animation-color: #578ec9;
}

.state-2 .hover-text {
  --animation-color: #8fe329;
}

.state-3 .hover-text {
  --animation-color: #b0313a;
}
.state-0 .hover-text {
  --animation-color: #46e0e6;
}
</style>
