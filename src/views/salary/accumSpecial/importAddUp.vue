<template>
  <div class="content" v-loading="mainLoading">
    <header class="header">
      <div class="header-left">导入累计值</div>
      <div class="header-right">
        <el-button size="small" type="primary" @click="handleSave">保存</el-button>
        <img class="ml-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="handleClose">
      </div>
    </header>

    <el-form class="select-form pt-30" :inline="true" :model="accumForm" ref="accumForm">

      <el-form-item prop="taxMonth" class="ml-40" label="薪酬年月:" :rules="[{ required: true, message: '请选择薪酬年月',trigger:'change'}]">
        <el-date-picker class="date-editor2" v-model="accumForm.taxMonth" value-format="yyyy-MM" type="month"></el-date-picker>
      </el-form-item>

      <el-form-item prop="companyName" label="扣缴义务人:" :rules="[{ required: true, message: '请选择扣缴义务人',trigger:'change'}]">
        <el-select clearable v-model="accumForm.companyName">
          <el-option v-for="(item,index) in optrCompvoList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
         <el-input class="w-200 fl" :readonly="true" v-model="fileName"></el-input>
          <el-upload
            class="fl"
            ref="upload"
            :action="this.$global.uploadUrl"
            :headers="this.$global.setUploadHeaders"
            :file-list="fileList"
            :on-change="fileChange"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :show-file-list="false"
            :auto-upload="false"
            :multiple="false">
            <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
            <el-button class="ml-10" size="small s-btn" type="primary" icon="icon ic-import" @click="submitUpload">
              <img src="../../../assets/images/icons/ic-account-type24.png">
              导入
            </el-button>
          </el-upload>

          <div class="search-row-btn mr-40 ml-10">
            <el-button type="primary" class="s-btn" @click="handleDownload"><img src="../../../assets/images/icons/ic-account-type25.png">推荐模板下载</el-button>
          </div>

      </el-form-item>
    </el-form>

    <div class="hint">
      <i class="el-icon-warning ic-tip-yellow ml-30"></i>
      <p>结果：通过校验<span v-text="successCount"></span>条 失败 <span style="color:#d6788c;" v-text="failedCount"></span>条</p>
      <div class="ml-50">
        <span>只看失败</span>
        <el-switch v-model="switchValue" class="ml-10" :activeColor="$global.switchColor[0]" :inactiveColor="$global.switchColor[1]" active-value="1" inactive-value="" @change="changeStatus"></el-switch>
      </div>

    </div>

    <dTable @fetch="getTableData" ref="salaryTable" class="mb-30" style="position: relative;" :tableHeight="tableHeight" :showIndex="true" :showSelection="true">
      <el-table-column width="250" prop="verityMessage" label="失败原因"></el-table-column>
      <el-table-column width="150" prop="name" label="姓名"></el-table-column>
      <el-table-column width="200" prop="idCard" label="证件号码"></el-table-column>
      <el-table-column width="180" prop="telephone" label="手机号"></el-table-column>
      <el-table-column width="200" prop="optrComName" label="扣缴义务人"></el-table-column>
      <el-table-column width="200" prop="totalAmount" label="累计减除费用"></el-table-column>
      <el-table-column width="150" prop="salaryDate" label="薪酬年月"></el-table-column>
      <el-table-column width="150" prop="childrenEducationAmount" label="累计子女教育扣除"></el-table-column>
      <el-table-column width="150" prop="keepEducationAmonut" label="累计继续教育扣除"></el-table-column>
      <el-table-column width="150" prop="supportOldAmout" label="累计赡养老人扣除"></el-table-column>
      <el-table-column width="150" prop="bigIllness" label="累计大病医疗扣除"></el-table-column>
      <el-table-column width="150" prop="housingLoansAmonut" label="累计住房贷款利息"></el-table-column>
      <el-table-column width="150" prop="housingRentsAmonut" label="累计租房租金扣除"></el-table-column>
      <el-table-column width="150" prop="entyDate" label="任职受雇日期"></el-table-column>
      <el-table-column width="150" prop="employeeType" label="员工从业类型"></el-table-column>
      <el-table-column width="150" prop="yearFirstSalary" label="是否纳税年度首次取得工资"></el-table-column>
      <template slot="pagination-btns">
        <footer class="comment">
          <el-button class="ml-30" size="small" type="primary" @click="handleExport(switchValue)"><i class="ic-export-white"></i> 导出</el-button>
          <el-button class="btn--border-blue ml-30" size="small" @click="handleDelete"><i class="el-icon-delete"></i> 删除</el-button>
        </footer>
      </template>
    </dtable>

    <!-- 导入失败弹窗 -->
    <div class="err-dialog" v-if="dialogVisible">
      <div class="cause-view">
        <div class="title-top mb-30 clearfix">
          <p class="fl ml-20">导入失败</p>
          <img class="fr mr-20 mt-20 f-cursor" @click="dialogVisible=false" src="../../../assets/images/icons/ic-account-type13.png" alt="">
        </div>
        <p class="mb-20" style="display:flex; align-items:center;">
          <img class="mr-10 ml-10" src="../../../assets/images/icons/ic-account-type28.png" alt="">
          <span>{{errorMsg}}</span>
        </p>
      </div>
    </div>

  </div>
</template>
<script>
import dTable from '../../../components/common/table'
export default {
  inject: ['reload'],
  components: { dTable },
  props: ['optrCompvoList'],
  data () {
    return {
      mainLoading: false,
      dialogVisible: false,
      accumForm: {
        taxMonth: '',
        companyName: ''
      },
      switchValue: '',
      fileName: '', // 文件名
      fileId: '',
      fileList: [], // 文件列表
      failedCount: 0, // 失败条数
      successCount: 0, // 成功条数
      errorMsg: ''// 导入失败错误信息
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 480 + 'px'
    }
  },
  methods: {
    /* 保存 */
    handleSave () {
      if (this.successCount === '0') {
        this.$message.error('没有成功的数据，不能导入！')
        return
      }
      this.mainLoading = true
      this.$http({
        url: '/api/salary/import/save?fileId=' + this.fileId + '&companyName=' + this.accumForm.companyName,
        method: 'get',
        data: {}
      }).then(({ data }) => {
        if (data.code === '10') {
          this.$message.success('保存成功！')
          this.mainLoading = false
          setTimeout(() => {
            this.reload()
          }, 1000)
        }
      })
    },
    /* 关闭 */
    handleClose () {
      this.$emit('handleClose')
    },
    /* 模板下载 */
    handleDownload () {
      this.$downloadFile('/api/salary/downloadAggregateTemplateFile', 'get', {
      }, this.$global.EXCEL)
    },
    /* 动态文件名称改变 */
    fileChange (file, fileList) {
      this.fileName = file.name
    },
    /* 导入 */
    submitUpload () {
      this.$refs.accumForm.validate((valid) => {
        if (valid) {
          if (this.fileName !== '') {
            this.mainLoading = true
            this.fileName = ''
            this.$refs.upload.submit()
          } else {
            this.$message.warning('请选择文件')
          }
        }
      })
    },
    /* 上传成功后 */
    uploadSuccess (response, file, fileList) {
      file.name = ''
      var fileId = String(response.data[0].fileId)// 文件id
      this.fileId = fileId
      this.$http({
        url: '/api/salary/employeeTaxItemImport',
        method: 'post',
        data: this.$qs.stringify({
          fileId,
          taxMonth: this.accumForm.taxMonth,
          companyName: this.accumForm.companyName
        })
      }).then(({ data }) => {
        if (data.data[0].state === false) {
          this.errorMsg = data.data[0].msg
          this.mainLoading = false
          this.dialogVisible = true
        } else {
          this.getTableData()
          this.getImportCountInfo()
          this.mainLoading = false
          this.$message.success('导入成功！')
          this.$refs.upload.clearFiles()
        }
      })
    },
    /* 上传失败后 */
    uploadError (err, file, fileList) {
      if (err) {
        this.dialogVisible = true
      }
    },
    /* 获取列表分页数据 */
    getTableData (params = []) {
      params = [
        { property: 'fileId', value: this.fileId },
        { property: 'status', value: this.switchValue }
      ]
      this.$refs.salaryTable.fetch({
        query: params,
        method: 'post',
        url: '/api/salary/taxItemImport'
      })
    },
    /* 只看失败 */
    changeStatus (value) {
      if (value === true) {
        value = ''
      }
      this.switchValue = value
      this.getTableData()
    },
    /* 有几条错误数据 */
    getImportCountInfo () {
      this.$http({
        url: '/api/salary/employeeTaxItem/importCount',
        method: 'post',
        data: this.$qs.stringify({
          fileId: this.fileId
        })
      }).then(({ data }) => {
        this.successCount = data.data[0].success
        this.failedCount = data.data[0].fail
      })
    },
    /* 导出 */
    handleExport (switchValue) {
      this.$downloadFile('/api/salary/import/export?fileId=' + this.fileId + '&status=' + switchValue, 'get', {}, this.$global.EXCEL)
    },
    /* 删除 */
    handleDelete () {
      var selections = this.$refs.salaryTable.selections
      if (selections.length === 0) {
        this.$message.warning('请选择需要删除的数据')
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: '/api/salary/import/deleteByIds?ids=' + ids.join(',') + '&fileId=' + this.fileId + '&type=' + this.switchValue,
        method: 'get',
        data: {}
      }).then(({ data }) => {
        if (data.code === '10') {
          this.$message.success('删除成功')
          this.getTableData()
          this.getImportCountInfo()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .content {
      position: relative;
     .header {
      display: flex;
      background: #ffffff;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      padding: 0 20px 0 29px;
      border-bottom: 20px solid #f0f2f5;
      .header-left,.header-right{
        display: flex;
        align-items: center;
      }
      .header-left{
        font-size: 18px;
        color: #222;
      }
      .header-right{
        .el-button{
          width: 100px;
          height: 32px;
        }
      }
      /deep/.el-form,.demo-form-inline,.el-form--inline{
        display: flex;
        justify-content: space-between;
        border-bottom: 50px solid #ddd;
      }
    }
    .hint{
      display: flex;
      align-items: center;
      background: #F2F2F2;
      padding: 15px 0;
    }
    .err-dialog{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      .cause-view{
        position: fixed;
        width: 600px;
        height: 196px;
        border-radius: 5px;
        background: #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -55%);
        text-align: center;
        border: 1px solid #ddd;
        .title-top{
          font-size: 18px;
          height: 60px;
          line-height: 60px;
          text-align: left;
          border-bottom: 1px solid #BFBFBF;
        }
      }
    }
  }
    /deep/.el-select__caret,.el-input__icon,.el-icon-arrow-up{
        color: #409EFF;
        position: relative;
        left: 0px !important;
      }
</style>
