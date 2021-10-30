<template>
  <div class="spl-breadcrumb clearfix">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <span class="cur-router"><i class="ic-breadcrumb-home"></i>当前位置：</span>
      <el-breadcrumb-item class="f-cursor" v-for="item in data" :key="item.path">
        <router-link v-if="item.path" :to="item.path" v-text="item.name"></router-link>
        <a v-else style="cursor: initial">
          {{item.name}}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="breadcrumb-btn">
      <slot name="breadcrumb-btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 参数  导航数据
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  created () {
  },
  computed: {},
  methods: {}
}
</script>
<style lang="less" scoped>
  .cur-router {
    float: left;
    color: #888888;
  }

  .ic-breadcrumb-home {
    display: inline-block;
    width: 24px;
    height: 20px;
    margin-top: 19px;
    background: url('../../assets/images/icons/ic-breadcrumb-home.png');
    margin-right: 9px;
  }

  //面包屑
  .spl-breadcrumb {
    position: fixed;
    top: 60px;
    width: calc(100% - 240px);
    // height: 120px;
    background-color: @bodyBaseBgc;
    margin-left: -20px;
    z-index: 9;
    padding-top: 20px;
    /deep/ .el-breadcrumb {
      padding: 0 20px;
      height: 60px;
      background-color: #ffffff;
      margin-bottom: 20px;
      font-size: 15px;
      a{
        color: #888888;
        font-weight: normal;
        line-height: 66px;
      }
    }
    /deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner a{
      color: #333333;
    }
    /deep/.el-breadcrumb__separator[class*=icon]{
      padding: 0 10px;
    }
    .spl-index {
      background-color: #fff;
      padding: 20px 240px 20px 40px;
      margin-bottom: 20px;
    }
    .breadcrumb-btn{
      position: absolute;
      top: 35px;
      right: 20px;
    }
  }
</style>
