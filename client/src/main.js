import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import PrimeVue from 'primevue/config';
import { Photoshop } from 'vue-color'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'


//component
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import ColorPicker from 'primevue/colorpicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MegaMenu from 'primevue/megamenu';

Vue.use(PrimeVue);
Vue.config.productionTip = false
Vue.component('Photoshop', Photoshop);

Vue.component('Sidebar', Sidebar);
Vue.component('Button', Button);
Vue.component('Dialog', Dialog);
Vue.component('Dropdown', Dropdown);
Vue.component('InputText', InputText);
Vue.component('Card', Card);
Vue.component('DataTable', DataTable);
Vue.component('Column', Column);
Vue.component('ColorPicker', ColorPicker);
Vue.component('MegaMenu', MegaMenu);

export const socketConnection = () => {
  const socketConnection = SocketIO(process.env.VUE_APP_SERVER_URL);

  Vue.use(new VueSocketIO({
    debug: true,
    connection: socketConnection,
    transports: ['websocket']
  }));
}
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
