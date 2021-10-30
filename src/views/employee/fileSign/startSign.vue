<template>
  <div class="spl-container content">
    <breadcrumb :data="pathData"></breadcrumb>
    <!-- 步骤条 -->
    <div class="pt-30 spl-step">
      <splSteps :active="active" :data="stepsData"></splSteps>
    </div>
    <!-- 主体内容-第一步 -->
    <div v-show="active==0" class="contentDetail mt-20 mr-20 ml-20">
      <div class="detail mt-5" v-show="!importData.importDialogVisible">
        <div class="detail-bottom">
          <div class="detail-bottom-left">
            <div class="total pl-10">
              <p>已添加 <span class="text-orange">{{addEmployeeRecords}}</span> 条签署方</p>
            </div>
            <dTable @fetch="getFirstTableData" ref="baseTable" :tableHeight="tableHeightLeft" :showSelection="true"
                    :showIndex="true">
              <el-table-column prop="name" label="姓名" min-width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="idCard" label="证件号码" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="telephone" label="手机号码" min-width="130"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="optrCompName" label="签署主体" min-width="150"
                               :show-overflow-tooltip="true"></el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" icon="ic-export-white" type="primary" @click="exportFirstTableData">导出
                </el-button>
                <el-button size="small" icon="el-icon-delete" class="btn--border-blue" style="margin-left: 20px;"
                           @click="delFirstTableData">删除
                </el-button>
              </template>
            </dTable>
          </div>
          <div class="detail-bottom-right">
            <div class="search-row clearfix">
              <el-input placeholder="搜索文件关键字" clearable class="w-220" v-model.trim="searchFileType"></el-input>
              <el-button type="primary" class="search-btn" icon="el-icon-search" @click="getFileTypeData"></el-button>
              <div class="fr">
                <el-button icon="ic-import-white" type="primary " size="small"
                           @click="importData.importDialogVisible=true">批量导入名单
                </el-button>
                <el-button icon="el-icon-plus" size="small" class="btn--border-blue"
                           @click="addSingle.addSingleDialog=true">单个添加名单
                </el-button>
              </div>
            </div>
            <dTable :data="fileTypeData" ref="fileTypeTable" :paging="false" :tableHeight="tableHeightRight"
                    v-loading="fileTypeLoading"
                    element-loading-text="拼命加载中" class="sign-step1-table"
                    element-loading-spinner="el-icon-loading" @selection-change="selectionFileType">
              <el-table-column prop="templateTypeName" label="文件类型" min-width="120"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="templateName" label="文件名称" min-width="150"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column prop="name" min-width="80">
                <template slot="header">
                  <p>已选{{fileTypeCount}}份文件</p>
                </template>
                <template slot-scope="scope">
                  <el-button type="text" size="small" class="text-blue" @click.stop="viewHandle(scope.row.filePath)">
                    查看
                  </el-button>
                </template>
              </el-table-column>
            </dTable>
          </div>
        </div>
        <div class="pt-20 pb-15 text-center">
          <el-button @click="signEmployeeSave" type="primary" size="small" style="margin-left: 30px;">下一步（确认名单）
          </el-button>
        </div>
      </div>

      <div v-show="importData.importDialogVisible">
        <div class="title clearfix mb-15">
          <div class="titleLeft fl lh-32">
            <p style="padding-left: 30px;">成功 <span class="text-green">{{importData.successCount}}</span> 条，失败 <span
              class="text-orange">{{importData.failedCount}}</span> 条 <span style="margin:0 5px 0 20px;">只看失败</span>
              <el-switch v-model="importData.switchValue" active-value="0" inactive-value="1"
                         :active-color="$global.switchColor[0]" :inactive-color="$global.switchColor[1]"
                         @change="getImportTableData"></el-switch>
            </p>
          </div>
          <div class="titleRight fr">
            <el-input style="width: 280px;" placeholder="" :disabled="true" v-model="importData.fileName"></el-input>
            <el-upload
              class="el-upload"
              ref="upload"
              :action="this.$global.uploadUrl"
              :headers="this.$global.setUploadHeaders"
              :file-list="fileList"
              :on-change="fileChange"
              :on-success="uploadSuccess"
              :show-file-list="false"
              :auto-upload="false"
              :multiple="false">
              <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
            </el-upload>
            <el-button style="margin-left: 10px;" size="small s-btn" type="primary" icon="icon ic-import"
                       @click="submitUpload">
              导入
            </el-button>
            <el-button type="primary" class="s-btn" icon="el-icon-download" @click="exportTemplate">模板下载</el-button>

          </div>
        </div>
        <div v-show="importData.switchValue==1">
        <dTable @fetch="getImportTableData" ref="importTable" :tableHeight="tableHeight" :showSelection="true">
          <el-table-column prop="name" label="姓名" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="idCard" label="证件号码" min-width="180" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="telephone" label="手机号码" min-width="130"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="optrCompName" label="签署主体" min-width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <template slot="pagination-btns">
            <el-button size="small" icon="ic-export-white" type="primary" @click="exportImportData()">导出</el-button>
            <el-button size="small" icon="el-icon-delete" class="btn--border-blue" style="margin-left: 20px;"
                       @click="delImportData">删除
            </el-button>
          </template>
        </dTable>
        </div>
        <div v-show="importData.switchValue==0">
          <dTable @fetch="getImportTableData" ref="importTableFail" :tableHeight="tableHeight" :showSelection="true">
          <el-table-column prop="name" label="姓名" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="idCard" label="证件号码" min-width="180" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="telephone" label="手机号码" min-width="130"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="optrCompName" label="签署主体" min-width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="errMsg" label="导入失败原因" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <template slot="pagination-btns">
            <el-button size="small" icon="ic-export-white" type="primary" @click="exportImportData()">导出</el-button>
            <el-button size="small" icon="el-icon-delete" class="btn--border-blue" style="margin-left: 20px;"
                       @click="delImportData">删除
            </el-button>
          </template>
        </dTable>
        </div>
        <div slot="footer" class="pt-20 pb-20 text-center">
          <el-button size="small" @click="importData.importDialogVisible=false">取 消</el-button>
          <el-button size="small" type="primary" :loading="addBtnLoading" style="margin-left: 60px;"
                     @click="importHandle">确定添加
          </el-button>
        </div>
      </div>
    </div>
    <!-- 主体内容-第二步 -->
    <div v-show="active==1" class="contentDetail2 mt-20">
      <div v-show="!importData2.importDialogVisible">
        <div class="table">
          <div class="display-flex">
            <span class="ml-20 mr-20" style="line-height: 38px;">需签署的文件：</span>
            <el-tabs v-model="secondTabActive" @tab-click="getDynamicHeader" class="flex1 text-left file-tabs"
                     style="display: inline-block" :key="refreshTabs">
              <el-tab-pane class="navTitle" v-for="(item, index) in selectFileType" :key="item.uuid"
                           :label="item.templateName" :name="''+index"></el-tab-pane>
            </el-tabs>
            <div class="pr-30 mt-5">
              <el-button style="margin-left: 10px;" size="small" type="primary" icon="icon ic-import-white"
                         @click="importImproveVisible">导入完善信息表
              </el-button>
            </div>
          </div>
          <div>
            <dTable @fetch="getSecondImportTable" ref="secondTable" :tableHeight="tableHeight" :key="refreshTable">
              <el-table-column :prop="item" v-for="item in dynamicHeader?dynamicHeader:[]" v-if="item!='失败原因'" min-width="200" :label="item"
                               :key="item" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div v-if="scope.row[item]&&scope.row[item]!=null&&scope.row[item]!=''">{{scope.row[item]}}</div>
                  <div v-else style="height: 23px;width: 100%;border: 1px solid red"></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="操作" min-width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" class="text-blue" @click.stop="previewHandle(scope.row)">预览
                  </el-button>
                </template>
              </el-table-column>
            </dTable>
          </div>
        </div>
        <div class="text-center pt-20 pb-10">
          <el-button size="small" @click="active=0">重新选择文件</el-button>
          <el-button @click="handleDetermine" :loading="determineBtnLoading" size="small" type="primary"
                     style="margin-left: 30px;">确定发起签署
          </el-button>
        </div>
      </div>

      <div v-show="importData2.importDialogVisible">
        <div class="display-flex">
          <span class="ml-20 mr-20" style="line-height: 38px;">需签署的文件：</span>
          <el-tabs v-model="importData2.secondTabActive" @tab-click="getDynamicHeader('import')" class="flex1 text-left file-tabs pr-20"
                   style="display: inline-block" :key="importData2.refreshTabs">
            <el-tab-pane class="navTitle" v-for="(item, index) in selectFileType" :key="item.uuid"
                         :label="item.templateName" :name="''+index"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="title clearfix mb-15" style="background:rgba(242,242,242,1);padding: 10px 50px 10px 0px">
          <div class="titleLeft fl lh-32">
            <p style="padding-left: 30px;"><i class="el-icon-warning text-orange font-18 mr-10"
                                              style="vertical-align: middle;margin-top: -5px;"></i>成功 <span
              class="text-green">{{importData2.successCount}}</span> 条，失败 <span class="text-orange">{{importData2.failedCount}}</span>
              条 <span style="margin:0 5px 0 20px;">只看失败</span>
              <el-switch v-model="importData2.switchValue" :active-value="0" :inactive-value="1"
                         :active-color="$global.switchColor[0]" :inactive-color="$global.switchColor[1]"
                         @change="getImportTableData2"></el-switch>
            </p>
          </div>
          <div class="titleRight fr">
            <el-button size="small" icon="el-icon-download" class="btn--border-blue" style="margin-right: 20px;"
                       @click="secondExportTemplate">下载完善信息表
            </el-button>
            <el-input style="width: 280px;" v-model="importData2.fileName" :disabled="true"></el-input>
            <el-upload
              class="el-upload"
              ref="secondUpload"
              :action="this.$global.uploadReturnSheetInfo"
              :headers="this.$global.setUploadHeaders"
              :file-list="fileList"
              :on-change="secondFileChange"
              :on-success="secondUploadSuccess"
              :show-file-list="false"
              :auto-upload="false"
              :multiple="false">
              <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
            </el-upload>
            <el-button style="margin-left: 10px;" size="small s-btn" type="primary" icon="icon ic-import-white"
                       :loading="importData2.btnLoading" @click="secondCheckUpload">导入
            </el-button>
          </div>
        </div>
        <div v-show="importData2.switchValue==1">
        <dTable @fetch="getImportTableData2" ref="importTable2" :tableHeight="tableHeight" :showSelection="true"
                :key="importData2.refreshTable">
          <el-table-column :prop="item" v-for="item in importData2.dynamicHeader?importData2.dynamicHeader:[]"
                           min-width="200" :label="item" :key="item" :show-overflow-tooltip="true" v-if="item!='失败原因'">
            <template slot-scope="scope">
              <div v-if="item=='失败原因' || (scope.row[item]&&scope.row[item]!=null&&scope.row[item]!='')">{{scope.row[item]}}</div>
              <div v-else style="height: 23px;width: 100%;border: 1px solid red"></div>
            </template>
          </el-table-column>
        </dTable>
        </div>
        <div v-show="importData2.switchValue==0">
        <dTable @fetch="getImportTableData2" ref="importFailTable2" :tableHeight="tableHeight" :showSelection="true"
                :key="importData2.refreshTable">
          <el-table-column :prop="item" v-for="item in importData2.dynamicHeader?importData2.dynamicHeader:[]"
                           min-width="200" :label="item" :key="item+'fail'" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="item=='失败原因' || (scope.row[item]&&scope.row[item]!=null&&scope.row[item]!='')">{{scope.row[item]}}</div>
              <div v-else style="height: 23px;width: 100%;border: 1px solid red"></div>
            </template>
          </el-table-column>
        </dTable>
        </div>
        <div slot="footer" class="pt-20 pb-20 text-center">
          <el-button size="small" @click="getSecondImportTable">关 闭</el-button>
          <el-button size="small" type="primary" :loading="importData2.addBtnLoading" style="margin-left: 60px;"
                     @click="importImproveHandle">保存信息
          </el-button>
        </div>
      </div>
    </div>
    <!-- 主体内容-第三步 -->
    <div v-show="active==2" class="contentDetail3 mt-100 text-center">
      <i class="el-icon-success text-green font-30" style="vertical-align: middle;margin-top: -8px;"></i><span
      class="font-24 ml-10 lh-30">完成</span>
      <p class="mt-20 countdown">成功发起{{addEmployeeRecords}}人{{addEmployeeRecords*selectFileType.length}}份文件。{{countDown}}秒后自动跳转签署管理页面</p>
      <div class="mt-60">
        <el-button size="small" class="w-130" style="margin-right: 30px;" @click="goSignAdmin">签署管理</el-button>
        <el-button @click="continueToNew" type="primary" size="small" class="w-130">继续发起</el-button>
      </div>
    </div>
    <!-- 单个添加弹出框 -->
    <el-dialog title="添加签署方名单" :close-on-click-modal="false" class="singleAdd spl-dialog"
               :visible.sync="addSingle.addSingleDialog" width="600px" center :before-close="clearAddSingleDialog">
      <el-form class="el-form" label-width="121px" :model="addSingle" ref="addSingle" :hide-required-asterisk="true">
        <div class="add-ruleForm formList">
          <el-form-item label="员工姓名：" prop="name" :rules="[{ required: true, message: '请输入员工姓名'}]">
            <template slot="label">
              <span class="required-pre">员工姓名:</span>
            </template>
            <el-input placeholder="请输入" class="w-400" v-model.trim="addSingle.name"></el-input>
          </el-form-item>
          <el-form-item label="证件号码：" prop="idCard" :rules="[{ required: true, message: '请输入证件号码'}]">
            <template slot="label">
              <span class="required-pre">证件号码:</span>
            </template>
            <el-input placeholder="请输入" class="w-400" v-model.trim="addSingle.idCard"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="telephone" :rules="[{ required: true, message: '请输入手机号码'}]">
            <template slot="label">
              <span class="required-pre">手机号码:</span>
            </template>
            <el-input placeholder="请输入" class="w-400" v-model.trim="addSingle.telephone"></el-input>
          </el-form-item>
          <el-form-item label="签署主体：" prop="optrCompId" :rules="[{ required: true, message: '请输入签署主体'}]">
            <template slot="label">
              <span class="required-pre">签署主体:</span>
            </template>
            <el-select v-model="addSingle.optrCompId" ref="optrCompId" class="w-400" placeholder="请选择">
              <el-option v-for="it in entrySubjectList" :key="it.id" :label="it.name"
                         :value="it.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 25px;">
        <el-button size="small" @click="clearAddSingleDialog">取 消</el-button>
        <el-button size="small" type="primary" :loading="addSingle.btnLoading" style="margin-left: 60px;"
                   @click="checkAddSingle">确定添加
        </el-button>
      </div>
    </el-dialog>
    <!-- 导入完善弹出框-sheet -->
    <el-dialog title="已根据所选文件读取出对应的sheet页" :close-on-click-modal="false" class="spl-dialog"
               :visible.sync="sheetData.dialogVisible" width="600px" center>
      <div>
        <!--<el-checkbox class="el-checkbox-all" :indeterminate="sheetData.isIndeterminate" v-model="sheetData.checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
        <!--<div style="margin: 15px 0 20px 15px;">-->
        <div style="margin: 0px 0 20px 15px;">
          <!--<el-checkbox-group v-model="sheetData.selectSheets" @change="handleSheetChange">
            <el-checkbox style="display: block;margin: 10px;" v-for="item in sheetData.sheetList" :key="item.name" :label="item.value">{{item.value}}
              &lt;!&ndash;<span class="text-red ml-30" v-if="!item.isExist">未找到与此sheet对应的合同文件名，请检查sheet命名</span>&ndash;&gt;
            </el-checkbox>
          </el-checkbox-group>-->
          <el-radio-group v-model="sheetData.selectSheets">
            <p v-for="(item,index) in sheetData.sheetList" :key="item.name" class="mb-15">
              <el-radio :label="index">{{item.value}}</el-radio>
            </p>
          </el-radio-group>
        </div>
        <div class="text-center pt-15 pb-40">
          <el-button class="mr-60 w-90" size="small" @click="sheetData.dialogVisible=false">取消</el-button>
          <el-button class="w-90" type="primary" size="small" :disabled="sheetData.selectSheets.length==0"
                     @click="secondSubmitUpload">确认
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!--查看文件弹窗-->
    <el-dialog class="spl-dialog viewDocDialog" :visible.sync="viewData.viewDocVisible" center width="1000px">
      <iframe :src="viewData.pdfImgs" width="100%" :style="{height: viewDoceHeight}" frameborder="0"
              v-loading="viewData.viewLoading" :element-loading-text="$global.elementLoadingText"
              :element-loading-spinner="$global.elementLoadingSpinner"></iframe>
      <!--<div class="viewDoc" :style="{maxHeight: viewDoceHeight, width: viewData.pdfImgs.length>0?viewData.pdfImgs[0].imageWidth+'px':852 +'px'}" style="max-width: 1100px; min-height: 500px" v-loading="viewData.viewLoading" :element-loading-text="$global.elementLoadingText" :element-loading-spinner="$global.elementLoadingSpinner">-->
      <!--<div v-for="(item,index) in viewData.pdfImgs" :key="item.url">-->
      <!--<img v-if="index != viewData.pdfImgs.length-1" :src="item.url" alt="" :style="{width: item.imageWidth+'px',height: item.imageHeight + 'px'}">-->
      <!--</div>-->
      <!--</div>-->
    </el-dialog>
    <!--查看文件弹窗-->

    <el-dialog title="提示" class="spl-dialog" :visible.sync="msgDialogVisible" width="600px" :show-close="false">
      <p class="clearfix" style="padding-left: 36px;">
        <i class="el-icon-warning text-orange mr-20 font-30 fl"></i>
        <span class="lh-30">存在未完善的内容，如列表中标红的单元格所示，请先完善</span>
      </p>
      <div slot="footer" class="dialog-footer mb-30" style="margin-top: 73px;">
        <el-button type="primary" class="s-btn" style="width: 147px;" @click="msgDialogVisible = false">知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dTable from '../../../components/common/table'
import splSteps from '../../../components/common/spl-steps'

export default {
  inject: ['reload'],
  components: { dTable, splSteps },
  data () {
    return {
      // 导航
      pathData: [{ name: '文件签署' }, { name: '签署管理', path: '/fileSign/signAdmin' }, { name: '发起签署' }],
      stepsData: [
        { title: '添加人员名单', description: '添加签约名单与需签署的文件' },
        { title: '确认名单', description: '下载需完善内容的表格，进行导入' },
        { title: '完成' }
      ],
      msgDialogVisible: false,
      addSingle: {
        addSingleDialog: false,
        btnLoading: false,
        name: '',
        idCard: '',
        telephone: '',
        optrCompId: ''
      },
      active: 0,
      fileList: [],
      tempName: '',
      addBtnLoading: false,
      addEmployeeRecords: 0,
      importData: {
        importDialogVisible: false,
        fileId: '',
        fileName: '',
        isUpload: false, // 用于区分是否上传过
        switchValue: '1',
        successCount: 0,
        failedCount: 0
      },
      fileTypeCount: 0,
      fileTypeData: [],
      selectFileType: [],
      refreshTabs: new Date().getTime(),
      /* selectFileType: [{ 'contractName': 'test文件名称2', 'contractTemplateId': '8290c935ad684d32aa27e458c8f0c95d', 'contractType': 'test3.10(2)' }, { 'contractName': 'test文件名称', 'contractTemplateId': 'd20b8e42ba934e139c9d73452fd8880e', 'contractType': 'test3.10' }], */
      fileTypeLoading: false,
      searchFileType: '',
      entrySubjectList: '',
      importData2: {
        importDialogVisible: false,
        switchValue: '1', // 0失败 1成功
        successCount: 0,
        failedCount: 0,
        secondTabActive: '0',
        refreshTabs: new Date().getTime() + 1,
        refreshTable: new Date().getTime() + 2,
        dynamicHeader: [],
        addBtnLoading: false,
        fileId: '',
        fileName: '',
        btnLoading: false,
        isUpload: false
      },
      viewData: {
        viewDocVisible: false,
        pdfImgs: [],
        viewLoading: false
      },
      dynamicHeader: [],
      refreshTable: new Date().getTime() + 3,
      secondTabActive: '0',
      sheetData: {
        dialogVisible: false,
        isIndeterminate: false,
        sheetList: [],
        // sheetList: [{ name: 'rd1', value: 'test1' }, { name: 'rd2', value: 'test2' }],
        checkAll: true,
        selectSheets: [],
        selectSheetsAll: []
      },
      determineBtnLoading: false, // 确定发起签署按钮
      timer: '',
      countDown: 2,
      signType: '1', // 1入职2离职
      batchNum: '0',
      delDialogType: 0,
      delDialogVisible: false
    }
  },
  computed: {
    tableHeightLeft: function () {
      return this.$global.bodyHeight - 400 + 'px'
    },
    tableHeightRight: function () {
      return this.$global.bodyHeight - 347 + 'px'
    },
    tableHeight: function () {
      return this.$global.bodyHeight - 420 + 'px'
    },
    viewDoceHeight: function () {
      let height = this.$global.bodyHeight - 300
      if (height > 1000) {
        height = 1000
      } else if (height < 700) {
        height = 700
      }
      return height + 'px'
    }
  },
  created () {
    this.batchNum = this.$route.query.batchNum ? this.$route.query.batchNum : ''
    this.signType = this.$route.query.type ? this.$route.query.type : ''
    this.getFileTypeData()
    this.getEntrySubjectList()
    this.$nextTick(() => {
      this.getFirstTableData()
    })
  },
  methods: {
    /* S=第一步 */
    //  获取文件类型
    getFileTypeData () {
      this.fileTypeLoading = true
      this.$http({
        url: '/api/entryresign/file/templateList',
        method: 'post',
        data: this.$qs.stringify({
          searchKey: this.searchFileType,
          type: this.signType
        })
      }).then(({ data }) => {
        this.fileTypeData = data.data
        this.fileTypeLoading = false
      }).catch(data => {
        this.fileTypeLoading = false
      })
    },
    //  获取入职主体（添加单个-签署主体）
    getEntrySubjectList () {
      this.fileTypeLoading = true
      this.$http({
        url: '/api/entryresign/entrySubjectList',
        method: 'get'
      }).then(({ data }) => {
        this.entrySubjectList = data.data[0]
        if (this.entrySubjectList.length == 1) {
          this.addSingle.optrCompId = this.entrySubjectList[0].id
        }
      }).catch(data => {
      })
    },
    /* 导入 */
    submitUpload () {
      if (this.importData.fileName !== '') {
        this.importData.fileName = ''
        this.importData.isUpload = true
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    },
    /* 导入弹窗——删除 */
    delImportData () {
      let that = this
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
        url: '/api/entryresign/emp/deleteImportData',
        method: 'post',
        data: this.$qs.stringify({
          fileId: this.importData.fileId,
          ids: ids.join(','),
          isSuccess: this.importData.switchValue // 0失败，1成功
        })
      }).then(({ data }) => {
        this.$message.success('删除成功')
        that.getImportCountInfo('1')
        that.$nextTick(() => {
          that.getImportTableData()
        })
      })
    },
    getImportCountInfo (type, source) {
      // type: 1-待入职，2-完善信息
      let fileId = ''
      if (type == 1) {
        fileId = this.importData.fileId
      } else {
        if (source == 'changeTab') {
          let index = Number(this.importData2.secondTabActive)
          if (index > this.selectFileType.length - 1) {
            index = 0
            this.importData2.secondTabActive = '0'
          }
          fileId = this.selectFileType[index].fileId
          if (!(fileId && fileId != '')) {
            this.importData2.failedCount = 0
            this.importData2.successCount = 0
            return false
          }
        } else {
          fileId = this.importData2.fileId
        }
      }
      this.$http({
        url: '/api/entryresign/emp/getImportCount',
        method: 'post',
        data: this.$qs.stringify({
          fileId: fileId,
          type: type
        })
      }).then(({ data }) => {
        if (type == 1) {
          this.importData.failedCount = data.data[0].fail
          this.importData.successCount = data.data[0].success
        } else {
          this.importData2.failedCount = data.data[0].fail
          this.importData2.successCount = data.data[0].success
        }
      }).catch((data) => {
      })
    },
    //  导入弹窗——导出模板
    exportTemplate () {
      //  导出模板 下载类型(1:添加待入职，2：发起签署)
      this.$downloadFile('/api/entryresign/emp/downloadTemplateFile', 'post', this.$qs.stringify({ type: this.signType }), this.$global.EXCEL)
    },
    /* 导入弹窗——导出 */
    exportImportData () {
      let ids = this.$refs.importTable.getSelectionsArr('id')
      this.$downloadFile('/api/entryresign/emp/exportImportData', 'post', {
        batchNum: this.batchNum,
        ids: ids,
        fileId: this.importData.fileId,
        isSuccess: this.importData.switchValue // 0失败，1成功
      }, this.$global.EXCEL)
    },
    /* 第一步-签署页面-获取列表数据 */
    getFirstTableData (params = []) {
      params = [{ property: 'type', value: this.signType }, { property: 'batchNum', value: this.batchNum }]
      let that = this
      this.$refs.baseTable.fetch({
        query: params,
        method: 'post',
        url: '/api/entryresign/file/signList',
        callback: function (data) {
          that.addEmployeeRecords = data.records
        }
      })
    },
    /* 第一步-签署页面-导出列表数据 */
    exportFirstTableData (params = []) {
      let ids = this.$refs.baseTable.getSelectionsArr('id')
      if (ids.length > 0) {
        ids = ids.join(',')
        ids = ids.split(',')
      }
      this.$downloadFile('/api/entryresign/file/exportImprove', 'post', {
        batchNum: this.batchNum,
        ids: ids
      }, this.$global.EXCEL)
    },
    /* 第一步-签署页面-导出列表数据 */
    delFirstTableData (params = []) {
      var selections = this.$refs.baseTable.selections
      if (selections.length === 0) {
        this.$message.warning('请先选择需要删除的数据')
        return
      }
      var idList = []
      var uuidList = []
      selections.forEach(item => {
        idList.push(item.id)
        uuidList.push(item.uuid)
      })
      this.$http({
        url: '/api/entryresign/file/deleteImprove',
        method: 'post',
        data: {
          batchNum: this.batchNum,
          idList: idList,
          uuidList: uuidList
        }
      }).then(({ data }) => {
        this.$message.success('删除成功')
        this.getFirstTableData()
      }).catch((data) => {
        this.$message.error(data.data[0].msg ? data.data[0].msg : '删除失败')
      })
    },
    /* 第一步—导入弹窗—获取导入列表数据 */
    getImportTableData (params = []) {
      if (this.importData.fileId === '') {
        return false
      }
      // 0失败1成功
      params = [{ property: 'fileId', value: this.importData.fileId }, {
        property: 'batchNum',
        value: this.batchNum
      }, { property: 'isSuccess', value: this.importData.switchValue }]

      let table
      if (this.importData.switchValue == 1) {
        table = this.$refs.importTable
      } else {
        table = this.$refs.importTableFail
      }
      table.fetch(
        {
          query: params,
          method: 'post',
          url: '/api/entryresign/emp/queryForPage'
        })
    },
    /* 批量导入弹窗-确定添加 */
    importHandle () {
      if (this.importData.successCount < 1) {
        this.$message.warning('没有成功数据可添加')
        return false
      }
      this.addBtnLoading = true
      this.$http({
        url: '/api/entryresign/emp/saveImportData',
        method: 'post',
        data: {
          fileId: this.importData.fileId,
          batchNum: this.batchNum,
          addType: '1',
          ids: '',
          type: this.signType
        }
      }).then(({ data }) => {
        this.addBtnLoading = false
        this.getFirstTableData()
        this.importData.importDialogVisible = false
      }).catch((data) => {
        this.addBtnLoading = false
      })
    },
    selectionFileType () {
      this.fileTypeCount = this.$refs.fileTypeTable.selections.length
    },
    //  查看文件
    viewHandle (filePath) {
      this.viewData.viewDocVisible = true
      this.viewData.pdfImgs = filePath
    },
    /* 单个添加-确定 */
    checkAddSingle () {
      this.$refs.addSingle.validate((valid) => {
        if (valid) {
          this.addSingle.btnLoading = true
          this.$http({
            url: '/api/entryresign/emp/singleEntry',
            method: 'post',
            data: {
              addType: '1',
              batchNum: this.batchNum,
              name: this.addSingle.name,
              idCard: this.addSingle.idCard,
              telephone: this.addSingle.telephone,
              optrCompId: this.addSingle.optrCompId,
              optrCompName: this.$refs.optrCompId.selectedLabel
            }
          }).then(({ data }) => {
            this.addSingle.btnLoading = false
            this.getFirstTableData()
            this.clearAddSingleDialog()
          }).catch(data => {
            this.addSingle.btnLoading = false
          })
        }
      })
    },
    /* 单个添加-取消 */
    clearAddSingleDialog (done) {
      this.addSingle = {
        addSingleDialog: false,
        btnLoading: false,
        name: '',
        idCard: '',
        telephone: '',
        optrCompId: ''
      }
      this.$refs.addSingle.resetFields()
      if (typeof done === 'function') {
        done()
      } else {
        this.addSingle.addSingleDialog = false
      }
    },
    /* 动态文件名称改变 */
    fileChange (file, fileList) {
      if (!this.importData.isUpload) {
        this.importData.fileName = file.name
      } else {
        this.importData.isUpload = false
      }
    },
    /* 上传成功后 */
    uploadSuccess (response, file, fileList) {
      this.importData.fileId = response.data[0].fileId
      this.importData.isUpload = true
      this.$http({
        url: '/api/entryresign/emp/empImport',
        method: 'post',
        data: this.$qs.stringify({
          batchNum: this.batchNum,
          addType: '1', // 下载类型(空:添加待入职，1：发起签署)
          fileId: this.importData.fileId,
          type: this.signType // (1:入职，2：离职)
        })
      }).then(({ data }) => {
        this.getImportCountInfo('1')
        this.getImportTableData()
      }).catch(data => {
      })
    },
    signEmployeeSave () {
      if (this.addEmployeeRecords === 0) {
        this.$message.warning('请先添加签署方')
        return
      }
      var selections = this.$refs.fileTypeTable.selections
      if (selections.length === 0) {
        this.$message.warning('请先选择文件')
        return
      }
      var typeVOList = []
      var obj = {}
      selections.forEach(item => {
        obj = {
          templateName: item.templateName,
          uuid: item.uuid,
          id: item.id
        }
        typeVOList.push(obj)
      })
      this.selectFileType = typeVOList
      this.getDynamicHeader()
      this.getDynamicHeader('import')
    },
    /* E=第一步 */

    /* S=第二步 */
    getDynamicHeader (type) {
      let index
      if (type == 'import') {
        index = Number(this.importData2.secondTabActive)
        if (index > this.selectFileType.length - 1) {
          index = 0
          this.importData2.secondTabActive = '0'
        }
      } else {
        index = Number(this.secondTabActive)
        if (index > this.selectFileType.length - 1) {
          index = 0
          this.secondTabActive = '0'
        }
      }

      this.$http({
        url: '/api/entryresign/file/improveHeader',
        method: 'post',
        data: this.$qs.stringify({
          templateUuid: this.selectFileType[index].uuid
        })
      }).then(({ data }) => {
        if (type == 'import') {
          this.importData2.dynamicHeader = data.data[0]
          this.importData2.refreshTable = new Date().getTime()
          this.getImportCountInfo('2', 'changeTab')
          this.$nextTick(() => {
            this.getImportTableData2()
          })
        } else {
          this.dynamicHeader = data.data[0]
          this.refreshTable = new Date().getTime()
          this.$nextTick(() => {
            this.getSecondImportTable()
          })
        }
      })
    },
    // 第二步--完善信息弹窗-表格（模板）
    getImportTableData2 () {
      let index = Number(this.importData2.secondTabActive)
      if (index > this.selectFileType.length - 1) {
        index = 0
        this.importData2.secondTabActive = '0'
      }
      let fileId = this.selectFileType[index].fileId
      if (!(fileId && fileId != '')) {
        return false
      }
      let params = [{ property: 'fileId', value: fileId }, { property: 'isSuccess', value: this.importData2.switchValue }]

      if (this.importData2.switchValue == 1) {
        this.$refs.importTable2.fetch(
          {
            query: params,
            method: 'post',
            url: '/api/entryresign/file/importImproveList'
          })
      } else {
        this.$refs.importFailTable2.fetch(
          {
            query: params,
            method: 'post',
            url: '/api/entryresign/file/importImproveList'
          })
      }
    },
    /*  第二步--完善信息弹窗--确定保存 */
    importImproveHandle () {
      if (this.importData2.successCount < 1) {
        this.$message.warning('没有成功数据可保存')
        return false
      }
      this.importData2.addBtnLoading = true
      let index = Number(this.importData2.secondTabActive)
      if (index > this.selectFileType.length - 1) {
        index = 0
        this.importData2.secondTabActiv = '0'
      }
      this.$http({
        url: '/api/entryresign/file/importImproveSave',
        method: 'post',
        data: this.$qs.stringify({
          fileId: this.importData2.fileId,
          batchNum: this.batchNum,
          templateUuid: this.selectFileType[index].uuid
        })
      }).then(({ data }) => {
        this.importData2.addBtnLoading = false
        this.$message.success(data.msg)
        // this.getSecondImportTable()
        // this.importData2.importDialogVisible = false
      }).catch((data) => {
        this.importData2.addBtnLoading = false
      })
    },
    // 导出数据（模板）
    secondExportTemplate () {
      let templateUuids = []
      this.selectFileType.forEach(item => {
        templateUuids.push(item.uuid + ':' + item.templateName)
      })
      this.$downloadFile('/api/entryresign/file/downloadImprove', 'post', {
        batchNum: this.batchNum,
        empUuids: '',
        templateUuids: templateUuids.join(';')
      }, this.$global.EXCEL)
    },
    /* 确定发起签署 */
    handleDetermine () {
      this.determineBtnLoading = true
      let templateUuidList = []
      this.selectFileType.forEach(item => {
        templateUuidList.push(item.uuid)
      })
      // 先校验是否完善信息
      this.$http({
        url: '/api/entryresign/file/checkImprovePageList',
        method: 'post',
        data: {
          batchNum: this.batchNum,
          templateUuidList: templateUuidList,
          uuidList: []
        }
      }).then(({ data }) => {
        if (data.data.length > 0) {
          this.determineBtnLoading = false
          this.msgDialogVisible = true
        } else {
          this.handleDetermineSave()
        }
      }).catch(data => {
        this.determineBtnLoading = false
      })
    },
    handleDetermineSave () {
      let templateUuidList = []
      this.selectFileType.forEach(item => {
        templateUuidList.push(item.uuid)
      })
      this.$http({
        url: '/api/entryresign/file/launchSign',
        method: 'post',
        data: {
          batchNum: this.batchNum,
          templateUuidList: templateUuidList,
          type: this.signType,
          uuidList: []
        }
      }).then(({ data }) => {
        let res = data.data[0]
        if (res.code == 200) {
          this.determineBtnLoading = false
          this.active = 2
          this.refer()
        } else {
          this.$message.error(res.msg ? res.msg : '保存失败')
        }
      }).catch(data => {
        this.determineBtnLoading = false
      })
    },

    /* 获取导入列表数据 */
    getSecondImportTable (params = []) {
      this.importData2.importDialogVisible = false
      let that = this
      let index = Number(this.secondTabActive)
      if (index > this.selectFileType.length - 1) {
        index = 0
        this.secondTabActive = '0'
      }
      params = [
        { property: 'selectUuids', value: [] },
        { property: 'templateUuid', value: this.selectFileType[index].uuid },
        { property: 'batchNum', value: this.batchNum }
      ]
      this.$refs.secondTable.fetch({
        query: params,
        method: 'post',
        url: '/api/entryresign/file/improveList',
        callback: function () {
          if (that.active != 1) {
            that.active = 1
            that.refreshTabs = new Date().getTime()
          }
        }
      })
    },
    /* 动态文件名称改变 */
    secondFileChange (file, fileList) {
      if (!this.importData2.isUpload) {
        this.importData2.fileName = file.name
      } else {
        this.importData2.isUpload = false
      }
    },
    /* 上传成功后 */
    secondUploadSuccess (response, file, fileList) {
      let data = response.data[0][0]
      this.importData2.fileId = data.fileID
      this.importData2.isUpload = true
      this.importData2.btnLoading = false
      var sheetNames = data.sheetNames
      var obj
      // var isExist = false
      var arr = []
      var arrAll = []
      for (let key in sheetNames) {
        /* for (var i = 0; i < this.selectFileType.length; i++) {
            if (this.selectFileType[i].templateName === sheetNames[key]) {
              isExist = true
              break
            } else {
              isExist = false
            }
          } */
        obj = {
          name: key,
          value: sheetNames[key]
          // isExist: isExist
        }
        arr.push(obj)
        arrAll.push(sheetNames[key])
      }
      this.sheetData.checkAll = true
      this.sheetData.sheetList = arr
      // this.sheetData.selectSheetsAll = arrAll
      // this.sheetData.selectSheets = arrAll
      this.sheetData.selectSheets = ''
      this.sheetData.dialogVisible = true
      this.importData2.btnLoading = false
    },
    // 导入完善
    secondCheckUpload () {
      if (this.importData2.fileName !== '') {
        this.importData2.fileName = ''
        this.importData2.isUpload = true
        this.importData2.btnLoading = true
        this.$refs.secondUpload.submit()
      } else {
        this.$message.warning('请选择文件')
      }
    },
    // 确定导入
    secondSubmitUpload () {
      /* var sheetNumsArr = []
        for (var i = 0; i < this.sheetData.selectSheets.length; i++) {
          for (var j = 0; j < this.sheetData.sheetList.length; j++) {
            if (this.sheetData.selectSheets[i] === this.sheetData.sheetList[j].value) {
              sheetNumsArr.push(this.sheetData.sheetList[j].name)
            }
          }
        } */

      let sheetIndexs = this.sheetData.selectSheets
      let sheetNames = this.sheetData.sheetList[sheetIndexs].value

      var templateUuid = ''
      for (let i = 0; i < this.selectFileType.length; i++) {
        if (this.selectFileType[i].templateName === sheetNames) {
          templateUuid = this.selectFileType[i].uuid
          this.importData2.secondTabActive = String(i)
          this.selectFileType[i].fileId = this.importData2.fileId
          break
        }
      }
      if (templateUuid == '') {
        this.sheetData.dialogVisible = false
        return false
      }

      this.$http({
        url: '/api/entryresign/file/importImprove',
        method: 'post',
        data: {
          fileId: this.importData2.fileId,
          templateUuid: templateUuid,
          /* sheetIndexs: sheetNumsArr.join(','),
            sheetNames: this.sheetData.selectSheets.join(',') */
          sheetIndexs: this.sheetData.sheetList[sheetIndexs].name,
          sheetNames: this.sheetData.sheetList[sheetIndexs].value
        }
      }).then(({ data }) => {
        this.sheetData.dialogVisible = false
        this.getImportCountInfo('2')
        this.getDynamicHeader('import')
      }).catch((data) => {
      })
    },
    /* handleCheckAllChange (val) {
        this.sheetData.selectSheets = val ? this.$global.deepcopyArray(this.sheetData.selectSheetsAll) : []
        this.sheetData.isIndeterminate = false
      }, */
    handleSheetChange (value) {
      let checkedCount = value.length
      let sheetListLength = this.sheetData.sheetList.length
      this.sheetData.checkAll = checkedCount === sheetListLength
      this.sheetData.isIndeterminate = checkedCount > 0 && checkedCount < sheetListLength
    },

    importImproveVisible () {
      this.importData2.importDialogVisible = true
      this.importData2.refreshTabs = new Date().getTime()
    },
    //  预览
    previewHandle (row) {
      this.viewData.viewLoading = true
      this.$http({
        url: '/api/entryresign/pdfViewUrlByTemplate?empUuid=' + row.uuid + '&templateUuid=' + row.templateUuid,
        method: 'get'
      }).then(({ data }) => {
        this.viewData.viewLoading = false
        this.viewData.viewDocVisible = true
        this.viewData.pdfImgs = data.data[0]
      }).catch((data) => {
        this.viewData.viewLoading = false
      })
    },
    /* E=第二步 */
    /* 继续发起 */
    continueToNew () {
      clearInterval(this.timer)
      this.$http({
        url: '/api/entryresign/file/preLaunchSign',
        method: 'post',
        data: {
          type: this.signType
        }
      }).then(({ data }) => {
        clearInterval(this.timer)
        this.$router.push('/fileSign/startSign?batchNum=' + data.data[0] + '&type=' + this.signType)
        this.reload()
      })
    },
    // 跳转签署管理
    goSignAdmin () {
      clearInterval(this.timer)
      this.$router.push('/fileSign/signAdmin')
    },
    /* 定时器 */
    refer () {
      var that = this
      that.timer = setInterval(function () {
        if (that.countDown === 0) {
          clearInterval(that.timer)
          that.$router.push('/fileSign/signAdmin')
        } else {
          that.countDown--
        }
      }, 1000)
    },
    /* 页面跳转至主页后销毁定时器 */
    beforeDestroy () {
      // window.removeEventListener(this.time)
    }
  }
}
</script>
<style scoped lang="less">
  .content {
    .contentDetail {
      .head {
        display: flex;
        justify-content: space-between;
      }
      .detail {
        .detail-top {
          display: flex;
          justify-content: space-between;
        }
        .detail-bottom {
          display: flex;
          justify-content: space-between;
          /deep/ .el-table {
            margin-top: 0;
            border: 1px solid #DDDDDD;
            border-top: none;
          }
          .detail-bottom-left {
            flex: 1;
            max-width: calc(100% - 600px);
            min-width: 580px;
            height: 100%;
            .total {
              height: 48px;
              line-height: 48px;
            }
            /deep/ .pal-pagination {
              border: 1px solid #E2E3E4;
              border-top: none;
              padding: 10px;
            }
          }
          .detail-bottom-right {
            width: 30%;
            height: 100%;
            min-width: 580px;
            margin-left: 20px;
            .search-row {
              height: 37px;
              padding: 0 0 11px 0;
            }
          }
        }
      }
    }
    .contentDetail2 {
      /deep/ .el-tabs__nav-wrap::after {
        display: none;
      }
      /deep/.el-tabs__item{
        padding: 0 10px;
      }
      /deep/.el-tabs__header{
        .el-icon-arrow-left:before {
          font-size: 18px;
        }
        .el-icon-arrow-right:before {
          font-size: 18px;
        }
      }
      .file-tabs{
        overflow: hidden;
      }
    }
    .multiAdd {
      .title {
        display: flex;
        justify-content: space-between;
        .titleLeft {
          display: flex;
          justify-content: start;
          img {
            width: 30px;
            height: 30px;
          }
          p {
            margin-left: 5px;
            padding-top: 5px;
          }

        }
        .tltleRight {
          .el-upload {
            display: inline-block;
          }
        }
      }
    }
  }

  .singleAdd {
    /deep/ .el-form-item {
      margin-bottom: 15px;
    }
  }
</style>
