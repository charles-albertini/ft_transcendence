import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router' // Importez votre routeur

const app = createApp(App)
app.use(i18n)
app.use(router) // Utilisez le routeur
app.mount('#app')