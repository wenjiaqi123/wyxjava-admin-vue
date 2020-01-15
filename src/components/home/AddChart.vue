<template>
  <div class="addChart">
    <!--936×382-->
    <div class="top">
      <div class="chartUrl">
        轮播图URL
      </div>
      <div class="chartInput">
        <Input prefix="ios-send" v-model="formData.chartUrl" placeholder="输入轮播图 URL" style="width: 500px"/>
      </div>
    </div>

    <!--上传轮播图文件-->
    <div class="center">
      <div class="right">
        <img :src="formData.imgData">
      </div>

      <div class="left" @change="uploadFile($event)">
        <input type="file" id="myFile" accept="image/jpeg,image/png,image/gif">
        <label for="myFile">
          <img src="../../assets/home/upload.png">
          <span>
          点我上传 936×382
        </span>
        </label>
      </div>
    </div>

    <div class="bottom">
      <div class="webUrl">
        轮播图跳转的URL
      </div>
      <div class="webInput">
        <Input prefix="ios-share-alt" v-model="formData.webUrl" placeholder="输入轮播图跳转的URL" style="width: 500px"/>
      </div>
    </div>

    <div class="useStatus">
      <RadioGroup v-model="formData.status">
        <Radio label="1">在用</Radio>
        <Radio label="0">失效</Radio>
      </RadioGroup>
    </div>

    <div class="save">
      <Button size="default" type="success" @click="insertChart">保存</Button>
    </div>
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
          webUrl: "",
          //文件
          imgData: null,
          //文件URL
          picUrl: "",
          //使用状态
          status: "1"
        },
        //文件上传之后的信息
        picInfo: null
      }
    },
    methods: {
      //input框上传文件
      uploadFile: function (e) {
        let _this = this;
        let file = e.target.files[0];

        let fr = new FileReader()
        fr.onload = function (ev) {
          let data;
          if (typeof ev.target.result === "object") {
            data = window.URL.createObjectURL(new Blob([ev.target.result]))
          } else {
            data = ev.target.result;
          }
          //赋值给 vueCropper 组件 img
          _this.formData.imgData = data;
          //解决每次选择相同文件， input @change 不执行问题
          event.target.value = "";

          /**
           * 上传图片
           */
          let picData = new FormData();
          picData.append("file", file);
          _this.axios.post(`/${_this.domain.File}/file/insertFileGetAllInfo`, picData)
            .then(resp => {
              let picInfo = resp.data.data;
              _this.picInfo = picInfo;
            })
            .catch(resp => {
            })

        }

        //转化为 文本
        // fr.readAsText(file);
        //转化为 Base64
        // fr.readAsDataURL(file)
        //转化为 blob
        fr.readAsArrayBuffer(file);
      },
      //保存轮播图
      insertChart: function () {
        if (this.picInfo == null && this.formData.webUrl == "") {
          this.$Notice.warning({
            title: "轮播图URL",
            desc: "URL或者图片至少需要一个"
          })
          return false;
        }
        let webUrl = ""
        if (this.picInfo != null) {
          webUrl = this.picInfo.fileUrl
        }else{
          webUrl = this.formData.webUrl
        }
        /**
         * 保存 轮播图信息
         */
        let data = {
          chartUrl: this.formData.chartUrl,
          webUrl: webUrl,
          status: this.formData.status
        }
        this.axios.post(`${this.domain.Admin}/rotationChart/chart`, data)
          .then(resp => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "保存成功"
              })
            }
          })
          .catch(resp => {
          })
      }
    }
  }
</script>

<style scoped>
  .addChart {
    margin-top: 4px;
    margin-left: 6px;
  }

  .center .right {
    float: right;
    margin-top: 14px;
  }

  /* 936×382 */
  .center .right img {
    width: 280.8px;
    height: 114.6px;
  }

  /*原生 input框*/
  .center .left input {
    /*display: inline-block;*/
    height: 0px;
    width: 0px;
  }

  /*自定义样式*/
  .center .left label {
    border: 1px dotted #3399FF;
    width: 300px;
    height: 100px;
    display: block;
    border-radius: 6px;

    line-height: 40px;
    font-size: 16px;
    color: #FF0000;
    text-align: center;
    padding-left: 8px;
    padding-right: 8px;
  }

  /*上传图片*/
  .center .left img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 5px auto 0px;
  }

  .bottom {
    margin-top: 20px;
  }

  .useStatus {
    margin-top: 20px;
  }

  .save {
    margin-top: 20px;
  }
</style>
