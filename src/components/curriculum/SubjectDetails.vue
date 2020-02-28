<template>
  <div class="subjectDetails">
    <Collapse v-model="foldPanel">
      <Panel name="1">
        详情
        <div slot="content">
          <div class="right">
            <!--右侧的 编辑保存按钮-->
            <div class="button">
              <Button size="default" type="success" v-if="!editFlag" @click="goToEdit">编辑</Button>
              <Button size="default" type="success" v-if="editFlag" @click="saveEdit">保存</Button>
              <div style="margin-top: 2px"></div>
              <Button size="default" type="info" v-if="editFlag" @click="cancelEdit">取消</Button>
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
                  <!--正常显示-->
                  <span v-if="!editFlag" class="nameContent">
                    {{subjectName}}
                  </span>
                  <!--编辑显示-->
                  <Input v-if="editFlag" type="text" style="width: 300px;margin-right: 100px;"
                         v-model="subjectNameTmp"></Input>
                  <span class="score">
                    评分 ：
                  </span>
                  <span style="margin-right: 50px" class="scoreContent">
                    {{subDetails.subScore}}
                  </span>
                  <span class="total">
                    课时 ：
                  </span>
                  <span class="totalContent">
                    {{subDetails.subTotal}}
                  </span>
                </div>
                <div class="teacher">
                  <!--正常显示-->
                  <span v-if="!editFlag" v-for="i in subTeacher" class="teacherContent">{{i}}</span>
                  <!--编辑显示-->
                  <div v-if="editFlag">
                    <div v-if="editFlag">
                    <span v-for="(obj,i) in subTeacherTmp">
                      <Button size="small" type="error" @click="deTeacher(i)"> × </Button>
                      <Input type="text" v-model="subTeacherTmp[i]" style="width: 80px;margin-right: 24px;"></Input>
                    </span>
                      <Button size="small" type="info" @click="addTeacher"> +</Button>
                    </div>
                  </div>
                </div>
                <div class="qq">
                  <!--正常显示-->
                  <span v-if="!editFlag" v-for="i in qqGroup" class="qqContent">{{i}}</span>
                  <!--编辑显示-->
                  <div v-if="editFlag">
                    <span v-for="(obj,i) in qqGroupTmp">
                      <Button size="small" type="error" @click="deQQ(i)"> × </Button>
                      <Input type="text" v-model="qqGroupTmp[i]" style="width: 100px;margin-right: 24px;"></Input>
                    </span>
                    <Button size="small" type="info" @click="addQQ"> +</Button>
                  </div>
                </div>
                <div class="introduction">
                  <!--正常显示-->
                  <div v-if="!editFlag" class="introductionContent">{{subIntroduction}}</div>
                  <!--编辑显示-->
                  <Input
                    clearble
                    v-if="editFlag"
                    v-model="subIntroductionTmp"
                    maxlength="300"
                    type="textarea"
                    :rows="4"
                    show-word-limit/>
                </div>
              </div>
            </div>
          </div>

          <!--图片-->
          <div class="left">
            <!--正常显示-->
            <img v-if="!editFlag" :src="subDetails.subPic">

            <!--编辑状态显示-->
            <div class="upload" v-if="editFlag">
              <Input type="text" v-model="subDetails.subPic" placeholder="网络图片URL"/>

              <!--<div style="margin-top: 10px"></div>-->

              <div class="file" @change="uploadFile($event)">
                <input type="file" id="myFile" accept="image/jpeg,image/png,image/gif">
                <label for="myFile">
                  <img src="../../assets/home/upload.png">
                  <span>
                    点我上传 300×165
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
          <CourseList v-bind:sid="sid"></CourseList>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import CourseList from '@/components/curriculum/CourseList'

  export default {
    name: "",
    components: {
      CourseList
    },
    data() {
      return {
        //是否编辑状态
        editFlag: false,
        //科目id
        sid: this.$route.query.sid,
        //传过来的 课程信息
        sub: this.$route.params.sub,
        //课程详细
        subDetails: Object,
        //课程名称
        subjectName: "",
        subjectNameTmp: "",
        //教师
        subTeacher: [],
        subTeacherTmp: [],
        //qq群
        qqGroup: [],
        qqGroupTmp: [],
        //简介
        subIntroduction: "",
        subIntroductionTmp: "",
        //折叠面板
        foldPanel: ["1", "2"],
        //课程图片
        picInfo: Object,
        subPic:"",
        formData: {}
      }
    },
    methods: {
      //进入编辑状态
      goToEdit: function () {
        this.subjectNameTmp = this.subjectName
        this.subIntroductionTmp = this.subIntroduction
        this.subTeacherTmp = [].concat(this.subTeacher)
        this.qqGroupTmp = [].concat(this.qqGroup)
        this.editFlag = true
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
      //保存编辑
      saveEdit: function () {
        this.subjectName = this.subjectNameTmp
        this.subIntroduction = this.subIntroductionTmp
        this.subTeacher = this.subTeacherTmp
        this.qqGroup = this.qqGroupTmp

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
        qqGroup = qqGroup.substring(0, qqGroup.length - 1);

        //封面图片 如果上传了，就用上传的图片，没有就用之前的
        let subPic = this.subDetails.subPic
        if(this.subPic != ""){
          subPic = this.subPic
        }
        console.log(subPic);
        //发送请求
        let data = {
          subjectId: this.sid,
          subIntroduction: this.subIntroduction,
          subTeacher: subTeacher,
          qqGroup: qqGroup,
          subPic: subPic
        }
        this.axios.put(`${this.domain.Admin}/subject/subjectDetails`, data)
          .then(resp => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
          })
          .catch(resp => {
          })
        //编辑状态开关
        this.editFlag = false
      },
      //取消编辑
      cancelEdit: function () {
        this.subjectNameTmp = ""
        this.subIntroductionTmp = ""
        this.subTeacherTmp = []
        this.qqGroupTmp = []
        this.editFlag = false
      },
      //减少老师
      deTeacher: function (index) {
        this.subTeacherTmp.splice(index, 1)
      },
      //添加老师
      addTeacher: function () {
        let length = this.subTeacherTmp.length;
        this.$set(this.subTeacherTmp, length, "")
      },
      //减少qq
      deQQ: function (index) {
        this.qqGroupTmp.splice(index, 1)
      },
      //添加qq群
      addQQ: function () {
        let length = this.qqGroupTmp.length;
        this.$set(this.qqGroupTmp, length, "")
      },
      load: function () {
        this.axios.get(`${this.domain.Admin}/subject/subjectDetails/${this.sid}`)
          .then(resp => {
            let data = resp.data.data;
            this.sub = data
            this.subDetails = this.sub.subjectDetailsDo

            //赋值 课程名称
            let subjectName = this.sub.subjectName;
            this.subjectName = subjectName
            //赋值 teacher
            let teacherStr = this.subDetails.subTeacher;
            let teachers = teacherStr.split(",");
            this.subTeacher = teachers
            //赋值 qq群
            let qqGroupStr = this.subDetails.qqGroup;
            let qqGroups = qqGroupStr.split(",");
            this.qqGroup = qqGroups
            //赋值 简介
            let subIntroduction = this.subDetails.subIntroduction;
            this.subIntroduction = subIntroduction
          })
          .catch(resp => {
          })
      }
    },
    created() {
      this.load()
    },
    mounted() {
      this.load()
    }
  }
</script>

<style scoped>
  /*左侧*/
  .subjectDetails .left img {
    border-radius: 8px;
    width: 300px;
    height: 165px;
  }

  /*左侧*/
  .subjectDetails .left .upload {
    border: 1px solid black;
    width: 300px;
    height: 165px;
  }

  /*右侧*/
  .subjectDetails .right {
    float: right;
    width: calc(100% - 306px);
  }

  /*右侧编辑保存按钮*/
  .subjectDetails .right .button {
    float: right;
  }

  /*右侧 标题讲师.. 盒子*/
  .subjectDetails .right .showPanel .title {
    float: left;
    width: 70px;
  }

  /*右侧 标题讲师*/
  .subjectDetails .right .showPanel .title div {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: bolder;
    text-align: right;
    margin-bottom: 4px;
  }

  /*文本*/
  .subjectDetails .right .showPanel .text {
    float: left;
    width: calc(100% - 136px);
  }

  /*文本每行*/
  .subjectDetails .right .showPanel .text div {
    height: 30px;
    margin-bottom: 4px;
  }

  /*评分 课时*/
  .subjectDetails .right .showPanel .text .one .score,
  .subjectDetails .right .showPanel .text .one .total {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: bolder;
  }

  .subjectDetails .right .showPanel .text .one .nameContent {
    display: inline-block;
    width: 300px;
    margin-right: 100px;
  }

  .subjectDetails .right .showPanel .text .one .nameContent,
  .subjectDetails .right .showPanel .text .one .scoreContent,
  .subjectDetails .right .showPanel .text .one .totalContent {
    color: #FF0000;
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: lighter;
  }

  /*老师和qq群*/
  .subjectDetails .right .showPanel .text .teacher .teacherContent,
  .subjectDetails .right .showPanel .text .qq .qqContent {
    border-radius: 4px;
    background-color: #EEEEEE;
    padding: 1px 4px 0 4px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: lighter;
    margin-right: 12px;
  }

  /*内容简介*/
  .subjectDetails .right .showPanel .text .introduction .introductionContent {
    font-size: 14px;
    margin-top: 10px;
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

  .subjectDetails .left .file img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 5px auto 0px;
  }
</style>
