<template>
  <div class="fileSmall">

    <div class="box">
      <input type="file" id="file-upload-btn" @change="uploadFile($event)">
    </div>

  </div>
</template>

<script>
  /**
   * 其他地方使用该组件
   * this.Bus.$emit("my-event-file-small-upload",{})
   *
   * 重新获得该组件的值
   * this.Bus.$on("my-event-file-info", (data)=>{
   *   let ev = data.ev;
   *   let file = data.file;
   *   let fileInfo = data.fileInfo;
   * });
   */
  export default {
    name: "",
    components: {},
    data() {
      return {
        params: {}
      }
    },
    methods: {
      //input框上传文件
      uploadFile: function (e) {
        let _this = this;
        let file = e.target.files[0];

        let fr = new FileReader()

        //转化为 文本
        // fr.readAsText(file);
        //转化为 Base64
        // fr.readAsDataURL(file)
        //转化为 blob
        fr.readAsArrayBuffer(file);

        fr.onload = function (ev) {
          let data;
          if (typeof ev.target.result === "object") {
            data = window.URL.createObjectURL(new Blob([ev.target.result]))
          } else {
            data = ev.target.result;
          }
          //解决每次选择相同文件， input @change 不执行问题
          event.target.value = "";

          /**
           * 上传图片
           */
          let formData = new FormData();
          formData.append("file", file);
          _this.axios.post(`/file/sFile/addFile`, formData)
            .then(resp => {
              if (resp.data.flag) {
                _this.Bus.$emit("my-event-file-info", {
                  ev: ev,
                  file: file,
                  fileInfo: resp.data.data
                });
              }
            })
        }
      },
    },
    mounted() {
      //接收其他地方传过来的值，用于
      this.Bus.$on("my-event-file-small-upload", (data) => {
        console.log(222);
        //如果有其他的参数需要传给后台，就封装在 data里
        this.params = data || {};

        // 这里相当于用代码完成了用户点击事件，等于用户点击了  选择文件
        document.getElementById("file-upload-btn").click();
      });
    }
  }
</script>

<style scoped>
  .fileSmall .box input {
    height: 0px;
    width: 0px;
  }
</style>
