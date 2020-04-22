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
        draggable
        :columns="columns"
        :data="accountList"
        @on-drag-drop="showOrder">

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
          <span>{{row.sysRole.roleName}}</span>
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


    <!--新增账号信息-->
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
          v-model="password"
          style="float: right;width: 84%"
          placeholder="输入登录密码"/>
      </div>
    </Modal>

    <!--修改账号信息-->
    <Modal
      title="Title"
      v-model="updatePanel"
      :styles="{top: '50px'}"
      width="400px"
      @on-cancel="cancelUpdate"
      @on-ok="okUpdate">

      <p slot="header">
        <span style="">修改账号信息</span>
      </p>

      <!--用户名-->
      <div class="modal-add-box">
        <span class="modal-add-text">
          用户名 :
        </span>
        <Input
          prefix="ios-contact-outline"
          v-model="tmpRow.userName"
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
          v-model="tmpRow.iphoneNo"
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
          v-model="userPwdOpen"
          style="float: right;width: 84%"
          placeholder="输入登录密码"/>
      </div>
    </Modal>

    <!--分配权限-->
    <Modal
      title="Title"
      v-model="distPanel"
      width="400px"
      @on-ok="okDist">

      <p slot="header">
        <span style="">分配角色</span>
      </p>

      <div class="modal-add-box">
        <RadioGroup
          v-model="currentRole"
          vertical>
          <Radio
            v-for="(obj,i) in roleList"
            :label="obj.roleId">
            <span>{{obj.roleName}}</span>
          </Radio>
        </RadioGroup>
      </div>
    </Modal>

    <!--删除用户-->
    <Modal
      v-model="delTipPanel"
      title="删除角色"
      @on-ok="okDel">
      <p>
        确定删除
        <span style="display: inline-block;margin: 0px 5px;color: #FF0000">{{tmpRow.userName}}</span>
        账号吗 ?
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
            width: 200
          },
          {
            title: "角色",
            slot: "role",
            key: 'role',
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
        //账户列表
        accountList: [],
        //角色列表
        roleList: [],
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
        password: "",
        //密码明文
        userPwdOpen: "",
        //临时行
        tmpRow: Object,
        //当前角色
        currentRole: 0
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
      //拖拽排序
      showOrder: function (from, to) {
        console.log(this.accountList[from]);
        console.log(this.accountList[to]);
      },
      //新增账号
      addRole: function () {
        this.addPanel = true
      },
      //取消添加
      cancelAdd: function () {
        this.userName = ""
        this.iphoneNo = ""
        this.password = ""
      },
      //新增账号
      okAdd: function () {
        let data = {
          userName: this.userName,
          iphoneNo: this.iphoneNo,
          //密码明文 base64
          userPwdOpen: Base64.encode(this.password),
          //密码密文 md5
          userPwdClose: this.Md5(this.password)
        }
        this.axios.post(`/login/sysUser/user`, data)
          .then((resp) => {
            if (resp.data.flag) {
              //重新请求
              this.init()
              this.$Notice.success({
                title: "添加成功"
              })
              this.userName = ""
              this.iphoneNo = ""
              this.password = ""
            }
          })
      },
      //删除账号提示面板
      delRole: function (row, index) {
        this.tmpRow = row
        this.delTipPanel = true
      },
      //删除账号
      okDel: function () {
        this.axios.delete(`/login/sysUser/user/${this.tmpRow.userId}`)
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
      },
      //编辑，展示面板
      edit: function (row, index) {
        this.tmpRow = row
        this.updatePanel = true
        this.userPwdOpen = Base64.decode(this.tmpRow.userPwdOpen)
      },
      //编辑 cancel回调
      cancelUpdate: function () {

      },
      //编辑 ok回调
      okUpdate: function () {
        let data = {
          userName: this.tmpRow.userName,
          iphoneNo: this.tmpRow.iphoneNo,
          //密码明文 base64
          userPwdOpen: Base64.encode(this.userPwdOpen),
          //密码密文 md5
          userPwdClose: this.Md5(this.userPwdOpen)
        }
        this.axios.put(`/login/sysUser/user/${this.tmpRow.userId}`, data)
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
        this.distPanel = true
        this.tmpRow = row
        this.currentRole = 0
        //根据用户id请求当前分配角色
        this.axios.get(`/login/sysRole/menuRole/${this.tmpRow.userId}`)
          .then((resp) => {
            if (resp.data.flag) {
              //角色列表
              this.roleList = resp.data.data
              //当前角色
              for (let i of this.roleList) {
                if (i.flag == 1) {
                  i.flag = true
                  this.currentRole = i.roleId
                } else if (i.flag == 0) {
                  i.flag = false
                }
              }
            }
          })
      },
      //分配角色，请求后台
      okDist: function () {
        this.axios.put(`/login/sysUser/userRole/${this.tmpRow.userId}/${this.currentRole}`)
          .then((resp) => {
            if (resp.data.flag) {
              this.$Notice.success({
                title: "修改成功"
              })
              this.currentRole = 0
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
