// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import utils from "./utils/index" //导入工具函数
import * as filters from './filters' // 全局过滤器

import "./assets/css/reset.css" // 引入样式文件

Vue.config.productionTip = false

// 把通用方法挂载到Vue原型上
Vue.prototype.$formatDate = utils.formatDate;
Vue.prototype.getFilePreview = utils.getFilePreview;

Vue.prototype.axios= axios;

//sotre
import store from "./store/index";


// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

//引入富文本编辑器
import  VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)

// 全局注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
