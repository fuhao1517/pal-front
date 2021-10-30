<template>
  <div class="content">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="fr header-button">
      <el-button icon="el-icon-refresh" size="small" @click="handleRefresh">刷新</el-button>
      <router-link to="/commerceInsurance/insuranceAdmin">
        <el-button class="ml-20" icon="el-icon-arrow-left" size="small">返回</el-button>
      </router-link>
    </div>

    <header class="clearfix">
      <h3 class="fl">增员</h3>
    </header>

    <div class="header-search">
      <el-select class="search-select" v-model="selectEmployee" filterable remote reserve-keyword  value-key="employeeId" placeholder="请输入姓名、证件号码" @change="empChange" :remote-method="remoteMethod">
        <template slot="prefix"><i class="el-icon-search ic-search"></i></template>
        <el-option v-for="(item, index) in employeeList" :key="index" :label="item.name + '-' + item.idCard" :value="item"></el-option>
      </el-select>
    </div>

    <div class="text-center" v-show="(!selectEmployee.idCard)||selectEmployee.idCard==''">
      <i class="ic-employee-empty"></i>
      <p class="mt-30">请先搜索人员！</p>
    </div>

    <div v-show="selectEmployee.idCard&&selectEmployee.idCard!=''">
    <div class="form-detail pb-20" style="background:#fff;">
      <div class="detail-title mt-20">
        <p class="fl user-name" :title="this.selectEmployee.name ? this.selectEmployee.name : '请选择员工'">
          <span class="mr-10" v-text="this.selectEmployee.name ? this.selectEmployee.name : '请选择员工'"></span>
        </p>
        <p class="fl ml-20 mr-40">
           <span class="mr-10" v-text="this.selectEmployee.idCard ? '证件号码：' + this.selectEmployee.idCard : '' "></span>
        </p>
      </div>
      <!-- 员工方案 -->
      <div class="family pl-20 pr-20">

        <div class="employee-title">
          <img class="fl ml-10" src="../../assets/images/icons/ic-account-type31.png" alt="">
          <p class="fl title-name">员工方案</p>
        </div>

        <el-form v-for="(item, index) in employeeForm" :model="employeeForm[index]" :ref="'employeeForm' + index" :key="index" :inline="true" class="demo-form-inline mt-20">
          <div class="ml-13">
            <el-form-item prop="productInfo" label="方案代码:" style="position: relative; bottom:4px;" :rules="[{ validator: (rule, value, callback) => checkEmpInfos(rule, value, callback, index, 1), trigger: 'change' }]">
              <el-select v-model="employeeForm[index].productInfo" value-key="id" placeholder="请选择" @change="selectProductCode(1, index, $event)">
                <el-option v-for="(item,index) in employeeProductCodeList" :key="index" :label="item.code" :value="item"></el-option>
              </el-select>
              <img style="position: absolute; right:10px; top:13px;" src="../../assets/images/icons/ic-account-type33.png" alt="">
            </el-form-item>
            <el-form-item prop="startDate" label="开始时间:" style="position: relative;" :rules="[{ validator: (rule, value, callback) => checkEmpInfos(rule, value, callback, index, 2), trigger: 'change' }]">
              <el-date-picker v-show="employeeDefault"></el-date-picker>
              <el-date-picker v-if="employeeDay" value-format="yyyy-MM-dd" v-model="employeeForm[index].startDate" type="date" @input="selectStartDate(1, index)"
                              :value-format="empDateFormat[index]" :format="empDateFormat[index]"></el-date-picker>
              <el-date-picker v-if="employeeMonth" value-format="yyyy-MM-dd" v-model="employeeForm[index].startDate" type="month" @input="selectStartDate(1, index)"
                              :value-format="empDateFormat[index]" :format="empDateFormat[index]"></el-date-picker>
              <img style="position: absolute; right:2px; top:10px;" src="../../assets/images/icons/ic-account-type34.png" alt="">
            </el-form-item>
            <el-form-item prop="jobPosition" label="岗位:" :rules="[{ validator: (rule, value, callback) => checkEmpInfos(rule, value, callback, index, 3), trigger: 'change' }]">
              <el-input v-model="employeeForm[index].jobPosition"></el-input>
              <img v-show="employeeForm.length > 1" style="position: absolute; right:-25px; top:5px;" class="f-cursor" src="../../assets/images/icons/ic-account-type36.png" alt="" @click="deleteForm(1, index)">
            </el-form-item>
          </div>
          <div class="ml-13" v-show="employeePriceRules[index] === '1'">
            <el-form-item prop="radio" label="有无社保:" style="position: relative;" :rules="[{ validator: (rule, value, callback) => hasSocialCheck(rule, value, callback, index, 1), trigger: 'change' }]">
              <el-radio v-model="employeeForm[index].hasSocial" label="1">有</el-radio>
              <el-radio v-model="employeeForm[index].hasSocial" label="2">无</el-radio>
            </el-form-item>
          </div>
        </el-form>
        <div class="add-method f-cursor" @click="addEmployeeMethod"><i class="el-icon-plus mr-10"></i> 添加方案</div>
      </div>

      <!-- 家属方案 -->
      <div class="family pl-20 pr-20">

        <div class="employee-title">
          <img class="fl ml-10" src="../../assets/images/icons/ic-account-type32.png" alt="">
          <p class="fl title-name">家属方案</p>
        </div>

        <el-form v-for="(item, index) in familyForm" :model="familyForm[index]" :ref="'familyForm' + index" :key="index" :inline="true" class="demo-form-inline mt-20">
          <div class="ml-13">
            <el-form-item label="家属名称:" prop="name" style="position: relative;" :rules="[{ required: true, message: '请输入家属名称', trigger: 'change'}]">
              <el-input v-model="familyForm[index].name" @change="familyNameChange(index)"></el-input>
            </el-form-item>
            <el-form-item label="证件类型:" prop="cardType" :rules="[{ required: true, message: '请选择证件类型', trigger: 'change'}]">
              <el-select v-model="familyForm[index].cardType" placeholder="请选择">
                <el-option v-for="(item,index) in cardType" :label="item.dictName" :key="index" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码:" prop="empIdCard" :rules="[{ required: true, message: '请输入证件号码', trigger: 'change' }, { validator: (rule, value, callback) => checkIdCard(rule, value, callback, index), trigger: 'change' }]">
              <el-input v-model="familyForm[index].empIdCard"></el-input>
              <img style="position: absolute; right:-25px; top:32px;" class="f-cursor" src="../../assets/images/icons/ic-account-type36.png" alt="" @click="deleteForm(2, index)">
            </el-form-item>
          </div>

          <div>
            <el-form-item label="与员工关系:" prop="relation" style="position: relative;" :rules="[{ required: true, message: '请选择与员工关系', trigger: 'change'}]">
              <el-select v-model="familyForm[index].relation" placeholder="请选择">
                <el-option v-for="(item,index) in relation" :label="item.dictName" :key="index" :value="item.dictCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="方案代码:" prop="productInfo" :rules="[{ required: true, message: '请选择方案代码', trigger: 'change'}, { validator: (rule, value, callback) => checkFamilyMsg(rule, value, callback, index, 3), trigger: 'change' }]">
              <el-select v-model="familyForm[index].productInfo" value-key="id" placeholder="请选择" @change="selectProductCode(2, index)">
                <el-option v-for="(item,index) in familyProductCodeList" :key="index" :label="item.code" :value="item"></el-option>
              </el-select>
              <img style="position: absolute; right:10px; top:13px;" src="../../assets/images/icons/ic-account-type33.png" alt="">
            </el-form-item>
            <el-form-item label="开始时间:" prop="startDate" style="position: relative; margin-left: 10px;" :rules="[{ validator: (rule, value, callback) => checkFamilyMsg(rule, value, callback, index, 4), trigger: 'change' }]">
              <i style="color:#F56C6C; position: absolute;left: -12px;">*</i>
              <el-date-picker v-show="familyFormDefault" type="date" style="width:260px;"></el-date-picker>
              <el-date-picker @input="selectStartDate(2, index)" v-if="familyFormDay" value-format="yyyy-MM-dd" v-model="familyForm[index].startDate" type="date" style="width:260px;"
                              :value-format="familyDateFormat[index]" :format="familyDateFormat[index]"></el-date-picker>
              <el-date-picker @input="selectStartDate(2, index)" v-if="familyFormMonth" value-format="yyyy-MM-dd" v-model="familyForm[index].startDate" type="month" style="width:260px;"
                              :value-format="familyDateFormat[index]" :format="familyDateFormat[index]"></el-date-picker>
              <img style="position: absolute; right:10px; top:10px;" src="../../assets/images/icons/ic-account-type34.png" alt="">
            </el-form-item>
          </div>
          <div>
            <div style="width:355px;">
              <el-form-item v-show="familyForm[index].cardType && familyForm[index].cardType != '50010001'" prop="sex" label="性别:" style="position: relative; margin-left:43px;" :rules="[{ validator: (rule, value, callback) => checkFamilyMsg(rule, value, callback, index, 1), trigger: 'change' }]">
                <i style="color:#F56C6C; margin:0 16px 0 -12px;">*</i>
                <el-radio v-model="familyForm[index].sex" label="1">男</el-radio>
                <el-radio v-model="familyForm[index].sex" label="2">女</el-radio>
              </el-form-item>
            </div>
            <div style="width:380px;">
              <el-form-item v-show="familyForm[index].cardType && familyForm[index].cardType != '50010001'" style="margin-left:20px; position: relative;"  label="出生日期:" prop="birthday" :rules="[{ validator: (rule, value, callback) => checkFamilyMsg(rule, value, callback, index, 2), trigger: 'change' }]">
                <i style="color:#F56C6C; position: absolute;left: -12px;">*</i>
                <el-date-picker value-format="yyyy-MM-dd" v-model="familyForm[index].birthday" type="date" style="width:260px; margin-left:12px;"></el-date-picker>
                <img style="position: absolute; right:10px; top:10px;" src="../../assets/images/icons/ic-account-type34.png" alt="">
              </el-form-item>
            </div>
            <div style="width:355px;">
              <el-form-item v-show="familyPriceRules[index] === '1'" prop="radio" label="有无社保:" style="position: relative;" :rules="[{ validator: (rule, value, callback) => hasSocialCheck(rule, value, callback, index, 2), trigger: 'change' }]">
                <i style="color:#F56C6C; margin:0 16px 0 -12px;">*</i>
                <el-radio v-model="familyForm[index].hasSocial" label="1">有</el-radio>
                <el-radio v-model="familyForm[index].hasSocial" label="2">无</el-radio>
              </el-form-item>
            </div>
         </div>
        </el-form>
        <div class="add-method f-cursor" @click="addFamilyMethod"><i class="el-icon-plus mr-10"></i>添加方案</div>
      </div>
    </div>

    <!-- 表格 -->
    <footer class="detail-footer">
      <div class="footer-title">
        <p class="user-name" :title="this.selectEmployee.name ? this.selectEmployee.name : '请选择员工'">
          <span class="mr-10" v-text="this.selectEmployee.name ? this.selectEmployee.name : '请选择员工'"></span>
        </p>
      </div>
      <el-Table :data="tableDatas" ref="tableDatas" height="500" :tableHeight="tableHeight" :header-row-style="{background:'#f2f2f2',color:'#606266'}" :paging="false" :showIndex="false" border :span-method="objectSpanMethod">
        <el-table-column label="商保方案代码" width="200" header-align="center" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-text="scope.row.tag == 1 ? scope.row.code : scope.row.code + '(家属：' + (familyNames[scope.row.index] ? familyNames[scope.row.index] : '') + ')'"> </span>
          </template>
        </el-table-column>
        <el-table-column prop="salePrice" label="保费" width="200" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="itemName" label="险种名称" width="500" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="保险责任" width="500" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="limitDesc" label="保额" min-width="300" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
      </el-Table>
      <div class="submit" style="background:#fff;">
        <el-button class="mt-70" type="primary" @click="save" :loading="saveBtnLoading">提交</el-button>
      </div>
    </footer>
    </div>
  </div>
</template>
<script>
export default {
  inject: ['reload'],
  data () {
    return {
      pathData: [
        {name: '商保'},
        {name: '投保管理', path: '/commerceInsurance/insuranceAdmin'},
        {name: '录入商保增员'}
      ],
      tableDatas: [], // 表格数据
      empTableDatas: [],
      familyTableDatas: [],
      cardType: [], // 证件类型
      relation: [], // 与员工关系
      selectEmployee: {}, // 选择的人员
      employeePriceRules: [], // 员工方案定价模式
      familyPriceRules: [], // 家属方案定价模式

      employeeDefault: true,
      employeeMonth: false,
      employeeDay: false,
      familyFormDefault: true,
      familyFormMonth: false,
      familyFormDay: false,

      employeeList: [], // 人员列表
      employeeProductCodeList: [], // 员工方案代码列表
      familyProductCodeList: [], // 家属方案代码列表
      employeeForm: [], // 员工数组
      familyForm: [], // 家属数组
      saveBtnLoading: false,
      familyNames: [], // 用来存储家属姓名

      rowAndColumn: {}, // 第一列
      rowAndColumn1: {}, // 第二列
      rowAndColumn2: {}, // 第三列

      empDateFormat: [],
      familyDateFormat: []
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 600 + 'px'
    }
  },
  created () {
    this.$nextTick(() => {
      this.employeeForm.push({})
      this.empDateFormat.push('yyyy-MM-dd')
    })
  },
  mounted () {
    this.getEmployeeList()
    this.getEmployeeProductCodeList()
    this.getRelations()
    this.getCardTypes()
  },
  methods: {
    // 远程过滤人员
    remoteMethod (query) {
      let that = this
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          that.selectEmployee.loading = false
          that.$http({
            url: '/api/comminsure/employee/search',
            method: 'post',
            data: this.$qs.stringify({
              custId: this.$store.state.userData.custId,
              key: query
            })
          }).then(({ data }) => {
            this.employeeList = data.data[0]
          })
        }, 500)
      } else {
        this.employeeList = []
      }
    },

    // 选择方案代码
    selectProductCode (type, index) {
      // 选择员工方案
      if (type === 1) {
        // 选择方案后要先清空日期，可能由日结变成月结
        this.employeeForm[index].startDate = '';
        var productInfo = this.employeeForm[index].productInfo
        // 现在 年付、月付，开始时间统一精确到日；年付月结精确到月
        var isPayDay = productInfo.payCycleCode === '20102002' && productInfo.settleType != '30005001' // 年付非月结
        var isPayMonth = productInfo.payCycleCode === '20102001' // 月付
        if (isPayDay || isPayMonth) {
          this.employeeMonth = false
          this.employeeDay = true
          this.employeeDefault = false
          this.empDateFormat[index] = 'yyyy-MM-dd'
        } else { // 年付月结
          this.employeeDay = false
          this.employeeMonth = true
          this.employeeDefault = false
          this.empDateFormat[index] = 'yyyy-MM-01'
        }
        // 保存选择的方案定价模式
        this.employeePriceRules[index] = productInfo.priceRule
      } else {
        // 选择方案后要先清空日期，可能由日结变成月结
        this.familyForm[index].startDate = '';
        var productInfo = this.familyForm[index].productInfo
        // 现在 年付、月付，开始时间统一精确到日；年付月结精确到月
        var isPayDay = productInfo.payCycleCode === '20102002' && productInfo.settleType != '30005001' // 年付非月结
        var isPayMonth = productInfo.payCycleCode === '20102001' // 月付
        if (isPayDay || isPayMonth) {
          this.familyFormMonth = false
          this.familyFormDay = true
          this.familyFormDefault = false
          this.familyDateFormat[index] = 'yyyy-MM-dd'
        } else { // 年付月结
          this.familyFormDay = false
          this.familyFormMonth = true
          this.familyFormDefault = false
          this.familyDateFormat[index] = 'yyyy-MM-01'
        }
        // 保存选择的方案定价模式
        this.familyPriceRules[index] = productInfo.priceRule
      }
    },

    // 选择开始时间
    selectStartDate (type, index) {
      if (type === 1) {
        if (this.employeeMonth === true && this.employeeForm[index].startDate) {
          let startDate = this.employeeForm[index].startDate.split('-')
          startDate.splice(2, 1, '01')
          this.$set(this.employeeForm[index], 'startDate', startDate.join('-'))
        }
        this.getTableDatas(index, 1)
      } else {
        if (this.familyFormMonth === true && this.familyForm[index].startDate) {
          let startDate = this.familyForm[index].startDate.split('-')
          startDate.splice(2, 1, '01')
          this.$set(this.familyForm[index], 'startDate', startDate.join('-'))
        }
        this.getTableDatas(index, 2)
      }
    },

    // 刷新
    handleRefresh () {
      this.reload()
    },

    // 获取人员列表
    getEmployeeList () {
      this.$http({
        url: '/api/comminsure/employee/search',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId,
          key: ''
        })
      }).then(({data}) => {
        this.employeeList = data.data[0]
      })
    },

    // 获取员工方案代码列表
    getEmployeeProductCodeList () {
      this.$http({
        url: '/api/comminsure/productcode/list',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId,
          adaptProject: '70009001'
        })
      }).then(({data}) => {
        this.employeeProductCodeList = data.data[0]
      })
    },

    // 获取家属方案代码列表
    getFamilyProductCodeList () {
      this.$http({
        url: '/api/comminsure/productcode/list',
        method: 'post',
        data: this.$qs.stringify({
          custId: this.$store.state.userData.custId,
          adaptProject: '70009002'
        })
      }).then(({data}) => {
        this.familyProductCodeList = data.data[0]
      })
    },

    // 这里用另外一个数组记录家属姓名，表格里面的数据不再与familyForm绑定，否则familyForm改变后就会单独触发合并表格方法
    familyNameChange (index) {
      this.familyNames[index] = this.familyForm[index].name
      this.refreshTableDatas()
    },

    // 获取表格数据
    getTableDatas (index, tag) {
      var startDate = '';
      var productId;
      // 员工
      if (tag == 1) {
        startDate = this.employeeForm[index].startDate
        productId = this.employeeForm[index].productInfo.id
      } else {
        // 家属
        startDate = this.familyForm[index].startDate
        productId = this.familyForm[index].productInfo.id
      }
      this.$http({
        url: '/api/comminsure/product/detail?custId=' + this.$store.state.userData.custId + '&fyDate=' + startDate + '&productId=' + productId,
        method: 'post',
        data: {}
      }).then(({data}) => {
        var thisDetails = data.data[0];
        if (!thisDetails) {
          thisDetails = []
        }
        for (var i = 0; i < thisDetails.length; i ++) {
          // 这里给数据打上标记，用来在表格上区分员工和家属
          thisDetails[i].tag = tag
          thisDetails[i].index = index
        }
        if (tag == 1) {
          this.employeeForm[index].tableDatas = thisDetails
        } else {
          this.familyForm[index].tableDatas = thisDetails
        }
        this.refreshTableDatas()
      })
    },

    // 刷新表格数据
    refreshTableDatas () {
      this.tableDatas = []
      if (this.employeeForm.length > 0) {
        for (var i = 0; i < this.employeeForm.length; i++) {
          var employeeFrom = this.employeeForm[i]
          if (employeeFrom.tableDatas) {
            // 这里得重新刷新一下index
            for (var j = 0; j < employeeFrom.tableDatas.length; j++) {
              employeeFrom.tableDatas[j].index = i
            }
            this.tableDatas.push(...employeeFrom.tableDatas)
          }
        }
      }
      if (this.familyForm.length > 0) {
        for (var i = 0; i < this.familyForm.length; i++) {
          var familyForm = this.familyForm[i]
          if (familyForm.tableDatas) {
            // 这里得重新刷新一下index
            for (var j = 0; j < familyForm.tableDatas.length; j++) {
              familyForm.tableDatas[j].index = i
            }
            this.tableDatas.push(...familyForm.tableDatas)
          }
        }
      }
      this.countMergeMsg()
    },

    // 统计合并单元格相关信息
    countMergeMsg () {
      // 统计合并单元格相关信息
      this.rowAndColumn = {}
      this.rowAndColumn1 = {}
      this.rowAndColumn2 = {}
      for (var i = 0; i < this.tableDatas.length; i ++) {
        var tableData = this.tableDatas[i];
        // 用方案code，tag，index区分唯一的一份明细数据(第一列)
        if (this.rowAndColumn[tableData.code + tableData.tag + tableData.index]) {
          this.rowAndColumn[tableData.code + tableData.tag + tableData.index] += 1
        } else {
          this.rowAndColumn[tableData.code + tableData.tag + tableData.index] = 1
        }
        // 用方案code，tag，index，保费区分唯一的一份明细数据(第二列)
        if (this.rowAndColumn1[tableData.code + tableData.tag + tableData.index + tableData.salePrice]) {
          this.rowAndColumn1[tableData.code + tableData.tag + tableData.index + tableData.salePrice] += 1
        } else {
          this.rowAndColumn1[tableData.code + tableData.tag + tableData.index + tableData.salePrice] = 1
        }
        // 用方案code，tag，index，保费，险种名称区分唯一的一份明细数据(第三列)
        if (this.rowAndColumn2[tableData.code + tableData.tag + tableData.index + tableData.salePrice + tableData.itemName]) {
          this.rowAndColumn2[tableData.code + tableData.tag + tableData.index + tableData.salePrice + tableData.itemName] += 1
        } else {
          this.rowAndColumn2[tableData.code + tableData.tag + tableData.index + tableData.salePrice + tableData.itemName] = 1
        }
      }
    },

    // 获取证件类型
    getCardTypes () {
      this.$http({
        url: '/api/sys/getDictByKey',
        method: 'get',
        params: {
          dictKey: '50010'
        }
      }).then(({data}) => {
        this.cardType = data.data[0]
      })
    },

    // 获取与员工关系
    getRelations () {
      this.$http({
        url: '/api/sys/getDictByKey',
        method: 'get',
        params: {
          dictKey: '20103'
        }
      }).then(({data}) => {
        this.relation = data.data[0]
      })
    },

    // 提交按钮点击
    save () {
      if (this.employeeForm.length == 0 && this.familyForm.length == 0) {
        this.$message.warning('请先添加要保存的数据')
        return
      }
      var empFormValidate = true;
      var familyFromValidate = true;
      for (var i = 0; i < this.employeeForm.length; i++) {
        this.$refs['employeeForm' + i][0].validate((valid) => {
          empFormValidate = !valid ? false : valid
        })
      }
      for (var i = 0; i < this.familyForm.length; i++) {
        this.$refs['familyForm' + i][0].validate((valid) => {
          familyFromValidate = !valid ? false : valid
        })
      }
      if (empFormValidate && familyFromValidate) {
        this.saveBtnLoading = true
        this.handleSubmit()
      }
    },

    // 提交
    handleSubmit () {
      if (!this.selectEmployee.idCard) {
        this.$message.error('请选择人员')
        this.saveBtnLoading = false
        return
      }
      var submitData = [];
      // 员工
      for (var i = 0; i < this.employeeForm.length; i++) {
        let employeeInfo = this.employeeForm[i];
        submitData.push({
          cardType: this.selectEmployee.cardType,
          changeType: '1',
          customerId: String(this.$store.state.userData.custId),
          empIdCard: this.selectEmployee.idCard,
          empName: this.selectEmployee.name,
          jobPosition: employeeInfo.jobPosition,
          productCode: employeeInfo.productInfo ? employeeInfo.productInfo.code : '',
          productId: employeeInfo.productInfo ? String(employeeInfo.productInfo.id) : null,
          staffOrFamily: '1',
          startDate: employeeInfo.startDate,
          havaSocial: employeeInfo.hasSocial
        })
      }
      // 家属
      for (var i = 0; i < this.familyForm.length; i++) {
        let familyInfo = this.familyForm[i];
        submitData.push({
          cardType: familyInfo.cardType,
          changeType: '1',
          customerId: String(this.$store.state.userData.custId),
          empIdCard: familyInfo.empIdCard,
          empName: familyInfo.name,
          productCode: familyInfo.productInfo.code,
          productId: String(familyInfo.productInfo.id),
          relate: familyInfo.relation,
          staffOrFamily: '2',
          startDate: familyInfo.startDate,
          havaSocial: familyInfo.hasSocial,
          sex: familyInfo.sex,
          birthday: familyInfo.birthday
        })
      }
      this.$http({
        url: '/api/comminsure/declare/save',
        method: 'post',
        data: submitData
      }).then(({data}) => {
        this.saveBtnLoading = false
        if (data.code == 10) {
          this.$message.success('保存成功')
          this.$router.push('/commerceInsurance/insuranceAdmin')
        }
      }).catch((data) => {
        this.saveBtnLoading = false
      })
    },

    // 选择人员
    empChange () {
      if (this.employeeForm.length > 0) {
        for (var i = 0; i < this.employeeForm.length; i++) {
          // 回显岗位
          var jobPosition = this.selectEmployee.jobPosition;
          this.$set(this.employeeForm[i], 'jobPosition', jobPosition)
        }
      }
    },

    // 添加员工方案
    addEmployeeMethod () {
      var empInfo = {}
      if (this.selectEmployee && this.selectEmployee.jobPosition) {
        empInfo.jobPosition = this.selectEmployee.jobPosition
      }
      this.employeeForm.push(empInfo)
      this.empDateFormat.push('yyyy-MM-dd')
    },

    // 添加家属方案
    addFamilyMethod () {
      this.familyForm.push({})
      this.familyDateFormat.push('yyyy-MM-dd')
      // 获取家属方案，在这里触发
      if (this.familyProductCodeList.length == 0) {
        this.getFamilyProductCodeList()
      }
    },

    // 删除方案信息
    deleteForm (tag, index) {
      if (tag == 1) {
        this.employeeForm.splice(index, 1)
        this.empDateFormat.splice(index, 1)
      } else {
        this.familyForm.splice(index, 1)
        this.familyNames.splice(index, 1)
        this.familyDateFormat.splice(index, 1)
      }
      this.refreshTableDatas()
    },

    // 合并单元格(row是行的数据 column是列数据 rowIndex 第几行 columnIndex 第几列)
    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
        console.log(rowIndex + "," + columnIndex)
      if (columnIndex === 0) {
        // rowAndColumn这个用来记录对应的方案出现了多少次
        if (this.rowAndColumn[row.code + row.tag + row.index] !== 'dealed') {
          var rowNum = this.rowAndColumn[row.code + row.tag + row.index];
          this.rowAndColumn[row.code + row.tag + row.index] = 'dealed'
          return {
            // 要合并的列数就是方案出现的次数
            rowspan: rowNum,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (columnIndex == 1) {
        if (this.rowAndColumn1[row.code + row.tag + row.index + row.salePrice] !== 'dealed') {
          var rowNum = this.rowAndColumn1[row.code + row.tag + row.index + row.salePrice];
          this.rowAndColumn1[row.code + row.tag + row.index + row.salePrice] = 'dealed'
          return {
            rowspan: rowNum,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (columnIndex == 2) {
        if (this.rowAndColumn2[row.code + row.tag + row.index + row.salePrice + row.itemName] !== 'dealed') {
          var rowNum = this.rowAndColumn2[row.code + row.tag + row.index + row.salePrice + row.itemName];
          this.rowAndColumn2[row.code + row.tag + row.index + row.salePrice + row.itemName] = 'dealed'
          return {
            rowspan: rowNum,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },

    // 校验证件号码
    checkIdCard (rule, value, callback, index) {
      if (this.familyForm[index].cardType === '50010001') {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (reg.test(value) === false) {
          callback(new Error('请输入正确格式的身份证号'))
        }
      }
      callback()
    },

    // 校验员工信息
    checkEmpInfos (rule, value, callback, index, tag) {
      // 员工方案（开始日期有值，员工方案必填）
      if (tag == 1) {
        if (this.employeeForm[index].startDate && !this.employeeForm[index].productInfo) {
          callback(new Error('请选择员工方案'))
        }
      }
      // 开始日期（员工方案有值，开始日期必填）
      if (tag == 2) {
        if (this.employeeForm[index].productInfo && !this.employeeForm[index].startDate) {
          callback(new Error('请选择开始日期'))
        }
      }
      // 岗位（开始日期或员工方案有值，岗位必填）
      if (tag == 3) {
        if ((this.employeeForm[index].startDate || this.employeeForm[index].productInfo) && !this.employeeForm[index].jobPosition) {
          callback(new Error('请填写岗位'))
        }
      }
      callback()
    },

    // 校验有无社保
    hasSocialCheck (rule, value, callback, index, tag) {
      // 员工
      if (tag == 1 && this.employeeForm[index] && this.employeePriceRules[index] === '1' && !this.employeeForm[index].hasSocial) {
        callback(new Error('请选择有无社保'))
      }
      // 家属
      if (tag == 2 && this.familyForm[index] && this.familyPriceRules[index] === '1' && !this.familyForm[index].hasSocial) {
        callback(new Error('请选择有无社保'))
      }
      callback()
    },

    // 校验家属信息
    checkFamilyMsg (rule, value, callback, index, tag) {
      // 性别，出生日期
      if (tag == 1 || tag == 2) {
        if (this.familyForm[index] && this.familyForm[index].cardType && this.familyForm[index].cardType != '50010001') {
          // 性别
          if (tag == 1 && (!this.familyForm[index].sex || (this.familyForm[index].sex != 1 && this.familyForm[index].sex != 2))) {
            callback(new Error('请选择性别'))
          }
          // 出生日期
          if (tag == 2 && !this.familyForm[index].birthday) {
            callback(new Error('请选择出生日期'))
          }
        }
      }
      // 家属方案
      if (tag == 3) {
        if (this.familyForm[index] && !this.familyForm[index].productInfo) {
          callback(new Error('请选择方案'))
        }
      }
      // 开始时间
      if (tag == 4) {
        if (this.familyForm[index] && this.familyForm[index].productInfo && !this.familyForm[index].startDate) {
          callback(new Error('请选择开始时间'))
        }
      }
      callback()
    }
  }
}
</script>

<style lang='less' scoped>
  @import '../../assets/css/entering/enteringAddOrDelete.less';
</style>
