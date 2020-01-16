<template>
  <div class="subjectDetails">
    <Collapse v-model="foldPanel">
      <Panel name="1">
        详情
        <div slot="content">
          <div class="right">

            <div class="button">
              <Button size="default" type="success" v-if="!editFlag" @click="goToEdit">编辑</Button>
              <Button size="default" type="error" v-if="editFlag" @click="saveEdit">保存</Button>
            </div>

            <div class="showPanel" v-if="!editFlag">
              <div class="title">
                <div>
                  标题 ：
                </div>
                <div>
                  讲师 ：
                </div>
                <div>
                  评分 ：
                </div>
                <div>
                  课时 ：
                </div>
                <div>
                  qq群 ：
                </div>
                <div>
                  简介 ：
                </div>
              </div>
              <div class="text">

              </div>
            </div>

            <div class="editPanel" v-if="editFlag">

            </div>

            <!--<div>
              <strong>标题:</strong> {{sub.subjectName}}
            </div>
            <div>
              <strong>讲师:</strong> {{subDetails.subTeacher}}
            </div>

            <div>
              <strong>评分:</strong> {{subDetails.subScore}}
            </div>
            <div>
              <strong>课时:</strong> {{subDetails.subTotal}}
            </div>

            <div>
              <strong>QQ群:</strong> {{subDetails.qqGroup}}
            </div>
            <div>
              <strong>简介:</strong> {{subDetails.subIntroduction}}
            </div>-->
          </div>

          <!--图片-->
          <div class="left">
            <img :src="subDetails.subPic">
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
        //折叠面板
        foldPanel: ["1","2"],
        //课程图片
        subPic: ""
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
      load: function () {
        if (this.sub == null) {
          this.axios.get(`${this.domain.Admin}/subject/subjectDetails/${this.sid}`)
            .then(resp => {
              let data = resp.data.data;
              this.sub = data
              this.subDetails = this.sub.subjectDetailsDo
            })
            .catch(resp => {
            })
        } else {
          //课程图片赋值
          this.subDetails = this.sub.subjectDetailsDo
        }
      }
    },
    created() {
      this.load()
    },
    mounted() {
      // this.load()
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

  /*右侧*/
  .subjectDetails .right {
    float: right;
    width: calc(100% - 306px);
  }

  /*右侧编辑保存按钮*/
  .subjectDetails .right .button {
    float: right;
  }

  /*展示*/
  .subjectDetails .right .showPanel {
    border: 1px solid black;
  }

  .subjectDetails .right .showPanel .title{
    border: 1px solid red;
    width: 60px;
    min-height: 80px;
    float: left;
  }
  /*文字*/
  .subjectDetails .right .showPanel .title div{
    font-size: 14px;
    text-align: right;

    height: 24px;
    line-height: 20px;
    font-weight: lighter;
    /*margin-top: 18px;*/
  }

  .subjectDetails .right .showPanel .text{
    border: 1px solid greenyellow;
    width: 400px;
    min-height: 80px;
    float: left;
  }

  /*编辑*/
  .subjectDetails .right .editPanel {
    width: 100%;
    height: 100%;
    border: 1px solid black;
  }
</style>
