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
          <span v-if="row.suggestType == 1">功能故障</span>
          <span v-if="row.suggestType == 2">优化建议</span>
          <span v-if="row.suggestType == 3">其他</span>
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
          <Button size="small" type="success" v-if="row.status == 1" @click="handleEdit(row,index)">在用</Button>
          <Button size="small" type="error" v-if="row.status == 0" @click="handleEdit(row,index)">失效</Button>
        </template>
      </Table>
    </div>


    <Modal
      v-model="modalFlag"
      title="课程状态"
      @on-ok="modalOk"
      @on-cancel="modalCancel">
      <p v-if="modalTipFlag">你要<span style="color: #FF0000">删除</span>该反馈吗？</p>
      <p v-if="!modalTipFlag">你要<span style="color: #FF0000">重提</span>该反馈吗？</p>
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
        status: -1,
        //Tip开关
        modalFlag: false,
        //Tip文字开关
        modalTipFlag: true,
        //数据id
        sid:"",
        //数据状态
        sStatus:""
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
        } else if (list == "其他") {
          this.getSuggestList(3, this.status)
        }
      },
      //点击 在用/失效 改变状态
      handleEdit: function (row) {
        this.sid = row.id;
        this.sStatus = row.status;
        if (row.status == 1) {
          this.modalFlag = true
          this.modalTipFlag = true
        }
        if (row.status == 0) {
          this.modalFlag = true
          this.modalTipFlag = false
        }
      },
      //对话框 确定
      modalOk: function () {
        if(this.sStatus == 1){
          this.sStatus = 0
        }else if(this.sStatus == 0){
          this.sStatus = 1
        }
        let data = {
          id: this.sid,
          status: this.sStatus
        }
        this.axios.put(`${this.domain.Admin}/suggest/suggestion`, data)
          .then(resp => {
            let respData = resp.data.data;
            if (respData.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
            }
            this.getSuggestList(this.suggestType,this.status)
          })
          .catch(resp => {
          })
        //将对象清空
        this.modalFlag = false
      },
      modalCancel: function () {

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
