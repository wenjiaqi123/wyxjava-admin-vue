<template>
  <div class="login">
    <div class="bg">
      <div class="sysTitle">
        我要学Java
        <br>
        后台管理系统
      </div>
      <div class="box">
        <div class="top">
          账号登录
        </div>

        <div class="center">
          <!--账号-->
          <div class="account">
            <Input
              type="text"
              v-model="account"
              placeholder="请输入手机号"
              size="large"
              clearable
              prefix="ios-contact-outline"/>
          </div>

          <!--密码-->
          <div class="pwd">
            <Input
              type="password"
              v-model="password"
              placeholder="请输入密码"
              size="large"
              clearable
              password
              prefix="ios-lock-outline"/>
          </div>
        </div>

        <div class="bottom">
          <Button
            type="success"
            size="large"
            html-type="button"
            style="width: 100%"
            @click="login">
            登录
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    setCookie
  } from "@/tools/cookie";

  export default {
    name: "",
    components: {},
    data() {
      return {
        //账号
        account: "",
        //密码
        password: ""
      }
    },
    methods: {
      //登录
      login: function () {
        if (this.account.trim() == "") {
          this.$Notice.error({
            title: "请输入账号!"
          });
          return false;
        }
        if (this.password.trim() == "") {
          this.$Notice.error({
            title: "请输入密码!"
          });
          return false;
        }

        let data = {
          //手机号
          iphoneNo: this.account,
          //密码明文 base64
          userPwdOpen: Base64.encode(this.password),
          //密码密文 md5
          userPwdClose: this.Md5(this.password)
        }
        this.axios.post(`/admin/login/selectSysUser`, data, {
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        })
          .then((resp) => {
            let data = resp.data;
            if (data.code == 20000) {
              //登录成功
              this.$emit("my-event-login", true);
              //存到本地
              window.sessionStorage.setItem("token", data.data.token);
              let userInfo = JSON.stringify(data.data.sysUser);
              window.sessionStorage.setItem("userInfo", userInfo);
              window.sessionStorage.setItem("isLogin", true);
              //存到 cookie
              setCookie("isLogin", true);
              setCookie("userInfo", userInfo);
              setCookie("token", data.data.token);
              //存到Vue原型链
              Vue.prototype.isSign = true;
              Vue.prototype.userInfo = JSON.parse(userInfo);
              Vue.prototype.userId = this.userInfo.userId;
            }
          })
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
  /*背景图片*/
  .login .bg {
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/login/loginbg.jpg");
    background-size: 100%;
    background-repeat: no-repeat;
    /*相对自身定位*/
    position: relative;
  }

  /*系统名称*/
  .login .bg .sysTitle {
    font-size: 40px;
    color: #8ce6b0;
    border-radius: 4px;

    /*相对父盒子定位*/
    position: absolute;
    top: calc(25%);
    left: calc(10%);
  }

  /*登录盒子*/
  .login .bg .box {
    width: 320px;
    /*border: 1px solid black;*/
    background-color: #F0F0F0;
    border-radius: 4px;

    /*相对父盒子定位*/
    position: absolute;
    top: calc(25%);
    right: calc(14%);
    padding: 10px 10px 20px;
  }

  /*账号登录*/
  .login .bg .box .top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: center;
    color: #ff0000;
    border-bottom: 2px solid #ff0000;
  }

  /*账号*/
  .login .box .center .account {
    margin-top: 20px;
  }

  /*密码*/
  .login .box .center .pwd {
    margin-top: 20px;
  }

  /*登录按钮*/
  .login .box .bottom {
    margin-top: 20px;
  }
</style>
