<template>
  <div class="spl-container content">
     <div class="loading-mask-none" v-loading="mainLoading.isLoading" :element-loading-text="mainLoading.mainLoadingText"
            :element-loading-spinner="$global.elementLoadingSpinner">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <!-- 搜索框 -->
    <div class="search-row mt-20">
      <span class="ml-20">账单年月:</span>
      <el-date-picker v-model="searchForm.yearDate" placeholder="选择账单年月" value-format="yyyy-MM" class="date-editor2 ml-10" type="month"></el-date-picker>
      <el-input placeholder="搜索账单编号关键字" class="ml-60 w-260" v-model="searchForm.recCode"></el-input>
      <div class="search-row-btn mr-10">
        <el-button type="primary" @click="getTableData"> 查询 </el-button>
        <el-button type="primary" @click="generateBillVisible = true">生成账单</el-button>
        <el-button type="primary" @click="salaryCardMainten"> 维护员工薪资卡 </el-button>
      </div>
    </div>

  <!-- 表格 -->
    <dTable @fetch="getTableData" ref="billTable" :tableHeight="tableHeight" :showIndex="true" :showSelection="true" @selection-change="selectChange" rowKey="billId" :reserve-selection="true">
      <el-table-column prop="recCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="recDate" label="账单年月" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-text="$global.dateFormat(scope.row.recDate)"></span>
        </template>
      </el-table-column>

      <el-table-column prop="receivableAmount" label="账单总金额" :formatter="formatterAmount" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-popover placement="right" width="auto" trigger="hover">
            <dTable :data="scope.row.customerSiteOneFeeItemList" :cancelMinHeight="true" :showSelection="false" :showIndex="false" :paging="false">
              <el-table-column width="150" property="itemName" label="费用项目"></el-table-column>
              <el-table-column min-width="150" property="receivableAmount" label="项目金额" :formatter="formatterAmount"></el-table-column>
            </dTable>
            <el-button type="text" slot="reference">{{$global.milliFormat(scope.row.receivableAmount)}}</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="receivedAmount" label="已到账金额" :formatter="formatterAmount" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unreachedAmount" label="未到账金额" :formatter="formatterAmount" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="receivedStatusName" label="状态" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="creatorName" label="创建人" min-width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" min-width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="opensubmitDialog(scope.row)" v-if="scope.row.status==10031001"><span class="text-blue">确认账单</span></el-button>
          <div class="opt-btn-split" v-if="scope.row.status==10031001"></div>
          <router-link :to="'/billManage/billView?id=' + scope.row.id + '&recCode=' + scope.row.recCode">
            <el-button type="text" size="small"><span class="text-green">查看</span></el-button>
          </router-link>
          <div class="opt-btn-split" v-if="scope.row.status==10031001"></div>
          <el-button type="text" size="small" @click.stop="openDelDialog(scope.row)"><span class="text-red" v-if="scope.row.status==10031001">删除</span></el-button>
        </template>
      </el-table-column>
      <template slot="pagination-btns">
        <el-button size="small" icon="ic-export-blue" @click="exportTableData" class="btn--border-blue ml-10">导出</el-button>
        <el-button size="small" icon="el-icon-printer" @click="printTableData" class="btn--border-blue ml-10">打印</el-button>
      </template>
    </dTable>
  </div>
    <!-- 删除弹窗 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" :close-on-click-modal="false" width="600px" class="spl-dialog-msg">
      <p class="mb-20 mt-20" style="display: flex; justify-content: flex-start; align-items: center;">
        <img class="mr-20 ml-30" src="@/assets/images/icons/ic-account-type11.png">
        <span style="font-size:18px;">删除该内容</span>
      </p>
      <p class="ml-80">是否确定删除账单 <span v-text="billRow.recCode" style="color:#409EFF;"></span> ？</p>
      <br>
      <br>
      <div slot="footer" class="dialog-footer">
        <el-button class="mr-60" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delBill(billRow)">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 提交弹窗 -->
    <el-dialog :visible.sync="submitDialogVisible" width="600px" class="spl-dialog-msg">
      <template slot="title">
        <p class="mb-5"><i class="el-icon-warning text-orange fl" style="font-size: 24px"></i><span class="font-18 ml-10" style="line-height: 24px;">转账提示</span></p>
      </template>
      <p class="mt-30 mb-30 pl-40">账单总金额：<span class="text-orange">{{$global.milliFormat(billRow.receivableAmount)}}</span></p>
      <div style="background:#F5F7FA;padding: 18px 17px 17px 40px;">
        <p class="mb-10">当前账单待划款，请确认账单账单，并汇款至以下账户：</p>
        <p class="mb-10">账户全称：<span v-text="billRow.recCompanyName"></span></p>
        <p class="mb-10">开户银行：<span v-text="billRow.recBankName"></span></p>
        <p class="mb-10">银行账号：<span class="text-orange" v-text="billRow.recBankAccount"></span></p>
        <p style="margin-bottom: 2px;"><i class="el-icon-warning fl mr-10" style="font-size: 20px;color: red"></i>对账识别码：<span v-text="billRow.checkCode" class="text-red"></span></p>
        <p class="text-red" style="padding-left: 30px;line-height: 20px;">为保证您的资金安全，方便对账，请您在充值转账时，务必在转账备注中填写此对账识别码</p>
      </div>
      <div slot="footer" class="dialog-footer pt-15">
        <el-button class="mr-60" @click="submitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBill">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" class="spl-dialog" :visible.sync="salaryCardDialogVisible" width="600px" :show-close="false">
      <div class="clearfix pt-20" style="padding-left: 56px;">
        <i class="el-icon-warning text-orange mr-20 font-30 fl"></i>
        <span class="lh-30">存在未完善薪资卡的人员，无法确认账单薪酬账单</span>
        <p style="padding-left: 51px;">请先完善员工薪资卡</p>
      </div>
      <div slot="footer" class="dialog-footer mb-35" style="margin-top: 61px;">
        <el-button class="s-btn" @click="salaryCardDialogVisible=false">取消</el-button>
        <router-link :to="'/billManage/salaryCardMainten?billCode=' + billRow.recCode + '&count=' + salaryCardCount">
          <el-button type="primary" class="s-btn" style="margin-left: 45px;" @click="exportTemplate(1)">前往完善</el-button>
        </router-link>
      </div>
    </el-dialog>

    <el-dialog title="提示" class="spl-dialog" :visible.sync="generateBillVisible" width="600px" :show-close="false" v-loading="loading" element-loading-text="账单生成中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
      <div style="padding-left: 90px;padding-top: 20px;">
        <el-form ref="generateBillForm" :model="generateBillForm" label-width="120px">
          <el-form-item label="请先选择账单年月" prop="month" label-width="150px" :rules="[{ required: true, message: '请先选择账单年月',trigger:'blur'}]">
            <el-date-picker v-model="generateBillForm.month" class="w-240 date-editor2 date-editor3" type="month" value-format="yyyy-MM">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer mb-35 text-center" style="margin-top: 61px;">
        <el-button class="s-btn" @click="cancelGenerateBillVisible">取消</el-button>
        <el-button type="primary" class="s-btn" style="margin-left: 45px;" @click="handleGenerateBill()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import dTable from '../../components/common/table'
export default {
  name: 'index',
  data () {
    return {
      pathData: [{ name: '账单管理' }, { name: '账单列表' }],
      mainLoading: {
        isLoading: false,
        mainLoadingText: '正在导出...'
      },
      selectItems: [],
      billRow: {},
      searchForm: {
        yearDate: '',
        recCode: ''
      },
      hoverTable: [],
      submitDialogVisible: false,
      delDialogVisible: false,
      salaryCardCount: 0,
      salaryCardDialogVisible: false,
      tableDataUrl: '/api/accountManage/accountList',
      deleteUrl: '/api/accountManage/del/',
      submitUrl: '/api/accountManage/submit/',
      exportUrl: '/api/accountManage/accountExport',
      printUrl: '/api/accountManage/accountPrint',

      generateBillVisible: false,
      generateBillForm: { month: '' },
      loading: false
    }
  },
  components: { dTable },
  created () {
    this.searchForm.yearDate = this.$moment(new Date()).format('YYYY-MM')
    this.$nextTick(() => {
      this.getTableData()
    })
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 260 + 'px'
    }
  },
  methods: {
    getTableData (params = []) {
      var customerSiteOne = []
      customerSiteOne.push(this.$store.state.userData.custId)
      params = [
        { property: 'customerSiteOne', value: customerSiteOne },
        { property: 'recDate', value: this.searchForm.yearDate }
      ]
      if (this.searchForm.recCode != '') {
        params.push({ property: 'recCode', value: this.searchForm.recCode })
      }
      this.$refs.billTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl,
        noSort: true
      })
    },
    selectChange () {
      this.selectItems = this.$refs.billTable.selections
    },
    // 导出按钮
    exportTableData () {
      let that = this
      var params = {}
      var selections = this.$refs.billTable.getSelectionsArr('recCode')
      if (selections.length === 0) {
        this.$message.warning('至少勾选一条数据')
      } else {
        params = {
          isNew: 1,
          recCodes: selections.join(','),
          sourceType: 'voucher'
        }
        that.mainLoading.isLoading = true
        that.mainLoading.mainLoadingText = '正在导出...'
        this.$downloadFile(
          this.exportUrl,
          'post',
          params,
          this.$global.EXCEL,
          '',
          function () {
            that.mainLoading.isLoading = false
          }
        )
      }
    },
    // 打印按钮
    printTableData () {
      let that = this
      var selections = this.$refs.billTable.getSelectionsArr('recCode')
      if (selections.length === 0) {
        this.$message.warning('至少勾选一条数据')
        return
      }
      that.mainLoading.isLoading = true
      that.mainLoading.mainLoadingText = '正在打印...'
      this.$print({
        url: this.printUrl,
        method: 'post',
        responseType: 'blob',
        data: {
          sourceType: 'voucher',
          isNew: 1,
          recCodes: selections.join(',')
        }
      }, function () {
        that.mainLoading.isLoading = false
      })
    },
    formatterAmount (row, column, cellValue, index) {
      return this.$global.milliFormat(cellValue)
    },
    // 提交按钮
    opensubmitDialog (row) {
      this.billRow = row
      this.submitDialogVisible = true
    },
    // 删除按钮
    openDelDialog (row) {
      this.delDialogVisible = true
      this.billRow = row
    },
    delBill (row) {
      this.$http({
        url: this.deleteUrl + this.billRow.id,
        method: 'get'
      }).then(({ data }) => {
        if (data.code === '10') {
          this.$confirm('删除成功', '提示', {
            customClass: 'spl-confirm',
            showConfirmButton: false,
            showCancelButton: false,
            type: 'success',
            closeOnClickModal: false
          })
          this.getTableData()
        } else {
          this.$confirm('删除失败', '提示', {
            customClass: 'spl-confirm',
            showConfirmButton: false,
            showCancelButton: false,
            type: 'error',
            closeOnClickModal: false
          })
        }
      })
      this.delDialogVisible = false
    },
    submitBill (row) {
      this.$http({
        url: this.submitUrl + this.billRow.id,
        method: 'get'
      }).then(({ data }) => {
        if (data.data[0] > 0) {
          /* 提示先去完善薪资卡 */
          this.salaryCardCount = data.data[0]
          this.salaryCardDialogVisible = true
        } else {
          this.$message.success('确认账单成功')
          this.getTableData()
        }
      })
      this.submitDialogVisible = false
    },

    // 维护薪资卡
    salaryCardMainten () {
      this.$router.push('/billManage/salaryCardMainten')
    },

    // 生成账单
    handleGenerateBill () {
      this.loading=true
      this.$refs.generateBillForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: '/api/accountManage/generateBill?recDate=' + this.generateBillForm.month.replace('-', ''),
            method: 'get'
          }).then(({ data }) => {
            this.loading=false
            let res = data.data[0]
            if (res && res.length > 0) {
              this.$message.success('操作成功')
              this.cancelGenerateBillVisible()
            } else {
              this.$message.error(this.generateBillForm.month + '无账单数据可生成，请检查条件')
            }
          })
        }
      })
    },
    cancelGenerateBillVisible () {
      this.generateBillVisible = false
      this.generateBillForm.month = ''
      this.$refs.generateBillForm.resetFields()
    }
  }
}
</script>

<style lang='less' scoped>
/deep/.el-dialog__headerbtn .el-dialog__close {
  font-size: 16px;
  font-weight: bold;
}
/deep/.el-dialog__body {
  padding: 0;
}
</style>
