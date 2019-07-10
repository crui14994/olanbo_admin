// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import utils from "./utils/index" //导入工具函数

import "./assets/css/reset.css" // 引入样式文件

Vue.config.productionTip = false

// 把通用方法挂载到Vue原型上
Vue.prototype.$formatDate = utils.formatDate

Vue.prototype.axios= axios

//sotre
import store from "./store/index";


// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
