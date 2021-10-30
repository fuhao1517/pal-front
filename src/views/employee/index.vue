<template>
  <div class="spl-container content">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="emp-container">
      <!-- 搜索框 -->
      <div class="search-row mt-20">
        <el-row :gutter="20">
          <el-col :span="8">
            <span class="ml-10">关键字：</span>
            <el-input placeholder="搜索姓名/证照号码" class="w-200" v-model="searchWord"></el-input>
          </el-col>
          <el-col :span="8">
            <span>在职状态：</span>
            <el-select v-model="jobStatus" placeholder="请选择" class="mr-20 w-200">
              <el-option label="全部" value=""></el-option>
              <el-option label="在职" value="0"></el-option>
              <el-option label="离职" value="1"></el-option>
            </el-select>
            <el-button type="primary" @click="getTableData">查询</el-button>
            <el-popover placement="bottom" width="100%" popper-class="seach-popover seach-popover2" :visible-arrow="false" trigger="click" v-model="showSelectForm">
              <div class="show-select-form">
                <el-form ref="selectForm" :model="selectForm" class="select-form">
                  <el-row class="select-form-el-row" type="flex" justify="space-between">
                    <el-col :span="5" class="select-form-el-col">
                      <el-form-item label="性别:" class="ml-20">
                        <el-select v-model="selectForm.sex" placeholder="全部" class="w-200">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="男" value="1"></el-option>
                          <el-option label="女" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="select-form-el-col" style="margin-left:110px;">
                      <el-form-item label="户口性质:">
                        <el-select v-model="selectForm.residenceType" placeholder="全部" class="w-200">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="农村" value="农村"></el-option>
                          <el-option label="城镇" value="城镇"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="select-form-el-col">
                      <el-form-item label="社保服务状态:">
                        <el-select v-model="selectForm.socialService" placeholder="请选择" class="w-200">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="服务中" value="1"></el-option>
                          <el-option label="无服务" value="2"></el-option>
                          <el-option label="终止服务" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3" class="select-form-el-col text-right pr-20">
                      <el-button size="small" type="primary" class="s-btn" @click="getTableData2" icon="el-icon-search">查询</el-button>
                      <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                    </el-col>
                  </el-row>
                  <el-row class="select-form-el-row" type="flex" justify="">
                    <el-col :span="7" class="select-form-el-col">
                      <el-form-item label="证件号码:" class="ml-5">
                        <el-input type="textarea" class="w-200 textarea" v-model="selectForm.empIdCards" placeholder="一行只可输入一个身份证"></el-input>
                        <span class="text-red ml-10">已输入{{selectForm.searchIdCardsLength}}个</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" class="select-form-el-col" style="margin-left:47px;">
                      <el-form-item label="商保服务状态:">
                        <el-select v-model="selectForm.comminsurService" placeholder="请选择" class="w-200">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="服务中" value="1"></el-option>
                          <el-option label="无服务" value="2"></el-option>
                          <el-option label="终止服务" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7" class="select-form-el-col" style="margin-left:44px;">
                      <el-form-item label="公积金服务状态:">
                        <el-select v-model="selectForm.accfundService" placeholder="请选择" class="w-200">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="服务中" value="1"></el-option>
                          <el-option label="无服务" value="2"></el-option>
                          <el-option label="终止服务" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <el-button slot="reference" icon="ic-filter-blue" class="ml-10">筛选</el-button>
            </el-popover>
          </el-col>
          <el-col :span="8">
            <div class="search-row-btn">
              <!-- <el-button size="small" @click="refreshTable">
                <i class="el-icon-refresh" style="color: black;"></i>刷新
              </el-button> -->
              <router-link to="/employee/empAdd">
                <el-button size="small" type="primary" class="opt-btn" icon="el-icon-plus">添加员工</el-button>
              </router-link>
              <router-link to="/employee/toLead">
                <el-button size="small" icon="icon ic-import-blue" class="btn--border-blue ml-15">导入</el-button>
              </router-link>
              <el-button size="small" icon="ic-export-blue" @click="exportTableData" class="btn--border-blue ml-15">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 批量操作 -->
      <div class="batch—rocess-header" v-show="batchProcess">
        <div class="batch—rocess-header-el-col clearfix">
          <label class="mr-15"> 已选择 <span v-text="selectEmps.length" style="color:#409EFF;"></span>项</label>
          <span style="color:#C0C4CC;">|</span>
          <el-button type="text" class="opt-btn" @click="exportSelectData">
            <i class="ic-export-blue text-blue" @click="exportSelectData"></i>导出
          </el-button>
          <span style="color:#C0C4CC;">|</span>
          <el-button type="text" class="opt-btn mr-10 ml-10" style="color: #F56C6C;" @click="openBatchDelDialog">
            <i class="el-icon-delete mr-5"></i>批量删除
          </el-button>
          <span style="color:#C0C4CC;">|</span>
          <img class="mr-20 f-cursor fr" style="margin-top: 18px;" src="@/assets/images/icons/ic-account-type13.png" alt @click="showbatchFun" />
        </div>

      </div>
      <!-- 表格 -->
      <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="true" :showSelection="batchProcess" @selection-change="empSelectChange" rowKey="rowId" :reserve-selection="true">
        <el-table-column prop="customerName" label="公司" width="180" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="员工姓名" width="140" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewEmp(scope.row)">{{
              scope.row.name
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sex" label="性别" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.sex == 1 ? '男' : '女' }}
              <i :class="scope.row.sex == 1 ? 'el-icon-male text-blue' : 'el-icon-female text-red'"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="residenceType" label="户口性质" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="nation" label="民族" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="entryDate" label="入职日期" :formatter="formatDateFun" min-width="150" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="leaveDate" label="离职日期" :formatter="formatDateFun" min-width="150" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="openDelDialog(scope.row)">
              <span style="color:red">删除</span>
            </el-button>
          </template>
        </el-table-column>
        <template slot="pagination-btns">
          <el-button size="small" @click="showbatchFun" class="btn--border-blue">批量操作</el-button>
        </template>
      </dTable>
      <!-- 单个删除弹窗 -->
      <el-dialog title="删除警告" :visible.sync="delDialogVisible" width="600px" :show-close="false" style="border-radius:5px;">
        <p class="mb-10" style="display: flex; justify-content: flex-start; align-items: center;">
          <img class="mr-20 ml-30" src="@/assets/images/icons/ic-account-type11.png">
          <span style="font-size:18px;">删除该内容</span>
        </p>
        <p class="ml-80">确定要删除该条信息吗？</p>
        <div slot="footer" class="dialog-footer">
          <el-button class="mr-60" @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="delEmp">确 认</el-button>
        </div>
      </el-dialog>
      <!-- 批量删除弹窗 -->
      <el-dialog title="删除警告" :visible.sync="batchDelDialogVisible" width="600px" :show-close="false" style="border-radius:5px;">
        <p class="mb-10" style="display: flex; justify-content: flex-start; align-items: center;">
          <img class="mr-20 ml-30" src="@/assets/images/icons/ic-account-type11.png">
          <span style="font-size:18px;">批量删除</span>
        </p>
        <p class="ml-80">确定要删除这 <span v-text="selectEmps.length" style="color:#409EFF;"></span> 条信息吗？</p>
        <div slot="footer" class="dialog-footer">
          <el-button class="mr-60" @click="batchDelDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="delEmps">确 认</el-button>
        </div>
      </el-dialog>
      <!-- 删除失败弹窗 -->
      <el-dialog title="删除警告" :visible.sync="delFallDialogVisible" width="600px" :show-close="false" style="border-radius:5px;">
        <p class="mb-10" style="display: flex; justify-content: flex-start; align-items: center;">
          <img class="mr-20 ml-30" src="@/assets/images/icons/ic-account-type28.png">
          <span style="font-size:18px;" v-text="this.empRow.name + '无法删除!'"></span>
        </p>
        <p class="ml-80" v-text="'该人员' + this.delFallMsg +'，无法删除！'"></p>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="delFallDialogVisible = false">确 认</el-button>
        </div>
      </el-dialog>
      <!-- 批量删除失败弹窗 -->
      <el-dialog title="删除警告" :visible.sync="batchDelFallDialogVisible" width="600px" :show-close="false" style="border-radius:5px;">
        <p style="display: flex; justify-content: flex-start; align-items: center;">
          <img class="mr-20 ml-30" src="@/assets/images/icons/ic-account-type28.png">
          <span style="font-size:18px;">删除失败！</span>
        </p>
        <div class="ml-80">
          <span class="mr-30" style="font-size:14px; display: inline-block;" v-text="'该批数据中有' + this.failNum + '名人员已参保或已产生费用，无法删除!'"></span>
          <el-popover placement="right" width="600px" height="300px; position:relative;" trigger="click">
            <dTable ref="delFallTable" :tableHeight="'300px'" style="width:600px;background:#fff;">
              <el-table-column width="150" property="name" label="员工姓名"></el-table-column>
              <el-table-column width="200" property="idCard" label="证件号码"></el-table-column>
              <el-table-column width="100" property="sex" label="性别" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>
                    {{ scope.row.sex == 1 ? '男' : '女' }}
                    <i :class="scope.row.sex == 1 ? 'el-icon-male text-blue' : 'el-icon-female text-red'"></i>
                  </p>
                </template>
              </el-table-column>
              <el-table-column width="150" property="residenceType" label="户口性质"></el-table-column>
              <el-table-column width="150" property="entryDate" label="入职日期" :formatter="formatDateFun"></el-table-column>
            </dtable>
            <el-button type="text" slot="reference" @click="getDelFallTableData">查看详情</el-button>
          </el-popover>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="batchDelFallConfirm">确 认</el-button>
        </div>
      </el-dialog>
      <!-- 查看员工 -->
      <el-drawer :modal="false" :visible.sync="drawer" :wrapperClosable="false" custom-class="spl-detail-drawer" :withHeader="false" :show-close="false">
        <EmpView :message="employeeId" :rowId="rowId" @handleClose='handleClose' />
      </el-drawer>
    </div>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
import EmpView from './empView'
export default {
  components: { dTable, EmpView },
  data () {
    return {
      drawer: false,
      employeeId: '',
      rowId: '',
      delTableData: [],
      // 导航
      pathData: [{ name: '人员管理' }, { name: '员工列表' }],
      selectForm: {
        sex: '',
        residenceType: '',
        empIdCards: '',
        setEmpIdCards: [],
        searchIdCardsLength: 0,
        socialService: '',
        comminsurService: '',
        accfundService: ''
      },
      batchProcess: false,
      searchWord: '',
      jobStatus: '',
      filterText: '',
      empIds: [],
      empId: '',
      selectEmps: [],
      selectionNum: 0,
      showSelectForm: false,
      delDialogVisible: false,
      batchDelDialogVisible: false,
      delFallDialogVisible: false,
      batchDelFallDialogVisible: false,
      empRow: '',
      delFallMsg: '',
      failNum: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.getTableData()
    })
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 270 + 'px'
    }
  },
  watch: {
    'selectForm.empIdCards' (newValue, oldValue) {
      var obj = this.$global.getIdCardRow(this.selectForm.empIdCards)
      this.selectForm.searchIdCardsLength = obj.num
      this.selectForm.setEmpIdCards = obj.value
    }
  },
  methods: {
    handleClose () {
      this.drawer = false
    },
    formatDateFun (row, column, cellValue, index) {
      return cellValue == null ? '-' : this.$moment(cellValue).format('YYYY-MM-DD')
    },
    refreshTable (params = []) {
      this.searchWord = ''
      this.jobStatus = ''
      this.getTableData()
    },
    getTableData (params = []) {
      params = [{ property: 'nameOrIdcard', value: this.searchWord },
        { property: 'jobStatus', value: this.jobStatus },
        { property: 'customerSiteOne', value: String(this.$store.state.userData.custId) }
      ]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/listEmployee'
      })
    },
    getDelFallTableData (params = []) {
      params = [{ property: 'employeeIds', value: this.empIds },
        { property: 'customerSiteOne', value: String(this.$store.state.userData.custId) }
      ]
      this.$refs.delFallTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/listEmployee'
      })
    },
    // 显示批量操作
    showbatchFun () {
      this.$refs.empTable.clearSelection()
      this.batchProcess = !this.batchProcess
    },
    // 展开筛选框的搜索
    getTableData2 (params = []) {
      params = [
        { property: 'nameOrIdcard', value: this.searchWord },
        { property: 'jobStatus', value: this.jobStatus },
        { property: 'sex', value: this.selectForm.sex },
        { property: 'residenceType', value: this.selectForm.residenceType },
        { property: 'idCards', value: this.selectForm.setEmpIdCards },
        { property: 'customerSiteOne', value: String(this.$store.state.userData.custId) },
        { property: 'socialService', value: this.selectForm.socialService },
        { property: 'comminsurService', value: this.selectForm.comminsurService },
        { property: 'accfundService', value: this.selectForm.accfundService }
      ]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/listEmployee'
      })
      this.showSelectForm = false
    },
    // 单个删除
    openDelDialog (row) {
      this.delDialogVisible = true
      this.empRow = row
    },
    // 批量删除
    openBatchDelDialog () {
      var employeeIds = this.$refs.empTable.getSelectionsArr('employeeId')
      if (employeeIds.length === 0) {
        this.$message.error('请先勾选数据！')
      } else {
        this.batchDelDialogVisible = true
      }
    },
    // 单个删除
    delEmp () {
      var employeeIds = []
      employeeIds.push(this.empRow.employeeId)
      this.$http({
        url: '/api/employee',
        method: 'delete',
        data: {
          employeeIds
        }
      }).then(({ data }) => {
        if (data.code === '10') {
          if (data.data[0].failInfo) {
            this.delFallMsg = data.data[0].failInfo
            this.delFallDialogVisible = true
          } else {
            this.$message.success('删除成功！')
            this.getTableData()
          }
        } else {
          this.delFallDialogVisible = true
          this.delFallMsg = this.$global.errorMsg
        }
      })
      this.delDialogVisible = false
    },
    // 批量删除
    delEmps (empIds) {
      var employeeIds = this.$refs.empTable.getSelectionsArr('employeeId')
      this.$http({
        url: '/api/employee',
        method: 'delete',
        data: {
          employeeIds
        }
      }).then(({ data }) => {
        if (data.code === '10') {
          if (data.data[0].failEmployeeIds.length > 0) {
            this.failNum = this.selectEmps.length - data.data[0].successNum
            this.successNum = data.data[0].successNum
            this.empIds = data.data[0].failEmployeeIds
            this.batchDelFallDialogVisible = true
          } else {
            this.$message.success('删除成功！')
            this.getTableData()
          }
        } else {
          this.delFallMsg = this.$global.errorMsg
        }
      })
      this.batchDelDialogVisible = false
    },
    batchDelFallConfirm () {
      this.batchDelFallDialogVisible = false
      this.getTableData()
    },
    // 重置搜索框
    resetSelectForm () {
      this.selectForm.sex = ''
      this.selectForm.residenceType = ''
      this.selectForm.empIdCards = ''
      this.selectForm.setEmpIdCards = []
      this.selectForm.searchIdCardsLength = 0
      this.selectForm.socialService = ''
      this.selectForm.comminsurService = ''
      this.selectForm.accfundService = ''
      this.getTableData2()
    },
    // 查看员工
    viewEmp (row) {
      this.employeeId = row.employeeId
      this.drawer = true
      this.rowId = row.rowId
    },
    // 导出勾选数据
    exportSelectData (item) {
      var selections = this.$refs.empTable.getSelectionsArr('employeeId')
      if (selections.length === 0) {
        this.$message.error('请先勾选数据！')
      } else {
        this.$downloadFile(
          '/api/employee/exportEmployee',
          'post',
          {
            employeeIds: selections,
            customerSiteOne: String(this.$store.state.userData.custId)
          },
          this.$global.EXCEL
        )
      }
    },
    // 导出筛选据
    exportTableData (item) {
      this.$downloadFile(
        '/api/employee/exportEmployee',
        'post',
        { nameOrIdcard: this.searchWord,
          residenceType: this.selectForm.residenceType,
          sex: this.selectForm.sex,
          idCards: this.selectForm.setEmpIdCards,
          customerSiteOne: String(this.$store.state.userData.custId),
          socialService: this.selectForm.socialService,
          comminsurService: this.selectForm.comminsurService,
          accfundService: this.selectForm.accfundService
        },
        this.$global.EXCEL
      )
    },
    empSelectChange () {
      this.selectEmps = this.$refs.empTable.selections
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/.el-textarea__inner{
    height:70px;
    resize:none;
  }
.content {
  .emp-container {
    .show-select-form {
      .select-form {
        height: 110px;
        display: flex;
        justify-content: space-between;
        border: 1px solid rgb(17, 13, 13);
        box-shadow: 0px 0px 5px 0px rgba(48, 49, 51, 0.3);
        .select-form-el-row {
          width: 50%;
          display: flex;
          align-items: center;
          margin-left: 59px;

          .select-form-el-col {
            width: 50%;
            margin-top: 20px;
            display: flex;
            justify-content: start;

            .el-form-item {
              display: flex;
              align-items: center;
            }
          }
        }

        .select-form-el-row:last-child {
          .select-form-el-col:first-child {
            .el-form-item {
              display: flex;
              align-items: flex-start;

              /deep/ .el-textarea__inner {
                width: 199px;
                height: 70px;
                padding: 0;
                resize: none;
              }
            }
          }

          .select-form-el-col:last-child {
            display: flex;
            justify-content: flex-end;
            margin: 0px 40px 0 0;

            .el-button:last-child {
              color: #409eff;
              border-color: #409eff;
            }
          }
        }
      }
    }

    .batch—rocess-header {
      height: 50px;
      line-height: 50px;
      .batch—rocess-header-el-col {
        background: #dddddd;
        padding-left: 40px;
        font-weight: bold;
        color: #303133;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
