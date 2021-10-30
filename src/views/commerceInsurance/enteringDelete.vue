<template>
    <div class="content">
      <!-- 导航 -->
      <breadcrumb :data="pathData"></breadcrumb>
      <div class="fr header-button">
        <el-button icon="el-icon-refresh" size="small" @click="handleRefresh">刷新</el-button>
        <router-link to="/commerceInsurance/insuranceAdmin">
          <el-button class="ml-20" icon="el-icon-arrow-left" size="small">返回</el-button>
        </router-link>
      </div>

      <header class=" clearfix">
        <h3 class="fl">减员</h3>
      </header>

      <div class="header-search">
        <el-select class="search-select" v-model="searchWord" value-key="employeeId"  filterable remote reserve-keyword  placeholder="请输入姓名、证件号码" @change="empChange" :remote-method="remoteMethod">
          <template slot="prefix"><i class="el-icon-search ic-search"></i></template>
          <el-option v-for="(item,index) in employeeList" :key="index" :label="item.name + '-' + item.idCard" :value="item"></el-option>
        </el-select>
      </div>

      <div class="text-center" v-show="(!searchWord.idCard)||searchWord.idCard==''">
        <i class="ic-employee-empty"></i>
        <p class="mt-30">请先搜索人员！</p>
      </div>

      <div v-show="searchWord.idCard&&searchWord.idCard!=''">
        <div class="form-detail pb-20" style="background:#fff;">
        <div class="detail-title mt-20">
          <p class="fl user-name" v-text="searchWord.name ? searchWord.name : '请选择员工'"></p>
          <p class="fl ml-20 mr-40" v-text="searchWord.idCard ? '证件号码：' + searchWord.idCard : '' "></p>
        </div>

        <!-- 员工方案 -->
        <div class="employee pl-20 pr-20">
          <div class="employee-title">
            <img class="fl ml-10" src="../../assets/images/icons/ic-account-type31.png" alt="">
            <p class="fl title-name">员工方案</p>
          </div>

          <!--展示-->
          <el-form :inline="true" class="demo-form-inline mt-20" v-show="employeeForm.length == 0">
            <el-form-item label="方案代码:" style="position: relative;">
              <el-input disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="结束时间:" style="position: relative;" disabled="disabled">
              <el-date-picker type="date" v-model="value" disabled="disabled"></el-date-picker>
              <img style="position: absolute; right:-32px; top:13px;" src="../../assets/images/icons/ic-account-type34.png" alt="">
            </el-form-item>
            <el-form-item label="岗位:" style="visibility:hidden;">
              <el-input></el-input>
            </el-form-item>
          </el-form>

          <!--添加-->
          <el-form v-for="(item, index) in employeeForm" :model="employeeForm[index]" :ref="'employeeForm' + index" :key="index" :inline="true" class="demo-form-inline mt-20">
            <el-form-item label="方案代码:" style="position: relative;">
              <el-input :value="item.productCode" :readOnly="true"></el-input>
            </el-form-item>
            <el-form-item label="结束时间:" style="position: relative;" prop="endDate">
              <el-date-picker @input="selectEndDate(1, index)" v-if="employeeForm[index].settleTypeTran == 1" value-format="yyyy-MM-dd" v-model="employeeForm[index].endDate" type="date" style="width:260px;"
                              :value-format="empDateFormat[index]" :format="empDateFormat[index]"></el-date-picker>
              <el-date-picker @input="selectEndDate(1, index)" v-if="employeeForm[index].settleTypeTran == 2" value-format="yyyy-MM-dd" v-model="employeeForm[index].endDate" type="month" style="width:260px;"
                              :value-format="empDateFormat[index]" :format="empDateFormat[index]"></el-date-picker>
              <img style="position: absolute; right:10px; top:13px;" src="../../assets/images/icons/ic-account-type34.png" alt="">
            </el-form-item>
             <el-form-item label="岗位:" style="visibility:hidden;">
                <el-input></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 家属方案 -->
        <div class="family pl-20 pr-20" v-show="familyForm.length > 0">
          <div class="employee-title">
            <img class="fl ml-10" src="../../assets/images/icons/ic-account-type32.png" alt="">
            <p class="fl title-name">家属方案</p>
          </div>

          <!--添加-->
          <el-form v-for="(item, index) in familyForm" :model="familyForm[index]" :ref="'familyForm' + index" :key="index" :inline="true" class="demo-form-inline mt-20">
            <div class="ml-13">
              <el-form-item label="家属名称:" style="position: relative;">
                <el-input :value="item.empName" :readOnly="true"></el-input>
              </el-form-item>
              <el-form-item label="证件类型:">
                <el-input :value="getTextByCode(item.cardType, 1)" :readOnly="true"></el-input>
              </el-form-item>
              <el-form-item label="证件号码:">
                <el-input :value="item.empIdCard" :readOnly="true"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="与员工关系:" style="position: relative;">
                <el-input :value="getTextByCode(item.relate, 2)" :readOnly="true"></el-input>
              </el-form-item>
              <el-form-item label="方案代码:">
                <el-input :value="item.productCode" :readOnly="true"></el-input>
              </el-form-item>
              <el-form-item label="结束时间:" style="position: relative;" prop="endDate">
                <el-date-picker @input="selectEndDate(2, index)" v-if="familyForm[index].settleTypeTran == 1" value-format="yyyy-MM-dd" v-model="familyForm[index].endDate" type="date" style="width:260px;"
                                :value-format="familyDateFormat[index]" :format="familyDateFormat[index]"></el-date-picker>
                <el-date-picker @input="selectEndDate(2, index)" v-if="familyForm[index].settleTypeTran == 2" value-format="yyyy-MM-dd" v-model="familyForm[index].endDate" type="month" style="width:260px;"
                                :value-format="familyDateFormat[index]" :format="familyDateFormat[index]"></el-date-picker>
                <img style="position: absolute; right:10px; top:10px;" src="../../assets/images/icons/ic-account-type34.png" alt="">
              </el-form-item>
            </div>
            <div class="ml-13">
              <div style="width:355px;">
                <el-form-item label="性别:" style="position: relative; margin-left: 30px;" v-show="item.sex == 1 || item.sex == 2">
                  <el-radio v-model="item.sexShow" label=1 disabled>男</el-radio>
                  <el-radio v-model="item.sexShow" label=2 disabled>女</el-radio>
                </el-form-item>
              </div>
              <div style="width:355px;">
                <el-form-item label="生日:" style="position: relative; margin-left: 35px;" v-show="item.birthday">
                  <el-input :value="$moment(item.birthday).format('YYYY-MM-DD')" :readOnly="true"></el-input>
                </el-form-item>
              </div>
              <div style="width:355px;">
                <el-form-item label="有无社保:" style="position: relative; margin-left: 13px;" v-show="item.havaSocial && item.havaSocial != 0">
                  <el-radio v-model="item.havaSocialShow" label="1" disabled>有</el-radio>
                  <el-radio v-model="item.havaSocialShow" label="2" disabled>无</el-radio>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 表格 -->
      <footer class="detail-footer mt-20">
        <div class="footer-title">
          <p class="fl user-name" v-text="searchWord.name ? searchWord.name : '请选择员工'"></p>
        </div>
        <el-Table :data="tableDatas" :tableHeight="tableHeight" height="500" :paging="false" :showIndex="true" :header-row-style="{background:'#f2f2f2',color:'#606266'}" border :span-method="objectSpanMethod">
          <el-table-column prop="code" label="商保方案代码" width="300" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="salePrice" label="保费" width="300" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="itemName" label="险种名称" width="500" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="保险责任" width="500" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="limitDesc" label="保额" min-width="200" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        </el-Table>
        <div class="submit" style="background:#fff;">
          <el-button class="mt-70" type="primary" @click="handleSubmit" :loading="saveBtnLoading">提交</el-button>
        </div>
      </footer>
      </div>
    </div>
</template>
<script>
export default {
  inject: ['reload'],
  data () {
    return {
      pathData: [
        { name: '商保' },
        { name: '投保管理', path: '/commerceInsurance/insuranceAdmin' },
        { name: '录入商保减员' }
      ],
      value: '',
      saveBtnLoading: false,
      searchWord: {}, // 搜索人员
      employeeList: [], // 人员列表
      employeeForm: [], // 员工方案
      familyForm: [], // 家属方案
      tableDatas: [], // 表格数据

      rowAndColumn: {}, // 第一列
      rowAndColumn1: {}, // 第二列
      rowAndColumn2: {}, // 第三列

      empDateFormat: [],
      familyDateFormat: [],

      cardType: [], // 证件类型
      relation: [], // 与员工关系
    }
  },

  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 550 + 'px'
    }
  },

  created () {
    this.$nextTick(() => {

    })
  },

  mounted () {
    this.getEmployeeList()
    this.getRelations()
    this.getCardTypes()
  },

  methods: {
    // 远程过滤人员
    remoteMethod (query) {
      let that = this
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          that.searchWord.loading = false
          that.$http({
            url: '/api/comminsure/employee/search',
            method: 'post',
            data: this.$qs.stringify({
              custId: this.$store.state.userData.custId,
              key: query
            })
          }).then(({ data }) => {
            this.employeeList = data.data[0]
          })
        }, 500)
      } else {
        this.employeeList = []
      }
    },
    // 刷新
    handleRefresh () {
      this.reload()
    },

    // 获取人员列表
    getEmployeeList () {
      this.$http({
        url: '/api/comminsure/employee/search',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId,
          key: this.searchWord.name ? this.searchWord.name : ''
        })
      }).then(({ data }) => {
        this.employeeList = data.data[0]
      })
    },

    // 选择人员
    empChange () {
      // 人员承保的方案
      // 先置空人员方案和家属方案
      this.employeeForm = []
      this.familyForm = []
      this.tableDatas = []
      // 获取表格数据
      this.$http({
        url: '/api/comminsure/reduce/getAllowDescComminsure',
        method: 'post',
        data: this.$qs.stringify({
          customerId: this.$store.state.userData.custId,
          idCard: this.searchWord.idCard
        })
      }).then(({ data }) => {
        var allInfos = data.data[0]
        // 将返回数据构建成人员数组和家属数组
        for (var i = 0; i < allInfos.length; i++) {
          // relate=1是员工，其他的是家属
          var allInfo = allInfos[i]
          if (allInfo.sex) {
            allInfo.sexShow = allInfo.sex.toString()
          }
          if (allInfo.havaSocial) {
            allInfo.havaSocialShow = allInfo.havaSocial.toString()
          }
          if (allInfo.relate == 1) {
            this.employeeForm.push(allInfo)
            this.empDateFormat.push('yyyy-MM-dd')
          } else {
            this.familyForm.push(allInfo)
            this.familyDateFormat.push('yyyy-MM-dd')
          }
          this.getTableData(allInfo.productId, allInfo.startDate, allInfo.relate, allInfo.empName, i)
        }
      })
    },

    // 获取表格数据
    getTableData (productId, startDate, relate, empName, index) {
      this.$http({
        url: '/api/comminsure/product/detail?custId=' + this.$store.state.userData.custId + '&fyDate=' + startDate + '&productId=' + productId,
        method: 'post',
        data: {}
      }).then(({ data }) => {
        if (data.data[0] && data.data[0].length > 0) {
          for (var i = 0; i < data.data[0].length; i++) {
            let thisData = data.data[0][i]
            if (relate != 1) {
              thisData.code += '(家属：' + empName + ')'
            }
            thisData.tag = relate == 1 ? 1 : 2
            thisData.index = index
          }
        }
        this.tableDatas.push(...data.data[0])
        // 统计合并单元格相关信息
        this.rowAndColumn = {}
        this.rowAndColumn1 = {}
        this.rowAndColumn2 = {}
        for (var i = 0; i < this.tableDatas.length; i++) {
          var tableData = this.tableDatas[i]
          // 用方案code，tag，index区分唯一的一份明细数据(第一列)
          if (this.rowAndColumn[tableData.code + tableData.tag + tableData.index]) {
            this.rowAndColumn[tableData.code + tableData.tag + tableData.index] += 1
          } else {
            this.rowAndColumn[tableData.code + tableData.tag + tableData.index] = 1
          }
          // 用方案code，tag，index，保费区分唯一的一份明细数据(第二列)
          if (this.rowAndColumn1[tableData.code + tableData.tag + tableData.index + tableData.salePrice]) {
            this.rowAndColumn1[tableData.code + tableData.tag + tableData.index + tableData.salePrice] += 1
          } else {
            this.rowAndColumn1[tableData.code + tableData.tag + tableData.index + tableData.salePrice] = 1
          }
          // 用方案code，tag，index，保费，险种名称区分唯一的一份明细数据(第三列)
          if (this.rowAndColumn2[tableData.code + tableData.tag + tableData.index + tableData.salePrice + tableData.itemName]) {
            this.rowAndColumn2[tableData.code + tableData.tag + tableData.index + tableData.salePrice + tableData.itemName] += 1
          } else {
            this.rowAndColumn2[tableData.code + tableData.tag + tableData.index + tableData.salePrice + tableData.itemName] = 1
          }
        }
      })
    },

    // 合并单元格(row是行的数据 column是列数据 rowIndex 第几行 columnIndex 第几列)
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // rowAndColumn这个用来记录对应的方案出现了多少次
        if (this.rowAndColumn[row.code + row.tag + row.index] !== 'dealed') {
          var rowNum = this.rowAndColumn[row.code + row.tag + row.index]
          this.rowAndColumn[row.code + row.tag + row.index] = 'dealed'
          return {
            // 要合并的列数就是方案出现的次数
            rowspan: rowNum,
            colspan: 1
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (columnIndex == 1) {
        if (this.rowAndColumn1[row.code + row.tag + row.index + row.salePrice] !== 'dealed') {
          var rowNum = this.rowAndColumn1[row.code + row.tag + row.index + row.salePrice]
          this.rowAndColumn1[row.code + row.tag + row.index + row.salePrice] = 'dealed'
          return {
            rowspan: rowNum,
            colspan: 1
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (columnIndex == 2) {
        if (this.rowAndColumn2[row.code + row.tag + row.index + row.salePrice + row.itemName] !== 'dealed') {
          var rowNum = this.rowAndColumn2[row.code + row.tag + row.index + row.salePrice + row.itemName]
          this.rowAndColumn2[row.code + row.tag + row.index + row.salePrice + row.itemName] = 'dealed'
          return {
            rowspan: rowNum,
            colspan: 1
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },

    // 选择结束时间
    selectEndDate (type, index) {
      if (type === 1) {
        if (this.employeeForm[index].settleTypeTran === 2) {
          if (this.employeeForm[index].endDate) {
            let endDate = this.employeeForm[index].endDate.split('-')
            let endDateFormat = this.formatEndDate(endDate)
            this.employeeForm[index].endDate = endDateFormat.join('-')
            this.empDateFormat[index] = 'yyyy-MM-' + endDateFormat[2]
          }
        }
      } else {
        if (this.familyForm[index].settleTypeTran === 2) {
          if (this.familyForm[index].endDate) {
            let endDate = this.familyForm[index].endDate.split('-')
            let endDateFormat = this.formatEndDate(endDate)
            this.familyForm[index].endDate = endDateFormat.join('-')
            this.familyDateFormat[index] = 'yyyy-MM-' + endDateFormat[2]
          }
        }
      }
    },

    // 获取每月最后一天
    formatEndDate (endDate) {
      if (endDate[1] === '01' || endDate[1] === '03' || endDate[1] === '05' || endDate[1] === '07' || endDate[1] === '08' || endDate[1] === '10' || endDate[1] === '12') {
        endDate.splice(2, 1, '31')
      } else if (endDate[1] === '04' || endDate[1] === '06' || endDate[1] === '09' || endDate[1] === '11') {
        endDate.splice(2, 1, '30')
      } else if (endDate[0] % 4 == 0 && endDate[0] % 100 != 0 || endDate[0] % 400 == 0) {
        endDate.splice(2, 1, '29')
      } else {
        endDate.splice(2, 1, '28')
      }
      return endDate
    },

    // 校验结束日期
    checkEndDate (rule, value, callback, tag) {
      // 员工方案
      if (tag == 0) {
        // 如果有家属方案，那么员工方案的结束日期不是必填的
        if (!value && this.familyForm.length == 0) {
          callback(new Error('请选择结束日期'))
        }
      }
      // 家属方案
      if (tag == 1 && this.$lodash.isEmpty(value)) {
        callback(new Error('请选择结束日期'))
      }
      callback()
    },

    // 获取证件类型
    getCardTypes () {
      this.$http({
        url: '/api/sys/getDictByKey',
        method: 'get',
        params: {
          dictKey: '50010'
        }
      }).then(({data}) => {
        this.cardType = data.data[0]
      })
    },

    // 获取与员工关系
    getRelations () {
      this.$http({
        url: '/api/sys/getDictByKey',
        method: 'get',
        params: {
          dictKey: '20103'
        }
      }).then(({data}) => {
        this.relation = data.data[0]
      })
    },

    // 根据字典值获取名称
    getTextByCode(code, tag) {
      // 证件类型
      if (tag == 1) {
        for (var i = 0; i < this.cardType.length; i++) {
          if (code == this.cardType[i].dictCode) {
            return this.cardType[i].dictName
          }
        }
      }
      // 与员工关系
      if (tag == 2) {
        for (var i = 0; i < this.relation.length; i++) {
          if (code == this.relation[i].dictCode) {
            return this.relation[i].dictName
          }
        }
      }
      return "";
    },

    // 提交
    handleSubmit () {
      if (this.employeeForm.length == 0) {
        this.$message.warning('无数据可提交')
        return
      }
      var empFormValidate = true
      var familyFromValidate = true
      for (var i = 0; i < this.employeeForm.length; i++) {
        this.$refs['employeeForm' + i][0].validate((valid) => {
          empFormValidate = !valid ? false : valid
        })
      }
      for (var i = 0; i < this.familyForm.length; i++) {
        this.$refs['familyForm' + i][0].validate((valid) => {
          familyFromValidate = !valid ? false : valid
        })
      }
      if (empFormValidate && familyFromValidate) {
        // 构建提交参数
        var submitData = []
        // 员工
        for (var i = 0; i < this.employeeForm.length; i++) {
          let employeeInfo = this.employeeForm[i]
          submitData.push({
            cardType: this.searchWord.cardType,
            changeType: '2',
            customerId: String(this.$store.state.userData.custId),
            empIdCard: this.searchWord.idCard,
            empName: this.searchWord.name,
            jobPosition: employeeInfo.jobPosition,
            productCode: employeeInfo.productCode,
            productId: String(employeeInfo.productId),
            staffOrFamily: '1',
            startDate: employeeInfo.startDate,
            endDate: employeeInfo.endDate
          })
        }
        // 家属
        for (var i = 0; i < this.familyForm.length; i++) {
          let familyInfo = this.familyForm[i]
          submitData.push({
            cardType: familyInfo.cardType,
            changeType: '2',
            customerId: String(this.$store.state.userData.custId),
            empIdCard: familyInfo.empIdCard,
            empName: familyInfo.empName,
            productCode: familyInfo.productCode,
            productId: String(familyInfo.productId),
            relate: familyInfo.relate,
            staffOrFamily: '2',
            startDate: familyInfo.startDate,
            endDate: familyInfo.endDate,
            sex: familyInfo.sex,
            havaSocial: familyInfo.havaSocial,
            birthday: familyInfo.birthday
          })
        }
        this.saveBtnLoading = true
        this.$http({
          url: '/api/comminsure/declare/save',
          method: 'POST',
          data: submitData
        }).then(({ data }) => {
          this.saveBtnLoading = false
          this.$message.success('保存成功')
          this.$router.push('/commerceInsurance/insuranceAdmin')
        }).catch((data) => {
          this.saveBtnLoading = false
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
  @import '../../assets/css/entering/enteringAddOrDelete.less';
</style>
