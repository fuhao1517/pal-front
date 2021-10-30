<template>
  <div class="spl-container main-container" v-loading="mainLoading" :element-loading-text="active=='0'?'文件上传中...':'数据保存中...'" element-loading-spinner="el-icon-loading" element-loading-background="rgba(244, 248, 248, 0.5)">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="spl-step" style="padding-top: 90px;">
      <splSteps :active="active" :data="stepsData"></splSteps>
    </div>
    <div class="import-main-container" :style="{minHeight: contentHeight}">
      <!-- steps条 -->
      <div class="import-container">

        <!--第一步-->
        <div v-if="active == 0">
          <div class="clearfix emp-upload mt-30">
            <el-input class="fl" :readonly="true" v-model="fileName" style="width: 280px;"></el-input>
            <el-upload class="fl" ref="upload" :action="this.$global.uploadUrl" :headers="this.$global.setHeaders" :file-list="fileList" :on-change="fileChange" :on-error="uploadError" :on-success="uploadSuccess" :show-file-list="false" :auto-upload="false" :multiple="false">
              <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
              <el-button style="margin-left: 10px;" size="small s-btn" type="primary" icon="icon ic-import-white" @click="submitUpload">导入</el-button>
            </el-upload>
            <router-link to="/commerceInsurance/insuranceAdmin">
              <el-button class="s-btn ml-10" icon="icon el-icon-close">取消</el-button>
            </router-link>
            <div class="search-row-btn">
              <el-button type="primary" class="s-btn" icon="el-icon-download" @click="exportTemplate">模板下载</el-button>
              <el-button class="s-btn btn--border-blue" icon="ic-change-blue" style="margin-right: 0;margin-left: 20px;" @click="changeAddOrDel"><span v-text="this.changeButtonMessage"></span></el-button>
            </div>
          </div>
          <p class="mt-60">
            <span class="tip"><i class="el-icon-warning ic-tip-yellow"></i><span>以下导入说明通用</span></span>
          </p>
          <div class="mt-20 import-template">
            <img src="@/assets/images/import-template.png" alt="" width="100%" height="100%" />
          </div>
        </div>
      </div>
      <div v-show="active == 1">
        <div class="header-row-gray">
          <div class="handle-btn">

            <span class="tip" v-show="!confirmDate">
              <i class="el-icon-warning ic-tip-yellow"></i>
              <span>成功
                <span v-text="successCount"></span>
                <span>条，失败</span>
                <span v-text="failedCount"></span>
                <span>条。</span>
              </span>
            </span>
            <span class="tip" v-show="confirmDate">
              <i class="el-icon-warning ic-tip-yellow"></i>
              <span>本次共有
                <span v-text="successCount"></span>
                <span>条数据提交申报</span>
              </span>
            </span>

          </div>
        </div>
        <div class="notes" v-show="!confirmDate">
          <p>注：所有数据均可导出和删除，每次导入均会校验系统已有数据，正确数据确认导入后可直接导入。若想一次性导入全部数据，</p>
          <p>可点击“取消”终止本次导入，待失败数据修改正确后再全部重新导入</p>
        </div>
        <div>
          <div class="clearfix mb-15" v-show="!confirmDate">
            <div class="lh-32 fl ml-30">
              <span class="mr-10">只看失败</span>
              <el-switch v-model="switchValue" :activeColor="$global.switchColor[0]" active-value="1" inactive-value="0" :inactiveColor="$global.switchColor[1]" @change="changeStatus"></el-switch>
            </div>
            <div class="fr mr-25">
              <el-button type="primary" class="s-btn" icon="ic-export-white" @click="exportData(switchValue)">导出</el-button>
              <el-button class="s-btn btn--border-blue" style="margin-left:15px;" icon="el-icon-delete" @click="delData">删除</el-button>
            </div>
          </div>
          <!-- 增减员导入表格 -->
          <!-- <dTable v-if="type==1" @fetch="getTableData" ref="importTable" style="width: 100%;" :showSelection="true" :showIndex="true"> -->
          <dTable @fetch="getTableData" ref="importTable" :tableHeight="tableHeight" :showSelection="true" :showIndex="true"  v-show="!confirmDate">
            <el-table-column prop="changeType" label="增减员" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="employeeType" label="类型" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empName" label="姓名" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empIdCard" label="证件号码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="errorMessage" label="导入失败原因" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-text="scope.row.errorMessage" class="text-red"></span>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="购买方案代码" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="purchaseDate" label="购买日期" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stopDate" label="停保日期" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="jobPosition" label="岗位" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="name" label="有无社保" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mainInsureName" label="主被保险人姓名" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mainInsureIdCard" label="主被保险人证件号码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="relation" label="关系" width="100" :show-overflow-tooltip="true"></el-table-column>
          </dTable>
          <dTable @fetch="getSuccessData" ref="importTable2" :tableHeight="tableHeight" :showSelection="true" :showIndex="true"  v-show="confirmDate">
            <el-table-column prop="changeType" label="增减员" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="employeeType" label="类型" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empName" label="姓名" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empIdCard" label="证件号码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="productCode" label="购买方案代码" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="purchaseDate" label="购买日期" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="stopDate" label="停保日期" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="jobPosition" label="岗位" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="name" label="有无社保" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mainInsureName" label="主被保险人姓名" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="mainInsureIdCard" label="主被保险人证件号码" min-width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="relation" label="关系" width="100" :show-overflow-tooltip="true"></el-table-column>
          </dTable>
        </div>
        <div class="operate-btns-bottom clearfix " style=" margin-top:30px;padding-bottom: 35px;" v-show="!confirmDate">
          <el-button class="w-90" @click="active = 0">取消</el-button>
          <el-button type="primary" class="ml-30 w-90" @click="nextStep">确认导入</el-button>
        </div>
        <div class="operate-btns-bottom clearfix " style=" margin-top:30px;padding-bottom: 35px;" v-show="confirmDate">
          <el-button class="w-90" @click="beforeStep">上一步</el-button>
          <el-button type="primary" class="ml-30 w-90" @click="saveData">提交申报</el-button>
        </div>
      </div>
      <!--第三步-->
      <div v-show="active == 2">
        <div class="success-msg">
          <div class="clearfix" style="display: inline-block"><i class="el-icon-success fl"></i><span class="msg-title fl">导入完成</span></div>
          <p class="msg-detail"><span v-text="'您已成功导入' + successCount + '条数据'"></span><span v-show="failedCount>0">，<span class="text-red">{{failedCount}}</span>条数据导入失败<a class="text-blue a-aim" href="#" @click="exportFailData">（点击下载失败记录）</a></span></p>
          <router-link :to="'/commerceInsurance/insuranceAdmin'">
            <el-button type="primary" class="mt-60 s-btn w-130">返回投保管理</el-button>
          </router-link>
        </div>
      </div>
      <!-- 导入失败弹窗 -->
      <!-- <el-dialog class="clearfix" title="导入失败" :visible.sync="dialogVisibleDefeated" width="600px" :close-on-click-modal="false">
          <img class="ml-30 mr-10 fl" src="../../assets/images/icons/ic-account-type28.png">
          <p>抱歉，本次导入表头缺失必填字段，请重新下载模板，请勿修改模板表头</p>
        </el-dialog> -->

    </div>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
import splSteps from '../../components/common/spl-steps'

export default {
  name: 'addImport',
  data () {
    return {
      // 导航
      pathData: [{ name: '商保' }, { name: '投保管理' }, { name: '增员批量导入' }],
      // 进度条
      active: 0,
      // 增减员类型：1增 2减
      changeType: 1,
      mainLoading: false,
      fileName: '',
      fileList: [],
      switchValue: '0',
      // ture增员 false减员
      isAddImport: true,
      // 以下是默认的接口url 默认是增员的url
      tableDateUrl: '/api/comminsure/declaroppAccounte/import/result', // 表单数据url
      importUrl: '/api/comminsure/declare/import', // 导入url
      templateUrl: '/api/comminsure/declare/template/download', // 模板url
      exportDataUrl: '/api/comminsure/declare/exportExcel', // 导出数据url
      delDataUrl: '/api/comminsure/declare/deleteImport', // 删除数据url
      importCountUrl: '/api/comminsure/declaroppAccounte/import/resultCount', // 错误条数url
      saveDataUrl: '/api/comminsure/declare/excel/save', // 保存url
      changeButtonMessage: '切换减员导入',
      setp1Description: '可下载商保增员模板，完善后上传',
      confirmDate: false,
      fileId: '',
      sheetNums: 'rId1',
      failedCount: 0,
      successCount: 0,
      failedData: [],
      resultType: 3,
      dialogVisibleDefeated: false /* 导入失败弹窗 */
    }
  },
  components: { dTable, splSteps },
  computed: {
    contentHeight: function () {
      return this.$global.bodyHeight - 320 + 'px'
    },
    tableHeight: function () {
      if (this.confirmDate) {
        return this.$global.bodyHeight - 420 + 'px'
      } else {
        return this.$global.bodyHeight - 520 + 'px'
      }

    },
    stepsData: function () {
      let data = [
        { title: '下载模板/上传文件', description: this.setp1Description },
        { title: '文件校验', description: '进一步数据效验，核对' },
        { title: '导入成功', description: '确认数据无误，提交申报' }
      ]
      return data
    }
  },
  created () {
    this.isAddImport = this.$route.query.type != 1
    this.changeAddOrDel()
  },
  methods: {
    // 切换增减员导入
    changeAddOrDel () {
      if (this.isAddImport) {
        // 切换为减员
        this.isAddImport = false
        this.setp1Description = '可下载商保减员模板，完善后上传'
        this.pathData = [{ name: '商保' }, { name: '投保管理' }, { name: '减员批量导入' }]
        this.changeButtonMessage = '切换增员导入'
        this.changeType = 2
      } else {
        // 切换为增员
        this.isAddImport = true
        this.setp1Description = '可下载商保增员模板，完善后上传'
        this.pathData = [{ name: '商保' }, { name: '投保管理' }, { name: '增员批量导入' }]
        this.changeButtonMessage = '切换减员导入'

        this.changeType = 1
      }
    },
    nextStep () {
      if (this.successCount === 0) {
        this.$message.error('没有成功的数据，不能导入！')
        return
      }
      this.confirmDate = true
      this.getSuccessData()
    },
    beforeStep () {
      this.confirmDate = false
      this.getTableData()
    },
    // 上传成功后
    uploadSuccess (response, file, fileList) {
      console.log('00000')
      file.name = ''
      var changeType = this.changeType
      var sheetNums = this.sheetNums
      var fileId = String(response.data[0].fileId)// 文件id
      this.fileId = fileId
      this.$http({
        url: this.importUrl,
        method: 'post',
        data: {
          fileId: fileId,
          changeType: changeType,
          sheetNums: sheetNums,
          custId: String(this.$store.state.userData.custId)
        }
      }).then(({ data }) => {
        if (data.code == 10) {
          // 跳转到下一步查询列表数据
          this.getTableData()
          // 获取导入统计信息0
          this.getImportCountInfo()
          // this.getFailedData()
          this.mainLoading = false
          this.$refs.upload.clearFiles()
          this.active = 1
        } else {
          this.mainLoading = false
          this.$message.error(data.data.content ? data.data.content : '系统异常')
        }
      }).catch(({ data }) => {
        this.mainLoading = false
        this.dialogVisibleDefeated = true
      })
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
      if (value == 1) {
        this.resultType = 2
      } else {
        this.resultType = 3
      }
      this.getTableData()
    },

    //  导出模板
    exportTemplate () {
      var that = this
      this.$downloadFile(this.templateUrl, 'get', {
        changeType: that.changeType
      }, this.$global.EXCEL)
    },

    /* 获取列表分页数据 */
    getTableData (params = []) {
      params = [
        { property: 'currentFileId', value: this.fileId },
        { property: 'resultType', value: parseInt(this.resultType) }
      ]
      this.$refs.importTable.fetch({
        query: params,
        method: 'post',
        url: this.tableDateUrl
      })
    },
    /* 获取列表分页数据 */
    getSuccessData (params = []) {
      params = [
        { property: 'currentFileId', value: this.fileId },
        { property: 'resultType', value: parseInt(1) }
      ]
      this.$refs.importTable2.fetch({
        query: params,
        method: 'post',
        url: this.tableDateUrl
      })
    },

    /* 错误条数 */
    // getFailedData () {
    //   this.$http({
    //     url: this.failedDataUrl,
    //     method: 'post',
    //     data: {
    //       query: [
    //         { property: 'fileId', value: this.fileId },
    //         { property: 'state', value: 1 }
    //       ],
    //       page: 1,
    //       size: 1000000
    //     }
    //   }).then(({ data }) => {
    //     this.failedData = data.rows
    //   })
    // },

    /* 有几条错误数据 */
    getImportCountInfo () {
      console.log('1111')
      var filedId = this.fileId
      this.$http({
        url: this.importCountUrl + '?fileId=' + String(filedId),
        method: 'POST'

      }).then(({ data }) => {
        if (data.code == 10) {
          this.failedCount = data.data[0].failCount
          this.successCount = data.data[0].succCount
        } else {
          this.$message.error('系统异常')
        }
      }).catch(data => {
        this.$message.error('系统异常')
      })
    },

    /* 确认导入 */
    saveData () {
      if (this.successCount === 0) {
        this.$message.error('没有成功的数据，不能导入！')
        return
      }
      var filedId = this.fileId
      this.mainLoading = true
      this.$http({
        url: this.saveDataUrl + '?fileId=' + String(filedId),
        method: 'post',
        data: {
          fileId: String(this.fileId)
        }
      }).then(({ data }) => {
        this.active = 2
        this.mainLoading = false
      }).catch(({ data }) => {
        this.mainLoading = false
      })
    },
    exportData (switchValue) {
      var selections = this.$refs.importTable.selections
      if (selections.length === 0) {
        this.$message.warning('请选择需要导出的数据')
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: this.exportDataUrl,
        method: 'POST',
        data: {
          ids
        }
      }).then(({ data }) => {
        this.downloadExcel(data.data[0])
      }).catch(({ data }) => {
      })
    },
    exportFailData () {
      this.$http({
        url: this.exportDataUrl,
        method: 'POST',
        data: {
          fileId: String(this.fileId),
          result: -1
        }
      }).then(({ data }) => {
        this.downloadExcel(data.data[0])
      }).catch(({ data }) => {
      })
    },
    downloadExcel (fileId) {
      this.$downloadFile('/api/file/download/' + fileId, 'get', {}, this.$global.EXCEL)
    },
    /* 删除 */
    delData () {
      var selections = this.$refs.importTable.selections
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
        method: 'post',
        data: {
          ids
        }
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.getTableData()
        this.getImportCountInfo()
      })
    },

    // step-one 导入按钮
    submitUpload () {
      if (this.fileName !== '') {
        this.mainLoading = true
        this.fileName = ''
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    }

  }
}

</script>
<style lang='less' scoped>
.main-container {
  background-color: #ffffff;
}
.import-main-container {
  background-color: #ffffff;
  /*padding: 10px 30px 20px 30px;*/
  position: relative;
  /*height: calc(100% - 73px);*/
}
.import-template {
  text-align: center;
  img {
    display: inline-block;
    max-width: 1393px;
    height: 300px;
  }
}
.notes {
  padding: 20px 30px 15px 30px;
  color: #606266;
}
.import-container {
  position: relative;
  margin: 0 auto;
  max-width: @mainContainerWidth;
}
/deep/.el-dialog__body {
  height: 81px;
}
</style>
