<template>
  <div class="interview">
    <div style="height: 100px;width: 100px;border:1px solid black;">
    </div>

    <input type="file" id="file-upload-btn" multiple @change="uploadFile">
  </div>
</template>

<script>
  import OSS from "ali-oss"

  export default {
    name: "",
    components: {},
    data() {
      return {}
    },
    methods: {

      uploadFile: function (e) {
        let file = document.getElementById("file-upload-btn");
        let client = new OSS({
          region: "oss-cn-shanghai",
          accessKeyId: "STS.NUis95tY4vgiUg8ATQ8XDcS83",
          accessKeySecret: "9xixvT1ve786SGU8rYznKUDEJhsUf4JNU8tvSnRvQJvJ",
          stsToken:"CAISgAJ1q6Ft5B2yfSjIr5bcOIOBmYYVwaWCV0GJpVQENNdojJaT0Tz2IHhEenNuBuwetf4ymWBT6vwblqJsRpUAWl3Ub8Ju58z4C5ZckcyT1fau5Jko1beXewHKeSOZsebWZ+LmNqS/Ht6md1HDkAJq3LL+bk/Mdle5MJqP+/EFA9MMRVv6F3kkYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gb6wZ24r/txdaHuFiMzg+46JdM/tihf8L0Npc9Ys4uD4vk5oEsKPqdihw3wgNR6aJ7gJZD/Tr6pdyHCzFTmU7eY7SOrIIzdFQjO/VqQPIe9eKSj/R9vffIhxUAYZLtxww/GoABen2cvUuHXBLiVMfz5a0p37sRCYzXDtGCxDMneEzDL67c6xvZYl7/tYyWaBvUFluWKJZOdMsI8vBKz0TpzXkjwDiPD8rDx9g3rPRRxe6Ev28eLjgjsJzLwEitgorEUumOT/yYaNrwzoxALTnMC2Y0H4n3/2YISS59dYaiuPEIpF0=",
          bucket: "wyxjava"
        });

        for (let i = 0; i < file.files.length; i++) {
          client.multipartUpload(file.files[i].name, file.files[0])
            .then((resp) => {
              console.log(resp);
            })
        }
      }
    }

  }
</script>

<style scoped>

</style>
