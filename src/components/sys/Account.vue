<template>
  <div class="account">
    <div class="top">
      <div class="add">
        <Button type="success" size="default"> 新增账号</Button>
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
            title: "账号名",
            slot: 'accountName',
            key: 'accountName',
            resizable: true,
            align: "center",
          },
          {
            title: "登录账号",
            slot: 'account',
            key: 'account',
            resizable: true,
            align: "center",
          },
          {
            title: "角色",
            slot: "role",
            key: 'role',
            resizable: true,
            align: "center",
            width: 200
          },
          {
            title: "操作",
            slot: 'handle',
            resizable: true,
            align: "center",
            width: 180
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
        accountList: [],
        //新增角色
        addPanel: false,
        //修改角色
        updatePanel: false
      }
    },
    methods: {
      init: function () {
        //请求列表
        this.axios.get(`/login/sysUser/selectSysUser`)
          .then((resp) => {
            if(resp.data.flag){
              let list = resp.data.data;
              console.log(list);
            }
          })
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .account {
    width: 98%;
    margin: 0px auto;
  }

  .account .top {
    overflow: hidden;
    margin: 15px auto 10px;
  }

  .account .top .add {
    float: right;
  }

  /*添加账号面板*/
  .account .addPanel {
    width: 300px;
    height: 500px;
    border: 1px solid black;
  }

  /*更新账号面板*/
  .account .updatePanel {

  }
</style>
