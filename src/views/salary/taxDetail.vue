<template>
  <div class="spl-container content">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <!-- 搜索框 -->
    <div class="search-row clearfix pt-15" style="padding-bottom: 15px;">
      <div class="filter-date fl">
        <span class="inlineBlock w-90 text-right">税款所属期: </span>
        <el-date-picker v-model="searchForm.yearDate" value-format="yyyy-MM" class="date-editor2 ml-10" type="month" placeholder="选择日期" clearable></el-date-picker>
      </div>
      <div class="filter-date fl">
        <span class="inlineBlock w-350 text-right">扣缴义务人: </span>
        <el-select multiple collapse-tags class="w-220 ml-10" v-model="searchForm.optrCompIds" filterable>
          <el-option v-for="(item, index) in optrComps" :key="index" :label="item.name" :value="String(item.id)"></el-option>
        </el-select>
      </div>
      <div class="add-data fr">
        <el-button type="primary" class="w-60" @click="getTableData2"> 查询 </el-button>
        <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
          <div class="show-select-form">
            <el-form ref="selectForm" :model="selectForm" class="select-form">
              <el-row class="select-form-el-row" type="flex" justify="space-around">
                <el-col :span="6" class="select-form-el-col">
                  <el-form-item label="证件号码:">
                    <el-input type="textarea" class="w-200" v-model="selectForm.idCards" placeholder="一行只可输入一个身份证"></el-input>
                    <span class="text-red ml-10">已输入{{selectForm.searchIdCardsLength}}个</span>
                  </el-form-item>
                </el-col>
                <div class="filter-date fl">
                  <span class="inlineBlock w-350 text-right">所得项目: </span>
                  <el-select multiple class="w-220 ml-10" value-key="dictCode" v-model="selectForm.itemTypeCodes" filterable @change="">
                    <el-option v-for="(item, index) in itemTypes" :key="index" :label="item.dictName" :value="item"></el-option>
                  </el-select>
                </div>
                <el-col :span="4" class="select-form-el-col">
                  <el-button size="small" type="primary" class="s-btn" @click="getTableData2" icon="el-icon-search">查询</el-button>
                  <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-button slot="reference" icon="ic-filter-blue" class="ml-10">筛选</el-button>
        </el-popover>
      </div>
    </div>
    <!-- 表格 -->
    <dTable @fetch="getTableData" ref="salaryPaymentTable" :tableHeight="tableHeight" :showIndex="true" :showSelection="false" :reserve-selection="true">
      <el-table-column fixed prop="empName" label="姓名" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed prop="empIdCard" label="证照号码" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="cardTypecode" label="证照类型" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxReturnMonth" label="税款所属期" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-text="$global.dateFormat(scope.row.taxReturnMonth)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="itemTypeDesc" label="所得项目" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="plannedSalary" label="本期收入" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="thisBasePensionFee" label="本期基本养老保险费" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="thisBaseMedicalFee" label="本期基本医疗保险费" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="thisBaseUnemploymentFee" label="本期失业保险费" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="thisBaseHouseFundFee" label="本期住房公积金" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalPlannedSalary" label="累计收入额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalTaxThreshold" label="累计减除费用" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalTaxDeduction" label="累计专项扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalChildrenEducationDeduction" label="累计子女教育扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalSupportElderlyDeduction" label="累计赡养老人扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalContinueEducationDeduction" label="累计继续教育扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalHouseLoanDeduction" label="累计住房贷款利息" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalHouseRentDeduction" label="累计租房租金扣除" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxableSalary" label="累计应纳税所得额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxRate" label="税率" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="quickCalculationDeduction" label="速算扣除数" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxableSalaryAmount" label="累计应纳税额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="historyTaxAmonut" label="累计已预缴税额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="taxAmount" label="累计应补(退)税额" width="150" :formatter="formatterAmount" :show-overflow-tooltip="true"></el-table-column>
      <template slot="pagination-btns">
        <el-button size="small" icon="ic-export-blue" @click="exportTableData" class="btn--border-blue ml-10">导出数据</el-button>
      </template>
    </dTable>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
export default {
  name: 'index',
  data () {
    return {
      pathData: [{ name: '薪酬管理' }, { name: '个税明细列表' }],
      searchForm: {
        yearDate: '',
        optrCompIds: [] // 选择的扣缴义务人
      },
      selectForm: {
        idCards: '',
        setIdCards: [],
        searchIdCardsLength: 0,
        itemTypeCodes: [] // 选择的所得项目
      },
      optrComps: [], // 扣缴义务人
      itemTypes: [], // 所得项目
      showSelectForm: false,
      taxDetailQueryUrl: '/api/salary/tax/taxDetailQuery', // 扣缴义务人/所得项目url
      tableDataUrl: '/api/salary/tax/taxDetailList', // 列表url
      exportUrl: '/api/salary/tax/taxDetailExport', // 导出url
      exportParams: {} // 导出参数
    }
  },
  components: { dTable },
  created () {
    var date = new Date()
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    this.searchForm.yearDate = year + "-" + month;
    this.$nextTick(() => {
      this.getTableData()
      this.getTaxDetailQuery()
    })
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
    }
  },
  methods: {
    formatterAmount (row, column, cellValue, index) {
      return this.$global.milliFormat(cellValue)
    },
    getTableData (params = []) {
      params = [
        { property: 'taxReturnMonth', value: this.searchForm.yearDate },
        { property: 'optrId', value: this.searchForm.optrCompIds }
      ]
      this.$refs.salaryPaymentTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl,
        callback: function (data) {
        }
      })
      this.exportParams = {
        taxReturnMonth: this.searchForm.yearDate,
        optrId: this.searchForm.optrCompIds
      }
    },
    // 展开筛选框的搜索
    getTableData2 (params = []) {
      // 构建项目查询参数
      var items = this.selectForm.itemTypeCodes;
      var selectItems = [];
      if (items.length > 0) {
          for (var i = 0; i < items.length; i ++) {
            selectItems.push(String(items[i].dictCode + "," + items[i].comment))
          }
      }
      params = [
        { property: 'taxReturnMonth', value: this.searchForm.yearDate },
        { property: 'optrId', value: this.searchForm.optrCompIds },
        { property: 'idCards', value: this.selectForm.setIdCards },
        { property: 'item', value: selectItems }
      ]
      this.$refs.salaryPaymentTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl
      })
      this.exportParams = {
        taxReturnMonth: this.searchForm.yearDate,
        optrId: this.searchForm.optrCompIds,
        idCards: this.selectForm.setIdCards,
        item: selectItems
      }
    },
    // 重置搜索框
    resetSelectForm () {
      this.selectForm.idCards = ''
      this.selectForm.setIdCards = []
      this.selectForm.searchIdCardsLength = 0
      this.selectForm.itemTypeCodes = []
    },
    // 导出
    exportTableData () {
      this.$downloadFile(
        this.exportUrl,
        'post',
        this.exportParams,
        this.$global.EXCEL
      )
    },
    // 获取扣缴义务人，所得项目
    getTaxDetailQuery () {
      this.$http({
        url: this.taxDetailQueryUrl,
        method: 'post',
        data: this.$qs.stringify({
        })
      }).then(({data}) => {
        this.optrComps = data.data[0].optrCompVOList
        this.itemTypes = data.data[0].itemTypeVOList
      })
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
