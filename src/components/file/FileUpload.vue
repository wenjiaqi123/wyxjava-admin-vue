<template>
  <div class="global-uploader">
    <!--上传-->
    <!--
      参数：
          options：      具体字段参考 data中的注释
          autoStart:     默认 true 是否选择文件后自动开始上传
      事件：
          @upload-start()                     开始上传
          @file-added(file,fileList)          添加了一个文件，一般用做文件校验，如果给 file或者fileList 增加 ignored属性为true的话就会被过滤掉
          @file-success()                     文件上传成功回调
          @file-progress()                    文件进度的回调 ，上传过程会不断触发 progress 上传进度的回调
          @file-error()                       文件上传失败回调
          @file-removed(file)                 移除一个文件
          @files-submitted(files,fileList)    所选择的文件添加到上传队列后触发
     -->
    <uploader
      class="uploader-box"
      ref="uploader"
      :options="options"
      :autoStart="false"
      @upload-start="onStartUpload"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @file-removed="onFileRemoved"
      @files-submitted="onFilesSubmitted">


      <!--点选上传文件按钮-->
      <!--
        参数：
        directory = {Boolean}   默认false ，是否文件夹上传
        single = {Boolean}      默认false，如果为true，每次只能选择一个文件
        attrs = {Object}        默认{}，添加到 input 元素上的额外属性
      -->
      <!--<uploader-btn>选择文件</uploader-btn>-->

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
      <uploader-list></uploader-list>

      <!--文件列表 没有文件夹概念-->
      <!--<uploader-files></uploader-files>-->

      <!--文件/文件夹 单个组件-->
      <!--
        参数：
        file = {Uploader.file}    封装的文件实例
        list = {Boolean}          如果是在 uploader-list中使用，设置为 true
      -->
      <!--<uploader-file></uploader-file>-->

      <!--不支持HTML5 File API 的时候会显示-->
      <uploader-unsupport></uploader-unsupport>

    </uploader>
  </div>
</template>

<script>
  //参考文档
  //https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html
  //https://blog.csdn.net/qq_26641781/article/details/84024194
  //https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md

  export default {
    name: "",
    components: {},
    data() {
      return {
        //需要传给后台的附加参数
        params: {},
        options: {
          //#########  每一块必有属性  ##############################
          //上传目标URL地址
          target: 'http://localhost:18080/file',

          //每个块的唯一标识
          identifier:"",
          //文件总大小
          totalSize:"",
          //分块大小
          chunkSize: "2048000",
          //当前块的大小，实际大小
          currentChunkSize:"",
          //当前块的次序，第一个块是 1，注意不是从 0 开始的
          chunkNumber: 1,
          //文件被分成的总数
          totalChunks:"",

          //文件名
          filename:"",
          //文件夹上传的时候，文件的相对路径属性
          relativePath:"",
          //########################################################

          //最大自动失败重试上传次数
          maxChunkRetries: 3,
          //是否开启服务器分片校验
          testChunks: true,
          // 服务器分片校验函数，秒传及断点续传基础
          headers: {
            // 在header中添加的验证 Authorization
            Authorization: window.sessionStorage.getItem("token")
          }
        },
        //文件类型
        attrs: {accept: '*/*'},
      }
    },
    methods: {
      //关闭文件选择框
      closeFileUploader: function () {
        //关闭文件上传框
        this.Store.commit("setFileUpFlag", false);
      },
      //开始上传
      onStartUpload: function () {
        console.log("开始上传方法执行");
      },
      //添加了一个文件，
      onFileAdded: function (file, fileList) {
        console.log(1111);
        console.log(file);
        console.log(fileList);
      },
      /**
       * 文件上传成功后，在上传完成回调里，
       * 通过服务端返回的 needMerge【与后台协商】 字段，来判断是否需要再发送合并分片的请求
       * 如果该字段为 true ，则需要给后台发哦送你各一个请求合并的请求，否则直接上传成功
       */
      onFileSuccess: function () {
      },
      //文件进度的回调 ，上传过程会不断触发 progress 上传进度的回调
      onFileProgress() {
      },
      //文件上传失败回调
      onFileError: function () {
        alert();
      },
      //移除一个文件
      onFileRemoved: function (file) {
      },
      //所选择的文件添加到上传队列后触发
      onFilesSubmitted: function (file, fileList) {
      },
    },
    mounted() {
      //接收其他地方传过来的值，用于
      this.Bus.$on("my-event-global-uploader", (data) => {
        //如果有其他的参数需要传给后台，就封装在 data里
        this.params = data || {};

        //打开文件上传开关
        this.Store.commit("setFileUpFlag", true);

        //因为该组件是做的一个全局组件，所以将 选择文件 的按钮隐藏掉
        /*if (this.$refs.uploadBtn) {
          // 这里相当于用代码完成了用户点击事件，等于用户点击了  选择文件
          document.getElementById("global-uploader-btn").click();
        }*/
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
