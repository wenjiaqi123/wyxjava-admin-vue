<template>
  <div class="courseDetails">
    <div class="right"></div>
    <div class="video">
      <video :src="videoUrl" autoplay controls width="320" height="180">

      </video>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        //视频URL
        videoUrl: "https://learning.dcloud.io/video/chapter_01.mp4"
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .video {
    width: 320px;
    height: 180px;
  }

  .courseDetails .right {
    float: right;
    border: 1px solid black;
    width: calc(100% - 320px);
    height: 180px;
  }
</style>
