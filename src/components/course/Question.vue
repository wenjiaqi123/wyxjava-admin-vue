<template>
  <div class="question">
    <div>question</div>
    <div>{{fileUpFlag}}</div>

    <div style="width: 100px;height: 400px;border:1px solid black;" @click="uploadBigFile">
      点我上传文件
    </div>

  </div>
</template>

<script>

  export default {
    name: "",
    components: {},
    data() {
      return {}
    },
    computed: {
      fileUpFlag() {
        return this.Store.getters.getFileUpFlag;
      }
    },
    methods: {
      //上传文件
      uploadBigFile: function () {
        //兄弟组件传值，
       /* this.Bus.$emit("my-event-global-uploader", {
          superiorID: this.superiorID
        });*/

        this.Bus.$emit("my-event-file-small-upload", {});
      }
    }
  }
</script>

<style scoped>
  .question {
    border: 1px solid black;
  }
</style>
