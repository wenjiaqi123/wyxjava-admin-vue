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
            <MenuItem :name="o.menuCode" v-for="(o,j) in obj.list">
              {{o.menuName}}
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>

      <Layout :style="{background: '#EEEEEE'}">
        <!--右侧的 Header-->
        <Header :style="{padding: 0}" class="layout-header-bar">
          <!-- @click.native="collapsedSider" 伸缩侧边栏 -->
          <!--<Icon @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{margin: '0 20px'}"
                type="md-menu"
                size="24">
          </Icon>-->
        </Header>

        <!--右侧的 内容-->
        <Content :style="{margin: '10px 0px 0px 10px', background: '#FFF', minHeight: '260px'}">
          <!--轮播图-->
          <div v-if="flag == 'rotationChart'">
            <RotationChart></RotationChart>
          </div>
          <!--课程-->
          <div v-if="flag == 'course'">
            <Course></Course>
          </div>
          <!--题目-->
          <div v-if="flag == 'question'">
            <Question></Question>
          </div>
          <!--导航栏-->
          <div v-if="flag == 'navigation'">
            <Navigation></Navigation>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import RotationChart from '@/components/home/RotationChart'
  import Course from '@/components/curriculum/Course'
  import Question from '@/components/curriculum/Question'
  import Navigation from '@/components/navgation/Navigation'

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
        //导航的菜单
        navNames: ["howUse", "vip", "teacher", "suggestion", "joke", "interview", "icu", "interview", "offer"]
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
      //选中折叠菜单
      selectMenu: function (name) {
        for (let s of this.navNames) {
          console.log(s);
          if (s == name) {
            this.flag = "navigation"
            return false;
          }
        }
        this.flag = name
      },
      //页面加载
      load: function () {
        this.axios.get(`${this.domain.Admin}/menu/menuList`)
          .then(resp => {
            let list = resp.data.data.list;
            this.menuList = list;
          })
          .catch(resp => {
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
</style>
