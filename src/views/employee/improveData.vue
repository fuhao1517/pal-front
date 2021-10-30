<template>
  <div class="spl-container emp-container emp-add-container-main">
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="emp-title">
      <div class="emp-title-content">
        <div class="name-idcard">
          <p class="name">{{name}}</p>
          <p class="idcard">证件号码：{{idCard}}</p>
        </div>
      </div>
    </div>

    <div class="emp-add-container" :style="{minHeight: contentHeight}">
      <el-form :model="formData" ref="formData" label-width="">
        <!--银行卡信息-->
        <div class="content-panel">
          <p class="add-type"><span class="step-title"><i class="ic-empAdd-type ic-empAdd-type3"></i>银行卡信息</span></p>
          <div class="add-type-form">
            <el-row class="row-bg" justify="space-around" :gutter="80" :span="24" style="padding: 0 70px;">
              <el-col :span="rowSpan">
                <p class="required fieldName">银行名称</p>
                <el-form-item label="" prop="bankCode"
                              :rules="[{ validator: checkBankCode, trigger:'change'}]">
                  <el-select v-model="formData.bankCode" ref="bankCode" placeholder="请选择" class="w-p100" clearable>
                    <el-option v-for="item in employeeDataDict.bankList" :key="item.id" :label="item.dictName"
                               :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="rowSpan">
                <p class="required fieldName">银行账户</p>
                <el-form-item label="" prop="bankAccount"
                              :rules="[{ validator: checkBankAccount, trigger:'blur'}]">
                  <el-input v-model="formData.bankAccount" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="rowSpan">
                <p class="required fieldName">银行账户名</p>
                <el-form-item label="" prop="bankAccountName"
                              :rules="[{ required: true, message: '请输入银行账户名', trigger: 'blur'}]">
                  <el-input v-model="formData.bankAccountName" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="rowSpan">
                <p class="fieldName">开户市</p>
                <el-form-item label="" prop="bankCity" :rules="[{ validator: checkBankCity, trigger:'change'}]">
                  <addrSelector v-model="formData.bankCity" width="100%"
                                :addrArr="employeeDataDict.addrCities" placeholder="请选择"></addrSelector>
                </el-form-item>
              </el-col>
              <el-col :span="rowSpan">
                <p class="fieldName">支行名称</p>
                <el-form-item label="" prop="bankBranch"
                              :rules="[{ validator: checkBankBranch, trigger:'blur'}]">
                  <el-input v-model="formData.bankBranch" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>

      <div class="fixed-bottom-area">
        <div class="bottom-area-content">
          <el-button @click="doPreviousStep">上一步</el-button>
          <el-button type="primary" style="margin-left: 15px;" @click="saveData">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import addrSelector from '../../components/common/addrSelector'
export default {
  components: { addrSelector },
  data () {
    return {
      pathData: [
        { name: '人员管理' },
        { name: '员工列表' },
        { name: ' 编辑员工' }
      ],
      rowSpan: 8,
      formData: {
        bankAccount: '',
        bankAccountName: '',
        bankBranch: '',
        bankCity: '',
        bankName: '',
        bankCode: '',
        employeeId: ''
      },
      employeeDataDict: [],
      employeeSiteId: '',
      idCard: '',
      name: ''
    }
  },
  watch: {},
  computed: {
    contentHeight: function () {
      return this.$global.bodyHeight - 270 + 'px'
    }
  },
  created () {
    this.employeeSiteId = this.$route.query.employeeSiteId ? this.$route.query.employeeSiteId : ''
    this.idCard = this.$route.query.idCard ? this.$route.query.idCard : ''
    this.getEmployeeDataDict()//  获取人员录入，编辑页面的常量字段
    if (this.employeeSiteId != '') {
      this.getEmployeeBySiteIdOrIDcard(0)//  获取人员录入，编辑页面的常量字段
    } else if (this.idCard != '') {
      this.getEmployeeBySiteIdOrIDcard()
    }
  },
  methods: {
    getEmployeeDataDict () {
      this.$http({
        url: '/api/employee/getEmployeeDataDict',
        method: 'post',
        data: this.$qs.stringify({ idcard: this.idCard })
      }).then(({ data }) => {
        this.employeeDataDict = data.data[0]
      })
    },

    getEmployeeBySiteIdOrIDcard (type) {
      // 编辑页面，根据employeeSiteId或者人员身份证获取人员信息
      var setObj = {}
      if (type != 0) {
        var idCard = this.idCard
        if (this.$lodash.isEmpty(idCard)) {
          return false
        } else {
          setObj = { idcard: idCard }
        }
      } else {
        setObj = { employeeSiteId: String(this.employeeSiteId) }
      }
      this.$http({
        url: '/api/employee/getEmployeeBySiteIdOrIDcard',
        method: 'post',
        data: this.$qs.stringify(setObj)
      }).then(({ data }) => {
        var res = data.data[0]
        this.formData.employeeId = res.employeeBase.id
        this.idCard = res.employeeBase.idCard
        this.name = res.employeeBase.name
        if (!this.$lodash.isEmpty(res.employeeBaseBank)) {
          this.formData.bankAccount = res.employeeBaseBank.bankAccount
          this.formData.bankAccountName = res.employeeBaseBank.bankAccountName
          this.formData.bankBranch = res.employeeBaseBank.bankBranch
          this.formData.bankCity = res.employeeBaseBank.bankCity
          this.formData.bankName = res.employeeBaseBank.bankName
          this.formData.bankCode = res.employeeBaseBank.bankCode
        }
      })
    },
    saveData () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          var setObj = {
            bankAccount: this.formData.bankAccount,
            bankAccountName: this.formData.bankAccountName,
            bankBranch: this.formData.bankBranch,
            bankCity: this.formData.bankCity,
            bankCode: this.formData.bankCode,
            bankName: this.$refs.bankCode.selectedLabel,
            employeeId: this.formData.employeeId
          }
          this.$http({
            url: '/api/employee/saveOrUpdateEmployeeBank',
            method: 'post',
            data: setObj
          }).then(({ data }) => {
            this.$message.success('保存成功')
            this.$router.replace('/employee/index')
          })
        }
      })
    },

    doPreviousStep () {
      if (this.$lodash.isEmpty(this.employeeSiteId)) {
        this.$router.replace('/employee/empAdd?idCard=' + this.idCard)
      } else {
        this.$router.replace('/employee/empAdd?employeeSiteId=' + this.employeeSiteId)
      }
    },

    checkBankCode (rule, value, callback) {
      if ((this.$lodash.isEmpty(value)) && (!this.$lodash.isEmpty(this.formData.bankAccount) || !this.$lodash.isEmpty(this.formData.bankCity) || !this.$lodash.isEmpty(this.formData.bankAccountName) || !this.$lodash.isEmpty(this.formData.bankBranch))) {
        callback(new Error('请选择银行名称'))
      } else {
        callback()
      }
    },
    checkBankAccount (rule, value, callback) {
      if (this.$lodash.isEmpty(value)) {
        if ((!this.$lodash.isEmpty(this.formData.bankCode)) || !this.$lodash.isEmpty(this.formData.bankCity) || !this.$lodash.isEmpty(this.formData.bankBranch) || !this.$lodash.isEmpty(this.formData.bankAccountName)) {
          callback(new Error('请输入银行账户'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkBankCity (rule, value, callback) {
      // this.$refs.formData.validateField('bankCode')
      if ((this.$lodash.isEmpty(value)) && (!this.$lodash.isEmpty(this.formData.bankBranch))) {
        callback(new Error('请选择开户市'))
      } else {
        callback()
      }
    },
    checkBankBranch (rule, value, callback) {
      /* 当银行名称是这些时，支行名称不用填：
     10024001 : "中国工商银行",
        10024002 : "招商银行",
        10024004 : "中国建设银行",
        10024003 : "中国农业银行",
        10024005 : "中国银行",
        10024009 : "交通银行",
        10024010 : "兴业银行",
        10024011 : "浦发银行",
        10024014 : "广发银行",
        10024025 : "支付宝" */
      if (!this.$lodash.isEmpty(value)) {
        callback()
      } else {
        var bankArr = ['10024001', '10024002', '10024004', '10024003', '10024005', '10024009', '10024010', '10024011', '10024014', '10024025']
        var bankCode = this.formData.bankCode

        if (this.$lodash.isEmpty(bankCode)) {
          callback()
        } else {
          if (bankArr.indexOf(bankCode) > -1) {
            callback()
          } else {
            callback(new Error('请输入支行名称'))
          }
        }
      }
    }
  }

}
</script>
<style lang="less" scoped>
  @import '../../assets/css/employee.less';
  /deep/.addr-main{
    width: 100%;
  }
</style>
