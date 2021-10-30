<template>
  <div class="content spl-container">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="search-header clearfix pt-20">
      <div class="header-top clearfix">
        <div class="filter-date mb-20 fl">
          <span class="ml-30">费用年月：</span>
          <el-date-picker v-model="search.costMonth" type="month" class="date-editor2" value-format="yyyy-MM"></el-date-picker>
        </div>

        <div class="add-data fr">
          <el-input placeholder="请输入证件号码\员工姓名查询" class="w-220" v-model="search.searchWord"></el-input>
          <el-button size="small" type="primary" class="search-btn ml-10" @click="handleSearch">查询</el-button>
          <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
            <div class="show-select-form">
              <el-form ref="search" :model="search" class="select-form">
                <el-row class="select-form-el-row" type="flex" justify="space-around">
                  <el-col :span="10" class="select-form-el-col">
                    <el-form-item label="保险公司:" class="ml-20">
                      <el-select v-model="search.supplier" placeholder="全部" @change="getProductList">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" class="select-form-el-col">
                    <el-form-item label="方案代码:" class="ml-20">
                      <el-select v-model="search.product" placeholder="全部">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in productList" :key="item.id" :label="item.productCode" :value="item.productCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" class="select-form-el-col">
                    <el-form-item label="证件号码:">
                      <el-input type="textarea" class="w-200" v-model="search.empIdCards" placeholder="一行只可输入一个身份证"></el-input>
                      <span class="text-red ml-10">已输入{{search.searchIdCardsLength}}个</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" class="select-form-el-col">
                    <el-button size="small" type="primary" class="s-btn" @click="handleSearch" icon="el-icon-search">查询</el-button>
                    <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-button size="small" slot="reference" icon="ic-filter-blue" class="ml-10">筛选</el-button>
          </el-popover>
          <el-dropdown>
            <el-button class="ml-10" size="small" type="primary" icon="el-icon-plus">单个添加</el-button>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/commerceInsurance/enteringAdd">
                <el-dropdown-item>录入增员</el-dropdown-item>
              </router-link>
              <router-link to="/commerceInsurance/enteringDelete">
                <el-dropdown-item>录入减员</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown>
            <el-button size="small" class="bc-blue ml-10 mr-30"><img src="../../assets/images/icons/ic-account-type29.png" alt="">批量导入</el-button>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/commerceInsurance/addImport?type=1">
                <el-dropdown-item>导入增员</el-dropdown-item>
              </router-link>
              <router-link to="/commerceInsurance/addImport?type=2">
                <el-dropdown-item>导入减员</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="apply-state header-bottom">
        <span class="ml-30 mr-10">申报状态:</span>
        <el-checkbox-group class="inlineBlock" v-model="search.declareStatus">
          <el-checkbox label="1" class="mr-20">未提交申报</el-checkbox>
          <el-checkbox label="3" class="mr-20">已提交申报</el-checkbox>
          <el-checkbox label="5" class="mr-20">申报成功</el-checkbox>
          <el-checkbox label="6" class="mr-20">申报失败</el-checkbox>
          <el-checkbox label="7" class="mr-20">作废</el-checkbox>
        </el-checkbox-group>
        <span class="ml-120 mr-10">申报类型:</span>
        <el-checkbox-group class="inlineBlock" v-model="search.declareType">
          <el-checkbox class="mr-20" label="1">增员</el-checkbox>
          <el-checkbox class="mr-20" label="2">减员</el-checkbox>
        </el-checkbox-group>
      </div>
    </header>
    <div class="handle-btn mt-15">
      <div class="fr mr-25">
        <el-button size="small" type="primary" @click="submit(null)">提交</el-button>
        <el-button class="bc-blue" size="small" @click="back(null)">撤回</el-button>
        <el-button class="bc-blue" size="small" @click="discard(null)">作废</el-button>
        <el-button class="bc-blue" size="small" @click="exportData()">导出</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <dTable class="pb-20" @fetch="handleSearch" @selection-change="getSelectRow" ref="listTable" :tableHeight="tableHeight" :paging="true" :showSelection="true" :showIndex="true">
      <el-table-column prop="empName" label="姓名" width="150" :show-overflow-tooltip="true" fixed="left"></el-table-column>
      <el-table-column prop="empIdCard" label="证件号码" width="200" :show-overflow-tooltip="true" fixed="left"></el-table-column>
      <el-table-column prop="jobPosition" label="岗位" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="productCode" label="方案代码" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="changeType" label="申报类型" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="effectDate" label="生效日期" width="150" :show-overflow-tooltip="true" sortable="tecpch.effective_time">
        <template slot-scope="scope">
          <p>{{ scope.row.effectDate?$moment(scope.row.effectDate).format('YYYY-MM-DD'):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="申报状态" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="failCause" label="失败原因" min-width="300" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="payCycle" label="付款周期" width="250" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="startDate" label="开始时间" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p>{{ scope.row.startDate?$moment(scope.row.startDate).format('YYYY-MM-DD'):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="结束时间" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p>{{ scope.row.endDate?$moment(scope.row.endDate).format('YYYY-MM-DD'):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="fee" label="保费" width="200" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p>{{$global.milliFormat(scope.row.fee)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="mainEmpName" label="主被保险人" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="mainEmpIdCard" label="主被保险人证件号码" width="250" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="relate" label="关系" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createName" label="创建人" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):''}}</p>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="viewEmp(scope.row)">查看</el-button>
          <div class="opt-btn-split"></div>
          <el-dropdown>
            <el-button type="text" size="small" @click.stop="handleMore(scope.row)">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="back(scope.row)">撤回</el-dropdown-item>
              <el-dropdown-item @click.native="discard(scope.row)">作废</el-dropdown-item>
              <el-dropdown-item @click.native="submit(scope.row)">提交</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </dTable>

    <!--查看--->
    <el-drawer  :visible.sync="drawer" :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <template slot="title">
        <div>
          <span>{{rowViewInfo.staffInfo.empName}}({{rowViewInfo.staffInfo.empIdCard}})</span>
          <i v-if="rowViewInfo.staffInfo.sex=='男'" class="ic-male"></i>
          <i v-else class="ic-female"></i>
        </div>
      </template>
      <div class="drawer-content">
        <div class="title-row">
          <el-row class="row">
            <el-col :span="6">
              <p class="display-flex"><label class="text">姓名：</label><span class="value">{{rowViewInfo.staffInfo.empName}}</span></p>
            </el-col>
            <el-col :span="6">
              <p class="display-flex"><label class="text">证件号码：</label><span class="value">{{rowViewInfo.staffInfo.empIdCard}}</span></p>
            </el-col>
            <el-col :span="6">
              <p class="display-flex"><label class="text">年龄：</label><span class="value">{{$global.getAgeByIdCard(rowViewInfo.staffInfo.empIdCard+'')}}</span></p>
            </el-col>
            <el-col :span="6">
              <p class="display-flex"><label class="text">岗位：</label><span class="value">{{rowViewInfo.staffInfo.jobPosition}}</span></p>
            </el-col>
          </el-row>
        </div>
        <div v-show="this.rowViewInfo.familyMemberInfo==null">
          <div class="employee-title">
            <img class="fl ml-10" src="../../assets/images/icons/ic-account-type31.png" alt="">
            <p class="fl title-name">员工方案</p>
          </div>
          <div class="item title-row pt-20">
            <el-row class="row">
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">方案代码：</label><span class="value">{{rowViewInfo.staffInfo.productCode}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">申报类型：</label><span class="value">{{rowViewInfo.staffInfo.changeType}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">有无社保：</label><span class="value">{{rowViewInfo.staffInfo.hasSocial}}</span></p>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">开始时间：</label><span
                  class="value">{{ rowViewInfo.staffInfo.startDate ?$moment(rowViewInfo.staffInfo.startDate ).format('YYYY-MM-DD'):''}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">结束时间：</label><span class="value">{{ rowViewInfo.staffInfo.endDate ?$moment(rowViewInfo.staffInfo.endDate ).format('YYYY-MM-DD'):''}}</span>
                </p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text"></label><span class="value"></span></p>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-show="this.rowViewInfo.familyMemberInfo!=null">
          <div class="employee-title">
            <img class="fl ml-10" src="../../assets/images/icons/ic-family.png" alt="">
            <p class="fl title-name">家属方案</p>
          </div>
          <div class="title-row item pt-20">
            <el-row class="row">
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">姓名：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ?rowViewInfo.familyMemberInfo.empName:''}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">证件类型：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ?rowViewInfo.familyMemberInfo.cardTypeName:''}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">证件号码：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ?rowViewInfo.familyMemberInfo.empIdCard:''}}</span></p>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">性别：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ? rowViewInfo.familyMemberInfo.sex:''}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">出生日期：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.birthday ?$moment(rowViewInfo.familyMemberInfo.birthday ).format('YYYY-MM-DD'):''}}</span>
                </p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">与员工关系：</label>
                  <span class="value" v-if="rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.relate==20103001">儿子</span>
                  <span class="value" v-else-if="rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.relate==20103001">父亲</span>
                  <span class="value" v-else-if="rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.relate==20103003">母亲</span>
                  <span class="value" v-else-if="rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.relate==20103004">配偶</span>
                  <span class="value" v-else-if="rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.relate==20103005">女儿</span>
                </p>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">方案代码：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ? rowViewInfo.familyMemberInfo.productCode : ''}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">有无社保：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ? rowViewInfo.familyMemberInfo.hasSocial : ''}}</span></p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">申报类型：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null ? rowViewInfo.familyMemberInfo.changeType : ''}}</span></p>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">开始时间：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.startDate ?$moment(rowViewInfo.familyMemberInfo.startDate ).format('YYYY-MM-DD'):''}}</span>
                </p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text">结束时间：</label><span class="value">{{rowViewInfo.familyMemberInfo!=null && rowViewInfo.familyMemberInfo.endDate ?$moment(rowViewInfo.familyMemberInfo.endDate ).format('YYYY-MM-DD'):''}}</span>
                </p>
              </el-col>
              <el-col :span="spanRow">
                <p class="display-flex"><label class="text"></label><span class="value"></span></p>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-drawer>
    <!--查看--->

  </div>
</template>

<script>
import dTable from '../../components/common/table'

export default {
  components: { dTable },
  data () {
    return {
      pathData: [
        { name: '商保' },
        { name: '投保管理' }
      ],
      selectRows: [],
      drawer: false,
      search: {
        costMonth: '',
        declareStatus: [],
        declareType: [],
        product: '',
        supplier: '',
        empIdCards: '',
        setEmpIdCards: [],
        searchIdCardsLength: 0,
        searchWord: ''
      },
      productList: [],
      supplierList: [],
      showSelectForm: false,

      rowViewInfo: {
        staffInfo: {},
        familyMemberInfo: {}
      },
      spanRow: 8
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 400 + 'px'
    }
  },
  created () {
    this.$nextTick(() => {
      this.getCompanyList()
      this.handleSearch()
    })
  },
  watch: {
    'search.empIdCards' (newValue, oldValue) {
      var obj = this.$global.getIdCardRow(this.search.empIdCards)
      this.search.searchIdCardsLength = obj.num
      this.search.setEmpIdCards = obj.value
    }
  },
  methods: {
    /* 查询 */
    handleSearch () {
      var params = []
      if (this.search.costMonth) {
        params.push({ property: 'effectiveTime', value: this.search.costMonth })
      }
      if (this.search.declareStatus.length > 0) {
        var arr = new Array()
        for (var i = 0; i < this.search.declareStatus.length; i++) {
          switch (this.search.declareStatus[i]) {
            case '1':
              arr.push(0)
              break
            case '3':
              arr.push(1, 2, 3)
              break
            case '5':
              arr.push(4)
              break
            case '6':
              arr.push(5)
              break
            case '7':
              arr.push(7)
              break
          }
        }
        params.push({ property: 'declareStatusArray', value: arr })
      }
      if (this.search.declareType.length > 0) {
        params.push({ property: 'declareTypeArray', value: this.search.declareType })
      }
      params.push({ property: 'ecpcIdCardOrName', value: this.search.searchWord })
      if (this.showSelectForm && this.search.setEmpIdCards.length > 0) {
        params.push({ property: 'inputIdCards', value: this.search.setEmpIdCards })
      }
      if (this.showSelectForm && this.search.supplier) {
        params.push({ property: 'comminsureCompanyId', value: this.search.supplier })
      }
      if (this.showSelectForm && this.search.product) {
        params.push({ property: 'employeeCommInsureProductViewVO_comminsureProduct_code', value: this.search.product })
      }
      this.$refs.listTable.fetch({
        query: params,
        method: 'post',
        url: '/api/comminsure/declare/list'
      })
    },
    /* 查看 */
    viewEmp (row) {
      this.$http({
        url: '/api/comminsure/declare/detail',
        method: 'POST',
        params: {
          changeId: row.changeId,
          changeType: row.changeType
        }
      }).then(({ data }) => {
        this.drawer = true
        if (data.data.length > 0) {
          this.rowViewInfo.familyMemberInfo = null
          this.rowViewInfo.staffInfo = null
          for (let i = 0; i < data.data[0].length; i++) {
            let element = data.data[0][i]
            if (element.staffProduct == '家属方案') {
              this.rowViewInfo.familyMemberInfo = element
            } else if (element.staffProduct == '员工方案') {
              this.rowViewInfo.staffInfo = element
            }
          }
        }
      }).catch((data) => {
        this.drawer = false
      })
    },
    /* 更多 */
    handleMore () {

    },
    /* 调整状态 */
    submit (row) {
      var selectRows = []
      if (row == null) {
        selectRows = this.selectRows
      } else {
        selectRows.push(row)
      }
      if (selectRows == null || selectRows.length <= 0) {
        this.$message.warning('请选择需要操作的数据')
        return
      }
      var changes = []
      for (let i = 0; i < selectRows.length; i++) {
        var row = selectRows[i]
        if (row.declareStatus != 0) { // 提交
          this.$message.error('失败（失败原因：只有未提交申报的记录，才允许提交)')
          return
        }
      }
      var ids = ''
      for (const i in selectRows) {
        ids = selectRows[i].id + ',' + ids
      }
      this.$http({
        url: '/api/comminsure/declare/submit',
        method: 'post',
        params: {
          ids: ids
        }
      }).then(({ data }) => {
        // this.$message.success('提交成功')
        let res = data.data[0]
        let msg = data.msg
        if (res.status == 0) {
          //  有失败信息
          for (let key in res.errors) {
            msg += '<p>' + key + '失败原因：' + res.errors[key] + '</p>'
          }
          this.$message.error(msg)
        } else {
          this.$message.success(msg || '提交成功')
        }
        this.handleSearch()
      }).catch((data) => {
      })
    },

    back (row) {
      var selectRows = []
      if (row == null) {
        selectRows = this.selectRows
      } else {
        selectRows.push(row)
      }
      if (selectRows == null || selectRows.length <= 0) {
        this.$message.warning('请选择需要操作的数据')
        return
      }
      var changes = []
      for (let i = 0; i < selectRows.length; i++) {
        var row = selectRows[i]
        if (row.declareStatus != 1) { // 提交
          this.$message.error('失败（失败原因：只有已提交申报-待申报的记录，才允许撤回)')
          return
        }
      }
      var ids = ''
      for (const i in selectRows) {
        ids = selectRows[i].id + ',' + ids
      }
      this.$http({
        url: '/api/comminsure/declare/back',
        method: 'post',
        params: {
          ids: ids
        }
      }).then(({ data }) => {
        this.$message.success('撤回成功')
        this.handleSearch()
      })
    },

    discard (row) {
      var selectRows = []
      if (row == null) {
        selectRows = this.selectRows
      } else {
        selectRows.push(row)
      }
      if (selectRows == null || selectRows.length <= 0) {
        this.$message.warning('请选择需要操作的数据')
        return
      }
      var changes = []
      for (let i = 0; i < selectRows.length; i++) {
        var row = selectRows[i]
        if (row.declareStatus != 0) { // 提交
          this.$message.error('失败（失败原因：只有未提交申报的记录，才允许作废)')
          return
        }
      }
      var ids = ''
      for (const i in selectRows) {
        ids = selectRows[i].id + ',' + ids
      }
      this.$http({
        url: '/api/comminsure/declare/discard',
        method: 'post',
        params: {
          ids: ids
        }
      }).then(({ data }) => {
        this.$message.success('作废成功')
        this.handleSearch()
      })
    },
    exportData () {
      var selections = this.$refs.listTable.selections
      if (selections.length === 0) {
        this.$message.warning('请选择需要导出的数据')
        return
      }
      var params = {
        effectiveTime: '',
        declareStatus: '',
        declareType: ''
      }
      params.effectiveTime = this.search.costMonth

      if (this.search.declareStatus.length > 0) {
        var arr = new Array()
        for (var i = 0; i < this.search.declareStatus.length; i++) {
          switch (this.search.declareStatus[i]) {
            case '1':
              arr.push(0)
              break
            case '3':
              arr.push(1, 2, 3)
              break
            case '5':
              arr.push(4)
              break
            case '6':
              arr.push(5)
              break
            case '7':
              arr.push(7)
              break
          }
        }
        var declareStatus = ''
        for (let i = 0; i < arr.length; i++) {
          declareStatus = declareStatus + ',' + arr[i]
        }
        params.declareStatus = declareStatus
      }
      if (this.search.declareType.length > 0) {
        var declareType = ''
        for (let i = 0; i < this.search.declareType.length; i++) {
          declareType = declareType + ',' + this.search.declareType[i]
        }
        params.declareType = declareType
      }

      let _ids = this.$refs['listTable'].getSelectionsArr('id')
      var ids = ''
      for (let i = 0; i < _ids.length; i++) {
        ids = _ids[i] + ',' + ids
      }
      params.ids = ids
      this.$downloadFile(
        '/api/comminsure/declare/export',
        'post',
        params,
        this.$global.EXCEL
      )
    },
    // 重置搜索框
    resetSelectForm () {
      this.search.supplier = ''
      this.search.product = ''
      this.search.empIdCards = ''
      this.search.setEmpIdCards = ''
      this.search.searchIdCardsLength = 0
    },
    /* 获取保险公司 */
    getCompanyList () {
      this.$http({
        url: '/api/comminsure/company/list',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId
        })
      }).then(({ data }) => {
        this.supplierList = data.data[0]
      }).catch((data) => {
      })
    },
    /* 获取方案 */
    getProductList () {
      this.search.product = ''
      this.$http({
        url: '/api/comminsure/product/qryList',
        method: 'get',
        params: {
          custId: this.$store.state.userData.custId,
          companyId: this.search.supplier
        }
      }).then(({ data }) => {
        this.productList = data.data[0].rows
      })
    },
    getSelectRow (rows) {
      this.selectRows = rows
    }
  },
  filters: {}
}
</script>

<style scoped lang="less">
  .content {
    .handle-btn {
      height: 50px;
      background: #f2f2f2;
      line-height: 50px;
    }

    /deep/ .el-table {
      margin-top: 0;
    }
  }

  .employee-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #ddd;

    .title-name {
      font-size: 16px;
      color: #303133;
      font-weight: bold;
      margin-left: 12px;
    }
  }
</style>
