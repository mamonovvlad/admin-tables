import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
