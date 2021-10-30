<template>
  <div class="spl-container content">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="search-header clearfix">
      <div class="search-row clearfix pt-15" style="padding-bottom: 15px;">
        <div class="filter-date fl">
          <el-date-picker  value-format="yyyy-MM-dd" class="date-editor2 ml-10 mr-5" type="date" placeholder="选择日期" clearable v-model="startDateStr"></el-date-picker>
          至
          <el-date-picker  value-format="yyyy-MM-dd" class="date-editor2 ml-5" type="date" placeholder="选择日期" clearable v-model="endDateStr"></el-date-picker>
        </div>
        <el-button type="button" class="el-button ml-20 w-60 el-button--primary el-button--small" @click="getTableData()"> 查询 </el-button>
        <el-button size="small" icon="icon ic-import-blue" class="btn--border-blue ml-15" @click="importPage()">导入</el-button>
      </div>
    </header>
    <!-- 表格 -->
    <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="true"  :paging="true">
      <el-table-column prop="dutyDateStr" align="center" label="日期" width="300" :show-overflow-tooltip="true" fixed="left"></el-table-column>
      <el-table-column prop="checkCount" align="center" label="出勤人数" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unCheckCount" align="center" label="缺勤人数" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unCheckPerCount" align="center" label="缺勤-事假" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unCheckSickCount" align="center" label="缺勤-病假" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unCheckOutCount" align="center" label="缺勤-旷工" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="操作" width="200" :show-overflow-tooltip="true" fixed="right">
        <template slot-scope="scope">
          <el-popover placement="right" width="auto" trigger="click">
            <el-button  slot="reference" type="text" size="small" @click="detailPage(scope.row.dutyDateStr)">详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <template slot="pagination-btns" class="mt-20">
          <div class="display-flex">
              <el-button size="small" type="primary" icon="ic-export-white" class="s-btn" @click="pageExport()">导出</el-button>
          </div>
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
        pathData: [{ name: '人员管理' }, { name: '考勤列表' }],
        startDateStr: "",
        endDateStr: ""
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
          { property: 'startDateStr', value: this.startDateStr },
          { property: 'endDateStr', value: this.endDateStr }
        ]
        this.$refs.empTable.fetch({
          query: params,
          method: 'post',
          url: '/api/employee/checkWorkPage'
        })
      },

      detailPage (dateStr) {
        this.$router.push('/employee/checkWorkDetail?dateStr=' + dateStr)
      },

      importPage () {
        this.$router.push('/employee/checkWorkImport')
      },

      pageExport () {
        var params = {
          'startDateStr': this.startDateStr,
          'endDateStr': this.endDateStr
        }
        this.$downloadFile('/api/employee/checkWorkPageExport', 'post', {
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
