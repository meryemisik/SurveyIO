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
import './assets/scss/style.scss'
import './assets/scss/loading.scss'
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
import InputMask from 'primevue/inputmask';
import Menu from 'primevue/menu';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Panel from 'primevue/panel';
import Tooltip from 'primevue/tooltip';

Vue.directive('tooltip', Tooltip);
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
Vue.component('InputMask', InputMask);
Vue.component('Menu', Menu);
Vue.component('TabView', TabView);
Vue.component('TabPanel', TabPanel);
Vue.component('Panel', Panel);
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
