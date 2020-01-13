<template>
  <div id="app">
    <div class="homeScreen">
      <Admin></Admin>
      <!--<router-view/>-->
    </div>
  </div>
</template>

<script>
  import Admin from '@/components/admin/Admin'

  export default {
    name: 'App',
    components: {
      Admin
    },
    mounted() {
      this.axios.interceptors.request.use(
        (config) => {
          //post请求
          if (config.method === "post") {
            if (config.url.startsWith("/File")) {
              config.headers["Content-Type"] = "multipart/form-data"
              return config;
            }
            //替代 URLSearchParams
            config.data = this.qs.stringify(config.data);
          }
          //put请求
          if (config.method === "put") {
            //替代 URLSearchParams
            config.data = this.qs.stringify(config.data);
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        })
      this.axios.interceptors.response.use(
        (resp) => {
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
