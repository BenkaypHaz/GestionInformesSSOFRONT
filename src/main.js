import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useMainStore } from '@/stores/main.js';
import { useDarkModeStore } from './stores/darkMode';
import './assets/css/main.css'; 
import permissionsStore from '@/stores/stores';
import PrimeVue from 'primevue/config';

const pinia = createPinia();
const app = createApp(App).use(router).use(pinia).mount('#app');
app.use(PrimeVue);

const mainStore = useMainStore(pinia);
mainStore.fetchSampleClients();
mainStore.fetchSampleHistory();

const darkModeStore = useDarkModeStore(pinia)

if (
  (!localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage['darkMode'] === '1'
) {
  darkModeStore.set(true)
 }


const defaultDocumentTitle = 'AHM';

router.afterEach((to, from) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});

if (localStorage.getItem('user') && localStorage.getItem('permissions')) {
  permissionsStore.setUser(JSON.parse(localStorage.getItem('user')));
  permissionsStore.setPermissions(JSON.parse(localStorage.getItem('permissions')));
}
