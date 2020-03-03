<template>
  <div class="courseDetails">
    <!---->
    <div class="right">
      <!--右侧的 编辑保存按钮-->
      <div class="button">
        <Button size="default" type="success" v-if="!editFlag" @click="goToEdit">编辑</Button>
        <Button size="default" type="success" v-if="editFlag" @click="saveEdit">保存</Button>
        <div style="margin-top: 2px"></div>
        <Button size="default" type="info" v-if="editFlag" @click="cancelEdit">取消</Button>
      </div>

      <!--评分框-->
      <div class="score" style="padding-left: 40px">
        <div>
          <span class="text">课程名称：</span>
          <span v-if="!editFlag" class="score">{{courseName}}</span>
          <Input v-if="editFlag" prefix="ios-school" v-model="courseNameTmp" placeholder="输入课程名称" style="width: 300px"/>
        </div>
        <div style="margin-top: 20px">
          <span class="text">课程评分：</span>
          <span v-if="!editFlag" class="score">{{score}}</span>
          <Input v-if="editFlag" prefix="md-star-half" v-model="scoreTmp" placeholder="输入评分" style="width: 100px"/>
        </div>
      </div>
    </div>

    <!--课程视频-->
    <div class="video">
      <!--正常状态显示-->
      <video v-if="!editFlag" :src="videoUrl" autoplay controls width="320" height="180">
      </video>
      <!--编辑状态显示-->
      <div v-if="editFlag" class="warp">
        <Input prefix="logo-youtube" v-model="videoUrlTmp" placeholder="输入视频URL" style="width: 300px;margin: 10px"/>
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
      <!--正常状态展示-->
      <div v-if="!editFlag" v-for="i in dataList" class="box" @click="openUrl(i)">
        <div class="name">{{i.dataName}}</div>
        <div class="url">{{i.dataUrl}}</div>
      </div>

      <!--编辑状态显示-->
      <div v-if="editFlag" v-for="(i,index) in dataListTmp" class="box">
        <Input prefix="md-paper" v-model="i.dataName" placeholder="输入名称" style="width: 300px"/>
        <Input prefix="ios-paper-plane" v-model="i.dataUrl" placeholder="输入URL" style="width: calc(100% - 400px)"/>
        <Button size="small" type="error" @click="subData(index)"> ×</Button>
        <Button size="small" type="success">↑</Button>
        <Button size="small" type="success">↓</Button>
      </div>
      <div v-if="editFlag" class="add">
        <Button size="default" type="success" @click="addData">+</Button>
      </div>
    </div>

    <!--讨论-->
    <div class="discuss">
      讨论区
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
        cid: this.$route.query.cid,
        courseDetailId: 0,
        //课程名称
        courseName: "",
        courseNameTmp: "",
        //视频URL
        videoUrl: "",
        videoUrlTmp: "",
        //编辑状态
        editFlag: false,
        //课程评分
        score: "",
        scoreTmp: "",
        //资料
        dataList: [],
        dataListTmp: [],
        //单个资料数据
        dataDetail: {
          "id": "",
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
      //进入编辑状态
      goToEdit: function () {
        this.courseNameTmp = this.courseName
        this.videoUrlTmp = this.videoUrl
        this.scoreTmp = this.score
        this.dataListTmp = [].concat(this.dataList)
        this.editFlag = true
      },
      //保存编辑
      saveEdit: function () {
        this.courseName = this.courseNameTmp
        this.videoUrl = this.videoUrlTmp
        this.score = this.scoreTmp
        this.dataList = [].concat(this.dataListTmp)
        for (let i in this.dataList) {
          this.dataList[i].showOrder = i
        }
        //更新课程详细信息
        let courseDetail = {
          //课程名称
          courseName: this.courseName,
          //课程id
          courseId: this.cid,
          //课程评分
          courseScore: this.score,
          //视频URL
          courseUrl: this.videoUrl,
          //课程资料
          courseDataVos: this.dataList
        }
        this.axios.post(`${this.domain.Admin}/course/courseDetails`, courseDetail)
          .then((resp) => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
            this.load()
          })
          .catch((resp) => {
          })
        this.editFlag = false
      },
      //取消编辑
      cancelEdit: function () {
        this.editFlag = false
      },
      //打开资料
      openUrl: function (data) {
        window.open(data.dataUrl, '_blank');
      },
      //添加资料
      addData: function () {
        let length = this.dataListTmp.length;
        let dataDetail = JSON.parse(JSON.stringify(this.dataDetail));
        dataDetail.courseId = this.cid
        this.$set(this.dataListTmp, length, dataDetail)
      },
      //减少资料
      subData: function (index) {
        this.dataListTmp.splice(index, 1)
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
      load: function () {
        //获取课程信息
        this.axios.get(`${this.domain.Admin}/course/course`, {
          params: {
            id: this.cid
          }
        })
          .then(resp => {
            let data = resp.data.data;
            this.courseName = data.courseName
          })
          .catch(resp => {
          })
        //获取课程信息
        this.axios.get(`${this.domain.Admin}/course/courseDetails`, {
          params: {
            courseId: this.cid
          }
        })
          .then(resp => {
            let data = resp.data.data;
            //视频URL
            this.videoUrl = data.courseUrl;
            this.score = data.courseScore;
            this.courseDetailId = data.id
          })
          .catch(resp => {
          })
        //获取资料
        this.axios.get(`${this.domain.Admin}/course/courseDataList`, {
          params: {
            courseId: this.cid
          }
        })
          .then(resp => {
            let data = resp.data.data;
            this.dataList = data.list;
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
  .video,
  .video .warp {
    width: 320px;
    height: 180px;
  }

  /*原生 input框*/
  .courseDetails .video .warp input {
    /*display: inline-block;*/
    height: 0px;
    width: 0px;
  }

  /*自定义样式*/
  .courseDetails .video .warp label {
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
  .courseDetails .video .warp img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 5px auto 0px;
  }

  /*右侧资料框，编辑保存取消等*/
  .courseDetails .right {
    float: right;
    width: calc(100% - 320px);
    height: 180px;
  }

  /*右侧编辑保存按钮*/
  .courseDetails .right .button {
    margin: 10px 20px 0px 0px;
    float: right;
  }

  /*右侧得分box*/
  .courseDetails .right div.score {
    margin-top: 10px;
    width: calc(100% - 100px);
    height: 36px;
  }

  /*课程评分*/
  .courseDetails .right div.score span.text {
    display: inline-block;
    line-height: 34px;
    font-size: 16px;
    margin-left: 20px;
  }

  /*评分*/
  .courseDetails .right div.score span.score {
    display: inline-block;
    line-height: 34px;
    font-size: 18px;
    margin-left: 10px;
    color: #FF0000;
  }

  /*资料*/
  .courseDetails div.data .box {
    margin: 15px 20px 0px 20px;
    height: 30px;
  }

  /*资料名称*/
  .courseDetails div.data .box .name {
    float: left;
    width: 300px;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    background-color: #19be6b;
    border-radius: 4px;
    font-family: Arial;
    color: #EEEEEE;
    padding-left: 10px;
  }

  /*资料url*/
  .courseDetails div.data .box .url {
    float: left;
    width: calc(100% - 300px);
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    background-color: #ffe7b8;
    border-radius: 4px;
    font-family: Arial;
    color: #2d43ee;
    padding-left: 10px;
  }


  /*资料添加*/
  .courseDetails div.data .add {
    margin: 15px 20px 0px 20px;
  }

  /*讨论区*/
  .courseDetails div.discuss {
    border: 1px solid black;
    margin: 15px 20px 0px 20px;
  }
</style>
