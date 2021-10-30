// 入口文件main.js

import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import router from './router'
import store from './store/index'
import './plugins/element.js'
import lodash from 'lodash'
// 导入全局样式表
import './assets/fonts/iconfont.css'
// 导入全局样式表
// import './assets/css/global.less'
import './assets/css/common.less'
import breadcrumb from './components/common/breadcrumb'

//
import global from './components/common/global/global'
import fileUtil from './components/common/global/fileUtil'
import qs from 'qs'
import ElTreeSelect from 'el-tree-select'
import httpRequest from './utils/httpRequest'
import message from './utils/message.js'// 引入

let Base64 = require('js-base64').Base64 // api: https://github.com/axios/axios
Vue.component('breadcrumb', breadcrumb)

httpRequest.defaults.baseURL = '/api'
Vue.prototype.$http = httpRequest

// 配置全局属性
Vue.prototype.$global = global
Vue.prototype.$print = fileUtil.print
Vue.prototype.$moment = moment
Vue.prototype.$lodash = lodash

Vue.prototype.$qs = qs

Vue.use(ElTreeSelect)
Vue.use(message) //通过全局方法 Vue.use() 使用插件
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 得到文件流后下载文件
// 拿到数据以后 通过 new Blob对象 创建excel
Vue.prototype.$downloadFile = fileUtil.downloadFile
// new Vue({
//   el: '#app',
//   router: router,
//   render: h => h(app)
//   render:function (h) {return function h(app)}
// }) 一致
