<template xmlns:https="http://www.w3.org/1999/xhtml">
  <div class="rotationChart">
   <!-- <div style="margin: 8px auto 2px 5px">
      <Page
        :total="total"
        show-total
        show-elevator
        show-sizer
        size="small"
        :page-size-opts="showSizer"
        @on-change="changePage"
        @on-page-size-change="changeRows"/>
    </div>-->

    <Button type="success" size="small" @click="addChart()">添加轮播图</Button>

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
        :data="chartList">

        <!--轮播图-->
        <template slot-scope="{ row, index }" slot="chartUrl">
          <Input v-if="editIndex === index" type="text" v-model="editChartUrl"/>
          <Upload v-if="editIndex === index"
                  type="drag"
                  action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>

          <img v-else :src="row.chartUrl" @click="openChartUrl(row.chartUrl)" style="width: 100px;height: 50px">
        </template>

        <!--点击跳转的URL-->
        <template slot-scope="{ row, index }" slot="webUrl">
          <Input v-if="editIndex === index" type="text" v-model="editWebUrl"/>
          <span v-else @click="openChartUrl(row.webUrl)">{{row.webUrl}}</span>
        </template>

        <!--状态-->
        <template slot-scope="{ row, index }" slot="status">
          <span>
            <Button size="small" type="success" v-if="row.status == 1" @click="changeStatus(row, index)">在用</Button>
            <Button size="small" type="error" v-if="row.status == 0" @click="changeStatus(row, index)">失效</Button>
          </span>
        </template>

        <!--操作-->
        <template slot-scope="{ row, index }" slot="handle">
          <div v-if="editIndex === index">
            <Button @click="handleSave(row,index)">保存</Button>
            <Button @click="editIndex = -1">取消</Button>
          </div>
          <div v-else>
            <Button type="info" size="small" @click="handleEdit(row, index)">编辑</Button>
            <Button type="error" size="small" @click="deleteChart(row, index)">删除</Button>
          </div>
        </template>
      </Table>
    </div>

    <Modal
      v-model="modalFlag"
      title="课程状态"
      @on-ok="modalOk"
      @on-cancel="modalCancel">
      <p v-if="modalTipFlag">你要下线该轮播图吗？<span style="color: #FF0000">【慎重下线】</span></p>
      <p v-if="!modalTipFlag">你要上线该轮播图吗？</p>
    </Modal>

    <Modal
      v-model="modalDeleteFlag"
      title="删除课程"
      @on-ok="modalDeleteOk"
      @on-cancel="modalDeleteCancel">
      <p>你要删除该轮播图吗？<span style="color: #FF0000">【慎重删除，删除无法找回】</span></p>
    </Modal>

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
        // 表格数据
        columns: [
          //多选
          /*{
            type: 'selection',
            width: 60,
            align: 'center'
          },*/
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
            title: "轮播图Url",
            slot: 'chartUrl',
            key: 'chartUrl',
            resizable: true,
            align: "center",
            width: 240
          },
          {
            title: "点击轮播图跳转Url",
            slot: "webUrl",
            key: 'webUrl',
            resizable: true,
            align: "center",
          },
          {
            title: "状态",
            slot: "status",
            key: "statusStr",
            //可拖拽
            resizable: true,
            align: "center",
            width: 120
          },
          {
            title: "操作",
            slot: 'handle',
            //可拖拽
            resizable: true,
            align: "center",
            width: 200
          }
        ],
        //轮播图数据
        chartList: [],
        //使用状态
        statusFlag: true,
        //当前聚焦的行数
        editIndex: -1,
        //第一列轮播图图片
        editChartUrl: "",
        //第二列轮播图跳转链接
        editWebUrl: "",

        //对话框开关
        modalFlag: false,
        //删除对话框开关
        modalDeleteFlag: false,
        //对话框提示开关
        modalTipFlag: true,
        //当前轮播图对象
        rotationChart: null,
        //当前轮播图对象索引
        index: -1
      }
    },
    methods: {
      //获取轮播图列表
      getChartList: function (s = -1) {
        this.axios.get(`/chart/rotationChart/chart`, {
          params: {
            status: s
          }
        })
          .then((resp) => {
            this.chartList = resp.data.data;
            for (let i of this.chartList) {
              if (i.status == 1) {
                i.statusStr = "在用"
              } else if (i.status == 0) {
                i.statusStr = "失效"
              }
            }
            let total = resp.data.data.total;
            this.total = total;
          })
      },
      //该变状态
      checkAllGroupChange: function (list) {
        if (list.length == 2) {
          this.getChartList(-1)
        } else if (list[0] == "在用") {
          this.getChartList(1)
        } else if (list[0] == "失效") {
          this.getChartList(0)
        }
      },
      //点击图片新窗口打开 URL
      openChartUrl: function (url) {
        window.open(url, "_blank");
      },
      //点击【操作】按钮
      handleEdit(row, index) {
        this.editChartUrl = row.chartUrl;
        this.editWebUrl = row.webUrl;
        this.editIndex = index;
      },
      //删除
      deleteChart:function(row,index){
        //开启 对话框
        this.modalDeleteFlag = true;
        //把当前对象赋值给 subject
        this.rotationChart = row;
        this.index = index;
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
        this.rotationChart = row;
        this.index = index;
      },
      //对话框 确定
      modalOk: function () {
        //id
        let chartId = this.rotationChart.chartId;
        //状态
        let status = this.rotationChart.status;
        //切换状态
        if (status == 1) {
          this.chartList[this.index].status = 0
          status = 0
        } else if (status == 0) {
          this.chartList[this.index].status = 1
          status = 1
        }
        this.axios.put(`/chart/rotationChart/chart/${chartId}/${status}`)
          .then(resp => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
            this.getChartList()
          })
        //将对象清空
        this.rotationChart = null
        this.index = -1
      },
      modalCancel: function () {
      },
      modalDeleteOk: function () {
        //id
        let chartId = this.rotationChart.chartId;
        this.axios.delete(`/chart/rotationChart/chart/${chartId}`)
          .then((resp) => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "删除成功"
              })
            }
            this.getChartList()
          })
        //将对象清空
        this.rotationChart = null
        this.index = -1
      },
      modalDeleteCancel: function () {
      },
      //保存
      handleSave(row, index) {
        this.chartList[index].chartUrl = this.editChartUrl;
        this.chartList[index].webUrl = this.editWebUrl;
        this.editIndex = -1;

        //轮播图信息
        let chartId = this.chartList[index].chartId
        let data = {
          chartUrl: this.chartList[index].chartUrl,
          webUrl: this.chartList[index].webUrl,
        }
        this.axios.put(`/chart/rotationChart/chart/${chartId}`, data)
          .then(resp => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
              this.getChartList()
            }
          })
      },
      //添加轮播图
      addChart: function () {
        this.$router.push("/addChart")
      },
      load: function () {
        this.getChartList()
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>
</style>
