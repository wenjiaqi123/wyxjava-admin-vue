<template>
  <div class="addChart">
    <!--936×382-->
    <Button size="default" type="success" @click="insertChart">保存</Button>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //表单数据
        formData: {
          //轮播图Url
          chartUrl: "",
          //点击轮播图跳转Url
          webUrl: ""
        }
      }
    },
    methods: {
      //本地文件上传成功
      uploadSuccess:function(response, file, fileList){
        console.log(`response`);
        console.log(`${response}`);

        console.log(`file`);
        console.log(`${file}`);

        console.log(`fileList`);
        console.log(`${fileList}`);
      },
      //保存轮播图
      insertChart:function () {

      }
    }
  }
</script>

<style scoped>
</style>
