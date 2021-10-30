<template>
  <div class="spl-container" v-loading="mainLoading" :element-loading-text="active=='0'?'文件上传中...':'数据保存中...'" element-loading-spinner="el-icon-loading" element-loading-background="rgba(244, 248, 248, 0.5)">
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="emp-container">
      <splSteps :active="active" :data="stepsData"></splSteps>
      <!--第一步-->
      <div v-if="active==0">
        <div class="clearfix mt-40">
          <el-input class="fl ml-235 w-200" :readonly="true" v-model="fileName"></el-input>
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
            <el-button style="margin-left: 10px;" size="small s-btn" type="primary" icon="icon ic-import" @click="submitUpload">
              <img src="../../assets/images/icons/ic-account-type24.png">
              导入
            </el-button>
          </el-upload>
          <router-link to="/employee/index">
              <el-button class="s-btn ml-10" icon="icon el-icon-close">取消</el-button>
          </router-link>
          <div class="search-row-btn mr-215">
            <el-button type="primary" class="s-btn" @click="exportTemplate">
              <img src="../../assets/images/icons/ic-account-type25.png">
              模板下载
            </el-button>
          </div>
        </div>
        <p class="mt-60 ml-235"><span class="tip"><i class="el-icon-warning ic-tip-yellow"></i><span>以下导入说明通用</span></span></p>
        <div class="mt-20 import-template">
          <img src="../../assets/images/toLead.png" width="100%" height="100%">
        </div>
      </div>
      <!--第二步-->
      <div v-show="active==1">

        <div class="error-msg mt-10">
          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                <p style="width: 100%;">
                  <span class="tip">
                  <i class="el-icon-warning ic-tip-yellow"></i>
                  <span>结果：通过校验
                    <span v-text="successCount"></span>
                    条 失败
                    <span v-text="failedCount"></span>
                    条</span>
                  </span>
                  <span class="open-detail text-blue">展开详情</span>
                </p>
              </template>
              <div v-text="'有'+failedCount+'条数据存在逻辑错误或系统数据重复错误'"></div>
              <div v-for="(item,index) in failedData" :key="index" v-text="'身份证号为：'+item.idCard+','+item.failCase+', 跳过此行'"></div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="notes">
          <p>注：所有数据均可导出和删除，每次导入均会校验系统已有数据，正确数据确认导入后可直接导入。若想一次性导入全部数据,</p>
          <p>可点击“取消”终止本次导入，待失败数据修改正确后再全部重新导入</p>
        </div>

        <div>
          <div class="clearfix mt-10 mb-15 pr-20">
            <span class="ml-20 mr-10">只看失败</span>
            <el-switch v-model="switchValue" :activeColor="$global.switchColor[0]" active-value="0" inactive-value="1" :inactiveColor="$global.switchColor[1]" @change="changeStatus"></el-switch>
            <div class="fr clearfix" style="margin-top: -5px;">
              <el-button size="small" type="primary" class="fl" icon="ic-export-white" @click="exportData(switchValue)">导出</el-button>
              <el-button size="small" class="s-btn ml-15 fl btn--border-blue" icon="el-icon-delete" @click="delData">删除</el-button>
            </div>
          </div>

          <dTable @fetch="getTableData" ref="importTable" :paging="true" :tableHeight="tableHeight" :showSelection="true" :showIndex="false">
            <el-table-column fixed="left" prop="failCase" label="失败原因" label-class-name="text-default" class-name="text-red" :show-overflow-tooltip="true" min-width="300">
              <template slot-scope="scope">
                <span>{{scope.row.failCase}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="empName" label="员工姓名" label-class-name="text-default" :show-overflow-tooltip="true" width="300">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.empName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" label="证件号码" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
               <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.idCard}}</span>
              </template>  
            </el-table-column>
            <el-table-column prop="residenceType" label="户口性质" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
               <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.residenceType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hjCity" label="户籍市" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.hjCity}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hjCounty" label="户籍区/县" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.hjCounty}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hjAddress" label="户籍详细地址" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.hjAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="empPhone" label="手机号码" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.empPhone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="education" label="学历" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.education}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nation" label="民族" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.nation}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="married" label="婚姻状况" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.married}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="contactAddr" label="通讯地址" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.contactAddr}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="friends" label="紧急联系人姓名" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.friends}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="friendsPhone" label="紧急联系人电话" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.friendsPhone}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="friendsAddr" label="紧急联系人地址" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.friendsAddr}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="jobPosition" label="岗位" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.jobPosition}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="entryDate" label="入职日期" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.entryDate}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="leaveDate" label="离职日期" label-class-name="text-default" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span :class="{textRed : (scope.row.failCase !==null && scope.row.failCase !=='')}">{{scope.row.leaveDate}}</span>
              </template>
            </el-table-column>
          </dTable>
        </div>
        <br>
        <div class="operate-btns-bottom pb-15">
          <el-button class="w-90" @click="active=0">取消</el-button>
          <el-button type="primary" class="ml-30" @click="saveData">确认导入</el-button>
        </div>
      </div>

      <!--第三步-->
      <div v-show="active==2">
        <div class="success-msg">
          <i class="el-icon-success"></i>
          <p class="msg-title">导入完成</p>
          <p class="msg-detail" v-text="'您已成功导入'+successCount+'条数据'"></p>
          <p class="msg-detail" v-show="failedCount>0">
            <span v-text="failedCount +'条数据导入忽略，存在逻辑错误或系统数据重复错误'"></span>
            <a class="text-blue a-aim" href="#" @click="exportData('0')">（点击下载）</a>
          </p>
          <router-link to="/employee/index">
            <el-button type="primary" class="mt-30">返回员工列表</el-button>
          </router-link>
        </div>
      </div>
      <!-- 导入失败弹窗 -->
      <el-dialog class="clearfix" title="导入失败" :visible.sync="dialogVisibleDefeated" width="600px" :close-on-click-modal="false">
        <img class="ml-30 mr-10 fl" src="../../assets/images/icons/ic-account-type28.png">
        <div class="fr err-msg">{{errorMsg}}</div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
import splSteps from '../../components/common/spl-steps'
export default {
  components: { dTable, splSteps },
  data () {
    return {
      mainLoading: false,
      // 导航
      pathData: [
        { name: '人员管理' },
        { name: '员工列表', path: '/employee/index' },
        { name: '批量导入' }
      ],
      stepsData: [
        { title: '下载模板/上传文件', description: '可下载自定义模板，完善后上传' },
        { title: '文件校验', description: '上传文件后，可在线编辑调整' },
        { title: '导入完成' }
      ],
      switchValue: '1',
      fileName: '', // 文件名
      fileList: [], // 文件列表
      active: 0,
      fileId: '',
      failedCount: 0, // 失败条数
      successCount: 0, // 成功条数
      failedData: [], // 失败数据
      dialogVisibleDefeated: false /* 导入失败弹窗 */,
      errorMsg: ''// 导入失败提示信息
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 550 + 'px'
    }
  },
  watch: {},
  methods: {
    /* 导入 */
    submitUpload () {
      if (this.fileName != '') {
        this.mainLoading = true
        this.fileName = ''
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    },
    /* 上传失败后 */
    uploadError (err, file, fileList) {
      if (err) {
        this.dialogVisibleDefeated = true
      }
    },
    /* 上传成功后 */
    uploadSuccess (response, file, fileList) {
      file.name = ''
      var fileId = String(response.data[0].fileId)// 文件id
      this.fileId = fileId
      this.$http({
        url: '/api/employee/import/employee',
        method: 'post',
        data: this.$qs.stringify({
          fileId: fileId
        })
      }).then(({ data }) => {
        if (data.data[0] !== null) {
          this.errorMsg = data.data[0]
          this.mainLoading = false
          this.dialogVisibleDefeated = true
        } else {
          // 跳转到下一步查询列表数据
          this.getTableData()
          // 获取导入统计信息
          this.getImportCountInfo()
          this.mainLoading = false
          this.$refs.upload.clearFiles()
          this.active = 1
        }
      })
    },
    /* 获取列表分页数据 */
    getTableData (params = []) {
      params = [
        { property: 'fileId', value: this.fileId },
        { property: 'status', value: this.switchValue }
      ]
      this.$refs.importTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/import/findImportEmployeeList'
      })
    },
    /* 只看失败 */
    changeStatus (value) {
      this.switchValue = value
      this.getTableData()
    },
    /* 有几条错误数据 */
    getImportCountInfo () {
      this.$http({
        url: '/api/employee/import/getFailEmployeeInfoByFileId',
        method: 'post',
        data: this.$qs.stringify({
          fileId: this.fileId
        })
      }).then(({ data }) => {
        if (data.code == 10) {
          this.failedData = data.data[0].erroList
          this.failedCount = data.data[0].failNum
          this.successCount = data.data[0].successNum
        } else {
          this.$message.error('系统异常')
        }
      }).catch((data) => {
        this.$message.error('系统异常')
      })
    },
    /* 确认导入 */
    saveData () {
      if (this.successCount == 0) {
        this.$message.error('没有成功的数据，不能导入！')
        return
      }
      this.mainLoading = true
      this.$http({
        url: '/api/employee/import/saveImportEmployee',
        method: 'post',
        data: this.$qs.stringify({
          fileId: this.fileId
        })
      }).then(({ data }) => {
        if (data.code == 10) {
          this.active = 2
        } else {
          this.$message.error(data.data.content ? data.data.content : '系统异常')
        }
        this.mainLoading = false
      })
    },
    /* 动态文件名称改变 */
    fileChange (file, fileList) {
      this.fileName = file.name
    },
    /* 模板下载 */
    exportTemplate () {
      this.$downloadFile('/api/employee/import/exportEmployeeTemplate', 'post', {
      }, this.$global.EXCEL)
    },
    /* 导出和点击下载 */
    exportData (switchValue) {
      this.$downloadFile('/api/employee/import/exportEmployeeInfoByFileId?fileId=' + this.fileId + '&status=' + switchValue, 'post', {}, this.$global.EXCEL)
    },
    /* 删除 */
    delData () {
      var selections = this.$refs.importTable.selections
      if (selections.length == 0) {
        this.$message.warning('请选择需要删除的数据')
        return
      }
      var ids = []
      selections.forEach(item => {
        ids.push(item.id)
      })
      this.$http({
        url: '/api/employee/import/deleteEmployeeInfoByIds',
        method: 'post',
        data: this.$qs.stringify({
          ids: ids.join(',')
        })
      }).then(({ data }) => {
        this.getTableData()
        this.getImportCountInfo()
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .textRed{
    color: #F56C6C !important;
  }
  .emp-container {
    padding-top:60px;
  }
  .import-container {
    position: relative;
    height: 100%;
  }
  .import-template {
    text-align: center;
    img {
      display: inline-block;
      width: 1180px;
      height: 275px;
    }
  }
  .error-msg {
    background-color: #EFF2F7;
    padding: 10px 30px;
  }
  .notes {
    padding: 10px 30px;
  }
  .err-msg{
    width: 490px;
    line-height: 20px;
  }
  /deep/.el-dialog__body{
    height: 81px;
  }
</style>
