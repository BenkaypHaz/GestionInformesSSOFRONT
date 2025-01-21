<script setup>
import { mdiLogout, mdiClose,mdiBackburger } from '@mdi/js'
import { computed,onMounted } from 'vue'
import { useRoute } from 'vue-router';
import AsideMenuList from './AsideMenuList.vue'
import AsideMenuItem from './AsideMenuItem.vue'
import BaseIcon from '../base/BaseIcon.vue'
import { useRouter } from 'vue-router';
import permissionsStore from '@/stores/stores';


const props = defineProps({
  menu: {
    type: Array,
    required: true
  }
});


const router = useRouter();
const user = computed(() => permissionsStore.getUser());
const userRol = computed(() => user.value?.idRol || null);

const filteredMenu = computed(() => {
  return props.menu.filter(item => {
    if (!item.roles) {
      return true; 
    }
    return item.roles.includes(parseInt(userRol.value)); 
  });
});


const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const logoutItem = computed(() => ({
  label: 'Cerrar sesión',
  icon: mdiLogout,
  color: 'ahm',
  isLogout: true
}))
const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('permissions'); 


};
const menuClick = (event, item) => {
  emit('menu-click', event, item);
  
  if (item.isLogout) {
    clearUserData();
    router.push({ name: 'login' }); 
  }
};
const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}


onMounted(()=>{

})


</script>

<template>
  <aside
    id="aside"
    class="lg:py-2 lg:pl-2 w-64 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
  >
    <div class="aside lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900">
      <div class="aside-brand flex flex-row h-14 items-center justify-between dark:bg-slate-900">
        <div class="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
          <b class="font-black">AHM</b>
        </div>
        <button class="p-3" @click.prevent="asideLgCloseClick">
          <BaseIcon :path="mdiBackburger" />
        </button>
      </div>
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]"
      >
        <AsideMenuList :menu="filteredMenu" @menu-click="menuClick" />
      </div>
    </div>
  </aside>
</template>




