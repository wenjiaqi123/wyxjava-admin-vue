<template>
  <div class="subject">
    <div style="margin: 8px auto 2px 5px">
      <Page
        :total="total"
        show-total
        show-elevator
        show-sizer
        size="small"
        :page-size-opts="showSizer"
        @on-change="changePage"
        @on-page-size-change="changeRows"/>
    </div>

    <Button type="success" size="small" @click="addSubject()"> 添加课程</Button>

    <div style="line-height: 30px;margin: 8px auto 10px 5px">
      <CheckboxGroup v-model="useFlag" @on-change="checkAllGroupChange">
        <Checkbox label="在用"></Checkbox>
        <Checkbox label="失效"></Checkbox>
      </CheckboxGroup>
    </div>

    <div>
      <Table
        border
        show-header
        size="small"
        :columns="columns"
        :data="subjectList">

        <!--科目名称-->
        <template slot-scope="{ row, index }" slot="subjectName">
          <p @click="openSubDetails(row)">{{row.subjectName}}</p>
          <!--<span style="float: right">
            <Button size="small" type="info">详情</Button>
            <Button size="small" type="warning">列表</Button>
          </span>-->
        </template>

        <!--评分-->
        <template slot-scope="{ row, index }" slot="subScore">
          <span>{{row.subjectDetails.subScore}}</span>
        </template>

        <!--课时-->
        <template slot-scope="{ row, index }" slot="subTotal">
          <span>{{row.subjectDetails.subTotal}}</span>
        </template>

        <!--操作-->
        <template slot-scope="{ row, index }" slot="status">
          <Button size="small" type="success" v-if="row.status == 1" @click="changeStatus(row, index)">在用</Button>
          <Button size="small" type="error" v-if="row.status == 0" @click="changeStatus(row, index)">失效</Button>
        </template>

        <!--操作-->
        <template slot-scope="{ row, index }" slot="delete">
          <div>
            <Button type="error" size="small" @click="deleteSubject(row, index)">删除</Button>
          </div>
        </template>
      </Table>

      <Modal
        v-model="modalFlag"
        title="课程状态"
        @on-ok="modalOk"
        @on-cancel="modalCancel">
        <p v-if="modalTipFlag">你要下线该课程吗？<span style="color: #FF0000">【慎重下线】</span></p>
        <p v-if="!modalTipFlag">你要上线该课程吗？</p>
      </Modal>

      <Modal
        v-model="modalDeleteFlag"
        title="删除课程"
        @on-ok="modalDeleteOk"
        @on-cancel="modalDeleteCancel">
        <p>你要删除该课程吗？<span style="color: #FF0000">【慎重删除，删除无法找回】</span></p>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //数据有效状态
        useFlag: ["在用", "失效"],
        //总数
        total: 0,
        //页码
        page: 1,
        //每页记录数
        rows: 10,
        //每页切换的 rows
        showSizer: [10, 20, 30, 40],
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
            title: "课目名称",
            slot: 'subjectName',
            key: 'subjectName',
            resizable: true,
            align: "left",
            // width: 240
          },
          {
            title: "评分",
            slot: "subScore",
            // key: 'subjectDetailsDo',
            resizable: true,
            align: "center",
            width: 100
          },
          {
            title: "课时",
            slot: "subTotal",
            // key: 'subjectDetailsDo.subTotal',
            resizable: true,
            align: "center",
            width: 100
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
        //科目数据
        subjectList: [],
        //是否在用
        statusFlag: true,
        //对话框开关
        modalFlag: false,
        //删除对话框开关
        modalDeleteFlag: false,
        //对话框提示开关
        modalTipFlag: true,
        //单个课程对象
        subject: null,
        //单个课程对象索引
        index: -1
      }
    },
    methods: {
      //添加课程
      addSubject: function () {
        this.$router.push("/addSubject")
      },
      //获取列表
      getSubjectList: function (s = -1) {
        this.axios.get(`/course/subject/subjects/${this.page}/${this.rows}`, {
          params: {
            status: s
          }
        })
          .then((resp) => {
            //列表
            let list = resp.data.data.list;
            this.subjectList = list;
            //总数
            let total = resp.data.data.total;
            this.total = total;
          })
      },
      //改变页码
      changePage: function (page) {
        this.page = page;
        this.getSubjectList()
      },
      //改变每页记录数
      changeRows: function (rows) {
        this.rows = rows;
        this.getSubjectList()
      },
      //该变状态
      checkAllGroupChange: function (list) {
        if (list.length == 2) {
          this.getSubjectList(-1)
        } else if (list[0] == "在用") {
          this.getSubjectList(1)
        } else if (list[0] == "失效") {
          this.getSubjectList(0)
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
        this.subject = row;
        this.index = index;
      },
      //对话框 确定
      modalOk: function () {
        //id
        let subjectId = this.subject.subjectId;
        //状态
        let status = this.subject.status;
        //切换状态
        if (status == 1) {
          this.subjectList[this.index].status = 0
          status = 0
        } else if (status == 0) {
          this.subjectList[this.index].status = 1
          status = 1
        }
        this.axios.put(`/course/subject/subject/${subjectId}/${status}`)
          .then(resp => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
            this.getSubjectList()
          })
          .catch(resp => {
          })
        //将对象清空
        this.subject = null
        this.index = -1
      },
      modalCancel: function () {
      },
      modalDeleteOk: function () {
        //id
        let subjectId = this.subject.subjectId;
        this.axios.delete(`/course/subject/subject/${subjectId}`)
          .then((resp) => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "删除成功"
              })
            }
            this.getSubjectList()
          })

        //将对象清空
        this.subject = null
        this.index = -1
      },
      modalDeleteCancel: function () {
      },
      //打开课程详细页面
      openSubDetails: function (row) {
        let {href} = this.$router.resolve({
          name: "SubjectDetails",
          query: {
            sid: row.subjectId
          }
        });
        window.open(href, '_blank');
      },
      deleteSubject: function (row, index) {
        //开启 对话框
        this.modalDeleteFlag = true;
        //把当前对象赋值给 subject
        this.subject = row;
        this.index = index;
      },
      load: function () {
        this.getSubjectList()
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>
</style>
