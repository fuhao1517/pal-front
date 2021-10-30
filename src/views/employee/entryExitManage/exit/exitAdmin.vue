<template>
  <div class="spl-container">
    <breadcrumb :data="pathData"></breadcrumb>
    <splTab :tabs="tabs" v-model="active" @changeTab="changeTab" :key="refreshTabs">
      <template slot="btns">
        <div v-show="active==0">
          <el-button type="primary" size="small" class="ml-10" @click.stop="handleLeave()">办理离职</el-button>
          <el-button type="primary" size="small" class="ml-10" @click="doSignFile">发起离职文件签署</el-button>
          <el-button type="primary" size="small" class="ml-10" @click.stop="leaveDialogFun(1)">确认离职</el-button>
          <el-button type="primary" size="small" class="ml-10" @click.stop="leaveDialogFun(2)">放弃离职</el-button>
        </div>
      </template>
    </splTab>

    <div class="search-row">
      <el-input placeholder="请输入证件号码\姓名\手机号码查询" class="ml-20 w-240" v-model="searchForm.searchWord"></el-input>
      <el-button type="primary" class="ml-20" @click="getTableData(3)">查询</el-button>
      <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="show.searchFormPopover">
        <div class="show-select-form">
          <el-form ref="searchForm" :model="searchForm" class="select-form">
            <el-row class="select-form-el-row" type="flex" justify="space-around">
              <el-col :span="6" class="select-form-el-col">
                <el-form-item label="入职主体:">
                  <el-select v-model="searchForm.optrCompName" @change="getSelectLabel($event)" filterable class="w-300" placeholder="请选择入职主体">
                    <el-option v-for="item in entrySubjectList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="select-form-el-col">
                <el-form-item label="是否已发起签署:">
                  <el-checkbox-group class="inlineBlock" v-model="searchForm.signFlag">
                    <el-checkbox class="mr-20" label="1">已发起</el-checkbox>
                    <el-checkbox class="mr-20" label="0">未发起</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="select-form-el-col">
                <el-form-item label="证件号码:">
                  <el-input type="textarea" class="w-200" v-model="idCards" placeholder="一行只可输入一个身份证"></el-input>
                  <span class="text-red ml-10">已输入{{searchForm.idCardNum}}个</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="select-form-el-col">
                <el-button size="small" type="primary" class="s-btn" @click="getTableData(3)" icon="el-icon-search">查询</el-button>
                <el-button size="small" icon="el-icon-refresh-left" @click="resetSearchForm" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-button slot="reference" icon="ic-filter-blue" class="ml-10">筛选</el-button>
      </el-popover>
    </div>

    <dTable @fetch="getTableData(1)" ref="tableData" @selection-change="getSelectRow" :tableHeight="tableHeight" :paging="true" :showSelection="true" :showIndex="true">
      <el-table-column prop="name" label="姓名" min-width="180" :show-overflow-tooltip="true"/>
      <el-table-column prop="idCard" label="证件号码" width="140" :show-overflow-tooltip="true"/>
      <el-table-column prop="telephone" label="手机号码" width="200" :show-overflow-tooltip="true"/>
      <el-table-column prop="entryStatusName" label="员工状态" width="100" :show-overflow-tooltip="true"/>
      <el-table-column prop="optrCompName" label="签约主体" width="150" :show-overflow-tooltip="true"/>
      <el-table-column prop="signFlag" label="是否已发起离职签署" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.signFlag==0">未发起</span>
          <span v-else class="text-blue text-pointer" @click="viewSignFile(scope.row)">已发起</span>
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="创建人" width="80" header-align="center" :show-overflow-tooltip="true"/>
      <el-table-column prop="createTime" label="创建时间" width="150" header-align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:MM'):'' }}</p>
        </template>
      </el-table-column>
    </dTable>
    <el-button style="position: relative; bottom: 45px;" size="small" type="primary" icon="icon ic-export-white" class="btn--border-white ml-10" @click="exportSalaryData">导出数据
    </el-button>
    <!-- 办理离职 -->
    <el-dialog title="选择员工" :show-close="false" :visible.sync="show.handleLeaveDialog" width="600px" class="spl-dialog-msg">
      <el-row>
        <el-col :span="12">
          <div class="search-s">
            <i class="magnifying el-icon-search "></i>
            <el-input placeholder="搜索姓名/证件号/手机号" v-model="searchKeyWord" @input="searchEmpData"></el-input>
          </div>
          <ul class="infinite-list">
            <el-checkbox-group v-model="checkedGroupList">
              <li v-for="(item,index) in allEmpList" :key="index" class="list-item">
                <el-checkbox :label="item.name" @change="checkboxChange($event,index)">
                  <div v-html="item.name"></div>
                  <div v-html="item.idCard"></div>
                  <div v-html="item.telephone"></div>
                </el-checkbox>
              </li>
            </el-checkbox-group>
          </ul>
        </el-col>
        <el-col :span="12">
          <p class="selected">已选择的员工：</p>
          <div class="infinite-list">
            <p class="list-item list-item2" v-html="checkedEmpNames.toString()"></p>
          </div>
        </el-col>
      </el-row>
      <div class="footer-button">
        <el-button size="small" class="mr-60" @click="show.handleLeaveDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleLeaveSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 确认离职、放弃离职 -->
    <el-dialog :visible.sync="show.leaveDialog" width="600px" class="spl-dialog-msg">
      <template slot="title">
        <p class="mb-5">
          <span v-if="leaveDialogType==1" class="font-18" style="line-height: 24px;">确认离职</span>
          <span v-else class="font-18" style="line-height: 24px;">放弃离职</span>
        </p>
      </template>
      <div class="mt-30 mb-30 pl-40">
        <i class="el-icon-warning text-orange fl mr-10" style="font-size: 24px"></i>
        <span v-if="leaveDialogType==1">
          <p v-if="signFlag!=0">是否确认离职，确认后员工状态为已离职</p>
          <p v-else>未发起离职文件签署，是否确认离职？</p>
        </span>
        <span v-else>是否放弃员工的离职, 放弃后员工恢复为在职状态</span>
      </div>
      <div slot="footer" class="dialog-footer pt-15">
        <el-button class="mr-60" @click="show.leaveDialog = false">取 消</el-button>
        <el-button type="primary" @click="leaveDialogSubmit">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 确认离职、放弃离职 -->

    <!-- 签署状态 -->
    <el-drawer :visible.sync="operationDrawer" :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <operationDrawer :operationData="operationData" :operationInfo="operationInfo"/>
    </el-drawer>
    <!-- 签署状态 -->

  </div>
</template>
<script>
    import dTable from '../../../../components/common/table'
    import splTab from '../../../../components/common/spl-tab'
    import operationDrawer from '../../../../views/employee/entryManage/operationDrawer'

    export default {
        components: {splTab, dTable, operationDrawer},
        data() {
            return {
                pathData: [{name: '人员管理'}, {name: '离职管理'}],
                tabs: ['待离职(0)', '已离职(0)'],
                active: 0,
                idCards: '', // 证件号码
                searchForm: {
                    searchWord: '',
                    optrCompName: '',
                    signFlag: [],
                    idCards: [],
                    idCardNum: 0
                },
                urls: {
                    giveUpEntryUrl: '/api/entryresign/emp/giveUpEntry', // 放弃离职
                    confirmEntryUrl: '/api/entryresign/emp/confirmEntry', // 确认入职
                    allEmpUrl: '/api/entryresign/emp/allEmp', // 办理离职-人员列表
                    empListUrl: '/api/entryresign/emp/empList', // 待离职、已离职 列表
                    entrySubjectListUrl: '/api/entryresign/entrySubjectList', // 入职主体
                    exportEmpList: '/api/entryresign/emp/exportEmpList', // 导出人员列表
                    empListCount: '/api/entryresign/emp/empListCount', // 人员数量
                    doLeave: '/api/entryresign/emp/doLeave' // 办理离职
                },
                show: {
                    searchFormPopover: false, // 搜索层
                    leaveDialog: false, // 确认离职，放弃离职
                    handleLeaveDialog: false// 办理离职
                },
                entrySubjectList: [], // 入职主体
                selectRows: [], // 选择行
                leaveDialogType: '', // 1：确认离职，2：放弃离职
                searchKeyWord: '', // 办理离职-搜索关键字
                checkedEmpIds: [], // 办理离职-已选择的员工Ids
                checkedEmpNames: [], // 办理离职-已选择的员工名称
                allEmpList: [], // 办理离职-人员列表
                checkedGroupList: [], // 办理离职-人员选择
                operationDrawer: false,//待离职列表-签署已发起，查看文件签署状态
                operationData: [{}],//待离职列表-签署已发起，文件签署状态
                operationInfo: {},//待离职列表-文件签署信息
                signFlag: '',//是否已发起离职签署
                searchActive: '',//点击过查询按钮的active
                refreshTabs: new Date().getTime()
            }
        },
        computed: {
            tableHeight: function () {
                return this.$global.bodyHeight - 320 + 'px'
            }
        },
        created() {
            let that = this
            this.$nextTick(() => {
                that.getTableData(1)
                that.getEntrySubjectData()
                that.getEmpListCount()
            })
        },
        watch: {
            idCards: {
                handler: function (newVal, oldVal) {
                    var idCardArray = newVal.split('\n')
                    var idCards = []
                    for (var i = 0; i < idCardArray.length; i++) {
                        var idCard = idCardArray[i].replace(/(^\s*)|(\s*$)/g, '')
                        if (idCard) {
                            idCards.push(idCard)
                        }
                    }
                    this.searchForm.idCards = idCards
                    this.searchForm.idCardNum = idCards.length
                },
                immediate: false
            }
        },
        mounted() {

        },
        methods: {
            // 获取入职主体
            getEntrySubjectData() {
                var that = this
                this.$http({
                    url: this.urls.entrySubjectListUrl,
                    method: 'get',
                    params: {}
                }).then(({data}) => {
                    that.entrySubjectList = data.data[0]
                    if (that.entrySubjectList.length == 1) {
                        that.searchForm.optrCompName = that.entrySubjectList[0].name
                    }
                })
            },
            getEmpListCount() {
                this.$http({
                    url: this.urls.empListCount,
                    method: 'post',
                    params: {}
                }).then(({data}) => {
                    var empCount = data.data[0];
                    for (const i in empCount) {
                        if (empCount[i].entryStatus == '3') {
                            this.tabs[0] = '待离职(' + empCount[i].count + ')';
                        } else if (empCount[i].entryStatus == '4') {
                            this.tabs[1] = '已离职(' + empCount[i].count + ')';
                        }
                        this.refreshTabs = new Date().getTime()
                    }
                })
            },
            // 重置搜索
            resetSearchForm() {
                this.idCards = ''
                this.searchForm.searchWord = ''
                this.searchForm.optrCompName = ''
                this.searchForm.signFlag = []
                this.searchForm.idCards = []
                this.searchForm.idCardNum = 0
            },
            // 获取 待离职、已离职 列表
            getTableData(type) {
                let that = this
                if (type == 3) {
                    this.searchActive = this.active
                }
                let params = []
                if (type == 1 || type == 3 || this.searchActive == this.active) {
                    params = [
                        {property: 'queryCond', value: this.searchForm.searchWord},
                        {property: 'optrCompName', value: this.searchForm.optrCompName},
                        {property: 'signFlag', value: this.searchForm.signFlag},
                        {property: 'idCards', value: this.searchForm.idCards},
                        {property: 'entryStatus', value: this.active == 0 ? [3] : [4]},
                        {property: 'useType', value: 2}
                    ]
                } else {
                    params = [
                        {property: 'entryStatus', value: this.active == 0 ? [3] : [4]},
                        {property: 'useType', value: 2}
                    ]
                }
                this.$refs.tableData.fetch({
                    url: this.urls.empListUrl,
                    method: 'post',
                    query: params,
                    callback: function (data) {
                        if (that.active == 0) {
                            that.tabs[0] = '待离职(' + data.records + ')';
                        } else {
                            that.tabs[1] = '已离职(' + data.records + ')';
                        }
                        that.refreshTabs = new Date().getTime()
                    }
                })
                this.show.searchFormPopover = false
            },
            // 办理离职-人员选择改变事件
            checkboxChange(status, index) {
                var obj = this.allEmpList[index]
                var exit = this.checkedEmpIds.indexOf(obj.id)
                if (status) {
                    if (exit == -1) {
                        this.checkedEmpNames.push(obj.name)
                        this.checkedEmpIds.push(obj.id)
                    }
                } else {
                    this.checkedEmpNames.splice(exit, 1)
                    this.checkedEmpIds.splice(exit, 1)
                }
            },
            // 搜索办理离职-人员列表
            searchEmpData() {
                this.$http({
                    method: 'post',
                    url: this.urls.allEmpUrl + '?searchKey=' + this.searchKeyWord
                }).then(({data}) => {
                    this.allEmpList = data.data[0]
                })
            },
            // 办理离职
            handleLeave() {
                this.show.handleLeaveDialog = true
                this.checkedEmpIds = []
                this.checkedEmpNames = []
                this.checkedGroupList = []
                this.searchKeyWord = ''
                this.$http({
                    url: this.urls.allEmpUrl,
                    method: 'post'
                }).then(({data}) => {
                    this.allEmpList = data.data[0]
                })
            },
            // 办理离职-提交
            handleLeaveSubmit() {
                if (this.checkedEmpIds.length <= 0) {
                    this.$message.warning('请选择员工')
                    return
                }
                this.$http({
                    url: this.urls.doLeave,
                    method: 'post',
                    data: {
                        ids: this.checkedEmpIds
                    }
                }).then(({data}) => {
                    if (data.code === '10') {
                        this.$message.success('提交成功!')
                        this.getTableData(1)
                        this.getEmpListCount()
                        this.selectRows = []
                        this.show.handleLeaveDialog = false
                    } else {
                        this.$message.error(respData.msg)
                    }
                })
            },
            // 选择行
            getSelectRow(rows) {
                this.selectRows = rows
                this.signFlag = ''
                for (const i in rows) {
                    if (rows[i].signFlag != '0') {
                        this.signFlag = rows[i].signFlag
                    }
                }
            },
            // 确认离职、放弃离职
            leaveDialogFun(type) {
                var selectRows = this.selectRows
                if (selectRows == null || selectRows.length <= 0) {
                    this.$message.warning('请选择需要操作的数据')
                    return
                }
                this.leaveDialogType = type
                this.show.leaveDialog = true
            },
            // 确认离职、放弃离职-提交
            leaveDialogSubmit() {
                var that = this
                var url = that.leaveDialogType == 1 ? that.urls.confirmEntryUrl : that.urls.giveUpEntryUrl
                var ids = ''
                for (const i in that.selectRows) {
                    ids = that.selectRows[i].id + ',' + ids
                }
                this.$http({
                    url: url + '?id=' + ids + '&type=2',
                    method: 'post'
                }).then(({data}) => {
                    if (data.code === '10') {
                        var respData = data.data[0]
                        if (respData.code == 200) {
                            that.$message.success('提交成功!')
                            that.getTableData(1)
                            that.getEmpListCount()
                            that.selectRows = []
                            that.show.leaveDialog = false
                        } else {
                            that.$message.error(respData.msg)
                        }
                    } else {
                        that.$message.error('提交失败')
                    }
                })
                that.show.leaveDialog = false
            },
            //导出人员列表
            exportSalaryData() {
                var params = {}
                params.queryCond = this.searchForm.searchWord
                params.optrCompName = this.searchForm.optrCompName
                params.signFlag = this.searchForm.signFlag
                params.idCards = this.searchForm.idCards
                params.entryStatus = [this.active == 0 ? '3' : '4']
                params.ids = this.$refs['tableData'].getSelectionsArr('id')
                this.$downloadFile(
                    '/api/entryresign/emp/exportEmpList',
                    'post',
                    params,
                    this.$global.EXCEL
                )
            },
            // 切换待离职、已离职 tab
            changeTab(obj) {
                this.getTableData(2)
            },
            // 发起签署
            doSignFile() {
                var selectRows = this.selectRows
                if (selectRows == null || selectRows.length <= 0) {
                    this.$message.warning('请选择需要发起离职文件的人员')
                    return
                }
                let effectUuids = this.$refs.tableData.getSelectionsArr('workUuid')
                this.$http({
                    url: '/api/entryresign/file/preLaunchSign',
                    method: 'post',
                    data: {
                        effectUuids: effectUuids,
                        type: '3' // 1入职2离职(这个页面发起的是离职)
                    }
                }).then(({data}) => {
                    this.$router.push('/fileSign/startSign?batchNum=' + data.data[0] + '&type=2')
                })
            },
            /* 离职管理-查看签署文件 */
            viewSignFile(row) {
              if(this.$global.isAcrobatPluginInstall()){
                this.operationInfo = row
                this.$http({
                    url: '/api/entryresign/file/viewSignFile',
                    method: 'post',
                    data: this.$qs.stringify({
                        id: row.id,
                        type: 2
                    })
                }).then(({data}) => {
                    this.operationData = data.data
                    this.operationDrawer = true
                })
              }else{
                alert("对不起,您还没有安装PDF阅读器软件呢,为了方便预览PDF文档,请选择安装！");
                location = "https://seebonpubfile.oss-cn-shenzhen.aliyuncs.com/software/AdbeRdr930_zh_CN.exe";
              }
            }
        }
    }
</script>
<style lang="less" scoped>
  .tag {
    display: inline-block;
    padding: 0 15px;
    height: @inputHeight;
    line-height: @inputHeight;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(206, 206, 206, 1);
    border-radius: 0px 2px 2px 0px;
    margin-right: 10px;
    cursor: pointer;
  }

  .tag:hover, .tag.active {
    background-color: #dddddd;
  }

  .selected {
    width: 254px;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
  }

  /deep/ .el-input__inner {
    text-indent: 2em;
  }

  /deep/ .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 25px;
  }

  /deep/ .el-dialog__footer {
    padding-bottom: 25px;
  }

  .dialog-footer {
    margin-bottom: 0px;
  }

  .footer-button {
    text-align: center;
    margin-top: 25px;
  }

  .search-s {
    width: 254px;
    position: relative;
  }

  .magnifying {
    position: absolute;
    top: 9px;
    left: 10px;
    z-index: 10;
  }

  .infinite-list, .right-box {
    width: 254px;
    height: 272px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 2px;
    overflow: scroll;
    padding: 0px;
    margin: 8px 0 0 0;
  }

  .list-item {
    margin: 10px 0 10px 10px;
  }

  .list-item2 {
    margin-left: 35px;
  }

  .text-pointer:hover {
    cursor: pointer;
  }
</style>
