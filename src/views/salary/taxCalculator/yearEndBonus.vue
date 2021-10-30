<template>
  <div>
    <el-card class="box-card mt-20 ml-30 mr-30">
      <div slot="header" class="clearfix">
        <span class="card-title pl-5">全年一次性奖金</span>
        <el-divider></el-divider>
      </div>
      <div class="text item">
        <el-form :model="yearEndBonusData" ref="yearEndBonusData">
          <el-row :gutter="20">
            <el-col class="" :span="12">
              <el-form-item label="年终奖金额：" prop="amount" :rules="[{ required: true, message: '请输入年终奖金额'}]">
                <template slot="label">
                  <span class="required-pre">年终奖金额:</span>
                </template>
                <el-input type="number" min="0" clearable placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('amount')"
                          v-model.trim="yearEndBonusData.amount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="every-month-but-group">
          <el-button class="mr-20 w-100" type="primary" size="small" @click="goToYearEndCalculation">开始计算</el-button>
          <el-button type="text" @click="seeYearEndCalRule">查看计算规则<i class="ml-5 el-icon-d-arrow-right"></i></el-button>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card mt-20 ml-30 mr-30">
      <div slot="header" class="clearfix">
        <span class="card-title pl-5">计算结果</span>
        <el-divider></el-divider>
      </div>
      <div class="text item">
        <el-form :model="calYearEndResult" ref="calYearEndResult">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="应纳税所得额：">
                <template slot="label">
                  <span class="required-pre">应纳税所得额:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calYearEndResult.taxableIncome)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税率：">
                <template slot="label">
                  <span class="required-pre">税率:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="calYearEndResult.taxRateStr">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="每月平均费用：">
                <template slot="label">
                  <span class="required-pre">每月平均费用:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calYearEndResult.monthAverageAmount)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="速算扣除数：">
                <template slot="label">
                  <span class="required-pre">速算扣除数:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calYearEndResult.quickNumber)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="应纳税额：">
                <template slot="label">
                  <span class="required-pre">应纳税额:</span>
                </template>
                <el-input readonly class="el-form-item-target blue-color"
                          :value="$global.milliFormat(calYearEndResult.taxPayable)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税后收入：">
                <template slot="label">
                  <span class="required-pre">税后收入:</span>
                </template>
                <el-input readonly class="el-form-item-target blue-color"
                          :value="$global.milliFormat(calYearEndResult.afterTaxIncome)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <el-drawer :modal="false" :visible.sync="yearEndDrawer" :wrapperClosable="false" custom-class="drawer-style">
      <template slot="title">
        <p class="drawer-title">年终奖</p>
      </template>
      <div>
        <el-card class="box-card drawer-card mt-20 mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">年终奖个税计算规则</span>
          </div>
          <div class="text item">
            <p class="msg-info">全年一次性奖金，平均到全年12个月取得每月平均费用，根据每月平均费用取得对应税率与速算扣除数计算税额。</p>
            <p class="msg-info">应纳税所得额 = 年终奖金额 ， 每月平均费用 = 应纳税所得额 / 12</p>
            <p class="msg-info">应纳税额 = 应纳税所得额 * 税率 - 速算扣除数</p>
            <p class="msg-info">税后年终奖 = 年终奖金额 - 应纳税额</p>
            <p class="msg-info red-color" v-if="resultFlag">详细计算过程：</p>
            <p class="msg-info" v-if="resultFlag">应纳税所得额 = {{$global.milliFormat(yearEndBonusDataCopy.amount)}}， 每月平均费用 = {{$global.milliFormat(yearEndBonusDataCopy.amount)}} / 12 = {{$global.milliFormat(calYearEndResult.monthAverageAmount)}} </p>
            <p class="msg-info" v-if="resultFlag">应纳税额 = {{$global.milliFormat(yearEndBonusDataCopy.amount)}} * {{calYearEndResult.taxRateStr + '%'}} - {{$global.milliFormat(calYearEndResult.quickNumber)}} = {{$global.milliFormat(calYearEndResult.taxPayable)}}</p>
            <p class="msg-info" v-if="resultFlag">税后收入 = {{$global.milliFormat(yearEndBonusDataCopy.amount)}} - {{$global.milliFormat(calYearEndResult.taxPayable)}} = {{$global.milliFormat(calYearEndResult.afterTaxIncome)}}</p>
          </div>
        </el-card>

        <el-card class="box-card drawer-card mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">{{currentYear}}年年终奖个人所得税税率表</span>
          </div>
          <div class="text item">
            <div class="taxRatesTableContent">
              <span class="msg-info">（全年一次性奖金适用）</span>
              <table class="taxRatesTable mt-10">
                <thead>
                <tr style="background: #DDDDDD">
                  <th>级数</th>
                  <th>每月平均费用</th>
                  <th>税率</th>
                  <th>速算扣除数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in yearEndTaxRates" :style="index%2==1?'background: #F8F8F8':''">
                  <td>{{item.seriesNumber}}</td>
                  <td>{{item.income}}</td>
                  <td>{{item.taxRate}}</td>
                  <td>{{item.deduction}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  export default {
    components: {},
    props: [],
    data () {
      return {
        resultFlag: false,
        isLoading: false,
        currentYear: this.$moment(new Date()).format("YYYY"),
        yearEndBonusData: {
          amount: ''
        },
        yearEndBonusDataCopy: {
          amount: ''
        },
        calYearEndResult: {
          monthAverageAmount: '', // 每月平均费用
          taxRate: '', //税率
          taxRateStr: '',
          taxableIncome: '', // 应纳税所得额
          quickNumber: '', // 速算扣除数
          taxPayable: '', // 应纳税额
          afterTaxIncome: '' // 税后收入
        },
        yearEndDrawer: false,
        yearEndTaxRates: [
          {seriesNumber: 1, income: '不超过3,000元的部分', taxRate: '3%', deduction: '0'},
          {seriesNumber: 2, income: '超过3,000元至12,000的部分', taxRate: '10%', deduction: '210'},
          {seriesNumber: 3, income: '超过12,000元至25,000的部分', taxRate: '20%', deduction: '1,410'},
          {seriesNumber: 4, income: '超过25,000元至35,000的部分', taxRate: '25%', deduction: '2,660'},
          {seriesNumber: 5, income: '超过35,000元至55,000的部分', taxRate: '30%', deduction: '4,410'},
          {seriesNumber: 6, income: '超过55,000元至80,000的部分', taxRate: '35%', deduction: '7,160'},
          {seriesNumber: 7, income: '超过80,000元的部分', taxRate: '45%', deduction: '15,160'}
        ]
      }
    },
    computed: {},
    created () {
    },
    watch: {
    },
    mounted () {
    },
    methods: {
      goToYearEndCalculation() {
        this.$refs.yearEndBonusData.validate((valid) => {
          if (valid) {
            this.isLoading = true
            this.$http({
              url: '/api/tax/calculatorBonus?amount=' + this.yearEndBonusData.amount,
              method: 'post',
              data: {}
            }).then(({data}) => {
              this.yearEndBonusDataCopy = this.$global.deepcopyArray([this.yearEndBonusData])[0]
              this.isLoading = false
              if (!this.resultFlag) {
                this.resultFlag = true
              }
              this.calYearEndResult = data.data[0]
            }).catch((data) => {
              this.isLoading = false
            })
          }
        })
      },
      seeYearEndCalRule() {
        this.yearEndDrawer = true
      },
      amountChange(code) {
        var value = this.yearEndBonusData[code]
        if (this.$global.isNotBlank(value)) {
          if (parseFloat(value) < 0) {
            this.yearEndBonusData[code] = ''
          } else {
            this.yearEndBonusData[code] = this.$global.preserveDecimal(value, 2)
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/css/taxCalculator/index.less';
</style>
