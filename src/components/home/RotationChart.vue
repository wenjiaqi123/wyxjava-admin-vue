<template xmlns:https="http://www.w3.org/1999/xhtml">
  <div class="rotationChart">
    <div style="margin: 8px auto 2px 5px">
      <Page
        :total="total"
        show-total
        show-elevator
        show-sizer
        :page-size-opts="showSizer"
        @on-change="changePage"
        @on-page-size-change="changeRows"/>
    </div>

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
        :data="chartList"
        @on-row-click="openChart"></Table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
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
            key: 'chartUrl',
            resizable: true,
            align: "left",
            // width: 400
          },
          {
            title: "点击轮播图跳转Url",
            key: 'webUrl',
            resizable: true,
            align: "center",
            // width: 400
          },
          {
            title: "状态",
            key: "statusStr",
            //可拖拽
            resizable: true,
            align: "center",
            width: 100
          }
        ],
        //轮播图数据
        chartList: []
      }
    },
    methods: {
      //获取轮播图列表
      getChartList: function (s = -1) {
        this.axios.get(`${this.domain.Admin}/rotationChart/chartList`, {
          params: {
            page: this.page,
            rows: this.rows,
            status: s
          }
        })
          .then((resp) => {
            let list = resp.data.data.list;
            this.chartList = list;
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
          .catch((resp) => {
          })
      },
      //改变页码
      changePage: function (page) {
        this.page = page;
        this.getChartList()
      },
      //改变每页记录数
      changeRows: function (rows) {
        this.rows = rows;
        this.getChartList()
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
      openChart: function () {

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
