<template>
  <div class="vip">
    <!--盒子-->
    <div class="box" @click="intoVip">
      <span class="bg-pic vip"></span>
      <span class="text">会员权益</span>
    </div>

    <Input prefix="ios-paper-plane" v-model="url" placeholder="输入URL" style="width: 500px"/>

    <Button size="default" type="success" @click="updateVipUrl">保存</Button>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {
      obj: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        //会员权益的 链接URL
        url: ""
      }
    },
    methods: {
      //跳转链接
      intoVip: function () {
        window.open(this.url, '_blank');
      },
      //保存URL
      updateVipUrl: function () {
        let data = {
          navId: this.obj.id,
          url: this.url
        }
        this.axios.put(`${this.domain.Admin}/navgation/navInfo`, data)
          .then(resp => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
            this.load()
          })
          .catch(resp => {
          })
      },
      load: function () {
        //获取URL
        this.axios.get(`${this.domain.Admin}/navgation/navInfo`, {
          params: {
            navId: this.obj.id
          }
        })
          .then(resp => {
            let data = resp.data.data;
            this.url = data.url
          })
          .catch(resp => {
          })
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>
  /*字体样式*/
  .vip .box {
    border-radius: 4px;
    width: 200px;
    height: 70px;
    margin: 20px 0px 20px 20px;
    line-height: 70px;
    text-align: center;
    line-height: 70px;
    font-family: Arial;
    font-weight: initial;
    color: #000000;
    font-size: 20px;
    background-color: #F3F5F6;
  }

  .vip .box .text {
    display: inline-block;
    font-size: 20px;
  }

  .vip .box .bg-pic {
    display: inline-block;
    width: 50px;
    height: 50px;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-right: 8px;
  }

  .vip .box .vip {
    width: 40px;
    height: 40px;
    background-image: url(../../../assets/aboutUs/vip.png);
  }
</style>
