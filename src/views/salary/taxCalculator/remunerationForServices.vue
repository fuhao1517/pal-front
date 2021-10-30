<template>
  <div>
    <el-card class="box-card mt-20 ml-30 mr-30">
      <div slot="header" class="clearfix">
        <span class="card-title pl-5">劳务报酬所得</span>
        <el-divider></el-divider>
      </div>
      <div class="text item">
        <el-form :model="remunerationData" ref="remunerationData">
          <el-row :gutter="20">
            <el-col class="" :span="12">
              <el-form-item label="劳务报酬：" prop="amount" :rules="[{ required: true, message: '请输入劳务报酬'}]">
                <template slot="label">
                  <span class="required-pre">劳务报酬:</span>
                </template>
                <el-input type="number" min="0" clearable placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('amount')"
                          v-model.trim="remunerationData.amount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="every-month-but-group">
          <el-button class="mr-20 w-100" type="primary" size="small" @click="goToServiceCalculation" :loading="isLoading">开始计算</el-button>
          <el-button type="text" @click="seeServiceCalRule">查看计算规则<i class="ml-5 el-icon-d-arrow-right"></i></el-button>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card mt-20 ml-30 mr-30">
      <div slot="header" class="clearfix">
        <span class="card-title pl-5">计算结果</span>
        <el-divider></el-divider>
      </div>
      <div class="text item">
        <el-form :model="calServiceResult" ref="calServiceResult">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="扣除费用：">
                <template slot="label">
                  <span class="required-pre">扣除费用:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calServiceResult.deductAmount)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税率：">
                <template slot="label">
                  <span class="required-pre">税率:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          v-model.trim="calServiceResult.taxRateStr">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="应纳税所得额：">
                <template slot="label">
                  <span class="required-pre">应纳税所得额:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calServiceResult.taxableIncome)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="速算扣除数：">
                <template slot="label">
                  <span class="required-pre">速算扣除数:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calServiceResult.quickNumber)"></el-input>
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
                          :value="$global.milliFormat(calServiceResult.taxPayable)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税后收入：">
                <template slot="label">
                  <span class="required-pre">税后收入:</span>
                </template>
                <el-input readonly class="el-form-item-target blue-color"
                          :value="$global.milliFormat(calServiceResult.afterTaxIncome)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <el-drawer :modal="false" :visible.sync="serviceDrawer" :wrapperClosable="false" custom-class="drawer-style">
      <template slot="title">
        <p class="drawer-title">劳务报酬所得</p>
      </template>
      <div>
        <el-card class="box-card drawer-card mt-20 mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">劳务报酬所得</span>
          </div>
          <div class="text item">
            <p class="msg-info">劳务报酬所得，是指个人独立从事各种非雇佣的各种劳务所取得的所得。</p>
          </div>
        </el-card>

        <el-card class="box-card drawer-card mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">劳务报酬个税计算规则</span>
          </div>
          <div class="text item">
            <p class="msg-info">本次劳务报酬所得不足4,000.00元，扣除费用为800.00元；本次劳务报酬所得超过4,000.00元，扣除费用为劳务报酬所得的20%</p>
            <p class="msg-info">应纳税所得额 = 本次劳务报酬所得 - 扣除费用</p>
            <p class="msg-info">应纳税额 = 应纳税所得额 * 税率 - 速算扣除数</p>
            <p class="msg-info">税后收入 = 本次劳务报酬所得 - 应纳税额</p>
            <p class="msg-info red-color" v-if="resultFlag">详细计算过程：</p>
            <p class="msg-info" v-if="resultFlag">应纳税所得额 = {{$global.milliFormat(remunerationDataCopy.amount)}} - {{floatValue(remunerationDataCopy.amount)>4000?($global.milliFormat(remunerationDataCopy.amount) + ' * 20%'):(floatValue(remunerationDataCopy.amount)<800?remunerationDataCopy.amount:'800.00')}} = {{$global.milliFormat(calServiceResult.taxableIncome)}}</p>
            <p class="msg-info" v-if="resultFlag">应纳税额 = {{$global.milliFormat(calServiceResult.taxableIncome)}} * {{calServiceResult.taxRateStr + '%'}} - {{$global.milliFormat(calServiceResult.quickNumber)}} = {{$global.milliFormat(calServiceResult.taxPayable)}}</p>
            <p class="msg-info" v-if="resultFlag">税后收入 = {{$global.milliFormat(remunerationDataCopy.amount)}} - {{$global.milliFormat(calServiceResult.taxPayable)}} = {{$global.milliFormat(calServiceResult.afterTaxIncome)}}</p>
          </div>
        </el-card>

        <el-card class="box-card drawer-card mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">{{currentYear}}年劳务报酬个人所得税税率表</span>
          </div>
          <div class="text item">
            <div class="taxRatesTableContent">
              <span class="msg-info">（劳务报酬所得适用）</span>
              <table class="taxRatesTable mt-10">
                <thead>
                <tr style="background: #DDDDDD">
                  <th>级数</th>
                  <th>应纳税所得额</th>
                  <th>税率</th>
                  <th>速算扣除数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in serviceTaxRates" :style="index%2==1?'background: #F8F8F8':''">
                  <td>{{item.seriesNumber}}</td>
                  <td>{{item.income}}</td>
                  <td>{{item.taxRate}}</td>
                  <td>{{item.deductAmount}}</td>
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
        remunerationData: {
          amount: ''
        },
        remunerationDataCopy: {
          amount: ''
        },
        calServiceResult: {
          deductAmount: '', // 扣除费用
          taxRate: '', //税率
          taxRateStr: '',
          taxableIncome: '', // 应纳税所得额
          quickNumber: '', // 速算扣除数
          taxPayable: '', // 应纳税额
          afterTaxIncome: '' // 税后收入
        },
        serviceDrawer: false,
        serviceTaxRates: [
          {seriesNumber: 1, income: '不超过20,000元的部分', taxRate: '20%', deductAmount: '0'},
          {seriesNumber: 2, income: '超过20,000元至50,000的部分', taxRate: '30%', deductAmount: '2,000'},
          {seriesNumber: 3, income: '超过50,000元的部分', taxRate: '40%', deductAmount: '7,000'}
        ]
      }
    },
    computed: {},
    created () {
    },
    watch: {},
    mounted () {
    },
    methods: {
      goToServiceCalculation() {
        this.$refs.remunerationData.validate((valid) => {
          if (valid) {
            this.isLoading = true
            this.$http({
              url: '/api/tax/calculatorLabor?amount=' + this.remunerationData.amount,
              method: 'post',
              data: {}
            }).then(({data}) => {
              this.remunerationDataCopy = this.$global.deepcopyArray([this.remunerationData])[0]
              this.isLoading = false
              if (!this.resultFlag) {
                this.resultFlag = true
              }
              this.calServiceResult = data.data[0]
            }).catch((data) => {
              this.isLoading = false
            })
          }
        })
      },
      seeServiceCalRule() {
        this.serviceDrawer = true
      },
      floatValue(val) {
          return parseFloat(val)
      },
      amountChange(code) {
        var value = this.remunerationData[code]
        if (this.$global.isNotBlank(value)) {
          if (parseFloat(value) < 0) {
            this.remunerationData[code] = ''
          } else {
            this.remunerationData[code] = this.$global.preserveDecimal(value, 2)
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/css/taxCalculator/index.less';
</style>
