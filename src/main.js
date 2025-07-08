import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useMainStore } from '@/stores/main.js';
import './assets/css/main.css'; 
import permissionsStore from '@/stores/stores';
import PrimeVue from 'primevue/config';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(PrimeVue); // ✔️ CORRECTO

app.mount('#app');

const mainStore = useMainStore(pinia);
mainStore.fetchSampleClients(); 
mainStore.fetchSampleHistory();     
   


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
