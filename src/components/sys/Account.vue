<template>
  <div class="account">
    <div class="top">
      <div class="add">
        <Button type="success" size="default"> 新增账号 </Button>
      </div>
    </div>

    <div class="body">
      <Table
        border
        show-header
        size="small"
        :columns="columns"
        :data="accountList">

      </Table>
    </div>

    <div class="addPanel" v-if="addPanel">

    </div>

    <div class="updatePanel" v-if="updatePanel">

    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
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
            title: "账号",
            slot: 'accountName',
            key: 'accountName',
            resizable: true,
            align: "center",
          },
          {
            title: "角色",
            slot: "role",
            key: 'role',
            resizable: true,
            align: "center",
            width: 220
          },
          {
            title: "状态",
            slot: 'status',
            resizable: true,
            align: "center",
            width: 120
          },
          {
            title: "删除",
            slot: 'del',
            //可拖拽
            resizable: true,
            align: "center",
            width: 120
          }
        ],
        //账户列表
        accountList:[],
        //新增角色
        addPanel:false,
        //修改角色
        updatePanel:false
      }
    },
    methods: {},
    mounted() {
    }
  }
</script>

<style scoped>
  .account {
    width: 98%;
    margin: 0px auto;
  }

  .account .top{
    overflow: hidden;
    margin: 15px auto 10px;
  }

  .account .top .add{
    float: right;
  }

  /*添加账号面板*/
  .account .addPanel{
    width: 300px;
    height: 500px;
    border: 1px solid black;
  }

  /*更新账号面板*/
  .account .updatePanel{

  }
</style>
