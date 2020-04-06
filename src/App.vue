<template>
  <div id="app">
    <div class="homeScreen">
      <Login v-if="!isLogin" @my-event-login="login"></Login>
      <Admin v-if="isLogin"></Admin>
      <!--<router-view/>-->

      <!--全局上传组件-->
      <div style="width: 0px;height: 0px;overflow: hidden">
        <FileUpload></FileUpload>
        <FileSmall></FileSmall>
      </div>
      <div v-if="fileUpFlag">
        <FileUpload></FileUpload>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Login from '@/components/login/Login'
  import FileUpload from '@/components/file/FileUpload'
  import FileSmall from '@/components/file/FileSmall'
  import Admin from '@/components/admin/Admin'
  import {
    getCookie
  } from "@/tools/cookie";

  export default {
    name: 'App',
    components: {
      Admin,
      Login,
      FileUpload,
      FileSmall
    },
    data() {
      return {
        //是否登录，false未登录
        isLogin: false,
      }
    },
    computed: {
      fileUpFlag() {
        return this.Store.getters.getFileUpFlag;
      },
      userInfo() {
        return this.Store.getters.getUserInfo;
      }
    },
    methods: {
      login: function (data) {
        this.isLogin = data;
      },
      init: function () {
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
          this.Store.commit("setIsLogin", true);
          this.Store.commit("setToken", window.sessionStorage.getItem("token"));
          this.Store.commit("setUserInfo", JSON.parse(window.sessionStorage.getItem("userInfo")));
          this.Store.commit("setUserId", this.userInfo.userId);

          //直接登录
          this.isLogin = true;
        }
      }
    },
    mounted() {
      this.init();

      //监听，刷新 app 组件
      this.Bus.$on("my-event-app-login", (data) => {
        this.login(data);
      });

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
