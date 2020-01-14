<template>
  <div class="subjectDetails">
    {{sub}}
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        sub: this.$route.params.sub
      }
    },
    methods: {},
  }
</script>

<style scoped>
</style>
