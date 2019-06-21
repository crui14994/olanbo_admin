import Vue from 'vue'
import Router from 'vue-router'
import { routers } from './route';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: routers
})
