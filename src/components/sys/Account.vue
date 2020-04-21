<template>
  <div class="account">
    <div class="top">
      <div class="add">
        <Button type="success" size="default" @click="addRole"> 新增账号</Button>
      </div>
    </div>

    <div class="body">
      <Table
        border
        show-header
        size="small"
        :columns="columns"
        :data="accountList">

        <!--账户名-->
        <template slot-scope="{ row, index }" slot="accountName">
          <span>{{row.userName}}</span>
        </template>

        <!--登录账号-->
        <template slot-scope="{ row, index }" slot="account">
          <span>{{row.iphoneNo}}</span>
        </template>

        <!--角色-->
        <template slot-scope="{ row, index }" slot="role">
          <!--          <span>{{row}}</span>-->
        </template>

        <!--操作-->
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
      width="500px"
      @on-cancel="cancelAdd"
      @on-ok="okAdd">

      <p slot="header">
        <span style="">新增账号</span>
      </p>

      <!--用户名-->
      <div class="modal-add-box">
        <span class="modal-add-text">
          用户名 :
        </span>
        <Input
          prefix="ios-contact-outline"
          v-model="userName"
          style="float: right;width: 84%"
          placeholder="输入用户名"/>
      </div>

      <!--登录账号-->
      <div class="modal-add-box" style="margin-top: 25px">
        <span class="modal-add-text">
          手机号 :
        </span>
        <Input
          prefix="ios-call-outline"
          v-model="iphoneNo"
          style="float: right;width: 84%"
          placeholder="输入登录手机号"/>
      </div>

      <!--登录账号-->
      <div class="modal-add-box" style="margin-top: 25px">
        <span class="modal-add-text">
          密&nbsp;&nbsp;&nbsp;码 :
        </span>
        <Input
          prefix="ios-lock-outline"
          v-model="pwd"
          style="float: right;width: 84%"
          placeholder="输入登录密码"/>
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
        <span style="">修改账号信息</span>
      </p>

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

    </Modal>

    <!--删除用户-->
    <Modal
      v-model="delTipPanel"
      title="删除角色"
      @on-ok="okDel">
      <p>
        确定删除
        <span style="display: inline-block;margin: 0px 5px;color: #FF0000"></span>
        账号吗
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
            title: "用户名",
            slot: 'accountName',
            key: 'accountName',
            resizable: true,
            align: "center",
            width: 180
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
        updatePanel: false,
        //分配角色
        distPanel: false,
        //删除账号提示
        delTipPanel: false,
        //用户名
        userName: "",
        //登录账号
        iphoneNo: "",
        //登录密码
        pwd:"",
        //临时行
        tmpRow: Object,
      }
    },
    methods: {
      init: function () {
        //请求列表
        this.axios.get(`/login/sysUser/selectSysUser`)
          .then((resp) => {
            if (resp.data.flag) {
              let list = resp.data.data;
              this.accountList = list;
            }
          })
      },
      //新增账号
      addRole: function () {
        this.addPanel = true
      },
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

  /*用户名和输入框盒子*/
  .modal-add-box {
    overflow: hidden;
  }
  /*用户名，手机号，等文字*/
  .modal-add-text {
    display: inline-block;
    font-size: 16px;
    line-height: 34px;
    text-align: left;
    width: 16%;
  }
</style>
