<template>
  <div class="singleSetting">
    <div class="header clearfix">
      <div class="fl font-18">设置累计附加专项 <span class="ml-30 font-14">单个新增</span></div>
      <div class="fr">
        <el-button size="small" type="primary" class="w-100 mr-30" :loading="saveBtnLoading" :disabled="status==1" @click="handleValid">保存</el-button>
        <i class="el-icon-close mr-20 fw-blod font-18 f-cursor"  @click="handleClose"></i>
      </div>
    </div>
    <div class="mt-20" style="background-color: #fff;padding: 25px 20px 20px 20px;">
      <el-form :model="settingForm" ref="settingForm" label-width="">
        <div>
        <el-row class="row-bg" justify="space-around" :gutter="150" :span="24" style="padding: 0 40px;">
          <el-col :span="rowSpan" style="position: relative">
            <p class="required fieldName">姓名</p>
            <el-form-item label="" prop="empName" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur'}]">
              <el-input v-model="settingForm.empName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <!--//  status：报税状态，0新入职，1正常报税 (新增：2为正常报税，6w的情况)-->
            <div class="status" v-show="status==1||status==2">正常报税</div>
            <div class="status status2" v-show="status==0">新入职</div>
          </el-col>
          <el-col :span="rowSpan">
            <p class="required fieldName">证件号码</p>
            <el-form-item label="" prop="empIdCard" :rules="[{ required: true, message: '请输入证件号码', trigger: 'blur'},{validator:this.validEmp,trigger:'blur'}]">
              <el-input v-model="settingForm.empIdCard" placeholder="请输入" clearable @blur="getTaxItem()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="rowSpan">
            <p class="fieldName">手机号</p>
            <el-form-item prop="telephone">
              <el-input v-model="settingForm.telephone" disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="rowSpan">
            <p class="required fieldName">扣缴义务人</p>
            <el-form-item label="" prop="optrCompId" :rules="[{ required: true, message: '请选择扣缴义务人', trigger: 'change'}]">
              <el-select v-model="settingForm.optrCompId" @change="getTaxItem" placeholder="请选择" class="w-p100">
                <el-option v-for="item in optrCompOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="rowSpan">
            <p class="required fieldName">薪酬年月</p>
            <el-form-item label="" prop="salaryDate" :rules="[{ required: true, message: '请选择薪酬年月', trigger: 'change'}]">
              <el-date-picker v-model="settingForm.salaryDate" @change="getTaxItem" class="date-editor2 w-p100" type="month" value-format="yyyy-MM" placeholder="请选择" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="rowSpan" v-show="status==0">
            <p class="required fieldName">是否纳税年度首次取得工资</p>
            <el-form-item label="" prop="yearFirstSalaryCode" :rules="[{ required: true, message: '请选择是否纳税年度首次取得工资', trigger: 'change'}]">
              <el-select v-model="settingForm.yearFirstSalaryCode" ref="yearFirstSalaryCode" @change="changeYearFirstSalaryCode" placeholder="请选择" class="w-p100">
                <el-option v-for="item in yearFirstSalaryOptions" :key="item.id" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="rowSpan" v-show="status==0">
            <p class="required fieldName">员工从业类型</p>
            <el-form-item label="" prop="employeeTypeCode" :rules="[{ required: true, message: '请选择员工从业类型', trigger: 'change'}]">
              <el-select v-model="settingForm.employeeTypeCode" ref="employeeTypeCode" placeholder="请选择" class="w-p100">
                <el-option v-for="item in employeeTypeOptions" :key="item.id" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="rowSpan">
            <p class="required fieldName">任职受雇日期</p>
            <el-form-item label="" prop="entyDate">
              <el-date-picker v-model="settingForm.entyDate" class="date-editor2 w-p100" type="date" value-format="yyyy-MM-dd" disabled clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
        <div class="pt-15" style="border-top:1px solid #CECECE;">
          <p class="title">累计专项值</p>
          <el-row class="row-bg" justify="space-around" :gutter="150" :span="24" style="padding: 0 40px;">
            <el-col :span="rowSpan">
              <p class="required fieldName">累计子女教育扣除</p>
              <el-form-item label="" prop="totalChildrenEducationDeduction" :rules="[{validator:this.validAmount,trigger:'blur'}, {validator:this.checkEdu,trigger:'blur'}]">
                <el-input v-model="settingForm.totalChildrenEducationDeduction" :disabled="isDisabled" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="rowSpan">
              <p class="required fieldName">累计继续教育扣除</p>
              <el-form-item label="" prop="totalContinueEducationDeduction" :rules="{validator:this.validAmount,trigger:'blur'}">
                <el-input v-model="settingForm.totalContinueEducationDeduction" :disabled="isDisabled" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="rowSpan">
              <p class="required fieldName">累计赡养老人扣除</p>
              <el-form-item label="" prop="totalSupportElderlyDeduction" :rules="{validator:this.validAmount,trigger:'blur'}">
                <el-input v-model="settingForm.totalSupportElderlyDeduction" :disabled="isDisabled" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="rowSpan">
              <p class="required fieldName">累计大病医疗扣除</p>
              <el-form-item label="" prop="totalLinessMedicalDeduction" :rules="{validator:this.validAmount,trigger:'blur'}">
                <el-input v-model="settingForm.totalLinessMedicalDeduction" :disabled="isDisabled" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="rowSpan">
              <p class="required fieldName">累计住房贷款利息</p>
              <el-form-item label="" prop="totalHouseLoanDeduction" :rules="[{validator:this.validAmount,trigger:'blur'}, {validator:this.checkHouse,trigger:'blur'}]">
                <el-input v-model="settingForm.totalHouseLoanDeduction" :disabled="isDisabled" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="rowSpan">
              <p class="required fieldName">累计住房租金扣除</p>
              <el-form-item label="" prop="totalHouseRentDeduction" :rules="[{validator:this.validAmount,trigger:'blur'}, {validator:this.checkHouse,trigger:'blur'}]">
                <el-input v-model="settingForm.totalHouseRentDeduction" :disabled="isDisabled" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="rowSpan">
              <p class="required fieldName">累计减除费用</p>
              <el-form-item label="" prop="totalTaxThreshold" :rules="[{ required: true, message: '请输入累计减除费用', trigger: 'blur'},{validator:this.validAmount,trigger:'blur'},{validator:this.validTotalTax,trigger:'blur'}]">
                <el-input v-model="settingForm.totalTaxThreshold" @blur="getEntryDate" :disabled="isDisabled||isDisabledTotalTaxThreshold||status==2" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'singleSetting',
  data () {
    return {
      rowSpan: 8,
      settingForm: {
        empName: '',
        empIdCard: '',
        telephone: '',
        optrCompId: '',
        salaryDate: '',
        yearFirstSalaryCode: '',
        employeeTypeCode: '',
        entyDate: '',
        totalChildrenEducationDeduction: 0, // 累计子女教育扣除
        totalContinueEducationDeduction: 0, // 累计继续教育扣除
        totalHouseLoanDeduction: 0, // 累计住房贷款利息
        totalHouseRentDeduction: 0, // 累计住房租金扣除
        totalLinessMedicalDeduction: 0, // 累计大病医疗扣除
        totalSupportElderlyDeduction: 0, // 累计赡养老人扣除
        totalTaxThreshold: '' // 累计减除费用
      },
      optrCompOptions: [],
      yearFirstSalaryOptions: [],
      employeeTypeOptions: [],
      isDisabled: false,
      isDisabledTotalTaxThreshold: false,
      status: -1,
      saveBtnLoading: false // 还用于区分保存时不要再去请求人员信息接口（由校验触发）
    }
  },
  components: {},
  watch: {
    status (newValue, oldValue) {
      if (newValue != 0) {
        this.settingForm.yearFirstSalaryCode = ''
        this.settingForm.employeeTypeCode = ''
        this.getTaxItem()
      }
    }
  },
  created () {
    this.getOptrComp() // 获取扣缴义务人数据
    this.getYearFirstSalaryOptions() // 获取是否纳税年度内首次获得工资数据
    this.getEmployeeTypeOptions() // 获取从业类型数据
  },
  methods: {
    // 获取扣缴义务人数据
    getOptrComp () {
      this.$http({
        url: '/api/salary/listOptrComp',
        method: 'post'
      }).then(({ data }) => {
        let optrCompVOList = data.data[0]
        this.optrCompOptions = optrCompVOList
        if (optrCompVOList.length == 1) {
          this.settingForm.optrCompId = optrCompVOList[0].id
        }
      })
    },
    // 获取是否纳税年度内首次获得工资数据
    getYearFirstSalaryOptions () {
      this.$http({
        url: '/api/sys/getDictByKey?dictKey=10059',
        method: 'get'
      }).then(({ data }) => {
        this.yearFirstSalaryOptions = data.data[0]
      })
    },
    // 获取从业类型数据
    getEmployeeTypeOptions () {
      this.$http({
        url: '/api/sys/getDictByKey?dictKey=10060',
        method: 'get'
      }).then(({ data }) => {
        this.employeeTypeOptions = data.data[0]
      })
    },

    // 查询任职受雇日期
    getEntryDate () {
      //  status：报税状态，0新入职，1正常报税 (新增：2为正常报税，6w的情况)
      if (this.status == 1 || this.status == 2 || this.settingForm.salaryDate == '' || this.settingForm.totalTaxThreshold == '' || this.settingForm.empIdCard == '') {
        return false
      }
      this.$refs.settingForm.validateField('totalTaxThreshold', (errorMessage) => {
        if (!errorMessage) {
          this.$http({
            url: '/api/salary/grandTotal/entryDate',
            method: 'get',
            params: {
              customerId: this.$store.state.userData.custId,
              salaryDate: this.settingForm.salaryDate,
              totalAmount: this.settingForm.totalTaxThreshold,
              idCard: this.settingForm.empIdCard
            }
          }).then(({ data }) => {
            let res = data.data[0]
            if (res.state) {
              this.settingForm.entyDate = res.msg
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    // 薪酬年月，扣缴义务人已选，则输入证件号码带出条件下的累计专项和任职受雇
    getTaxItem () {
      if (this.settingForm.empIdCard == '' || this.settingForm.optrCompId == '' || this.settingForm.salaryDate == '') {
        this.isDisabled = false
        this.status = -1
        this.getEntryDate()
        return
      }
      let yearFirstSalaryCode = this.settingForm.yearFirstSalaryCode
      this.$http({
        url: '/api/salary/grandTotal/finTaxItemInVO',
        method: 'get',
        params: {
          customerId: this.$store.state.userData.custId,
          idCard: this.settingForm.empIdCard,
          optrCom: this.settingForm.optrCompId,
          salaryDate: this.settingForm.salaryDate,
          isFirstSalary: yearFirstSalaryCode
        }
      }).then(({ data }) => {
        let res = data.data[0]
        //  status：报税状态，0新入职，1正常报税 (新增：2为正常报税，6wq的情况)
        if (res.state) {
          this.isDisabled = (res.status != 0 && res.status != 2)
          this.status = res.status
          let taxItemInVO = res.taxItemInVO
          if (res.taxItemInVO != null) {
            this.settingForm.totalChildrenEducationDeduction = taxItemInVO.countSonEducation == null || taxItemInVO.countSonEducation == '' ? 0 : taxItemInVO.countSonEducation
            this.settingForm.totalContinueEducationDeduction = taxItemInVO.countEducation == null || taxItemInVO.countEducation == '' ? 0 : taxItemInVO.countEducation
            this.settingForm.totalHouseLoanDeduction = taxItemInVO.countMortgage == null || taxItemInVO.countMortgage == '' ? 0 : taxItemInVO.countMortgage
            this.settingForm.totalHouseRentDeduction = taxItemInVO.countAccfund == null || taxItemInVO.countAccfund == '' ? 0 : taxItemInVO.countAccfund
            this.settingForm.totalLinessMedicalDeduction = taxItemInVO.countLinessMedical == null || taxItemInVO.countLinessMedical == '' ? 0 : taxItemInVO.countLinessMedical
            this.settingForm.totalSupportElderlyDeduction = taxItemInVO.countSupportOlder == null || taxItemInVO.countSupportOlder == '' ? 0 : taxItemInVO.countSupportOlder
            console.log(taxItemInVO.countTotalAmount)
            this.settingForm.totalTaxThreshold = taxItemInVO.countTotalAmount == null || taxItemInVO.countTotalAmount == '' ? '' : taxItemInVO.countTotalAmount

            let yearFirstSalaryRes = taxItemInVO.yearFirstSalaryCode
            if (yearFirstSalaryRes && yearFirstSalaryRes != '' && yearFirstSalaryRes != null) {
              if (this.settingForm.yearFirstSalaryCode == '') {
                this.settingForm.yearFirstSalaryCode = yearFirstSalaryRes
                this.changeYearFirstSalaryCode()
              }

              if (this.settingForm.employeeTypeCode == '') {
                for (let i = 0; i < this.employeeTypeOptions.length; i++) {
                  if (this.employeeTypeOptions[i].dictName == taxItemInVO.employeeType) {
                    this.settingForm.employeeTypeCode = this.employeeTypeOptions[i].dictCode
                    break
                  }
                }
              }
            }
          }
          this.settingForm.entyDate = res.entyDate != null ? res.entyDate : ''
          if (yearFirstSalaryCode != '10059101' && yearFirstSalaryCode != '10059102') {
            this.getEntryDate()
          }
        } else {
          this.$message.error(res.msg ? res.msg : '查询异常')
        }
      })
    },

    resetForm () {
      this.settingForm.totalChildrenEducationDeduction = 0
      this.settingForm.totalContinueEducationDeduction = 0
      this.settingForm.totalHouseLoanDeduction = 0
      this.settingForm.totalHouseRentDeduction = 0
      this.settingForm.totalLinessMedicalDeduction = 0
      this.settingForm.totalSupportElderlyDeduction = 0
      this.settingForm.totalTaxThreshold = 0
      this.settingForm.entyDate = ''
      this.settingForm.telephone = ''
      this.$refs.settingForm.resetFields()
    },

    handleValid () {
      this.saveBtnLoading = true
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          this.handleSave()
        } else {
          this.saveBtnLoading = false
        }
      })
    },
    handleSave () {
      if (this.settingForm.entyDate == '') {
        this.$message.warning('任职受雇日期不能为空')
        this.saveBtnLoading = false
      }
      let setObj = {
        empName: this.settingForm.empName,
        empIdCard: this.settingForm.empIdCard,
        telephone: this.settingForm.telephone,
        optrCompId: Number(this.settingForm.optrCompId),
        salaryDate: this.settingForm.salaryDate,
        yearFirstSalaryCode: this.settingForm.yearFirstSalaryCode,
        yearFirstSalary: this.$refs.yearFirstSalaryCode.selectedLabel,
        employeeType: this.$refs.employeeTypeCode.selectedLabel,
        entyDate: this.settingForm.entyDate,
        totalChildrenEducationDeduction: Number(this.settingForm.totalChildrenEducationDeduction), // 累计子女教育扣除
        totalContinueEducationDeduction: Number(this.settingForm.totalContinueEducationDeduction), // 累计继续教育扣除
        totalHouseLoanDeduction: Number(this.settingForm.totalHouseLoanDeduction), // 累计住房贷款利息
        totalHouseRentDeduction: Number(this.settingForm.totalHouseRentDeduction), // 累计住房租金扣除
        totalLinessMedicalDeduction: Number(this.settingForm.totalLinessMedicalDeduction), // 累计大病医疗扣除
        totalSupportElderlyDeduction: Number(this.settingForm.totalSupportElderlyDeduction), // 累计赡养老人扣除
        totalTaxThreshold: Number(this.settingForm.totalTaxThreshold) // 累计减除费用
      }

      this.$http({
        url: '/api/salary/grandTotal/save',
        method: 'post',
        data: setObj
      }).then(({ data }) => {
        this.saveBtnLoading = false
        if (data.data[0].state) {
          this.$message.success('保存成功')
          this.handleClose()
        } else {
          this.$message.error(data.data[0].msg)
        }
      })
    },

    // 改变—是否纳税年度首次取得工资
    changeYearFirstSalaryCode () {
      let code = this.settingForm.yearFirstSalaryCode
      //  客户选择【新入职学生-10059101、其他当年首次就业-10059102】, 调用计算受雇日期和累计值
      if (code == '10059101' || code == '10059102') {
        this.isDisabledTotalTaxThreshold = true
      } else {
        this.isDisabledTotalTaxThreshold = false
      }
      this.getTaxItem()
    },

    // 校验人员
    validEmp (rule, value, callback) {
      if (this.saveBtnLoading) {
        callback()
      } else {
        // 根据身份证号查姓名、手机号
        this.$http({
          url: '/api/salary/grandTotal/findEmp?empIdCard=' + this.settingForm.empIdCard,
          method: 'get'
        }).then(({ data }) => {
          let res = data.data[0]
          if (res.state) {
            this.settingForm.empName = res.name
            this.settingForm.telephone = !this.$lodash.isEmpty(res.telephone) ? res.telephone : this.settingForm.telephone
            this.$refs.settingForm.validateField('empName')
            callback()
          } else {
            callback(new Error(res.msg))
          }
        })
      }
    },

    // 校验金额
    validAmount (rule, value, callback) {
      if (value == '' || value == null) {
        if (rule.field != 'totalTaxThreshold') {
          this.settingForm[rule.field] = 0
        }
        callback()
      } else {
        if (/^\d+(\.\d+)?$/.test(value) == false) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
    },
    // 校验累计减除费用
    validTotalTax (rule, value, callback) {
      if (value < 0) {
        callback(new Error('请输入大于0的数值'))
      } else {
        if (Number(value) % 5000 != 0) {
          callback(new Error('请输入5000的倍数'))
        } else {
          let month = this.settingForm.salaryDate.split('-')[1]
          if (Number(value) > (5000 * Number(month))) {
            callback(new Error('累计减除费用输入异常，请检查数据'))
          } else {
            callback()
          }
        }
      }
    },

    //  校验（2、累计子女教育是1000的倍数；否则需提示：请输入1000的倍数）
    checkEdu (rule, value, callback) {
      if (Number(value) % 1000 != 0) {
        callback(new Error('请输入1000的倍数'))
      } else {
        callback()
      }
    },

    //  校验 （2、累计住房贷款利息是1000的倍数；否则需提示：请输入1000的倍数）
    //   （3、同一所属期累计住房贷款利息与累计住房租金只能二选一存值，否则提示：住房贷款利息与住房租金只能二选一，请检查数据
    checkHouse (rule, value, callback) {
      var field = rule.field
      //  上月  houseLoanLast houseRentLast
      if (value == 0) {
        if (field == 'totalHouseRentDeduction' && this.settingForm.totalHouseLoanDeduction != 0) {
          this.$refs.settingForm.validateField('totalHouseLoanDeduction')
        } else if (field == 'totalHouseLoanDeduction' && this.settingForm.totalHouseRentDeduction != 0) {
          this.$refs.settingForm.validateField('totalHouseRentDeduction')
        }
      } else if (this.settingForm.totalHouseLoanDeduction > 0 && this.settingForm.totalHouseRentDeduction > 0) {
        callback(new Error('住房贷款利息与住房租金只能二选一，请检查数据'))
      }

      if (field == 'totalHouseLoanDeduction' && Number(value) % 1000 != 0) {
        callback(new Error('请输入1000的倍数'))
      }
      callback()
    },
    handleClose () {
      this.settingForm = {
        empName: '',
        empIdCard: '',
        telephone: '',
        optrCompId: '',
        salaryDate: '',
        yearFirstSalaryCode: '',
        employeeTypeCode: '',
        entyDate: '',
        totalChildrenEducationDeduction: 0, // 累计子女教育扣除
        totalContinueEducationDeduction: 0, // 累计继续教育扣除
        totalHouseLoanDeduction: 0, // 累计住房贷款利息
        totalHouseRentDeduction: 0, // 累计住房租金扣除
        totalLinessMedicalDeduction: 0, // 累计大病医疗扣除
        totalSupportElderlyDeduction: 0, // 累计赡养老人扣除
        totalTaxThreshold: '' // 累计减除费用
      }
      this.isDisabled = false
      this.status = -1
      this.saveBtnLoading = false
      this.$refs.settingForm.resetFields()
      this.$emit('handleClose')
    }
  }
}
</script>

<style lang='less' scoped>
.singleSetting{
  background-color: @bodyBaseBgc;
}
  /deep/.el-form-item{
    margin-bottom: 18px;
  }
  .title{
    font-size: 16px;
    font-weight: bold;
    padding-left: 24px;
    margin-bottom: 15px;
  }
/deep/.date-editor2 .el-icon-date{
  top: 5px;
}
  .status{
    position: absolute;
    width: 70px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    right: -10px;
    top: 26px;
    background-color: #67C23A;
    border-radius: 13px;
    color: #fff;
    font-size:12px;
  }
  .status2{
    width: 60px;
    right: 0px;
    background-color: #FF6C00;
  }
.header {
  height: 90px;
  line-height: 90px;
  padding-left: 30px;
  padding-right: 20px;
  background-color: #fff;
}
</style>
