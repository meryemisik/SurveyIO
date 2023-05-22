import Vue from 'vue'
import store from '@/store/index'
import VueRouter from 'vue-router'
import HomeView from '../screens/Home'
import Login from '../screens/Login'
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
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from) => {
  console.log(store.state.user)
  if(store.state.user){
    console.log('users', store.state.user)
  }
  else{
    console.log('elsey')
  }
})

export default router
