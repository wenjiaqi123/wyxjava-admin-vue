<template>
  <div class="addCourse">
    <!---->
    <div class="right">
      <!--右侧的保存按钮-->
      <div class="button">
        <Button size="default" type="success" @click="saveCourse">保存</Button>
      </div>

      <!--评分框-->
      <div class="score" style="padding-left: 40px">
        <div>
          <span class="text">课程名称：</span>
          <Input prefix="ios-school" v-model="courseName" placeholder="输入课程名称" style="width: 300px"/>
        </div>
        <div style="margin-top: 20px">
          <span class="text">课程评分：</span>
          <Input prefix="md-star-half" v-model="score" placeholder="输入评分" style="width: 100px"/>
        </div>
      </div>
    </div>

    <!--课程视频-->
    <div class="video">
      <div class="warp">
        <Input prefix="logo-youtube" v-model="videoUrl" placeholder="输入视频URL" style="width: 300px;margin: 10px"/>
        <div class="upload" @change="uploadFile($event)">
          <input type="file" id="myFile">
          <label for="myFile">
            <img src="../../assets/home/upload.png">
            <span>
          点我上传视频
        </span>
          </label>
        </div>
      </div>
    </div>

    <!--资料-->
    <div class="data">
      <!--状态显示-->
      <div v-for="(i,index) in dataList" class="box">
        <Input prefix="md-paper" v-model="i.dataName" placeholder="输入名称" style="width: 300px"/>
        <Input prefix="ios-paper-plane" v-model="i.dataUrl" placeholder="输入URL" style="width: calc(100% - 400px)"/>
        <Button size="small" type="error" @click="subData(index)"> ×</Button>
        <Button size="small" type="success">↑</Button>
        <Button size="small" type="success">↓</Button>
      </div>
      <div class="add">
        <Button size="default" type="success" @click="addData">+</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //课程Id
        sid: this.$route.query.sid,
        //视频URL
        videoUrl: "",
        //课程评分
        score: 5.0,
        //课程名称
        courseName: "",
        //资料
        dataList: [],
        //单个资料数据
        dataDetail: {
          "courseDataId": "",
          "courseId": 0,
          "dataName": "",
          "dataUrl": "",
          "showOrder": "",
          "status": 1
        },
        //上传的文件信息
        fileInfo: null
      }
    },
    methods: {
      saveCourse: function () {
        if (this.courseName == "" || this.courseName.trim().length == 0) {
          this.$Notice.error({
            title: "课程名不能为空"
          })
          return false;
        }
        for (let i in this.dataList) {
          this.dataList[i].showOrder = i
        }
        let data = {
          //科目id
          subjectId: this.sid,
          //课程名称
          courseName: this.courseName,
          courseDetails:{
            //课程视频URL
            courseUrl: this.videoUrl,
            //评分
            courseScore: this.score,
          },
          //课程资料
          courseDataList: this.dataList
        }
        this.axios.post(`/course/course/course`, data)
          .then((resp) => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "保存成功"
              })
              this.$router.push(
                {
                  path:"subjectDetails",
                  query:{
                    sid:this.sid
                  }
                }
              )
            }
          })
          .catch((resp) => {
          })
      },
      //添加资料
      addData: function () {
        let length = this.dataList.length;
        let dataDetail = JSON.parse(JSON.stringify(this.dataDetail));
        dataDetail.courseId = this.cid
        this.$set(this.dataList, length, dataDetail)
      },
      //减少资料
      subData: function (index) {
        this.dataList.splice(index, 1)
      },
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
           * 上传文件
           */
          let picData = new FormData();
          picData.append("file", file);
          _this.axios.post(`/${_this.domain.File}/file/insertFileGetAllInfo`, picData)
            .then(resp => {
              let fileInfo = resp.data.data;
              _this.fileInfo = fileInfo;
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
    }
  }
</script>

<style scoped>
  .video,
  .video .warp {
    width: 320px;
    height: 180px;
  }

  .video .warp {
    background-color: #d5d5d5;
  }

  /*原生 input框*/
  .addCourse .video .warp input {
    /*display: inline-block;*/
    height: 0px;
    width: 0px;
  }

  /*自定义样式*/
  .addCourse .video .warp label {
    border: 1px dotted #3399FF;
    width: 300px;
    height: 100px;
    margin-left: 10px;
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
  .addCourse .video .warp img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 5px auto 0px;
  }

  /*右侧资料框，编辑保存取消等*/
  .addCourse .right {
    float: right;
    width: calc(100% - 320px);
    height: 180px;
  }

  /*右侧编辑保存按钮*/
  .addCourse .right .button {
    margin: 10px 20px 0px 0px;
    float: right;
  }

  /*右侧得分box*/
  .addCourse .right div.score {
    margin-top: 10px;
    width: calc(100% - 100px);
    height: 36px;
  }

  /*课程评分*/
  .addCourse .right div.score span.text {
    display: inline-block;
    line-height: 34px;
    font-size: 16px;
    margin-left: 20px;
  }

  /*评分*/
  .addCourse .right div.score span.score {
    display: inline-block;
    line-height: 34px;
    font-size: 18px;
    margin-left: 10px;
    color: #FF0000;
  }

  /*资料*/
  .addCourse div.data .box {
    margin: 15px 20px 0px 20px;
    height: 30px;
  }

  /*资料名称*/
  .addCourse div.data {
    margin-top: 50px;
    padding: 20px 0px;
    border: 1px dotted black;
  }

  /*资料添加*/
  .addCourse div.data .add {
    margin: 15px 20px 0px 20px;
  }

  /*讨论区*/
  .addCourse div.discuss {
    border: 1px solid black;
    margin: 15px 20px 0px 20px;
  }
</style>
