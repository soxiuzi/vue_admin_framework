<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { test } from "@/Api/test";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  created() {
    test.then(res => {
      console.log('请求结果：', res)
    })
    // this.$axios({
    //   method: 'get',
    //   url: '/api/v2/movie/in_theaters',
    // }).then(res => {
    //   console.log('请求结果：', res)
    // })
  }
}
</script>
