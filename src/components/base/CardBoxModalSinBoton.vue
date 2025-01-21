<script setup>
import { computed } from 'vue'
import { mdiClose } from '@mdi/js'
import { categoriaService } from '@/services/CategoriasService';
import BaseButton from './BaseButton.vue'
import BaseButtons from './BaseButtons.vue'
import CardBox from './CardBox.vue'
import OverlayLayer from './OverlayLayer.vue'
import CardBoxComponentTitle from './CardBoxComponentTitle.vue'
import CardBoxTransaction from './CardBoxTransaction.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  button: {
    type: String,
    default: 'info'
  },
  buttonLabel: {
    type: String,
    default: 'Aceptar'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  selectedCategory: Object 
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmCancel = (mode) => {
  value.value = false
  emit(mode)
}

const confirm = () => {
  updateCategory();  
  confirmCancel('confirm');
};


const cancel = () => confirmCancel('cancel')

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && value.value) {
    cancel()
  }
})

async function fetchCategories() {
  try {
    const response = await categoriaService.getAllCategories();
    categories.value = response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error.message);
  }
}


const updateCategory = async () => {
  if (!props.selectedCategory || !props.selectedCategory.idCat) {
    console.error("Invalid category data");
    return;
  }
  try {
    await categoriaService.updateCategory(props.selectedCategory.idCat, { IdCat:props.selectedCategory.idCat ,nombre: props.selectedCategory.nombre });
    fetchCategories();  
    value.value = false;  
  } catch (error) {
    console.error("Failed to update category:", error.message);
  }
};

</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      class="shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50"
      is-modal
    >
      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>
      <div class="space-y-3">
        <slot />
      </div>

      <template #footer>
        <BaseButtons>
          <BaseButton v-if="hasCancel" label="Cancel" :color="button" outline @click="cancel" />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
