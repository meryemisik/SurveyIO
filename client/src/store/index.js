import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user')
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    //login logout
  },
  modules: {
  }
})
