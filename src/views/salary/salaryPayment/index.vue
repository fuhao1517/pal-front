<template>
  <div class="spl-container content">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <!-- 搜索框 -->
    <div class="search-row clearfix pt-15" style="padding-bottom: 15px;">
      <div class="filter-date fl">
        <span class="inlineBlock w-90 text-right">薪酬年月: </span>
        <el-date-picker v-model="searchForm.yearDate" value-format="yyyy-MM" class="date-editor2 ml-10" type="month" placeholder="选择日期" clearable></el-date-picker>
      </div>
      <div class="fl ml-100 lh-32">
        <span class="inlineBlock w-90 text-right mr-10">发放状态: </span>
        <el-checkbox-group class="inlineBlock" v-model="searchForm.status">
          <el-checkbox label="0" checked>待发放</el-checkbox>
          <el-checkbox label="2" checked>发放成功</el-checkbox>
          <el-checkbox label="1" checked>发放失败</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="add-data fr">
        <el-button type="primary" class="w-60" @click="getTableData2"> 查询 </el-button>
        <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
          <div class="show-select-form clearfix" style="padding-left: 8px;padding-right: 8px;">
            <div class="filter-date fl clearfix">
              <p class="fl w-90 text-right">证件号码: </p>
              <el-input type="textarea" class="w-220 ml-10" v-model="selectForm.idCards" placeholder="一行只可输入一个身份证"></el-input>
              <span class="inlineBlock text-red ml-10 w-90">已输入{{selectForm.searchIdCardsLength}}个</span>
            </div>
            <div class="filter-date fl clearfix">
              <span class="fl w-90 text-right">银行账号: </span>
              <el-input type="textarea" class="w-220 ml-10" v-model="selectForm.bankAccounts" placeholder="一行只可输入一个银行账号"></el-input>
              <span class="text-red ml-10">已输入{{selectForm.searchBankAccountsLength}}个</span>
            </div>
            <div class="fr">
              <el-button size="small" type="primary" class="s-btn" @click="getTableData2" icon="el-icon-search">查询</el-button>
              <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
            </div>
          </div>
          <el-button slot="reference" icon="ic-filter-blue" class="ml-15">筛选</el-button>
        </el-popover>
      </div>
    </div>
    <div class="handle-btn" v-show="this.failCount>0">
      <p><i class="el-icon-warning ml-50 text-orange font-20" style="vertical-align: middle;margin-top: -3px;"></i> <span v-text="this.failCount" class="text-red ml-10"></span>条发放失败记录。<el-button type="text" @click="openSalaryReissueDrawer"><span class="text-red">重新发放</span></el-button>
      </p>
    </div>
    <!-- 表格 -->
    <dTable @fetch="getTableData" ref="salaryPaymentTable" :key="refreshTable" :tableHeight="tableHeight" :showIndex="true" :showSelection="false" :reserve-selection="true">
      <el-table-column prop="empName" label="姓名" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="empIdCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="empBankDictName" label="银行名称" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="empAccountName" label="银行账户名" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="empBankAccount" label="银行账户" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="empBankDictCode" label="开户信息" min-width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ffMonth" label="薪酬月份" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-text="$global.dateFormat(scope.row.ffMonth)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="扣缴义务人" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="itemTypeDesc" label="收入类型" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="actualfee" label="实发金额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="paidStatus" label="发放状态" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="comment" label="备注" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="plannefee" label="应发金额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="socialSecurityAmount" label="个人社保合计" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="accfundAmount" label="个人公积金" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAmount" label="个税" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <!-- <el-table-column prop="plannedSalary" label="基本工资" width="150" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column v-for="col in this.dynamicFields" :key="col.code" :formatter="formatterAmount" :prop="col.code" :label="col.name" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{$global.milliFormat(scope.row['items'] ? scope.row['items'][col.code] : '')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAdditionalItem0" label="累计减除费用" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAdditionalItem1" label="累计子女教育扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAdditionalItem7" label="累计赡养老人扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAdditionalItem4" label="累计住房贷款利息" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAdditionalItem5" label="累计租房租金扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAdditionalItem9" label="累计继续教育扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAdditionalItem6" label="累计大病医疗扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <template slot="pagination-btns">
        <el-button size="small" icon="ic-export-blue" @click="exportTableData" class="btn--border-blue ml-10">导出</el-button>
      </template>
    </dTable>

    <el-drawer title="重新发放" :visible.sync="drawer" :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <template slot="title">
        <div>
          <span>重新发放</span>
          <div class="search-row-btn mr-60">
            <el-button type="primary" size="small" @click="salaryReissue">确定重发</el-button>
          </div>
        </div>
      </template>
      <div>
        <p style="padding: 25px 30px 0 30px;">总人数：<span v-text="this.failCount" class="ml-5 mr-200"></span> 总金额：<span v-text="this.totalAmount" class="ml-5"></span>元</p>
        <div class="drawer-content" style="padding: 20px 30px;">
          <dTable @fetch="getSalaryReissueTableData" ref="salaryReissueTable" :page-sizes="[20, 50, 100, 500, 1000, 2000]" :tableHeight="tableHeight" :showIndex="true" :showSelection="true" @selection-change="selectChange" rowKey="billId" :reserve-selection="true">
            <el-table-column prop="empName" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empIdCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="手机号码" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empBankAccount" label="薪资卡号" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empBankDictName" label="银行名称" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empAccountName" label="银行账户名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empBankDictCode" label="开户信息" min-width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ffMonth" label="薪酬月份" min-width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-text="$global.dateFormat(scope.row.ffMonth)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="companyName" label="扣缴义务人" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="itemTypeDesc" label="薪酬类型" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="actualfee" label="实发金额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="paidStatus" label="发放状态" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="comment" label="备注" width="150" :show-overflow-tooltip="true"></el-table-column>
            <template slot="pagination-btns">
              <el-button size="small" icon="ic-export-blue" @click="exportFailData" class="btn--border-blue ml-10">导出</el-button>
            </template>
          </dTable>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import dTable from '../../../components/common/table'
export default {
  name: 'index',
  data () {
    return {
      pathData: [{ name: '薪酬管理' }, { name: '薪酬发放列表' }],
      searchForm: {
        status: [],
        yearDate: ''
      },
      drawer: false,
      statusCheckList: [],
      selectItems: [],
      failCount: '',
      totalAmount: '',
      selectForm: {
        idCards: '',
        setIdCards: [],
        searchIdCardsLength: 0,
        bankAccounts: '',
        setBankAccounts: [],
        searchBankAccountsLength: 0
      },
      dynamicFields: [],
      dynamicFields1: [],
      dynamicFields2: [],
      notInDynamicFields: ['应发工资', '实发工资', '个人社保合计', '个人公积金', '工资个税'],
      refreshTable: new Date().getTime(),
      showSelectForm: false,
      tableDataUrl: '/api/salary/salaryDetail/detail',
      exportUrl: '/api/salary/salaryDetail/export',
      salaryReissuePath: '/api/salary/resendFailBill',
      countUrl: '/api/salary/salaryDetail/countSalaryDetail'
    }
  },
  components: { dTable },
  created () {
    this.searchForm.yearDate = this.$moment(new Date()).format('YYYY-MM')
    this.getDynamicField(1)
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 300 + 'px'
    }
  },
  watch: {
    'selectForm.idCards' (newValue, oldValue) {
      var obj = this.$global.getIdCardRow(this.selectForm.idCards)
      this.selectForm.searchIdCardsLength = obj.num
      this.selectForm.setIdCards = obj.value
    },
    'selectForm.bankAccounts' (newValue, oldValue) {
      var obj = this.$global.getIdCardRow(this.selectForm.bankAccounts)
      this.selectForm.searchBankAccountsLength = obj.num
      this.selectForm.setBankAccounts = obj.value
    }
  },
  methods: {
    formatterAmount (row, column, cellValue, index) {
      return this.$global.milliFormat(cellValue)
    },
    getTableData (params = []) {
      params = [
        { property: 'taxMonth', value: this.searchForm.yearDate == null ? '' : this.searchForm.yearDate },
        { property: 'paidStatus', value: this.searchForm.status }
      ]
      this.params = params
      this.$refs.salaryPaymentTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl
      })
      this.getCount()
    },
    // 展开筛选框的搜索
    getTableData2 (params = []) {
      params = [
        { property: 'taxMonth', value: this.searchForm.yearDate == null ? '' : this.searchForm.yearDate },
        { property: 'paidStatus', value: this.searchForm.status },
        { property: 'idCards', value: this.selectForm.setIdCards },
        { property: 'bankAccount', value: this.selectForm.setBankAccounts }
      ]
      this.params = params
      this.$refs.salaryPaymentTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl
      })
      this.getCount()
    },
    getCount (params = []) {
      params = [
        { property: 'taxMonth', value: this.searchForm.yearDate == null ? '' : this.searchForm.yearDate },
        { property: 'paidStatus', value: [] }
      ]
      var that = this
      this.$http({
        url: this.countUrl,
        method: 'POST',
        data: params
      }).then(({ data }) => {
        that.failCount = data.data[0].failTotal
        that.totalAmount = data.data[0].totalAmount
      }).catch((data) => {
      })
    },
    // 获取工资或年终奖的动态字段
    async getDynamicField (type) {
      var that = this
      await this.$http({
        url: '/api/salary/listDynamicItem?type=' + type,
        method: 'post',
        data: {}
      }).then(({ data }) => {
        console.log()
        if (type == 2) {
          that.dynamicFields2 = data.data[0]
          that.getDynamicFieldTotal()
        } else {
          that.dynamicFields1 = data.data[0]
          that.getDynamicField(2)
        }
      })
    },
    getDynamicFieldTotal () {
      let arr = this.$lodash.concat(this.dynamicFields1, this.dynamicFields2)
      console.log(arr)
      let deWeightThree = () => {
        let map = new Map()
        for (let item of arr) {
          if (!map.has(item.code) && (this.notInDynamicFields.indexOf(item.name) == -1)) {
            map.set(item.code, item)
          }
        }
        return [...map.values()]
      }
      this.dynamicFields = deWeightThree()
      this.refreshTable = new Date().getTime()
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    formatterAmount (row, column, cellValue, index) {
      return this.$global.milliFormat(cellValue)
    },
    // 重发数据table
    getSalaryReissueTableData (params = []) {
      params = [
        { property: 'taxMonth', value: this.searchForm.yearDate == null ? '' : this.searchForm.yearDate },
        { property: 'paidStatus', value: ['1'] },
        { property: 'idCards', value: this.selectForm.setIdCards },
        { property: 'bankAccount', value: this.selectForm.setBankAccounts }
      ]
      this.$refs.salaryReissueTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl
      })
    },
    selectChange () {
      this.selectItems = this.$refs.salaryReissueTable.selections
    },
    // 重置搜索框
    resetSelectForm () {
      this.selectForm.idCards = ''
      this.selectForm.setIdCards = []
      this.selectForm.searchIdCardsLength = 0
      this.selectForm.bankAccounts = ''
      this.selectForm.setBankAccounts = []
      this.selectForm.searchBankAccountsLength = 0
    },
    openSalaryReissueDrawer () {
      this.drawer = true
      this.$nextTick(() => {
        this.getSalaryReissueTableData()
      })
    },
    // 重新发放
    salaryReissue () {
      var params = {}
      var recCodes = this.$refs.salaryReissueTable.getSelectionsArr('recCode')
      var ids = this.$refs.salaryReissueTable.getSelectionsArr('id')
      if (recCodes.length === 0) {
        this.$message.error('请先勾选数据！')
        return
      } else {
        params = {
          recCode: recCodes,
          ids: ids
        }
      }
      this.$http({
        url: this.salaryReissuePath,
        method: 'POST',
        data: params
      }).then(({ data }) => {
        this.$message.success('发放成功')
        this.getTableData()
        this.drawer = false
      })
    },
    exportTableData () {
      this.$downloadFile(this.exportUrl, 'post', {
        taxMonth: this.searchForm.yearDate == null ? '' : this.searchForm.yearDate,
        paidStatus: this.searchForm.status,
        idCards: this.selectForm.setIdCards,
        bankAccount: this.selectForm.setBankAccounts,
        source: 'salaryList'
      }, this.$global.EXCEL)
    },
    exportFailData () {
      var ids = this.$refs.salaryReissueTable.getSelectionsArr('id')
      this.$downloadFile(this.exportUrl, 'post', {
        taxMonth: this.searchForm.yearDate == null ? '' : this.searchForm.yearDate,
        paidStatus: ['1'],
        idCards: this.selectForm.setIdCards,
        ids: ids,
        bankAccount: this.selectForm.setBankAccounts,
        source: 'sencondly'
      }, this.$global.EXCEL)
    }
  }
}
</script>

<style lang='less' scoped>
.handle-btn {
  height: 50px;
  line-height: 50px;
  background: rgba(242, 242, 242, 1);
  border: 1px solid rgba(221, 221, 221, 1);
  border-bottom: none;
}
</style>
