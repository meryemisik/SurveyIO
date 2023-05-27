import Vue from 'vue'
import store from '@/store/index'
import VueRouter from 'vue-router'
import HomeView from '../screens/Home'
import Login from '../screens/Login'
import { socketConnection } from './../main'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  socketConnection()
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  if (authRequired && !store.state.user) {
    next({
      path: 'login',
      replace: true
    })
    next()
  }
  else {
    next()
  }
})

export default router
