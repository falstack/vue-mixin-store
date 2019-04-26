import Vue from 'vue'
import App from './App.vue'
import store from './store'
import FlowLoader from '../src/FlowLoader'

Vue.config.productionTip = false
Vue.component(FlowLoader.name, FlowLoader)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
