<template>
  <div>
    <!--当月测算 start-->
    <el-card class="box-card mt-20 ml-30 mr-30">
      <div slot="header" class="clearfix">
        <span class="card-title pl-5">本月薪资数据</span>
        <el-divider></el-divider>
      </div>
      <div class="text item">
        <el-form :model="currentSalaryData" ref="currentSalaryData">
          <el-row :gutter="20">
            <el-col class="" :span="12">
              <el-form-item label="本年度本单位在职月数：" prop="totalMonth"
                            :rules="[{ required: true, message: '请选择本年度本单位在职月数'}]">
                <template slot="label">
                  <span class="required-pre">本年度本单位在职月数:</span>
                </template>
                <el-select v-model="currentSalaryData.totalMonth" placeholder="请选择" class="el-form-item-target">
                  <el-option
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">-->
            <!--</el-col>-->
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="本月税前收入：" prop="amountBeforeTax"
                            :rules="[{ required: true, message: '请输入本月税前收入'},{ validator: checkAmount, trigger:'blur'}]">
                <template slot="label">
                  <span class="required-pre">本月税前收入:</span>
                </template>
                <el-input type="number" min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('amountBeforeTax')"
                          v-model.trim="currentSalaryData.amountBeforeTax"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="累计税前收入：" prop="totalAmountBeforeTax"
                            :rules="[{ required: true, message: '请输入累计税前收入'},{ validator: checkAmount, trigger:'blur'}]">
                <template slot="label">
                  <span class="required-pre">累计税前收入:</span>
                </template>
                <el-input type="number" min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('totalAmountBeforeTax')"
                          v-model.trim="currentSalaryData.totalAmountBeforeTax"></el-input>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="本月五险一金扣除：" prop="socialFundElderlyDeduction"
                            :rules="[{ required: true, message: '请输入本月五险一金扣除'},{ validator: checkAmount, trigger:'blur'}]">
                <template slot="label">
                  <span class="required-pre">本月五险一金扣除:</span>
                </template>
                <el-input type="number" min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('socialFundElderlyDeduction')"
                          v-model.trim="currentSalaryData.socialFundElderlyDeduction"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="累计五险一金扣除：" prop="totalSocialFundElderlyDeduction"
                            :rules="[{ required: true, message: '请输入累计五险一金扣除'},{ validator: checkAmount, trigger:'blur'}]">
                <template slot="label">
                  <span class="required-pre">累计五险一金扣除:</span>
                </template>
                <el-input type="number" min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('totalSocialFundElderlyDeduction')"
                          v-model.trim="currentSalaryData.totalSocialFundElderlyDeduction"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="本月专项附加扣除：" prop="extralElderlyDeduction"
                            :rules="[{ required: true, message: '请输入本月专项附加扣除'},{ validator: checkAmount, trigger:'blur'}]">
                <template slot="label">
                  <span class="required-pre">本月专项附加扣除:</span>
                </template>
                <el-input type="number" min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('extralElderlyDeduction')"
                          v-model.trim="currentSalaryData.extralElderlyDeduction"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计专项附加扣除：" prop="totalExtralElderlyDeduction"
                            :rules="[{ required: true, message: '请输入累计专项附加扣除'},{ validator: checkAmount, trigger:'blur'}]">
                <template slot="label">
                  <span class="required-pre">累计专项附加扣除:</span>
                </template>
                <el-input type="number" min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('totalExtralElderlyDeduction')"
                          v-model.trim="currentSalaryData.totalExtralElderlyDeduction"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="本月减除费用：" prop="taxThreshold"
                            :rules="[{ required: true, message: '请输入本月减除费用'}]">
                <template slot="label">
                  <span class="required-pre">本月减除费用:</span>
                </template>
                <el-input type="number" readonly min="0" placeholder="请输入" class="el-form-item-target"
                          @change="amountChange('taxThreshold')"
                          v-model.trim="currentSalaryData.taxThreshold"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计减除费用：" prop="totalTaxThreshold"
                            :rules="[{ required: true, message: '请输入累计减除费用'}]">
                <template slot="label">
                  <span class="required-pre">累计减除费用:</span>
                </template>
                <el-input type="number" readonly min="0" class="el-form-item-target"
                          @change="amountChange('totalTaxThreshold')"
                          v-model.trim="currentSalaryData.totalTaxThreshold"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="every-month-but-group">
          <el-button class="mr-20 w-100" size="small" @click="resetForm">重置</el-button>
          <el-button class="mr-20 w-100" type="primary" size="small" @click="goToCalculation" :loading="isLoading">
            开始计算
          </el-button>
          <el-button type="text" @click="seeCurrentCalRule">查看计算规则<i class="ml-5 el-icon-d-arrow-right"></i></el-button>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card mt-20 ml-30 mr-30">
      <div slot="header" class="clearfix">
        <span class="card-title pl-5">计算结果</span>
        <el-divider></el-divider>
      </div>
      <div class="text item">
        <el-form :model="calResult" ref="calResult">
          <el-row :gutter="20">
            <el-col class="" :span="12">
              <el-form-item label="累计应纳税所得额：">
                <template slot="label">
                  <span class="required-pre">累计应纳税所得额:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calResult.totalPayTaxAmount)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="税率：">
                <template slot="label">
                  <span class="required-pre">税率:</span>
                </template>
                <el-input readonly class="el-form-item-target" v-model.trim="calResult.taxRate">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="历史已预缴税额：">
                <template slot="label">
                  <span class="required-pre">历史已预缴税额:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calResult.historyTaxAmount)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="速算扣除数：">
                <template slot="label">
                  <span class="required-pre">速算扣除数:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calResult.quickNumber)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本月应缴纳额：">
                <template slot="label">
                  <span class="required-pre">本月应缴纳额:</span>
                </template>
                <el-input readonly class="el-form-item-target blue-color" :value="$global.milliFormat(calResult.monthTax)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="累计应纳税额：">
                <template slot="label">
                  <span class="required-pre">累计应纳税额:</span>
                </template>
                <el-input readonly class="el-form-item-target"
                          :value="$global.milliFormat(calResult.receivableTaxAmount)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本月税后收入：">
                <template slot="label">
                  <span class="required-pre">本月税后收入:</span>
                </template>
                <el-input readonly class="el-form-item-target blue-color"
                          :value="$global.milliFormat(calResult.amountAfterTax)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <!--当月测算 end-->

    <el-drawer title="工资薪金-单月测算" :modal="false" :visible.sync="currentDrawer" :wrapperClosable="false"
               custom-class="drawer-style">
      <template slot="title">
        <p class="drawer-title">工资薪金-当月测算</p>
      </template>
      <div>
        <el-card class="box-card drawer-card mt-20 mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">工资薪金收入个税</span>
          </div>
          <div class="text item">
            <p class="msg-info">工资、薪金所得，是指个人因任职或受雇而取得的工资，薪金，奖金，年中加薪，劳动分红，津贴，补贴以及与任职或受雇有关的其他所得。</p>
          </div>
        </el-card>

        <el-card class="box-card drawer-card mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">工资个税预扣预缴计算公式</span>
          </div>
          <div class="text item">
            <p class="msg-info red-color">采用全年累计计税法：</p>
            <p class="msg-info">当月应纳税额 = 累计应纳税所得额 * 税率 - 速算扣除数 - 累计已缴纳税额</p>
            <p class="msg-info">累计应纳税所得额 = 累计税前收入 - 累计五险一金 - 累计专项附加扣除 - 累计减除费用</p>
            <p class="msg-info">累计应纳税额 = 累计应纳税所得额 * 税率 - 速算扣除数</p>
            <p class="msg-info">当月应纳税额 = 累计应纳税额 - 累计已缴纳税额</p>
            <p class="msg-info">累计减除费用 = 当年任职受雇月份数 * {{$global.milliFormat(thresholdValue)}}</p>
            <p class="msg-info">其中，当年任职受雇月份数指纳税个人当年截止本月(含本月)在本单位任职受雇的月数</p>
            <p class="msg-info red-color" v-if="resultFlag">详细计算过程：</p>
            <p class="msg-info" v-if="resultFlag">
              累计应纳税所得额 = {{$global.milliFormat(currentSalaryDataCopy.totalAmountBeforeTax)}} - {{$global.milliFormat(currentSalaryDataCopy.totalSocialFundElderlyDeduction)}} - {{$global.milliFormat(currentSalaryDataCopy.totalExtralElderlyDeduction)}} - {{$global.milliFormat(currentSalaryDataCopy.totalTaxThreshold)}}  = {{$global.milliFormat(calResult.totalPayTaxAmount)}}</p>
            <p class="msg-info" v-if="resultFlag">
              累计应纳税额 = {{$global.milliFormat(calResult.totalPayTaxAmount)}} * {{calResult.taxRate + '%'}} - {{$global.milliFormat(calResult.quickNumber)}} = {{$global.milliFormat(calResult.receivableTaxAmount)}}</p>
            <p class="msg-info" v-if="resultFlag">
              当月应纳税额 = {{$global.milliFormat(calResult.receivableTaxAmount)}} - {{$global.milliFormat(calResult.historyTaxAmount)}} = {{$global.milliFormat(calResult.monthTax)}}</p>
          </div>
        </el-card>

        <el-card class="box-card drawer-card mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">{{currentYear}}年个人所得税税率表</span>
          </div>
          <div class="text item">
            <div class="taxRatesTableContent">
              <span class="msg-info">（居民个人工资，薪金所得预扣预缴适用）</span>
              <table class="taxRatesTable mt-10">
                <thead>
                <tr style="background: #DDDDDD">
                  <th>级数</th>
                  <th>累计预扣预缴应纳税所得额</th>
                  <th>预扣税率</th>
                  <th>速算扣除数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in taxRates" :style="index%2==1?'background: #F8F8F8':''">
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

        <el-card class="box-card drawer-card mb-20 ml-20 mr-20">
          <div slot="header" class="clearfix">
            <span class="card-title">案例说明</span>
          </div>
          <div class="text item">
            <p class="msg-info">公司员工张三：{{currentYear}}年度，1月份税前工资15000元；2月份税前工资45,000元；3月份税前工资15,000元。有一个正在读书的儿子，子女教育每月扣除1,000元；首套住房贷款利息支出</p>
            <p class="msg-info">每月1,000元；父母健在，且是独生子女，赡养老人支出每月可以扣除2,000元。五险一金每月缴纳个人部分3,000元。每月支出商业保险200元。</p>
            <p class="msg-info">{{currentYear}}年1月：</p>
            <p class="msg-info">
              应纳税所得额 = 15,000 - 5,000（累计减除费用） - 3,000（累计专项扣除） - 4,000（累计专项附加扣除） - 200（累计依法确定的其他扣除） = 2,800元</p>
            <p class="msg-info">应纳税额 = 累计应纳税额 = 2,800 * 3% = 84元</p>
            <p class="msg-info">{{currentYear}}年2月：</p>
            <p class="msg-info">
              应纳税所得额 = 60,000（累计收入） - 10000（累计减除费用） - 6000（累计专项扣除） - 8000（累计专项附加扣除） - 400（累计依法确定的其他扣除）= 35,600元</p>
            <p class="msg-info">应纳税额 = 累计应纳税额 - 累计已缴纳税额 = 35,600 * 3% - 84 = 1,068 - 84（已预缴预扣税额） = 984元</p>
            <p class="msg-info">{{currentYear}}年3月：</p>
            <p class="msg-info">
              应纳税所得额=75,000（累计收入） - 15,000（累计基本减除费用） - 9,000（累计专项扣除） - 12,000（累计专项附加扣除） - 600（累计依法确定的其他扣除） = 38,400元</p>
            <p class="msg-info">应纳税额 = 累计应纳税额 - 累计已缴纳税额 = （38,400 * 10% - 2,520） - 1,068 = 252元</p>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  export default {
    components: {},
    props: ['threshold'],
    data () {
      return {
        isLoading: false,
        resultFlag: false,
        thresholdValue: null,
        currentYear: this.$moment(new Date()).format("YYYY"),
        months: [
          {value: 1, label: '1'},
          {value: 2, label: '2'},
          {value: 3, label: '3'},
          {value: 4, label: '4'},
          {value: 5, label: '5'},
          {value: 6, label: '6'},
          {value: 7, label: '7'},
          {value: 8, label: '8'},
          {value: 9, label: '9'},
          {value: 10, label: '10'},
          {value: 11, label: '11'},
          {value: 12, label: '12'}
        ],
        currentSalaryData: {
          totalMonth: '',
          amountBeforeTax: '',//本月税前收入
          totalAmountBeforeTax: '',//累计税前收入
          socialFundElderlyDeduction: '',//本月五险一金扣除
          totalSocialFundElderlyDeduction: '', // 累计五险一金扣除
          extralElderlyDeduction: '',//本月专项附加扣除
          totalExtralElderlyDeduction: '',//累计专项附加扣除
          taxThreshold: '', // 本月减除费用
          totalTaxThreshold: '' //累计减除费用
        },
        currentSalaryDataCopy: {
          totalMonth: '',
          amountBeforeTax: '',//本月税前收入
          totalAmountBeforeTax: '',//累计税前收入
          socialFundElderlyDeduction: '',//本月五险一金扣除
          totalSocialFundElderlyDeduction: '', // 累计五险一金扣除
          extralElderlyDeduction: '',//本月专项附加扣除
          totalExtralElderlyDeduction: '',//累计专项附加扣除
          taxThreshold: '', // 本月减除费用
          totalTaxThreshold: '' //累计减除费用
        },
        calResult: {
          totalPayTaxAmount: '',//累计应纳税所得额
          taxRate: '', //税率
          historyTaxAmount: '', //历史已预缴税额
          quickNumber: '', // 速算扣除数
          monthTax: '', // 本月应纳税额
          receivableTaxAmount: '', // 累计应纳税额
          amountAfterTax: '' //本月税后收入
        },
        currentDrawer: false,
        taxRates: [
          {seriesNumber: 1, income: '不超过36,000元的部分', taxRate: '3%', deduction: '0'},
          {seriesNumber: 2, income: '超过36,000元至144,000的部分', taxRate: '10%', deduction: '2,520'},
          {seriesNumber: 3, income: '超过144,000元至300,000的部分', taxRate: '20%', deduction: '16,920'},
          {seriesNumber: 4, income: '超过300,000元至420,000的部分', taxRate: '25%', deduction: '31,920'},
          {seriesNumber: 5, income: '超过420,000元至660,000的部分', taxRate: '30%', deduction: '52,920'},
          {seriesNumber: 6, income: '超过660,000元至960,000的部分', taxRate: '35%', deduction: '85,920'},
          {seriesNumber: 7, income: '超过960,000元的部分', taxRate: '45%', deduction: '181,920'},
        ]
      }
    },
    computed: {},
    created () {
      this.currentSalaryData.taxThreshold = this.$global.preserveDecimal(this.threshold, 2)
      this.currentSalaryDataCopy.taxThreshold = this.$global.preserveDecimal(this.threshold, 2)
      this.thresholdValue = this.threshold
    },
    watch: {
      'currentSalaryData.totalMonth': function (newVal, oldVal) {
        if (this.$global.isNotBlank(newVal)) {
          this.currentSalaryData.totalTaxThreshold = this.$global.preserveDecimal(this.thresholdValue * newVal, 2)
        }
      },
      threshold(val) {
        this.currentSalaryData.taxThreshold = this.$global.preserveDecimal(val, 2)
        this.currentSalaryDataCopy.taxThreshold = this.$global.preserveDecimal(val, 2)
        this.thresholdValue = val
      }
    },
    mounted () {
    },
    methods: {
      goToCalculation() {
        this.$refs.currentSalaryData.validate((valid) => {
          if (valid) {
            this.isLoading = true
            this.$http({
              url: '/api/salary/salaryComputer/salaryOneMonthComputer',
              method: 'post',
              data: this.currentSalaryData
            }).then(({data}) => {
              this.currentSalaryDataCopy = this.$global.deepcopyArray([this.currentSalaryData])[0]
              this.isLoading = false
              if (!this.resultFlag) {
                this.resultFlag = true
              }
              this.calResult = data.data[0]
            }).catch((data) => {
              this.isLoading = false
            })
          }
        })
      },
      numericalAdd(number1, number2) {
        return parseFloat(number1) + parseFloat(number2);
      },
      biggerThan(number1, number2) {
        return parseFloat(number1) > parseFloat(number2)
      },
      lessThan (number1, number2) {
        return parseFloat(number1) < parseFloat(number2)
      },
      resetForm () {
        this.$refs.currentSalaryData.resetFields();
      },
      seeCurrentCalRule() {
        this.currentDrawer = true
      },
      amountChange(code) {
        var value = this.currentSalaryData[code]
        if (this.$global.isNotBlank(value)) {
          if (parseFloat(value) < 0) {
            this.currentSalaryData[code] = ''
          } else {
            this.currentSalaryData[code] = this.$global.preserveDecimal(value, 2)
          }
        }
        if (code === 'amountBeforeTax' && this.$global.isNotBlank(this.currentSalaryData.totalAmountBeforeTax)) {
          this.$refs.currentSalaryData.validateField('totalAmountBeforeTax', (valid) => {})
        } else if (code === 'totalAmountBeforeTax' && this.$global.isNotBlank(this.currentSalaryData.amountBeforeTax)) {
          this.$refs.currentSalaryData.validateField('amountBeforeTax', (valid) => {})
        } else if (code === 'socialFundElderlyDeduction' && this.$global.isNotBlank(this.currentSalaryData.totalSocialFundElderlyDeduction)) {
          this.$refs.currentSalaryData.validateField('totalSocialFundElderlyDeduction', (valid) => {})
        } else if (code === 'totalSocialFundElderlyDeduction' && this.$global.isNotBlank(this.currentSalaryData.socialFundElderlyDeduction)) {
          this.$refs.currentSalaryData.validateField('socialFundElderlyDeduction', (valid) => {})
        } else if (code === 'extralElderlyDeduction' && this.$global.isNotBlank(this.currentSalaryData.totalExtralElderlyDeduction)) {
          this.$refs.currentSalaryData.validateField('totalExtralElderlyDeduction', (valid) => {})
        } else if (code === 'totalExtralElderlyDeduction' && this.$global.isNotBlank(this.currentSalaryData.extralElderlyDeduction)) {
          this.$refs.currentSalaryData.validateField('extralElderlyDeduction', (valid) => {})
        }

      },
      checkAmount(rule, value, callback) {
        if (rule.field === 'amountBeforeTax') {
          if (this.$global.isNotBlank(value) && this.$global.isNotBlank(this.currentSalaryData.totalAmountBeforeTax) && this.biggerThan(value, this.currentSalaryData.totalAmountBeforeTax)) {
            callback(new Error('本月税前收入不能大于累计税前收入'))
          } else {
            callback()
          }
        } else if (rule.field === 'totalAmountBeforeTax') {
          if (this.$global.isNotBlank(value) && this.$global.isNotBlank(this.currentSalaryData.amountBeforeTax) && this.lessThan(value, this.currentSalaryData.amountBeforeTax)) {
            callback(new Error('累计税前收入不能小于本月税前收入'))
          } else {
            callback()
          }
        } else if (rule.field === 'socialFundElderlyDeduction') {
          if (this.$global.isNotBlank(value) && this.$global.isNotBlank(this.currentSalaryData.totalSocialFundElderlyDeduction) && this.biggerThan(value, this.currentSalaryData.totalSocialFundElderlyDeduction)) {
            callback(new Error('本月五险一金扣除不能大于累计五险一金扣除'))
          } else {
            callback()
          }
        } else if (rule.field === 'totalSocialFundElderlyDeduction') {
          if (this.$global.isNotBlank(value) && this.$global.isNotBlank(this.currentSalaryData.socialFundElderlyDeduction) && this.lessThan(value, this.currentSalaryData.socialFundElderlyDeduction)) {
            callback(new Error('累计五险一金扣除不能小于本月五险一金扣除'))
          } else {
            callback()
          }
        } else if (rule.field === 'extralElderlyDeduction') {
          if (this.$global.isNotBlank(value) && this.$global.isNotBlank(this.currentSalaryData.totalExtralElderlyDeduction) && this.biggerThan(value, this.currentSalaryData.totalExtralElderlyDeduction)) {
            callback(new Error('本月专项附加扣除不能大于累计专项附加扣除'))
          } else {
            callback()
          }
        } else if (rule.field === 'totalExtralElderlyDeduction') {
          if (this.$global.isNotBlank(value) && this.$global.isNotBlank(this.currentSalaryData.extralElderlyDeduction) && this.lessThan(value, this.currentSalaryData.extralElderlyDeduction)) {
            callback(new Error('累计专项附加扣除不能小于本月专项附加扣除'))
          } else {
            callback()
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/css/taxCalculator/index.less';
</style>
