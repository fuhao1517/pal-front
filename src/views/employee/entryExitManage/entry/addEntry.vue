<template>
  <div class="spl-container main-container" v-loading="mainLoading" :element-loading-text="active=='0'?'文件上传中...':'数据保存中...'" element-loading-spinner="el-icon-loading" element-loading-background="rgba(244, 248, 248, 0.5)">

    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="import-main-container">
      <!-- steps条 -->
      <splSteps :active="active" :data="stepsData"></splSteps>
      <div class="import-limit-center">

        <!-- 列表 -->
        <div v-show="active == 0||active == 1">
          <div class="mt-10 mb-15 clearfix" v-show="!importForm&&active == 0">
            <span class="tip ml-20 lh-32">
              <i class="el-icon-warning ic-tip-yellow"></i>
              已添加 <span v-text="totalCount" class="text-orange"></span> 条签署方
            </span>
            <div class="fr mr-20">
              <el-button type="primary" size="small" icon="ic-import-white" @click="batchImport">批量导入名单</el-button>
              <el-button size="small" class="btn--border-blue" style="margin-left: 20px;" icon="el-icon-plus" @click="singleAdd">单个添加名单</el-button>
            </div>
          </div>

          <div class="mb-20 clearfix" v-show="importForm">
            <div class="mt-20">
              <span v-if="submitted">
                <span class="tip">
                  <i class="el-icon-warning ic-tip-yellow"></i>
                  成功<span v-text="successCount" class="text-orange"></span>条，失败<span v-text="failCount" class="text-orange"></span>条。
                </span>
                <span class="mr-10 ml-20">查看失败</span>
                <el-switch v-model="switchValue" :activeColor="$global.switchColor[0]" active-value="0" inactive-value="1" :inactiveColor="$global.switchColor[1]" @change="changeStatus"></el-switch>
              </span>
              <div class="fr clearfix pr-30">
                <el-input class="fl" :readonly="true" v-model="fileName" style="width: 280px;"></el-input>
                <el-upload class="fl" ref="upload" :action="this.$global.uploadUrl" :headers="this.$global.setHeaders" :file-list="fileList" :on-change="fileChange" :on-success="uploadSuccess" :on-error="uploadError" :show-file-list="false" :auto-upload="false" :multiple="false">
                  <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
                  <el-button style="margin-left: 15px;" size="small s-btn" type="primary" icon="ic-import-white" @click="submitUpload">导入</el-button>
                </el-upload>
                <el-button class="fl s-btn" type="primary" @click="exportTemplate" icon="el-icon-download" style="margin-left: 15px;">模板下载</el-button>
                <br>
              </div>
            </div>
          </div>

          <div class="clearfix" v-show="!this.importForm&&this.active == 0">
            <!-- 入离职表格 -->
            <dTable @fetch="getTableData" ref="dataTable" style="width: 100%" :tableHeight="tableHeight" :showSelection="true" :showIndex="true" :paging="true">
              <el-table-column prop="name" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="idCard" label="证件号码" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="telephone" label="手机号码" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="optrCompName" label="签署主体" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <template slot="pagination-btns" class="mt-20" v-if="active == 0">
                <div class="display-flex">
                  <el-button size="small" type="primary" icon="ic-export-white" class="s-btn" @click="exportData(switchValue)">导出</el-button>
                  <el-button size="small" class="cancel-btn-border" icon="icon el-icon-delete" @click="delData">删除</el-button>
                </div>
              </template>
            </dTable>
          </div>

          <div class="clearfix mt-10 " v-show="!this.importForm&&this.active == 1">
            <!-- 确认表格 -->
            <dTable @fetch="getTableData2" ref="dataTable2" style="width: 100%" :tableHeight="tableHeight" :showSelection="false" :showIndex="true" :paging="false">
              <el-table-column prop="name" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="idCard" label="证件号码" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="telephone" label="手机号码" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="optrCompName" label="签署主体" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <template slot="pagination-btns" class="mt-20" v-if="active == 0">
                <div class="display-flex">
                  <el-button size="small" type="primary" icon="ic-export-white" class="s-btn" @click="exportData(switchValue)">导出</el-button>
                  <el-button size="small" class="cancel-btn-border" icon="icon el-icon-delete" @click="delData">删除</el-button>
                </div>
              </template>
            </dTable>
          </div>
          <div class="clearfix" v-show="this.importForm&&switchValue==1">
            <!-- 入离职表格 -->
            <dTable @fetch="getImportTableData" ref="importTable" :key="refreshImportTable" style="width: 100%" :tableHeight="tableHeight" :showSelection="true" :showIndex="true" :paging="active == 0">
              <el-table-column prop="name" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="idCard" label="证件号码" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="telephone" label="手机号码" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="optrCompName" label="签署主体" min-width="250" :show-overflow-tooltip="true"></el-table-column>
              <template slot="pagination-btns" class="mt-20" v-if="active == 0">
                <div class="display-flex">
                  <el-button size="small" type="primary" icon="ic-export-white" class="s-btn" @click="exportData(switchValue)">导出</el-button>
                  <el-button size="small" class="cancel-btn-border" icon="icon el-icon-delete" @click="delData">删除</el-button>
                </div>
              </template>

            </dTable>
          </div>
          <div class="clearfix" v-show="this.importForm&&switchValue==0">
            <!-- 入离职表格 -->
            <dTable @fetch="getImportTableData" ref="importFailTable" :key="refreshImportTable" style="width: 100%" :tableHeight="tableHeight" :showSelection="true" :showIndex="true" :paging="active == 0">
              <el-table-column prop="name" label="姓名" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="idCard" label="证件号码" width="250" :show-overflow-tooltip="true"></el-table-column>

              <el-table-column prop="telephone" label="手机号码" width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="optrCompName" label="签署主体" width="250" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="errorMessage" label="导入失败原因" min-width="200" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="scope.row.errMsg" class="text-red"></span>
                </template>
              </el-table-column>
              <template slot="pagination-btns" class="mt-20" v-if="active == 0">
                <div class="display-flex">
                  <el-button size="small" type="primary" icon="ic-export-white" class="s-btn" @click="exportData(switchValue)">导出</el-button>
                  <el-button size="small" class="cancel-btn-border" icon="icon el-icon-delete" @click="delData">删除</el-button>
                </div>
              </template>

            </dTable>
          </div>

        </div>

        <div class="operate-btns-bottom mt-30" v-show="!importForm&&active==0">
          <el-button class="cancel-btn-border" @click="confirmTable">下一步（确认名单）</el-button>
        </div>

        <div class="operate-btns-bottom mt-30" v-show="importForm">
          <el-button class="cancel-btn-border" @click="cancelImport">取消</el-button>
          <el-button type="primary" class="ml-30" @click="saveData">确定添加</el-button>
        </div>

        <div class="operate-btns-bottom mt-30" v-show="!importForm&&active==1">
          <el-button class="cancel-btn-border w-150" @click="active = 0">上一步（确认名单）</el-button>
          <el-button type="primary" class="ml-30 w-150" @click="sendRequest" :loading="sendBtnLoading">发送邀请</el-button>
        </div>

        <!--第三步-->
        <div v-show="active == 2">
          <div class="success-msg">
            <div class="clearfix" style="display: inline-block"><i class="el-icon-success fl"></i><span class="msg-title">完成</span></div>
            <p class="msg-detail countdown">成功发起{{totalCount}}人入职登记。{{countDown}}秒后自动跳转签署管理页面</p>
            <div class="success-msg-btns">
              <el-button size="small" class="cancel-btn-border w-130" @click="goHome">入职管理</el-button>
              <el-button size="small" type="primary" class="w-130" style="margin-left: 30px;" @click="reAdd">继续邀请</el-button>
            </div>
          </div>
        </div>

      </div>

      <!-- 单个添加弹出框 -->
      <el-dialog title="添加待入职" :close-on-click-modal="false" class="singleAdd spl-dialog" :visible.sync="addEntryDialog" width="600px" center :before-close="cancleSingleAdd">
        <el-form class="el-form" label-width="121px" :model="addInfoForm" ref="addInfoForm" :hide-required-asterisk="true">
          <div class="add-ruleForm formList">
            <el-form-item label="员工姓名：" prop="name" :rules="[{ required: true, message: '请输入员工姓名'}]">
              <template slot="label">
                <span class="required-pre">员工姓名:</span>
              </template>
              <el-input placeholder="请输入" class="w-400" v-model.trim="addInfoForm.name"></el-input>
            </el-form-item>
            <el-form-item label="证件号码：" prop="idCard" :rules="[{ required: true, message: '请输入证件号码'}]">
              <template slot="label">
                <span class="required-pre">证件号码:</span>
              </template>
              <el-input placeholder="请输入" class="w-400" v-model.trim="addInfoForm.idCard"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="telephone" :rules="[{ required: true, message: '请输入手机号码'},{validator:this.$global.isPhoneValidator,trigger:'blur'}]">
              <template slot="label">
                <span class="required-pre">手机号码:</span>
              </template>
              <el-input placeholder="请输入" class="w-400" v-model.trim="addInfoForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="签署主体：" prop="optrCompId" :rules="[{ required: true, message: '请输入签署主体'}]">
              <template slot="label">
                <span class="required-pre">签署主体:</span>
              </template>
              <el-select v-model="addInfoForm.optrCompId" ref="optrCompId" placeholder="请选择" class="w-400">
                <el-option v-for="item in optrComp" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 25px;">
          <el-button size="small" @click="cancleSingleAdd">取 消</el-button>
          <el-button size="small" type="primary" :loading="addInfoForm.btnLoading" style="margin-left: 60px;" @click="checkAddSingle">确定添加</el-button>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import dTable from '../../../../components/common/table'
import splSteps from '../../../../components/common/spl-steps'
import uuidv1 from 'uuid/v1'
export default {
  inject: ['reload'],
  components: { dTable, splSteps },
  name: 'addEntry',
  data () {
    return {
      active: 0,
      refreshImportTable: new Date().getTime(),
      submitted: false,
      addInfoForm: {
        name: '',
        idCard: '',
        telephone: '',
        optrCompId: '',
        btnLoading: false
      },
      addEntryDialog: false,
      mainLoading: false,
      successCount: 0,
      failCount: 0,
      totalCount: 0,
      countDown: 5,
      importForm: false,
      switchValue: '1',
      fileName: '',
      fileList: [],
      pathData: [
        { name: '人员管理' },
        { name: '入离职管理' },
        { name: '添加名单' }
      ],
      stepsData: [
        { title: '添加人员名单', description: '添加待入职名单' },
        { title: '确认名单', description: '确认名单，发起入职登记' },
        { title: '完成' }
      ],
      singleAddUrl: '',
      importUrl: '/api/entryresign/emp/empImport',
      cancelImportUrl: '/api/entryresign/emp/deleteByBatchAndFileId',
      importCountUrl: '/api/entryresign/emp/getImportCount',
      tableDataUrl: '/api/entryresign/emp/queryForPage',
      templateUrl: 'api/entryresign/emp/downloadTemplateFile',
      exportDataUrl: '/api/entryresign/emp/exportImportData',
      entrySubjectUrl: '/api/entryresign/entrySubjectList',
      optrComp: [],
      batchNum: '0',
      fileId: '',
      sendBtnLoading: false,
      records: 0
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 490 + 'px'
    }
  },
  created () {
    this.batchNum = uuidv1() // 获取随机id
    let that = this
    this.$nextTick(() => {
      that.getTableData()
    })
  },
  methods: {
    batchImport () {
      this.importForm = true
    },
    singleAdd () {
      this.getEntrySubjectList()
      this.addEntryDialog = true
    },
    confirmTable () {
      if (this.totalCount == 0) {
        this.$message.error('未添加签署方，不能进入下一步！')
        return
      }
      this.active = 1
      this.getTableData2()
    },
    // 改变扣缴义务人数据
    getSelectLabel (value) {
      var options = this.$refs.obligor.options
      this.setData.obligorName = this.$global.getSelectLabel(value, options)
    },
    getTableData (params = []) {
      var that = this
      params = [
        { property: 'batchNum', value: this.batchNum },
        { property: 'isSuccess', value: parseInt(1) }
      ]
      this.$refs.dataTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl,
        callback: function (data) {
          that.totalCount = data.records
        }
      })
    },
    getTableData2 (params = []) {
      params = [
        { property: 'batchNum', value: this.batchNum },
        { property: 'isSuccess', value: parseInt(1) }
      ]
      this.$refs.dataTable2.fetch({
        query: params,
        method: 'post',
        url: this.tableDataUrl
      })
    },
    getImportTableData (params = []) {
      params = [
        { property: 'batchNum', value: this.batchNum },
        { property: 'fileId', value: this.fileId },
        { property: 'isSuccess', value: parseInt(this.switchValue) }
      ]
      if (this.switchValue == 0) {
        this.$refs.importFailTable.fetch({
          query: params,
          method: 'post',
          url: this.tableDataUrl
        })
      } else {
        this.$refs.importTable.fetch({
          query: params,
          method: 'post',
          url: this.tableDataUrl
        })
      }
    },
    // 继续邀请
    reAdd () {
      clearInterval(this.timer)
      this.$router.push('/employee/addEntry')
      this.reload()
    },

    delData () {
      let that = this
      var selections = this.$refs.importTable.selections
      if (!this.importForm) {
        selections = this.$refs.dataTable.selections
      }
      if (selections.length === 0) {
        this.$confirm('请勾选需要删除的数据', '提示', {
          customClass: 'spl-confirm',
          showConfirmButton: false,
          showCancelButton: false,
          type: 'warning',
          closeOnClickModal: false
        })
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: '/api/entryresign/emp/deleteImportData',
        method: 'post',
        data: this.$qs.stringify({
          fileId: this.fileId,
          ids: ids.join(','),
          isSuccess: this.switchValue // 0失败，1成功
        })
      }).then(({ data }) => {
        this.$confirm('删除成功', '提示', {
          customClass: 'spl-confirm',
          showConfirmButton: false,
          showCancelButton: false,
          type: 'success',
          closeOnClickModal: false
        })
        that.getImportCountInfo()
        that.$nextTick(() => {
          if (!this.importForm) {
            that.getTableData()
          } else {
            that.getImportTableData()
          }
        })
      })
    },
    saveData () {
      if (this.successCount == 0) {
        this.$message.warning('本次导入没有成功数据，请重新导入或取消')
        return
      }
      this.importForm = false
      this.submitted = false
      this.successCount = 0
      this.failCount = 0
      this.fileId = ''
      this.refreshImportTable = new Date().getTime()
      this.$refs.importTable.emptyTable()
      this.getTableData()
    },
    cancelImport () {
      if (this.fileId !== '') {
        this.$http({
          url: this.cancelImportUrl,
          method: 'post',
          data: this.$qs.stringify({
            fileId: this.fileId,
            batchNum: this.batchNum
          })
        })
        this.fileId = ''
      }
      this.importForm = false
      this.submitted = false
      this.successCount = 0
      this.failCount = 0
      this.refreshImportTable = new Date().getTime()
      this.$refs.importTable.emptyTable()
      this.getTableData()
    },
    getImportCountInfo () {
      this.$http({
        url: this.importCountUrl,
        method: 'post',
        params: {
          fileId: this.fileId,
          type: 1
        }
      }).then(({ data }) => {
        this.failCount = data.data[0].fail
        this.successCount = data.data[0].success
      }).catch(data => {
        this.$message.error('系统异常')
      })
    },
    /* 单个添加-确定 */
    checkAddSingle () {
      this.$refs.addInfoForm.validate((valid) => {
        if (valid) {
          this.addInfoForm.btnLoading = true
          this.$http({
            url: '/api/entryresign/emp/singleEntry',
            method: 'post',
            data: {
              addType: '',
              batchNum: this.batchNum,
              name: this.addInfoForm.name,
              idCard: this.addInfoForm.idCard,
              telephone: this.addInfoForm.telephone,
              optrCompId: this.addInfoForm.optrCompId,
              optrCompName: this.$refs.optrCompId.selectedLabel
            }
          }).then(({ data }) => {
            this.addInfoForm.btnLoading = false
            this.getTableData()
            this.cancleSingleAdd()
          }).catch(data => {
            this.addInfoForm.btnLoading = false
          })
        }
      })
    },
    sendRequest () {
      this.sendBtnLoading = true
      this.$http({
        url: '/api/entryresign/emp/saveImportData',
        method: 'post',
        data: {
          addType: '',
          batchNum: this.batchNum,
          type: '1'
        }
      }).then(({ data }) => {
        this.sendBtnLoading = false
        this.active = 2
        this.refer()
      })
    },
    //  导出模板
    exportTemplate () {
      this.$downloadFile(this.templateUrl, 'post', this.$qs.stringify({ type: '2' }), this.$global.EXCEL)
    },
    /* 只看失败 */
    changeStatus (value) {
      this.switchValue = value
      this.getImportTableData()
    },
    fileChange (file, fileList) {
      this.fileName = file.name
    },
    uploadSuccess (response, file, fileList) {
      file.name = ''
      var fileId = String(response.data[0].fileId)// 文件id
      this.fileId = fileId
      var batchNum = this.batchNum
      this.$http({
        url: this.importUrl,
        method: 'post',
        data: this.$qs.stringify({
          addType: '',
          fileId: fileId,
          batchNum: batchNum,
          type: 1
        })
      }).then(({ data }) => {
        this.getImportTableData()
        this.getImportCountInfo()
        this.mainLoading = false
        this.$refs.upload.clearFiles()
        this.submitted = true
      }).catch(({ data }) => {
        this.mainLoading = false
      })
    },
    /* 上传失败后 */
    uploadError (err, file, fileList) {
      if (err) {
        this.fileId = ''
      }
    },
    // step-one 导入按钮
    submitUpload () {
      if (this.fileId !== '') {
        this.$http({
          url: this.cancelImportUrl,
          method: 'post',
          data: this.$qs.stringify({
            fileId: this.fileId,
            batchNum: this.batchNum
          })
        })
      }
      this.fileId = ''
      if (this.fileName !== '') {
        this.mainLoading = true
        this.fileName = ''
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    },
    /* 单个添加-取消 */
    cancleSingleAdd (done) {
      this.addInfoForm = {
        name: '',
        idCard: '',
        telephone: '',
        optrCompId: ''
      }
      this.$refs.addInfoForm.resetFields()
      if (typeof done === 'function') {
        done()
      } else {
        this.addEntryDialog = false
      }
    },
    /* 获取签署主体 */
    getEntrySubjectList () {
      this.$http({
        url: this.entrySubjectUrl,
        method: 'get',
        data: this.$qs.stringify({
        })
      }).then(({ data }) => {
        this.optrComp = data.data[0]
        if (this.optrComp.length == 1) {
          this.addInfoForm.optrCompId = this.optrComp[0].id
        }
      })
    },
    goHome () {
      clearInterval(this.timer)
      this.$router.push('entryManage/index')
    },
    /* 定时器 */
    refer () {
      var that = this
      that.timer = setInterval(function () {
        console.log('refer')
        if (that.countDown === 0) {
          clearInterval(that.timer)
          that.$router.push('entryManage/index')
        } else {
          that.countDown--
        }
      }, 1000)
    },
    // 导出列表数据
    exportData (switchValue) {
      var selections = this.$refs.importTable.selections
      if (!this.importForm) {
        selections = this.$refs.dataTable.selections
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      if (this.fileId !== '') {
        this.$downloadFile(
          this.exportDataUrl + '?fileId=' + this.fileId + '&&isSuccess=' + parseInt(this.switchValue),
          'post',
          {
            fileId: this.fileId,
            isSuccess: parseInt(switchValue),
            ids
          },
          this.$global.EXCEL
        )
      } else {
        this.$downloadFile(
          this.exportDataUrl + '?fileId=' + this.fileId + '&&isSuccess=' + parseInt(this.switchValue),
          'post',
          {
            batchNum: this.batchNum,
            isSuccess: parseInt(1),
            ids
          },
          this.$global.EXCEL
        )
      }
    }
  },
  filters: {
  }
}
</script>
<style scoped lang="less">
.import-main-container {
  background-color: #ffffff;
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 30px;
  padding-top: 90px;
  height: calc(100% - 93px);
}
.singleAdd {
  /deep/.el-form-item {
    margin-bottom: 15px;
  }
}
</style>
