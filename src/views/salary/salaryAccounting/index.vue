<template>
  <div class="spl-container">
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="salaryAccounting-container">

      <div class="mt-70 spl-step">
        <splSteps :active="active" :data="stepsData"></splSteps>
      </div>
      <!--第一步-->
      <div v-show="active==0" class="pt-30">
        <div class="text-center">
          <div class="first-border">
            <div class="search-row" style="position: relative">
              <label class="label-text required" style="width: auto;">薪酬月份：</label>
              <div class="label-sel month">
                <el-date-picker class="w-220" type="month" v-model="setData.yearDate" @change="yearDateChange($event)" value-format="yyyy-MM"></el-date-picker>
                <p class="title_msg text-red" v-if="noSalaryRule">未获取到薪酬发放模式，请联系客服完善</p>
                <div v-else>
                  <div v-if="salaryRule.salaryPaymentModel=='001'" class="title_msg" v-show="$global.isNotBlank(setData.yearDate)"
                     v-text="this.$moment(setData.yearDate).format('YYYY年MM月') + '将发放' + this.$moment(setData.yearDate).format('YYYY年MM月') + '薪资'"></div>
                  <div v-if="salaryRule.salaryPaymentModel=='002'" class="title_msg" v-show="$global.isNotBlank(setData.yearDate)"
                     v-text="this.$moment(setData.yearDate).format('YYYY年MM月') + '将发放' + this.$moment(setData.yearDate+'-01').subtract('month', 1).format('YYYY年MM月') + '薪资'"></div>
                </div>
              </div>

              <label class="label-text required ml-60" style="width: auto;">扣缴义务人：</label>
              <el-select v-model="setData.obligorId" ref="obligor" @change="getSelectLabel($event)" filterable class="w-300" placeholder="请选择扣缴义务人">
                <el-option v-for="item in obligorOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>

            <el-button type="primary" class="mt-60 s-btn" @click="doFirstChoose">开始核算薪资</el-button>
          </div>
        </div>
      </div>
      <!--第二步-->
      <div v-show="active==1" class="step2 pt-10">
        <el-row>
          <el-col :span="24">
            <div class="table-header-row lh-32">
              <label class="label-text" style="width: auto;">薪酬年月：</label>
              <div class="label-sel"><p v-text="setData.yearDate"></p></div>

              <label class="label-text ml-60" style="width: auto;">扣缴义务人：</label>
              <div class="label-sel"><p v-text="setData.obligorName"></p></div>
            </div>
          </el-col>
        </el-row>
        <div class="type-list">
          <el-collapse class="spl-collapse" v-model="activeNames">
            <!--薪酬费用-->
            <div v-for="(item,index) in salaryGridList" :key="item.type">
              <div class="title">
                <p class="salary-type"><span class="step-title"><i :class="'ic-salary-type ic-salary-type'+item.type"></i>{{item.name}}</span></p>
              </div>
              <el-collapse-item class="detail-type" :name="item.type">
                <template slot="title">
                  <div class="type-title clearfix">
                    <p class="title fl pr-50">
                      <span>总人次：</span><span class="value value1">{{item.totalPeopleNum}}</span>
                    </p>
                    <p class="title fl pr-50">
                      <span>总实发：</span><span class="value value2" v-text="$global.milliFormat(item.totalActual, 2)"></span>
                    </p>
                    <p class="title fl">
                      <span>总个税：</span><span class="value value2" v-text="$global.milliFormat(item.totalTax, 2)"></span>
                    </p>
                    <p class="toggle-detail pl-10 fr">数据 <i class="ic-toggle-detail"></i></p>
                    <p class="fr">
                      <el-button v-if="item.type==2" type="primary" size="mini" icon="icon ic-import-white" class="btn--border-white ml-10" @click.stop="downloadFileTemp()">引入数据</el-button>

                      <el-button type="primary" size="mini" icon="icon ic-import-white" class="btn--border-white ml-10" @click.stop="importSalaryByType(index)">导入</el-button>
                    </p>
                  </div>
                </template>
                <div class="table-content">
                  <dTable @fetch="getSalaryTableData(item.type)" tableHeight="300px" :ref="'salaryTable'+item.type" :showSelection="false" :showIndex="true" :paging="true">
                    <el-table-column v-for="(col,colidx) in item.tableCols" :prop="col.prop" :label="col.label" :header-align="col.headerAlign" :align="col.align"
                                     :min-width="col.width" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span v-text="scope.row['items'][col.prop]" v-if="col.isDynamic"></span>
                        <span v-if="!col.isDynamic">
                          <span v-text="$global.milliFormat(scope.row[col.prop],2)" v-if="col.isAmount"></span>
                          <span v-text="scope.row[col.prop]" v-if="!col.isAmount"></span>
                        </span>
                      </template>
                    </el-table-column>
                  </dTable>
                </div>
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>
        <div class="operate-btns-bottom mt-30">
          <el-button class="" @click="exportSalaryData('1')">导出数据</el-button>
          <el-button type="primary" class="ml-30" @click="sureSalaryCounting" :loading="sureLoading">薪酬确定</el-button>
        </div>
      </div>
      <!--第三步-->
      <div v-show="active==2" class="pt-10">
        <el-row class="step3-header">
          <el-col :span="8">
            <div>
              <label class="label-text w-120">账单编号：</label>
              <span class="label-sel" v-text="accountingInfo.recCode"></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label class="label-text w-120">账单年月：</label>
              <span class="label-sel" v-text="this.$moment(accountingInfo.ffMonth+'01').format('YYYY-MM')"></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label class="label-text w-120">账单总金额：</label>
              <span class="label-sel" v-text="this.$global.milliFormat(accountingInfo.totalAmount,2)"></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label class="label-text w-120">收款户名：</label>
              <span class="label-sel" v-text="accountingInfo.accountName"></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <label class="label-text w-120">收款银行：</label>
              <span class="label-sel">{{accountingInfo.bankName}} {{accountingInfo.bankAccount}}</span>
            </div>
          </el-col>
        </el-row>

        <div class="title mt-20 mb-20">
          <p class="step3-header-title"><span class="step-title">费用汇总明细</span></p>
        </div>

        <el-collapse class="spl-collapse" :value="1">
          <el-collapse-item class="detail-type" :name="1">
            <template slot="title">
              <div class="type-title clearfix">
                <p class="title fl pr-50">
                  <span>薪酬费用</span>
                </p>
                <p class="toggle-detail pl-10 fr">汇总<i class="ic-toggle-detail"></i></p>
              </div>
            </template>
            <div class="table-content">
              <dTable :data="salaryInfo" :cancelMinHeight="true" :showEmptyAll="true" :showSelection="false" :showIndex="false" :paging="false">
                <el-table-column prop="type" label="薪酬收入类型" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amount" label="实发金额" :min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-text="$global.milliFormat(scope.row.amount,2)"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="tax" label="个税金额" :min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-text="$global.milliFormat(scope.row.tax,2)"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="total" label="合计" :min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-text="$global.milliFormat(scope.row.total,2)" :style="scope.row.type == '合计'?{'color': 'red'}:{}"></span>
                  </template>
                </el-table-column>
              </dTable>
            </div>
          </el-collapse-item>
        </el-collapse>

        <el-collapse class="spl-collapse pt-20" :value="1">
          <el-collapse-item class="detail-type" :name="1">
            <template slot="title">
              <div class="type-title clearfix">
                <p class="title fl pr-50">
                  <span>其他</span>
                </p>
                <p class="toggle-detail pl-10 fr">汇总<i class="ic-toggle-detail"></i></p>
              </div>
            </template>
            <div class="table-content">
              <dTable :data="otherInfo" :cancelMinHeight="true" :showEmptyAll="true" :showSelection="false" :showIndex="false" :paging="false">
                <el-table-column prop="type" label="费用类型" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amount" label="金额" :min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-text="$global.milliFormat(scope.row.amount,2)"></span>
                  </template>
                </el-table-column>
                <el-table-column prop="adjustment" label="调整费" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="total" label="合计" :min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-text="$global.milliFormat(scope.row.total,2)" :style="scope.row.type == '合计'?{'color': 'red'}:{}"></span>
                  </template>
                </el-table-column>
              </dTable>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div class="title mt-30 mb-20">
          <p class="step-title">费用明细</p>
        </div>

        <splTab :tabs="detailTabs" v-model="tabName" :type="1" class="mb-20"></splTab>

          <div v-show="tabName==0">
            <dTable @fetch="getSalaryTableData('')" :tableHeight="'450px'" ref="salaryTable" :showSelection="false" :showIndex="true" :paging="true">
              <el-table-column v-for="(col,colidx) in thirdSalaryTableCols" :prop="col.prop" :label="col.label" :header-align="col.headerAlign" :align="col.align"
                               :min-width="col.width" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="scope.row['items'][col.prop]" v-if="col.isDynamic"></span>
                  <span v-if="!col.isDynamic">
                    <span v-text="$global.milliFormat(scope.row[col.prop],2)" v-if="col.isAmount"></span>
                    <span v-text="scope.row[col.prop]" v-if="!col.isAmount"></span>
                  </span>
                </template>
              </el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" icon="icon ic-export-blue" class="btn--border-blue ml-10" @click="exportSalaryData('1')">导出数据</el-button>
              </template>
            </dTable>
          </div>

          <div v-show="tabName==1">
            <dTable @fetch="getSetviceFeeData" :tableHeight="'450px'" ref="serviceFeeTable" :showSelection="false" :showIndex="true" :paging="true">
              <el-table-column prop="empName" label="姓名" header-align="left" align="left" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="empIdCard" label="证照号码" header-align="left" align="left" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="fyDate" label="费用年月" header-align="center" align="center" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="amount" label="服务费金额" header-align="right" align="right" :min-width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="$global.milliFormat(scope.row.amount,2)"></span>
                </template>
              </el-table-column>
              <el-table-column prop="detail" label="备注" header-align="left" align="left" :min-width="180" :show-overflow-tooltip="true"></el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" icon="icon ic-export-blue" class="btn--border-blue ml-10" @click="exportSalaryData('2')">导出数据</el-button>
              </template>
            </dTable>
          </div>
        <div class="operate-btns-bottom mt-20">
          <el-button @click="active=1">重新核算</el-button>
          <el-button type="primary" class="ml-30" :loading="saveLoading" @click="saveSalaryAccounting">保存薪酬账单</el-button>
        </div>
      </div>
    </div>

    <!--导入薪资-->
    <el-drawer :visible.sync="showImport" :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer" @closed="closedDrawer">
      <template slot="title">
        <div class="drawer-title">
          <span class="value value1">{{importTypeName}}</span>
          <div class="search-row-btn mr-60">
            <el-button type="primary" class="w-80 s-btn" :loading="saveImportLoading" @click="saveImportSalaryData">保存</el-button>
          </div>
        </div>
      </template>
      <el-row class="import-row">
        <el-col :span="8">
          <div>
            <label class="label-text" style="width: auto;"><i class="el-icon-warning yellow-icon font-18 mr-5" style="vertical-align: middle"></i>结果：通过校验
              <span v-text="successCount + ' 条'"></span>
              <span class="pl-10" v-text="'失败 '"></span>
              <span style="color: #F56C6C" v-text="failCount"></span>
              <span> 条</span>
            </label>
            <span class="ml-40 mr-10">只看失败</span>
            <el-switch v-model="switchValue" :activeColor="$global.switchColor[0]" active-value="1" inactive-value="0" :inactiveColor="$global.switchColor[1]"
                       @change="changeStatus"></el-switch>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="clearfix emp-upload ml-20">
            <div class="search-row-btn">
              <el-button type="primary" class="s-btn ml-10" icon="el-icon-download" @click="uploadImportTemplate">模板下载</el-button>
            </div>
            <el-upload class="fr" ref="upload" :action="this.$global.uploadUrl" :headers="this.$global.setUploadHeaders" :file-list="fileList" :on-change="fileChange"
                       :on-success="uploadSuccess" :show-file-list="false" :auto-upload="false" :multiple="false">
              <el-button slot="trigger" plain class="ml-10 s-btn">选择文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="primary" icon="icon ic-import-white" class="s-btn btn--border-white ml-20" @click="submitUpload">导入</el-button>
            </el-upload>
            <el-input class="fr" :readonly="true" v-model="fileName" style="width: 280px;"></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="drawer-content" v-loading="mainLoading" :element-loading-text="'文件上传中...'" element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(244, 248, 248, 0.5)">
        <el-row>
          <el-col :span="24">
            <dTable @fetch="getImportTableData" v-show="importIndex==0" ref="importTable2" :tableHeight="importTableHeight" :showSelection="true" :showIndex="true" :paging="true">
              <el-table-column v-for="(col,index) in this.salaryGridList[0].importTableCols" :header-align="col.headerAlign" :align="col.align" label-class-name="text-default"
                               :class-name="col.className" :prop="col.prop" :label="col.label" :min-width="col.width" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="scope.row['salaryItems'][col.prop]" v-if="col.isDynamic"></span>
                  <span v-if="!col.isDynamic">
                    <span v-text="$global.milliFormat(scope.row[col.prop],2)" v-if="col.isAmount"></span>
                    <span v-text="scope.row[col.prop]" v-if="!col.isAmount"></span>
                  </span>
                </template>
              </el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" type="primary" icon="icon ic-export-white" class="btn--border-white ml-10" @click="exportImportedData">导出</el-button>
                <el-button size="small" icon="icon el-icon-delete" class="btn--border-blue" @click="delImportedData">删除</el-button>
              </template>
            </dTable>
            <dTable @fetch="getImportTableData" v-show="importIndex==1" ref="importTable1" :tableHeight="importTableHeight" :showSelection="true" :showIndex="true" :paging="true">
              <el-table-column v-for="(col,index) in this.salaryGridList[1].importTableCols" :header-align="col.headerAlign" :align="col.align" label-class-name="text-default"
                               :class-name="col.className" :prop="col.prop" :label="col.label" :min-width="col.width" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="scope.row['salaryItems'][col.prop]" v-if="col.isDynamic"></span>
                  <span v-if="!col.isDynamic">
                    <span v-text="$global.milliFormat(scope.row[col.prop],2)" v-if="col.isAmount"></span>
                    <span v-text="scope.row[col.prop]" v-if="!col.isAmount"></span>
                  </span>
                </template>
              </el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" type="primary" icon="icon ic-export-white" class="btn--border-white ml-10" @click="exportImportedData">导出</el-button>
                <el-button size="small" icon="icon el-icon-delete" class="btn--border-blue" @click="delImportedData">删除</el-button>
              </template>
            </dTable>
            <dTable @fetch="getImportTableData" v-show="importIndex==2" ref="importTable3" :tableHeight="importTableHeight" :showSelection="true" :showIndex="true" :paging="true">
              <el-table-column v-for="(col,index) in this.salaryGridList[2].importTableCols" :header-align="col.headerAlign" :align="col.align" label-class-name="text-default"
                               :class-name="col.className" :prop="col.prop" :label="col.label" :min-width="col.width" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="scope.row['salaryItems'][col.prop]" v-if="col.isDynamic"></span>
                  <span v-if="!col.isDynamic">
                    <span v-text="$global.milliFormat(scope.row[col.prop],2)" v-if="col.isAmount"></span>
                    <span v-text="scope.row[col.prop]" v-if="!col.isAmount"></span>
                  </span>
                </template>
              </el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" type="primary" icon="icon ic-export-white" class="btn--border-white ml-10" @click="exportImportedData">导出</el-button>
                <el-button size="small" icon="icon el-icon-delete" class="btn--border-blue" @click="delImportedData">删除</el-button>
              </template>
            </dTable>
            <dTable @fetch="getImportTableData" v-show="importIndex==3" ref="importTable4" :tableHeight="importTableHeight" :showSelection="true" :showIndex="true" :paging="true">
              <el-table-column v-for="(col,index) in this.salaryGridList[3].importTableCols" :header-align="col.headerAlign" :align="col.align" label-class-name="text-default"
                               :class-name="col.className" :prop="col.prop" :label="col.label" :min-width="col.width" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-text="scope.row['salaryItems'][col.prop]" v-if="col.isDynamic"></span>
                  <span v-text="scope.row[col.prop]" v-if="!col.isDynamic"></span>
                </template>
              </el-table-column>
              <template slot="pagination-btns">
                <el-button size="small" type="primary" icon="icon ic-export-white" class="btn--border-white ml-10" @click="exportImportedData">导出</el-button>
                <el-button size="small" icon="icon el-icon-delete" class="btn--border-blue" @click="delImportedData">删除</el-button>
              </template>
            </dTable>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
    import dTable from '../../../components/common/table'
    import splTab from '../../../components/common/spl-tab'
    import splSteps from '../../../components/common/spl-steps'
    export default {
        components: {dTable, splTab, splSteps},
        data() {
            return {
                // 导航
                pathData: [
                    {name: '薪酬管理'},
                    {name: '薪酬核算'}
                ],
              stepsData: [
                { title: '选择条件', description: '选择薪酬所属月份与扣缴义务人' },
                { title: '核算薪酬', description: '下载模板导入薪酬数据' },
                { title: '形成账单', description: '形成薪酬账单' }
              ],
              detailTabs: ['薪酬', '服务费'],
                active: 0,
                seqNo: this.$global.UUID(),
                salaryRule: {},//薪酬规则
                activeNames: [2],
                commonCols: [
                    {prop: 'empBankDictName', label: '银行名称', width: 180, className: '', isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empBankAccountName', label: '银行账户名', width: 180, className: '', isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empBankAccount', label: '银行卡号', width: 180, className: '', isAmount: false, headerAlign: "left", align: "left"}
                ],
                importCommonCols: [
                    {prop: 'empBankDictName', label: '银行名称', width: 180, className: '', isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empAccountName', label: '银行账户名', width: 180, className: '', isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empBankAccount', label: '银行卡号', width: 180, className: '', isAmount: false, headerAlign: "left", align: "left"}
                ],
                salaryGridList: [
                    {
                        type: 2,
                        statusFiledName: 'importStatus',
                        successStatus: 'SUCCESS',
                        failStatus: 'FAILED',
                        name: '正常工资薪金',
                        totalPeopleNum: 0,
                        totalActual: 0,
                        totalTax: 0,
                        dynamicFields: [],
                        notDynamicFields: ["个人社保合计", "个人公积金","工资个税","应发工资"],
                        tableCols: [
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedMoney', label: '应发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'socialSecurityAmount', label: '个人社保合计', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'accfundAmount', label: '个人公积金', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAmount', label: '工资个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualAmount', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                        ],
                        afterCols: [
                            {prop: 'taxAdditionalItem0', label: '累计减除费用', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAdditionalItem1', label: '累计子女教育扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAdditionalItem9', label: '累计继续教育扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAdditionalItem7', label: '累计赡养老人扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAdditionalItem4', label: '累计住房贷款利息', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAdditionalItem5', label: '累计住房租金扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"}
                        ],
                        importTableCols: [
                            {prop: 'importMsg', label: '失败原因', width: 180, className: 'text-red', isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedSalary', label: '应发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'socialSecurityAmount', label: '个人社保合计', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'accfundAmount', label: '个人公积金', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAmount', label: '工资个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualSalary', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                        ],
                        importAfterCols: [
                            {prop: 'totalDeductAmount', label: '累计减除费用', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'childrenEducationAmount', label: '累计子女教育扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'keepEducationAmonut', label: '累计继续教育扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'supportOldAmout', label: '累计赡养老人扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'housingLoansAmonut', label: '累计住房贷款利息', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'housingRentsAmonut', label: '累计住房租金扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"}
                        ],
                        importTableUrl: '/api/salary/listSalaryImportRecord',
                        saveImportUrl: '/api/salary/importSave'
                    },
                    {
                        type: 1,
                        statusFiledName: 'importStatus',
                        successStatus: 'SUCCESS',
                        failStatus: 'FAILED',
                        name: '年终奖',
                        totalPeopleNum: 0,
                        totalActual: 0,
                        totalTax: 0,
                        dynamicFields: [],
                        notDynamicFields: ["应发年终奖", "年终奖个税"],
                        tableCols: [
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedMoney', label: '应发年终奖', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAmount', label: '年终奖个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualAmount', label: '实发年终奖', width: 180, isAmount: true, headerAlign: "right", align: "right"}
                        ],
                        afterCols: [],
                        importTableCols: [
                            {prop: 'importMsg', label: '失败原因', width: 180, className: 'text-red', isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedBonus', label: '应发年终奖', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'bonusTaxAmount', label: '年终奖个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualBonus', label: '实发年终奖', width: 180, isAmount: true, headerAlign: "right", align: "right"}
                        ],
                        importAfterCols: [],
                        importTableUrl: '/api/salary/listBonusImportRecord',
                        saveImportUrl: '/api/salary/importSave'
                    },
                    {
                        type: 3,
                        statusFiledName: 'importStatus',
                        successStatus: 'SUCCESS',
                        failStatus: 'FAILED',
                        name: '劳务报酬所得',
                        totalPeopleNum: 0,
                        totalActual: 0,
                        totalTax: 0,
                        dynamicFields: [],
                        notDynamicFields: [],
                        tableCols: [
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedMoney', label: '应发金额', width: 180, isAmount: true, headerAlign: "left", align: "left"},
                            {prop: 'taxAmount', label: '个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualAmount', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'empBankDictName', label: '银行名称', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empBankAccountName', label: '银行账户名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empBankAccount', label: '银行卡号', width: 180, isAmount: false, headerAlign: "left", align: "left"}
                        ],
                        afterCols: [],
                        importTableCols: [
                            {prop: 'importMsg', label: '失败原因', width: 180, className: 'text-red', isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedSalary', label: '应发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAmount', label: '个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualSalary', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'empBankDictName', label: '银行名称', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empAccountName', label: '银行账户名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empBankAccount', label: '银行卡号', width: 180, isAmount: false, headerAlign: "left", align: "left"}
                        ],
                        importAfterCols: [],
                        importTableUrl: '/api/salary/listRemunerationImportRecord',
                        saveImportUrl: '/api/salary/importSave'
                    },
                    {
                        type: 4,
                        statusFiledName: 'verityFlag',
                        successStatus: 0,
                        failStatus: 1,
                        name: '其他收入类型',
                        totalPeopleNum: 0,
                        totalActual: 0,
                        totalTax: 0,
                        dynamicFields: [],
                        notDynamicFields: [],
                        tableCols: [
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'provideType', label: '收入类型', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedMoney', label: '应发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'otherAmount', label: '扣减金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAmount', label: '个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualAmount', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'empBankDictName', label: '银行名称', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empBankAccountName', label: '银行账户名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empBankAccount', label: '银行卡号', width: 180, isAmount: false, headerAlign: "left", align: "left"}
                        ],
                        afterCols: [],
                        importTableCols: [
                            {prop: 'failedMessage', label: '失败原因', width: 180, className: 'text-red', isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
							{prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'conpensationName', label: '收入类型', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'plannedSalary', label: '应发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'otherAmount', label: '扣减金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'taxAmount', label: '个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'actualSalary', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                            {prop: 'empBankDictName', label: '银行名称', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empAccountName', label: '银行账户名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                            {prop: 'empBankAccount', label: '银行卡号', width: 180, isAmount: false, headerAlign: "left", align: "left"}
                        ],
                        importAfterCols: [],
                        importTableUrl: '/api/salary/otherSalary/listImportRecord',
                        saveImportUrl: '/api/salary/importSave'
                    }
                ],
                importTypeName: '',
                showImport: false,
                successCount: 0,
                failCount: 0,
                switchValue: '0',
                importType: '2',
                importIndex: 0,
                fileId: '',
                fileName: '',
                fileList: [],
                mainLoading: false,
                saveImportLoading: false,
                obligorOptions: [], // 扣缴义务人数据
                bankCodeOptions: [], // 扣缴义务人数据
                tableData: [],
                setData: {
                    yearDate: '',
                    obligorId: '',
                    obligorName: ''
                },
                importTypeKey: this.$global.UUID(),
                accountingInfo: {},//薪酬确认薪酬的账单信息
                salaryInfo: [],
                otherInfo: [],
                tabName: 0,
                sureLoading: false,
                saveLoading: false,
                thirdSalaryTableCols: [
                    {prop: 'empName', label: '姓名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empIdCard', label: '证照号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'phone', label: '手机号码', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empBankDictName', label: '银行名称', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empBankAccountName', label: '银行账户名', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'empBankAccount', label: '银行卡号', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'bankBranch', label: '开户信息', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'provideType', label: '收入类型', width: 180, isAmount: false, headerAlign: "left", align: "left"},
                    {prop: 'ffMonth', label: '薪酬年月', width: 180, isAmount: false, headerAlign: "center", align: "center"},
                    {prop: 'plannedMoney', label: '应发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'socialSecurityAmount', label: '个人社保合计', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'accfundAmount', label: '个人公积金', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'taxAmount', label: '工资个税', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'actualAmount', label: '实发金额', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                ],
                thirdSalaryTableAfterCols: [
                    {prop: 'taxAdditionalItem0', label: '累计减除费用', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'taxAdditionalItem1', label: '累计子女教育扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'taxAdditionalItem9', label: '累计继续教育扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'taxAdditionalItem7', label: '累计赡养老人扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'taxAdditionalItem4', label: '累计住房贷款利息', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'taxAdditionalItem5', label: '累计住房租金扣除', width: 180, isAmount: true, headerAlign: "right", align: "right"},
                    {prop: 'otherAmount', label: '扣减金额', width: 180, isAmount: true, headerAlign: "right", align: "right"}
                ],
                concatThirdTableCols: false,
                noSalaryRule: false
            }
        },
        created() {
            //获取扣缴义务人数据
            this.getObligorData()
            //获取工资动态字段
            this.getSalaryDynamicField(2, 0)
            //获取年终奖动态字段
            this.getSalaryDynamicField(1, 1)

        },
        filters: {},
        computed: {
            importTableHeight: function () {
                return this.$global.bodyHeight - 310 + 'px'
            }
        },
        watch: {
            obligorOptions: function (newVal, oldVal) {
                if (newVal.length == 1) {
                    this.setData.obligorId = newVal[0].id
                    this.setData.obligorName = newVal[0].name
                }
            }
        },
        methods: {
            // 获取扣缴义务人数据
            getObligorData() {
                this.$http({
                    url: '/api/salary/listOptrComp',
                    method: 'post',
                    params: {}
                }).then(({data}) => {
                    this.obligorOptions = data.data[0]
                })
            },
            yearDateChange: function (event) {
                if (!event) {
                    return;
                }
                this.$http({
                    url: '/api/salary/getSalaryProduct',
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                  let res = data.data[0]
                  if(res!=null&&res!='null'){
                    if(res.salaryPaymentModel==null || res.salaryPaymentModel==''){
                      this.noSalaryRule = true
                    }else{
                      this.noSalaryRule = false
                    }
                    this.salaryRule = res
                  }else{
                    this.noSalaryRule = true
                    this.salaryRule = {}
                  }

                })
            },
            // 改变扣缴义务人数据
            getSelectLabel(value) {
                var options = this.$refs.obligor.options
                this.setData.obligorName = this.$global.getSelectLabel(value, options)
            },
            //获取工资或年终奖的动态字段
            getSalaryDynamicField: function (type, index) {
                var that = this;
                this.$http({
                    url: '/api/salary/listDynamicItem?type=' + type,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    that.salaryGridList[index].dynamicFields = data.data[0]
                    that.salaryGridList[index].tableCols = that.salaryGridList[index].tableCols
                        .concat(that.parseDynamicFieldToTableCol(data.data[0], that.salaryGridList[index].notDynamicFields, ''))
                        .concat(that.salaryGridList[index].afterCols)
                        .concat(that.commonCols)

                    that.thirdSalaryTableCols = that.thirdSalaryTableCols.concat(that.parseDynamicFieldToTableCol(data.data[0], that.salaryGridList[index].notDynamicFields, ''))

                    that.salaryGridList[index].importTableCols = that.salaryGridList[index].importTableCols
                        .concat(that.parseDynamicFieldToTableCol(data.data[0], that.salaryGridList[index].notDynamicFields, ''))
                        .concat(that.salaryGridList[index].importAfterCols)
                        .concat(that.importCommonCols)
                })
            },
            parseDynamicFieldToTableCol: function (dynamicFields, notDynamicFields, propName) {
                var cols = []
                dynamicFields.forEach(item => {
                    if (notDynamicFields.indexOf(item.name) == -1) {
                        cols.push({prop: propName + item.code, label: item.name, width: 180, isDynamic: true, isAmount: true, headerAlign: "right", align: "right"})
                    }
                })
                return cols
            },
            // 第一步选择 -- 请选择台账年月与所属扣缴义务人
            doFirstChoose() {
                if(this.noSalaryRule){
                  return false
                }
                let msg = []
                if (!this.setData.yearDate) {
                    msg.push('薪酬月份')
                }
                if (!this.setData.obligorId) {
                    msg.push('扣缴义务人')
                }
                if (msg.length > 0) {
                    this.$message.warning('请选择' + msg.join("、"))
                    return false
                }
                //获取统计信息
                /*this.salaryGridList.forEach(item =>{
                    this.getSalaryTotal(item.type)
                })*/
                //
                //删除未做单数据
                this.$http({
                    url: '/api/salary/deleteNotSaveBill',
                    method: 'post',
                    data: {}
                }).then(({data}) => {

                })
                this.active = 1
            },
            //获取统计数据
            getSalaryTotal: function (type) {
                this.$http({
                    url: '/api/salary/salaryTotal',
                    method: 'post',
                    data: {
                        ffMonth: this.$moment(this.setData.yearDate).format("YYYYMM"),
                        seqNo: this.seqNo,
                        type: type + ''
                    }
                }).then(({data}) => {
                    var filterArr = this.salaryGridList.filter(item => {
                        return item.type == type
                    })
                    filterArr[0].totalPeopleNum = data.data[0].totalPeopleNum
                    filterArr[0].totalActual = data.data[0].totalActual
                    filterArr[0].totalTax = data.data[0].totalTax
                })
            },
            //查询第二步的列表数据
            getSalaryTableData: function (type) {
                var params = [
                    {property: 'seqNo', value: this.seqNo},
                    {property: 'ffMonth', value: this.$moment(this.setData.yearDate).format("YYYYMM")},
                    {property: 'type', value: type + ''}
                ]
                if (this.$global.isBlank(type + '')) {
                    this.$refs['salaryTable'].fetch({
                        query: params,
                        method: 'post',
                        url: '/api/salary/listSalaryDetail'
                    })
                } else {
                    this.$refs['salaryTable' + type][0].fetch({
                        query: params,
                        method: 'post',
                        url: '/api/salary/listSalaryDetail'
                    })
                }

            },
            //第二步点击导入按钮控制抽屉打开
            importSalaryByType: function (index) {
                this.importTypeName = '导入' + this.salaryGridList[index].name
                this.importType = this.salaryGridList[index].type
                this.importIndex = index

                this.fileId = ''

                this.showImport = true
                this.$nextTick(() => {
                    this.getImportTableData()
                    this.getImportCountData()
                })
            },
            //引入数据
            downloadFileTemp: function () {
                this.$downloadFile('/api/salary/downloadFileTemp?ffMonth=' + this.setData.yearDate, 'post', {})
            },
            //下载导入模板
            uploadImportTemplate: function () {
                this.$downloadFile('/api/salary/downloadTemplateFile?type=' + this.importType, 'post', {})
            },
            //导入时文件改变的事件方法
            fileChange(file, fileList) {
                this.fileName = file.name
            },
            //提交导入的文件
            submitUpload() {
                if (this.fileName != '') {
                    this.mainLoading = true
                    this.fileName = ''
                    this.$refs.upload.submit()
                } else {
                    this.$message.warning('请选择文件')
                }
            },
            // 上传成功后
            uploadSuccess(response, file, fileList) {
                file.name = ''
                var fileId = response.data[0].fileId//文件id
                this.fileId = fileId
                this.$http({
                    url: '/api/salary/import',
                    method: 'post',
                    data: {
                        ffMonth: this.$moment(this.setData.yearDate).format("YYYYMM"),
                        fileId: fileId,
                        optrCompId: this.setData.obligorId,
                        optrCompName: this.setData.obligorName,
                        seqNo: this.seqNo,
                        type: this.importType + ''
                    }
                }).then(({data}) => {
                    this.mainLoading = false
                    this.$refs.upload.clearFiles()
                    this.getImportTableData()
                    this.getImportCountData()
                }).catch(({data}) => {
                    this.mainLoading = false
                })
            },
            //导入时的只看失败的控制开关的change事件方法
            changeStatus(value) {
                this.switchValue = value;
                this.getImportTableData()
                //this.getImportCountData();
            },
            //获取导入统计数据
            getImportCountData: function () {
                if (this.$global.isBlank(this.fileId)) {
                    this.successCount = 0
                    this.failCount = 0
                } else {
                    this.$http({
                        url: '/api/salary/getImportCount?fileId=' + this.fileId + '&type=' + this.importType,
                        method: 'post',
                        data: {}
                    }).then(({data}) => {
                        this.successCount = data.data[0].success
                        this.failCount = data.data[0].fail
                    })
                }
            },
            //查询导入的薪酬数据
            getImportTableData: function () {
                if (this.$global.isBlank(this.fileId)) {
                    this.$refs['importTable' + this.importType].tableData = []
                    this.$refs['importTable' + this.importType].total = 0
                } else {
                    var params = [
                        {property: 'type', value: this.importType + ''},
                        {property: 'fileId', value: this.fileId},
                        {property: 'status', value: this.switchValue == 1 ? 'FAILED' : ''}
                    ]
                    this.$refs['importTable' + this.importType].fetch({
                        query: params,
                        method: 'post',
                        url: this.salaryGridList[this.importIndex].importTableUrl
                    })
                }
                this.importTypeKey = this.$global.UUID()
            },
            //导出导入的数据
            exportImportedData: function () {
                var ids = this.$refs['importTable' + this.importType].getSelectionsArr('id')
                this.$downloadFile('/api/salary/exportImportRecord', 'post', {
                    fileId: this.fileId,
                    type: this.importType + '',
                    status: this.switchValue == 1 ? 'FAILED' : '',
                    ids: ids
                })
            },
            //删除导入的数据
            delImportedData: function () {
                var selections = this.$refs['importTable' + this.importType].selections
                if (selections.length == 0) {
                    this.$message.warning('请选择要删除的数据')
                    return
                }
                var successIds = []
                var failIds = []
                selections.forEach(item => {
                    if (item[this.salaryGridList[this.importIndex].statusFiledName] == this.salaryGridList[this.importIndex].successStatus) {
                        successIds.push(item.id)
                    } else if (item[this.salaryGridList[this.importIndex].statusFiledName] == this.salaryGridList[this.importIndex].failStatus) {
                        failIds.push(item.id)
                    }
                })
                this.$http({
                    url: '/api/salary/deleteImportRecord',
                    method: 'post',
                    data: {
                        failIds: failIds,
                        fileId: this.fileId,
                        type: this.importType + '',
                        successIds: successIds
                    }
                }).then(({data}) => {
                    this.$message.success('删除成功')
                    this.getImportTableData()
                    this.getImportCountData()
                })
            },
            closedDrawer: function () {
                this.showImport = false
                this.fileId = ''
            },
            //保存导入的薪酬数据
            saveImportSalaryData: function () {
                this.saveImportLoading = true
                if (this.$global.isBlank(this.fileId)) {
                    this.saveImportLoading = false
                    this.$message.warning('请导入薪资数据')
                    return
                }
                if (this.successCount == 0) {
                    this.saveImportLoading = false
                    this.$message.warning('没有成功数据可保存')
                    return
                }
                this.$http({
                    url: this.salaryGridList[this.importIndex].saveImportUrl + '?fileId=' + this.fileId + '&type=' + this.importType,
                    method: 'post',
                    data: {}
                }).then(({data}) => {
                    this.saveImportLoading = false
                    this.closedDrawer()
                    this.getSalaryTableData(this.importType)
                    this.getSalaryTotal(this.importType)
                }).catch(({data}) => {
                    this.saveImportLoading = false
                })
            },
            //第二步的导出数据
            exportSalaryData: function (type) {
                this.$downloadFile('/api/salary/exportSalarySureDetail', 'post', {
                    ffMonth: this.$moment(this.setData.yearDate).format("YYYYMM"),
                    seqNo: this.seqNo,
                    type: type
                })
            },
            // 第二步-薪酬确定
            sureSalaryCounting() {
                //没有导出薪酬记录不能走确认
                this.sureLoading = true
                if (!this.concatThirdTableCols) {
                    this.thirdSalaryTableCols = this.thirdSalaryTableCols.concat(this.thirdSalaryTableAfterCols)
                    this.concatThirdTableCols = true
                }
                if (!this.validateHaveSalaryData()) {
                    this.sureLoading = false
                    this.$message.warning('请导入薪酬数据再确认薪酬')
                    return
                }
                this.$http({
                    url: '/api/salary/salarySure',
                    method: 'post',
                    data: {
                        ffMonth: this.$moment(this.setData.yearDate).format("YYYYMM"),
                        optrCompId: this.setData.obligorId,
                        optrCompName: this.setData.obligorName,
                        seqNo: this.seqNo,
                    }
                }).then(({data}) => {
                    ++this.active
                    this.sureLoading = false
                    this.accountingInfo = data.data[0]
                    this.parseSalaryInfo()
                    this.parseOtherInfo()
                    this.getSalaryTableData('')
                    this.getSetviceFeeData()
                }).catch(({data}) => {
                    this.sureLoading = false
                })
            },
            validateHaveSalaryData: function () {
                return this.$refs['salaryTable1'][0].total > 0 || this.$refs['salaryTable2'][0].total > 0
                    || this.$refs['salaryTable3'][0].total > 0 || this.$refs['salaryTable4'][0].total > 0
            },
            parseSalaryInfo: function () {
                var salaryInfo = []
                salaryInfo.push(
                    {
                        type: '正常工资薪金',
                        amount: this.accountingInfo.wages,
                        tax: this.accountingInfo.wagesTax,
                        total: this.accountingInfo.wages + this.accountingInfo.wagesTax
                    }
                )
                salaryInfo.push(
                    {
                        type: '年终奖',
                        amount: this.accountingInfo.yearBonusReal,
                        tax: this.accountingInfo.yearBonusTax,
                        total: this.accountingInfo.yearBonusReal + this.accountingInfo.yearBonusTax
                    }
                )
                salaryInfo.push(
                    {
                        type: '劳务报酬所得',
                        amount: this.accountingInfo.remuneration,
                        tax: this.accountingInfo.remunerationTax,
                        total: this.accountingInfo.remuneration + this.accountingInfo.remunerationTax
                    }
                )
                salaryInfo.push(
                    {
                        type: '其他收入类型',
                        amount: this.accountingInfo.otherAmount,
                        tax: this.accountingInfo.otherAmountTax,
                        total: this.accountingInfo.otherAmount + this.accountingInfo.otherAmountTax
                    }
                )
                var amountTotal = this.accountingInfo.wages + this.accountingInfo.yearBonusReal + this.accountingInfo.remuneration + this.accountingInfo.otherAmount
                var taxTotal = this.accountingInfo.wagesTax + this.accountingInfo.yearBonusTax + this.accountingInfo.remunerationTax + this.accountingInfo.otherAmountTax
                salaryInfo.push(
                    {
                        type: '合计',
                        amount: amountTotal,
                        tax: taxTotal,
                        total: amountTotal + taxTotal
                    }
                )
                this.salaryInfo = salaryInfo
            },
            parseOtherInfo: function () {
                var otherInfo = []
                otherInfo.push(
                    {
                        type: '服务费',
                        amount: this.accountingInfo.serviceFeeAmount,
                        adjustment: '',
                        total: this.accountingInfo.serviceFeeAmount
                    }
                )
                otherInfo.push(
                    {
                        type: '合计',
                        amount: this.accountingInfo.serviceFeeAmount,
                        adjustment: '0.00',
                        total: this.accountingInfo.serviceFeeAmount
                    }
                )
                this.otherInfo = otherInfo
            },
            //第三步-服务费明细
            getSetviceFeeData: function () {
                var params = [
                    {property: 'seqNo', value: this.seqNo}
                ]
                this.$refs['serviceFeeTable'].fetch({
                    query: params,
                    method: 'post',
                    url: '/api/salary/listServiceFeeDetail'
                })
            },
            //保存薪酬账单
            saveSalaryAccounting: function () {
                this.saveLoading = true
                this.$http({
                    url: '/api/salary/saveSalaryBill',
                    method: 'post',
                    data: {
                        ffMonth: this.$moment(this.setData.yearDate).format("YYYYMM"),
                        optrCompId: this.setData.obligorId,
                        optrCompName: this.setData.obligorName,
                        recCode: this.accountingInfo.recCode,
                        seqNo: this.seqNo,
                    }
                }).then(({data}) => {
                    this.saveLoading = false
                    this.$message.success('保存成功，请进入账单列表，提交账单')
                    this.$router.push('/billManage/index')
                }).catch(({data}) => {
                    this.saveLoading = false
                })
            }
        }
    }
</script>
<style lang="less" scoped>
  @import '../../../assets/css/salaryAccounting/index.less';
  .step2{
    .detail-type{
      border-top: none;
    }
    /deep/.pal-pagination{
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
    /deep/.pal-table thead th{
      border-top: none;
    }
  }
</style>
