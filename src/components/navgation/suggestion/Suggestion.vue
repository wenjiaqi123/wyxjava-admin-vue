<template>
  <div class="suggestion">
    <CheckboxGroup v-model="useFlag" @on-change="changeStatus">
      <Checkbox label="在用"></Checkbox>
      <Checkbox label="失效"></Checkbox>
    </CheckboxGroup>

    <RadioGroup v-model="suggestFlag" @on-change="changeType">
      <Radio label="所有"></Radio>
      <Radio label="功能故障"></Radio>
      <Radio label="优化建议"></Radio>
      <Radio label="其他"></Radio>
    </RadioGroup>

    <div>
      <Table
        border
        show-header
        size="small"
        :columns="columns"
        :data="suggestList">


        <!--反馈类型-->
        <template slot-scope="{ row, index }" slot="suggestType">
          <span>{{row.suggestType}}</span>
        </template>

        <!--反馈描述-->
        <template slot-scope="{ row, index }" slot="suggestText">
          <span>{{row.suggestDesc}}</span>
        </template>

        <!--手机号-->
        <template slot-scope="{ row, index }" slot="iphoneNo">
          <span>{{row.iphoneNo}}</span>
        </template>

        <!--邮箱号-->
        <template slot-scope="{ row, index }" slot="email">
          <span>{{row.email}}</span>
        </template>

        <!--状态-->
        <template slot-scope="{ row, index }" slot="status">
          <Button size="small" type="success" v-if="row.status == 1">在用</Button>
          <Button size="small" type="error" v-if="row.status == 0">失效</Button>
        </template>
      </Table>
    </div>


    <Modal
      v-model="modalFlag"
      title="课程状态"
      @on-ok="modalOk"
      @on-cancel="modalCancel">
      <p v-if="modalTipFlag">你要删除该反馈吗？</p>
      <p v-if="!modalTipFlag">你要重提该课程吗？</p>
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
        //类型
        suggestFlag: "所有",
        //表格数据
        columns: [
          //多选
          {
            title: "序号",
            // key: 'id',
            type: 'index',
            //可拖拽
            resizable: true,
            align: "center",
            width: 80
          },
          {
            title: "反馈类型",
            slot: 'suggestType',
            key: 'suggestType',
            resizable: true,
            align: "center",
            width: 120
          },
          {
            title: "反馈描述",
            slot: "suggestText",
            key: 'suggestText',
            resizable: true,
            align: "center",
          },
          {
            title: "手机号",
            slot: 'iphoneNo',
            key: 'iphoneNo',
            resizable: true,
            align: "center",
            width: 140
          },
          {
            title: "邮箱号",
            slot: "email",
            key: 'email',
            resizable: true,
            align: "center",
            width: 220
          },
          {
            title: "状态",
            slot: "status",
            key: "statusStr",
            //可拖拽
            resizable: true,
            align: "center",
            width: 100
          }
        ],
        //反馈建议列表
        suggestList: [],
        //反馈类型
        suggestType: -1,
        //反馈信息状态
        status: -1
      }
    },
    methods: {
      //获取反馈建议列表
      getSuggestList: function (suggestType = -1, status = -1) {
        this.axios.get(`${this.domain.Admin}/suggest/suggestion`, {
          params: {
            suggestType: suggestType,
            status: status
          }
        })
          .then((resp) => {
            let list = resp.data.data.list;
            this.suggestList = list;
            for (let i of this.suggestList) {
              if (i.status == 1) {
                i.statusStr = "在用"
              } else if (i.status == 0) {
                i.statusStr = "失效"
              }
          }
          })
          .catch((resp) => {
          })
      },
      //该变状态
      changeStatus: function (list) {
        if (list.length == 2) {
          this.getSuggestList(this.suggestType, -1)
        } else if (list[0] == "在用") {
          this.getSuggestList(this.suggestType, 1)
        } else if (list[0] == "失效") {
          this.getSuggestList(this.suggestType, 0)
        }
      },
      changeType: function (list) {
        if (list == "所有") {
          this.getSuggestList(-1, this.status)
        } else if (list == "功能故障") {
          this.getSuggestList(1, this.status)
        } else if (list == "优化建议") {
          this.getSuggestList(2, this.status)
        }else if (list == "其他") {
          this.getSuggestList(3, this.status)
        }
      },
      load: function () {
        this.getSuggestList()
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>

</style>
