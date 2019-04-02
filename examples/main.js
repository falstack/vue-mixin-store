import Vue from 'vue'
import App from './App.vue'
import store from './store'
import FlowList from '../src/FlowList'

Vue.config.productionTip = false
Vue.component(FlowList.name, FlowList)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
