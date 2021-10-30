<template>
  <div class="content spl-container">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div v-if="Object.keys(ruleData).length!==0">
      <div class="rule-top">
        <div class="title mb-20">
          <h4 class="ml-10">薪酬规则</h4>
        </div>
        <el-form class="demo-form-inline ml-40">
          <el-row :gutter="124">
            <el-col :span="8">
              <p>社保扣除模式</p>
              <el-form-item>
                <p class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;" v-if="ruleData.socialDeductionMode=='DEDUCTION_SAME_MONTH'">当月工资扣除当月社保</p>
                <p class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;" v-if="ruleData.socialDeductionMode=='DEDUCTION_NEXT_MONTH'">当月工资扣除下月社保</p>
                <p class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;" v-if="Object.keys(ruleData).length===0">无数据</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <p>公积金扣除模式</p>
              <el-form-item>
                <p class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;" v-if="ruleData.accfundDeductionMode=='DEDUCTION_SAME_MONTH'">当月工资扣除当月公积金</p>
                <p class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;" v-if="ruleData.accfundDeductionMode=='DEDUCTION_NEXT_MONTH'">当月工资扣除下月公积金</p>
                <p class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;" v-if="Object.keys(ruleData).length===0">无数据</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <p>社保取值来源</p>
              <el-form-item>
                <p v-if="Object.keys(ruleData).length!==0" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">{{ruleData.socialValueSource}}</p>
                <p v-if="Object.keys(ruleData).length===0" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">无数据</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="124">
            <el-col :span="8">
              <p>公积金取值来源</p>
              <el-form-item>
                <p v-if="Object.keys(ruleData).length!==0" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">{{ruleData.accfundValueSource}}</p>
                <p v-if="Object.keys(ruleData).length===0" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">无数据</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <p>薪酬发放模式</p>
              <el-form-item>
                <p v-if="ruleData.salaryPaymentModel=='001'" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">发当月</p>
                <p v-if="ruleData.salaryPaymentModel=='002'" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">发上月</p>
                <p v-if="Object.keys(ruleData).length===0" class="pl-10 mt-5" style="height:32px; line-height:32px; border:1px solid #ddd; border-radius:3px;">无数据</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="rule-center">
        <div class="title mb-20">
          <h4 class="ml-10">薪酬公式组成项</h4>
        </div>
        <p class="should">
          <img class="ml-20 mr-10" src="../../assets/images/icons/ic-account-type37.png" alt="">
          <span v-if="Object.keys(ruleData).length!==0">应发工资 = <span v-for="(item,index) in ruleData.plannedFormula" :key="index">&nbsp;<span v-if="index!==0">{{item.salaryItemOperator}}&nbsp;</span>{{item.salaryItemName}}</span></span>
          <span v-if="Object.keys(ruleData).length===0">应发工资 = 无数据</span>
        </p>
        <p class="actual mb-30">
          <img class="ml-20 mr-10" src="../../assets/images/icons/ic-account-type38.png" alt="">
          <span v-if="Object.keys(ruleData).length!==0">实发工资 = <span v-for="(item,index) in ruleData.actualFormula" :key="index">&nbsp;<span v-if="index!==0">{{item.salaryItemOperator}}&nbsp;</span>{{item.salaryItemName}}</span></span>
          <span v-if="Object.keys(ruleData).length===0">实发工资 = 无数据</span>
        </p>
      </div>
      <div class="rule-bottom">
        <div class="title mb-20 clearfix">
          <h4 class="fl ml-10 mr-20">薪酬附加展示项</h4>
          <span class="fl">(不参与算薪，工资单中补充展示项）</span>
        </div>
        <div class="subjoin">
          <div v-show="Object.keys(ruleData).length!==0" class="subjoin-item fl mr-10 mb-10" v-for="(item,index) in ruleData.additionalSalaryFormula" :key="index">{{item.salaryItemName}}</div>
          <div v-if="Object.keys(ruleData).length===0">无数据</div>
        </div>
      </div>
    </div>
    <div v-else class="empty-box">
      <img src="../../assets/images/empty.png" alt="">
      <p class="info">暂无数据信息</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pathData: [{ name: '薪酬管理' }, { name: '薪酬规则查询' }],
      ruleData: {}
    }
  },
  mounted () {
    this.getRuleSearch()
  },
  methods: {
    getRuleSearch () {
      this.$http({
        url: '/api/salary/getSalaryProduct',
        method: 'post',
        data: {}
      }).then(({ data }) => {
        data.data[0] === null ? this.ruleData = {} : this.ruleData = data.data[0]
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    .rule-top,.rule-center,.rule-bottom{
      padding: 0 20px;
      .title{
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #CECECE;
        h4{
        font-size: 16px;
        font-weight: bold;
        }
      }
    }
    .rule-center{
      border-top: 20px solid #eaedf1;
      border-bottom: 20px solid #eaedf1;
      .should{
        margin: 28px 0 36px 0;
      }
    }
    .rule-bottom{
      .subjoin{
        padding: 20px 0px 30px 22px;
        .subjoin-item{
          min-width: 95px;
          height: 36px;
          padding: 0 5px;
          line-height: 36px;
          text-align: center;
          background: #F8F8F8;
          border: 1px solid #CECECE;
        }
      }
    }
    .empty-box{
      width: 100%;
      height: 376px;
      text-align: center;
      padding-top: 250px;
      .info{
        margin-top: 30px;
        font-size: 14px;
        color: #C3C3C3;
      }
    }
  }
  /deep/.el-form-item__content{
    margin-left: 0 !important;
  }
  .el-select{
    width: 426px;
  }
</style>
