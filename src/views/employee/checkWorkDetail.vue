<template>
  <div class="spl-container content">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="search-header clearfix">
      <div class="search-row clearfix pt-15" style="padding-bottom: 15px;">
        <div class="filter-date fl">
          <el-date-picker  value-format="yyyy-MM-dd" class="date-editor2 ml-10 mr-5" type="date" v-model="startDateStr"></el-date-picker>
          至
          <el-date-picker  value-format="yyyy-MM-dd" class="date-editor2 ml-5" type="date" v-model="endDateStr"></el-date-picker>
        </div>
        <el-input placeholder="请输入姓名/手机号" class="w-220 ml-30" v-model="selectMsg"></el-input>
        <el-button type="button" class="el-button ml-20 w-60 el-button--primary el-button--small" @click="getTableData()"> 查询 </el-button>

        <el-button size="small" icon="icon ic-import-blue" class="btn--border-blue ml-15" @click="importPage()">导入</el-button>
        <el-button type="button" class="btn--border-blue ml-15" @click="returnPage()"> 返回 </el-button>

      </div>
    </header>
    <!-- 表格 -->
    <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="true"  :paging="true">
      <el-table-column prop="name" align="center" label="姓名" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="idCard" align="center" label="证件号" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="deptName" align="center" label="部门" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="job" align="center" label="岗位" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="phoneNumber" align="center" label="手机号" width="210" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="onDutyTime" align="center" label="上班打卡时间" width="300" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-text="scope.row.onDutyTime ? $moment(scope.row.onDutyTime).format('YYYY-MM-DD HH:mm:ss') : '' "> </span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="addr" align="center" label="打卡地点" width="210" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="offDutyTime" align="center" label="下班打卡时间" width="300" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-text="scope.row.offDutyTime ? $moment(scope.row.offDutyTime).format('YYYY-MM-DD HH:mm:ss') : '' "> </span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="addrOut" align="center" label="打卡地点" width="210" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="comment" align="center" label="备注" width="210" :show-overflow-tooltip="true"></el-table-column>

      <template slot="pagination-btns">
          <div class="display-flex">
              <el-button size="small" type="primary" icon="ic-export-white" class="s-btn" @click="pageExport()">导出记录</el-button>
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
        pathData: [{ name: '人员管理' }, { name: '考勤列表' }, { name: '打卡记录' }],
        dateStr: "",
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
        let dateStr = this.$route.query.dateStr
        this.dateStr = dateStr
        this.startDateStr = dateStr
        this.endDateStr = dateStr
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
          { property: 'endDateStr', value: this.endDateStr },
          { property: 'selectMsg', value: this.selectMsg }
        ]
        this.$refs.empTable.fetch({
          query: params,
          method: 'post',
          url: '/api/employee/checkWorkPageDetail'
        })
      },

      importPage () {
        this.$router.push('/employee/checkWorkImport')
      },

      returnPage () {
        this.$router.go(-1)
      },

      pageExport () {
        var params = {
          'startDateStr': this.startDateStr,
          'endDateStr': this.endDateStr,
          'selectMsg': this.selectMsg
        }
        this.$downloadFile('/api/employee/checkWorkDetailPageExport', 'post', {
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
