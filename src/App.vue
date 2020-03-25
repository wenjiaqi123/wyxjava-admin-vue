<template>
  <div id="app">
    <div class="homeScreen">
      <Login v-if="!isLogin" @my-event-login="login"></Login>
      <Admin v-if="isLogin"></Admin>
      <!--<router-view/>-->
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Login from '@/components/login/Login'
  import Admin from '@/components/admin/Admin'
  import {
    getCookie
  } from "@/tools/cookie";

  export default {
    name: 'App',
    components: {
      Admin, Login
    },
    data() {
      return {
        //是否登录，false未登录
        isLogin: false
      }
    },
    methods: {
      login: function (data) {
        this.isLogin = data;
      }
    },
    mounted: function () {
      //是否登录
      const isLogin = getCookie("isLogin");
      //如果记住密码
      if (isLogin) {
        //取出信息，存到 sessionStorage
        let cookieToken = getCookie("token");
        let cookieUserInfo = getCookie("userInfo");
        window.sessionStorage.setItem("isLogin", true);
        window.sessionStorage.setItem("token", cookieToken);
        window.sessionStorage.setItem("userInfo", cookieUserInfo);
      }
      //从sessionStorage取出信息，放到全局
      const isLoginSession = window.sessionStorage.getItem("isLogin");
      if (isLoginSession) {
        let sessionToken = window.sessionStorage.getItem("token");
        let sessionUserInfo = window.sessionStorage.getItem("userInfo");
        //全局对象，token
        Vue.prototype.isSign = true;
        Vue.prototype.userInfo = JSON.parse(sessionUserInfo);
        Vue.prototype.userId = this.userInfo.id;
        Vue.prototype.token = sessionToken;
        this.isLogin = true
      }


      //拦截器
      this.axios.interceptors.request.use(
        (config) => {
          const sessionToken = window.sessionStorage.getItem("token");
          //如果 token 不为空
          if (sessionToken != null) {
            config.headers.Authorization = sessionToken
          }
          //post请求
          if (config.method === "post") {
            if (config.url.startsWith("/File")) {
              config.headers["Content-Type"] = "multipart/form-data"
              return config;
            }
            config.headers["Content-Type"] = "application/json;charset=UTF-8"
            //替代 URLSearchParams
            // config.data = this.qs.stringify(config.data, {arrayFormat: 'indices', allowDots: true});
          }
          //put请求
          if (config.method === "put") {
            config.headers["Content-Type"] = "application/json;charset=UTF-8"
            //替代 URLSearchParams
            // config.data = this.qs.stringify(config.data, {arrayFormat: 'indices', allowDots: true});
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        })
      this.axios.interceptors.response.use(
        (resp) => {
          let data = resp.data;

          if (data.code == 500) {
            this.$Notice.error({
              title: "服务器有点忙哦!"
            });
          }
          if (data.code == 20002) {
            this.$Notice.error({
              title: data.message
            });
          }
          //响应正确时
          return resp;
        },
        (error) => {
          return Promise.reject(error);
        }
      )
    }
  }
</script>

<style>
  * {
    margin: 0px;
    padding: 0px;
    text-decoration: none; /*下划线*/
    list-style: none; /* ul li 的小圆点*/
    font-family: Arial; /*字体*/
    font-size: 16px; /*文字大小*/
  }

  .homeScreen {
    width: 100%;
    height: 100%;
    margin: 0px auto;
  }
</style>
