<template>
  <div class="spl-container content">
    <div class="loading-mask-none" v-loading="mainLoading.isLoading" :element-loading-text="mainLoading.mainLoadingText"
         :element-loading-spinner="$global.elementLoadingSpinner">
      <!-- 面包屑导航 -->
      <breadcrumb :data="pathData"></breadcrumb>
      <splTab :tabs="tabs" v-model="active"></splTab>
      <div v-show="active==0">
        <social ref="social"></social>
      </div>
      <div v-show="active==1">
        <accfund :addrWidth="addrWidth"></accfund>
      </div>
      <div v-show="active==2">
        <div class="search-row">
          <div class="display-flex">
            <span class="label w-100 text-right mr-5">保险公司：</span>
            <el-select v-model="commercialForm.companyId" :clearable="true" class="w-260" filterable placeholder="请选择">
              <el-option v-for="(item,index) in companyList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div class="ml-150">
              <span class="mr-5">费用年月<span style="color:red;">*</span> ：</span>
              <el-date-picker value-format="yyyy-MM" class="date-editor2 w-260" v-model="commercialForm.fyDate" type="month"></el-date-picker>
            </div>
            <div class="flex1 text-right pr-5">
              <el-button size="small" type="primary" class="ml-20 w-60" @click="getTableData">查询</el-button>
              <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
                <el-form ref="commercialForm" :model="commercialForm" class="select-form">
                  <el-row class="select-form-el-row" type="flex" justify="space-around">
                    <el-col :span="8" class="select-form-el-col">
                      <el-form-item label="姓名：" label-position="right" label-width="118px">
                        <el-input v-model="commercialForm.empName"  style="margin-left: -6px;width: 100%; min-width: 150px;max-width: 260px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7" class="select-form-el-col" style="padding-left: 8px;">
                      <el-form-item label="身份证：">
                        <el-input v-model="commercialForm.empCard" style="margin-left: -5px;width: 100%; min-width: 150px;max-width: 260px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" class="select-form-el-col">
                    </el-col>
                    <el-col :span="4" class="select-form-el-col text-right pr-10">
                      <el-button size="small" type="primary" class="s-btn" @click="getTableData" icon="el-icon-search">查询</el-button>
                      <el-button size="small" @click="resetSearchForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                      <!--<el-button size="small" type="primary" class="s-btn" @click="getTableData" icon="el-icon-search">查询</el-button>
                      <el-button size="small" @click="resetSearchForm" icon="el-icon-refresh-left" class="s-btn btn&#45;&#45;border-blue" style="margin-left: 15px;">重置</el-button>-->
                    </el-col>
                  </el-row>
                </el-form>
                <el-button slot="reference" icon="ic-filter-blue" class="ml-15">筛选</el-button>
              </el-popover>
              <el-button type="primary" size="small" style="margin-left: 15px;" @click="handleExport"><i class="ic-export-white"></i>导出</el-button>
            </div>
          </div>
          <div class="display-flex mt-20">
            <span class="label w-100 text-right mr-5">常用方案：</span>
            <div class="flex1" ref="usedWidth">
              <el-checkbox-group class="fl" v-if="codeListCutShow" v-model="productCodesArr" size="small">
                <el-checkbox-button v-for="(item,index) in productCodeListCut" :label="item.code" :key="index">{{item.code}}</el-checkbox-button>
              </el-checkbox-group>

              <el-checkbox-group class="fl" v-if="codeListShow" v-model="productCodesArr" size="small">
                <el-checkbox-button v-for="(item,index) in productCodeList" :label="item.code" :key="index">{{item.code}}</el-checkbox-button>
              </el-checkbox-group>

              <el-button @click="handleAll" size="small">全部</el-button>
            </div>
          </div>
          </div>
        <div class="hint" v-if="hint">
          <p class="ml-30">商保<span>{{hintDate}}</span>费用周期在保<span style="color:#409EFF">{{paidNum}}</span>人次</p>
        </div>
        <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :paging="true" :showIndex="true">
          <el-table-column prop="companyName" label="保险公司" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="age" label="年龄" width="50" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="code" label="方案代码" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="fyDate" label="费用年月" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="startTimeStr" label="投保开始时间" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="endTimeStr" label="投保结束时间" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="mainName" label="主被保险人" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="mainIdCard" label="主被保险人证件号码" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="relationName" label="关系" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="fee" label="保费" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="isSocialStr" label="有/无社保" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="positionName" label="岗位" width="150" :show-overflow-tooltip="true"></el-table-column>
          <template slot="pagination-btns">
            <div class="comment">
              <p class="ml-15"><span style="color:#FF9600;">注：</span>年付日结的商保方案，保费展示当前方案的总共参保天数费用；</p>
              <p>年付月结的商保方案，保费展示每月实付费用；</p>
              <p>月结的商保方案，保费展示每月实付费用；</p>
            </div>
          </template>
        </dTable>

      </div>
    </div>
  </div>
</template>

<script>
import dTable from '../../components/common/table'
import splTab from '../../components/common/spl-tab'
import social from './insuranceProgress/social'
import accfund from './insuranceProgress/accfund'

export default {
  components: { splTab, dTable, social, accfund },
  data () {
    return {
      pathData: [{ name: '人员管理' }, { name: '在保名册' }],
      active: 0,
      tabs: ['社保名册', '公积金名册', '商保名册'],
      commercialForm: {
        companyId: '', // 保险公司Id
        fyDate: '', // 费用年月
        empName: '',
        empCard: ''
      },
      paidNum: '',
      unpaidNum: '',
      companyList: [], // 保险公司列表
      productCodeList: [], // 产品方案代码列表
      productCodeListCut: [], // 常用产品方案代码列表
      codeListCutShow: true,
      codeListShow: false,
      hint: false,
      hintDate: '',
      addrWidth: 0,
      showSelectForm: false,
      productCodesArr: [], // 方案代码
      mainLoading: {
        isLoading: false,
        mainLoadingText: '正在导出...'
      }
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 418 + 'px'
    }
  },
  mounted () {
    this.addrWidth = this.$refs.social.$refs.usedWidth.clientWidth - 10
    this.getCompanyList()
    this.getProductCodeList()
  },
  methods: {
    /* 获取保险公司 */
    getCompanyList () {
      this.$http({
        url: '/api/comminsure/company/list',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId
        })
      }).then(({ data }) => {
        this.companyList = data.data[0]
      })
    },
    /* 获取方案代码列表 */
    getProductCodeList () {
      this.$http({
        url: '/api/comminsure/productcode/list',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId,
          adaptProject: ''
        })
      }).then(({ data }) => {
        this.productCodeList = data.data[0].slice(0, 9)
        this.productCodeListCut = data.data[0].slice(0, 4)
      })
    },
    /* 全部 */
    handleAll () {
      this.codeListCutShow = false
      this.codeListShow = true
      this.productCodesArr = []
    },
    /* 获取表格数据 */
    getTableData (params = []) {
      if (!this.commercialForm.fyDate) {
        this.$message.warning('请选择费用年月')
        return
      }
      params = [
        { property: 'fyDate', value: this.commercialForm.fyDate },
        { property: 'companyId', value: this.commercialForm.companyId === '' ? null : Number(this.commercialForm.companyId) },
        { property: 'empName', value: this.commercialForm.empName },
        { property: 'empCard', value: this.commercialForm.empCard },
        { property: 'productCodes', value: this.productCodesArr }
      ]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/insureList/commisures'
      })
      this.showSelectForm = false
      this.$http({
        url: '/api/employee/insureList/commisures/paidResult',
        method: 'post',
        data: {
          companyId: this.commercialForm.companyId === '' ? null : Number(this.commercialForm.companyId),
          fyDate: this.commercialForm.fyDate,
          productCodes: this.productCodesArr,
          empName: this.commercialForm.empName,
          empCard: this.commercialForm.empCard
        }
      }).then(({ data }) => {
        this.paidNum = data.data[0].paidNum + data.data[0].unpaidNum
        // this.paidNum = data.data[0].paidNum +
        // this.unpaidNum = data.data[0].unpaidNum
        var fyDate2 = this.commercialForm.fyDate
        var year = fyDate2.split('-')[0] + '年'
        var month = fyDate2.split('-')[1] + '月'
        this.hintDate = year + month
        this.hint = true
      })
    },
    // 重置搜索
    resetSearchForm () {
      this.commercialForm.empName = ''
      this.commercialForm.empCard = ''
    },
    /* 导出 */
    handleExport () {
      let that = this
      if (!that.commercialForm.fyDate) {
        that.$message.warning('请选择费用年月')
        return
      }
      that.mainLoading.isLoading = true
      that.mainLoading.mainLoadingText = '正在导出...'
      that.$downloadFile('/api/employee/insureList/commisures/export', 'post', {
        companyId: that.commercialForm.companyId === '' ? null : Number(that.commercialForm.companyId),
        fyDate: that.commercialForm.fyDate,
        productCodes: that.productCodesArr,
        empName: that.commercialForm.empName,
        empCard: that.commercialForm.empCard
      }, that.$global.EXCEL,
      '',
      function () {
        that.mainLoading.isLoading = false
      }
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .header-row {
    display: flex;
    justify-content: space-between;

    .el-form-item {
      margin-bottom: 10px;
    }

    /deep/ .date-editor2 .el-icon-date {
      top: 5px;
    }
  }

  .content {
    position: relative;

    .hint {
      height: 50px;
      background: #f8f8f8;
      line-height: 50px;
    }

    .comment {
      p:nth-child(2), p:nth-child(3) {
        margin-left: 43px;
      }
    }
  }

  /deep/ .el-checkbox-button__inner {
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 2px !important;
  }
</style>
