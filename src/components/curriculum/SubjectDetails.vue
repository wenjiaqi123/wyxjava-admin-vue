<template>
  <div class="subjectDetails">
    <Collapse v-model="foldPanel">
      <Panel name="1">
        详情
        <div slot="content">
          <div class="right">
            <div>
              <strong>标题:</strong> {{sub.subjectName}}
            </div>
            <div>
              <strong>讲师:</strong> {{subDetails.subTeacher}}
            </div>
            <div>
              <strong>QQ讨论群:</strong> {{subDetails.qqGroup}}
            </div>
            <div>
              <strong>分数:</strong> {{subDetails.subScore}}
            </div>
            <div>
              <strong>课时:</strong> {{subDetails.subTotal}}
            </div>
            <div>
              <strong>简介:</strong> {{subDetails.subIntroduction}}
            </div>
          </div>
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
        //科目id
        sid: this.$route.query.sid,
        //传过来的 课程信息
        sub: this.$route.params.sub,
        //课程详细
        subDetails: Object,
        //折叠面板
        foldPanel: ["2"],
        //课程图片
        subPic: ""
      }
    },
    methods: {
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

  /*右侧*/
  .subjectDetails .right {
    float: right;
    width: calc(100% - 306px);
  }
</style>
