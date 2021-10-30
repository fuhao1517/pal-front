<template>
  <div class="loading-mask-none" v-loading="mainLoading.isLoading" :element-loading-text="mainLoading.mainLoadingText"
       :element-loading-spinner="$global.elementLoadingSpinner">
    <div>
      <div class="search-row">
        <div class="display-flex">
          <span class="label w-100 text-right mr-5">参保地：</span>
          <addrSelector v-model="addrVal" :addrArr="allAddr" @changeAddrSelect="changeAddrSelect"></addrSelector>
          <div class="ml-150">
            <span class="mr-5">费用年月<span style="color:red;">*</span> ：</span>
            <el-date-picker value-format="yyyy-MM" class="date-editor2 w-260" v-model="setData.yearDate" type="month"></el-date-picker>
          </div>
          <div class="flex1 text-right pr-5">
            <el-button size="small" type="primary" class="ml-20 w-60" @click="getTableData">查询</el-button>
            <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
              <div class="show-select-form">
                <el-form ref="selectForm" :model="setData" class="select-form">
                  <el-row class="select-form-el-row" type="flex" justify="space-around">
                    <el-col :span="7" class="select-form-el-col">
                      <el-form-item label="姓名：" label-position="right" label-width="118px">
                        <el-input placeholder="" v-model="setData.empName" style="margin-left: -6px;width: 100%; min-width: 150px;max-width: 260px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7" class="select-form-el-col" style="padding-left: 8px;">
                      <el-form-item label="身份证：">
                        <el-input placeholder="" v-model="setData.empCard" style="margin-left: -5px;width: 100%; min-width: 150px;max-width: 260px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7" class="select-form-el-col">
                      <el-form-item label="类型：" class="ml-20">
                        <el-select v-model="setData.type" placeholder="全部" class="w-260" style="margin-left: -5px;">
                          <el-option label="全部" value=""></el-option>
                          <el-option label="汇缴" value="0"></el-option>
                          <el-option label="补缴" value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4" class="select-form-el-col text-right pr-10">
                      <el-button size="small" type="primary" class="s-btn" @click="getTableData" icon="el-icon-search">查询</el-button>
                      <el-button size="small" @click="resetSearchForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <el-button slot="reference" icon="ic-filter-blue" class="ml-15">筛选</el-button>
            </el-popover>
            <el-button type="primary" size="small" style="margin-left: 15px;" @click="handleExport"><i class="ic-export-white"></i>导出</el-button>
          </div>
        </div>
        <div class="display-flex mt-20">
          <span class="label w-100 text-right mr-5">公积金常用地：</span>
          <div class="flex1" ref="usedWidth">
        <span class="tag" :class="{active:index===userActive}" v-for="(item,index) in usedAddr" :key="item.id"
              @click="selectUsed('id',index)">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="result-row" v-show="result.isShow">
        <p>公积金<span>{{result.resYear}}</span>年<span>{{result.resMonth}}</span>月费用周期在保<span class="text-blue">{{result.paidTotal}}</span>人次
        </p>
      </div>
      <div>
        <dTable @fetch="getTableData" ref="dTable" style="margin-top: 0;" :tableHeight="tableHeight" :showIndex='true' :showSelection='false'>
          <el-table-column prop="empName" label="姓名" width="180" :show-overflow-tooltip="true"/>
          <el-table-column prop="idcard" label="证件号码" width="180" :show-overflow-tooltip="true"/>
          <el-table-column prop="account" label="公积金号" width="200" :show-overflow-tooltip="true"/>
          <el-table-column prop="computerNumber" label="个人电脑号" width="150" :show-overflow-tooltip="true"/>
          <el-table-column prop="addrName" label="参保地" width="80" :show-overflow-tooltip="true"/>
          <el-table-column prop="type" label="类型" width="80" :show-overflow-tooltip="true"/>
          <el-table-column prop="fyDateStr" label="费用年月" min-width="100" :show-overflow-tooltip="true"/>
          <el-table-column prop="productNick" label="方案名称" min-width="150" :show-overflow-tooltip="true"/>
          <el-table-column prop="empTbBase" label="基数" min-width="120" :show-overflow-tooltip="true"/>
          <el-table-column prop="compRatio" label="单位比例" min-width="120" :formatter="formatterRatio" :show-overflow-tooltip="true"/>
          <el-table-column prop="empRatio" label="个人比例" min-width="120" :formatter="formatterRatio" :show-overflow-tooltip="true"/>
          <el-table-column prop="suppCompRatio" label="补充单位比例" min-width="120" :formatter="formatterRatio" :show-overflow-tooltip="true"/>
          <el-table-column prop="suppEmpRatio" label="补充个人比例" min-width="120" :formatter="formatterRatio" :show-overflow-tooltip="true"/>
          <el-table-column prop="empPaymentAmountTotal" label="个人实付金额" min-width="120" :show-overflow-tooltip="true"/>
          <el-table-column prop="compPaymentAmountTotal" label="单位实付金额" min-width="120" :show-overflow-tooltip="true"/>
          <el-table-column prop="paymentTotal" label="合计" min-width="150" :show-overflow-tooltip="true"/>
        </dTable>
      </div>
    </div>
  </div>
</template>
<script>
  import dTable from '../../../components/common/table'
  import {caclUsedAddr} from '../../../utils/caclUsedItem'
  import addrSelector from '../../../components/common/addrSelector'

  export default {
    components: {addrSelector, dTable},
    data() {
      return {
        userActive: -1,
        allAddr: [],
        usedAddr: [],
        addrVal: '',
        setData: {
          yearDate: '',
          addrId: '',
          type: '',
          empName: '',
          empCard: ''
        },
        showSelectForm: false,
        result: {
          isShow: false,
          resYear: '',
          resMonth: '',
          paidTotal: 0,
          unPaidTotal: 0
        },
        mainLoading: {
          isLoading: false,
          mainLoadingText: '正在导出...'
        },
      }
    },
    props: ['addrWidth'],
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 394 + 'px'
      }
    },
    created() {
      this.getAddr()
      this.$nextTick(() => {
        // that.getTableData()
      })
    },
    mounted() {
    },
    methods: {
      /* 常用地 */
      selectUsed(type, index) {
        this.addrVal = ''
        this.setData.addrId = this.usedAddr[index].id
        this.userActive = index
      },
      // 重置搜索
      resetSearchForm() {
        this.setData.type = ''
        this.setData.empName = ''
        this.setData.empCard = ''
      },
      changeAddrSelect(obj) {
        this.userActive = -1
        this.setData.addrId = obj.id
      },
      getTableData(type) {
        if (!this.setData.yearDate) {
          this.$message.warning('请选择费用年月')
          return
        }
        // 获取人员公积金名册汇缴补缴人数
        this.getEmployeePidResult()
        var params = [
          {'property': 'siteOneId', 'value': this.$store.state.userData.custId},
          {'property': 'fyDate', 'value': this.setData.yearDate},
          {'property': 'addrId', 'value': this.setData.addrId},
          {'property': 'type', 'value': this.setData.type},
          {'property': 'empName', 'value': this.setData.empName},
          {'property': 'empCard', 'value': this.setData.empCard}
        ]
        this.$refs.dTable.fetch({
          query: params,
          method: 'post',
          url: '/api/employee/getEmployeeAccfundRoster'
        })
        this.showSelectForm = false
      },
      getEmployeePidResult() {
        let that = this
        this.$http({
          url: '/api/employee/employeePidResult',
          method: 'post',
          data: {
            fyDate: this.setData.yearDate,
            type: 'accfund',
            addrId: this.setData.addrId,
            empCard: this.setData.empCard,
            empName: this.setData.empName,
            cut: this.setData.type
          }
        }).then(({data}) => {
          let res = data.data[0]
          that.result.isShow = true
          that.result.resYear = that.setData.yearDate.split('-')[0]
          that.result.resMonth = that.setData.yearDate.split('-')[1]
          that.result.unPaidTotal = res.remittanceNoPayed + res.suppNoPayedNumber
          // that.result.paidTotal = res.remittance + res.suppNumber - that.result.unPaidTotal
          that.result.paidTotal = res.remittance + res.suppNumber
        })
      },
      // 获取参保地
      getAddr(type) {
        let that = this
        this.$http({
          url: '/api/socialAccfund/addr',
          method: 'get',
          params: {type: 2}
        }).then(({data}) => {
          this.allAddr = data
          this.$nextTick(function () {
            that.usedAddr = caclUsedAddr(that, data, 'usedWidth', '', that.addrWidth)
          })
        })
      },
      /* 导出 */
      handleExport() {
        let that = this;
        if (!that.setData.yearDate) {
          that.$message.warning('请选择费用年月')
          return
        }
        that.mainLoading.isLoading = true
        that.mainLoading.mainLoadingText = '正在导出...'
        that.$downloadFile('/api/employee/exportAccfundRoster', 'post', {
          fyDate: that.setData.yearDate,
          addrId: that.setData.addrId,
          type: that.setData.type,
          empCard: that.setData.empCard,
          empName: that.setData.empName
        }, that.$global.EXCEL,
        '',
          function () {
            that.mainLoading.isLoading = false
          }
        )
      },

      formatterRatio(row, column, cellValue, index) {
        return cellValue * 100 + '%'
      }
    }
  }
</script>
<style lang="less" scoped>
  .tag {
    display: inline-block;
    padding: 0 15px;
    height: 30px;
    line-height: 30px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #CECECE;
    border-radius: 0px 2px 2px 0px;
    margin-right: 10px;
    cursor: pointer;
  }

  .tag:hover, .tag.active {
    background-color: #dddddd;
  }

  .result-row {
    padding: 15px 35px;
    background: rgba(248, 248, 248, 1);
  }
</style>
