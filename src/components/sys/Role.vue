<template>
  <div class="role">
    <div class="top">
      <div class="add">
        <Button type="success" size="default" @click="addRole"> 新增角色</Button>
      </div>
    </div>

    <div class="body">
      <Table
        border
        show-header
        size="small"
        :columns="columns"
        :data="roleList">

        <!--角色名称-->
        <template slot-scope="{ row, index }" slot="roleName">
          <span>{{row.roleName}}</span>
        </template>

        <!--角色描述-->
        <template slot-scope="{ row, index }" slot="roleDesc">
          <span>{{row.roleDesc}}</span>
        </template>

        <!--管理-->
        <template slot-scope="{ row, index }" slot="handle">
          <Button size="small" type="info" @click="edit(row, index)">编辑</Button>
          <Button size="small" type="info" @click="distribute(row, index)">分配</Button>
        </template>

        <!--删除-->
        <template slot-scope="{ row, index }" slot="del">
          <Button type="error" size="small" @click="delRole(row, index)">删除</Button>
        </template>
      </Table>
    </div>

    <!--新增角色-->
    <Modal
      title="Title"
      v-model="addPanel"
      :styles="{top: '50px'}"
      width="400px"
      @on-cancel="cancelAdd"
      @on-ok="okAdd">

      <p slot="header">
        <span style="">新增角色</span>
      </p>

      <div>
        <span class="modal-add-text">
          角色名称:
        </span>
        <Input
          prefix="ios-create-outline"
          v-model="roleName"
          placeholder="输入角色名称"/>
      </div>

      <div style="margin-top: 25px">
        <span class="modal-add-text">
          角色描述:
        </span>
        <Input
          prefix="ios-calendar-outline"
          v-model="roleDesc"
          placeholder="输入角色描述"/>
      </div>
    </Modal>

    <!--修改角色-->
    <Modal
      title="Title"
      v-model="updatePanel"
      :styles="{top: '50px'}"
      width="400px"
      @on-ok="okUpdate">

      <p slot="header">
        <span style="">修改角色信息</span>
      </p>

      <div>
        <span class="modal-add-text">
          角色名称:
        </span>
        <Input
          prefix="ios-create-outline"
          v-model="tmpRow.roleName"
          placeholder="输入角色名称"/>
      </div>

      <div style="margin-top: 25px">
        <span class="modal-add-text">
          角色描述:
        </span>
        <Input
          prefix="ios-calendar-outline"
          v-model="tmpRow.roleDesc"
          placeholder="输入角色描述"/>
      </div>
    </Modal>

    <!--分配菜单-->
    <Modal
      title="Title"
      v-model="distPanel"
      width="500px"
      @on-ok="okDist">

      <p slot="header">
        <span style="">分配菜单</span>
      </p>

      <Tree :data="menuList" show-checkbox ref="tree"></Tree>
    </Modal>

    <!--删除用户-->
    <Modal
      v-model="delTipPanel"
      title="删除角色"
      @on-ok="okDel">
      <p>
        确定删除
        <span style="display: inline-block;margin: 0px 5px;color: #FF0000">{{tmpRow.roleName}}</span>
        角色吗
      </p>
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
            align: "left",
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
        //角色列表
        roleList: [],
        menuList: [],
        //新增账号
        addPanel: false,
        //修改账号
        updatePanel: false,
        //分配菜单
        distPanel: false,
        //删除账号提示
        delTipPanel: false,
        //角色名称
        roleName: "",
        //角色描述
        roleDesc: "",
        //临时行
        tmpRow: Object,
      }
    },
    computed: {
      userInfo() {
        return this.Store.getters.getUserInfo;
      },
    },
    methods: {
      //请求角色列表
      init: function () {
        this.axios.get(`/login/sysRole/roleList`)
          .then((resp) => {
            if (resp.data.flag) {
              this.roleList = resp.data.data;
            }
          })
      },
      //新增账号
      addRole: function () {
        this.addPanel = true;
      },
      //添加角色，cancel回调
      cancelAdd: function () {
        this.roleName = ""
        this.roleDesc = ""
      },
      //添加角色，OK回调
      okAdd: function () {
        //发送添加请求
        let data = {
          roleName: this.roleName,
          roleDesc: this.roleDesc,
        }
        this.axios.post(`/login/sysRole/role`, data)
          .then((resp) => {
            if (resp.data.flag) {
              //重新请求
              this.init()
              this.$Notice.success({
                title: "添加成功"
              })
              this.roleName = ""
              this.roleDesc = ""
            }
          })
      },
      //编辑角色信息
      edit: function (row, index) {
        //展示面板
        this.updatePanel = true
        //将当前行赋予 tmpRow
        this.tmpRow = row
      },
      //确定修改角色信息
      okUpdate: function () {
        let data = {
          roleName: this.tmpRow.roleName,
          roleDesc: this.tmpRow.roleDesc,
        }
        this.axios.put(`/login/sysRole/role/${this.tmpRow.roleId}`, data)
          .then((resp) => {
            if (resp.data.flag) {
              //重新请求
              this.init()
              this.$Notice.success({
                title: "修改成功"
              })
              this.tmpRow = Object
            }
          })
      },
      //分配权限
      distribute: function (row, index) {
        //展示面板
        this.distPanel = true
        this.tmpRow = row
        //查询菜单列表
        this.axios.get(`/login/sysRole/menus/${row.roleId}`)
          .then((resp) => {
            if (resp.data.flag) {
              let list = resp.data.data;
              for (let i of list) {
                i.expand = true
                if (i.flag == 1) {
                  i.checked = true
                } else if (i.flag == 0) {
                  i.checked = false
                }
                let child = i.children;
                for (let j of child) {
                  if (j.flag == 1) {
                    j.checked = true
                  } else if (j.flag == 0) {
                    j.checked = false
                  }
                }
              }
              this.menuList = list;
            }
          })
      },
      //保存菜单
      okDist: function () {
        let nodes = this.$refs.tree.getCheckedNodes();
        let menuIds = new Array();
        for (let i of nodes) {
          if (i.pid != 0) {
            menuIds.push(i.menuId);
          }
        }
        this.axios.put(`/login/sysRole/role/menus/${this.tmpRow.roleId}`, menuIds)
          .then((resp) => {
            if(resp.data.flag){
              this.$Notice.success({
                title: "分配成功"
              })
              this.tmpRow = Object
            }
          })
      },
      //删除角色
      delRole: function (row, index) {
        this.delTipPanel = true;
        this.tmpRow = row
      },
      //删除用户
      okDel: function () {
        this.axios.delete(`/login/sysRole/role/${this.tmpRow.roleId}`)
          .then((resp) => {
            if (resp.data.flag) {
              //重新请求
              this.init()
              this.$Notice.success({
                title: "删除成功"
              })
              this.tmpRow = Object
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
  .role {
    width: 98%;
    margin: 0px auto;
  }

  .role .top {
    overflow: hidden;
    margin: 15px auto 10px;
  }

  /*添加账号*/
  .role .top .add {
    float: right;
  }

  .modal-add-text {
    display: inline-block;
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
