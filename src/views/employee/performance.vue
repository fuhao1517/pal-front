<template>
  <div class="spl-container content">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="search-header clearfix">
      <div class="search-row clearfix pt-15" style="padding-bottom: 15px;">
        <div class="filter-date fl">
          绩效年月：
          <el-date-picker  value-format="yyyy-MM" class="date-editor2 ml-10 mr-5" type="month" placeholder="选择日期" clearable v-model="startDateStr"></el-date-picker>
          至
          <el-date-picker  value-format="yyyy-MM" class="date-editor2 ml-5" type="month" placeholder="选择日期" clearable v-model="endDateStr"></el-date-picker>
        </div>
        <el-input placeholder="请输入姓名/手机号" class="w-220 ml-30" v-model="selectMsg"></el-input>
        <el-button type="button" class="el-button ml-20 w-60 el-button--primary el-button--small" @click="getTableData()"> 查询 </el-button>

        <el-button size="small" icon="icon ic-import-blue" class="btn--border-blue ml-15" @click="importPage()">导入</el-button>
      </div>
    </header>
    <!-- 表格 -->
    <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="true"  :paging="true">
      <el-table-column prop="name" align="center" label="姓名" width="300" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="idCard" align="center" label="证件号" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="deptName" align="center" label="部门" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="station" align="center" label="岗位" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="telephone" align="center" label="手机号" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="perforDate" align="center" label="绩效年月" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalManHour" align="center" label="总工时（小时）" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="hourWage" align="center" label="时薪（元）" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalCount" align="center" label="计件数目（件）" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unitPrice" align="center" label="计件单价（元）" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalKiloCount" align="center" label="里程（公里）" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="comment" align="center" label="备注" width="210" :show-overflow-tooltip="true"></el-table-column>

      <template slot="pagination-btns">
        <el-button type="primary" icon="ic-export-white" @click="pageExport" class="s-btn">导出记录</el-button>
      </template>
    </dTable>
  </div>
</template>

<script>
  import dTable from '../../components/common/table'
  export default {
    components: { dTable },
    data () {
      return {
        pathData: [{ name: '人员管理' }, { name: '绩效管理' }],
        startDateStr: "",
        endDateStr: "",
        selectMsg: ""
      }
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 260 + 'px'
      },
      detailHeight: function () {
        return this.$global.bodyHeight - 700 + 'px'
      }
    },
    created () {
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    mounted () {
    },
    methods: {
      /* 获取表格数据 */
      getTableData (params = []) {
        params = [
          { property: 'startPerforDate', value: this.startDateStr },
          { property: 'endPerforDate', value: this.endDateStr },
          { property: 'empNameOrPhone', value: this.selectMsg }
        ]
        this.$refs.empTable.fetch({
          query: params,
          method: 'post',
          url: '/api/employee/checkPerformancePage',
          paging: 'front'
        })
      },

      importPage () {
        this.$router.push('/employee/performanceImport')
      },

      pageExport () {
        var params = {
          'startPerforDate': this.startDateStr,
          'endPerforDate': this.endDateStr,
          'empNameOrPhone': this.selectMsg
        }
        this.$downloadFile('/api/employee/checkPerformanceExport', 'post', {
          params
        }, this.$global.EXCEL)
      }
    }
  }
</script>

<style scoped lang="less">
  .content {
    .search-header {
      display: flex;
      align-items: center;
    }
    /deep/.el-popover,
    .el-popper {
      height: 170px !important;
    }
  }
  .sale-price-tab{
    width: 400px;
    height: 32px;
    background: #f8f8f8;
    line-height: 32px;
    display: flex;
    justify-content: center;
  }
  .sale-price{
    font-weight: bold;
  }
  .price-number{
    border-bottom: 1px solid #ddd;
    .price{
      width: 115px;
      line-height: 32px;
    }
  }
  .price-number:last-child{
    border-bottom: none;
  }
  /deep/.el-table_115_column_294{
    padding:0px;
  }
  table{
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  th,td{
    background: #f8f8f8;
    height: 30px;
    text-align: center;
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  td{
    background: #fff;
  }
</style>
