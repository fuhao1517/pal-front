<template>
  <div>
    <!--每月测算 start-->
    <div class="search-row" style="position: relative">
      <el-form :inline="true" :model="month" ref="month" label-width="165px">
        <el-form-item class="addr-select" prop="monthStart"
                      :rules="[{ validator: checkMonthStart,  trigger:'change'}]">
          <template slot="label">
            <span class="required-pre">本年度本单位受雇月份:</span>
          </template>
          <el-select v-model="month.monthStart" @change="changeMonth('monthStart')" placeholder="请选择">
            <el-option
              v-for="item in months"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <span class="msg-info ml-5 mr-15">至</span>
        <el-form-item class="addr-select" prop="monthEnd"
                      :rules="[{ validator: checkMonthEnd,  trigger:'change'}]">
          <el-select v-model="month.monthEnd" @change="changeMonth('monthEnd')" placeholder="请选择">
            <el-option
              v-for="item in months"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="monthList">
        <div class="title-name">
          <div>每月薪资数据</div>
        </div>
        <dTable v-loading="isLoading" :data="monthListData" ref="monthListTable" :showEmptyAll="true"
                :cancelMinHeight="true" :paging="false"
                :showIndex="false" :showSelection="false" :key="refreshKey">
          <el-table-column label="受雇月份" header-align="center" align="center" min-width="80" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p v-if="scope.$index!==monthListData.length-1"
                 v-text="monthListData[scope.$index].month + '月'"></p>
              <p class="amountTotal" v-if="scope.$index==monthListData.length-1"
                 v-text="monthListData[scope.$index].month"></p>
            </template>
          </el-table-column>
          <el-table-column label="税前收入（元）" header-align="center" align="right" min-width="200"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form v-if="scope.$index!=monthListData.length-1" :inline="true" :model="monthListData[scope.$index]"
                       :ref="'infoForm'+scope.$index+'amountAfterTax'">
                <el-form-item class="addr-select" prop="amountAfterTax"
                              :rules="[{ required: true,  message: '必填',  trigger:'blur'}]">
                  <el-input type="number" :min="0" v-model="monthListData[scope.$index].amountAfterTax"
                            placeholder="请输入"
                            @change="amountChange(scope.$index, 'amountAfterTax')"></el-input>
                </el-form-item>
              </el-form>
              <p class="amountTotal mr-35" v-else
                 v-text="$global.milliFormat(monthListData[scope.$index].amountAfterTax)"></p>
            </template>
          </el-table-column>
          <el-table-column label="五险一金扣除" header-align="center" align="right" min-width="200"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form v-if="scope.$index!=monthListData.length-1" :inline="true" :model="monthListData[scope.$index]"
                       :ref="'infoForm'+scope.$index+'socialFundElderlyDeduction'">
                <el-form-item class="addr-select" prop="socialFundElderlyDeduction"
                              :rules="[{ required: true,  message: '必填',  trigger:'blur'}]">
                  <el-input type="number" :min="0"
                            v-model="monthListData[scope.$index].socialFundElderlyDeduction"
                            placeholder="请输入"
                            @change="amountChange(scope.$index, 'socialFundElderlyDeduction')"></el-input>
                </el-form-item>
              </el-form>
              <p class="amountTotal mr-35" v-else
                 v-text="$global.milliFormat(monthListData[scope.$index].socialFundElderlyDeduction)"></p>
            </template>
          </el-table-column>
          <el-table-column label="专项附加扣除" header-align="center" align="right" min-width="200"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-form v-if="scope.$index!=monthListData.length-1" :inline="true" :model="monthListData[scope.$index]"
                       :ref="'infoForm'+scope.$index+'extralElderlyDeduction'">
                <el-form-item class="addr-select" prop="extralElderlyDeduction"
                              :rules="[{ required: true,  message: '必填',  trigger:'blur'}]">
                  <el-input type="number" :min="0"
                            v-model="monthListData[scope.$index].extralElderlyDeduction"
                            placeholder="请输入"
                            @change="amountChange(scope.$index, 'extralElderlyDeduction')"></el-input>
                </el-form-item>
              </el-form>
              <p class="amountTotal mr-35" v-else
                 v-text="$global.milliFormat(monthListData[scope.$index].extralElderlyDeduction)"></p>
            </template>
          </el-table-column>
          <el-table-column label="减除费用" header-align="center" align="right" min-width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p :class="scope.$index==monthListData.length-1?'amountTotal':''"
                 v-text="$global.milliFormat(monthListData[scope.$index].totalTaxThreshold)"></p>
            </template>
          </el-table-column>
          <el-table-column label="应纳税额（元）" header-align="center" align="right" min-width="150"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p :class="scope.$index==monthListData.length-1?'amountTotal':''"
                 v-text="$global.milliFormat(monthListData[scope.$index].bonusTaxAmount)"></p>
            </template>
          </el-table-column>
          <el-table-column label="税后收入（元）" header-align="center" align="right" min-width="150"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p :class="scope.$index==monthListData.length-1?'amountTotal':''"
                 v-text="$global.milliFormat(monthListData[scope.$index].postAmount)"></p>
            </template>
          </el-table-column>
        </dTable>

        <el-row class="every-month-but-group">
          <el-button class="mr-20 w-100" size="small" @click="resetForms">重置</el-button>
          <el-button class="mr-20 w-100" type="primary" size="small" @click="goToCalculation" :loading="isLoading">开始计算
          </el-button>
          <el-button type="text" @click="seeCalRule">查看计算规则<i class="ml-5 el-icon-d-arrow-right"></i></el-button>
        </el-row>
      </div>
    </div>
    <!--每月测算 end-->

    <el-drawer :modal="false" :visible.sync="drawer" :wrapperClosable="false" custom-class="drawer-style">
      <template slot="title">
        <p class="drawer-title">工资薪金-每月测算</p>
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
            <p class="msg-info">公司员工张三：{{currentYear}}年度，1月份税前工资15,000元；2月份税前工资45,000元；3月份税前工资15,000元。有一个正在读书的儿子，子女教育每月扣除1,000元；首套住房贷款利息支出</p>
            <p class="msg-info">每月1,000元；父母健在，且是独生子女，赡养老人支出每月可以扣除2000元。五险一金每月缴纳个人部分3,000元。每月支出商业保险200元。</p>
            <p class="msg-info">{{currentYear}}年1月：</p>
            <p class="msg-info">
              应纳税所得额 = 15,000 - 5,000（累计减除费用）- 3,000（累计专项扣除）- 4,000（累计专项附加扣除）- 200（累计依法确定的其他扣除） = 2,800元</p>
            <p class="msg-info">应纳税额 = 累计应纳税额 = 2800 * 3% = 84元</p>
            <p class="msg-info">{{currentYear}}年2月：</p>
            <p class="msg-info">
              应纳税所得额 = 60,000（累计收入） - 10,000（累计减除费用） - 6,000（累计专项扣除） - 8,000（累计专项附加扣除） - 400（累计依法确定的其他扣除） = 35,600元</p>
            <p class="msg-info">应纳税额 = 累计应纳税额 - 累计已缴纳税额 = 35,600 * 3% - 84 = 1,068 - 84（已预缴预扣税额） = 984元</p>
            <p class="msg-info">{{currentYear}}年3月：</p>
            <p class="msg-info">
              应纳税所得额 = 75,000（累计收入） - 15,000（累计基本减除费用） - 9,000（累计专项扣除） - 12,000（累计专项附加扣除） - 600（累计依法确定的其他扣除） = 38,400元</p>
            <p class="msg-info">应纳税额 = 累计应纳税额 - 累计已缴纳税额 = （38,400 * 10% - 2,520） - 1,068 = 252元</p>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import dTable from '../../../components/common/table'
  export default {
    components: {dTable},
    props: ['threshold'],
    data () {
      return {
        isLoading: false,
        currentYear: this.$moment(new Date()).format("YYYY"),
        thresholdValue: null,
        months: [
          {value: 1, label: '1月'},
          {value: 2, label: '2月'},
          {value: 3, label: '3月'},
          {value: 4, label: '4月'},
          {value: 5, label: '5月'},
          {value: 6, label: '6月'},
          {value: 7, label: '7月'},
          {value: 8, label: '8月'},
          {value: 9, label: '9月'},
          {value: 10, label: '10月'},
          {value: 11, label: '11月'},
          {value: 12, label: '12月'}
        ],
        refreshKey: new Date().getTime(),
        month: {
          monthStart: '',
          monthEnd: ''
        },
        monthListData: [],
        drawer: false,
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
      this.thresholdValue = this.threshold
    },
    watch: {
      'month.monthStart': function (newVal, oldVal) {
        this.refreshKey = new Date().getTime()
        if (newVal) {
          if (this.$global.isNotBlank(this.month.monthEnd) && newVal > this.month.monthEnd) {
            return
          }
          this.buildList()
        }
      },
      'month.monthEnd': function (newVal, oldVal) {
        this.refreshKey = new Date().getTime()
        if (newVal) {
          if (this.$global.isNotBlank(this.month.monthStart) && newVal < this.month.monthStart) {
            return
          }
          this.buildList()
        }
      },
      threshold(val) {
        this.thresholdValue = val
      }
    },
    mounted () {
    },
    methods: {
      buildList() {
        this.monthListData = []
        if (this.$global.isBlank(this.month.monthStart) || this.$global.isBlank(this.month.monthEnd)) {
          return
        }
        var monthListData = []
        var total = 0
        for (var i = this.month.monthStart; i <= this.month.monthEnd; i++) {
          total++
          monthListData.push(
            {
              month: i,
              amountAfterTax: '',
              socialFundElderlyDeduction: '',
              extralElderlyDeduction: '',
              totalTaxThreshold: this.thresholdValue,
              bonusTaxAmount: '',
              postAmount: ''
            }
          )
        }
        monthListData.push(
          {
            month: '合计',
            amountAfterTax: '0.00',
            socialFundElderlyDeduction: '0.00',
            extralElderlyDeduction: '0.00',
            totalTaxThreshold: this.thresholdValue * total,
            bonusTaxAmount: '0.00',
            postAmount: '0.00'
          }
        )
        this.monthListData = monthListData
      },
      changeMonth(code) {
        if (code === 'monthStart' && this.$global.isNotBlank(this.month.monthEnd)) {
          this.$refs.month.validateField('monthEnd', (valid) => {
          })
        } else if (code === 'monthEnd' && this.$global.isNotBlank(this.month.monthStart)) {
          this.$refs.month.validateField('monthStart', (valid) => {
          })
        }
      },
      amountChange(index, code) {
        var value = this.monthListData[index][code]
        if (this.$global.isNotBlank(this.monthListData[index][code])) {
          if (parseFloat(this.monthListData[index][code]) < 0) {
            this.monthListData[index][code] = ''
          } else {
            this.monthListData[index][code] = this.$global.preserveDecimal(value, 2)
          }
        }
        var total = 0
        for (var i = 0; i < this.monthListData.length - 1; i++) {
          var item = this.monthListData[i]
          var itemValue = item[code]
          if (this.$global.isBlank(itemValue)) {
            if (this.$global.isNotBlank(this.monthListData[index][code])) {
              this.monthListData[i][code] = this.monthListData[index][code]
              itemValue = this.monthListData[i][code]
            } else {
              itemValue = 0
            }
          }
          total += parseFloat(itemValue)
        }
        this.monthListData[this.monthListData.length - 1][code] = this.$global.milliFormat(total)
        if (this.$global.isNotBlank(this.monthListData[index][code])) {
          this.validForm(code)
        }
      },
      validForm(code) {
        var infoFormValid = true
        for (var i = 0; i < this.monthListData.length - 1; i++) {
          if (this.$global.isNotBlank(code)) {
            this.$refs['infoForm' + i + code].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
          } else {
            this.$refs['infoForm' + i + 'amountAfterTax'].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            this.$refs['infoForm' + i + 'socialFundElderlyDeduction'].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            this.$refs['infoForm' + i + 'extralElderlyDeduction'].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
          }
        }
        return infoFormValid
      },
      checkMonthStart (rule, value, callback) {
        if (this.$global.isBlank(value)) {
          callback(new Error('请选择开始月份'))
        } else if (this.$global.isNotBlank(this.month.monthEnd) && value > this.month.monthEnd) {
          callback(new Error('开始月份不能大于结束月份'))
        } else {
          callback()
        }
      },
      checkMonthEnd (rule, value, callback) {
        if (this.$global.isBlank(value)) {
          callback(new Error('请选择结束月份'))
        } else if (this.$global.isNotBlank(this.month.monthStart) && value < this.month.monthStart) {
          callback(new Error('结束月份不能小于开始月份'))
        } else {
          callback()
        }
      },
      goToCalculation() {
        this.$refs.month.validate((valid) => {
          if (valid) {
            var infoFormValid = this.validForm()
            if (infoFormValid) {
              this.isLoading = true
              this.$http({
                url: '/api/salary/salaryComputer/salaryMonthComputer',
                method: 'post',
                data: this.monthListData.slice(0, this.monthListData.length - 1)
              }).then(({data}) => {
                this.isLoading = false
                var result = data.data[0]
                for (var i = 0; i < result.length; i++) {
                  var obj = result[i]
                  for (var code in obj) {
                    if (code !== 'month') {
                      obj[code] = this.$global.preserveDecimal(obj[code], 2)
                    }
                  }
                }
                this.monthListData = result
                this.calTotal()
              }).catch((data) => {
                this.isLoading = false
              })
            }
          }
        })
      },
      calTotal() {
        var amountAfterTax = 0
        var socialFundElderlyDeduction = 0
        var extralElderlyDeduction = 0
        var totalTaxThreshold = 0
        var bonusTaxAmount = 0
        var postAmount = 0
        for (var i = 0; i < this.monthListData.length; i++) {
          amountAfterTax += parseFloat(this.monthListData[i].amountAfterTax)
          socialFundElderlyDeduction += parseFloat(this.monthListData[i].socialFundElderlyDeduction)
          extralElderlyDeduction += parseFloat(this.monthListData[i].extralElderlyDeduction)
          totalTaxThreshold += parseFloat(this.monthListData[i].totalTaxThreshold)
          bonusTaxAmount += parseFloat(this.monthListData[i].bonusTaxAmount)
          postAmount += parseFloat(this.monthListData[i].postAmount)
        }
        this.monthListData.push(
          {
            month: '合计',
            amountAfterTax: amountAfterTax,
            socialFundElderlyDeduction: socialFundElderlyDeduction,
            extralElderlyDeduction: extralElderlyDeduction,
            totalTaxThreshold: totalTaxThreshold,
            bonusTaxAmount: bonusTaxAmount,
            postAmount: postAmount
          }
        )
      },
      resetForms() {
        this.buildList()
        for (var i = 0; i < this.monthListData.length - 1; i++) {
          this.$refs['infoForm' + i + 'amountAfterTax'].resetFields()
          this.$refs['infoForm' + i + 'socialFundElderlyDeduction'].resetFields()
          this.$refs['infoForm' + i + 'extralElderlyDeduction'].resetFields()
        }
      },
      seeCalRule() {
        this.drawer = true
      },
      handleClose() {
        this.drawer = false
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/css/taxCalculator/index.less';

  .monthList {
    padding-top: 10px;
    .el-form-item {
      margin-bottom: 0px;
      /deep/ .el-form-item__error {
        left: 100%;
        top: 14px;
        padding-left: 0px;
      }
      /deep/ .el-form-item__content {
        margin-right: 25px;
        line-height: 38px;
      }
    }
  }

  /deep/ .el-form-item__error {
    padding-left: 0px;
  }

  .mr-35 {
    margin-right: 35px !important;
  }

  .mr-20 {
    margin-right: 20px !important;
  }
</style>
