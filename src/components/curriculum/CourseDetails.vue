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
      <div class="score">
        <span class="text">课程评分：</span>
        <span v-if="!editFlag" class="score">{{score}}</span>
        <Input v-if="editFlag" prefix="md-star-half" v-model="score" placeholder="输入URL" style="width: 100px"/>
      </div>
    </div>

    <!--课程视频-->
    <div class="video">
      <video :src="videoUrl" autoplay controls width="320" height="180">
      </video>
    </div>

    <!--资料-->
    <div class="data">
      <!--正常状态展示-->
      <div v-if="!editFlag" v-for="i in dataList" class="box" @click="openUrl(i)">
        <div class="name">{{i.dataName}}</div>
        <div class="url">{{i.dataUrl}}</div>
      </div>

      <!--编辑状态显示-->
      <div v-if="editFlag" v-for="i in dataList" class="box">
        <Input prefix="md-paper" v-model="i.dataName" placeholder="输入名称" style="width: 300px"/>
        <Input prefix="ios-paper-plane" v-model="i.dataUrl" placeholder="输入URL" style="width: calc(100% - 350px)"/>
        <Button size="small" type="error" @click="subData"> × </Button>
      </div>
      <div v-if="editFlag" class="add">
        <Button size="default" type="success" @click="addData">+</Button>
      </div>
    </div>

    <!--讨论-->
    <div class="discuss">
        撒旦法沙发的
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //视频URL
        videoUrl: "https://learning.dcloud.io/video/chapter_01.mp4",
        //编辑状态
        editFlag: false,
        //课程评分
        score: "3.3",
        //资料
        dataList: []
      }
    },
    methods: {
      //进入编辑状态
      goToEdit: function () {
        this.editFlag = true
      },
      //保存编辑
      saveEdit: function () {
        this.editFlag = false
      },
      //取消编辑
      cancelEdit: function () {
        this.editFlag = false
      },
      //打开资料
      openUrl:function(data){
        window.open(data.dataUrl, '_blank');
      },
      load: function () {
        //获取课程信息
        //获取资料
        this.axios.get(`${this.domain.Admin}/course/courseDataList`, {
          params: {
            courseId: 1
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
  .video {
    width: 320px;
    height: 180px;
  }

  /*右侧资料框，编辑保存取消等*/
  .courseDetails .right {
    float: right;
    border: 1px solid black;
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
    margin: 10px 20px 0px 20px;
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
