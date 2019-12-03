// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueX from 'vuex'
import App from './App'
import router from './router'
import VueParticles from 'vue-particles'
import VueResource from 'vue-resource'
Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(VueX)
Vue.use(VueResource)
import "./assets/css/main.css"
/* eslint-disable no-new */
Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
