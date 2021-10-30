<template>
  <div class="content">
    <splTab :tabs="calTypes" v-model="active"></splTab>
    <!--每月测算 start-->
    <div v-show="active==0">
      <WageMonths :threshold="thresholdValue"></WageMonths>
    </div>
    <!--每月测算 end-->

    <!--当月测算 start-->
    <div v-show="active==1">
      <WageCurrentMonth :threshold="thresholdValue"></WageCurrentMonth>
    </div>
    <!--当月测算 end-->
  </div>
</template>
<script>
  import splTab from '../../../components/common/spl-tab'
  import WageMonths from './wageMonths'
  import WageCurrentMonth from './wageCurrentMonth'
  export default {
    components: {splTab, WageMonths, WageCurrentMonth},
    props: ['threshold'],
    data () {
      return {
        active: 0,
        thresholdValue: '',
        calTypes: ['每月测算', '当月测算'],
      }
    },
    computed: {},
    created () {
      this.thresholdValue = this.threshold
    },
    watch: {
      threshold(value) {
        this.thresholdValue = value
      }
    },
    mounted () {
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
</style>
