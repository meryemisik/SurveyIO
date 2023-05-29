import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex)
export default new Vuex.Store({

  state: {
    user: JSON.parse(localStorage.getItem('user')),
  },
  getters: {
    user (state) {
      return state.user
    }
  },
  mutations: {
    setAuth(state, data) {
      state.user = data
    },
    logout(state) {
      state.user = null
    }
  },
  actions: {
    setAuth(context, data) {
      localStorage.setItem('user', JSON.stringify(data))
      context.commit('setAuth', data)
    },
    logout(context) {
      localStorage.removeItem('user')
      context.commit('logout')
      router.push("/login");
    },
  },
  modules: {
  }
})
