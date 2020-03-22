// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//axios 请求
import axios from 'axios'
//post请求
import qs from 'qs'
//iview样式
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
//多后台请求
import domain from '@/tools/domain'
//加密
import Base64 from "js-base64";
import Md5 from "js-md5";
//兄弟组件传值
import Bus from "@/tools/bus";
//权限
import Auth from "@/tools/authority";
//图片裁剪
import VueCropper from "vue-cropper"

Vue.config.productionTip = false

//全局配置axios，就是网页js请求的url路径

axios.defaults.baseURL = "http://localhost:18080"
// axios.defaults.baseURL = "http://www.wyxjava.com:80/"
// 解决 options 预请求
axios.defaults.headers = {
  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
};

//添加原型对象,组件中可以直接使用this.axios
Vue.prototype.axios = axios;
//全局定义,使用的时候用 this.qs.stringfy(data)
Vue.prototype.qs = qs;
//引入加密
Vue.prototype.Base64 = Base64;
Vue.prototype.Md5 = Md5;
//多后台
Vue.prototype.domain = domain;
//组件传值
Vue.prototype.Bus = Bus;
//权限
Vue.prototype.Auth = Auth;


//使用IView样式
Vue.use(ViewUI)
//使用VueCropper
Vue.use(VueCropper)

//iView 通知设置
Vue.prototype.$Notice.config({
  top: 300,
  duration: 3
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
