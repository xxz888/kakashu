<template>
  <div class="">
    <van-nav-bar :title="title" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div
      style="width:100%;height:100%;-webkit-overflow-scrolling:touch;overflow-y:scroll;position:fixed;padding-top: 46px;">
      <iframe width="100%" height="100%" frameborder="0" :src="url"></iframe>
    </div>
  </div>
</template>

<script>
import {NavBar} from 'vant';

export default {
  data() {
    return {
      url: "",
      title: "",
    }
  },
  components: {
    [NavBar.name]: NavBar,
  },
  created() {
    this.url = JSON.parse(this.$route.params.url)
    this.title = JSON.parse(this.$route.params.title)



  },
  methods: {
    onClickLeft() {
           window.history.back();

    },
  }
}
</script>
<style scoped>

</style>
