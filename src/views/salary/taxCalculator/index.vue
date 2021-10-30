<template>
  <div class="spl-container">
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="taxCalculator-container">

      <el-row class="tax-type-but-group mb-20">
        <el-radio-group v-model="taxTypeValue">
          <el-radio-button v-for="(item,index) in taxTypes" :key="item.type" :label="item.type">{{item.text}}
          </el-radio-button>
        </el-radio-group>
      </el-row>

      <el-row v-show="taxTypeValue==='1'">
        <WageCalulator :threshold="threshold"></WageCalulator>
      </el-row>

      <el-row v-show="taxTypeValue==='2'">
        <RemunerationForServices></RemunerationForServices>
      </el-row>

      <el-row v-show="taxTypeValue==='3'">
        <YearEndBonus></YearEndBonus>
      </el-row>
    </div>
  </div>
</template>
<script>
  import WageCalulator from './wageCalulator'
  import RemunerationForServices from './remunerationForServices'
  import YearEndBonus from './yearEndBonus'

  export default {
    components: {WageCalulator, RemunerationForServices, YearEndBonus},
    data() {
      return {
        // 导航
        pathData: [
          {name: '薪酬管理'},
          {name: '个税计算器'}
        ],
        taxTypes: [
          {type: '1', text: '工资薪金'},
          {type: '2', text: '劳务报酬所得'},
          {type: '3', text: '年终奖'}
        ],
        taxTypeValue: '1',
        threshold: 5000//起征点
      }
    },
    created() {
      this.$nextTick(() => {
        this.getThreshold()
      })
    },
    filters: {},
    computed: {},
    watch: {},
    methods: {
      /*获取个税起征点*/
      getThreshold() {
        this.$http({
          url: '/api/salary/salaryComputer/salaryTaxThreshold',
          method: 'post',
          data: {}
        }).then(({data}) => {
          this.threshold = data
        }).catch((data) => {

        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .taxCalculator-container {
    padding: 20px 0px 40px 0px;
  }

  .tax-type-but-group {
    text-align: center;
    /deep/ .el-radio-button {
      margin: 0px 85px;
      .el-radio-button__inner {
        width: 100%;
        border: none;
        border-radius: 0px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #303133;
        padding-left: 0px;
        padding-right: 0px;
        border-bottom: 4px solid #ffffff;
      }
      .el-radio-button__inner:hover {
        color: #409EFF;
      }
    }

    /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      -webkit-box-shadow: none;
      box-shadow: none;
      background-color: #ffffff;
      color: #409EFF;
      font-weight: bold;
      border-bottom: 4px solid #409EFF;
    }
  }

</style>
