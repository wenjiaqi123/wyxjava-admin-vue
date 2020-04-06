<template>
  <div class="global-uploader">
    <!--上传-->
    <uploader
      class="uploader-box"
      ref="uploader"
      :autoStart="false"
      :options="options"
      @file-success="onFileSuccess"
      @file-error="onFileError">

      <!--不支持HTML5 File API 的时候会显示-->
      <uploader-unsupport></uploader-unsupport>

      <!--拖拽上传区域-->
      <uploader-drop>
        <div class="drop-box">
          <div class="closeIcon" @click="closeFileUploader()">
            ×
          </div>

          <img src="../../assets/home/upload.png">

          <uploader-btn>选择文件</uploader-btn>
          <uploader-btn :directory="true">选择文件夹</uploader-btn>
        </div>
      </uploader-drop>

      <!--文件/文件夹 列表，用于展示-->
      <uploader-list>
        <!--<div slot-scope="props">
          <div v-for="i in props.fileList">
            <uploader-file :list="true" :file="i">
              <div slot-scope="aa">
                <span style="color: red">{{aa.status}}</span>
              </div>
            </uploader-file>
          </div>
        </div>-->
      </uploader-list>

    </uploader>
  </div>
</template>

<script>
  //参考文档
  //https://github.com/simple-uploader/vue-uploader/blob/master/README_zh-CN.md
  //https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E4%BA%8B%E4%BB%B6
  //https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md
  //https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html
  //https://blog.csdn.net/qq_26641781/article/details/84024194

  export default {
    name: "",
    components: {},
    data() {
      return {
        //需要传给后台的附加参数
        params: {},
        file:{
          fileId:""
        },
        options: {
          //#########  每一块必有属性  ##############################
          //上传目标URL地址
          target: 'http://localhost:18080/file/bFile/chunk',
          testChunks: false,
          //分块大小
          chunkSize: "1048576",
          //########################################################
          //最大自动失败重试上传次数
          maxChunkRetries: 2,
        },
        //文件类型
        attrs: {
          accept: '*/*'
        },
      }
    },
    methods: {
      //关闭文件选择框
      closeFileUploader: function () {
        //关闭文件上传框
        this.Store.commit("setFileUpFlag", false);
      },
      /**
       * 文件上传成功回调
       * rootFile   成功上传后文件说是有的根 Uploader.File 对象
       * file       当前成功的 Uploader.File 对象
       * response   服务端的响应，字符串，需要解析 let resp = JSON.parse(response);
       * chunk      Uploader.Chunk 对象，该文件的最后一个块， chunk.xhr.status就是该块的响应码
       */
      onFileSuccess: function (rootFile, file, response, chunk) {
        //file.uniqueIdentifier 文件的唯一id
        //file.chunks           文件的块数组
        let resp = JSON.parse(response);

        let data = {
          identifier:file.uniqueIdentifier,
          totalChunks:file.chunks.length
        }
        this.axios.post(`file/bFile/merge`, data)
          .then((resp) => {
            if(resp.data.flag){
              this.file.fileId = resp.data.data
            }
          })
      },
      /**
       * 文件上传失败回调
       */
      onFileError: function (rootFile, file, response, chunk) {
        this.$Notice.error({
          title: `上传失败`,
          desc: `${file.name}`,
          duration: 5
        })
      },
    },
    mounted() {
      //接收其他地方传过来的值，用于
      this.Bus.$on("my-event-global-uploader", (data) => {
        //如果有其他的参数需要传给后台，就封装在 data里
        this.params = data || {};

        //打开文件上传开关
        this.Store.commit("setFileUpFlag", true);
      });
    }
  }
</script>

<style>
  /*盒子*/
  .global-uploader {
    width: 600px;
    float: left;
    margin-top: calc(100px - 100vh);
    margin-left: calc(50% - 300px);
  }

  /*拖拽框*/
  .global-uploader .uploader-drop {
    background-color: #FFFFFF;
    box-shadow: 0 0 20px rgba(0, 0, 0, .4);
  }

  /*内侧盒子*/
  .global-uploader .uploader-drop .drop-box {
    height: 120px;
    border: 1px dashed #3399FF;
    border-radius: 6px;
    background-color: #F5F5F5;
    margin: 5px 10px 5px 10px;
  }

  /*关闭按钮*/
  .global-uploader .closeIcon {
    width: 30px;
    height: 30px;
    margin: -10px -10px 0px 0px;
    float: right;
    font-size: 40px;
    line-height: 30px;
    text-align: center;
    color: #FFFFFF;
    background-color: #FF0000;
    border-radius: 50%;
  }

  /*图片*/
  .global-uploader .uploader-drop .drop-box img {
    display: block;
    width: 60px;
    height: 60px;
    margin: 5px auto 5px;
  }

  /*选择框*/
  .global-uploader .uploader-btn {
    float: left;
    margin-left: 22%;
    border-radius: 4px;
    border: 1px solid #214af0;
  }

  /*文件列表*/
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

</style>
