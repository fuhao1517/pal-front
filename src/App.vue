<template>
  <div id="app">
    <!-- 添加路由占位符 -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {

  },
  created () {
    // console.log('环境==' + process.env.VUE_APP_URL)
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>

</style>
