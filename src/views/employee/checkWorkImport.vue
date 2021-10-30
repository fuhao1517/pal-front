<template>
  <div class="spl-container content">
    <breadcrumb :data="pathData"></breadcrumb>
    <el-form class="select-form pt-20" :inline="true" :model="accumForm" ref="accumForm">
      <el-form-item style="margin-bottom: 10px">
        <el-input class="w-200 fl ml-20" v-model="fileName" :readonly="true" ></el-input>
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
            <img src="../../assets/images/icons/ic-account-type24.png">
            导入
          </el-button>
        </el-upload>

        <div class="search-row-btn mr-40 ml-10">
          <el-button type="primary" class="s-btn" @click="handleDownload"><img src="../../assets/images/icons/ic-account-type25.png">推荐模板下载</el-button>
        </div>
      </el-form-item>
      <div class="hint">
        <i class="el-icon-warning ic-tip-yellow ml-30"></i>
        <p>结果：通过校验<span v-text="successCount"></span>条 失败 <span style="color:#d6788c;" v-text="failedCount"></span>条</p>
        <div class="ml-50">
          <span>只看失败</span>
          <el-switch v-model="switchValue" class="ml-10" :activeColor="$global.switchColor[0]" :inactiveColor="$global.switchColor[1]" active-value="1" inactive-value="" @change="changeStatus"></el-switch>
        </div>
      </div>
    </el-form>

    <dTable @fetch="getTableData" ref="salaryTable" class="mb-30" style="position: relative;" :tableHeight="tableHeight" :showIndex="true" :showSelection="true">
      <el-table-column width="250" align="center" prop="failReason" label="失败原因"></el-table-column>
      <el-table-column width="150" align="center" prop="name" label="姓名"></el-table-column>
      <el-table-column width="200" align="center" prop="idCard" label="证件号码"></el-table-column>
      <el-table-column width="180" align="center" prop="phoneNumber" label="手机号"></el-table-column>
      <!--<el-table-column width="200" align="center" prop="deptName" label="部门"></el-table-column>-->
      <!--<el-table-column width="200" align="center" prop="job" label="岗位"></el-table-column>-->
      <el-table-column width="200" align="center" prop="onDutyTime" label="上班打卡时间">
        <template slot-scope="scope">
          <span v-text="scope.row.onDutyTime ? $moment(scope.row.onDutyTime).format('YYYY-MM-DD HH:mm:ss') : '' "> </span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" prop="offDutyTime" label="下班打卡时间">
        <template slot-scope="scope">
          <span v-text="scope.row.offDutyTime ? $moment(scope.row.offDutyTime).format('YYYY-MM-DD HH:mm:ss') : '' "> </span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" prop="comment" label="请假类型"></el-table-column>
      <template slot="pagination-btns">
        <footer class="comment">
          <el-button class="ml-30" size="small" type="primary" @click="handleExport(switchValue)"><i class="ic-export-white"></i> 导出</el-button>
          <el-button class="btn--border-blue ml-30" size="small" @click="handleDelete"><i class="el-icon-delete"></i> 删除</el-button>
        </footer>
      </template>
    </dtable>
    <footer class="comment text-center">
      <el-button class="ml-30 s-btn w-90" type="primary" size="small" @click="handleSave"> 保存</el-button>
      <el-button class="btn--border-blue s-btn w-90" style="margin-left: 60px" size="small" @click="returnPage()"> 取消</el-button>

    </footer>

    <!-- 导入失败弹窗 -->
    <div class="err-dialog" v-if="dialogVisible">
      <div class="cause-view">
        <div class="title-top mb-30 clearfix">
          <p class="fl ml-20">导入失败</p>
          <img class="fr mr-20 mt-20 f-cursor" @click="dialogVisible=false" src="../../assets/images/icons/ic-account-type13.png" alt="">
        </div>
        <p class="mb-20" style="display:flex; align-items:center;">
          <img class="mr-10 ml-10" src="../../assets/images/icons/ic-account-type28.png" alt="">
          <span>{{errorMsg}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import dTable from '../../components/common/table'
  export default {
    inject: ['reload'],
    components: { dTable },
    data () {
      return {
        pathData: [{ name: '人员管理' }, { name: '考勤列表' }, { name: '打卡记录' }, { name: '导入考勤' }],
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
        errorMsg: '',// 导入失败错误信息
        dateStr: ''
      }
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 380 + 'px'
      }
    },
    created () {
      this.$nextTick(() => {
        let dateStr = this.$route.query.dateStr
        this.dateStr = dateStr
      })
    },
    methods: {
      /* 保存 */
      handleSave () {
        if (this.successCount == 0) {
          this.$message.error('没有成功的数据，不能导入！')
          return
        }
        this.mainLoading = true
        this.$http({
          url: '/api/employee/checkWorkImportSave',
          method: 'post',
          data: this.$qs.stringify({
            fileId: this.fileId
          })
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
        this.$downloadFile('/api/employee/downloadCheckWorkTemplate', 'get', {
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
          url: '/api/employee/checkWorkImport',
          method: 'post',
          data: this.$qs.stringify({
            fileId: fileId
          })
        }).then(({ data }) => {
          if (data.code === '10') {
            this.getTableData()
            this.getImportCountInfo()
            this.mainLoading = false
            this.$message.success('导入成功！')
            this.$refs.upload.clearFiles()
          } else {
            this.errorMsg = data.data[0].msg
            this.mainLoading = false
            this.dialogVisible = true
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
          url: '/api/employee/checkWorkImportList'
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
          url: '/api/employee/checkWorkImportCount',
          method: 'post',
          data: this.$qs.stringify({
            fileId: this.fileId
          })
        }).then(({ data }) => {
          this.successCount = data.data[0].successNum
          this.failedCount = data.data[0].failNum
        })
      },
      /* 导出 */
      handleExport (switchValue) {
        var params = {
          'status': switchValue,
          'fileId': this.fileId
        }
        this.$downloadFile('/api/employee/checkWorkImportPageExport', 'post', {
          params
        }, this.$global.EXCEL)
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
          url: '/api/employee/checkWorkImportDel',
          method: 'post',
          data: {
            ids: ids
          }
        }).then(({ data }) => {
          if (data.code === '10') {
            this.$message.success('删除成功')
            this.getTableData()
            this.getImportCountInfo()
          }
        })
      },

      returnPage () {
        this.$router.go(-1)
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
      height: 100px;
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
        border-bottom: 10px solid #ddd;
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
