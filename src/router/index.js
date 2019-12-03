import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login/login.vue'
import Home from '@/view/home/home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
