<!--
  changeTab--切换tab触发的事件，参数obj={ active: index, item: item }
-->
<template>
  <div>
  <div class="spl-steps">
    <div class="step" :class="{'is-finish': stepActive>index, 'is-process': stepActive>index-1}" v-for="(item, index) in stepsData" :key="index">
      <div class="step-content">
        <i class="step-num">0{{index+1}}</i>
        <span class="title">{{item.title}}</span>
        <p class="description">{{item.description}}</p>
      </div>

      <div class="step-line" v-if="index!=stepsData.length-1">
        <i class="step-line-inner"></i>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'spl-tab',
  data () {
    return {
      stepActive: 0,
      stepsData: []
    }
  },
  props: {
    data: {
      type: [Array],
      default: function () {
        return []
      },
      required: true
    },
    active: {
      type: Number,
      default: 0,
      required: false
    }
  },
  components: {},
  watch: {
    active (newValue, oldValue) {
      this.stepActive = newValue
    },
    data (newValue, oldValue) {
      this.stepsData = newValue
    }
  },
  created () {
    this.stepActive = this.active
    this.stepsData = this.data
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
  .spl-steps{
    width: 80%;
    margin: 0 auto;
    display: flex;
    height: 85px;
    .step{
      position: relative;
      flex: 1;
      margin-right: 10px;
      text-align: center;
    }
    .step-content{
      display: inline-block;
      position: relative;
      padding: 0 10px;
      background-color: #fff;
      .description{
        font-size: 12px;
        color: #909399;
        margin-top: 10px;
        width: 250px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
      }
    }
    .step-num{
      display: inline-block;
      width:40px;
      height:40px;
      line-height: 40px;
      text-align: center;
      background: #E4E6EB;
      border-radius:50%;
      color: #ffffff;
      position: relative;
      z-index: 2;
    }
    .title{
      padding: 0 10px;
      line-height: 40px;
      background-color: #fff;
      position: relative;
      z-index: 2;
    }
    .step-line {
      border-color: inherit;
      background-color: #E4E6EB;
      height: 3px;
      width: 100%;
      position: absolute;
      right: -50%;
      top: 19px;
    }
    .step-line-inner {
      display: block;
      /*border: 1px solid #E4E6EB;*/
      border-color: inherit;
      transition: .15s ease-out;
      box-sizing: border-box;
      width: 0;
      height: 3px;
      background: @blueColor;
    }
    .step.is-process{
      .step-num{
        background-color: @blueColor;
      }
    }
    .step.is-finish{
      .step-line-inner{
        width: 100%;
      }
    }
  }
</style>
