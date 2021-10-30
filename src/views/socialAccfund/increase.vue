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
      <h3 class="fl">增员</h3>
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
          <div class="detail-title clearfix">
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
          <div class="pb-20" style="border: 1px solid #DDDDDD; border-top: none">

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
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialForm(rule, value, callback, '请输入基数'), trigger:'blur'},{ validator: checkSocialBase, trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">基数:</span>
                      </template>
                      <el-input v-model="socialForm.empTbBase"
                                :placeholder="socialForm.productCodeItem.minBase?socialForm.productCodeItem.minBase+'~'+socialForm.productCodeItem.maxBase:''"
                                clearable></el-input>
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
                      <el-input v-model="socialForm.fieldList[index].value" v-if="item.inputType!='40009006' && item.scopes.length<1" @blur="fieldInputBlur(index, 'socialForm')"
                                clearable></el-input>

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

              <!--补缴-->
              <el-row class="row-bg m-form del-m-form" justify="space-around" :span="24" v-show="socialPayBackForm.showPayBack">
                <i class="el-icon-error ic-del-red" @click="delSocialPayBack"></i>
                <el-form :inline="true" :model="socialPayBackForm" ref="socialPayBackForm" label-width="120px">
                  <el-col :span="rowSpan">
                    <el-form-item label="参保地:" prop="suppAddrName"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请选择参保地'), trigger:'blur'},{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请选择参保地'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">参保地:</span>
                      </template>
                      <addrSelector v-model="socialPayBackForm.suppAddrName" :addrArr="socialForm.addrArr"
                                    @changeAddrSelect="getSocialPayBackAddrId" width="100%"></addrSelector>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="基数:" prop="empBjBase"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请输入基数'), trigger:'blur'},{ validator: (rule, value, callback)=>checkSocialAccfundPayBackBase(rule, value, callback, 1), trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">基数:</span>
                      </template>
                      <el-input v-model="socialPayBackForm.empBjBase"
                                :placeholder="socialPayBackForm.limitBaseMin!=''?socialPayBackForm.limitBaseMin+'~'+socialPayBackForm.limitBaseMax:''"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <span class="bjRange required-pre">补缴区间: </span>
                    <el-form-item label="" label-width="0" class="bjDate" prop="bjStartDate" style="margin-right: 0;"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请选择开始时间'), trigger:'change'}, { validator: (rule, value, callback)=>checkSocialAccfundPayBackDate(rule, value, callback, 1), trigger:'change'}]">
                      <el-date-picker v-model="socialPayBackForm.bjStartDate" value-format="yyyy-MM" class="date-editor2" type="month"
                                       @change="getPayBackBaseRange(1)" clearable :picker-options='socialPayBackForm.pickerBeginDateBefore'>
                      </el-date-picker>
                    </el-form-item>
                    <span class="fl lh-32 ml-5 mr-5">-</span>
                    <el-form-item label="" class="bjDate" prop="bjEndDate" style="margin-right: 0;"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请选择结束时间'), trigger:'change'}, { validator: (rule, value, callback)=>checkSocialAccfundPayBackDate(rule, value, callback, 1), trigger:'change'}]"
                                  label-width="0">

                      <el-date-picker v-model="socialPayBackForm.bjEndDate" value-format="yyyy-MM" class="date-editor2" type="month"
                                       @change="getPayBackBaseRange(1)" clearable :picker-options='socialPayBackForm.pickerBeginDateBefore'>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="补缴险种:" prop="suppItemsCodes"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请选择补缴险种'), trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">补缴险种:</span>
                      </template>
                      <el-checkbox-group v-model="socialPayBackForm.suppItemsCodes">
                        <el-checkbox v-for="it in socialPayBackForm.suppItemList.mustSocialSuppRules" :key="it.id" :label="it.typeCode" :disabled="true">{{it.typeName}}</el-checkbox>
                        <el-checkbox v-for="it in socialPayBackForm.suppItemList.notdefaultSocialSuppRules" :key="it.id" :label="it.typeCode">{{it.typeName}}</el-checkbox>
                        <el-tooltip placement="top" effect="light" v-for="it in socialPayBackForm.suppItemList.noaddSocialSuppRules" :key="it.id">
                          <div slot="content"><p><i class="el-icon-warning-outline text-orange font-16 mr-5"></i>无增员记录，不可补缴</p></div>
                          <el-checkbox :label="it.typeCode" :disabled="true">{{it.typeName}}</el-checkbox>
                        </el-tooltip>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-form>

                <el-col :span="rowSpan" v-for="(item,index) in socialPayBackForm.fieldList" :key="index">
                  <!--("40009001","文字")
                     ("40009002","字符")
                     ("40009003","数字")
                     ("40009004","百分比")
                     ("40009005","货币")
                     ("40009006","日期")-->
                  <!--只要校验是否必填-->
                  <div :key="refreshSocialPayBackKey">
                  <el-form :inline="true" :model="socialPayBackForm.fieldList[index]" :ref="'socialPayBackFieldForm'+index"
                           label-width="120px">
                    <el-form-item :label="item.declareColumnName + ':'" prop="value"
                                  :rules="[{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'blur'},{ validator: (rule, value, callback)=>checkSocialPayBackForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">{{item.declareColumnName}}:</span>
                      </template>
                      <!--非日期-->
                      <el-input v-model="socialPayBackForm.fieldList[index].value" v-if="item.inputType!='40009006' && item.scopes.length<1"  @blur="fieldInputBlur(index, 'socialPayBackForm')"
                                clearable></el-input>
                      <!--下拉选择框-->
                      <el-select v-model="socialPayBackForm.fieldList[index].value" class="w-p100"
                                 v-if="item.inputType!='40009006' && item.scopes.length>0" clearable>
                        <el-option v-for="(it, ind) in item.scopes" :key="ind" :label="it"
                                   :value="it"></el-option>
                      </el-select>
                      <!--非日期-->
                      <!--日期-->
                      <el-date-picker v-if="item.inputType=='40009006'" v-model="socialPayBackForm.fieldList[index].value" :value-format="dateFormat(item.format, 'format')" class="date-editor2" :type="dateFormat(item.format, 'pickerType')" clearable></el-date-picker>
                      <!--日期-->
                    </el-form-item>
                  </el-form>
                  </div>
                </el-col>
              </el-row>

              <el-button size="small" class="dash-gray-btn mt-20 w-p100" icon="el-icon-plus" v-show="!socialPayBackForm.showPayBack" @click="addSocialPayBack">添加补缴</el-button>
              <!--补缴-->
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
                                      type="month" @change="getAccfundProducts()" clearable>
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
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundForm(rule, value, callback, '请输入基数'), trigger:'blur'},{ validator: checkAccfundBase, trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">基数:</span>
                      </template>
                      <el-input v-model="accfundForm.empTbBase"
                                :placeholder="accfundForm.productCodeItem.minBase?accfundForm.productCodeItem.minBase+'~'+accfundForm.productCodeItem.maxBase:''"
                                clearable></el-input>
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

              <!--补缴-->
              <el-row class="row-bg m-form del-m-form" justify="space-around" :span="24" v-show="accfundPayBackForm.showPayBack">
                <i class="el-icon-error ic-del-red" @click="delAccfundBack"></i>
                <el-form :inline="true" :model="accfundPayBackForm" ref="accfundPayBackForm" label-width="120px">
                  <el-col :span="rowSpan">
                    <el-form-item label="参保地:" prop="suppAddrName"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请选择参保地'), trigger:'blur'},{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请选择参保地'), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">参保地:</span>
                      </template>
                      <addrSelector v-model="accfundPayBackForm.suppAddrName" :addrArr="accfundForm.addrArr"
                                    @changeAddrSelect="getAccfundPayBackAddrId" width="100%"></addrSelector>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan">
                    <el-form-item label="基数:" prop="empBjBase"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请输入基数'), trigger:'blur'},{ validator: (rule, value, callback)=>checkSocialAccfundPayBackBase(rule, value, callback, 2), trigger:'blur'}]">
                      <template slot="label">
                        <span class="required-pre">基数:</span>
                      </template>
                      <el-input v-model="accfundPayBackForm.empBjBase"
                                :placeholder="accfundPayBackForm.limitBaseMin!=''?accfundPayBackForm.limitBaseMin+'~'+accfundPayBackForm.limitBaseMax:''"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="rowSpan" class="display-flex">
                    <span class="bjRange required-pre">补缴区间: </span>
                    <el-form-item label-width="0" prop="bjStartDate" class="bjDate" style="margin-right: 0;"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请选择开始时间'), trigger:'change'}, { validator: (rule, value, callback)=>checkSocialAccfundPayBackDate(rule, value, callback, 2), trigger:'change'}]">
                      <el-date-picker v-model="accfundPayBackForm.bjStartDate" value-format="yyyy-MM" class="date-editor2" type="month"
                                      @change="getPayBackBaseRange(2)" clearable :picker-options='accfundPayBackForm.pickerBeginDateBefore'>
                      </el-date-picker>
                    </el-form-item>
                    <span class="fl lh-32 ml-5 mr-5">-</span>
                    <el-form-item label="" prop="bjEndDate" class="bjDate" style="margin-right: 0;"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请选择结束时间'), trigger:'change'}, { validator: (rule, value, callback)=>checkSocialAccfundPayBackDate(rule, value, callback, 2), trigger:'change'}]"
                                  label-width="0">
                      <el-date-picker v-model="accfundPayBackForm.bjEndDate" value-format="yyyy-MM" class="date-editor2" type="month"
                                      @change="getPayBackBaseRange(2)" clearable :picker-options='accfundPayBackForm.pickerBeginDateBefore'>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form>

                <el-col :span="rowSpan" v-for="(item,index) in accfundPayBackForm.fieldList" :key="index">
                  <!--("40009001","文字")
                     ("40009002","字符")
                     ("40009003","数字")
                     ("40009004","百分比")
                     ("40009005","货币")
                     ("40009006","日期")-->
                  <!--只要校验是否必填-->
                  <div :key="refreshAccfundPayBackKey">
                    <el-form :inline="true" :model="accfundPayBackForm.fieldList[index]" :ref="'accfundPayBackFieldForm'+index"
                           label-width="120px">
                    <el-form-item :label="item.declareColumnName + ':'" prop="value"
                                  :rules="[{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'blur'},{ validator: (rule, value, callback)=>checkAccfundPayBackForm(rule, value, callback, '请输入'+item.declareColumnName), trigger:'change'}]">
                      <template slot="label">
                        <span class="required-pre">{{item.declareColumnName}}:</span>
                      </template>
                      <!--非日期-->
                      <el-input v-model="accfundPayBackForm.fieldList[index].value" v-if="item.inputType!='40009006' && item.scopes.length<1"  @blur="fieldInputBlur(index, 'accfundPayBackForm')"
                                clearable></el-input>

                      <!--下拉选择框-->
                      <el-select v-model="accfundPayBackForm.fieldList[index].value" class="w-p100"
                                 v-if="item.inputType!='40009006' && item.scopes.length>0" clearable>
                        <el-option v-for="(it, ind) in item.scopes" :key="ind" :label="it"
                                   :value="it"></el-option>
                      </el-select>
                      <!--非日期-->
                      <!--日期-->
                      <el-date-picker v-if="item.inputType=='40009006'" v-model="accfundPayBackForm.fieldList[index].value" :value-format="dateFormat(item.format, 'format')" class="date-editor2" :type="dateFormat(item.format, 'pickerType')" clearable></el-date-picker>
                      <!--日期-->
                    </el-form-item>
                  </el-form>
                  </div>
                </el-col>
              </el-row>

              <el-button size="small" class="dash-gray-btn mt-20 w-p100" icon="el-icon-plus" v-show="!accfundPayBackForm.showPayBack" @click="addAccfundPayBackForm">添加补缴</el-button>
              <!--补缴-->

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
        <el-Table :data="socialTable" ref="socialTable" :key="refreshSocialTable">
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
        <el-Table v-show="accfundTable.length>0" :data="accfundTable" ref="accfundTable"
                  :key="refreshAccfundTable" :show-header="false">
          <template slot="empty"><span></span></template>
          <el-table-column prop="itemTypeName" width="200" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="payFrequencyName" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="dCompBase" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="compRatioMin" min-width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{scope.row.compRatioMin | calcRatio }}%</p>
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
        { name: '录入社保公积金增员' }
      ],
      refreshSocialKey: new Date().getTime() + 1,
      refreshAccfundKey: new Date().getTime() + 2,
      refreshSocialPayBackKey: new Date().getTime() + 3,
      refreshAccfundPayBackKey: new Date().getTime() + 4,
      refreshSocialTable: new Date().getTime() + 5,
      refreshAccfundTable: new Date().getTime() + 6,
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
        fieldList: [],
        tableCompTotal: 0,
        tableEmpTotal: 0,
        tableTotal: 0
      },
      socialTable: [],
      accfundTable: [],
      residence: '', // 本地或者外地（户口性质）
      selectEmployee: {
        loading: false,
        optionList: [],
        name: '',
        idCard: '',
        residenceType: '',
        empId: ''
      },
      saveBtnLoading: false,
      changeType: 1, // changeType 申报类型（1：增员，2：减员，3：调基，4：方案变更，5：补缴）
      paybackType: 5,
      socialPayBackForm: {
        suppAddrId: '',
        suppAddrName: '',
        empBjBase: '',
        bjStartDate: '',
        bjEndDate: '',
        suppItemsCodes: [],
        suppItemList: [], // 由参保地获取险种items
        fieldList: [],
        limitStartDate: '',
        limitEndDate: '',
        limitBaseMin: '',
        limitBaseMax: '',
        baseInsured: '',
        showPayBack: false,
        pickerBeginDateBefore: {} // 控制非日期范围的不可选
      },
      accfundPayBackForm: {
        suppAddrId: '',
        suppAddrName: '',
        empBjBase: '',
        bjStartDate: '',
        bjEndDate: '',
        fieldList: [],
        limitStartDate: '',
        limitEndDate: '',
        limitBaseMin: '',
        limitBaseMax: '',
        baseInsured: '',
        showPayBack: false,
        pickerBeginDateBefore: {} // 控制非日期范围的不可选
      },
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
  watch: {
    'socialPayBackForm.suppItemsCodes' (newValue, oldValue) {
      this.getPayBackDateRange(1)
      this.getPayBackBaseRange(1)
    }
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
      }).catch((data) => {})
    },
    // 根据参保地获取社保方案
    getSocailProducts () {
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
        if (this.$lodash.isEmpty(this.socialForm.socialAddrId) || this.$lodash.isEmpty(this.selectEmployee.idCard) || this.socialForm.optrCompId == '') {
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

      /* optrCompId: 操作公司id（【社保公积金增减员类别为增员】或者【社保公积金增减员类别为补缴并且当前页面填写了增员方案信息】，
      此参数必传，参数值设置为选中方案对应的操作公司ID） */
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
      }).catch((data) => {})
    },

    // 获取社保公积金-补缴补充字段
    getPayBackDeclareColumnDs (type) {
      // type:社保1公积金2
      let addressName = ''
      let optrCompId = ''
      if (type === 1) {
        if (this.$lodash.isEmpty(this.socialPayBackForm.suppAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard)) {
          return false
        }
        addressName = this.socialPayBackForm.suppAddrName
        optrCompId = this.socialForm.optrCompId
      } else {
        if (this.$lodash.isEmpty(this.accfundPayBackForm.suppAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard)) {
          return false
        }
        addressName = this.accfundPayBackForm.suppAddrName
        optrCompId = this.accfundForm.optrCompId
      }
      /* optrCompId: 操作公司id（【社保公积金增减员类别为增员】或者【社保公积金增减员类别为补缴并且当前页面填写了增员方案信息】，
           此参数必传，参数值设置为选中方案对应的操作公司ID） */
      this.$http({
        url: '/api/socialAccfund/declareColumnDs',
        method: 'post',
        data: {
          addressName: addressName,
          bussinessType: type,
          changeType: this.paybackType,
          idCard: this.selectEmployee.idCard,
          optrCompId: optrCompId
        }
      }).then(({ data }) => {
        if (type === 1) {
          this.socialPayBackForm.fieldList = data.data[0]
          this.refreshSocialPayBackKey = new Date().getTime()
        } else {
          this.accfundPayBackForm.fieldList = data.data[0]
          this.refreshAccfundPayBackKey = new Date().getTime()
        }
      }).catch((data) => {})
    },

    // 获取社保补缴的险种信息(根据补缴参保地)
    getSocialPayBackItems () {
      let that = this
      if (this.$lodash.isEmpty(this.socialPayBackForm.suppAddrName) || this.$lodash.isEmpty(this.selectEmployee.idCard)) {
        this.socialPayBackForm.suppItemList = []
        this.socialPayBackForm.limitStartDate = ''
        this.socialPayBackForm.limitEndDate = ''
        this.socialPayBackForm.limitBaseMin = ''
        this.socialPayBackForm.limitBaseMax = ''
        this.socialPayBackForm.baseInsured = ''
        return false
      }
      this.$http({
        url: '/api/socialAccfund/socialSuppmentItems',
        method: 'post',
        data: {
          addressId: this.socialPayBackForm.suppAddrId,
          addressName: this.socialPayBackForm.suppAddrName,
          changeType: this.paybackType,
          idCard: this.selectEmployee.idCard,
          productId: this.socialForm.socialProductId
        }
      }).then(({ data }) => {
        this.socialPayBackForm.suppItemList = data.data[0]
        let arr = []
        data.data[0].mustSocialSuppRules.forEach(item => {
          arr.push(item.typeCode)
        })
        that.socialPayBackForm.suppItemsCodes = arr
      }).catch((data) => {})
    },

    // 获取社保公积金可补缴的时间范围(根据补缴参保地)
    getPayBackDateRange (type) {
      let that = this
      let suppAddrName
      let idCard = this.selectEmployee.idCard
      let suppItemsCodes
      let setObj = {}
      if (type == 1) {
        suppAddrName = this.socialPayBackForm.suppAddrName
        suppItemsCodes = this.socialPayBackForm.suppItemsCodes
        setObj.suppItemsCodes = suppItemsCodes
        if (this.$lodash.isEmpty(suppAddrName) || suppItemsCodes == true || this.$lodash.isEmpty(idCard)) {
          this.socialPayBackForm.limitStartDate = ''
          this.socialPayBackForm.limitEndDate = ''
          return false
        }
        if (this.socialForm.socialProductId != '') {
          setObj.productId = this.socialForm.socialProductId
        }
      } else {
        suppAddrName = this.accfundPayBackForm.suppAddrName
        if (this.$lodash.isEmpty(suppAddrName) || this.$lodash.isEmpty(idCard)) {
          this.accfundPayBackForm.limitStartDate = ''
          this.accfundPayBackForm.limitEndDate = ''
          return false
        }
        if (this.accfundForm.accfundProductId != '') {
          setObj.productId = this.accfundForm.accfundProductId
        }
      }
      setObj.addressName = suppAddrName
      setObj.idCard = idCard
      setObj.type = type
      this.$http({
        url: '/api/socialAccfund/suppmentDateRange',
        method: 'post',
        data: setObj
      }).then(({ data }) => {
        let startDate = data.data[0].startDate
        let endDate = data.data[0].endDate
        startDate = this.$lodash.isEmpty(startDate) ? '' : startDate
        endDate = this.$lodash.isEmpty(endDate) ? '' : endDate
        if (type == 1) {
          this.socialPayBackForm.limitStartDate = startDate
          this.socialPayBackForm.limitEndDate = endDate
          if (new Date(that.socialPayBackForm.bjStartDate) < new Date(startDate) || new Date(that.socialPayBackForm.bjStartDate) > new Date(endDate)) {
            that.socialPayBackForm.bjStartDate = ''
          }
          if (new Date(that.socialPayBackForm.bjEndDate) < new Date(startDate) || new Date(that.socialPayBackForm.bjEndDate) > new Date(endDate)) {
            that.socialPayBackForm.bjEndDate = ''
          }
          this.socialPayBackForm.pickerBeginDateBefore = {
            disabledDate (time) {
              let time2 = new Date(that.$moment(time).format('YYYY-MM'))
              return time2 < new Date(startDate) || time2 > new Date(endDate) // 如果当天可选，就不用减8.64e7
            }
          }
        } else {
          this.accfundPayBackForm.limitStartDate = startDate
          this.accfundPayBackForm.limitEndDate = endDate
          if (new Date(that.accfundPayBackForm.bjStartDate) < new Date(startDate) || new Date(that.accfundPayBackForm.bjStartDate) > new Date(endDate)) {
            that.accfundPayBackForm.bjStartDate = ''
          }
          if (new Date(that.accfundPayBackForm.bjEndDate) < new Date(startDate) || new Date(that.accfundPayBackForm.bjEndDate) > new Date(endDate)) {
            that.accfundPayBackForm.bjEndDate = ''
          }
          this.accfundPayBackForm.pickerBeginDateBefore = {
            disabledDate (time) {
              let time2 = new Date(that.$moment(time).format('YYYY-MM'))
              return time2 < new Date(startDate).getTime() || time2 > new Date(endDate).getTime() // 如果当天可选，就不用减8.64e7
            }
          }
        }
      }).catch((data) => {})
    },

    // 获取社保公积金基数范围(根据补缴参保地)
    getPayBackBaseRange (type) {
      let that = this
      let suppAddrName
      let bjStartDate
      let bjEndDate
      let idCard = this.selectEmployee.idCard
      let suppItemsCodes
      let setObj = {}
      if (type == 1) {
      //  社保
        suppAddrName = this.socialPayBackForm.suppAddrName
        bjStartDate = this.socialPayBackForm.bjStartDate
        bjEndDate = this.socialPayBackForm.bjEndDate
        suppItemsCodes = this.socialPayBackForm.suppItemsCodes
        if (this.$lodash.isEmpty(suppAddrName) || suppItemsCodes == true || this.$lodash.isEmpty(bjStartDate) || this.$lodash.isEmpty(bjEndDate) || this.$lodash.isEmpty(idCard) || new Date(bjStartDate) > new Date(bjEndDate)) {
          this.socialPayBackForm.limitBaseMin = ''
          this.socialPayBackForm.limitBaseMax = ''
          this.socialPayBackForm.baseInsured = ''
          return false
        }
        setObj.suppItemsCodes = suppItemsCodes
        if (this.socialForm.socialProductId != '') {
          setObj.productId = this.socialForm.socialProductId
        }
      } else {
        //  公积金
        suppAddrName = this.accfundPayBackForm.suppAddrName
        bjStartDate = this.accfundPayBackForm.bjStartDate
        bjEndDate = this.accfundPayBackForm.bjEndDate
        suppItemsCodes = this.accfundPayBackForm.suppItemsCodes
        if (this.$lodash.isEmpty(suppAddrName) || this.$lodash.isEmpty(bjStartDate) || this.$lodash.isEmpty(bjEndDate) || this.$lodash.isEmpty(idCard) || new Date(bjStartDate) > new Date(bjEndDate)) {
          this.accfundPayBackForm.limitBaseMin = ''
          this.accfundPayBackForm.limitBaseMax = ''
          this.accfundPayBackForm.baseInsured = ''
          return false
        }
        if (this.accfundForm.accfundProductId != '') {
          setObj.productId = this.accfundForm.accfundProductId
        }
      }
      setObj.addressName = suppAddrName
      setObj.idCard = idCard
      setObj.startMonth = bjStartDate
      setObj.endMonth = bjEndDate
      setObj.type = type
      this.$http({
        url: '/api/socialAccfund/suppmentBaseRange',
        method: 'post',
        data: setObj
      }).then(({ data }) => {
        let minBase = data.data[0].minBase
        let maxBase = data.data[0].maxBase
        let baseInsured = data.data[0].baseInsured
        minBase = minBase != '' && minBase != null && minBase != undefined ? minBase : ''
        maxBase = maxBase != '' && maxBase != null && maxBase != undefined ? maxBase : ''
        if (type == 1) {
          that.socialPayBackForm.limitBaseMin = minBase
          that.socialPayBackForm.limitBaseMax = maxBase
          that.socialPayBackForm.baseInsured = baseInsured
        } else {
          that.accfundPayBackForm.limitBaseMin = minBase
          that.accfundPayBackForm.limitBaseMax = maxBase
          that.accfundPayBackForm.baseInsured = baseInsured
        }
      }).catch((data) => {})
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
        }).catch((data) => {})
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

      //  社保补缴
      this.getSocialPayBackItems()
      this.getPayBackDeclareColumnDs(1)

      //  公积金补缴
      this.getPayBackDeclareColumnDs(2)
      this.getPayBackDateRange(2)
      this.getPayBackBaseRange(2)
    },
    // 改变社保-参保地
    getSocialAddrId (item) {
      if (this.socialForm.socialAddrId == item.id) {
        return false
      }
      this.socialForm.socialAddrId = item.id
      this.getSocialAddrType()
      this.getSocailProducts()
      this.getDeclareColumnDs(1)
    },
    // 改变公积金-参保地
    getAccfundAddrId (item) {
      if (this.accfundForm.accfundAddrId == item.id) {
        return false
      }
      this.accfundForm.accfundAddrId = item.id
      this.getAccfundProducts()
      this.getDeclareColumnDs(2)
    },
    // 改变社保-补缴-参保地
    getSocialPayBackAddrId (item) {
      if (this.socialPayBackForm.suppAddrId == item.id) {
        return false
      }
      if (item != 'addSocialPayBack') {
        this.socialPayBackForm.suppAddrId = item.id
      }
      this.getSocialPayBackItems()
      this.getPayBackDeclareColumnDs(1)
    },
    // 改变公积金-补缴-参保地
    getAccfundPayBackAddrId (item) {
      if (this.socialPayBackForm.suppAddrId == item.id) {
        return false
      }
      if (item != 'addAccfundPayBackForm') {
        this.socialPayBackForm.suppAddrId = item.id
      }
      this.getPayBackDeclareColumnDs(2)
      this.getPayBackDateRange(2)
      this.getPayBackBaseRange(2)
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
      this.getSocialPayBackItems()
      this.calcSocialTable()
      this.getPayBackDeclareColumnDs(1)
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
      this.getPayBackDeclareColumnDs(2)
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

    // 删除-社保-补缴
    delSocialPayBack () {
      this.socialPayBackForm.showPayBack = false
      this.$refs.socialPayBackForm.clearValidate()
      for (let a = 0; a < this.socialPayBackForm.fieldList.length; a++) {
        this.$refs['socialPayBackFieldForm' + a][0].clearValidate()
      }
      this.socialPayBackForm = {
        suppAddrId: '',
        suppAddrName: '',
        empBjBase: '',
        bjStartDate: '',
        bjEndDate: '',
        suppItemsCodes: [],
        suppItemList: [], // 由参保地获取险种items
        fieldList: [],
        limitStartDate: '',
        limitEndDate: '',
        limitBaseMin: '',
        limitBaseMax: '',
        showPayBack: false
      }
    },
    // 删除-公积金-补缴
    delAccfundBack () {
      this.accfundPayBackForm.showPayBack = false
      this.$refs.accfundPayBackForm.clearValidate()
      for (let a = 0; a < this.accfundPayBackForm.fieldList.length; a++) {
        this.$refs['accfundPayBackFieldForm' + a][0].clearValidate()
      }
      this.accfundPayBackForm = {
        suppAddrId: '',
        suppAddrName: '',
        empBjBase: '',
        bjStartDate: '',
        bjEndDate: '',
        suppItemsCodes: [],
        suppItemList: [], // 由参保地获取险种items
        fieldList: [],
        limitStartDate: '',
        limitEndDate: '',
        limitBaseMin: '',
        limitBaseMax: '',
        showPayBack: false
      }
    },

    handleValid () {
      this.saveBtnLoading = true
      if (!this.checkSocialRequired() && !this.checkAccfundRequired() && !this.checkSocialPayBackRequired() && !this.checkAccfundPayBackRequired()) {
        this.$message.warning('请先填写数据')
        this.saveBtnLoading = false
        return
      }

      let socialFieldValid = true
      let accfundFieldValid = true
      let socialFormValid = true
      let accfundFormValid = true

      let socialPayBackFieldValid = true
      let socialPayBackFormValid = true

      let accfundPayBackFieldValid = true
      let accfundPayBackFormValid = true

      // 校验补充字段
      for (let q = 0; q < this.socialForm.fieldList.length; q++) {
        this.$refs['socialFieldForm' + q][0].validate((valid) => {
          if (socialFieldValid) {
            socialFieldValid = valid
          }
        })
      }
      for (let y = 0; y < this.accfundForm.fieldList.length; y++) {
        this.$refs['accfundFieldForm' + y][0].validate((valid) => {
          if (accfundFieldValid) {
            accfundFieldValid = valid
          }
        })
      }
      // 补缴
      for (let x = 0; x < this.socialPayBackForm.fieldList.length; x++) {
        this.$refs['socialPayBackFieldForm' + x][0].validate((valid) => {
          if (socialPayBackFieldValid) {
            socialPayBackFieldValid = valid
          }
        })
      }
      for (let u = 0; u < this.accfundPayBackForm.fieldList.length; u++) {
        this.$refs['accfundPayBackFieldForm' + u][0].validate((valid) => {
          if (accfundPayBackFieldValid) {
            accfundPayBackFieldValid = valid
          }
        })
      }

      let that = this
      this.$refs.socialForm.validate((valid) => {
        socialFormValid = valid
        that.$refs.accfundForm.validate((valid2) => {
          accfundFormValid = valid2
          that.$refs.socialPayBackForm.validate((valid3) => {
            socialPayBackFormValid = valid3
            that.$refs.accfundPayBackForm.validate((valid4) => {
              accfundPayBackFormValid = valid4
              if (accfundPayBackFormValid && accfundPayBackFieldValid && socialPayBackFormValid && socialPayBackFieldValid && accfundFormValid && socialFormValid && socialFieldValid && accfundFieldValid) {
                that.save()
              } else {
                that.saveBtnLoading = false
                return false
              }
            })
          })
        })
      })
    },

    save () {
      var accfundSuppDetails = []
      var socialSuppDetails = []

      var socialSuppmentDetails = []
      var accfundSuppmentDetails = []

      var socialItem
      for (let i = 0; i < this.socialForm.fieldList.length; i++) {
        socialItem = this.socialForm.fieldList[i]
        socialSuppDetails.push({ columName: socialItem.declareColumnName, columValue: socialItem.value })
      }
      var accfundItem
      for (let j = 0; j < this.accfundForm.fieldList.length; j++) {
        accfundItem = this.accfundForm.fieldList[j]
        accfundSuppDetails.push({ columName: accfundItem.declareColumnName, columValue: accfundItem.value })
      }

      var socialBJItem
      for (let w = 0; w < this.socialPayBackForm.fieldList.length; w++) {
        socialBJItem = this.socialPayBackForm.fieldList[w]
        socialSuppmentDetails.push({ columName: socialBJItem.declareColumnName, columValue: socialBJItem.value })
      }

      var accfundBJItem
      for (let w = 0; w < this.accfundPayBackForm.fieldList.length; w++) {
        accfundBJItem = this.accfundPayBackForm.fieldList[w]
        accfundSuppmentDetails.push({ columName: accfundBJItem.declareColumnName, columValue: accfundBJItem.value })
      }

      var setObj = {
        empAccfundChange: {
          accfundAddrId: this.accfundForm.accfundAddrId,
          accfundAddrName: this.accfundForm.accfundAddrName,
          accfundProductId: this.accfundForm.accfundProductId,
          accfundProductName: this.accfundForm.accfundProductName,
          changeType: this.changeType,
          fyDate: this.accfundForm.fyDate,
          productCode: this.accfundForm.productCode,
          accfundSuppDetails: accfundSuppDetails,
          empTbBase: Number(this.accfundForm.empTbBase),
          //  补缴
          suppAddrId: this.accfundPayBackForm.suppAddrId,
          suppAddrName: this.accfundPayBackForm.suppAddrName,
          empBjBase: Number(this.accfundPayBackForm.empBjBase),
          bjStartDate: this.accfundPayBackForm.bjStartDate,
          bjEndDate: this.accfundPayBackForm.bjEndDate,
          accfundSuppmentDetails: accfundSuppmentDetails
        },

        empSocialChange: {
          changeType: this.changeType,
          fyDate: this.socialForm.fyDate,
          productCode: this.socialForm.productCode,
          socialAddrId: this.socialForm.socialAddrId,
          socialAddrName: this.socialForm.socialAddrName,
          socialProductId: this.socialForm.socialProductId,
          socialProductName: this.socialForm.socialProductName,
          socialSuppDetails: socialSuppDetails,
          empTbBase: Number(this.socialForm.empTbBase),
          //  补缴
          suppAddrId: this.socialPayBackForm.suppAddrId,
          suppAddrName: this.socialPayBackForm.suppAddrName,
          suppItemCodes: this.socialPayBackForm.suppItemsCodes.join(','),
          empBjBase: Number(this.socialPayBackForm.empBjBase),
          bjStartDate: this.socialPayBackForm.bjStartDate,
          bjEndDate: this.socialPayBackForm.bjEndDate,
          socialSuppmentDetails: socialSuppmentDetails
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

    checkSocialPayBackRequired () {
      let suppAddrName = this.socialPayBackForm.suppAddrName
      let empBjBase = this.socialPayBackForm.empBjBase
      let bjStartDate = this.socialPayBackForm.bjStartDate
      let bjEndDate = this.socialPayBackForm.bjEndDate
      if (this.$lodash.isEmpty(suppAddrName) && this.$lodash.isEmpty(empBjBase) && this.$lodash.isEmpty(bjStartDate) && this.$lodash.isEmpty(bjEndDate)) {
        this.$refs.socialPayBackForm.clearValidate()
        for (var q = 0; q < this.socialPayBackForm.fieldList.length; q++) {
          this.$refs['socialPayBackFieldForm' + q][0].clearValidate()
        }
        return false
      } else {
        return true
      }
    },
    checkSocialPayBackForm (rule, value, callback, msg) {
      if (this.$lodash.isEmpty(value)) {
        if (this.checkSocialPayBackRequired()) {
          callback(new Error(msg))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    checkAccfundPayBackRequired () {
      let suppAddrName = this.accfundPayBackForm.suppAddrName
      let empBjBase = this.accfundPayBackForm.empBjBase
      let bjStartDate = this.accfundPayBackForm.bjStartDate
      let bjEndDate = this.accfundPayBackForm.bjEndDate
      if (this.$lodash.isEmpty(suppAddrName) && this.$lodash.isEmpty(empBjBase) && this.$lodash.isEmpty(bjStartDate) && this.$lodash.isEmpty(bjEndDate)) {
        this.$refs.accfundPayBackForm.clearValidate()
        for (var q = 0; q < this.accfundPayBackForm.fieldList.length; q++) {
          this.$refs['accfundPayBackFieldForm' + q][0].clearValidate()
        }
        return false
      } else {
        return true
      }
    },
    checkAccfundPayBackForm (rule, value, callback, msg) {
      if (this.$lodash.isEmpty(value)) {
        if (this.checkAccfundPayBackRequired()) {
          callback(new Error(msg))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验社保-基数
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
    // 校验公积金-基数
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

    // 校验社保公积金-补缴-基数
    checkSocialAccfundPayBackBase (rule, value, callback, type) {
      var numberExp = /^(-?\d+)(\.\d+)?$/
      let minBase
      let maxBase
      let baseInsured
      if (this.$lodash.isEmpty(value)) {
        callback()
      }
      if (numberExp.test(value)) {
        if (type == 1) {
          // 社保
          minBase = this.socialPayBackForm.limitBaseMin
          maxBase = this.socialPayBackForm.limitBaseMax
          baseInsured = this.socialPayBackForm.baseInsured
        } else {
          // 公积金
          minBase = this.accfundPayBackForm.limitBaseMin
          maxBase = this.accfundPayBackForm.limitBaseMax
          baseInsured = this.accfundPayBackForm.baseInsured
        }
        if (baseInsured != 1 && minBase != '' && (value < minBase || value > maxBase)) {
          callback(new Error('基数范围为' + minBase + '~' + maxBase))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入正确数值格式'))
      }
    },

    // 校验社保公积金-补缴-开始时间
    checkSocialAccfundPayBackDate (rule, value, callback, type) {
      if (this.$lodash.isEmpty(value)) {
        callback()
      }
      if (rule.field == 'bjEndDate') {
        if (type == 1) {
          this.$refs.socialPayBackForm.validateField('bjStartDate')
        } else {
          this.$refs.accfundPayBackForm.validateField('bjStartDate')
        }
        callback()
      }
      let startDate
      let endDate
      let limitStartDate
      let limitEndDate
      if (type == 1) {
        startDate = this.socialPayBackForm.bjStartDate
        endDate = this.socialPayBackForm.bjEndDate
        limitStartDate = this.socialPayBackForm.limitStartDate
        limitEndDate = this.socialPayBackForm.limitEndDate
      } else {
        startDate = this.accfundPayBackForm.bjStartDate
        endDate = this.accfundPayBackForm.bjEndDate
        limitStartDate = this.accfundPayBackForm.limitStartDate
        limitEndDate = this.accfundPayBackForm.limitEndDate
      }
      // 比较时间范围
      if (limitStartDate != '' && (new Date(startDate) < new Date(limitStartDate) || new Date(startDate) > new Date(limitEndDate))) {
        callback(new Error('时间范围为' + limitStartDate + '~' + limitEndDate))
      } else {
        // 比较开始-结束
        if (new Date(startDate) > new Date(endDate)) {
          callback(new Error('开始时间不能大于结束时间'))
        } else {
          callback()
        }
      }
    },

    addSocialPayBack () {
      this.socialPayBackForm.showPayBack = true
      this.socialPayBackForm.suppAddrId = this.socialForm.socialAddrId
      this.socialPayBackForm.suppAddrName = this.socialForm.socialAddrName
      this.getSocialPayBackAddrId('addSocialPayBack')
    },
    addAccfundPayBackForm () {
      this.accfundPayBackForm.showPayBack = true
      this.accfundPayBackForm.suppAddrId = this.accfundForm.accfundAddrId
      this.accfundPayBackForm.suppAddrName = this.accfundForm.accfundAddrName
      this.getAccfundPayBackAddrId('addAccfundPayBackForm')
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
      if (type == 'format') {
      //  获取格式
        return parseDateFormat(code)
      } else if (type == 'pickerType') {
      //  获取日期控件类型
        let res = parsePickerType(code)
        return res
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../assets/css/socialAccfund/decrease.less';
</style>
