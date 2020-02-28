<template>
  <div class="navigation">
    <!-- closable @on-tab-remove="handleTabRemove" -->
    <Tabs type="card" :value="currentTab" :animated="false">
      <!--
      key 是 当前的tab
      label 是 标题的文字
      -->
      <TabPane v-for="obj in tabNavList" :name="obj.menuCode" :key="obj.menuCode" :label="obj.menuName">
        <!--如何使用-->
        <div v-if="obj.menuCode === 'howUse'">
          <HowUse v-bind:obj="obj"></HowUse>
        </div>

        <!--会员权益-->
        <div v-if="obj.menuCode === 'vip'">
          <Vip v-bind:obj="obj"></Vip>
        </div>

        <!--线下辅导-->
        <div v-if="obj.menuCode === 'teacher'">
          <Teacher v-bind:obj="obj"></Teacher>
        </div>

        <!--建议反馈-->
        <div v-if="obj.menuCode === 'suggestion'">
          <Suggestion></Suggestion>
        </div>

        <!--笑话-->
        <div v-if="obj.menuCode === 'joke'">
          <Joke></Joke>
        </div>

        <!--码农心声-->
        <div v-if="obj.menuCode === 'interview'">
          <Interview></Interview>
        </div>

        <!--996.icu-->
        <div v-if="obj.menuCode === 'icu'">
          <Icu></Icu>
        </div>

        <!--爱心-->
        <div v-if="obj.menuCode === 'love'">
          <Love></Love>
        </div>

        <!--面试-->
        <div v-if="obj.menuCode === 'offer'">
          <Offer></Offer>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import HowUse from '@/components/navgation/howUse/HowUse'
  import Vip from '@/components/navgation/vip/Vip'
  import Teacher from '@/components/navgation/teacher/Teacher'
  import Suggestion from '@/components/navgation/suggestion/Suggestion'
  import Joke from '@/components/navgation/joke/Joke'
  import Interview from '@/components/navgation/interview/Interview'
  import Icu from '@/components/navgation/icu/Icu'
  import Love from '@/components/navgation/love/Love'
  import Offer from '@/components/navgation/offer/Offer'
  import Wait from '@/components/navgation/wait/Wait'

  export default {
    name: "",
    components: {
      HowUse, Vip, Teacher, Suggestion, Joke, Interview, Icu, Love, Offer, Wait
    },
    data() {
      return {
        //接收 导航传过来的 分类名
        tab: "",
        //导航列表
        menuNavList: [],
        //tab 列表
        tabs: [],
        //tab 导航列表
        tabNavList: [],
        //当前 tab
        currentTab: ""
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
            this.currentTab = this.tab;
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
      this.Bus.$on("my-event-navigation", (data) => {
        this.tab = data;
      })
    }
  }
</script>

<style scoped>
</style>
