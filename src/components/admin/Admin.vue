<template>
  <div class="admin">
    <Layout>
      <!--
      hide-trigger       隐藏默认触发器 左侧下面的 < 触发器
      collapsible        是否可收起，设为false后，默认触发器会隐藏，且响应式布局不会触发
      collapsed-width	    收缩宽度，设置为 0 会出现特殊 trigger
      -->
      <!--左侧 侧边栏-->
      <Sider ref="side"
             hide-trigger
             collapsible
             :collapsed-width="80"
             v-model="isCollapsed"
             width="150"
             :style="{minHeight:'100vh'}">
        <!--  accordion 手风琴，每次展开一个 -->
        <Menu theme="dark" width="auto" @on-select="selectMenu">
          <Submenu :name="obj.menuCode" v-for="(obj,i) in menuList">
            <template slot="title">
              {{obj.menuName}}
            </template>
            <MenuItem :name="o.menuCode" v-for="(o,j) in obj.sysMenuList">
              {{o.menuName}}
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>

      <Layout :style="{background: '#EEEEEE'}">
        <!--右侧的 Header-->
        <Header :style="{padding: 0}" class="layout-header-bar">
         <!-- <Icon @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{margin: '0 20px'}"
                type="md-menu"
                size="24">
          </Icon>-->
          <div class="welcome">

            <div class="name">
              <span style="color: red">欢迎您</span>
              <span style="font-size: 20px">{{this.userInfo.userName}}</span>
            </div>

            <div class="signOut" @click="signOut">

            </div>
          </div>
        </Header>

        <!--右侧的 内容-->
        <Content :style="{margin: '10px 0px 0px 10px', background: '#FFF', minHeight: '260px'}">

          <router-view/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import RotationChart from '@/components/home/RotationChart'
  import Course from '@/components/curriculum/Subject'
  import Question from '@/components/curriculum/Question'
  import Navigation from '@/components/navgation/Navigation'
  import Vue from "vue"
  import {
    delCookie
  } from "@/tools/cookie";

  export default {
    name: "",
    components: {
      RotationChart,
      Course,
      Question,
      Navigation
    },
    data() {
      return {
        //是否缩进
        isCollapsed: false,
        //菜单列表
        menuList: [],
        //显示面板
        flag: "chart",
        //传给 导航栏
        tab: ""
      }
    },
    computed: {
      //点击 触发左侧侧边栏
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
    },
    methods: {
      collapsedSider() {
        //改变 Sider 展开-收起状态。
        this.$refs.side.toggleCollapse();
      },
      //退出
      signOut:function(){
        //删除 sessionStorage
        window.sessionStorage.clear();
        //删除 cookie
        delCookie("isLogin");
        delCookie("token");
        delCookie("userInfo");
        Vue.prototype.isSign = false;
        Vue.prototype.userInfo = "";
        Vue.prototype.userId = "";
        Vue.prototype.token = "";
        //刷新页面到首页
        this.$emit("my-event-login", false)
        window.location.replace("/")
      },
      //选中折叠菜单
      selectMenu: function (name) {
        if (name == "rotationChart") {
          this.$router.push("/rotationChart");
        }
        if (name == "course") {
          this.$router.push("/subject");
        }
        if (name == "question") {
          this.$router.push("/question");
        }
        //遍历
        for (let s of this.navNames) {
          if (s == name) {
            // this.tab = name
            this.$router.replace("/navigation");
            this.Bus.$emit("my-event-navigation",name);
            return false;
          }
        }
      },
      //页面加载
      load: function () {
        //查询菜单列表
        this.axios.get(`/admin/sysMenu/menus/${this.userInfo.userId}`)
          .then(resp => {
            let list = resp.data.data;
            this.menuList = list;
          })
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>
  .admin {
    height: 100vh;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  /* header */
  .layout-header-bar {
    background: #FFFFFF;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .welcome{
    float: right;
  }

  .welcome .name,
  .welcome .signOut{
    float: left;
  }

  .welcome .signOut{
    border:1px solid #d5d5d5;
    margin: 14px 30px 0px 40px;
    width: 40px;
    height: 40px;
    background-image: url("../../assets/login/signOut.png");
    background-size: 100%;
    background-repeat: no-repeat;
  }
</style>
