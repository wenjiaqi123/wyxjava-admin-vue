<template>
  <div class="courseList">
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
      </Table>
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
        type: String,
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
            // key: 'id',
            type: 'index',
            //可拖拽
            resizable: true,
            align: "center",
            width: 100
          },
          {
            title: "课程名称",
            // slot: 'subjectName',
            key: 'courseName',
            resizable: true,
            align: "left",
            // width: 240
          },
          {
            title: "评分",
            // slot: "subScore",
            // key: 'subjectDetailsDo',
            resizable: true,
            align: "center",
            width: 100
          },
          {
            title: "状态",
            // slot: 'status',
            key: 'status',
            //可拖拽
            resizable: true,
            align: "center",
            width: 130
          }
        ],
        //课程数据
        courseList: [],
      }
    },
    methods: {
      //获取轮播图列表
      getCourseList: function (s = -1) {
        this.axios.get(`${this.domain.Admin}/course/courseList`, {
          params: {
            subjectId: this.sid,
            status: s
          }
        })
          .then((resp) => {
            //加载中 状态
            this.loading = false
            //列表
            let list = resp.data.data.list;
            this.courseList = list;
          })
          .catch((resp) => {
          })
      },
      //该变状态
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
</style>
