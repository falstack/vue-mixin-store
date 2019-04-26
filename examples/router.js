import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./pages/index')
    },
    {
      path: '/page',
      name: 'page',
      component: () => import('./pages/page')
    },
    {
      path: '/jump',
      name: 'jump',
      component: () => import('./pages/jump')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('./pages/error')
    },
    {
      path: '/first-error',
      name: 'first-error',
      component: () => import('./pages/first-error')
    },
    {
      path: '/first-loading',
      name: 'first-loading',
      component: () => import('./pages/first-loading')
    },
    {
      path: '/last_id',
      name: 'last_id',
      component: () => import('./pages/last_id')
    },
    {
      path: '/since_id',
      name: 'since_id',
      component: () => import('./pages/since_id')
    },
    {
      path: '/seen_ids',
      name: 'seen_ids',
      component: () => import('./pages/seen_ids')
    },
    {
      path: '/nothing',
      name: 'nothing',
      component: () => import('./pages/nothing')
    }
  ]
})
