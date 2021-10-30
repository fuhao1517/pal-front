<template>
  <!--1.文本 2.数值 3.日期 4.小时分钟 5.时间 6.下拉选项 7.文件 8.是否-->
  <!--<el-form-item  :label="item.formName +':'" :rules="Rules">-->
  <el-form-item :label="item.formName +'：'" :required="item.required" prop="defaultValue" :rules="Rules">

    <!--1.文本 2.数值-->
    <el-input v-if="item.formTypeCode==1 || item.formTypeCode==2" :class="{'pt-5':workAges.indexOf(item.formKey)>=0}" :type="item.formTypeCode==2?'number':'text'" :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
              v-model.trim="item.defaultValue"
              placeholder="请输入" @change="inputChange($event,item)" clearable>
      <template v-if="workAges.indexOf(item.formKey)>=0" slot="append">
        <span v-text="workAgeUnits[item.formKey]"></span>
      </template>
    </el-input>

    <!--3.日期-->
    <el-date-picker v-if="item.formTypeCode==3" :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
                      v-model="item.defaultValue"
                    type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                    placeholder="请选择" @change="datePickerChange($event,item)" clearable>
    </el-date-picker>

    <!--4.小时分钟-->
    <el-time-picker v-if="item.formTypeCode==4" :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
                    value-format="HH:mm:ss"
      v-model="item.defaultValue"
      placeholder="请选择" clearable>
    </el-time-picker>

    <!--5.时间-->
    <el-date-picker v-if="item.formTypeCode==5" :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
      v-model="item.defaultValue" value-format="yyyy-MM-dd HH:mm:ss"
      type="datetime"
      placeholder="请选择" clearable>
    </el-date-picker>

    <!--6.下拉选项-->
    <el-select v-if="item.formTypeCode==6 && item.formKey!=='reportPersonId'" :clearable="true" :filterable="true" :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
               v-model="item.defaultValue"
               placeholder="请选择" :ref="item.formKey" @change="changeSelect($event,item)">
        <el-option  v-for="it in item.options" :label="it.name" :value="it.id" :key="it.id"></el-option>
    </el-select>

    <el-select v-if="item.formTypeCode==6 && item.formKey==='reportPersonId'" :clearable="true" :filterable="true" remote reserve-keyword placeholder="请输入姓名/证照号码"
               :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
               v-model="item.defaultValue" :ref="item.formKey" :remote-method="remoteMethod" :loading="loading" popper-class="h-auto-select">
      <el-option  v-for="(it,index) in item.options" :label="it.name" :value="it.id" :key="it.id" :style="index%2==0?{background: '#ffffff'}:{background: '#FAFAFA'}">
        <p><span>{{it.name}}（{{it.certificateNumber}}）</span></p>
        <p><span class="text">部门：{{it.deptName}}</span><span class="text text-r">岗位：{{it.positionName}}</span></p>
      </el-option>
    </el-select>

    <!--7.附件-->
    <div  v-if="item.formTypeCode==7" class="clearfix">
      <input type="hidden" v-model="item.defaultValue">
      <el-upload
        :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable"
        class="upload-demo fl"
        action="/api/sys/no-limit/upload/single"
        :headers="this.$global.setHeaders"
        v-loading="uploadLoading"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess">
        <el-button size="small" type="primary">上传附件</el-button>
        <span slot="tip" class="el-upload__tip ml-10" v-show="fileName==''">(附件大小不可超过8M)</span>
      </el-upload>
      <span v-show="fileName!=''" class="ml-10">
        <span class="f-cursor text-blue" @click="downFile" v-text="fileName"></span>
        <i class="el-icon-delete text-red f-cursor ml-15" @click="delFile"></i>
      </span>
    </div>

    <!--8.是否-->
    <el-radio-group  v-if="item.formTypeCode==8" v-model="item.defaultValue" :disabled="oprType === 'add'? item.readOnly : item.readOnly || item.uneditable">
      <el-radio label="1">是</el-radio>
      <el-radio label="0">否</el-radio>
    </el-radio-group>

  </el-form-item>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    oprType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return false
        }
      },
      size: 10,
      loading: false,
      defaultValue: '',
      options: [],
      timeout: null,
      idCardCode: '20004001',
      workAges: ['workYears', 'entryYears', 'probationPeriod'],
      workAgeUnits: {
        'workYears': '年',
        'entryYears': '年',
        'probationPeriod': '月'
      },
      fileName: '',
      uploadLoading: false
    }
  },
  computed: {
    Rules () {
      const { item: { rules } } = this
      const { item: { required } } = this
      const { item: { formName } } = this
      const R = []
      if (required) {
        var obj = { required: required, message: formName + '不能为空' }
        R.push(obj)
      }
      if (rules === undefined || rules === null) return R
      rules.forEach(item => {
        if (item.checkRule) {
          let validcodeName = (rule, value, callback) => {
            if (value != undefined && value != null && value !== '') {
              let reg = new RegExp(item.checkRule)
              if (!reg.test(value)) {
                callback(new Error(item.message))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
          R.push({ validator: validcodeName, trigger: 'blur' })
        }
      })
      return R
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.item.formKey === 'reportPersonId') {
        this.defaultValue = this.item.defaultValue
        this.getEmployeeInfo('')
      }
      if (this.item.formTypeCode == 6 && this.item.sourceFormKey && this.item.sourceFormKey != null && this.item.sourceFormKey !== '') {
        this.item.options = []
      }
      if (this.item.formTypeCode == 7 && this.item.defaultValue) {
        this.getFileInfo(this.item.defaultValue)
      }
      this.parseEcho()
    })
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.getEmployeeInfo(query)
          this.loading = false
        }, 200)
      } else {
        this.item.options = this.options
      }
    },
    getEmployeeInfo (query) {
      this.item.options = []
      if (this.defaultValue) {
        this.getEmployeeList(query, this.defaultValue)
      }
      this.getEmployeeList(query, '')
    },
    getEmployeeList (query, employeeId) {
      this.$http({
        url: '/employeeInfo/page',
        method: 'post',
        data: {
          page: 1,
          size: this.size,
          query: [{ property: 'deptId', value: '' }, { property: 'selectMsg', value: query }, { property: 'workStatus', value: '' }, { property: 'employeeId', value: employeeId }]
        }
      }).then(({ data }) => {
        const res = new Map()
        var arr = this.item.options.concat(
          this.$global.deepcopyArrayPropertyTwo({
            copyResource: data.rows,
            copyProperty: { 'employeeId': 'id' }
          })
        )
        // 返回arr数组过滤后的结果，结果为一个数组
        // 过滤条件是，如果res中没有某个键，就设置这个键的值为1
        this.item.options = arr.filter((a) => !res.has(a.id) && res.set(a.id, 1))
        if (query === '') {
          this.options = this.$global.deepcopyArray(this.item.options)
        }
      })
    },
    // 用作于下拉选项的联动
    changeSelect (value, item) {
      var linkageFormKey = item.linkageFormKey// linkageFormKey字段表示当前下拉框需要联动的下拉字段的formKey
      if (linkageFormKey && linkageFormKey != null && linkageFormKey !== '') {
        try {
          var linkageItemRefs = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_' + linkageFormKey]
          if (linkageItemRefs == undefined || linkageItemRefs == null || linkageItemRefs.length == 0) {
            throw new Error('需要联动的下拉项【' + linkageFormKey + '】不存在，请检查字段配置是否有误')
          } else {
            var linkageItem = linkageItemRefs[0].$children[0]
            var selectOptions = []
            if (value != null && value !== '') {
              selectOptions = this.getLinkageOptions(value, item.options);
            }
            linkageItem.item.options = selectOptions
            if (selectOptions.length === 1){
              linkageItem.item.defaultValue = selectOptions[0].id
            }else {
              linkageItem.item.defaultValue = ''
            }

            linkageItem.changeSelect('', linkageItem.item)
          }
        } catch (e) {
          // console.error(e)
          // console.error(e.message)
        }
      }
      if (this.code === 'employee_info') {
        this.autoCardInfo(value, item)
        this.marriedStatusChange(value, item)
      }
    },
    // 文本输入框的change后执行，目前用作与通过身份证号自动获取性别和出生日期
    inputChange (value, item) {
      if (this.code !== 'employee_info' && this.code !== 'work_info') {
        return
      }
      var formKey = item.formKey
      if (formKey !== 'certificateNumber' && formKey !== 'entryYears') {
        return
      }
      if (formKey === 'certificateNumber') {
        var cardTypeItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_cardType'][0].$children[0].item
        var cardTypeValue = cardTypeItem.defaultValue
        if (cardTypeValue === this.idCardCode) {
          if (value && value != null && value !== '') {
            var checkRules = item.rules
            var validFlag = this.getCardNumberValidResult(checkRules, value)
            if (validFlag) {
              var sexItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_sex'][0].$children[0].item
              sexItem.defaultValue = this.getSexByIdCard(value)
              var birthdayItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_birthday'][0].$children[0].item
              birthdayItem.defaultValue = this.getBirthdayByIdCard(value)
            }
          }
        }
      } else if (formKey === 'entryYears') {
          var $entryDate = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_entryDate'][0].$children[0].item
          var entryDate = $entryDate.defaultValue
          if (entryDate && entryDate != null && entryDate !== '') { // 不为空时，计算司龄
            var entryYears = this.dateDiffByNow(entryDate)
            if (parseFloat(value) <0 ){
              item.defaultValue = entryYears
            } else {
              if(parseFloat(entryYears) === 0) {
                item.defaultValue = entryYears
              }
            }
          } else {
            if (parseFloat(value) <0 ){
              item.defaultValue = 0
            }
          }
      }
    },
    /*
    * 日期选择器的change执行方法
    * 目前用作于：
    * 通过合同的开始日期和结束日期自动带出合同状态，根据合同开始日期设置合同开始日期可选的最小日期，根据合同结束日期设置合同结束开始日期的最大可选日期
    * 通过入职日期自动计算司龄
    * */
    datePickerChange (value, item) {
      var formKey = item.formKey
      if (formKey === 'contractStartDate') { // 合同开始日期
        var $contractEndDate = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_contractEndDate'][0].$children[0]
        if (value && value != null && value !== '') {
          var contractEndDateItem = $contractEndDate.item
          var contractEndDate = contractEndDateItem.defaultValue
          if (contractEndDate && contractEndDate != null && contractEndDate !== '') {
            this.setContractStatusValue(value, contractEndDate)
          }
          $contractEndDate.pickerOptions = {
            disabledDate: (time) => {
              return time.getTime() < new Date(value).getTime() - 8.64e7
            }
          }
        } else {
          $contractEndDate.pickerOptions = {
            disabledDate: (time) => {
              return false
            }
          }
        }
      }
      if (formKey === 'contractEndDate') { // 合同结束日期
        var $contractStartDate = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_contractStartDate'][0].$children[0]
        if (value && value != null && value !== '') {
          var contractStartDateItem = $contractStartDate.item
          var contractStartDate = contractStartDateItem.defaultValue
          if (contractStartDate && contractStartDate != null && contractStartDate !== '') {
            this.setContractStatusValue(contractStartDate, value)
          }
          $contractStartDate.pickerOptions = {
            disabledDate: (time) => {
              return time.getTime() > new Date(value).getTime()
            }
          }
        } else {
          $contractStartDate.pickerOptions = {
            disabledDate: (time) => {
              return false
            }
          }
        }
      }
      if (formKey === 'entryDate') { // 入职日期
        var $leaveDate = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_leaveDate'][0].$children[0]
        if (value && value != null && value !== '') { // 不为空时，计算司龄
          var entryYears = this.dateDiffByNow(value)
          this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_entryYears'][0].$children[0].item.defaultValue = entryYears
          $leaveDate.pickerOptions = {
            disabledDate: (time) => {
              return time.getTime() < new Date(value).getTime() - 8.64e7
            }
          }
        } else {
          $leaveDate.pickerOptions = {
            disabledDate: (time) => {
              return false
            }
          }
        }
      }
      if (formKey === 'leaveDate') { // 离职日期
        var $entryDate = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_entryDate'][0].$children[0]
        if (value && value != null && value !== '') {
          $entryDate.pickerOptions = {
            disabledDate: (time) => {
              return time.getTime() > new Date(value).getTime()
            }
          }
        } else {
          $entryDate.pickerOptions = {
            disabledDate: (time) => {
              return false
            }
          }
        }
      }
    },
    // 获取指定日期与当前日期相隔的年数（保留两位小数）
    dateDiffByNow (date) {
      var firstDate = new Date(date)
      var secondDate = new Date(this.$global.getNowDate('yyyy-MM-dd'))
      if (secondDate.getTime() - firstDate.getTime() <= 0) {
        return '0.00'
      }
      var diff = Math.abs(secondDate.getTime() - firstDate.getTime())
      var result = this.$global.milliFormat(diff / (1000 * 60 * 60 * 24 * 365), 2)
      return result
    },
    /**
     * 根据合同开始日期和合同结束日期设置合同状态值
     * @param contractStartDate 合同开始日期
     * @param contractEndDate 合同结束日期
     */
    setContractStatusValue (contractStartDate, contractEndDate) {
      var nowDate = new Date(this.$global.getNowDate('yyyy-MM-dd'))
      var contractStatusItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_contractStatus'][0].$children[0].item
      if (new Date(contractStartDate).getTime() <= nowDate.getTime() && nowDate.getTime() <= new Date(contractEndDate).getTime()) {
        contractStatusItem.defaultValue = '80006001'// 执行中
      } else if (nowDate.getTime() < new Date(contractStartDate).getTime()) {
        contractStatusItem.defaultValue = '80006002'// 未执行
      } else if (nowDate.getTime() > new Date(contractEndDate).getTime()) {
        contractStatusItem.defaultValue = '80006003'// 正常结束
      }
    },
    // 处理身份证自动带出信息
    autoCardInfo (value, item) {
      var formKey = item.formKey
      if (formKey === 'cardType') {
        var certificateNumberItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_certificateNumber'][0].$children[0].item
        var sexItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_sex'][0].$children[0].item
        var birthdayItem = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_birthday'][0].$children[0].item
        if (value === this.idCardCode) { // 证件类型为身份证
          sexItem.readOnly = true
          birthdayItem.readOnly = true
          var certificateNumber = certificateNumberItem.defaultValue// 证照号码
          var checkRules = certificateNumberItem.rules
          var validFlag = this.getCardNumberValidResult(checkRules, certificateNumber)
          if (certificateNumber && validFlag) {
            sexItem.defaultValue = this.getSexByIdCard(certificateNumber)
            birthdayItem.defaultValue = this.getBirthdayByIdCard(certificateNumber)
          }
        } else {
          sexItem.readOnly = false
          birthdayItem.readOnly = false
        }
      }
    },
    marriedStatusChange (value, item) {
      var formKey = item.formKey
      if (formKey === 'marriedStatus') {
        var $cpName = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_cpName'][0].$children[0]
        var $cpPhone = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_cpPhone'][0].$children[0]
        if (value !== '10017002' && value !== '') { // 不等于已婚
          $cpName.item.defaultValue = ''
          $cpName.showItem(false)
          $cpPhone.item.defaultValue = ''
          $cpPhone.showItem(false)
        } else {
          $cpName.showItem(true)
          $cpPhone.showItem(true)
        }
      }
    },
    showItem (showFlag) {
      var showFlag2 = this.item.showFlag
      if (showFlag2 !== undefined) {
        this.item.showFlag = showFlag
      } else {
        this.$set(this.item, 'showFlag', showFlag)
      }
    },
    getCardNumberValidResult (checkRules, idCard) {
      var validFlag = true
      if (checkRules && checkRules != null && checkRules.length > 0) {
        for (var i = 0; i < checkRules.length; i++) {
          let reg = new RegExp(checkRules[i].checkRule)
          if (!reg.test(idCard)) {
            validFlag = false
            break
          }
        }
      }
      return validFlag
    },
    // 根据身份证号码获取出生日期
    getBirthdayByIdCard (idCard) {
      let birthday = ''
      if (idCard.length == 18) {
        birthday = idCard.substr(6, 8)
        return birthday.replace(/(.{4})(.{2})/, '$1-$2-')
      } else if (idCard.length == 15) {
        birthday = '19' + idCard.substr(6, 6)
        return birthday.replace(/(.{4})(.{2})/, '$1-$2-')
      } else {
        return birthday
      }
    },
    // 通过身份证号码获取性别
    getSexByIdCard (idCard) {
      if (idCard.length == 18) {
        return idCard.charAt(16) % 2 == 0 ? '2' : '1'
      } else if (idCard.length == 15) {
        return idCard.charAt(14) % 2 == 0 ? '2' : '1'
      } else {
        return ''
      }
    },
    // 通过下拉选项的值获取联动下拉框的option
    getLinkageOptions (value, itemOptions) {
      if (itemOptions instanceof Array) {
        for (var i = 0; i < itemOptions.length; i++) {
          if (value == itemOptions[i].id) {
            return itemOptions[i].child
          }
        }
      }
      return []
    },
    // 用于回显解析
    parseEcho () {
      var defaultValue = this.item.defaultValue
      if (defaultValue != undefined && defaultValue != null && defaultValue !== '') {
        if (this.item.formTypeCode == 3) { // 日期
          this.item.defaultValue = this.$moment(defaultValue).format('YYYY-MM-DD')
        } /* else if (this.item.formTypeCode == 4) {//小时分钟
          this.item.defaultValue = this.$moment(defaultValue).format('HH:mm:ss')
        } */ else if (this.item.formTypeCode == 5) { // 时间
          this.item.defaultValue = this.$moment(defaultValue).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      if (this.item.formTypeCode == 6) { // 下拉选项
        var sourceFormKey = this.item.sourceFormKey// sourceFormKey 字段表示当前下拉框被联动的下拉字段的formKey
        if (sourceFormKey && sourceFormKey != null && sourceFormKey !== '') {
          try {
            var sourceItemRefs = this.$parent.$parent.$parent.$parent.$refs[this.code + '_dynamicForm_' + this.index + '_' + sourceFormKey]
            if (sourceItemRefs == undefined || sourceItemRefs == null || sourceItemRefs.length == 0) {
              throw new Error('被联动的下拉项【' + sourceFormKey + '】不存在，请检查字段配置或字段排序是否有误')
            } else {
              var sourceItem = sourceItemRefs[0].$children[0]
              var sourceValue = sourceItem.item.defaultValue
              if (sourceValue != null && sourceValue !== '') {
                this.item.options = this.getLinkageOptions(sourceValue, sourceItem.item.options)
              } else {
                this.item.options = []
              }
            }
          } catch (e) {
            // console.error(e)
            // console.error(e.message)
          }
        }
      }
    },

    //  上传附件
    delFile (file, fileList) {
      this.fileName = ''
      this.item.defaultValue = ''
      this.$parent.validate()
    },
    beforeUpload (file, fileList) {
      this.uploadLoading = true
      const isLt8M = file.size / 1024 / 1024 < 8
      if (!isLt8M) {
        this.uploadLoading = false
        this.$message.warning('附件大小不可超过8M!')
      }
      return isLt8M
    },
    // 上传成功后
    uploadSuccess (response, file, fileList) {
      if (response.code == 0) {
        this.fileName = file.name
        this.item.defaultValue = response.data.id
        this.$parent.validate()
      } else {
        this.$message.errow('系统异常')
      }
      this.uploadLoading = false
    },

    // 获取附件信息
    getFileInfo (id) {
      if(id && id!= null && id!== ''){
        this.$http({
          url: '/sys/getFile/' + id,
          method: 'get',
          params: {}
        }).then(({ data }) => {
          if (data.code === 0) {
            this.fileName = data.data.orginalName
          } else {
            this.$message.errow('系统异常')
            this.fileName = ''
          }
        })
      }else {
        this.fileName = ''
        this.filePath = ''
      }
    },

    //  下载文件
    downFile () {
      this.$downloadFile('/sys/download/' + this.item.defaultValue, 'get', {})
    }
  },
  mounted () {
  }
}
</script>
<style lang='less' scoped>
  .h-auto-select{
    .el-select-dropdown__item:hover{
      background: #f0f9eb !important;
    }
  }
</style>
