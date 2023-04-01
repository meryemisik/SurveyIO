import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io';


Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_SERVER_URL,
  transports: ['websocket', 'polling', 'flashsocket']

}));
new Vue({
  render: h => h(App),
}).$mount('#app')
