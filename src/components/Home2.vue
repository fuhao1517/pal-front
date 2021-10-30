<template>
  <el-container class="home2-container">
    <el-header height="75px">
      <div class="container-t">
        <div class="container-t-center">
          <el-row>
            <el-col :span="12" style="display: flex">
              <img class="logo f-cursor" src="@/assets/images/icons/pal-logo.png" alt="" @click="handleLogo">
              <div class="meta-title" v-if="$route.meta.title">{{$route.meta.title}}</div>
            </el-col>
            <el-col :span="12">
              <div class="phone-box">
                <img class="phone" src="@/assets/images/icons/phone.png" alt="">
                <div class="contus">
                  <p class="text">全国服务热线</p>
                  <span class="phoneNumber">400-716-2588</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    handleLogo () {
      if (this.$lodash.isEmpty(this.$store.state.token)) {
        this.$router.replace('/login')
      } else {
        this.$router.replace('/index')
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .home2-container{
    height: 100%;
  }
  /deep/.el-header{
    padding: 0;
  }
  .container-t {
    width: 100%;
    height: 75px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(200, 200, 200, 0.8);
    position: relative;
    z-index: 10;
    .container-t-center {
      max-width: @mainContainerWidth;
      width: 95%;
      margin: 0 auto;

      .logo {
        width: 178px;
        height: 42px;
        margin-top: 16px;
      }
      .meta-title{
        display: inline-block;
        border-left: 2px solid #C0C4CC;
        height:40px;
        line-height: 40px;
        padding-left: 20px;
        margin-left: 20px;
        margin-top: 18px;
        flex: 1;
      }
      .phone {
        width: 40px;
        height: 41px;
        vertical-align: middle;
        margin-top: -32px;
      }
      .phone-box {
        text-align: right;
        margin-top: 15px;
      }
      .contus {
        display: inline-block;
        margin-left: 5px;
        text-align: left;
        .phoneNumber {
          font-size: 24px;
          color: @blueColor;
        }
      }
    }
  }
  /deep/.el-main{
    padding: 0;
    background-color: #F2F1F6;
  }
</style>
