<template>
  <div class="addSubject">
    <Collapse v-model="foldPanel">
      <Panel name="1">
        详情
        <div slot="content">
          <div class="right">
            <!--右侧的保存按钮-->
            <div class="button">
              <Button size="default" type="success" @click="saveEdit">保存</Button>
            </div>

            <!--展示面板-->
            <div class="showPanel">
              <!--第一行 标题 评分 课时-->
              <!--其他行 讲师 qq群 简介-->
              <div class="title">
                <div>
                  标题 ：
                </div>
                <div>
                  讲师 ：
                </div>
                <div>
                  qq群 ：
                </div>
                <div>
                  简介 ：
                </div>
              </div>
              <div class="text">
                <div class="one">
                  <!--编辑显示-->
                  <Input type="text" style="width: 300px;margin-right: 100px;" v-model="subjectName" placeholder="课程名"></Input>
                  <span class="score">
                    评分 ：
                  </span>
                  <span style="margin-right: 50px" class="scoreContent">
                    {{subScore}}
                  </span>
                </div>
                <!--教师-->
                <div class="teacher">
                  <div>
                    <div>
                    <span v-for="(obj,i) in subTeacher">
                      <Button size="small" type="error" @click="deTeacher(i)"> × </Button>
                      <Input type="text" v-model="subTeacher[i]" style="width: 80px;margin-right: 24px;"></Input>
                    </span>
                      <Button size="small" type="info" @click="addTeacher"> +</Button>
                    </div>
                  </div>
                </div>
                <!--qq群-->
                <div class="qq">
                  <div>
                    <span v-for="(obj,i) in qqGroup">
                      <Button size="small" type="error" @click="deQQ(i)"> × </Button>
                      <Input type="text" v-model="qqGroup[i]" style="width: 100px;margin-right: 24px;"></Input>
                    </span>
                    <Button size="small" type="info" @click="addQQ"> +</Button>
                  </div>
                </div>
                <!--课程简介-->
                <div class="introduction">
                  <Input
                    clearble
                    v-model="subIntroduction"
                    maxlength="300"
                    type="textarea"
                    :rows="3"
                    placeholder="课程简介"
                    show-word-limit/>
                </div>
              </div>
            </div>
          </div>

          <!--图片-->
          <div class="left">
            <div class="upload">
              <Input type="text" v-model="subPic" placeholder="课程封面图片URL"/>

              <!--<div style="margin-top: 10px"></div>-->

              <div class="file" @change="uploadFile($event)">
                <input type="file" id="myFile" accept="image/jpeg,image/png,image/gif">
                <label for="myFile">
                  <img src="../../assets/home/upload.png">
                  <span>
                    点我上传【优先】 300×165
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel name="2">
        列表
        <div slot="content">
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //折叠面板
        foldPanel: ["1", "2"],
        //课程名
        subjectName: "",
        //评分
        subScore: "5.0",
        //老师
        subTeacher: [],
        //qq群
        qqGroup: [],
        //简介
        subIntroduction: "",
        //图片URL
        subPic: ""
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
              _this.subPic = picInfo.fileUrl;
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
      //减少老师
      deTeacher: function (index) {
        this.subTeacher.splice(index, 1)
      },
      //添加老师
      addTeacher: function () {
        let length = this.subTeacher.length;
        this.$set(this.subTeacher, length, "")
      },
      //减少qq
      deQQ: function (index) {
        this.qqGroup.splice(index, 1)
      },
      //添加qq群
      addQQ: function () {
        let length = this.qqGroup.length;
        this.$set(this.qqGroup, length, "")
      },
      //保存编辑
      saveEdit: function () {
        //处理数据格式 老师和qq群
        let subTeacher = "";
        for (let i in this.subTeacher) {
          subTeacher += this.subTeacher[i];
          subTeacher += ",";
        }
        subTeacher = subTeacher.substring(0, subTeacher.length - 1);
        let qqGroup = "";
        for (let i in this.qqGroup) {
          qqGroup += this.qqGroup[i];
          qqGroup += ",";
        }
        qqGroup = qqGroup.substring(0, qqGroup.length - 1)

        //发送请求
        let data = {
          //课程名称
          subjectName: this.subjectName,
          //教师
          subTeacher: subTeacher,
          //qq群
          qqGroup: qqGroup,
          //课程简介
          subIntroduction: this.subIntroduction,
          //评分
          subScore: this.subScore,
          //课程图片URL
          subPic: this.subPic
        }
        this.axios.post(`${this.domain.Admin}/subject/subject`, data)
          .then(resp => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "保存成功"
              })
              //跳转
              this.$router.push("subject")
            }
          })
          .catch(resp => {
          })
      },
    },
    mounted() {
    }
  }
</script>

<style scoped>
  /*左侧*/
  .addSubject .left img {
    border-radius: 8px;
    width: 300px;
    height: 165px;
  }

  /*左侧*/
  .addSubject .left .upload {
    width: 300px;
    height: 165px;
  }

  /*右侧*/
  .addSubject .right {
    float: right;
    width: calc(100% - 306px);
  }

  /*右侧编辑保存按钮*/
  .addSubject .right .button {
    float: right;
  }

  /*右侧 标题讲师.. 盒子*/
  .addSubject .right .showPanel .title {
    float: left;
    width: 70px;
  }

  /*右侧 标题讲师*/
  .addSubject .right .showPanel .title div {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: bolder;
    text-align: right;
    margin-bottom: 4px;
  }

  /*文本*/
  .addSubject .right .showPanel .text {
    float: left;
    width: calc(100% - 136px);
  }

  /*文本每行*/
  .addSubject .right .showPanel .text div {
    height: 30px;
    margin-bottom: 4px;
  }

  /*评分 课时*/
  .addSubject .right .showPanel .text .one .score {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: bolder;
  }

  .addSubject .right .showPanel .text .one .scoreContent {
    color: #FF0000;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: lighter;
  }


  /*文件 input样式*/
  .file input {
    height: 0px;
    width: 0px;
  }

  .file label {
    border: 1px dotted #3399FF;
    width: 300px;
    height: 100px;
    display: block;
    border-radius: 6px;

    line-height: 40px;
    font-size: 16px;
    color: #FF0000;
    text-align: center;
    margin-left: -1px;
  }

  .addSubject .left .file img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 5px auto 0px;
  }
</style>
