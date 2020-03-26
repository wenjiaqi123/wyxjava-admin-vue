<template>
  <div class="courseList">
    <!--返回顶部-->
    <BackTop :height="2000" :bottom="50" :right="0">
      <div class="top">∧</div>
    </BackTop>

    <Button type="success" size="small" @click="addCourse()"> 添加课时</Button>

    <div style="line-height: 30px;margin: 8px auto 10px 5px">
      <CheckboxGroup v-model="useFlag" @on-change="checkAllGroupChange">
        <Checkbox label="在用"></Checkbox>
        <Checkbox label="失效"></Checkbox>
      </CheckboxGroup>
    </div>

    <div>
      <Table
        :loading="loading"
        border
        show-header
        size="small"
        :columns="columns"
        :data="courseList">

        <!--课时名称-->
        <template slot-scope="{ row, index }" slot="courseName">
          <p @click="openCourseDetails(row)">{{row.courseName}}</p>
        </template>

        <!--评分-->
        <template slot-scope="{ row, index }" slot="courseScore">
          <p>{{row.courseDetails.courseScore}}</p>
        </template>

        <!--操作-->
        <template slot-scope="{ row, index }" slot="order">
          <span v-if="!moveFlag">
            移动到第
            <InputNumber size="small" v-model="row.num" style="width: 70px"></InputNumber>
            后
            <Button size="small" type="error" @click="moveSure(row,index)">确定</Button>
          </span>

          <Button size="small" type="success" v-if="moveFlag" @click="move">移动</Button>
          <Button size="small" type="success" @click="moveOne(row,index,1)">上移</Button>
          <Button size="small" type="success" @click="moveOne(row,index,-1)">下移</Button>
        </template>

        <!--状态-->
        <template slot-scope="{ row, index }" slot="status">
          <Button size="small" type="success" v-if="row.status == 1" @click="changeStatus(row, index)">在用</Button>
          <Button size="small" type="error" v-if="row.status == 0" @click="changeStatus(row, index)">失效</Button>
        </template>

        <!--删除-->
        <template slot-scope="{ row, index }" slot="delete">
          <div>
            <Button type="error" size="small" @click="deleteCourse(row, index)">删除</Button>
          </div>
        </template>
      </Table>

      <Modal
        v-model="modalFlag"
        title="课时状态"
        @on-ok="modalOk"
        @on-cancel="modalCancel">
        <p v-if="modalTipFlag">你要下线该课时吗？<span style="color: #FF0000">【慎重下线】</span></p>
        <p v-if="!modalTipFlag">你要上线该课时吗？</p>
      </Modal>

      <Modal
        v-model="modalDeleteFlag"
        title="删除课时"
        @on-ok="modalDeleteOk"
        @on-cancel="modalDeleteCancel">
        <p>你要删除该课时吗？<span style="color: #FF0000">【慎重删除，删除无法找回】</span></p>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {
      //科目id
      sid: {
        type: Number | String,
        required: true
      }
    },
    data() {
      return {
        //加载中
        loading: true,
        //数据有效状态
        useFlag: ["在用", "失效"],
        // 表格数据
        columns: [
          {
            title: "序号",
            key: 'showOrder',
            type: 'index',
            //可拖拽
            resizable: true,
            align: "center",
            width: 100
          },
          {
            title: "课时名称",
            slot: 'courseName',
            resizable: true,
            align: "left",
            // width: 240
          },
          {
            title: "评分",
            slot: "courseScore",
            resizable: true,
            align: "center",
            width: 100
          },
          {
            title: "排序",
            slot: "order",
            resizable: true,
            align: "center",
            width: 360
          },
          {
            title: "状态",
            slot: 'status',
            //可拖拽
            resizable: true,
            align: "center",
            width: 100
          },
          {
            title: "删除",
            slot: 'delete',
            //可拖拽
            resizable: true,
            align: "center",
            width: 100
          }
        ],
        //课时数据
        courseList: [],
        //移动框 开关
        moveFlag: true,
        //对话框开关
        modalFlag: false,
        //对话框提示开关
        modalTipFlag: true,
        //删除对话框开关
        modalDeleteFlag: false,
        //单个课时对象
        course: null,
        //单个课时对象索引
        index: -1
      }
    },
    methods: {
      //添加课时
      addCourse: function () {
        let {href} = this.$router.resolve({
          name: "AddCourse",
          query: {
            sid: this.sid
          }
        });
        window.open(href, '_blank');
      },
      //根据课时id获取列表
      getCourseList: function (s = -1) {
        this.axios.get(`/course/course/courseLists`, {
          params: {
            subjectId: this.sid,
            status: s
          }
        })
          .then((resp) => {
            //加载中 状态
            this.loading = false
            //列表
            let list = resp.data.data;
            this.courseList = list;
          })
      },
      //改变状态
      checkAllGroupChange: function (list) {
        this.loading = true
        if (list.length == 2) {
          this.getCourseList(-1)
        } else if (list[0] == "在用") {
          this.getCourseList(1)
        } else if (list[0] == "失效") {
          this.getCourseList(0)
        }
      },
      //改变状态
      changeStatus: function (row, index) {
        let status = row.status;
        //根据状态显示 对话框提示的文字
        if (status == 1) {
          this.modalTipFlag = true
        }
        if (status == 0) {
          this.modalTipFlag = false
        }
        //开启 对话框
        this.modalFlag = true;
        //把当前对象赋值给 subject
        this.course = row;
        this.index = index;
      },
      //删除课时
      deleteCourse: function (row, index) {
        //开启 对话框
        this.modalDeleteFlag = true;
        //把当前对象赋值给 course
        console.log(row);
        console.log(row.courseId);
        this.course = row;
        this.index = index;
      },
      //打开课时详细页面
      openCourseDetails: function (row) {
        let {href} = this.$router.resolve({
          name: "CourseDetails",
          query: {
            cid: row.courseId
          }
        });
        window.open(href, '_blank');
      },
      //对话框 确定
      modalOk: function () {
        //id
        let id = this.course.courseId;
        //状态
        let status = this.course.status;
        //切换状态
        if (status == 1) {
          this.courseList[this.index].status = 0
          status = 0
        } else if (status == 0) {
          this.courseList[this.index].status = 1
          status = 1
        }
        this.axios.put(`/course/course/course/${id}/${status}`)
          .then(resp => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
            this.getCourseList()
          })
          .catch(resp => {
          })
        //将对象清空
        this.subject = null
        this.index = -1
      },
      modalCancel: function () {

      },
      //删除课时
      modalDeleteOk: function () {
        //id
        let courseId = this.course.courseId;
        this.axios.delete(`/course/course/course/${courseId}`)
          .then((resp) => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "删除成功"
              })
            }
            this.getCourseList()
          })

        //将对象清空
        this.course = null
        this.index = -1
      },
      modalDeleteCancel: function () {
      },
      //点击移动按钮
      move: function () {
        this.moveFlag = false;
      },
      //确定移动
      moveSure: function (row, index) {
        console.log(row);
        console.log(index);
        this.moveFlag = true;
      },
      moveOne: function (row, index, upOrdown) {
        let length = this.courseList.length;
        if (index == 0 && upOrdown == 1) {
          this.$Notice.error({
            title: "第一条数据不能上移"
          })
          return false;
        }
        if (index == length - 1 && upOrdown == -1) {
          this.$Notice.error({
            title: "最后一条数据不能下移"
          })
          return false;
        }

        let course = this.courseList[index];
        this.$set(this.courseList, index, this.courseList[index - upOrdown])
        this.$set(this.courseList, index - upOrdown, course)
      },
      load: function () {
        this.getCourseList();
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>
  /*返回顶部*/
  .top {
    height: 28px;
    width: 40px;
    padding: 0px 10px 0px 10px;
    background: rgba(0, 153, 229, .7);
    /*background: rgba(0, 0, 0, 0.7);*/
    color: #ffffff;
    /*color: #000000;*/
    /*opacity: 0.7;*/
    font-weight: bolder;
    text-align: center;
    font-size: 24px;
    line-height: 28px;
    border-radius: 4px;
  }
</style>
