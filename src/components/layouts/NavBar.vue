<script setup>
import { ref, computed, onMounted } from 'vue';
import { mdiClose, mdiDotsVertical } from '@mdi/js';
import { containerMaxW } from '@/javascript/config.js';
import BaseIcon from '../base/BaseIcon.vue';
import NavBarMenuList from './NavBarMenuList.vue';
import NavBarItemPlain from './NavBarItemPlain.vue';
import CardBoxModalTableNoti from '@/components/base/CardBoxModalTableNoti.vue';
import { userService } from '@/services/UsuariosService';
import permissionsStore from '@/stores/stores';
import { on, emit } from '@/javascript/eventBus';

defineProps({
  menu: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(['menu-click']);

const menuClick = (event, item) => {
  emits('menu-click', event, item);
};

const isMenuNavBarActive = ref(false);
const isTableModalActive = ref(false);

const openTableModal = () => {
  isTableModalActive.value = true;
};

const unreadCount = ref(0);

const user = computed(() => permissionsStore.getUser());


onMounted(() => {

});

const buttonLabel = computed(() => `Notificaciones ${unreadCount.value}`);
</script>

<template>
  <CardBoxModalTableNoti v-model="isTableModalActive" title="Bandeja de Notificaciones" />

  <nav
    class="top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800"
  >
    <div class="flex lg:items-stretch" :class="containerMaxW">
      <div class="flex flex-1 items-stretch h-14">
        <slot />
      </div>
      <div class="flex-none items-stretch flex h-14 lg:hidden">
        <NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
          <BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
        </NavBarItemPlain>
      </div>
      <button @click="openTableModal">
        {{ buttonLabel }}
      </button>
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible absolute w-screen top-14 left-0 bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800"
        :class="[isMenuNavBarActive ? 'block' : 'hidden']"
      >
        <NavBarMenuList :menu="menu" @menu-click="menuClick" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
button {
  --bg: #1d2566;
  --text-color: #fff;
  position: relative;
  width: 175px;
  height: 30px; /* Set a fixed height */
  border: none;
  background: var(--bg);
  color: var(--text-color);
  padding: 0; /* Remove padding to rely on fixed height */
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  transition: 0.2s;
  border-radius: 5px;
  opacity: 0.8;
  letter-spacing: 1px;
  box-shadow: #151c52 0px 7px 2px, #000 0px 8px 5px;
  margin-top: 1em; /* Added margin at the top */
  line-height: 30px; /* Center text vertically */
}

button:hover {
  opacity: 1;
}

button:active {
  top: 4px;
  box-shadow: #1d2566 0px 3px 2px,#000 0px 3px 5px;
}
</style>
