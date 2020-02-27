<template>
  <div class="addSubject">
    <Collapse v-model="foldPanel">
      <Panel name="1">
        详情
        <div slot="content">
          <div>

          </div>
          <div>

          </div>
        </div>
      </Panel>
      <Panel name="2">
        列表
        <div slot="content">
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //折叠面板
        foldPanel: ["1", "2"],
      }
    },
    methods: {

    },
    created() {
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
