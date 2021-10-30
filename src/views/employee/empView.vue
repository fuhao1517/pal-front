<template>
  <div class="content">
    <header class="header">
      <div class="header-left">
        <span>{{empDetail.name}}&nbsp;&nbsp;</span>
        <span>({{empDetail.idCard}})</span>
        <img v-if="empDetail.sex===1" class="ml-20" src="@/assets/images/icons/ic-account-type14.png" alt="">
        <img v-else class="ml-20" src="@/assets/images/icons/ic-account-type15.png" alt="">
      </div>
      <div class="header-right">
        <el-button size="small" type="primary" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
        <img class="ml-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="handleClose">
      </div>
    </header>
    <div class="spl-tabs">
      <div class="spl-tabs-header">
        <span class="span-tabs" v-for="(item,index) in ['员工信息','账单费用','合同信息']" :key="index" :class="{active:index===current}" @click="handleClickTabs(index)">
          {{item}}
          <img v-show="index===current" class="active-img" src="@/assets/images/icons/ic-account-type16.png" alt="">
        </span>
      </div>
      <!-- 员工信息 -->
      <div v-show="current===0">
        <!-- 基本信息 -->
        <div class="basicInfo" style="margin-top:175px;">
          <div class="title">
            <img class="title-img" src="@/assets/images/icons/ic-account-type17.png" alt="">
            <p class="title-name">基本信息</p>
          </div>
          <el-form :label-position="labelPosition" :model="empDetail">
            <div class="one">
              <el-form-item label="姓名：">
                <p>{{empDetail.name}}</p>
              </el-form-item>
              <el-form-item label="手机号码：">
                <p>{{empDetail.telephone}}</p>
              </el-form-item>
              <el-form-item label="岗位：">
                <p>{{empDetail.jobPosition}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="证件号码：">
                <p>{{empDetail.idCard}}</p>
              </el-form-item>
              <el-form-item label="户口性质：">
                <p>{{empDetail.residenceName}}</p>
              </el-form-item>
              <el-form-item label="入职时间：">
                <p>{{empDetail.entryDate}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="出生日期：">
                <p>{{empDetail.birthday}}</p>
              </el-form-item>
              <el-form-item label="户籍市：">
                <p>{{empDetail.cityName}}</p>
              </el-form-item>
              <el-form-item label="离职时间：">
                <p>{{empDetail.leaveDate}}</p>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 银行卡信息 -->
        <div class="bankInfo">
          <div class="title">
            <img class="title-img" src="@/assets/images/icons/ic-account-type23.png" alt="">
            <p class="title-name">银行卡信息</p>
          </div>
          <el-form :label-position="labelPosition" :model="employeeBaseBank">
            <div class="one">
              <el-form-item label="银行名称：">
                <p>{{employeeBaseBank.bankName}}</p>
              </el-form-item>
              <el-form-item label="开户市：">
                <p>{{employeeBaseBank.bankCity}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="银行账号：">
                <p>{{employeeBaseBank.bankAccount}}</p>
              </el-form-item>
              <el-form-item label="支行名称：">
                <p>{{employeeBaseBank.bankBranch}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="银行账户名：">
                <p>{{employeeBaseBank.bankAccountName}}</p>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 工资个税 -->
        <div class="payoffInfo">
          <div class="title">
            <img class="title-img" src="@/assets/images/icons/ic-account-type21.png" alt="">
            <p class="title-name">工资个税</p>
          </div>
          <el-form :label-position="labelPosition" :model="salaryTax">
            <div class="one">
              <el-form-item label="工资发放地：">
                <p>{{salaryTax.salaryAddrName}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="个税申报地：">
                <p>{{salaryTax.taxAddrName}}</p>
              </el-form-item>
            </div>
            <div style="visibility: hidden;">
              <el-form-item label="个税申报地">
                <p>{{salaryTax.taxAddrName}}</p>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 社保 -->
        <div class="insurance" ref="insurance">
          <div class="header-title">
            <div class="title">
              <img class="title-img" src="@/assets/images/icons/ic-account-type20.png" alt="">
              <p class="title-name">社保</p>
            </div>
            <div class="editRecord" @click="handleEditRecord(type='insurance')">
              <img src="@/assets/images/icons/ic-account-type19.png" alt="">
              <span class="ml-10 mr-50">增减员记录</span>
            </div>
          </div>
          <el-form :label-position="labelPosition" v-for="(item,index) in socials" :key="index">
            <div class="one">
              <el-form-item label="参保地：">
                <p>{{item.addrName}}</p>
              </el-form-item>
              <el-form-item label="服务状态：">
                <p style="color:#909399; border:none;" v-show="item.serviceStatus=='无服务'">{{item.serviceStatus}}</p>
                <p style="color:#67C23A; border:none;" v-show="item.serviceStatus=='服务中'">{{item.serviceStatus}}</p>
                <p style="color:#F56C6C; border:none;" v-show="item.serviceStatus=='终止服务'">{{item.serviceStatus}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="增员时间：" style="margin-bottom:40px;">
                <p>{{item.timeView}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="社保号：" style="margin-bottom:40px;">
                <p>{{item.socialNum}}</p>
              </el-form-item>
            </div>
          </el-form>
          <img v-show="insuranceTableShow" class="d-table-img" src="@/assets/images/icons/ic-account-type16.png" alt="">
          <dTable v-show="insuranceTableShow" class="d-table" @fetch="getSocietyRecord" ref="societyRecord" :tableHeight="insuranceTableHeight" :showIndex='true'>
            <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="declareType" label="申报类型" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="tbDate" label="投保年月" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="declareStatus" label="申报状态" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="failCause" label="失败原因" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="productName" label="方案名称" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empTbBase" label="参保基数" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="transferComment" label="调动备注" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createNameAndNumber" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="tbComment" label="参保信息" width="200" :show-overflow-tooltip="true"></el-table-column>
          </dTable>
        </div>
        <!-- 公积金 -->
        <div class="providentFund" ref="providentFund">
          <div class="header-title">
            <div class="title">
              <img class="title-img" src="@/assets/images/icons/ic-account-type18.png" alt="">
              <p class="title-name">公积金</p>
            </div>
            <div class="editRecord" @click="handleEditRecord(type='providentFund')">
              <img src="@/assets/images/icons/ic-account-type19.png" alt="">
              <span class="ml-10 mr-50">增减员记录</span>
            </div>
          </div>
          <el-form :label-position="labelPosition" v-for="(item,index) in accfunds" :key="index">
            <div class="one">
              <el-form-item label="参保地：">
                <p>{{item.addrName}}</p>
              </el-form-item>
              <el-form-item label="服务状态：">
                <p style="color:#909399;border:none;" v-show="item.serviceStatus=='无服务'">{{item.serviceStatus}}</p>
                <p style="color:#67C23A; border:none;" v-show="item.serviceStatus=='服务中'">{{item.serviceStatus}}</p>
                <p style="color:#F56C6C; border:none;" v-show="item.serviceStatus=='终止服务'">{{item.serviceStatus}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="增员时间：" style="margin-bottom:40px;">
                <p>{{item.timeView}}</p>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="公积金号：" style="margin-bottom:40px;">
                <p>{{item.accfundAccount}}</p>
              </el-form-item>
            </div>
          </el-form>
          <img v-show="providentFundShow" class="d-table-img" src="@/assets/images/icons/ic-account-type16.png">
          <dTable v-show="providentFundShow" class="d-table d-table2" @fetch="getAccfundsRecord" ref="accfundsRecord" :tableHeight="insuranceTableHeight" :showIndex='true'>
            <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="declareType" label="申报类型" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="tbDate" label="投保年月" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-text="$global.dateFormat(scope.row.tbDate)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="accfundProductName" label="方案名称" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="declareStatus" label="申报状态" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="failCause" label="失败原因" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empTbBase" label="参保基数" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="compRatio" label="公积金单位比例" width="200" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="empRatio" label="公积金个人比例" width="200" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="supCompRatio" label="补充公积金单位比例" width="200" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="supEmpRatio" label="补充公积金个人比例" width="200" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="transferComment" label="调动备注" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createNameAndNumber" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="comment" label="参保信息" width="200" :show-overflow-tooltip="true"></el-table-column>
          </dTable>
        </div>
        <!-- 商保 -->
        <div class="commercial" ref="commercial">
          <div class="header-title">
            <div class="title">
              <img class="title-img" src="@/assets/images/icons/ic-account-type22.png" alt="">
              <p class="title-name">商保</p>
              <span class="ml-10" style="color:#909399; margin-top:1px;" v-show="comminsure.comminsureServiceStatus=='无服务'">{{comminsure.comminsureServiceStatus}}</span>
              <span class="ml-10" style="color:#67C23A; margin-top:1px;" v-show="comminsure.comminsureServiceStatus=='服务中'">{{comminsure.comminsureServiceStatus}}</span>
              <span class="ml-10" style="color:#F56C6C; margin-top:1px;" v-show="comminsure.comminsureServiceStatus=='终止服务'">{{comminsure.comminsureServiceStatus}}</span>
            </div>
            <div class="editRecord" @click="handleEditRecord(type='commercial')">
              <img src="@/assets/images/icons/ic-account-type19.png" alt="">
              <span class="ml-10 mr-50">增减员记录</span>
            </div>
          </div>
          <el-row style="margin: 0 20px; padding-bottom: 70px; border-bottom:1px solid #ddd">
            <el-col :span="8">
              <p class="ml-30">方案代码：{{comminsure.comminsureProductCodes}}</p>
            </el-col>
            <el-col :span="8">
              <p class="ml-20">增员时间：{{comminsure.comminsureStartDate}}</p>
            </el-col>
            <el-col :span="8">
              <p style="visibility: hidden;">个税申报地：{{salaryTax.taxAddrName}}</p>
            </el-col>
          </el-row>
          <img v-show="commercialTableShow" class="d-table-img" src="@/assets/images/icons/ic-account-type16.png" alt="">
          <dTable v-show="commercialTableShow" class="d-table d-table2" @fetch="getComminsuresRecord" ref="comminsuresRecord" :tableHeight="insuranceTableHeight" :showIndex='true'>
            <el-table-column prop="name" label="姓名" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="businessTypeName" label="业务类型" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="code" label="方案代码" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="申报类型" width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-text="scope.row.changeType === 1 ? '增员' : '减员'"></span>
              </template>
            </el-table-column>
            <el-table-column prop="effectTime" label="生效日期" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="declareStatus" label="申报状态" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="declareResult" label="失败原因" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="transferComment" label="调动备注" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createNameAndNumber" label="创建人" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="relation" label="主连关系" width="150" :show-overflow-tooltip="true"></el-table-column>
          </dTable>
        </div>
      </div>
      <!-- 账单费用 -->
      <div v-show="current===1">
        <!-- 应付费用项目 -->
        <div class="bg-ddd h-50 lh-50 pl-20 font-16 fw-blod bc-ddd mb-20" style="margin-top:175px;">应付费用项目</div>
        <div class="tab-type">
          <div class="clearfix table-title-top-div">
            <div class="table-title-top" v-for="(item,index) in ['工资信息','社保','公积金','服务费','商保','残保金','安残金']" :key="'table-title-top-'+index" @click="handleClickTabsOughtTo(index)">
              <span class="title-name mr-20" :class="{active2:index===current2}">{{item}}</span>
            </div>
          </div>
        </div>
        <!-- 工资信息 -->
        <dTable v-show="current2===0" @fetch="getSalary" ref="salaryTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyMonth" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyMonth)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="itemTypeDesc" label="发放类型" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxReturnMonth" label="个税申报年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.taxReturnMonth)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="taxDeclareAddrName" label="个税申报地" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="plannedSalary" label="应发金额" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="socialSecurityAmount" label="个人社保" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="accfundAmount" label="个人公积金" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxableIncomeAmount" label="应税金额" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxAmount" label="应缴个税" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="actualTaxAmount" label="实缴个税" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxDiffRecAmount" label="抵扣实发金额" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="otherAmount" label="其他扣减项" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="postAdjustment" label="税后调整金额" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="actualSalary" label="实发金额" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="customerSiteOneFeeCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxAdditionalItems" label="个税扣除信息" width="200" header-align="center" class-name="border-l border-b-none border-r" :show-overflow-tooltip="true">
          <el-table-column prop="taxAdditionalItems.70018001" label="子女教育扣除" width="200" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
          <el-table-column prop="taxAdditionalItems.70018005" label="继续教育扣除" width="200" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
          <el-table-column prop="taxAdditionalItems.70018004" label="赡养老人扣除" width="200" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
          <el-table-column prop="taxAdditionalItems.70018002" label="住房贷款利息扣除" width="200" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
          <el-table-column prop="taxAdditionalItems.70018003" label="住房租金扣除" width="200" :show-overflow-tooltip="true" class-name="border-l"></el-table-column>
          <el-table-column prop="taxAdditionalItems.70018006" label="大病医疗扣除" width="200" :show-overflow-tooltip="true" class-name="border-l border-r"></el-table-column>
          </el-table-column>
          <el-table-column prop="empBankDictName" label="银行名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="empBankAccount" label="银行账号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 社保 -->
        <dTable v-show="current2===1" @fetch="getSociety" ref="societyTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tbDate" label="投保年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.tbDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="方案名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cpTotal" label="社保合计" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="单位合计" width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.compTotal"></span>
                <dTable :data="scope.row.compList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="单位基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="单位比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="单位金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="个人合计" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.personTotal"></span>
                <dTable :data="scope.row.empList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="个人基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="个人比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="个人金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="recCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 公积金 -->
        <dTable v-show="current2===2" @fetch="getAccfund" ref="accfundTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tbDate" label="投保年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.tbDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="方案名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cpTotal" label="合计" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="单位合计" width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.compTotal"></span>
                <dTable :data="scope.row.compList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="个人基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="个人比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="个人金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="个人合计" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.personTotal"></span>
                <dTable :data="scope.row.empList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="个人基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="个人比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="个人金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="recCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 服务费 -->
        <dTable v-show="current2===3" @fetch="getServiceFee" ref="serviceFeeTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="skny" label="费用年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.skny)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="服务费金额" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="feeType" label="服务费类型" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="recCode" label="账单编号" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 商保 -->
        <dTable v-show="current2===4" @fetch="getComminsure" ref="comminsureTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="employeeName" label="姓名" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="employeeIdCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="fyStartDate" label="费用开始时间" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="scope.row.fyStartDate ? $moment(scope.row.fyStartDate).format('YYYY-MM-DD') : '' "> </span>
            </template>
          </el-table-column>
          <el-table-column prop="fyEndDate" label="费用结束时间" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="scope.row.fyEndDate ? $moment(scope.row.fyEndDate).format('YYYY-MM-DD') : '' "> </span>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="方案代码" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="fee" label="商保金额" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="recBillCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 残保金 -->
        <dTable v-show="current2===5" @fetch="getCBJ" ref="cBJTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fee" label="残保金金额" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="recCode" label="账单编号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 安残金 -->
        <dTable v-show="current2===6" @fetch="getACJ" ref="aCJTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fee" label="安残金金额" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="recCode" label="账单编号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>

        <!-- 实付费用项目 -->
        <div class="bg-ddd h-50 lh-50 pl-20 font-16 fw-blod bc-ddd mt-20 mb-20">实付费用项目</div>
        <div class="tab-type">
          <div class="clearfix table-title-top-div">
            <div class="table-title-top" v-for="(item,index) in ['工资信息','个税','社保','公积金','服务费','商保','残保金','安残金']" :key="'table-title-top2-'+index" @click="handleClickTabsPractical(index)">
              <span class="title-name mr-20" :class="{active2:index===current3}">{{item}}</span>
            </div>
          </div>
        </div>
        <!-- 工资信息 -->
        <dTable v-show="current3===0" @fetch="getRealitySalary" ref="realitySalaryTable" :tableHeight="tableHeight" :paging="false">
          <el-table-column prop="fyMonth" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyMonth)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="itemTypeDesc" label="发放类型" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="plannefee" label="应发金额" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="socialSecurityAmount" label="个人社保" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="accfundAmount" label="个人公积金" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxableIncomeAmount" label="应税金额" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="otherAmount" label="其他扣减项" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="postAdjustment" label="税后调整金额" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="actualfee" label="实发金额" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="paidStatus" label="发放状态" min-width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.paidStatus==='0'">待发</span>
              <span v-if="scope.row.paidStatus==='1'">发放失败</span>
              <span v-if="scope.row.paidStatus==='2'">发放成功</span>
              <span v-if="scope.row.paidStatus==='3'">终止发放</span>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 个税 -->
        <dTable v-show="current3===1" @fetch="getRealityTax" ref="realityTaxTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="itemTypeDesc" label="所得项目子目" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxReturnMonth" label="个税申报所属期" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxDeclareAddrName" label="个税申报地" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxableIncomeAmount" label="应税金额" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="taxAmount" label="应缴个税" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="actualTaxAmount" label="实缴个税" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 社保 -->
        <dTable v-show="current3===2" @fetch="getRealitySocial" ref="realitySocialTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tbDate" label="投保年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.tbDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="cpTotal" label="合计" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="单位合计" width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.compTotal"></span>
                <dTable :data="scope.row.compList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="单位基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="单位比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="单位金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="personTotal" label="个人合计" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="(scope.row.personTotal).toFixed(2)"></span>
                <dTable :data="scope.row.empList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="个人基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="个人比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="个人金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 公积金 -->
        <dTable v-show="current3===3" @fetch="getRealityAccfund" ref="realityAccfundTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="addrName" label="参保地" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tbDate" label="投保年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.tbDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fyDate" label="费用年月" min-width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="cpTotal" label="合计" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="单位合计" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.compTotal"></span>
                <dTable :data="scope.row.compList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="个人基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="个人比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="个人金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="个人合计" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <span class="text-blue f-cursor" slot="reference" v-text="scope.row.personTotal"></span>
                <dTable :data="scope.row.empList" :tableHeight="tableHeight" :cancelMinHeight="true" :paging="false" :showIndex="false">
                  <el-table-column prop="itemName" label="险种名称" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemBase" label="个人基数" width="100" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemRatio" label="个人比例" width="100" :formatter="formatterRatio" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column prop="itemAmount" label="个人金额" width="100" :show-overflow-tooltip="true"></el-table-column>
                </dTable>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 服务费 -->
        <dTable v-show="current3===4" @fetch="getRealityFee" ref="realityFeeTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="skny" label="费用年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.skny)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="服务费金额" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="feeType" label="服务费类型" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 商保 -->
        <dTable v-show="current3===5" @fetch="getRealityComminsure" ref="realityComminsureTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="employeeName" label="姓名" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="employeeIdCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="fyStartDate" label="费用开始时间" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{ scope.row.fyStartDate?$moment(scope.row.fyStartDate).format('YYYY-MM-DD'):'' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="fyEndDate" label="费用结束时间" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{ scope.row.fyEndDate?$moment(scope.row.fyEndDate).format('YYYY-MM-DD'):'' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="方案代码" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="salePrice" label="商保金额" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 残保金 -->
        <dTable v-show="current3===6" @fetch="getRealityCBJ" ref="realityCBJTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" min-width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fee" label="残保金金额" width="500" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="400" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 安残金 -->
        <dTable v-show="current3===7" @fetch="getRealityACJ" ref="realityACJTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" min-width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="fee" label="安残金金额" width="400" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="400" :show-overflow-tooltip="true"></el-table-column>
        </dTable>

        <!-- 退费项目 -->
        <div class="bg-ddd h-50 lh-50 pl-20 font-16 fw-blod bc-ddd mt-20 mb-20">退费项目</div>
        <div class="tab-type">
          <div class="clearfix table-title-top-div">
            <div class="table-title-top" v-for="(item,index) in ['工资信息','个税','社保','公积金','服务费','商保','残保金']" :key="index"
                 @click="handleClickTabsOut(index)">
              <span class="title-name mr-20" :class="{active2:index===current4}">{{item}}</span>
            </div>
          </div>
        </div>
        <!-- 工资信息 -->
        <dTable v-show="current4===0" @fetch="getSalaryDiff" ref="salaryDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyMonth" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyMonth)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="itemTypeDesc" label="退费类型" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="工资退款金额" min-width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.actualfee > 0) ?  (-scope.row.actualfee) : scope.row.actualfee"></span>
            </template>
          </el-table-column>
          <el-table-column prop="nextRecFlag" label="处理方式" width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="scope.row.nextRecFlag == false ?  '退公司' : '转为下次收款'"></span>
            </template>
          </el-table-column>
          <el-table-column prop="paidFailReason" label="退款原因" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="empBankDictName" label="银行名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="empBankAccount" label="银行账号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="requestPayoutBillCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="updateName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 个税 -->
        <dTable v-show="current4===1" @fetch="getTaxDiff" ref="taxDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="addressName" label="申报地" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="declareDate" label="申报年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <span v-text="$global.dateFormat(scope.row.declareDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="itemType" label="所得子项目" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="退款金额" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.diffAmount > 0) ?  (-scope.row.diffAmount) : scope.row.diffAmount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="statusName" label="处理方式" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="itemComment" label="退款原因" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="billcode" label="账单编号" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="time" label="创建时间" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 社保 -->
        <dTable v-show="current4===2" @fetch="getSocialDiff" ref="socialDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="diffUsefulStr" label="退款类型" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="退款合计" width="100" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.diffAmount > 0) ?  (-scope.row.diffAmount) : scope.row.diffAmount"></span>
            </template>
          </el-table-column>
          <el-table-column label="单位退款金额" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.recCompanyAmount > 0) ?  (-scope.row.recCompanyAmount) : scope.row.recCompanyAmount"></span>
            </template>
          </el-table-column>
          <el-table-column label="个人退款金额" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.payPersonAmount > 0) ?  (-scope.row.payPersonAmount) : scope.row.payPersonAmount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="bankName" label="银行名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankAccount" label="银行账号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="reason" label="退款原因" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="billCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 公积金 -->
        <dTable v-show="current4===3" @fetch="getAccfundDiff" ref="accfundDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" min-width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="diffUsefulStr" label="退款类型" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="退款合计" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.diffAmount > 0) ?  (-scope.row.diffAmount) : scope.row.diffAmount"></span>
            </template>
          </el-table-column>
          <el-table-column label="单位退款金额" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.recCompanyAmount > 0) ?  (-scope.row.recCompanyAmount) : scope.row.recCompanyAmount"></span>
            </template>
          </el-table-column>
          <el-table-column label="个人退款金额" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.payPersonalAmount > 0) ?  (-scope.row.payPersonalAmount) : scope.row.payPersonalAmount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="bankName" label="银行名称" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankAccount" label="银行账号" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="reason" label="退款原因" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="billCode" label="账单编号" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 服务费 -->
        <dTable v-show="current4===4" @fetch="getServiceFeeDiff" ref="serviceFeeDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="billCode" label="账单编号" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="服务费金额" min-width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.diffAmount > 0) ?  (-scope.row.diffAmount) : scope.row.diffAmount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="退费原因" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 商保 -->
        <dTable v-show="current4===5" @fetch="getComminsureDiff" ref="comminsureDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="employeeName" label="姓名" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="employeeIdCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="fyDate" label="费用年月" width="300" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="方案代码" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="退款商保金额" min-width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.diffAmount > 0) ?  (-scope.row.diffAmount) : scope.row.diffAmount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="bankName" label="银行名称" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankAccount" label="银行账号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="parentIdCard" label="与员工关系" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="reason" label="退款原因" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="billCode" label="账单编号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
        <!-- 残保金 -->
        <dTable v-show="current4===6" @fetch="getCBJDiff" ref="cBJDiffTable" :tableHeight="tableHeight" :paging="false" :showIndex="true">
          <el-table-column prop="fyDate" label="费用年月" width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="$global.dateFormat(scope.row.fyDate)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="diffUsefulStr" label="退费方式" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="退款残保金金额" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-text="(scope.row.diffAmount > 0) ?  (-scope.row.diffAmount) : scope.row.diffAmount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="退款原因" min-width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankName" label="银行名称" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bankAccount" label="银行账号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="billCode" label="账单编号" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
      </div>
      <!-- 合同信息 -->
      <div v-show="current===2">
        <!-- 搜索框 -->
        <el-input style="margin-top:185px;" placeholder="搜索合同编码" class="ml-40 w-190 mb-20" v-model="searchWord"></el-input>
        <el-button type="primary" id="el-button" icon="el-icon-search" @click="getContractInfo"></el-button>
        <!-- 表格 -->
        <dTable @fetch="getContractInfo" ref="contractTable" :tableHeight="tableHeight" :paging="false">
          <el-table-column prop="contractTypeDesc" label="合同类型" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contractNumber" label="合同编码" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contractCategoryDesc" label="签订类型" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contractStartDate" label="合同开始时间" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contractEndDate" label="合同结束时间" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column fixed="right" label="合同电子版" width="120">
            <template slot-scope="scope">
              <el-dropdown>
                <el-button type="text" size="small"><img src="@/assets/images/icons/ic-account-type35.png">下载文件</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleDownload(item.fileId)" v-for="(item,index) in scope.row.contractFiles" :key="index">{{item.fileName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </dTable>
      </div>
      <!-- 操作记录 -->
      <div v-show="current===4">
        <!-- 筛选框 - -->
        <div style="margin-top:185px;" class="mb-20">
          <label class="ml-40">操作时间：</label>
          <el-date-picker class="w-150 mr-5" value-format="yyyy-MM-dd" :clearable="true" type="date" placeholder="选择日期"></el-date-picker>
          至
          <el-date-picker class="w-150 ml-5" value-format="yyyy-MM-dd" :clearable="true" type="date" placeholder="选择日期"></el-date-picker>
          <label class="label-text ml-143">操作人：</label>
          <el-input class="w-150 mr-60" placeholder="请输入"></el-input>
          <label class="label-text ml-141">操作类型：</label>
          <el-select class="w-150" :clearable="true" v-model="operateRecord.operateType">
            <!--操作类型（1:新增、2:删除、3:编辑） （数字）-->
            <el-option label="新增" :value="1"></el-option>
            <el-option label="删除" :value="2"></el-option>
            <el-option label="编辑" :value="3"></el-option>
          </el-select>
        </div>
        <!-- 表格 -->
        <!-- <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :paging="false"> -->
        <dTable :data="tableData" ref="empTable" :tableHeight="tableHeight" :paging="false">
          <el-table-column prop="name" label="操作时间" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="操作人" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="操作模块" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="操作类型" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="操作内容" min-width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="操作结果" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="访问IP" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="name" label="访问位置" width="200" :show-overflow-tooltip="true"></el-table-column>
        </dTable>
      </div>
    </div>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
export default {
  components: { dTable },
  props: ['message', 'rowId'],
  data () {
    return {
      tableData: [{ name: '王小虎' }],
      value: '',
      searchWord: '',
      empDetail: { // 基本信息
        sex: '',
        name: '',
        telephone: '',
        jobPosition: '',
        idCard: '',
        residenceName: '',
        entryDate: '',
        birthday: '',
        cityName: '',
        leaveDate: ''
      },
      employeeBaseBank: {// 银行卡信息
        bankName: '',
        bankCity: '',
        bankAccount: '',
        bankBranch: '',
        bankAccountName: ''
      },
      salaryTax: { // 工资个税
        salaryAddrName: '',
        taxAddrName: ''
      },
      socials: [], // 社保
      accfunds: [], // 公积金
      comminsure: { // 商保
        comminsureProductCodes: '',
        comminsureStartDate: ''
      },
      // 操作记录
      operateRecord: {
        startDate: '',
        endDate: '',
        creatorName: '',
        operateType: '' //  操作类型（1:新增、2:删除、3:编辑）
      },
      current: 0,
      current2: 0,
      current3: 0,
      current4: 0,
      employeeId: '',
      employeeSiteId: '',
      labelPosition: 'right',
      insuranceTableShow: false,
      providentFundShow: false,
      commercialTableShow: false
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 500 + 'px'
    },
    insuranceTableHeight: function () {
      return this.$global.bodyHeight - 550 + 'px'
    }
  },
  created () {
    this.employeeId = this.message
    this.employeeSiteId = this.rowId
  },
  watch: {
    message (val) {
      this.employeeId = val
      this.getUSerInfo()
    },
    rowId (val) {
      this.employeeSiteId = val
    }
  },
  mounted () {
    this.getUSerInfo()
  },
  methods: {
    formatterRatio (row, column, cellValue, index) {
      return (cellValue * 100).toFixed(2) + '%'
    },
    /* 关闭 */
    handleClose () {
      this.$emit('handleClose')
    },
    /* tab切换 */
    handleClickTabs (index) {
      this.current = index
      if (this.current === 1) {
        this.getSalary()
        this.getRealitySalary()
        this.getSalaryDiff()
      } else if (this.current === 2) {
        this.getContractInfo()
      }
    },
    /* 合同信息-下载文件 */
    handleDownload (fileId) {
      let a = document.createElement('a')
      a.href = `http://192.168.0.99:8088/api/file/download/` + fileId // 这里的请求方式为get，如果需要认证，接口上需要带上token
      a.download = '.jpg'
      a.click()
    },
    /* 获取员工信息 */
    getUSerInfo () {
      this.$http({
        url: '/api/employee/' + String(this.employeeId),
        method: 'get'
      }).then(({ data }) => {
        if (data.data[0].empDetail == null) {
          data.data[0].empDetail = {}
        }
        if (data.data[0].employeeBaseBank == null) {
          data.data[0].employeeBaseBank = {}
        }
        if (data.data[0].salaryTax == null) {
          data.data[0].salaryTax = {}
        }
        if (data.data[0].socials == null) {
          data.data[0].socials = {}
        }
        if (data.data[0].accfunds == null) {
          data.data[0].accfunds = {}
        }
        if (data.data[0].comminsure == null) {
          data.data[0].comminsure = {}
        }
        this.empDetail = data.data[0].empDetail
        this.employeeBaseBank = data.data[0].employeeBaseBank
        this.salaryTax = data.data[0].salaryTax
        this.socials = data.data[0].socials
        this.accfunds = data.data[0].accfunds
        this.comminsure = data.data[0].comminsure
      })
    },
    /* 员工信息-显示增减员记录 */
    handleEditRecord (type) {
      if (type === 'insurance' && this.insuranceTableShow === false) {
        this.insuranceTableShow = true
        this.getSocietyRecord()
        var edHeight = this.$refs.insurance.offsetHeight
        this.$refs.insurance.style.height = edHeight + 300 + 'px'
      } else if (type === 'insurance' && this.insuranceTableShow !== false) {
        this.insuranceTableShow = false
        var edHeight2 = this.$refs.insurance.offsetHeight
        this.$refs.insurance.style.height = edHeight2 - 300 + 'px'
      }

      if (type === 'providentFund' && this.providentFundShow === false) {
        this.providentFundShow = true
        this.getAccfundsRecord()
        var edHeight3 = this.$refs.providentFund.offsetHeight
        this.$refs.providentFund.style.height = edHeight3 + 280 + 'px'
      } else if (type === 'providentFund' && this.providentFundShow !== false) {
        this.providentFundShow = false
        var edHeight4 = this.$refs.providentFund.offsetHeight
        this.$refs.providentFund.style.height = edHeight4 - 280 + 'px'
      }

      if (type === 'commercial' && this.commercialTableShow === false) {
        this.commercialTableShow = true
        this.getComminsuresRecord()
        var edHeight5 = this.$refs.commercial.offsetHeight
        this.$refs.commercial.style.height = edHeight5 + 200 + 'px'
      } else if (type === 'commercial' && this.commercialTableShow !== false) {
        this.commercialTableShow = false
        var edHeight6 = this.$refs.commercial.offsetHeight
        this.$refs.commercial.style.height = edHeight6 - 200 + 'px'
      }
    },
    /* 员工信息-社保-增减员记录 */
    getSocietyRecord (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.societyRecord.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/socails'
      })
    },
    /* 员工信息-公积金-增减员记录 */
    getAccfundsRecord (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.accfundsRecord.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/accfunds'
      })
    },
    /* 员工信息-商保-增减员记录 */
    getComminsuresRecord (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.comminsuresRecord.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/comminsures'
      })
    },
    /* 获取合同信息 */
    getContractInfo (params = []) {
      params = [{ property: 'contractNumber', value: this.searchWord }, { property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.contractTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/contracts'
      })
    },

    /* 应付费用项目tab切换 */
    handleClickTabsOughtTo (index) {
      this.current2 = index
      if (this.current2 === 0) {
        this.getSalary()
      } else if (this.current2 === 1) {
        this.getSociety()
      } else if (this.current2 === 2) {
        this.getAccfund()
      } else if (this.current2 === 3) {
        this.getServiceFee()
      } else if (this.current2 === 4) {
        this.getComminsure()
      } else if (this.current2 === 5) {
        this.getCBJ()
      } else if (this.current2 === 6) {
        this.getACJ()
      }
    },
    /* 实付费用项目tab切换 */
    handleClickTabsPractical (index) {
      this.current3 = index
      if (this.current3 === 0) {
        this.getRealitySalary()
      } else if (this.current3 === 1) {
        this.getRealityTax()
      } else if (this.current3 === 2) {
        this.getRealitySocial()
      } else if (this.current3 === 3) {
        this.getRealityAccfund()
      } else if (this.current3 === 4) {
        this.getRealityFee()
      } else if (this.current3 === 5) {
        this.getRealityComminsure()
      } else if (this.current3 === 6) {
        this.getRealityCBJ()
      } else if (this.current3 === 7) {
        this.getRealityACJ()
      }
    },
    /* 退费项目tab切换 */
    handleClickTabsOut (index) {
      this.current4 = index
      if (this.current4 === 0) {
        this.getSalaryDiff()
      } else if (this.current4 === 1) {
        this.getTaxDiff()
      } else if (this.current4 === 2) {
        this.getSocialDiff()
      } else if (this.current4 === 3) {
        this.getAccfundDiff()
      } else if (this.current4 === 4) {
        this.getServiceFeeDiff()
      } else if (this.current4 === 5) {
        this.getComminsureDiff()
      } else if (this.current4 === 6) {
        this.getCBJDiff()
      }
    },
    /* 应付费用项目-工资信息 */
    getSalary (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.salaryTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listSalaryDetail'
      })
    },
    /* 应付费用项目-社保 */
    getSociety (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.societyTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listSocialDetail'
      })
    },
    /* 应付费用项目-公积金 */
    getAccfund (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.accfundTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listAccfundDetail'
      })
    },
    /* 应付费用项目-服务费 */
    getServiceFee (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.serviceFeeTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listServiceFeeDetail'
      })
    },
    /* 应付费用项目-商保 */
    getComminsure (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.comminsureTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listComminsureDetail'
      })
    },
    /* 应付费用项目-残保金 */
    getCBJ (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.cBJTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listCBJDetail'
      })
    },
    /* 应付费用项目-安残金 */
    getACJ (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.aCJTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/receivable/listACJDetail'
      })
    },
    /* 实付费用项目-工资信息 */
    getRealitySalary (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realitySalaryTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listSalaryDetail'
      })
    },
    /* 实付费用项目-个税 */
    getRealityTax (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realityTaxTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listTaxDetail'
      })
    },
    /* 实付费用项目-社保 */
    getRealitySocial (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realitySocialTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listSocialDetail'
      })
    },
    /* 实付费用项目-公积金 */
    getRealityAccfund (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realityAccfundTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listAccfundDetail'
      })
    },
    /* 实付费用项目-服务费 */
    getRealityFee (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realityFeeTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listServiceFeeDetail'
      })
    },
    /* 实付费用项目-商保 */
    getRealityComminsure (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realityComminsureTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listComminsureDetail'
      })
    },
    /* 实付费用项目-残保金 */
    getRealityCBJ (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realityCBJTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listCBJDetail'
      })
    },
    /* 实付费用项目-安残金 */
    getRealityACJ (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.realityACJTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/payed/listACJDetail'
      })
    },
    /* 退费项目-工资信息 */
    getSalaryDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.salaryDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listSalaryDiffDetail'
      })
    },
    /* 退费项目-个税 */
    getTaxDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.taxDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listTaxDiffDetail'
      })
    },
    /* 退费项目-社保 */
    getSocialDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.socialDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listSocialDiffDetail'
      })
    },
    /* 退费项目-公积金 */
    getAccfundDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.accfundDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listAccfundDiffDetail'
      })
    },
    /* 退费项目-服务费 */
    getServiceFeeDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.serviceFeeDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listServiceFeeDiffDetail'
      })
    },
    /* 退费项目-商保 */
    getComminsureDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.comminsureDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listComminsureDiffDetail'
      })
    },
    /* 退费项目-残保金 */
    getCBJDiff (params = []) {
      params = [{ property: 'employeeId', value: String(this.employeeId) }]
      this.$refs.cBJDiffTable.fetch({
        query: params,
        method: 'post',
        url: '/api/employee/refund/listCBJDiffDetail'
      })
    },
    /* 编辑 */
    handleEdit () {
      this.$router.push('/employee/empAdd?employeeSiteId=' + this.employeeSiteId)
    }
  }
}
</script>
<style lang="less" scoped>
  .content {
    /deep/.palTableFixed {
      padding:0 20px !important;
    }
    /deep/.el-table{
      margin:0 20px;
    }
    background: #fff;
    .tab-type {
      padding: 0 20px;
    }
    .table-title-top-div {
      border-bottom: 1px solid #ddd;
      margin-bottom: 30px;
    }
    .table-title-top {
      float: left;
      .title-name {
        display: inline-block;
        width: 123px;
        height: 40px;
        border: 1px solid #ddd;
        border-bottom: none;
        text-align: center;
        line-height: 40px;
        border-radius: 5px 5px 0 0;
        cursor: pointer;
      }
      .active2 {
        border-color: #409EFF;
        color: #409EFF;
        border-bottom: 1px solid #ffffff;
        margin-bottom: -1px;
      }
    }
    .header {
      position: fixed;
      top: 80px;
      left: 250px;
      background: #fff;
      z-index: 9999;
      width: 84%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      padding: 0 20px 0 29px;
      border-bottom: 20px solid #f0f2f5;
      .header-left, .header-right {
        display: flex;
        align-items: center;
      }
    }

  }

  .spl-tabs {
    .spl-tabs-header {
      width: 87%;
      position: fixed;
      top: 190px;
      z-index: 9999;
      height: 50px;
      background: #F8F8F8;
      .span-tabs {
        position: relative;
        display: inline-block;
        width: 183px;
        height: 100%;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        .active-img {
          position: absolute;
          left: 50%;
          bottom: 0;
          margin-left: -9px;
          width: 18px;
          height: 16px;
          z-index: 999;
        }
      }
    }
    .active {
      background: #409EFF;
      color: #fff;
    }
  }

  /deep/ .el-input__icon, .el-icon-date {
    color: #409eff;
  }

  /deep/ .el-input__inner {
    height: 32px ! important;
    line-height: 32px ! important;
  }

  #el-button {
    width: 40px;
    padding: 7px 0;
  }

  .basicInfo, .bankInfo, .payoffInfo, .insurance, .providentFund, .commercial {
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 19px 0 18px 0;
      .title-img {
        margin: 0 14px 0 20px;
      }
      .title-name {
        font-size: 16px;
        font-weight: bold;
        color: #000;
      }
    }
  }
  .insurance, .providentFund, .commercial {
    position: relative;
    .header-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #409EFF;
      .editRecord {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
      }
    }
    .d-table-img {
      width: 18px;
      height: 16px;
      position: absolute;
      right: 80px;
      top: 40px;
      z-index: 999;
    }
    .d-table {
      width: 100%;
      padding-bottom: 10px;
      position: absolute;
      left: 0px;
      top: 56px;
      z-index: 99;
      box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.3);
      background: #fff;
      /deep/ .el-table {
        margin-top: 0;
      }
    }
  }

  /deep/ .el-form, .el-form--label-right {
    margin: 0 20px;
    display: flex;
    border-bottom: 1px solid #ddd;
    padding-bottom: 22px;
    div {
      width: 100%;
      /deep/ .el-form-item {
        width: 100%;
        margin-bottom: 0;
        /deep/ .el-form-item__label {
          padding: 0;
        }
        /deep/ .el-input__inner {
          border: none;
        }
      }
    }
    .one {
      margin-left: 20px;
    }
  }
</style>
