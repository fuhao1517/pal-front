<template>
  <div class="spl-container content">
    <!-- 导航 -->
    <breadcrumb :data="pathData">
      <template slot="breadcrumb-btn">
        <el-button icon="el-icon-refresh" size="small" @click="refreshTable">刷新</el-button>
        <router-link to="/socialAccfund/insuranceManage">
          <el-button class="ml-20" icon="el-icon-arrow-left" size="small">返回</el-button>
        </router-link>
      </template>
    </breadcrumb>

    <header class=" clearfix">
      <h3 class="fl">调基</h3>
    </header>
    <div class="header-search">
      <el-select
        class="search-select"
        v-model="selectEmployee.empId"
        filterable
        remote
        reserve-keyword
        placeholder="请输入姓名、证件号码"
        :remote-method="remoteMethod"
        :loading="selectEmployee.loading"
        @change="changeSelectEmp">
        <template slot="prefix"><i class="el-icon-search ic-search"></i></template>
        <el-option
          v-for="item in selectEmployee.optionList"
          :key="item.employeeId"
          :label="item.name + '-' + item.idCard"
          :value="item.employeeId">
        </el-option>
      </el-select>
    </div>

    <div class="text-center" v-show="selectEmployee.idCard==''">
      <i class="ic-employee-empty"></i>
      <p class="mt-30">请先搜索人员！</p>
    </div>

    <div v-show="selectEmployee.idCard!=''">
      <div class="form-detail">
        <div style="padding: 0 20px;">
          <div class="detail-title mt-20 clearfix">
            <p class="fl user-name">
              <span class="mr-10" v-text="selectEmployee.name?selectEmployee.name:'请选择员工'"></span>
            </p>
            <p class="fl ml-20 mr-40">
              <span class="mr-10" v-text="
                  selectEmployee.idCard
                    ? '证件号码：' + selectEmployee.idCard
                    : ''
                "></span>
            </p>
            <p class="fl">
              <span class="mr-10">{{residence}}{{selectEmployee.residenceType}}</span>
            </p>
          </div>
          <div style="border: 1px solid #DDDDDD; border-top: none">

            <div class="family pl-20 pr-20">
              <div class="employee-title">
                <i class="ic-social"></i>
                <p class="fl title-name">社保</p>
              </div>
              <!-- 社保表单 -->

              <el-row class="row-bg m-form mt-20" justify="space-around" :span="24">
                <el-form :inline="true" :model="socialForm" ref="socialForm" label-width="120px">
                 <div class="clearfix">
                    <el-col :span="rowSpan">
                    <el-form-item label="参保地:" prop="socialAddrName"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请选择参保地'), trigger:'blur'},{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请选择参保地'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">参保地:</span>
                      </template>
                      <addrSelector v-model="socialForm.socialAddrName" :addrArr="socialForm.addrArr"
                                    @changeAddrSelect="getSocialAddrId" width="100%"></addrSelector>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="费用年月:" prop="fyDate"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请选择费用年月'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">费用年月:</span>
                      </template>
                      <el-date-picker v-model="socialForm.fyDate" value-format="yyyy-MM" class="date-editor2" type="month"
                                      placeholder="选择日期" @change="getSocailProducts()" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="方案名称:" prop="productCode"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请选择方案名称'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">方案名称:</span>
                      </template>
                      <el-select v-model="socialForm.productCodeItem" value-key="id" @change="changeSocialProductCode"
                                 class="w-p100" clearable>
                        <el-option v-for="item in socialForm.productList" :key="item.productCode"
                                   :label="item.productName"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                 </div>
                  <el-col :span="rowSpan">
                    <el-form-item label="基数:" prop="empTbBase"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请选择基数'), trigger:'blur'},{ validator: checkSocialBase, trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">基数:</span>
                      </template>
                      <el-input v-model="socialForm.empTbBase"
                                :placeholder="socialForm.productCodeItem.minBase?socialForm.productCodeItem.minBase+'~'+socialForm.productCodeItem.maxBase:''" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="变动原因:">
                      <el-input v-model="socialForm.comment" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
                <el-col :span="rowSpan" v-for="(item,index) in socialForm.fieldList" :key="index">
                  <!--("40009001","文字")
                     ("40009002","字符")
                     ("40009003","数字")
                     ("40009004","百分比")
                     ("40009005","货币")
                     ("40009006","日期")-->
                  <!--只要校验是否必填-->
                  <div :key="refreshSocialKey">
                    <el-form :inline="true" :model="socialForm.fieldList[index]" :ref="'socialFieldForm'+index"
                           label-width="120px">
                    <el-form-item :label="item.declareColumnName + ':'" prop="value"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'blur'},{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">{{item.declareColumnName}}:</span>
                      </template>
                      <!--非日期-->
                      <el-input v-model="socialForm.fieldList[index].value" v-if="item.inputType!='40009006' && item.scopes.length<1" clearable  @blur="fieldInputBlur(index, 'socialForm')"></el-input>

                      <!--下拉选择框-->
                      <el-select v-model="socialForm.fieldList[index].value" class="w-p100"
                                 v-if="item.inputType!='40009006' && item.scopes.length>0" clearable>
                        <el-option v-for="(it, ind) in item.scopes" :key="ind" :label="it"
                                   :value="it"></el-option>
                      </el-select>
                      <!--非日期-->
                      <!--日期-->
                      <el-date-picker v-if="item.inputType=='40009006'" v-model="socialForm.fieldList[index].value" :value-format="dateFormat(item.format, 'format')" class="date-editor2" :type="dateFormat(item.format, 'pickerType')" clearable></el-date-picker>
                      <!--日期-->
                    </el-form-item>
                  </el-form>
                  </div>
                </el-col>
              </el-row>
            </div>

            <div class="family pl-20 pr-20">
              <div class="employee-title">
                <i class="ic-accfund"></i>
                <p class="fl title-name">公积金</p>
              </div>
              <el-row class="row-bg m-form mt-20" justify="space-around" :span="24">
                <el-form :inline="true" :model="accfundForm" ref="accfundForm" label-width="120px">
                  <el-col :span="rowSpan">
                    <el-form-item label="参保地:" prop="accfundAddrName"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请选择参保地'), trigger:'blur'},{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请选择参保地'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">参保地:</span>
                      </template>
                      <addrSelector v-model="accfundForm.accfundAddrName" :addrArr="accfundForm.addrArr"
                                    @changeAddrSelect="getAccfundAddrId" width="100%"></addrSelector>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="费用年月:" prop="fyDate"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请选择费用年月'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">费用年月:</span>
                      </template>
                      <el-date-picker v-model="accfundForm.fyDate" value-format="yyyy-MM" class="date-editor2"
                                      type="month" placeholder="选择日期" @change="getAccfundProducts()" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="方案名称:" prop="productCode"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请选择方案名称'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">方案名称:</span>
                      </template>
                      <el-select v-model="accfundForm.productCodeItem" value-key="id" @change="changeAccfundProductCode"
                                 class="w-p100" clearable>
                        <el-option v-for="item in accfundForm.productList" :key="item.productCode"
                                   :label="item.productName"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="基数:" prop="empTbBase"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请选择基数'), trigger:'blur'},{ validator: checkAccfundBase, trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">基数:</span>
                      </template>
                      <el-input v-model="accfundForm.empTbBase"
                                :placeholder="accfundForm.productCodeItem.minBase?accfundForm.productCodeItem.minBase+'~'+accfundForm.productCodeItem.maxBase:''" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="变动原因:">
                      <el-input v-model="accfundForm.comment" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
                <el-col :span="rowSpan" v-for="(item,index) in accfundForm.fieldList" :key="index">
                  <!--("40009001","文字")
                     ("40009002","字符")
                     ("40009003","数字")
                     ("40009004","百分比")
                     ("40009005","货币")
                     ("40009006","日期")-->
                  <!--只要校验是否必填-->
                  <div :key="refreshAccfundKey">
                    <el-form :inline="true" :model="accfundForm.fieldList[index]" :ref="'accfundFieldForm'+index"
                           label-width="120px">
                    <el-form-item :label="item.declareColumnName + ':'" prop="value"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'blur'},{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">{{item.declareColumnName}}:</span>
                      </template>

                      <!--非日期-->
                      <el-input v-model="accfundForm.fieldList[index].value" v-if="item.inputType!='40009006' && item.scopes.length<1"  @blur="fieldInputBlur(index, 'accfundForm')"
                                clearable></el-input>

                      <!--下拉选择框-->
                      <el-select v-model="accfundForm.fieldList[index].value" class="w-p100"
                                 v-if="item.inputType!='40009006' && item.scopes.length>0" clearable>
                        <el-option v-for="(it, ind) in item.scopes" :key="ind" :label="it"
                                   :value="it"></el-option>
                      </el-select>
                      <!--非日期-->
                      <!--日期-->
                      <el-date-picker v-if="item.inputType=='40009006'" v-model="accfundForm.fieldList[index].value" :value-format="dateFormat(item.format, 'format')" class="date-editor2" :type="dateFormat(item.format, 'pickerType')" clearable></el-date-picker>
                      <!--日期-->
                    </el-form-item>
                  </el-form>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>

      <footer class="detail-footer mt-20 pl-20 pr-20">
      <div class="footer-title">
        <p class="user-name text-center" style="width: 110px;padding-left: 0;">
          <span>费用明细</span>
        </p>
      </div>
      <div style="padding: 20px;border: 1px solid #DDDDDD; border-top: none">
        <el-Table :data="socialTable" ref="socialTable" :paging="false" :key="refreshSocialTable">
          <template slot="empty"><span></span></template>
          <el-table-column>
            <el-table-column prop="itemTypeName" label="缴纳险种" width="200" header-align="left" align="left"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="payFrequencyName" label="费用频率" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true"></el-table-column>
          </el-table-column>
          <el-table-column label="单位缴纳" align="center">
            <el-table-column prop="dCompBase" label="单位基数" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="compRatioMin" label="单位比例" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p>{{scope.row.compRatioMin | calcRatio}}%</p>
              </template>
            </el-table-column>
            <el-table-column prop="dCompPay" label="单位费用" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true">
            </el-table-column>
          </el-table-column>
          <el-table-column label="个人缴纳" align="center">
            <el-table-column prop="dEmpTbBase" label="个人基数" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empRatioMin" label="个人比例" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p>{{scope.row.empRatioMin | calcRatio}}%</p>
              </template>
            </el-table-column>
            <el-table-column prop="dEmpPay" label="个人费用" min-width="120" header-align="left" align="left"
                             :show-overflow-tooltip="true">
            </el-table-column>
          </el-table-column>
        </el-Table>
        <div class="table-total" v-show="socialTable.length>0">
          <div class="table-total-all">
            <p>合计: <span class="text-green">{{socialForm.tableTotal}}</span></p>
          </div>
          <div class="table-total-detail">
            <p>单位合计: <span class="text-green">{{socialForm.tableCompTotal}}</span>
              （每年：<span class="mr-30">{{socialForm.tableCompYear}}</span>
              每月：<span class="mr-30">{{socialForm.tableCompMonth}}</span>
              一次性：<span>{{socialForm.tableCompOne}}</span>）</p>
            <p class="mt-15">个人合计: <span class="text-green">{{socialForm.tableEmpTotal}}</span>
              （每年：<span class="mr-30">{{socialForm.tableEmpYear}}</span>
              每月：<span class="mr-30">{{socialForm.tableEmpMonth}}</span>
              一次性：<span>{{socialForm.tableEmpOne}}</span>）</p>
          </div>
        </div>
        <!-- 公积金 -->
        <el-Table v-show="accfundTable.length>0" :data="accfundTable" ref="accfundTable" :key="refreshAccfundTable">
          <template slot="empty"><span></span></template>
          <el-table-column prop="itemTypeName" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="payFrequencyName" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="dCompBase" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="compRatioMin" min-width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{scope.row.compRatioMin | calcRatio}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="dCompPay" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="dEmpTbBase" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="empRatioMin" min-width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{scope.row.empRatioMin | calcRatio}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="dEmpPay" min-width="120" :show-overflow-tooltip="true"></el-table-column>
        </el-Table>
        <div class="table-total" v-show="accfundTable.length>0">
          <div class="table-total-all">
            <p>合计: <span class="text-green">{{accfundForm.tableTotal}}</span></p>
          </div>
          <div class="table-total-detail">
            <p>单位合计: <span class="text-green">{{accfundForm.tableCompTotal}}</span></p>
            <p class="mt-15">个人合计: <span class="text-green">{{accfundForm.tableEmpTotal}}</span></p>
          </div>
        </div>
      </div>
      <p class="mt-10">
        <span class="tip"><i class="el-icon-warning ic-tip-yellow"></i><span>当前费用明细为预估费用，最终以参保实付为准</span></span>
      </p>
      <div class="submit">
        <el-button class="mt-15" type="primary" @click="handleValid" :loading="saveBtnLoading">提交</el-button>
      </div>
    </footer>
    </div>
  </div>
</template>
<script>
import addrSelector from '../../components/common/addrSelector'
import { accMul, calFee, accAdd2, parseNumberFormat, onlyNumber, parseDateFormat, parsePickerType } from '../../utils/socialAccfundProduct'
export default {
  inject: ['reload'],
  components: { addrSelector },
  data () {
    return {
      rowSpan: 8,
      pathData: [
        { name: '社保公积金' },
        { name: '参保管理', path: '/socialAccfund/insuranceManage' },
        { name: '录入社保公积金调基' }
      ],
      refreshSocialKey: new Date().getTime() + 1,
      refreshAccfundKey: new Date().getTime() + 2,
      refreshSocialTable: new Date().getTime() + 3,
      refreshAccfundTable: new Date().getTime() + 4,
      socialForm: {
        addrArr: [],
        socialAddrId: '',
        socialAddrName: '',
        productList: [],
        productCode: '',
        productCodeItem: {},
        socialProductId: '',
        optrCompId: '', // 方案名称选中的操作公司（获取补充字段接口需要）
        socialProductName: '',
        empTbBase: '',
        fyDate: '',
        comment: '',
        fieldList: [],
        tableCompTotal: 0,
        tableCompYear: 0,
        tableCompMonth: 0,
        tableCompOne: 0,
        tableEmpTotal: 0,
        tableEmpYear: 0,
        tableEmpMonth: 0,
        tableEmpOne: 0,
        tableTotal: 0
      },
      accfundForm: {
        addrArr: [],
        accfundAddrId: '',
        accfundAddrName: '',
        productList: [],
        productCode: '',
        productCodeItem: {},
        accfundProductId: '',
        optrCompId: '', // 方案名称选中的操作公司（获取补充字段接口需要）
        accfundProductName: '',
        empTbBase: '',
        fyDate: '',
        comment: '',
        fieldList: [],
        tableCompTotal: 0,
        tableEmpTotal: 0,
        tableTotal: 0
      },
      socialTable: [],
      accfundTable: [],
      residence: '',
      selectEmployee: {
        loading: false,
        optionList: [],
        name: '',
        idCard: '',
        residenceType: '',
        empId: ''
      },
      saveBtnLoading: false,
      changeType: 3, // changeType 申报类型（1：增员，2：减员，3：调基，4：方案变更）
      formKey: ''
    }
  },
  computed: {},
  filters: {
    calcRatio (rows, type) {
      let res = accMul(rows, 100)
      return res
    }
  },
  mounted () {
  },
  created () {
    this.remoteMethod('')
    this.getFormKey()
    this.getAddrArr()
  },

  methods: {
    // 获取表单提交唯一的key
    getFormKey () {
      // type:社保1公积金2
      this.$http({
        url: '/api/socialAccfund/formKey',
        method: 'get'
      }).then(({ data }) => {
        this.formKey = data.data[0]
      }).catch((data) => {})
    },
    // 获取参保地
    getAddrArr () {
      // type:社保1公积金2
      this.$http({
        url: '/api/socialAccfund/addresses',
        method: 'get'
      }).then(({ data }) => {
        this.socialForm.addrArr = data.data[0].social
        this.accfundForm.addrArr = data.data[0].accfund
      })
    },
    // 根据参保地获取社保方案
    getSocailProducts () {
      // type:社保1公积金2
      if (this.$lodash.isEmpty(this.socialForm.socialAddrId) || this.$lodash.isEmpty(this.socialForm.socialAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard) || this.$lodash.isEmpty(this.socialForm.fyDate)) {
        return false
      }
      this.$http({
        url: '/api/socialAccfund/socailProducts',
        method: 'post',
        data: {
          addressId: this.socialForm.socialAddrId,
          addressName: this.socialForm.socialAddrName,
          changeType: this.changeType,
          fyDate: this.socialForm.fyDate,
          idCard: this.selectEmployee.idCard
        }
      }).then(({ data }) => {
        this.socialForm.productList = data.data[0]
        let isHave = false // 用于判断已选的方案是否还在
        for (let i = 0; i < data.data[0].length; i++) {
          if (data.data[0][i].id == this.socialForm.socialProductId) {
            isHave = true
            break
          }
        }
        if (!isHave) {
          if (data.data[0].length == 1) {
            this.socialForm.productCodeItem = data.data[0][0]
            this.changeSocialProductCode(data.data[0][0])
          } else {
            if (this.socialForm.socialProductId != '') {
              this.socialForm.productCodeItem = {}
              this.socialForm.productCode = ''
              this.socialForm.socialProductName = ''
              this.socialForm.socialProductId = ''
              this.socialForm.optrCompId = ''
              this.socialTable = []
              this.calcSocialTable()
            }
          }
        }
      }).catch((data) => {})
    },

    // 根据参保地获取社保方案
    getAccfundProducts () {
      // type:社保1公积金2
      if (this.$lodash.isEmpty(this.accfundForm.accfundAddrId) || this.$lodash.isEmpty(this.accfundForm.accfundAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard) || this.$lodash.isEmpty(this.accfundForm.fyDate)) {
        return false
      }
      this.$http({
        url: '/api/socialAccfund/accfundProducts',
        method: 'post',
        data: {
          addressId: this.accfundForm.accfundAddrId,
          addressName: this.accfundForm.accfundAddrName,
          changeType: this.changeType,
          fyDate: this.accfundForm.fyDate,
          idCard: this.selectEmployee.idCard
        }
      }).then(({ data }) => {
        this.accfundForm.productList = data.data[0]
        let isHave = false // 用于判断已选的方案是否还在
        for (let i = 0; i < data.data[0].length; i++) {
          if (data.data[0][i].id == this.accfundForm.accfundProductId) {
            isHave = true
            break
          }
        }
        if (!isHave) {
          if (data.data[0].length == 1) {
            this.accfundForm.productCodeItem = data.data[0][0]
            this.changeAccfundProductCode(data.data[0][0])
          } else {
            if (this.accfundForm.accfundProductId != '') {
              this.accfundForm.productCodeItem = {}
              this.accfundForm.productCode = ''
              this.accfundForm.accfundProductName = ''
              this.accfundForm.optrCompId = ''
              this.accfundForm.accfundProductId = ''
              this.accfundTable = []
              this.calcAccfundTable()
            }
          }
        }
      }).catch((data) => {})
    },

    // 获取社保公积金补充字段
    getDeclareColumnDs (type) {
      // type:社保1公积金2
      let addressName = ''
      let optrCompId = ''
      if (type === 1) {
        if (this.$lodash.isEmpty(this.socialForm.socialAddrId) || this.$lodash.isEmpty(this.socialForm.socialAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard) || this.socialForm.optrCompId == '') {
          return false
        }
        addressName = this.socialForm.socialAddrName
        optrCompId = this.socialForm.optrCompId
      } else {
        if (this.$lodash.isEmpty(this.accfundForm.accfundAddrId) || this.$lodash.isEmpty(this.selectEmployee.idCard) || this.accfundForm.optrCompId == '') {
          return false
        }
        addressName = this.accfundForm.accfundAddrName
        optrCompId = this.accfundForm.optrCompId
      }

      this.$http({
        url: '/api/socialAccfund/declareColumnDs',
        method: 'post',
        data: {
          addressName: addressName,
          bussinessType: type,
          changeType: this.changeType,
          idCard: this.selectEmployee.idCard,
          optrCompId: optrCompId
        }
      }).then(({ data }) => {
        if (type === 1) {
          this.socialForm.fieldList = data.data[0]
          this.refreshSocialKey = new Date().getTime()
        } else {
          this.accfundForm.fieldList = data.data[0]
          this.refreshAccfundKey = new Date().getTime()
        }
      })
    },

    // 远程过滤人员
    remoteMethod (query) {
      let that = this
      this.selectEmployee.loading = true
      setTimeout(() => {
        that.selectEmployee.loading = false
        that.$http({
          url: '/api/employee/search',
          method: 'post',
          data: { nameOrIdcard: query }
        }).then(({ data }) => {
          this.selectEmployee.optionList = data.data[0]
        })
      }, 800)
    },

    // 选择人员
    changeSelectEmp () {
      let item
      for (let i = 0; i < this.selectEmployee.optionList.length; i++) {
        item = this.selectEmployee.optionList[i]
        if (item.employeeId == this.selectEmployee.empId) {
          this.selectEmployee.name = item.name
          this.selectEmployee.idCard = item.idCard
          this.selectEmployee.residenceType = item.residenceType === 'null' ? '' : item.residenceType
          break
        }
      }
      this.getSocialAddrType()
      this.getSocailProducts()
      this.getDeclareColumnDs(1)
      this.getAccfundProducts()
      this.getDeclareColumnDs(2)
    },
    getSocialAddrId (item) {
      this.socialForm.socialAddrId = item.id
      this.getSocialAddrType()
      this.getSocailProducts()
      this.getDeclareColumnDs(1)
    },
    getAccfundAddrId (item) {
      this.accfundForm.accfundAddrId = item.id
      this.getAccfundProducts()
      this.getDeclareColumnDs(2)
    },
    // 改变社保-方案名称
    changeSocialProductCode (item) {
      this.socialForm.productCode = item.productCode
      this.socialForm.socialProductName = item.productName
      this.socialForm.socialProductId = item.id
      this.socialForm.optrCompId = item.optrCompId
      if (!this.$lodash.isEmpty(item)) {
        this.socialTable = item.policySocialItemVos
      } else {
        this.socialTable = []
      }
      this.getDeclareColumnDs(1)
      this.calcSocialTable()
    },
    // 改变公积金-方案名称
    changeAccfundProductCode (item) {
      this.accfundForm.productCode = item.productCode
      this.accfundForm.accfundProductName = item.productName
      this.accfundForm.accfundProductId = item.id
      this.accfundForm.optrCompId = item.optrCompId
      if (!this.$lodash.isEmpty(item)) {
        this.accfundTable = item.items
      } else {
        this.accfundTable = []
      }
      this.getDeclareColumnDs(2)
      this.calcAccfundTable()
    },

    // 获取人员社保增员户口性质（本地or外地）
    getSocialAddrType () {
      if (this.$lodash.isEmpty(this.socialForm.socialAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard)) {
        this.residence = ''
        return false
      }
      this.$http({
        url: '/api/socialAccfund/socialAddrType',
        method: 'get',
        params: { addressName: this.socialForm.socialAddrName, idCard: this.selectEmployee.idCard }
      }).then(({ data }) => {
        this.residence = data.data[0]
      }).catch((data) => {
        this.socialForm.socialAddrName = ''
        this.socialForm.socialAddrId = ''
      })
    },

    handleValid () {
      if (!this.checkSocialRequired() && !this.checkAccfundRequired()) {
        this.$message.warning('请先填写调基数据')
        this.saveBtnLoading = false
        return
      }
      this.saveBtnLoading = true
      var socialFieldValid = true
      var accfundFieldValid = true
      var socialFormValid = true
      // 校验补充字段
      for (var q = 0; q < this.socialForm.fieldList.length; q++) {
        this.$refs['socialFieldForm' + q][0].validate((valid) => {
          if (socialFieldValid) {
            socialFieldValid = valid
          }
        })
      }
      for (var y = 0; y < this.accfundForm.fieldList.length; y++) {
        this.$refs['accfundFieldForm' + y][0].validate((valid) => {
          if (accfundFieldValid) {
            accfundFieldValid = valid
          }
        })
      }
      this.$refs.socialForm.validate((valid) => {
        socialFormValid = valid
        this.$refs.accfundForm.validate((valid2) => {
          if (valid2 && socialFormValid && socialFieldValid && accfundFieldValid) {
            this.save()
          } else {
            this.saveBtnLoading = false
            return false
          }
        })
      })
    },

    save () {
      var accfundSuppDetails = []
      var socialSuppDetails = []

      var socialItem
      for (var i = 0; i < this.socialForm.fieldList.length; i++) {
        socialItem = this.socialForm.fieldList[i]
        socialSuppDetails.push({ columName: socialItem.declareColumnName, columValue: socialItem.value })
      }
      var accfundItem
      for (var j = 0; j < this.accfundForm.fieldList.length; j++) {
        accfundItem = this.accfundForm.fieldList[j]
        accfundSuppDetails.push({ columName: accfundItem.declareColumnName, columValue: accfundItem.value })
      }
      var setObj = {
        empAccfundChange: {
          accfundAddrId: this.accfundForm.accfundAddrId,
          accfundAddrName: this.accfundForm.accfundAddrName,
          accfundProductId: this.accfundForm.accfundProductId,
          accfundProductName: this.accfundForm.accfundProductName,
          changeType: this.changeType,
          comment: this.accfundForm.comment,
          fyDate: this.accfundForm.fyDate,
          productCode: this.accfundForm.productCode,
          accfundSuppDetails: accfundSuppDetails,
          empTbBase: Number(this.accfundForm.empTbBase)
        },

        empSocialChange: {
          changeType: this.changeType,
          comment: this.socialForm.comment,
          fyDate: this.socialForm.fyDate,
          productCode: this.socialForm.productCode,
          socialAddrId: this.socialForm.socialAddrId,
          socialAddrName: this.socialForm.socialAddrName,
          socialProductId: this.socialForm.socialProductId,
          socialProductName: this.socialForm.socialProductName,
          socialSuppDetails: socialSuppDetails,
          empTbBase: Number(this.socialForm.empTbBase)
        },
        empIdCard: this.selectEmployee.idCard,
        empName: this.selectEmployee.name,
        formKey: this.formKey
      }
      this.$http({
        url: '/api/socialAccfund',
        method: 'post',
        data: setObj
      }).then(({ data }) => {
        this.$message.success('提交成功')
        this.$router.replace('/socialAccfund/insuranceManage')
      }).catch((data) => {
        this.saveBtnLoading = false
      })
    },

    refreshTable () {
      this.reload()
    },

    calcSocialTable () {
      let empTbBase = this.socialForm.empTbBase
      if (empTbBase == '' || this.socialForm.socialProductId == '') {
        this.refreshSocialTable = new Date().getTime()
        return false
      }
      let dEmpTbBase = ''
      let dCompBase = ''

      let compBaseMinTotal = 0
      let empBaseMinTotal = 0
      let minTotal = 0
      let compBaseMinItem = 0
      let empBaseMinItem = 0

      let tableCompYear = 0
      let tableCompMonth = 0
      let tableCompOne = 0
      let tableEmpYear = 0
      let tableEmpMonth = 0
      let tableEmpOne = 0
      this.socialTable.forEach((item, index) => {
        // 计算单位部分
        if (empTbBase < item.compBaseMin) {
          dCompBase = item.compBaseMin
        } else if (empTbBase > item.compBaseMax) {
          dCompBase = item.compBaseMax
        } else {
          dCompBase = empTbBase
        }

        item.dCompBase = dCompBase
        // 计算单位缴纳
        item.dCompPay = calFee(dCompBase, item.compRatioMin, item.compCalAccuCode) // 根据各项险种的精度计算
        compBaseMinItem = item.dCompPay

        // 计算个人部分
        if (empTbBase < item.empBaseMin) {
          dEmpTbBase = item.empBaseMin
        } else if (empTbBase > item.empBaseMax) {
          dEmpTbBase = item.empBaseMax
        } else {
          dEmpTbBase = empTbBase
        }
        item.dEmpTbBase = dEmpTbBase
        // 计算个人缴纳
        item.dEmpPay = calFee(dEmpTbBase, item.empRatioMin, item.empCalAccuCode)
        empBaseMinItem = item.dEmpPay

        //  计算详细各项
        /* {dictCode: 10008004, dictName: '每年'},
        {dictCode: 10008001, dictName: '每月'},
     {dictCode: 10008005, dictName: '一次性'} */
        if (item.payFrequencyCode == 10008004) {
          //  每年
          tableCompYear = accAdd2(tableCompYear, compBaseMinItem)
          tableEmpYear = accAdd2(tableEmpYear, empBaseMinItem)
        } else if (item.payFrequencyCode == 10008001) {
          // 每月
          tableCompMonth = accAdd2(tableCompMonth, compBaseMinItem)
          tableEmpMonth = accAdd2(tableEmpMonth, empBaseMinItem)
        } else if (item.payFrequencyCode == 10008005) {
          // 一次性
          tableCompOne = accAdd2(tableCompOne, compBaseMinItem)
          tableEmpOne = accAdd2(tableEmpOne, empBaseMinItem)
        }

        compBaseMinTotal = accAdd2(compBaseMinTotal, compBaseMinItem)
        empBaseMinTotal = accAdd2(empBaseMinTotal, empBaseMinItem)
      })
      // 合计
      compBaseMinTotal = calFee(compBaseMinTotal, 1, this.socialForm.productCodeItem.compCalAccuCode)
      empBaseMinTotal = calFee(empBaseMinTotal, 1, this.socialForm.productCodeItem.empCalAccuCode)
      minTotal = calFee(accAdd2(compBaseMinTotal, empBaseMinTotal), 1, this.socialForm.productCodeItem.calAccuCode)

      tableCompYear = calFee(tableCompYear, 1, this.socialForm.productCodeItem.compCalAccuCode)
      tableEmpYear = calFee(tableEmpYear, 1, this.socialForm.productCodeItem.empCalAccuCode)

      tableCompMonth = calFee(tableCompMonth, 1, this.socialForm.productCodeItem.compCalAccuCode)
      tableEmpMonth = calFee(tableEmpMonth, 1, this.socialForm.productCodeItem.empCalAccuCode)

      tableCompOne = calFee(tableCompOne, 1, this.socialForm.productCodeItem.compCalAccuCode)
      tableEmpOne = calFee(tableEmpOne, 1, this.socialForm.productCodeItem.empCalAccuCode)

      this.socialForm.tableCompTotal = compBaseMinTotal
      this.socialForm.tableCompYear = tableCompYear == '' ? 0 : tableCompYear
      this.socialForm.tableCompMonth = tableCompMonth == '' ? 0 : tableCompMonth
      this.socialForm.tableCompOne = tableCompOne == '' ? 0 : tableCompOne

      this.socialForm.tableEmpTotal = empBaseMinTotal
      this.socialForm.tableEmpYear = tableEmpYear == '' ? 0 : tableEmpYear
      this.socialForm.tableEmpMonth = tableEmpMonth == '' ? 0 : tableEmpMonth
      this.socialForm.tableEmpOne = tableEmpOne == '' ? 0 : tableEmpOne

      this.socialForm.tableTotal = minTotal

      this.refreshSocialTable = new Date().getTime()
    },
    calcAccfundTable () {
      let empTbBase = this.accfundForm.empTbBase
      if (empTbBase == '') {
        return false
      }
      let dEmpTbBase = ''
      let dCompBase = ''

      let compBaseMinTotal = 0
      let empBaseMinTotal = 0
      let minTotal = 0
      let compBaseMinItem = 0
      let empBaseMinItem = 0
      this.accfundTable.forEach((item, index) => {
        // 单位缴纳部分

        if (empTbBase < item.compBaseMin) {
          dCompBase = item.compBaseMin
        } else if (empTbBase > item.compBaseMax) {
          dCompBase = item.compBaseMax
        } else {
          dCompBase = empTbBase
        }

        item.dCompBase = dCompBase
        // 计算单位缴纳
        item.dCompPay = calFee(dCompBase, item.compRatioMin, item.compCalAccuCode)
        compBaseMinItem = item.dCompPay

        // 个人缴纳部分
        if (empTbBase < item.empBaseMin) {
          dEmpTbBase = item.empBaseMin
        } else if (empTbBase > item.empBaseMax) {
          dEmpTbBase = item.empBaseMax
        } else {
          dEmpTbBase = empTbBase
        }
        item.dEmpTbBase = dEmpTbBase
        // 计算个人缴纳
        item.dEmpPay = calFee(dEmpTbBase, item.empRatioMin, item.empCalAccuCode)
        empBaseMinItem = item.dEmpPay

        compBaseMinTotal = accAdd2(compBaseMinTotal, compBaseMinItem)
        empBaseMinTotal = accAdd2(empBaseMinTotal, empBaseMinItem)
      })

      //  合计
      compBaseMinTotal = calFee(compBaseMinTotal, 1, this.accfundForm.productCodeItem.compCalAccuCode)
      empBaseMinTotal = calFee(empBaseMinTotal, 1, this.accfundForm.productCodeItem.empCalAccuCode)
      minTotal = calFee(accAdd2(compBaseMinTotal, empBaseMinTotal), 1, this.accfundForm.productCodeItem.calAccuCode)

      this.accfundForm.tableCompTotal = compBaseMinTotal
      this.accfundForm.tableEmpTotal = empBaseMinTotal
      this.accfundForm.tableTotal = minTotal
      this.refreshAccfundTable = new Date().getTime()
    },

    checkSocialRequired () {
      let socialAddrId = this.socialForm.socialAddrId
      let productCode = this.socialForm.productCode
      let fyDate = this.socialForm.fyDate
      let empTbBase = this.socialForm.empTbBase
      if (this.$lodash.isEmpty(socialAddrId) && this.$lodash.isEmpty(productCode) && this.$lodash.isEmpty(fyDate) && this.$lodash.isEmpty(empTbBase)) {
        this.$refs.socialForm.clearValidate()
        for (var q = 0; q < this.socialForm.fieldList.length; q++) {
          this.$refs['socialFieldForm' + q][0].clearValidate()
        }
        return false
      } else {
        return true
      }
    },
    checkSocialForm (rule, value, callback, msg) {
      if (this.$lodash.isEmpty(value)) {
        if (this.checkSocialRequired()) {
          callback(new Error(msg))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkAccfundRequired () {
      let socialAddrId = this.accfundForm.socialAddrId
      let productCode = this.accfundForm.productCode
      let fyDate = this.accfundForm.fyDate
      let empTbBase = this.accfundForm.empTbBase
      if (this.$lodash.isEmpty(socialAddrId) && this.$lodash.isEmpty(productCode) && this.$lodash.isEmpty(fyDate) && this.$lodash.isEmpty(empTbBase)) {
        this.$refs.accfundForm.clearValidate()
        for (var q = 0; q < this.accfundForm.fieldList.length; q++) {
          this.$refs['accfundFieldForm' + q][0].clearValidate()
        }
        return false
      } else {
        return true
      }
    },
    checkAccfundForm (rule, value, callback, msg) {
      if (this.$lodash.isEmpty(value)) {
        if (this.checkAccfundRequired()) {
          callback(new Error(msg))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },

    checkSocialBase (rule, value, callback) {
      var numberExp = /^(-?\d+)(\.\d+)?$/
      let minBase
      let maxBase
      let baseInsured
      if (this.$lodash.isEmpty(value)) {
        callback()
      }
      if (numberExp.test(value)) {
        minBase = this.socialForm.productCodeItem.minBase
        maxBase = this.socialForm.productCodeItem.maxBase
        baseInsured = this.socialForm.productCodeItem.baseInsured
        if (baseInsured != 1 && minBase && (value < minBase || value > maxBase)) {
          callback(new Error('基数范围为' + minBase + '~' + maxBase))
        } else {
          this.calcSocialTable()
          callback()
        }
      } else {
        callback(new Error('请输入正确数值格式'))
      }
    },
    checkAccfundBase (rule, value, callback) {
      var numberExp = /^(-?\d+)(\.\d+)?$/
      let minBase
      let maxBase
      let baseInsured
      if (this.$lodash.isEmpty(value)) {
        callback()
      }
      if (numberExp.test(value)) {
        minBase = this.accfundForm.productCodeItem.minBase
        maxBase = this.accfundForm.productCodeItem.maxBase
        baseInsured = this.accfundForm.productCodeItem.baseInsured
        if (baseInsured != 1 && minBase && (value < minBase || value > maxBase)) {
          callback(new Error('基数范围为' + minBase + '~' + maxBase))
        } else {
          this.calcAccfundTable()
          callback()
        }
      } else {
        callback(new Error('请输入正确数值格式'))
      }
    },

    //  校验动态字段的类型
    fieldInputBlur (index, type) {
      let fieldList = this[type].fieldList
      let item = fieldList[index]
      let inputType = item.inputType
      let exportFormat = item.format
      let valueView = item.value
      let numberOfDecimals = 6// 默认小数位数

      if (inputType == '40009002' || inputType == '40009001') { // 字符、文字
        return false
      } else if (inputType == '40009004' || inputType == '40009005' || inputType == '40009003') { // 百分比、货币格式
        if (exportFormat != null && exportFormat != '') {
          numberOfDecimals = parseNumberFormat(exportFormat + '')
        } else {
          numberOfDecimals = 2// 百分比、货币默认两位小数
        }
        if (inputType == '40009004') { //  百分比
          item.value = onlyNumber(valueView, numberOfDecimals, 'percent')
        } else if (inputType == '40009005') { // 货币
          item.value = onlyNumber(valueView, numberOfDecimals, 'currency')
        } else {
          item.value = onlyNumber(valueView)
        }
      }
    },
    dateFormat (code, type) {
      console.log(code)
      if (type == 'format') {
        //  获取格式
        return parseDateFormat(code)
      } else if (type == 'pickerType') {
        //  获取日期控件类型
        let res = parsePickerType(code)
        console.log(res)
        return res
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../assets/css/socialAccfund/decrease.less';
</style>
