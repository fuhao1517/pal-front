<template>
  <div class="spl-container main-container" v-loading="mainLoading" :element-loading-text="active=='0'?'文件上传中...':'数据保存中...'" element-loading-spinner="el-icon-loading" element-loading-background="rgba(244, 248, 248, 0.5)">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="import-main" :style="{minHeight: contentHeight}">
      <div class="import-container">
        <splSteps :active="active" :data="stepsData"></splSteps>
        <div class="import-limit-center">
          <!--第一步-->
          <div v-if="active == 0">
            <div class="clearfix emp-upload">
              <el-input class="fl" :readonly="true" v-model="fileName" style="width:280px;"></el-input>
              <el-upload class="fl" ref="upload" :action="this.$global.uploadUrl" :headers="this.$global.setHeaders" :file-list="fileList" :on-change="fileChange" :on-error="uploadError" :on-success="uploadSuccess" :show-file-list="false" :auto-upload="false" :multiple="false">
                <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
                <el-button style="margin-left: 10px;" size="small s-btn" type="primary" icon="ic-import-white" @click="submitUpload">导入</el-button>
              </el-upload>
              <router-link to="/socialAccfund/insuranceManage">
                <el-button class="s-btn ml-10" icon="icon el-icon-close">取消</el-button>
              </router-link>
              <el-button type="primary" class="s-btn fr" icon="el-icon-download" @click="exportTemplate">模板下载</el-button>
            </div>
            <p class="tip-area">
              <span class="tip"><i class="el-icon-warning ic-tip-yellow"></i><span>以下导入说明通用</span></span>
            </p>
            <div class="import-template">
              <img src="@/assets/images/import-template.png" alt="" width="100%" height="100%" />
            </div>
          </div>
        </div>

        <!--第二步-->
        <div v-show="active == 1">
          <div class="error-msg">
            <p style="width: 100%;">
              <span class="tip">
                <i class="el-icon-warning ic-tip-yellow"></i>
                <span>结果：成功
                  <span v-text="successCount" class="mlmr-5 text-red"></span>
                  <span>条，失败</span>
                  <span v-text="failedCount" class="text-red mlmr-5"></span>
                  <span>条</span>
                </span>
              </span>
              <!--<span class="open-detail">展开详情</span>-->
            </p>
          </div>
          <div class="notes">
            <p>注：所有数据均可导出和删除，每次导入均会校验系统已有数据，正确数据确认导入后可直接导入。若想一次性导入全部数据，</p>
            <p>可点击“取消”终止本次导入，待失败数据修改正确后再全部重新导入</p>
          </div>
          <div>
            <div class="clearfix mt-10 mb-15 pr-20">
              <span class="ml-20 mr-10">只看失败</span>
              <el-switch v-model="switchValue" :activeColor="$global.switchColor[0]" active-value="1" inactive-value="0" :inactiveColor="$global.switchColor[1]" @change="changeStatus"></el-switch>
              <div class="fr clearfix" style="margin-top: -5px;">
                <el-button size="small" class="s-btn ml
                -15 fl btn--border-blue" icon="el-icon-delete" @click="delData">删除</el-button>
                <el-button size="small" type="primary" class="fl" icon="ic-export-white" @click="exportData(switchValue)">导出</el-button>
              </div>
            </div>
            <!-- 增减员导入表格 -->
            <dTable @fetch="getTableData" ref="importTable" :key="refreshImportTable" style="width: 100%;" :tableHeight="tableHeight" :showSelection="true" :showIndex="true">
              <el-table-column label="参保人" align="center" class-name="border-l border-b-none">
                <el-table-column prop="empName" label="姓名" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="idCard" label="证件号码" min-width="200" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="errorMessage" label="导入失败原因" min-width="200" :show-overflow-tooltip="true" class-name="border-l">
                  <template slot-scope="scope">
                    <span v-text="scope.row.errorMessage" class="text-red"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="社保" align="center" class-name="border-l border-b-none">
                <el-table-column prop="socialChangeType" label="申报类型" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="socialFyDateStr" label="费用年月" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="socialProductName" label="方案名称" min-width="150" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="socialTbBase" label="投保基数" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="socialChangeReason" label="变动原因" min-width="150" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
              </el-table-column>
              <el-table-column label="公积金" align="center" class-name="border-l border-b-none">
                <el-table-column prop="accfundChangeType" label="申报类型" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="accfundFyDateStr" label="费用年月" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="accfundProductName" label="方案名称" min-width="150" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="accfundTbBase" label="投保基数" width="100" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="accfundChangeReason" label="变动原因" min-width="150" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
              </el-table-column>
            </dTable>
          </div>
          <br>
          <div class="operate-btns-bottom">
            <el-button size="small" @click="cancelImport">取消</el-button>
            <el-button size="small" type="primary" class="ml-30" @click="addSubInfo" :disabled="btnDisabled">{{dynamicTabs.length>0?'下一步：补充投保信息':'下一步'}}</el-button>
          </div>
        </div>

        <!--第三步-->
        <div v-show="active == 2">
          <div class="mt-15">
            <splTab :tabs="dynamicTabs" v-model="dynamicActive" @changeTab="handleDynamicTabs"></splTab>
            <div class="clearfix">
              <div class="fr mt-10 mb-10 clearfix" style="padding-right: 18px;">
                <el-input class="fl" :readonly="true" v-model="fileName" style="width: 280px;"></el-input>
                <el-upload class="fl" ref="upload2" :action="this.$global.uploadUrl" :headers="this.$global.setHeaders" :file-list="fileList" :on-change="fileChange" :on-success="uploadSuccess2" :show-file-list="false" :auto-upload="false" :multiple="false">
                  <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
                  <el-button style="margin-left: 10px;" size="small s-btn" type="primary" icon="ic-import-white" @click="submitUpload2">导入</el-button>
                  <el-button type="primary" plain size="small s-btn" icon="el-icon-upload2" @click="exportAddInfo">导出需补充信息</el-button>
                </el-upload>
                <br>
              </div>
            </div>
            <div style="padding: 0 20px;">
              <dTable @fetch="getTableData2" ref="dynamicCols" style="width: 100%;" :tableHeight="tableHeight2" :showSelection="true" :showIndex="true" :key="dynamicKey">
                <el-table-column prop="empName" label="姓名" min-width="120" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column prop="idCard" label="证件号码" min-width="150" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
                <el-table-column :label="item.text" min-width="120" v-for="(item,index) in dynamicActiveCols" :key="index" class-name="border-l" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div v-if="(scope.row.notSuppDynamicCols.indexOf(item.text)<0)||(scope.row.dynamicCol[item.text]&&scope.row.dynamicCol[item.text]!=null&&scope.row.dynamicCol[item.text]!='')">{{scope.row.dynamicCol[item.text]}}</div>
                    <div v-else style="height: 23px;width: 100%;border: 1px solid red"></div>
                  </template>
                </el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" icon="icon el-icon-delete" @click="delData2" class="btn--border-blue">删除</el-button>
                </template>

              </dTable>
            </div>

          </div>
          <div class="operate-btns-bottom mt-20">
            <el-button class="cancel-btn-border" @click="active = 1">上一步</el-button>
            <el-button type="primary" class="ml-30" @click="saveData">确认导入</el-button>
          </div>
        </div>

        <!--第四步-->
        <div v-show="active == 3">
          <div v-show="!importConfirm">
            <div class="mt-30 clearfix mb-15">
              <span class="mr-10 ml-20 lh-32">本次共<span class="text-red"> {{this.successCount}} </span>条数据提交申报</span>
              <div class="fr pr-30 clearfix">
                <el-button size="small" type="primary" icon="ic-export-white" @click="exportData(switchValue)">导出</el-button>
                <el-button size="small" icon="el-icon-delete" class="s-btn fr btn--border-blue" style="margin-left: 15px;" @click="delData3">删除</el-button>
              </div>
            </div>
            <dTable @fetch="getTableData3" ref="importTable3" style="width: 100%;" :tableHeight="tableHeight3" :showIndex="true" :showSelection="true">
              <el-table-column label="参保人" class-name="border-l">
                <el-table-column prop="empName" label="姓名" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="idCard" label="证件号码" min-width="200" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
              </el-table-column>
              <el-table-column label="社保" class-name="border-l">
                <el-table-column prop="socialChangeType" label="申报类型" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="socialFyDateStr" label="费用年月" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="socialProductName" label="方案名称" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="socialTbBase" label="投保基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="socialChangeReason" label="变动原因" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
              </el-table-column>
              <el-table-column label="公积金" class-name="border-l">
                <el-table-column prop="accfundChangeType" label="申报类型" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="accfundFyDateStr" label="费用年月" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="accfundProductName" label="方案名称" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="accfundTbBase" label="投保基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="accfundChangeReason" label="变动原因" width="100" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
              </el-table-column>
            </dTable>
            <br>
            <div class="operate-btns-bottom">
              <el-button @click="beforeStep">上一步</el-button>
              <el-button type="primary" class="ml-30" @click="submitData">提交申报</el-button>
            </div>
          </div>
          <div class="success-msg" v-show="importConfirm">
            <i class="el-icon-success"></i>
            <p class="msg-title">导入完成</p>
            <p class="msg-detail">
              <span v-text="'您已成功导入' + successCount + '条数据，'+failedCount+'条数据导入失败'"></span>
              <a class="text-blue a-aim" href="#" @click="exportData('1')" v-show="failedCount>0">（点击下载失败记录）</a>
            </p>
            <router-link :to="'/socialAccfund/insuranceManage'">
              <el-button type="primary" class="mt-30">返回投保管理</el-button>
            </router-link>
          </div>
        </div>
        <!-- 导入失败弹窗 -->
        <el-dialog class="clearfix" title="导入失败" :visible.sync="dialogVisibleDefeated" width="600px" :close-on-click-modal="false">
          <img class="ml-30 mr-10 fl" src="../../assets/images/icons/ic-account-type28.png">
          <p>抱歉，本次导入表头缺失必填字段，请重新下载模板，请勿修改模板表头</p>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
import splTab from '../../components/common/spl-tab'
import splSteps from '../../components/common/spl-steps'
export default {
  name: 'addImport',
  data () {
    return {
      // 导航
      pathData: [{ name: '社保公积金' }, { name: '参保管理' }, { name: '增减员批量导入' }],
      stepsData: [
        { title: '选择导入文件', description: '下载导入模板，完善数据' },
        { title: '数据核对', description: '导入社保，公积金增减员数据核对' },
        { title: '录入补充信息', description: '完善增减员投保时所需信息' },
        { title: '保存', description: '确认数据，提交申报' }
      ],
      // 进度条
      active: 0,
      refreshImportTable: new Date().getTime(),
      mainLoading: false,
      fileName: '',
      fileList: [],
      switchValue: 0,
      failReason: false,
      btnDisabled: true,
      // ture增员 false减员
      isAddImport: true,
      // 以下是默认的接口url 默认是增员的url
      tableDateUrl: '/api/socialAccfund/details', // 第二步表单数据
      importUrl: '/api/socialAccfund/import', // 导入url
      dynImportUrl: '/api/socialAccfund/suppInfos/import', // 补充信息导入url
      templateUrl: '/api/socialAccfund/templates', // 模板url
      dynTemplateUrl: '/api/socialAccfund/suppInfos/templates', // 模板url
      exportDataUrl: '/api/socialAccfund/details/export', // 导出数据url
      delDataUrl: '/api/socialAccfund/details', // 删除数据url
      importCountUrl: '/api/socialAccfund/details/importResult', // 错误条数url
      dynamicColUrl: '/api/socialAccfund/suppInfos',
      submitDataUrl: '/api/socialAccfund/batchSave', // 第二步保存url
      subInfoStatusUrl: '/api/socialAccfund/suppInfos/areaNames',
      setp1Description: '可下载商保增员模板，完善后上传',
      dynFileId: '',
      fileId: '',
      failedCount: 0,
      successCount: 0,
      importConfirm: false,
      dialogVisibleDefeated: false,
      failedData: [],
      dynamicCols: [],
      dynamicActiveCols: [],
      dynamicTabs: [],
      dynamicActive: 0,
      dynamicKey: new Date().getTime(),
      addSubInfoYet: false
    }
  },

  components: { dTable, splTab, splSteps },
  computed: {
    contentHeight: function () {
      return this.$global.bodyHeight - 270 + 'px'
    },
    tableHeight: function () {
      return this.$global.bodyHeight - 500 + 'px'
    },
    tableHeight2: function () {
      return this.$global.bodyHeight - 520 + 'px'
    },
    tableHeight3: function () {
      return this.$global.bodyHeight - 480 + 'px'
    }
  },
  created () {
  },
  methods: {
    // 第一部导入按钮
    submitUpload () {
      if (this.fileName !== '') {
        this.mainLoading = true
        this.fileName = ''
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    },
    // 第三部导入按钮
    submitUpload2 () {
      if (this.fileName !== '') {
        this.mainLoading = true
        this.fileName = ''
        this.$refs.upload2.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    },
    // 第一步上传成功后
    uploadSuccess (response, file, fileList) {
      file.name = ''
      var fileId = String(response.data[0].fileId)// 文件id
      this.fileId = fileId
      this.$http({
        url: this.importUrl,
        method: 'post',
        data: this.$qs.stringify({
          fileId: fileId,
          custId: String(this.$store.state.userData.custId)
        })
      }).then(({ data }) => {
        // 跳转到下一步查询列表数据
        this.getTableData()
        // 获取导入统计信息0
        this.getImportCountInfo()
        // this.getFailedData()
        this.$refs.upload.clearFiles()
        this.getDynamicCol()// 获取动态字段 生成第三部页面表单数据
        this.active = 1
        this.mainLoading = false
      }).catch(({ data }) => {
        this.mainLoading = false
      })
    },
    // 第一步上传成功后
    uploadSuccess2 (response, file, fileList) {
      file.name = ''
      var dynFileId = String(response.data[0].fileId)// 文件id
      this.dynFileId = dynFileId
      this.$http({
        url: this.dynImportUrl,
        method: 'post',
        data: this.$qs.stringify({
          fileId: dynFileId,
          importQueueId: this.fileId
        })
      }).then(({ data }) => {
        // 跳转到下一步查询列表数据
        this.getTableData2()
        this.mainLoading = false
        this.$refs.upload2.clearFiles()
      }).catch(({ data }) => {
        this.mainLoading = false
      })
    },
    /* 上传失败后 */
    uploadError2 (err, file, fileList) {
      if (err) {
        this.dialogVisibleDefeated = true
      }
    },
    /* 上传失败后 */
    uploadError (err, file, fileList) {
      if (err) {
        this.dialogVisibleDefeated = true
      }
    },
    fileChange (file, fileList) {
      this.fileName = file.name
    },
    /* 只看失败 */
    changeStatus (value) {
      this.switchValue = value
      this.failReason = !this.failReason
      this.getTableData()
    },
    //  导出模板
    exportTemplate () {
      this.$downloadFile(this.templateUrl, 'post', {
        // moduleCode: this.moduleCode,
        // subModuleCode: this.subModuleCode
      }, this.$global.EXCEL)
    },
    /* 导入第二步表格 */
    getTableData () {
      var params = []
      var that = this
      if (this.switchValue == 0) {
        params = [{ property: 'fileId', value: this.fileId }]
      } else {
        params = [
          { property: 'fileId', value: this.fileId },
          { property: 'state', value: parseInt(this.switchValue) }
        ]
      }
      this.$refs.importTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDateUrl
      })
    },
    // 下一步：补充投保信息 按钮
    addSubInfo () {
      if (this.successCount == 0) {
        this.$message.warning('本次导入没有正确的数据，无法进入下一步')
        return
      }
      if (this.dynamicTabs.length > 0) {
        this.active = 2
        this.getTableData2()
      } else {
        this.active = 3
        this.getTableData3()
      }
    },
    // 上一步
    beforeStep () {
      if (this.dynamicTabs.length > 0) {
        this.active = 2
      } else {
        this.active = 1
      }
    },

    getDynamicCol () {
      let that = this
      this.$http({
        url: this.dynamicColUrl,
        method: 'get',
        params: {
          fileId: that.fileId
        }
      }).then(({ data }) => {
        this.dynamicTabs = []
        this.dynamicCols = []
        if (data.data[0].length > 0) {
          data.data[0].forEach((item, index) => {
            that.dynamicTabs.push(item.addrName)
            that.dynamicCols.push(item.dynamicCols)
          })
        }
        this.dynamicActiveCols = this.dynamicCols[this.dynamicActive]
        this.btnDisabled = false
      })
    },
    /* 导入成功取第三步数据 */
    getTableData2 () { // 成功且未删除的数据分批
      this.dynamicActiveCols = this.dynamicCols[this.dynamicActive]
      let location = this.dynamicTabs[this.dynamicActive]
      var params = [
        { property: 'fileId', value: this.fileId },
        { property: 'state', value: parseInt(0) },
        { property: 'addrName', value: location }
      ]
      this.dynamicKey = new Date().getTime()
      this.$nextTick(() => {
        this.$refs.dynamicCols.fetch({ query: params, method: 'post', url: this.tableDateUrl })
      })
    },
    // 第二步导入的数据再导出来
    exportData (switchValue) {
      var selections = this.$refs.importTable.selections
      var ids = []
      var state = 0
      selections.forEach(item => {
        ids.push(item.id)
      })
      if (this.switchValue == '1') { // 只看失败
        state = -1
        this.$downloadFile(
          this.exportDataUrl,
          'post',
          {
            fileId: this.fileId,
            state: state,
            ids
          },
          this.$global.EXCEL
        )
      } else {
        this.$downloadFile(
          this.exportDataUrl,
          'post',
          {
            fileId: this.fileId,
            ids
          },
          this.$global.EXCEL
        )
      }
    },

    /* 导入第四步数据 */
    getTableData3 () {
      var params = []
      params = [
        { property: 'fileId', value: this.fileId },
        { property: 'state', value: parseInt(0) }
      ]
      this.$refs.importTable3.fetch({ query: params, method: 'post', url: this.tableDateUrl })
    },

    /* 错误数据 */
    getFailedData () {
      this.$http({
        url: this.failedDataUrl,
        method: 'post',
        data: {
          query: [
            { property: 'fileId', value: this.fileId },
            { property: 'state', value: 1 }
          ],
          page: 1,
          size: 1000000
        }
      }).then(({ data }) => {
        this.failedData = data.rows
      })
    },
    /* 有几条错误数据 */
    getImportCountInfo () {
      this.$http({
        url: this.importCountUrl,
        method: 'get',
        params: {
          fileId: this.fileId
        }
      }).then(({ data }) => {
        if (data.code == 10) {
          this.failedCount = data.data[0].failNum
          this.successCount = data.data[0].successNum
        } else {
          this.$message.error('系统异常')
        }
      }).catch(data => {
        this.$message.error('系统异常')
      })
    },
    handleDynamicTabs (item, event) {
      this.getTableData2()
    },
    /* 第三部确认导入 */
    saveData () {
      this.mainLoading = true
      this.$http({
        url: this.subInfoStatusUrl,
        method: 'get',
        params: {
          fileId: this.fileId
        }
      }).then(({ data }) => {
        this.mainLoading = false
        if (data.data[0] == '') {
          this.addSubInfoYet = true
        }
        if (!this.addSubInfoYet) {
          this.$message.warning('请先补全补充信息')
        } else {
          this.active = 3
          this.getTableData3()
        }
      }).catch(data => {
        this.mainLoading = false
      })
    },
    // 取消导入
    cancelImport () {
      this.active = 0
      this.btnDisabled = true
      this.addSubInfoYet = false
    },
    // 提交申报
    submitData () {
      this.mainLoading = true
      this.$http({
        url: this.submitDataUrl,
        method: 'post',
        params: {
          fileId: this.fileId
        }
      }).then(({ data }) => {
        this.failedCount = data.data[0].failNum
        this.successCount = data.data[0].successNum
        this.mainLoading = false
        this.importConfirm = true
      }).catch(data => {
        this.$message.error('系统异常')
      })
    },
    // 导出需补充数据
    exportAddInfo () {
      var selections = this.$refs.dynamicCols.selections
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$downloadFile(
        this.dynTemplateUrl,
        'post',
        {
          areaName: this.dynamicTabs[this.dynamicActive],
          fileId: this.fileId,
          customerId: this.$store.state.userData.custId,
          ids
        },
        this.$global.EXCEL
      )
    },
    /* 删除第二步页面数据 */
    delData () {
      var selections = this.$refs.importTable.selections
      if (selections.length == 0) {
        this.$message.error('请先勾选数据！')
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: this.delDataUrl,
        method: 'delete',
        data: {
          ids
        }
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.getTableData()
        this.getImportCountInfo()
        this.getFailedData()
      })
    },

    /* 删除第三步页面数据 */
    delData2 () {
      var selections = this.$refs.dynamicCols.selections
      if (selections.length === 0) {
        this.$message.warning('请选择需要删除的数据')
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: this.delDataUrl,
        method: 'delete',
        data: {
          ids
        }
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.getTableData2()
        this.getImportCountInfo()
        this.getFailedData()
      })
    },

    /* 删除第四步页面数据 */
    delData3 () {
      var selections = this.$refs.importTable3.selections
      if (selections.length === 0) {
        this.$message.warning('请选择需要删除的数据')
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: this.delDataUrl,
        method: 'delete',
        data: {
          ids
        }
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.getTableData3()
        this.getImportCountInfo()
        // this.getFailedData()
      })
    }

  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/import.less';
</style>
