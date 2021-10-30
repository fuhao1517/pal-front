<template>
  <div class="spl-container main-container" v-loading="mainLoading"
       :element-loading-text="mainLoadingText" element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(244, 248, 248, 0.5)">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="import-main-container">
      <div style="padding: 20px 30px;">
        <div class="handle-btn">
          <i class="el-icon-warning ic-tip-yellow"></i>
          <span>推荐先选择账单编号，可下载含数据的表格模板</span>
        </div>
        <div class="pt-20">
          <span class="inlineBlock text-right"><span class="required">账单编号</span>: </span>
          <el-select v-model="billCodeItem" class="w-280 ml-10" placeholder="请先选择账单" filterable value-key="billCode" @change="changeBillCode">
            <el-option v-for="item in billCodeList" :key="item.billCode" :label="item.billCode" :value="item"></el-option>
          </el-select>
          <span class="ml-10" v-show="billCode!=''" style="display: inline-block;vertical-align: middle;margin-top: 13px;"><span
            class="text-yellow">{{noBankCount}}</span>条记录待完善</span>
        </div>
      </div>

      <div class="header-row-gray clearfix">
        <div class="fl">
              <span>成功<span v-text="successCount"></span>
                <span>条，失败</span>
                <span v-text="failedCount" class="text-red"></span>
                <span>条。</span>
              </span>
        </div>
        <div class="fl ml-180">
          <span class="mr-10">只看失败</span>
          <el-switch v-model="switchValue" :activeColor="$global.switchColor[0]" active-value="0" inactive-value="1"
                     :inactiveColor="$global.switchColor[1]" @change="changeStatus"></el-switch>
        </div>
        <div class="fr clearfix">
          <el-input class="fl" :readonly="true" v-model="fileName" style="width: 280px;"></el-input>
          <el-upload class="fl" ref="upload" :action="this.$global.uploadUrl" :headers="this.$global.setHeaders"
                    :on-change="fileChange" :on-success="uploadSuccess"
                     :show-file-list="false" :auto-upload="false" :multiple="false">
            <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
            <el-button style="margin-left: 15px;" size="small s-btn" type="primary" icon="ic-import-white"
                       @click="submitUpload">导入
            </el-button>
            <el-button class="s-btn" type="primary" @click="exportTemplateHandle" icon="el-icon-download"
                       style="margin-left: 15px;">模板下载
            </el-button>
          </el-upload>
        </div>
      </div>
      <div class="mt-10">
        <dTable @fetch="getTableData" ref="importTable" :tableHeight="tableHeight" :showSelection="false" :showIndex="true">
          <el-table-column prop="importMsg" label="备注" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="idCardNo" label="证件号码" min-width="130" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankType" label="银行名称" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankAccountName" label="银行账户名" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankAccountNumber" label="银行账号" min-width="130" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankCity" label="开户市" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankBranchName" label="开户支行" min-width="130" :show-overflow-tooltip="true"></el-table-column>
          <template slot="pagination-btns">
            <el-button size="small" icon="ic-export-blue" @click="exportData" class="btn--border-blue">导出</el-button>
          </template>
        </dTable>
      </div>
      <div class="operate-btns-bottom clearfix " style=" margin-top:30px;padding-bottom: 30px;">
        <router-link to="/billManage/index">
          <el-button class="w-90">取消</el-button>
        </router-link>
        <el-button type="primary" class="ml-30 w-110" @click="saveHandle">保存成功数据</el-button>
      </div>
    </div>

    <el-dialog title="提示" class="spl-dialog" :visible.sync="templateDialogVisible" width="600px">
      <p class="clearfix" style="padding-left: 36px;">
        <i class="el-icon-warning text-orange mr-20 font-30 fl"></i>
        <span class="lh-30">已选择账单的前提下，推荐您下载带数据的表格模板</span>
      </p>
      <div slot="footer" class="dialog-footer mb-30" style="margin-top: 73px;">
        <el-button class="s-btn" @click="exportTemplate(0)">下载空白模板</el-button>
        <el-button type="primary" class="s-btn" style="margin-left: 30px;" @click="exportTemplate(1)">下载数据模板</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dTable from '../../components/common/table'

export default {
  name: 'addImport',
  data () {
    return {
      // 导航
      pathData: [{ name: '账单管理' }, { name: '账单列表', path: '/billManage/index' }, { name: '维护员工薪资卡' }],
      mainLoading: false,
      mainLoadingText: '文件上传中...',
      billCodeList: [],
      switchValue: '1', // 1为全部，0为失败
      failedCount: 0,
      successCount: 0,
      fileName: '',
      fileId: '',
      billCodeItem: '',
      billCode: '',
      noBankCount: '', // 待完善数目
      templateDialogVisible: false
    }
  },
  components: { dTable },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 430 + 'px'
    }
  },
  created () {
    this.billCode = this.$route.query.billCode ? this.$route.query.billCode : ''
    this.noBankCount = this.$route.query.count ? this.$route.query.count : 0
    if (this.billCode != '' && this.noBankCount != 0) {
      this.billCodeItem = { billCode: this.billCode, noBankCount: this.noBankCount }
    }
    console.log(this.billCodeItem)
    this.getBillCodeBank()
  },
  methods: {
    // 获取账单编号
    getBillCodeBank () {
      this.$http({
        url: '/api/accountManage/bank/getPalBillCodeBank',
        method: 'POST',
        data: {}
      }).then(({ data }) => {
        this.billCodeList = data.data[0]
      }).catch(({ data }) => {
      })
    },
    changeBillCode () {
      let billCodeItem = this.billCodeItem
      if (!this.$lodash.isEmpty(billCodeItem)) {
        this.billCode = billCodeItem.billCode
        this.noBankCount = billCodeItem.noBankCount
      } else {
        this.billCode = ''
        this.noBankCount = 0
      }
    },
    //  导出模板
    exportTemplateHandle () {
      if (this.billCode != '') {
        this.templateDialogVisible = true
      } else {
        this.exportTemplate(0)
      }
    },
    exportTemplate (type) {
      let that = this
      // type：1（带数据） 0（不带数据）
      this.$downloadFile('/api/accountManage/bank/bankMsgExportTemplate', 'post', this.$qs.stringify({
        billCode: that.billCode,
        type: type
      }), this.$global.EXCEL)
      that.templateDialogVisible = false
    },

    /* 获取列表分页数据 */
    getTableData (params = []) {
      if (this.fileId == null || this.fileId == '') {
        return false
      }
      params = [
        { property: 'fileId', value: this.fileId },
        { property: 'status', value: this.switchValue } // 1为全部，0为失败
      ]
      this.$refs.importTable.fetch({
        query: params,
        method: 'post',
        url: '/api/accountManage/bank/findImportBankMsgList'
      })
    },

    // 上传成功后
    uploadSuccess (response, file, fileList) {
      file.name = ''
      var fileId = String(response.data[0].fileId)// 文件id
      this.$http({
        url: '/api/accountManage/bank/importBankMsg',
        method: 'post',
        data: this.$qs.stringify({
          fileId: fileId,
          billCode: this.billCode
        })
      }).then(({ data }) => {
        let res = data.data[0]
        // 获取导入统计信息
        let erroMsg = res.erroMsg
        if (erroMsg == '' || erroMsg == null) {
          this.fileId = fileId
          this.failedCount = res.failNum
          this.successCount = res.successNum
          // 查询列表数据
          this.getTableData()
        } else {
          this.$message.error(erroMsg)
        }

        this.mainLoading = false
        this.$refs.upload.clearFiles()
      }).catch(({ data }) => {
        this.mainLoading = false
      })
    },
    fileChange (file, fileList) {
      this.fileName = file.name
    },
    /* 只看失败 */
    changeStatus (value) {
      this.switchValue = value
      this.getTableData()
    },

    saveHandle () {
      if (this.successCount < 1) {
        this.$message.warning('无成功数据可保存')
        return
      }
      this.mainLoadingText = '正在保存...'
      this.mainLoading = true
      this.$http({
        url: '/api/accountManage/bank/saveImportBankInfo',
        method: 'post',
        data: this.$qs.stringify({
          fileId: String(this.fileId)
        })
      }).then(({ data }) => {
        this.mainLoading = false
        this.$message.success('已保存成功' + this.successCount + '条记录')
      }).catch(({ data }) => {
        this.mainLoading = false
      })
    },

    exportData (switchValue) {
      if (this.$refs.importTable.isEmptyTable()) {
        this.$message.warning('无数据可导出')
        return
      }
      this.$downloadFile('/api/accountManage/bank/exportImportExcelVO', 'POST', this.$qs.stringify({
        fileId: this.fileId,
        status: this.switchValue
      }), this.$global.EXCEL)
    },
    // 导入按钮
    submitUpload () {
      if (this.billCode == '') {
        this.$message.warning('请先选择账单编号')
        return
      }
      if (this.fileName !== '') {
        this.mainLoadingText = '文件上传中...'
        this.mainLoading = true
        this.fileName = ''
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请先选择文件')
      }
    }

  }
}

</script>
<style lang='less' scoped>

</style>
