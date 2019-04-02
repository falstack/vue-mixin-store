import Vue from 'vue'
import Vuex from 'vuex'
import flow from '../src/flow'
import * as API from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    flow: flow(API)
  }
})
