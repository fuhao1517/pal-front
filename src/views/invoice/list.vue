<template>
  <div class="spl-container content">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="invoice-container">
      <!-- 搜索框 -->
      <div class="search-row mt-20">
        <el-input placeholder="搜索发票号" class="ml-20 w-220" v-model="searchWord"></el-input>
        <el-button type="primary" class="search-btn" icon="el-icon-search" @click="getTableData"></el-button>
        <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click"
                    v-model="showSelectForm">
          <div class="show-select-form">
            <el-form ref="selectForm" :model="selectForm" class="select-form">
              <el-row class="select-form-el-row" type="flex" justify="space-around">
                <el-col :span="6" class="select-form-el-col">
                  <el-form-item label="开具状态:" class="ml-20">
                    <el-select v-model="selectForm.issueType" placeholder="全部">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="正常" value="1"></el-option>
                      <el-option label="红冲" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="select-form-el-col">
                  <el-form-item label="申请开票日期:">
                    <el-date-picker class="w-250"
                                    v-model="selectForm.createDateRange"
                                    type="daterange"
                                    align="left"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="select-form-el-col">
                  <el-form-item label="账单编号:">
                    <el-input type="textarea" class="w-200" v-model="selectForm.recCode"
                              placeholder="一行只可输入一个账单编号"></el-input>
                    <span class="text-red ml-10">已输入{{selectForm.searchRecCodeLength}}个</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="select-form-el-col">
                  <el-button size="small" type="primary" class="s-btn" @click="getTableData2" icon="el-icon-search">查询
                  </el-button>
                  <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left"
                             class="s-btn btn--border-blue" style="margin-left: 15px;">重置
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-button slot="reference" icon="ic-filter-blue" class="ml-10">筛选</el-button>
        </el-popover>
        <div class="search-row-btn">
          <el-button size="small" icon="ic-export-blue" @click="exportTableData" class="btn--border-blue ml-10">导出
          </el-button>
        </div>
      </div>

      <!-- 表格 -->
      <dTable @fetch="getTableData" ref="invocieTable" :tableHeight="tableHeight" :showIndex="true"
              :showSelection="batchProcess" @selection-change="invoiceSeclectChange" rowKey="rowId"
              :reserve-selection="true">
        <el-table-column prop="receiptStatusName" label="开具状态" width="180"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div style="display: flex; align-items: center;">
              <span>{{scope.row.receiptStatusName}}</span>
              <el-tooltip class="item" effect="dark" content="电子发票" placement="top">
                <img class="ml-20" v-if="scope.row.eTicket === 2" src="@/assets/images/icons/invoice.png">
              </el-tooltip>
           </div>
          </template>
        </el-table-column>
        <el-table-column prop="siteOneName" label="公司" width="250" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="paymentName" label="购买方名称" width="250" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="receiptTypeName" label="开票类型" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="totalAmount" label="价税合计" class-name="text-sky-blue" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="itemList" label="开票项目名称" width="250" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="table-td">
              <div class="table-td-col" v-for="(item,index) in scope.row.itemList" :key="index">{{item.receiptItemName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="receiptAmount" label="项目金额" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="table-td">
              <div class="table-td-col" v-for="(item,index) in scope.row.itemList" :key="index">{{item.amount}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="balanceTaxAmount" label="差额征税金额" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="taxRateStr" label="税率" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="table-td">
              <div class="table-td-col" v-for="(item,index) in scope.row.itemList" :key="index">{{item.taxRateStr}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="table-td">
              <div class="table-td-col" v-for="(item,index) in scope.row.itemList" :key="index">{{item.taxAmount}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="发票状态" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="collectionName" label="销售方名称" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="recCode" label="账单编号" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="issueDate" label="开票日期" :formatter="formatDateFun" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="receiptCode" label="发票代码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createName" label="申请开票人" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDateStr" label="申请开票日期" min-width="150" :formatter="formatDateFun"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="receiptInCode" label="发票内码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="receiptNumber" label="发票号码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </dTable>
      <el-drawer :modal="false" :visible.sync="drawer" :wrapperClosable="false" custom-class="spl-detail-drawer" :withHeader="false" :show-close="false">
        <invoiceDetail :message="id" :type="type" :rowId="rowId" @handleClose='handleClose' />
      </el-drawer>
    </div>
  </div>
</template>
<script>
  import dTable from '../../components/common/table'
  import invoiceDetail from "./detail"
  export default {
    components: {dTable,invoiceDetail},
    data() {
      return {
        drawer: false,
        rowId: '',
        delTableData: [],
        // 导航
        pathData: [{name: '发票管理'}, {name: '发票列表'}],
        selectForm: {
          receiptNumber: '',
          issueType: '',
          createDateRange: [],
          recCode: '',
          recCodes: [],
          searchRecCodeLength: 0
        },
        batchProcess: false,
        searchWord: '',
        selectionNum: 0,
        showSelectForm: false,
        delDialogVisible: false,
        batchDelDialogVisible: false,
        delFallDialogVisible: false,
        batchDelFallDialogVisible: false,
        delFallMsg: '',
        failNum: '',
        id: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 270 + 'px'
      }
    },
    watch: {
      'selectForm.recCode'(newValue, oldValue) {
        var obj = this.$global.getIdCardRow(this.selectForm.recCode)
        this.selectForm.searchRecCodeLength = obj.num
        this.selectForm.recCodes = obj.value
      }
    },
    methods: {
      handleClose () {
        this.drawer = false
      },
      // 查看发票明细
      viewDetail (row) {
        this.id = row.receiptId
        this.type = row.receiptStatusCode
        this.drawer = true
        this.rowId = row.rowId
      },
      formatDateFun(row, column, cellValue, index) {
        return cellValue == null ? '-' : this.$moment(cellValue).format('YYYY-MM-DD')
      },
      refreshTable(params = []) {
        this.searchWord = ''
        this.getTableData()
      },
      getTableData(params = []) {
        params = [
          {property: 'receiptNumber', value: this.searchWord},
          {property: 'issueType', value: ["1", "2"]}
        ]
        this.$refs.invocieTable.fetch({
          query: params,
          method: 'post',
          url: '/api/receipt/accept/list'
        })
      },

      // 展开筛选框的搜索
      getTableData2(params = []) {
        params = [
          {property: 'issueType', value: this.selectForm.issueType == "" ? ["1", "2"] : [this.selectForm.issueType]},
          {
            property: 'createDate_gt_val',
            value: this.formatDateFun(null, null, this.selectForm.createDateRange && this.selectForm.createDateRange[0], 1) == "-" ? "" :
              this.formatDateFun(null, null, this.selectForm.createDateRange[0], 1)
          },
          {
            property: 'createDate_lt_val',
            value: this.formatDateFun(null, null, this.selectForm.createDateRange && this.selectForm.createDateRange[1], 1) == "-" ? "" :
              this.formatDateFun(null, null, this.selectForm.createDateRange[1], 1)
          },
          {property: 'recCode', value: this.selectForm.recCodes}
        ]
        this.$refs.invocieTable.fetch({
          query: params,
          method: 'post',
          url: '/api/receipt/accept/list'
        })
        this.showSelectForm = false
      },

      // 重置搜索框
      resetSelectForm() {
        this.selectForm.issueType = ''
        this.selectForm.createDateRange = []
        this.selectForm.recCode = ''
      },

      // 导出筛选据
      exportTableData(item) {
        this.$downloadFile(
          '/api/receipt/export',
          'post',
          {
            receiptNumber: this.searchWord,
            issueType: this.selectForm.issueType == "" ? ["1", "2"] : [this.selectForm.issueType],
            createDate_lt_val: this.formatDateFun(null, null, this.selectForm.createDateRange && this.selectForm.createDateRange[1], 1) == "-" ? "" :
              this.formatDateFun(null, null, this.selectForm.createDateRange[1], 1),
            createDate_gt_val: this.formatDateFun(null, null, this.selectForm.createDateRange && this.selectForm.createDateRange[0], 1) == "-" ? "" :
              this.formatDateFun(null, null, this.selectForm.createDateRange[0], 1),
            recCode: this.selectForm.recCodes
          },
          this.$global.EXCEL
        )
      },
      invoiceSeclectChange() {
        // this.selectEmps = this.$refs.invocieTable.selections
      },/* 查看 */
      showDetail(id) {
        this.$router.push({path: "/invoice/detail", query: {id: id}})
      }
    }
  }
</script>
<style lang="less" scoped>
  .content {
    /deep/.el-table .cell, .el-table th div,/deep/.el-table td{
      padding: 0;
    }
    .table-td{
      line-height: 40px;
      .table-td-col{
        border-top: 1px solid #ddd;
        /*border-right: 1px solid #ddd;;*/
        /*border-left: 1px solid #ddd;;*/
      }
      .table-td-col:first-child{
        border-top: none;
      }
    }
    .invoice-container {
      .show-select-form {
        .select-form {
          height: 110px;
          display: flex;
          justify-content: space-between;
          border: 1px solid rgb(17, 13, 13);
          box-shadow: 0px 0px 5px 0px rgba(48, 49, 51, 0.3);

          .select-form-el-row {
            width: 50%;
            display: flex;
            align-items: center;
            margin-left: 59px;

            .select-form-el-col {
              width: 50%;
              margin-top: 20px;
              display: flex;
              justify-content: start;

              .el-form-item {
                display: flex;
                align-items: center;
              }
            }
          }

          .select-form-el-row:last-child {
            .select-form-el-col:first-child {
              .el-form-item {
                display: flex;
                align-items: flex-start;

                /deep/ .el-textarea__inner {
                  width: 199px;
                  height: 70px;
                  padding: 0;
                  resize: none;
                }
              }
            }

            .select-form-el-col:last-child {
              display: flex;
              justify-content: flex-end;
              margin: 0px 40px 0 0;

              .el-button:last-child {
                color: #409eff;
                border-color: #409eff;
              }
            }
          }
        }
      }

    }
  }
</style>
