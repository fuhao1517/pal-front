<template>
  <div class="content spl-container">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="header">
      <el-form :inline="true" :model="accumForm" class="demo-form-inline month-form" ref="accumForm">
        <el-form-item prop="taxMonth" label="薪酬年月" :rules="[{ required: true, message: '请选择薪酬年月',trigger:'change'}]">
          <el-date-picker class="date-editor2 date-editor-index" value-format="yyyy-MM"  v-model="accumForm.taxMonth" type="month"></el-date-picker>
        </el-form-item>

        <el-form-item prop="companyName" label="扣缴义务人" :rules="[{ required: true, message: '请选择扣缴义务人',trigger:'change'}]">
          <el-select v-model="accumForm.companyName" clearable>
            <el-option v-for="(item,index) in optrCompvoList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="small" type="primary" @click="handleSearch">查询</el-button>

          <el-popover v-model="popover" placement="bottom" width="100%" trigger="click" popper-class="seach-popover" :visible-arrow="false">
            <el-row :gutter="880">
              <el-col :span="12" style="padding-right:0px;">
                <el-form-item prop="employeeIdCard" class="ml-30" label="证件号码">
                  <el-input v-model="accumForm.employeeIdCard" type="textarea" class="w-200" placeholder="一行只可输入一个身份证"></el-input>
                  <span class="text-red ml-10">已输入{{accumForm.searchIdCardsLength}}个</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-left:180px;">
                  <el-button size="small" type="primary" class="s-btn" @click="handleSearch" icon="el-icon-search">查询</el-button>
                  <el-button size="small" icon="el-icon-refresh-left" @click="accumForm.employeeIdCard = '', accumForm.searchIdCardsLength = 0" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>

            <el-button class="mr-10 ml-10" slot="reference" size="small"><i class="ic-select-gray"></i>筛选</el-button>
          </el-popover>

          <el-button class="btn--border-blue" size="small" @click="handleImport"> <i class="ic-import-blue"></i>导入</el-button>
          <el-button class="btn--border-blue" size="small" @click="handleEdit" icon="el-icon-s-tools">设置</el-button>

        </el-form-item>

      </el-form>
    </header>

    <dTable @fetch="handleSearch" class="mb-30" style="position: relative;" ref="salaryTable" :tableHeight="tableHeight" :showIndex="true">
      <el-table-column width="200" prop="employeeName" fixed label="姓名"></el-table-column>
      <el-table-column width="250" prop="idCard" fixed label="证件号码"></el-table-column>
      <el-table-column width="150" prop="telephone" label="手机号"></el-table-column>
      <el-table-column width="250" prop="companyName" label="扣缴义务人"></el-table-column>
      <el-table-column width="150" prop="taxMonth" label="薪酬年月"></el-table-column>
      <el-table-column width="150" prop="countSonEducation" label="累计子女教育扣除"></el-table-column>
      <el-table-column width="150" prop="countEducation" label="累计继续教育扣除"></el-table-column>
      <el-table-column width="150" prop="countSupportOlder" label="累计赡养老人扣除"></el-table-column>
      <el-table-column width="150" prop="countLinessMedical" label="累计大病医疗扣除"></el-table-column>
      <el-table-column width="150" prop="countMortgage" label="累计住房贷款利息"></el-table-column>
      <el-table-column width="150" prop="countAccfund" label="累计租房租金扣除"></el-table-column>
      <el-table-column width="150" prop="entryDate" label="任职受雇日期"></el-table-column>
      <el-table-column width="150" prop="employeeType" label="员工从业类型"></el-table-column>
      <el-table-column width="150" prop="yearFirstSalary" label="是否纳税年度首次取得工资"></el-table-column>
    </dtable>
    <el-button style="position: relative; bottom: 75px;" class="btn--border-blue ml-30" size="small" @click="handleExport">
      <i class="ic-export-blue"></i>
      导出数据
    </el-button>

    <!-- 导入 -->
    <el-drawer :visible.sync="importDrawer" :withHeader='false' :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <importAddUp @handleClose="handleClose" :optrCompvoList='optrCompvoList'/>
    </el-drawer>

    <!-- 设置 -->
    <el-drawer :visible.sync="editDrawer" :withHeader='false' :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <singleSetting @handleClose="handleClose"/>
    </el-drawer>
  </div>
</template>

<script>
import dTable from '../../../components/common/table'
import importAddUp from './importAddUp'
import singleSetting from './singleSetting'
export default {
  components: { dTable, importAddUp, singleSetting },
  data () {
    return {
      pathData: [{ name: '薪酬管理' }, { name: '累计专项列表' }],
      popover: false,
      accumForm: {
        taxMonth: '',
        companyName: '',
        employeeIdCard: '',
        setEmpIdCards: [],
        searchIdCardsLength: 0
      },
      optrCompvoList: [], // 扣缴义务人
      importDrawer: false,
      editDrawer: false
    }
  },
  watch: {
    'accumForm.employeeIdCard' (newValue, oldValue) {
      var obj = this.$global.getIdCardRow(this.accumForm.employeeIdCard)
      this.accumForm.searchIdCardsLength = obj.num
      this.accumForm.setEmpIdCards = obj.value
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 290 + 'px'
    }
  },
  mounted () {
    this.getCompanyName()
    var year = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    month = month<10?'0' + month : month
    var time = year + '-' + month
    this.accumForm.taxMonth = time
  },
  methods: {
    /* 查询 */
    handleSearch (params = []) {
      this.$refs.accumForm.validate((valid) => {
        if (valid) {
          params = [
            { property: 'taxMonth', value: this.accumForm.taxMonth },
            { property: 'companyName', value: String(this.accumForm.companyName) },
            { property: 'employeeIdCard', value: this.accumForm.setEmpIdCards }
          ]
          this.$refs.salaryTable.fetch({
            query: params,
            method: 'post',
            url: '/api/salary/qryEmployeeTaxList'
          })
          this.popover = false
        }
      })
    },
    /* 获取扣缴义务人 */
    getCompanyName () {
      this.$http({
        url: '/api/salary/listOptrComp',
        method: 'post',
        data: {}
      }).then(({ data }) => {
        this.optrCompvoList = data.data[0]
        if (this.optrCompvoList.length === 1) {
          this.accumForm.companyName = this.optrCompvoList[0].id
        }
      })
    },
    /* 导出数据 */
    handleExport () {
      var params = [
        { property: 'taxMonth', value: this.accumForm.taxMonth },
        { property: 'companyName', value: String(this.accumForm.companyName) },
        { property: 'employeeIdCard', value: this.accumForm.setEmpIdCards }
      ]
      this.$downloadFile('/api/salary/qryEmployeeTaxExport', 'post', {
        query: params
      }, this.$global.EXCEL)
    },
    /* 导入 */
    handleImport () {
      this.importDrawer = true
    },
    /* 设置 */
    handleEdit () {
      this.editDrawer = true
    },
    /* 关闭 */
    handleClose () {
      this.editDrawer = false
      this.importDrawer = false
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    .header{
      .month-form{
        display: flex;
        justify-content: space-between;
        padding: 30px 40px 0px 40px;
      }
    }
  }
  /deep/.select-form,.el-form,.el-form--inline{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/.el-select__caret,.el-input__icon,.el-icon-arrow-up{
    color: #409EFF;
    position: relative;
    left: 0px !important;
  }
  /deep/.date-editor-index .el-icon-date{
    top: 4px;
  }

</style>
