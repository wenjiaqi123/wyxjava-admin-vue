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
          <span v-else>{{row.webUrl}}</span>
        </template>

        <!--状态-->
        <template slot-scope="{ row, index }" slot="status">
          <RadioGroup v-if="editIndex === index" v-model="editStatus">
            <Radio label="1">在用</Radio>
            <Radio label="0">失效</Radio>
          </RadioGroup>
          <span v-else>
            <Button size="small" type="success" v-if="row.status == 1">在用</Button>
            <Button size="small" type="error" v-if="row.status == 0">失效</Button>
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
          </div>
        </template>
      </Table>
    </div>


    <br>
    <Button type="success" size="small" @click="addChart()">添加轮播图</Button>

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
            width: 180
          },
          {
            title: "操作",
            slot: 'handle',
            //可拖拽
            resizable: true,
            align: "center",
            width: 180
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
        //第三列状态
        editStatus: "",
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
      //点击图片新窗口打开 URL
      openChartUrl: function (url) {
        window.open(url, "_blank");
      },
      //点击【操作】按钮
      handleEdit(row, index) {
        this.editChartUrl = row.chartUrl;
        this.editWebUrl = row.webUrl;
        this.editStatus = `${row.status}`;
        this.editIndex = index;
      },
      //保存
      handleSave(row, index) {
        this.chartList[index].chartUrl = this.editChartUrl;
        this.chartList[index].webUrl = this.editWebUrl;
        this.chartList[index].status = this.editStatus;
        this.editIndex = -1;

        //轮播图信息 id
        let id = this.chartList[index].id
        let data = {
          id: id,
          chartUrl: this.chartList[index].chartUrl,
          webUrl: this.chartList[index].webUrl,
          status: this.chartList[index].status
        }
        this.axios.put(`${this.domain.Admin}/rotationChart/chart`, data)
          .then(resp => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "保存成功"
              })
              this.getChartList()
            }
          })
          .catch(resp => {
          })
      },
      //添加轮播图
      addChart: function () {
        console.log(1);
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
