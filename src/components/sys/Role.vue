<template>
  <div class="role">
    <div class="top">
      <div class="add">
        <Button type="success" size="default" @click="addRole"> 新增角色 </Button>
      </div>
    </div>

    <div class="body">
      <Table
        border
        show-header
        size="small"
        :columns="columns"
        :data="roleList">

      </Table>
    </div>

    <!--新增角色-->
    <Modal
      title="Title"
      v-model="addPanel"
      :styles="{top: '50px'}">

      <p slot="header">
        <span style="">新增角色</span>
      </p>

      <div>
        角色名称: <input>
      </div>
    </Modal>

    <!--修改角色-->
    <Modal
      title="Title"
      v-model="updatePanel"
      :styles="{top: '100px'}">

    </Modal>
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
            title: "角色名称",
            slot: 'roleName',
            key: 'roleName',
            resizable: true,
            align: "center",
            width: 220
          },
          {
            title: "角色描述",
            slot: "roleDesc",
            key: 'roleDesc',
            resizable: true,
            align: "center",
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
        //角色列表
        roleList:[],
        //新增账号
        addPanel:false,
        //修改账号
        updatePanel:false
      }
    },
    methods: {
      //新增账号
      addRole:function () {
        this.addPanel = true;
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .role {
    width: 98%;
    margin: 0px auto;
  }

  .role .top{
    overflow: hidden;
    margin: 15px auto 10px;
  }

  /*添加账号*/
  .role .top .add{
    float: right;
  }
</style>
