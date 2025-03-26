import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css"; 
import router from './router/index.js'

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(Toast);
app.mount('#app')