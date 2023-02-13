import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io';


Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  connection: 'https://mat-vote-app.onrender.com',
  transports: ['websocket', 'polling', 'flashsocket']

}));
new Vue({
  render: h => h(App),
}).$mount('#app')
