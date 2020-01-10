<template>
  <div class="navigation">
    <!-- 导航navigation
     如何使用howUse
     会员权益vip
     线下辅导teacher
     建议反馈suggestion
     程序猿笑话joke
     码农心声interview
     996.icuicu
     爱心love
     面试offer-->
    <!-- closable @on-tab-remove="handleTabRemove" -->
    <Tabs type="card" :value="currentTab"  :animated="false">
      <!--
      key 是 当前的tab
      label 是 标题的文字
      -->
      <TabPane v-for="obj in tabNavList" :name="obj.menuCode" :key="obj.menuCode" :label="obj.menuName">
        {{obj}}
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    props: {
      tab: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        //导航列表
        menuNavList: [],
        //tab 列表
        tabs: [],
        //tab 导航列表
        tabNavList: [],
        //当前 tab
        currentTab: "",
      }
    },
    methods: {
      handleTabRemove(name) {
        this["tab" + name] = false;
      },
      //页面加载
      load: function () {

      }
    },
    //监听
    watch: {
      "tab": function () {
        //是否存在 flag
        let flag = false;
        //遍历
        for (let i of this.tabs) {
          //如果 tabs 数组中存在
          if (this.tab == i) {
            // 设置 flag 为 true
            flag = true
            //当前 tab
            this.currentTab = this.tab;
            return false;
          }
        }
        //不存在 push 进数组
        if (!flag) {
          this.tabs.push(this.tab);
        }

        for (let i of this.menuNavList) {
          if (this.tab == i.menuCode) {
            this.tabNavList.push(i);
          }
        }
      }
    },
    created() {
      //查询导航菜单列表
      let promise = this.axios.get(`${this.domain.Admin}/menu/menuNavList`)
        .then(resp => {
          let list = resp.data.data.list;
          this.menuNavList = list;
        })
        .catch(resp => {
        });
      // 创建时就加入 tabs
      this.tabs.push(this.tab);

      //等待结果返回
      promise.then(() => {
        for (let i of this.menuNavList) {
          if (this.tab == i.menuCode) {
            this.tabNavList.push(i);
          }
        }
      })
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>
  .navigation {
    border: 1px solid black;
  }
</style>
