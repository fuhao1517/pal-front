<template>
  <div class="spl-container content">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="search-header pt-20 mb-20">
      <div>
        <span class="ml-40">保险公司：</span>
        <el-select :clearable="true" class="mr-20 w-260" v-model="selectValue" filterable placeholder="请选择">
          <el-option v-for="(item,index) in companyList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button size="small" class="mr-50" type="primary" @click="getTableData">查询</el-button>
      </div>
      <div class="header-right">
        <span>常用方案：</span>
        <div class="code-list-box" ref="codeListBox">
          <el-button v-show="codeListCutShow" @click="handleSlectCode(item.code)" size="small" v-for="(item,index) in productCodeListCut" :key="index">{{item.code}}</el-button>
          <el-button v-show="codeListShow" @click="handleSlectCode(item.code)" size="small" v-for="(item,index) in productCodeList" :key="index+'a'">{{item.code}}</el-button>
          <el-button @click="handleAll" size="small">全部</el-button>
        </div>
      </div>
    </header>
    <!-- 表格 -->
    <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="true"  :paging="true">
      <el-table-column prop="companyName" label="保险公司" width="300" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="productCode" label="方案代码" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="forIndustry" label="适用行业" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="payType" label="付费频率" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="payCycle" label="付费周期" :formatter="getPayCycleMeaning" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="合同期限" min-width="300" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-text="scope.row.contractStartDate ? $moment(scope.row.contractStartDate).format('YYYY-MM-DD') : '' "> </span>
          至
          <span v-text="scope.row.contractEndDate ? $moment(scope.row.contractEndDate).format('YYYY-MM-DD') : '' "> </span>
        </template>
      </el-table-column>
      <el-table-column prop="salePrice" label="保费" min-width="300" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-show="scope.row.salePrice">固定报价:{{scope.row.salePrice}}元/人</span>
          <span v-show="scope.row.ladderInfos&&scope.row.ladderInfos.length!==0&&scope.row.ladderInfos!=null">阶梯报价：</span>
          <el-popover placement="left" width="400" trigger="click">
            <el-button v-show="scope.row.ladderInfos&&scope.row.ladderInfos.length!==0&&scope.row.ladderInfos!=null" slot="reference" type="primary" size="mini" @click="handleDetail(scope.row)">明细</el-button>
            <table cellpadding="0" cellspacing="0" width="400">
              <tr>
                <th>开始阶梯人数</th>
                <th>结束阶梯人数</th>
                <th>销售价</th>
              </tr>
              <tr v-for="(item,index) in scope.row.ladderInfos" :key="index">
                <td>{{item.startLadder}}</td>
                <td>{{item.endLadder}}</td>
                <td>{{item.salePrice}}</td>
              </tr>
            </table>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="90" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-popover placement="right" width="auto" trigger="click">

            <table cellpadding="0" cellspacing="0">
              <tr>
                <th>合同期限</th>
                <th style="padding:0 15px;">价格</th>
              </tr>
              <tr v-for="(item,index) in scope.row.historyConstracts" :key="index">
                <td style="padding:0 15px;">
                  <span v-text="item.contractStartDate ? $moment(item.contractStartDate).format('YYYY-MM-DD') : '' "> </span>
                  至
                  <span v-text="item.contractEndDate ? $moment(item.contractEndDate).format('YYYY-MM-DD') : '' "> </span>
                </td>
                <td>
                  <div v-if="Array.isArray(item.salePrice)">
                    <div class="title clearfix sale-price-tab">
                      <p class="fl mr-30 sale-price">开始阶梯人数</p>
                      <p class="fl mr-30 sale-price">结束阶梯人数</p>
                      <p class="fl mr-30 sale-price">销售价</p>
                    </div>
                    <div class="clearfix price-number" v-for="(it,index) in item.salePrice" :key="index">
                      <p class="fl price">{{it.startLadder}}</p>
                      <p class="fl price">{{it.endLadder}}</p>
                      <p class="fl price">{{it.salePrice}}</p>
                    </div>
                  </div>
                  <span v-else v-text="item.salePrice"></span>
                </td>
              </tr>
            </table>
            <el-button slot="reference" type="text" size="small" @click="getHistoryConstracts(scope.row)">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>

    </dTable>
  </div>
</template>

<script>
import dTable from '../../components/common/table'
export default {
  components: { dTable },
  data () {
    return {
      pathData: [{ name: '商保' }, { name: '产品方案' }],
      selectValue: '',
      custId: '', // 客户ID
      companyList: [], // 保险公司列表
      productCodeList: [], // 产品方案代码列表
      productCodeListCut: [], // 常用产品方案代码列表
      codeListCutShow: true,
      codeListShow: false,
      historyConstracts: [{ // 查看列表
        contractStartDate: '',
        contractEndDate: '',
        salePrice: ''
      }],
      ladderInfos: [{ // 阶梯报价
        startLadder: '',
        endLadder: '',
        salePrice: ''
      }],
      payCycleMeaning: [
        { code: '001', meaning: '当月收取当月' },
        { code: '002', meaning: '当月收取下月' },
        { code: '003', meaning: '当月收取上月' },
        { code: '004', meaning: '3个月收' },
        { code: '005', meaning: '半年收' },
        { code: '006', meaning: '年收' }
      ]
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 250 + 'px'
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
    getPayCycleMeaning (row, col) {
      for (var i in this.payCycleMeaning) {
        if (this.payCycleMeaning[i].code == row.payCycle) {
          return this.payCycleMeaning[i].meaning
        }
      }
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
        this.productCodeListCut = data.data[0].slice(0, 4)
        this.productCodeList = data.data[0]
     
        let maxNumber=0
        let childrenWidth=0
        let codeListBoxWidth=this.$refs.codeListBox.clientWidth
        let children=this.$refs.codeListBox.children
        for(var i=0; i<children.length; i++){
          childrenWidth+=children[i].offsetWidth+25 //子元素的宽度
        }
        maxNumber=codeListBoxWidth/(childrenWidth/children.length)
        console.log('能放几个子元素='+maxNumber);
        this.productCodeList=data.data[0].slice(0,Math.floor(maxNumber)-1)
      })
    },
    /* 选择方案代码 */
    handleSlectCode (code, params = []) {
      this.selectValue = ''
      params = [
        { property: 'custId', value: this.$store.state.userData.custId },
        { property: 'companyId', value: this.selectValue },
        { property: 'productCode', value: code }
      ]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/comminsure/product/list'
      })
    },
    /* 全部 */
    handleAll () {
      this.codeListCutShow = false
      this.codeListShow = true
      this.selectValue = ''
      this.getTableData()
    },
    /* 获取表格数据 */
    getTableData (params = []) {
      params = [
        { property: 'custId', value: this.$store.state.userData.custId },
        { property: 'companyId', value: this.selectValue }
      ]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/comminsure/product/list',
        paging: 'front'
      })
    },
    /* 明细 */
    handleDetail (row) {
      this.ladderInfos = row.ladderInfos
    },
    /* 查看 */
    getHistoryConstracts (row) {
      this.historyConstracts = row.historyConstracts
    }
  }
}
</script>

<style scoped lang="less">
.content {
  .search-header {
    display: flex;
    align-items: center;
    .header-right{
      display: flex;
      align-items: center;
      flex: 1;
      .code-list-box{
        flex: 1;
        /deep/.el-button.el-button--default.el-button--small{
          min-width: 100px;
        }
      }
    }
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
