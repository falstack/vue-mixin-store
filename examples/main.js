import Vue from 'vue'
import App from './App.vue'
import store from './store'
import FlowLoader from '../src/FlowLoader'
import router from './router'
import VSwitcher from 'v-switcher'
import 'v-switcher/dist/v-switcher.css'

Vue.config.productionTip = false
Vue.component(FlowLoader.name, FlowLoader)
Vue.component(VSwitcher.name, VSwitcher)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
