import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2'
import './assets/style.css'

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
//swal
import 'sweetalert2/dist/sweetalert2.min.css'



const app = createApp(App)
app.use(VueSweetalert2);
app.use(router)
app.mount('#app')
