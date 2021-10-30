<template>
  <div class="spl-container emp-container emp-add-container-main">
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="emp-title">
      <div class="emp-title-content">
        <p v-show="!isEdit" class="add-title"><span class="title">新增员工</span><span class="text">单个新增员工</span></p>
        <div v-show="isEdit" class="name-idcard">
          <p class="name">{{baseInfoForm.name}}</p>
          <p class="name-idcard" style="padding-top: 5px;">证件号码：{{baseInfoForm.titleIdCard}}</p>
        </div>
      </div>
    </div>

    <div class="emp-add-container" :style="{minHeight: contentHeight}" v-loading="pageLoading"
         element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading" :key="refreshBaseKey">

      <!--基本信息-->
      <div class="content-panel">
        <p class="add-type"><span class="step-title"><i class="ic-empAdd-type ic-empAdd-type1"></i>基本信息</span></p>
        <div class="add-type-form">
          <el-form :model="baseInfoForm" ref="baseInfoForm" label-width="">
            <!--大陆-->
            <div v-if="baseInfoForm.nationality===''||baseInfoForm.nationality=='10037001'">
              <el-row class="row-bg" justify="space-around" :gutter="80" :span="24" style="padding: 0 70px;">
                <el-col :span="rowSpan">
                  <p class="required fieldName">国籍</p>
                  <el-form-item label="" prop="nationality">
                    <el-select v-model="baseInfoForm.nationality" placeholder="请选择" class="w-p100"
                               @change="changeNationality" :disabled="isEdit">
                      <el-option v-for="item in employeeDataDict.nationalityTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">姓名</p>
                  <el-form-item label="" prop="name"
                                :rules="[{ required: true, message: '请输入姓名', trigger: 'blur'}]">
                    <el-input v-model.trim="baseInfoForm.name" placeholder="请输入" :maxlength="32" clearable
                              :disabled="isEdit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">证件号码</p>
                  <el-form-item label="" prop="idCard"
                                :rules="[{ required: true, message: '请输入证件号码', trigger: 'blur'}, { validator:checkIdCard, trigger:'blur'}]">
                    <el-input v-model.trim="baseInfoForm.idCard" @change="getEmployeeBySiteIdOrIDcard" placeholder="请输入"
                              :maxlength="30" clearable :disabled="isEdit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">民族</p>
                  <el-form-item label="" prop="nation"
                                :rules="[{ required: true, message: '请选择民族', trigger: 'change'}]">
                    <el-select v-model="baseInfoForm.nation" placeholder="请选择" class="w-p100">
                      <el-option v-for="item in employeeDataDict.ethicTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="fieldName">户口性质</p>
                  <el-form-item label="" prop="residenceType">
                    <el-select v-model="baseInfoForm.residenceType" placeholder="请选择" class="w-p100" clearable>
                      <el-option v-for="item in employeeDataDict.hkxzTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="fieldName">手机号</p>
                  <el-form-item label="" prop="telephone">
                    <el-input v-model.trim="baseInfoForm.telephone" placeholder="请输入" :maxlength="18"
                              clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!--非大陆-->
            <div v-else>
              <el-row class="row-bg" justify="space-around" :gutter="80" :span="24" style="padding: 0 70px;">
                <el-col :span="rowSpan">
                  <p class="required fieldName">国籍</p>
                  <el-form-item label="" prop="nationality"
                                :rules="[{ required: true, message: '请选择国籍', trigger: 'change'}]">
                    <el-select v-model="baseInfoForm.nationality" placeholder="请选择" class="w-p100"
                               @change="changeNationality" :disabled="isEdit">
                      <el-option v-for="item in employeeDataDict.nationalityTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">姓名</p>
                  <el-form-item label="" prop="name"
                                :rules="[{ required: true, message: '请输入姓名', trigger: 'blur'}]">
                    <el-input v-model.trim="baseInfoForm.name" placeholder="请输入" :maxlength="32"
                              :disabled="isEdit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">证件类型</p>
                  <el-form-item label="" prop="cardType"
                                :rules="[{ required: true, message: '请选择证件类型', trigger: 'change'}]">
                    <el-select v-model="baseInfoForm.cardType" placeholder="请选择" class="w-p100" :disabled="isEdit">
                      <el-option v-for="item in idCardTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">证件号码</p>
                  <el-form-item label="" prop="idCard"
                                :rules="[{ required: true, message: '请输入证件号码', trigger: 'blur'}]">
                    <el-input v-model.trim="baseInfoForm.idCard" placeholder="请输入" :maxlength="30" :disabled="isEdit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">出生日期</p>
                  <el-form-item label="" prop="birthday"
                                :rules="[{ required: true, message: '请选择出生日期', trigger: 'change'}]">
                    <el-date-picker v-model="baseInfoForm.birthday" type="date" value-format="yyyy-MM-dd" class="w-p100"
                                    placeholder="请选择" :disabled="isEdit"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">性别</p>
                  <el-form-item label="" prop="sex"
                                :rules="[{ required: true, message: '请选择性别', trigger: 'change'}]">
                    <!--（1:男，2:女）-->
                    <el-select v-model.number="baseInfoForm.sex" placeholder="请选择" class="w-p100" :disabled="isEdit">
                      <el-option label="男" :value="1"></el-option>
                      <el-option label="女" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="fieldName">手机号</p>
                  <el-form-item label="" prop="telephone">
                    <el-input v-model.trim="baseInfoForm.telephone" placeholder="请输入" :maxlength="18"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="fieldName">户口性质</p>
                  <el-form-item label="" prop="residenceType">
                    <el-select v-model="baseInfoForm.residenceType" placeholder="请选择" class="w-p100">
                      <el-option v-for="item in employeeDataDict.hkxzTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="rowSpan">
                  <p class="required fieldName">民族</p>
                  <el-form-item label="" prop="nation"
                                :rules="[{ required: true, message: '请选择民族', trigger: 'change'}]">
                    <el-select v-model="baseInfoForm.nation" placeholder="请选择" class="w-p100">
                      <el-option v-for="item in employeeDataDict.ethicTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row class="row-bg" justify="space-around" :gutter="80" :span="24" style="padding: 0 70px;">
              <el-col :span="16">
                <p class="fieldName">户籍市</p>
                <div class="display-flex">
                  <el-form-item class="addr-select mr-10" label="" prop="addrCityId1">
                    <addrSelector v-model="baseInfoForm.addrCityName1" width="100%"
                                  :addrArr="employeeDataDict.addrCities"
                                  @changeAddrSelect="getCountryByCityId"></addrSelector>
                  </el-form-item>
                  <el-form-item class="addr-select" label="" prop="addrCountryId1">
                    <el-select v-model="baseInfoForm.addrCountryId1" ref="addrCountryId1" placeholder="请选择" clearable>
                      <el-option v-for="item in addrCountryList1" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="flex1" label="" prop="addrDetail1">
                    <el-input v-model.trim="baseInfoForm.addrDetail1" placeholder="详细地址" class="w-p100" :maxlength="100"
                              clearable></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="rowSpan">
                <p class="fieldName">学历</p>
                <el-form-item label="" prop="education">
                  <el-select v-model="baseInfoForm.education" placeholder="请选择" class="w-p100" clearable>
                    <el-option v-for="item in employeeDataDict.academiclvTypes" :key="item.id" :label="item.dictName"
                               :value="item.dictCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <p class="fieldName">通讯地址</p>
                <div class="display-flex">
                  <el-form-item class="addr-select" label="" prop="addrProvinceId2">
                    <el-select v-model="baseInfoForm.addrProvinceId2" ref="addrProvinceId2" placeholder="请选择"
                               class="w-p100"
                               @change="(val)=>getCitysByProvinceId(val, 2)" clearable>
                      <el-option v-for="item in employeeDataDict.provinces" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="addr-select" label="" prop="addrCityId2">
                    <el-select v-model="baseInfoForm.addrCityId2" ref="addrCityId2" placeholder="请选择" clearable>
                      <el-option v-for="item in addrCityList2" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="flex1" label="" prop="addrDetail2">
                    <el-input v-model.trim="baseInfoForm.addrDetail2" placeholder="详细地址" class="w-p100" :maxlength="100"
                              clearable></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="rowSpan">
                <p class="fieldName">婚姻状况</p>
                <el-form-item label="" prop="married">
                  <el-select v-model.number="baseInfoForm.married" ref="married" placeholder="请选择" class="w-p100"
                             clearable>
                    <!--(1:已婚 2:未婚 3:离异 5:丧偶)-->
                    <el-option label="已婚" :value="1"></el-option>
                    <el-option label="未婚" :value="2"></el-option>
                    <el-option label="离异" :value="3"></el-option>
                    <el-option label="丧偶" :value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="rowSpan">
                <p class="fieldName">岗位</p>
                <el-form-item label="" prop="jobPosition">
                  <el-input v-model.trim="baseInfoForm.jobPosition" :maxlength="50" clearable></el-input>
                </el-form-item>
              </el-col>
              <!--业务类型为-10052002（人事代理）时，隐藏入离职时间-->
              <el-col :span="rowSpan">
                <div v-if="businessType!==10052002">
                  <p class="required fieldName">入职日期</p>
                  <el-form-item label="" prop="entryDate"
                                :rules="[{ required: true, message: '请选择入职日期', trigger: 'blur'}, { validator:checkEntryDate, trigger:'change'}]">
                    <el-date-picker v-model="baseInfoForm.entryDate" type="date" value-format="yyyy-MM-dd"
                                    class="w-p100"
                                    placeholder="请选择"></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="rowSpan">
                <div v-if="businessType!==10052002">
                  <p class="fieldName">离职日期</p>
                  <el-form-item label="" prop="leaveDate" :rules="[{ validator:checkLeaveDate, trigger:'change'}]">
                    <el-date-picker v-model="baseInfoForm.leaveDate" type="date" value-format="yyyy-MM-dd"
                                    class="w-p100"
                                    placeholder="请选择" clearable></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <p class="add-type2">紧急联系人</p>
            <el-row class="row-bg" justify="space-around" :gutter="80" :span="24" style="padding: 0 70px;">
              <el-col :span="rowSpan">
                <p class="fieldName">紧急联系人</p>
                <el-form-item label="" prop="urgentEmployeeName">
                  <el-input v-model.trim="baseInfoForm.urgentEmployeeName" :maxlength="30" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="rowSpan">
                <p class="fieldName">紧急联系人电话</p>
                <el-form-item label="" prop="urgentTelephone">
                  <el-input v-model.trim="baseInfoForm.urgentTelephone" :maxlength="18" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <p class="fieldName">通讯地址</p>
                <div class="display-flex">
                  <el-form-item class="addr-select" label="" prop="addrProvinceId3">
                    <el-select v-model="baseInfoForm.addrProvinceId3" ref="addrProvinceId3" placeholder="请选择"
                               @change="(val)=>getCitysByProvinceId(val, 3)" clearable>
                      <el-option v-for="item in employeeDataDict.provinces" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="addr-select" label="" prop="addrCityId3">
                    <el-select v-model="baseInfoForm.addrCityId3" ref="addrCityId3" placeholder="请选择" clearable>
                      <el-option v-for="item in addrCityList3" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="flex1" label="" prop="addrDetail3">
                    <el-input v-model.trim="baseInfoForm.addrDetail3" placeholder="详细地址" class="w-p100" :maxlength="100"
                              clearable></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>

          <p class="add-type2" v-if="settingListInit.length>0">自定义信息</p>
          <el-row class="row-bg" justify="space-around" :gutter="80" :span="24" style="padding: 0 70px;" v-if="settingListInit.length>0">
            <!--
           TEXTINPUT("50008001","文本输入框"),
           NUMBERINPUT("50008002","数字输入框"),
           DATEINPUT("50008003","日期选择框"),
           DROPDOWNINPUT("50008004","下拉选择框"),
           RADIOINPUT("50008005","单选框"),
           CHECKBOXINPUT("50008006","复选框"),
           50008007：文本域  50008010：地区选择框  50008011：省市选择器
           -->
            <el-form :model="settingListInit[index]" :ref="'settingListInit' + index" label-width=""
                     v-for="(item,index) in settingListInit" :key="item.id">
              <el-col :span="item.personalType=='50008007'?24:rowSpan" :class="{'settingFormCol':item.personalType=='50008007'}">
                <p class="fieldName" :class="{'required': item.required}">{{item.personalName}}</p>
                <el-form-item label="" prop="value"
                              :rules="[{ validator: (rule, value, callback)=>checkSetting(rule, value, callback, index), trigger:'change'}]">
                  <!--文本输入框||地区选择框-->
                  <el-input v-model="settingListInit[index].value" :clearable="item.required"
                            v-if="item.personalType == '50008001'||item.personalType == '50008010'"></el-input>

                  <!--数字输入框-->
                  <el-input v-model="settingListInit[index].value" :clearable="item.required"
                            v-if="item.personalType == '50008002'"></el-input>
                  <!--日期选择框-->
                  <el-date-picker v-model="settingListInit[index].value" type="date" value-format="yyyy-MM-dd"
                                  class="w-p100" v-if="item.personalType == '50008003'"
                                  placeholder="请选择" clearable></el-date-picker>
                  <!--下拉选择框-->
                  <el-select v-model="settingListInit[index].value" placeholder="请选择" class="w-p100"
                             :clearable="item.required" v-if="item.personalType == '50008004'">
                    <el-option v-for="(it, ind) in item.personalValuerangeArr" :key="ind" :label="it"
                               :value="it"></el-option>
                  </el-select>
                  <!--单选框-->
                  <el-radio-group v-model="settingListInit[index].value" v-if="item.personalType == '50008005'" :clearable="item.required">
                    <el-radio v-for="(it, ind) in item.personalValuerangeArr" :key="ind" :label="it">{{it}}</el-radio>
                  </el-radio-group>
                  <!--复选框-->
                  <el-checkbox-group v-model="settingListInit[index].value" :clearable="item.required" v-if="item.personalType == '50008006'">
                    <el-checkbox v-for="(it, ind) in item.personalValuerangeArr" :key="ind" :label="it"></el-checkbox>
                  </el-checkbox-group>

                   <!--文本域-->
                   <el-input class="settingTextarea" type="textarea" :rows="4"  maxlength="500" show-word-limit v-model="settingListInit[index].value" v-if="item.personalType == '50008007'" resize="none"></el-input>
                   <!--地区选择框-->
                  <!-- <el-input v-model="settingListInit[index].value" :clearable="item.required"
                            v-if="item.personalType == '50008010'"></el-input> -->
                   <!--省市选择器-->
                  <addrSelector v-model="settingListInit[index].value" width="100%" style="width: 100%" v-if="item.personalType == '50008011'" 
                    :addrArr="employeeDataDict.addrCities">
                  </addrSelector>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
      <!--合同信息-->
      <div class="content-panel contract-panel" style="padding-bottom: 30px;">
        <p class="add-type"><span class="step-title"><i class="ic-empAdd-type ic-empAdd-type2"></i>合同信息</span></p>
        <div class="add-type-form add-type-table">
          <dTable :data="contractTableData" ref="contractTable" :cancelMinHeight="true" :key="refreshKey"
                  :paging="false"
                  :showIndex="false" :showSelection="false">
            <el-table-column label="合同类型" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-select v-model="contractTableData[scope.$index].contractType" placeholder="请选择" class="w-150"
                           clearable>
                  <el-option v-for="item in employeeDataDict.contractCategoryTypes" :key="item.id"
                             :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="合同编号" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :model="contractTableData[scope.$index]" :ref="'contractNumber'+scope.$index"
                         label-width="">
                  <el-form-item label="" prop="contractNumber"
                                :rules="[{ validator: (rule, value, callback)=>checkContractNumber(rule, value, callback, scope.$index), trigger:'change'}]">
                    <el-input v-model.trim="contractTableData[scope.$index].contractNumber" placehloder="请输入"
                              clearable></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="签订类型" width="200"
                             :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :model="contractTableData[scope.$index]" :ref="'contractCategory'+scope.$index"
                         label-width="">
                  <el-form-item label="" prop="contractCategory"
                                :rules="[{ validator: (rule, value, callback)=>checkContractCategory(rule, value, callback, scope.$index), trigger:'change'}]">
                    <el-select v-model="contractTableData[scope.$index].contractCategory" placeholder="请选择"
                               class="w-150" clearable>
                      <el-option v-for="item in employeeDataDict.contractTypes" :key="item.id" :label="item.dictName"
                                 :value="item.dictCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="合同区间" min-width="280"
                             :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :model="contractTableData[scope.$index]" :ref="'contractStartEndDate'+scope.$index"
                         label-width="">
                  <el-form-item label="" prop="contractStartDate" class="inlineBlock"
                                :rules="[{ validator: (rule, value, callback)=>checkContractStartDate(rule, value, callback, scope.$index), trigger:'change'}]">
                    <el-date-picker
                      v-model="contractTableData[scope.$index].contractStartDate"
                      type="date" value-format="yyyy-MM-dd" class="label-sel w-150" placeholder="请选择">
                    </el-date-picker>
                  </el-form-item>
                  <span style="display: inline-block;margin-left: 8px;margin-right: 8px;color: #C0C4CC;">—</span>
                  <el-form-item label="" prop="contractEndDate" class="inlineBlock"
                                :rules="[{ validator: (rule, value, callback)=>checkContractEndDate(rule, value, callback, scope.$index), trigger:'change'}]">
                    <el-date-picker
                      v-model="contractTableData[scope.$index].contractEndDate"
                      type="date" value-format="yyyy-MM-dd" class="label-sel w-150" placeholder="请选择">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="附件" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="display-flex lh-32" v-if="contractTableData[scope.$index].fileIdArr.length>0">
                  <i class="el-icon-link font-16 lh-32"></i>

                  <div class="flex1" v-if="contractTableData[scope.$index].fileIdArr.length>1">
                    <el-popover placement="top" width="300" trigger="click"
                                popper-class="contract-panel contract-popover lh-32">
                      <span slot="reference" class="text-blue f-cursor ml-10">更多附件</span>
                      <span class="flex1 display-flex fileName pop-fileName"
                            v-for="(item,index) in contractTableData[scope.$index].fileNameArr" :key="index">
                        <span class="flex1" @click="downloadFile(contractTableData[scope.$index].fileIdArr[index])">{{item}}</span>
                        <i class="el-icon-success font-16 text-green lh-32 ic-success"></i>
                        <i class="el-icon-error font-16 text-red lh-32 ic-del"
                           @click="delContractFile(scope.$index, index)"></i>
                      </span>
                    </el-popover>
                  </div>

                  <span class="flex1 display-flex fileName" v-else>
                    <span class="flex1" @click="downloadFile(contractTableData[scope.$index].fileIdArr[0])">{{contractTableData[scope.$index].fileNameArr[0]}}</span>
                    <i class="el-icon-success font-16 text-green lh-32 ic-success"></i>
                    <i class="el-icon-error font-16 text-red lh-32 ic-del"
                       @click="delContractFile(scope.$index, 0)"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-upload
                  class="inlineBlock"
                  ref="upload"
                  :action="$global.uploadUrl"
                  :headers="$global.setUploadHeaders"
                  :before-upload="beforeUpload"
                  :on-success="(res, file)=>uploadContractSuccess(res, file, scope.$index)"
                  :show-file-list="false"
                  :auto-upload="true" :multiple="false">
                  <el-button type="text" size="small">上传附件</el-button>
                </el-upload>
                <div class="opt-btn-split"></div>
                <el-button type="text" size="small" class="text-red" @click="delContractItem(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </dTable>
          <el-button size="small" class="dash-gray-btn" icon="el-icon-plus" @click="addContractItem">新增合同</el-button>
        </div>
      </div>

      <!--资料信息-->
      <div class="contract-panel content-panel" style="padding-bottom: 30px;">
        <p class="add-type"><span class="step-title"><i class="ic-empAdd-type ic-empAdd-type2"></i>资料信息</span></p>
        <div class="add-type-form add-type-table">
          <dTable :data="datumFileTableData" ref="datumFileTable" :cancelMinHeight="true" :paging="false"
                  :showIndex="false" :showSelection="false">
            <el-table-column label="资料类型" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-select v-model="datumFileTableData[scope.$index].datumType" placeholder="请选择" class="w-250"
                           clearable>
                  <el-option v-for="item in employeeDataDict.datumTypes" :key="item.id"
                             :label="item.dictName" :value="item.dictCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="附件" width="350" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="display-flex lh-32" v-if="datumFileTableData[scope.$index].files.length>0">
                  <i class="el-icon-link font-16 lh-32"></i>

                  <div class="flex1" v-if="datumFileTableData[scope.$index].files.length>1">
                    <el-popover placement="top" width="300" trigger="click"
                                popper-class="contract-panel contract-popover lh-32">
                      <span slot="reference" class="text-blue f-cursor ml-10">更多附件</span>
                      <span class="flex1 display-flex fileName pop-fileName"
                            v-for="(item,index) in datumFileTableData[scope.$index].files" :key="item.fileId">
                        <span class="flex1" @click="downloadFile(item.fileId)">{{item.fileName}}</span>
                        <i class="el-icon-success font-16 text-green lh-32 ic-success"></i>
                        <i class="el-icon-error font-16 text-red lh-32 ic-del"
                           @click="delDatumFileFile(scope.$index, index)"></i>
                      </span>
                    </el-popover>
                  </div>

                  <span class="flex1 display-flex fileName" v-else>
                    <span class="flex1" @click="downloadFile(datumFileTableData[scope.$index].files[0].fileId)">{{datumFileTableData[scope.$index].files[0].fileName}}</span>
                    <i class="el-icon-success font-16 text-green lh-32 ic-success"></i>
                    <i class="el-icon-error font-16 text-red lh-32 ic-del"
                       @click="delDatumFileFile(scope.$index, 0)"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-upload
                  class="inlineBlock"
                  ref="upload"
                  :action="$global.uploadUrl"
                  :headers="$global.setUploadHeaders"
                  :before-upload="beforeUpload"
                  :on-success="(res, file)=>uploadDatumFileSuccess(res, file, scope.$index)"
                  :show-file-list="false"
                  :auto-upload="true" :multiple="false">
                  <el-button type="text" size="small">上传附件</el-button>
                </el-upload>
                <div class="opt-btn-split"></div>
                <el-button type="text" size="small" class="text-red" @click="delDatumFileItem(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </dTable>
          <el-button size="small" class="dash-gray-btn" icon="el-icon-plus" @click="addDatumFileItem">新增资料</el-button>
        </div>
      </div>

      <div class="fixed-bottom-area">
        <div class="bottom-area-content">
          <el-button @click="cancelDialogVisible=true">取消</el-button>
          <el-button :loading="saveContinueBtnLoading" @click="saveContinue(0)" style="margin-left: 15px;" v-if="!isEdit">保存继续添加</el-button>
          <el-button :loading="saveNextBtnLoading" type="primary" style="margin-left: 15px;" @click="saveContinue(1)">
            保存，下一步完善资料
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog title="警告" :visible.sync="cancelDialogVisible" width="600px" class="spl-dialog-msg" :show-close="false">
      <p style="display: flex; justify-content: flex-start; align-items: center;">
        <i class="ic-dialog-warn"></i>
        <span>您编辑的内容尚未保存，确定要离开吗？</span>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button class="mr-60" @click="cancelDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="doLeave">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
import addrSelector from '../../components/common/addrSelector'

export default {
  inject: ['reload'],
  components: { dTable, addrSelector },
  data () {
    return {
      pathData: [
        { name: '人员管理' },
        { name: '员工列表' },
        { name: '新增员工' }
      ],
      rowSpan: 8,
      pageLoading: false,
      cancelDialogVisible: false,
      // 合同信息
      contractItem: {
        contractType: '', //  合同类型
        contractNumber: '', // 合同编号
        contractCategory: '', // 签订类型
        contractStartDate: '', // 开始时间
        contractEndDate: '', // 结束时间
        fileIdArr: [], // 附件id
        fileNameArr: [] // 附件name
      },
      contractTableData: [
        {
          contractType: '', //  合同类型
          contractNumber: '', // 合同编号
          contractCategory: '', // 签订类型
          contractStartDate: '', // 开始时间
          contractEndDate: '', // 结束时间
          fileIdArr: [], // 附件id
          fileNameArr: [] // 附件name
        }
      ],
      // 资料信息
      datumFileItem: {
        datumType: '', //  资料类型,从字典表获取
        files: [ //  附件
          // {
          //   fileId: '', // 文件id
          //   fileName: '' // 文件名
          // }
        ]
      },
      datumFileTableData: [
        {
          datumType: '', //  资料类型,从字典表获取
          files: [ //  附件
            // {
            //   fileId: '', // 文件id
            //   fileName: '' // 文件名
            // }
          ]
        }
      ],

      // isMainland: true,
      isEdit: false,
      titleIdCard: '',
      baseInfoForm: {
        nationality: '', // 国籍（常量表）
        name: '', // 姓名
        idCard: '', // 证件号码
        cardType: '', // 证件类型（常量表）
        birthday: '', // 出生日期
        sex: null, // 性别（1:男，2:女）
        nation: '', // 民族（常量表）
        residenceType: '', // 户口性质(城镇、农村)-字典值
        telephone: '', //  手机号
        education: '', //  学历（常量表取）
        married: null, //  婚姻状况(1:已婚 2:未婚 3:离异 4:其他) integer
        jobPosition: '', //  岗位
        entryDate: '', //  入职日期（派遣员工必填）（页面）
        leaveDate: '', //  离职日期（页面）
        urgentEmployeeName: '', //  紧急联系人（页面）
        urgentTelephone: '', //  紧急联系人号码（页面）
        // 1:员工本人户籍
        // addrType1: 1, //  地址类型（1:员工本人户籍 2:员工通讯地址 3:紧急联系人通讯地址）（页面）
        addrCityId1: '', //  市级id（页面）integer
        addrCityName1: '', //  市级name（页面）
        addrCountryId1: '', //  区级id（页面）integer
        addrCountryName1: '', //  区级name（页面）
        addrDetail1: '', //  详细地址（页面）
        // 2:员工通讯地址
        // addrType2: 2, //  地址类型（1:员工本人户籍 2:员工通讯地址 3:紧急联系人通讯地址）（页面）
        addrProvinceId2: '', //  省份id（页面）integer
        addrProvinceName2: '', //  省份name（页面）
        addrCityId2: '', //  市级id（页面）integer
        addrCityName2: '', //  市级name（页面）
        addrDetail2: '', //  详细地址（页面）
        // 3:紧急联系人通讯地址
        // addrType3: 3, //  地址类型（1:员工本人户籍 2:员工通讯地址 3:紧急联系人通讯地址）（页面）
        addrProvinceId3: '', //  省份id（页面）integer
        addrProvinceName3: '', //  省份name（页面）
        addrCityId3: '', //  市级id（页面）integer
        addrCityName3: '', //  市级name（页面）
        addrDetail3: '' //  详细地址（页面）
      },
      employeeDataDict: {},
      idCardTypes: [], //  证件类型
      addrCountryList1: [],
      addrCityList2: [],
      addrCityList3: [],
      saveContinueBtnLoading: false,
      saveNextBtnLoading: false,
      refreshBaseKey: new Date().getTime(),
      refreshKey: new Date().getTime(),
      businessType: this.$store.state.userData.bussinessType, // 业务类型为-10052002（人事代理）时，隐藏入离职时间
      employeeSiteId: '',
      settingListInit: []
    }
  },
  watch: {
    isEdit: function () {
      if (this.isEdit) {
        this.pathData = [
          { name: '人员管理' },
          { name: '员工列表', path: '/employee/index' },
          { name: '编辑员工' }
        ]
      } else {
        this.pathData = [
          { name: '人员管理' },
          { name: '员工列表', path: '/employee/index' },
          { name: '新增员工' }
        ]
      }
    }
  },
  computed: {
    contentHeight: function () {
      return this.$global.bodyHeight - 270 + 'px'
    }
  },
  created () {
    this.getEmployeeDataDict()//  获取人员录入，编辑页面的常量字段
  },
  methods: {
    getEmployeeDataDict () {
      this.$http({
        url: '/api/employee/getEmployeeDataDict',
        method: 'post'
      }).then(({ data }) => {
        this.employeeDataDict = data.data[0]
        this.baseInfoForm.nationality = '10037001'

        this.employeeSiteId = this.$route.query.employeeSiteId ? this.$route.query.employeeSiteId : ''
        this.baseInfoForm.idCard = this.$route.query.idCard ? this.$route.query.idCard : ''
        if (this.employeeSiteId != '') {
          this.isEdit = true
          this.getEmployeeBySiteIdOrIDcard(0)//  获取人员录入，编辑页面的常量字段
        } else {
          this.getEmployeeBySiteIdOrIDcard()//  获取人员录入，编辑页面的常量字段
        }

        var item
        var settingListArr = this.$lodash.cloneDeep(this.employeeDataDict.settingList)
        /*   TEXTINPUT("50008001","文本输入框"),
                  NUMBERINPUT("50008002","数字输入框"),
                  DATEINPUT("50008003","日期选择框"),
                  DROPDOWNINPUT("50008004","下拉选择框"),
                  RADIOINPUT("50008005","单选框"),
                  CHECKBOXINPUT("50008006","复选框"),
                  50008007：文本域  50008010：地区选择框  50008011：省市选择器 */
        for (var r = 0; r < settingListArr.length; r++) {
          item = settingListArr[r]
          if (item.personalType == '50008004' || item.personalType == '50008005' || item.personalType == '50008006') {
            //  下拉选择框\单选框\复选框
            item.personalValuerangeArr = item.personalValuerange.replace(/，/g, ',').split(',')
          }
          if (item.personalType == '50008006') {
            // 复选框
            item.value = []
          } else {
            item.value = ''
          }
        }
        this.settingListInit = settingListArr
      })
    },
    saveContinue (type) {
      if (type === 0) {
        this.saveContinueBtnLoading = true
      } else {
        this.saveNextBtnLoading = true
      }

      var baseInfoFormValid = true
      var contractValid = true
      var settingValid = true

      // 校验自定义字段
      for (var q = 0; q < this.settingListInit.length; q++) {
        this.$refs['settingListInit' + q][0].validate((valid) => {
          if (settingValid) {
            settingValid = valid
          }
        })
      }

      for (var i = 0; i < this.contractTableData.length; i++) {
        if (this.checkContractRequired(i)) {
          this.$refs['contractNumber' + i].validate((valid) => {
            if (contractValid) {
              contractValid = valid
            }
          })
          this.$refs['contractCategory' + i].validate((valid) => {
            if (contractValid) {
              contractValid = valid
            }
          })
          this.$refs['contractStartEndDate' + i].validate((valid) => {
            if (contractValid) {
              contractValid = valid
            }
          })
        }
      }
      let that = this
      this.$refs.baseInfoForm.validate((valid) => {
        baseInfoFormValid = valid
        if (baseInfoFormValid && contractValid && settingValid) {
          that.saveData(type)
        } else {
          if (type === 0) {
            that.saveContinueBtnLoading = false
          } else {
            that.saveNextBtnLoading = false
          }
          return false
        }
      })
    },

    // 保存
    saveData (type) {
      var baseInfoForm = this.baseInfoForm
      // 整理合同信息数据
      var employeeContractInfVOList = []
      this.contractTableData.forEach(it => {
        // 如果全为空则不增加
        if (!this.$lodash.isEmpty(it.contractType) || !this.$lodash.isEmpty(it.contractNumber) || !this.$lodash.isEmpty(it.contractCategory) || !this.$lodash.isEmpty(it.contractStartDate) || !this.$lodash.isEmpty(it.contractEndDate) || it.fileIdArr.length > 0) {
          employeeContractInfVOList.push({
            contractType: it.contractType, //  合同类型
            contractNumber: it.contractNumber, // 合同编号
            contractCategory: it.contractCategory, // 签订类型
            contractStartDate: it.contractStartDate, // 开始时间
            contractEndDate: it.contractEndDate, // 结束时间
            fileIds: it.fileIdArr.join('|') // 附件id，多个附件用|隔开（页面）
          })
        }
      })

      // 整理资料信息数据
      var employeeDatumFileVOList = []
      this.datumFileTableData.forEach(it => {
        // 如果全为空则不增加
        if (!this.$lodash.isEmpty(it.datumType) && it.files.length > 0) {
          employeeDatumFileVOList.push({
            datumType: it.datumType,
            employeeDatumFileFiles: it.files
          })
        }
      })

      // 整理自定义字段数据
      var employeePersonalInfoList = []
      var personalValue = ''
      this.settingListInit.forEach(it => {
        // 如果全为空则不增加
        if (!this.$lodash.isEmpty(it.value)) {
          //  复选框
          personalValue = it.personalType == '50008006' ? it.value.join(',') : it.value
          employeePersonalInfoList.push({
            personalName: it.id, //  自定义字段
            personalValue: personalValue //  自定义字段值
          })
        }
      })

      var setObj = {
        employeeBase: {
          idCard: baseInfoForm.idCard,
          name: baseInfoForm.name
        },
        employeeBaseContactAddrList: [
          // 地址类型（1:员工本人户籍 2:员工通讯地址 3:紧急联系人通讯地址）（页面）
          // 手机号码（页面，ddrType为1，2时，必填）
          // 1:员工本人户籍
          {
            addrType: 1,
            addrCityId: baseInfoForm.addrCityId1 ? Number(baseInfoForm.addrCityId1) : '',
            addrCityName: baseInfoForm.addrCityName1,
            addrCountryId: baseInfoForm.addrCountryId1 ? Number(baseInfoForm.addrCountryId1) : '',
            addrCountryName: this.$refs.addrCountryId1.selectedLabel,
            addrDetail: baseInfoForm.addrDetail1,
            telephone: baseInfoForm.telephone
          },
          // 2:员工通讯地址
          {
            addrType: 2,
            addrProvinceId: baseInfoForm.addrProvinceId2 ? Number(baseInfoForm.addrProvinceId2) : '',
            addrProvinceName: this.$refs.addrProvinceId2.selectedLabel,
            addrCityId: baseInfoForm.addrCityId2 ? Number(baseInfoForm.addrCityId2) : '',
            addrCityName: this.$refs.addrCityId2.selectedLabel,
            addrDetail: baseInfoForm.addrDetail2,
            telephone: baseInfoForm.telephone
          },
          //  3:紧急联系人通讯地址
          {
            addrType: 3,
            addrProvinceId: baseInfoForm.addrProvinceId3 ? Number(baseInfoForm.addrProvinceId3) : '',
            addrProvinceName: this.$refs.addrProvinceId3.selectedLabel,
            addrCityId: baseInfoForm.addrCityId3 ? Number(baseInfoForm.addrCityId3) : '',
            addrCityName: this.$refs.addrCityId3.selectedLabel,
            addrDetail: baseInfoForm.addrDetail3,
            telephone: baseInfoForm.urgentTelephone,
            urgentEmployeeName: baseInfoForm.urgentEmployeeName
          }
        ],
        employeeBaseDetail: {
          birthday: baseInfoForm.birthday,
          cardType: baseInfoForm.cardType,
          education: baseInfoForm.education,
          married: baseInfoForm.married,
          marriedName: this.$refs.married.selectedLabel,
          nation: baseInfoForm.nation,
          nationality: baseInfoForm.nationality,
          residenceType: baseInfoForm.residenceType,
          sex: baseInfoForm.sex
        },
        employeeContractInfVOList: employeeContractInfVOList,
        employeeCustomerSiteVO: {
          entryDate: baseInfoForm.entryDate,
          jobPosition: baseInfoForm.jobPosition,
          leaveDate: baseInfoForm.leaveDate
        },
        employeeDatumFileVOList: employeeDatumFileVOList,
        employeePersonalInfoList: employeePersonalInfoList
      }

      this.$http({
        url: '/api/employee/saveOrUpdateEmployee',
        method: 'post',
        data: setObj
      }).then(({ data }) => {
        this.$message.success('保存成功')
        if (type === 0) {
          this.saveContinueBtnLoading = false
          this.reload()
        } else {
          this.saveNextBtnLoading = false
          if (this.$lodash.isEmpty(this.employeeSiteId)) {
            this.$router.replace('/employee/improveData?idCard=' + this.baseInfoForm.idCard)
          } else {
            this.$router.replace('/employee/improveData?employeeSiteId=' + this.employeeSiteId + '&idCard=' + this.baseInfoForm.idCard)
          }
        }
      }).catch((data) => {
        if (type === 0) {
          this.saveContinueBtnLoading = false
        } else {
          this.saveNextBtnLoading = false
        }
      })
    },

    //
    getEmployeeBySiteIdOrIDcard (type) {
      // 编辑页面，根据employeeSiteId或者人员身份证获取人员信息
      var setObj = {}
      if (type != 0) {
        var idCard = this.baseInfoForm.idCard
        if (this.$lodash.isEmpty(idCard)) {
          return false
        } else if (idCard == this.titleIdCard) {
          return false
        } else {
          setObj = { idcard: idCard }
        }
      } else {
        setObj = { employeeSiteId: String(this.employeeSiteId) }
      }
      this.$http({
        url: '/api/employee/getEmployeeBySiteIdOrIDcard',
        method: 'post',
        data: this.$qs.stringify(setObj)
      }).then(({ data }) => {
        var res = data.data[0]
        if (this.$lodash.isEmpty(res.employeeBase) && this.$lodash.isEmpty(res.employeeBaseBank) && this.$lodash.isEmpty(res.employeeBaseContactAddrList) && this.$lodash.isEmpty(res.employeeBaseDetail) && this.$lodash.isEmpty(res.employeeContractInfVOList) && this.$lodash.isEmpty(res.employeeCustomerSiteVO) && this.$lodash.isEmpty(res.employeeDatumFileVOList) && this.$lodash.isEmpty(res.employeePersonalInfoList)) {
          this.isEdit = false
          return false
        } else {
          this.isEdit = true
        }
        this.baseInfoForm.nationality = res.employeeBaseDetail.nationality // 国籍（常量表）
        this.changeNationality(this.baseInfoForm.nationality)
        this.baseInfoForm.name = res.employeeBase.name // 姓名
        this.baseInfoForm.idCard = res.employeeBase.idCard // 证件号码
        this.baseInfoForm.titleIdCard = res.employeeBase.idCard // 证件号码
        this.baseInfoForm.cardType = res.employeeBaseDetail.cardType // 证件类型（常量表）
        this.baseInfoForm.birthday = res.employeeBaseDetail.birthday // 出生日期
        this.baseInfoForm.sex = res.employeeBaseDetail.sex // 性别（1:男，2:女）
        this.baseInfoForm.nation = res.employeeBaseDetail.nation // 民族（常量表）
        this.baseInfoForm.residenceType = res.employeeBaseDetail.residenceType // 户口性质(城镇、农村)-字典值
        this.baseInfoForm.education = res.employeeBaseDetail.education //  学历（常量表取）
        this.baseInfoForm.married = res.employeeBaseDetail.married //  婚姻状况(1:已婚 2:未婚 3:离异 4:其他) integer
        this.baseInfoForm.jobPosition = res.employeeCustomerSiteVO.jobPosition //  岗位
        this.baseInfoForm.entryDate = res.employeeCustomerSiteVO.entryDate //  入职日期（派遣员工必填）（页面）
        this.baseInfoForm.leaveDate = res.employeeCustomerSiteVO.leaveDate //  离职日期（页面）

        var item
        let that = this
        for (var i = 0; i < res.employeeBaseContactAddrList.length; i++) {
          item = res.employeeBaseContactAddrList[i]
          // 地址类型（1:员工本人户籍 2:员工通讯地址 3:紧急联系人通讯地址）（页面）
          if (item.addrType === 1) {
            this.baseInfoForm.addrCityId1 = item.addrCityId //  市级id（页面）integer
            this.baseInfoForm.addrCityName1 = item.addrCityName //  市级name（页面）
            this.baseInfoForm.addrDetail1 = item.addrDetail //  详细地址（页面）
            this.baseInfoForm.telephone = item.telephone //  紧急联系人号码（页面）
            this.getCountryByCityId({
              id: this.baseInfoForm.addrCityId1,
              name: this.baseInfoForm.addrCityName1
            }, 'refresh', item, function (it) {
              that.baseInfoForm.addrCountryId1 = it.addrCountryId ? String(it.addrCountryId) : '' //  区级id（页面）integer
              that.baseInfoForm.addrCountryName1 = it.addrCountryName //  区级name（页面）
            })
          } else if (item.addrType === 2) {
            this.baseInfoForm.addrProvinceId2 = item.addrProvinceId ? String(item.addrProvinceId) : '' //  省份id（页面）integer
            this.baseInfoForm.addrProvinceName2 = item.addrProvinceName //  省份name（页面）
            this.baseInfoForm.addrDetail2 = item.addrDetail //  详细地址（页面）
            this.baseInfoForm.telephone = item.telephone //  紧急联系人号码（页面）
            this.getCitysByProvinceId(this.baseInfoForm.addrProvinceId2, 2, item, function (it) {
              that.baseInfoForm.addrCityId2 = it.addrCityId ? String(it.addrCityId) : it.addrCityId //  市级id（页面）integer
              that.baseInfoForm.addrCityName2 = it.addrCityName //  市级name（页面）
            })
          } else if (item.addrType === 3) {
            this.baseInfoForm.addrProvinceId3 = item.addrProvinceId ? String(item.addrProvinceId) : '' //  省份id（页面）integer
            this.baseInfoForm.addrProvinceName3 = item.addrProvinceName //  省份name（页面）
            this.baseInfoForm.addrDetail3 = item.addrDetail //  详细地址（页面）
            this.baseInfoForm.urgentTelephone = item.telephone //  紧急联系人号码（页面）
            this.baseInfoForm.urgentEmployeeName = item.urgentEmployeeName //  紧急联系人（页面）
            this.getCitysByProvinceId(this.baseInfoForm.addrProvinceId3, 3, item, function () {
              that.baseInfoForm.addrCityId3 = item.addrCityId ? String(item.addrCityId) : '' //  市级id（页面）integer
              that.baseInfoForm.addrCityName3 = item.addrCityName //  市级name（页面）
            })
          }
        }

        // 自定义字段
        /*   TEXTINPUT("50008001","文本输入框"),
                 NUMBERINPUT("50008002","数字输入框"),
                 DATEINPUT("50008003","日期选择框"),
                 DROPDOWNINPUT("50008004","下拉选择框"),
                 RADIOINPUT("50008005","单选框"),
                 CHECKBOXINPUT("50008006","复选框"), */
        var personalItem
        var settingItem
        for (var t = 0; t < res.employeePersonalInfoList.length; t++) {
          personalItem = res.employeePersonalInfoList[t]
          for (var l = 0; l < that.settingListInit.length; l++) {
            settingItem = that.settingListInit[l]
            if (personalItem.personalName == settingItem.id) {
              if (settingItem.personalType == '50008006') {
                //  复选框
                that.settingListInit[l].value = personalItem.personalValue.split(',')
              } else {
                that.settingListInit[l].value = personalItem.personalValue
              }
              break
            }
          }
        }

        // 合同信息
        var contractItem
        var employeeContractInfVOList = []
        var fileIdArr = []
        var fileNameArr = []
        for (var j = 0; j < res.employeeContractInfVOList.length; j++) {
          contractItem = res.employeeContractInfVOList[j]
          fileIdArr = []
          fileNameArr = []
          contractItem.contractFiles.forEach(it => {
            fileIdArr.push(it.fileId)
            fileNameArr.push(it.fileName)
          })
          employeeContractInfVOList.push({
            contractType: contractItem.contractType, //  合同类型
            contractNumber: contractItem.contractNumber, // 合同编号
            contractCategory: contractItem.contractCategory, // 签订类型
            contractStartDate: contractItem.contractStartDate, // 开始时间
            contractEndDate: contractItem.contractEndDate, // 结束时间
            fileIdArr: fileIdArr, // 附件id
            fileNameArr: fileNameArr // 附件name
          })
        }
        this.contractTableData = employeeContractInfVOList

        // 资料信息
        var datumFileItem
        var employeeDatumFileVOList = []
        var files = []
        for (var k = 0; k < res.employeeDatumFileVOList.length; k++) {
          datumFileItem = res.employeeDatumFileVOList[k]
          files = []
          datumFileItem.employeeDatumFileFiles.forEach(it => {
            files.push({ fileId: it.fileId, fileName: it.fileName })
          })
          employeeDatumFileVOList.push({
            datumType: datumFileItem.datumType, //  资料类型,从字典表获取
            files: files //  附件
          })
        }
        this.datumFileTableData = employeeDatumFileVOList
      }).catch((data) => {
      })
    },

    // 根据市ID获取区级列表
    getCountryByCityId (item, type, it, callback) {
      if (type !== 'refresh') {
        if (this.baseInfoForm.addrCityId1 == item.id) {
          //  未改变
          return
        } else {
          //  已改变
          if (item.id) {
            // 有id
            this.baseInfoForm.addrCityId1 = item.id
            this.baseInfoForm.addrCountryId1 = ''
            this.addrCountryList1 = []
          } else {
            // 没有id
            this.baseInfoForm.addrCityId1 = ''
            this.baseInfoForm.addrCountryId1 = ''
            this.addrCountryList1 = []
            return
          }
        }
      }

      this.$http({
        url: '/api/employee/getCountryByCityId',
        method: 'post',
        data: this.$qs.stringify({
          cityId: Number(item.id)
        })
      }).then(({ data }) => {
        this.addrCountryList1 = data.data[0]
        if (callback) {
          callback(it)
        }
      })
    },

    // 根据省份ID获取地市列表
    async getCitysByProvinceId (id, type, item, callback) {
      if (id == 'null' || this.$lodash.isEmpty(id)) {
        if (type === 2) {
          //  通讯地址
          this.addrCityList2 = []
          this.baseInfoForm.addrCityId2 = ''
        } else {
          //  紧急人通讯地址
          this.addrCityList3 = []
          this.baseInfoForm.addrCityId3 = ''
        }
        return false
      }
      await this.$http({
        url: '/api/employee/getCitysByProvinceId',
        method: 'post',
        data: this.$qs.stringify({
          provinceId: Number(id)
        })
      }).then(({ data }) => {
        if (type === 2) {
          //  通讯地址
          this.addrCityList2 = data.data[0]
          this.baseInfoForm.addrCityId2 = ''
        } else {
          //  紧急人通讯地址
          this.addrCityList3 = data.data[0]
          this.baseInfoForm.addrCityId3 = ''
        }
        if (callback) {
          callback(item)
        }
      })
    },
    // 改变国籍
    changeNationality (val) {
      /* 国籍选择为外国国籍10037002时，证件类型可选择，包含外国身份证-50010004、外国护照-50010003；性别和出生日期可编辑；
                          国籍选择为中国港澳台国籍10037003时，证件类型可选择，包含港澳台居民来往内地通行证-50010005、港澳台身份证-50010006；性别和出生日期可编辑。 */
      this.refreshBaseKey = new Date().getTime()
      this.baseInfoForm.cardType = ''
      this.baseInfoForm.birthday = ''
      this.baseInfoForm.sex = null
      var idCardTypes = []
      if (val == '10037002') {
        //  外国国籍 employeeDataDict idCardTypes  var
        // 证件类型——默认外国身份证、外国护照；
        this.employeeDataDict.idCardTypes.forEach(it => {
          if (it.dictCode == '20004015' || it.dictCode == '20004002') {
            idCardTypes.push(it)
          }
        })
      } else if (val == '10037003') {
        //  中国港澳台
        // 证件类型——默认港澳台居民来往内地通行证、港澳台身份证
        this.employeeDataDict.idCardTypes.forEach(it => {
          if (it.dictCode == '20004013' || it.dictCode == '20004014') {
            idCardTypes.push(it)
          }
        })
      }
      this.idCardTypes = this.$lodash.cloneDeep(idCardTypes)
    },

    /* 上传文件之前的钩子 */
    beforeUpload (file) {
      const isLt8M = file.size / 1024 / 1024 < 8
      if (!isLt8M) {
        this.$message.error('附件大小不能超过 8MB!')
      }
      return isLt8M
    },

    // 下载
    downloadFile (fileId) {
      this.$downloadFile(this.$global.downloadUrl + fileId, 'get', {})
    },

    /* ---------S=合同信息---------- */
    // 删除合同信息行
    delContractItem (index) {
      this.contractTableData.splice(index, 1)
    },
    // 增加合同信息行
    addContractItem () {
      this.contractTableData.push(this.$lodash.cloneDeep([this.contractItem])[0])
      this.refreshKey = new Date().getTime()
    },

    /* 合同附件-上传成功回调 */
    uploadContractSuccess (res, file, index) {
      if (res.code == 10) {
        this.contractTableData[index].fileIdArr.push(res.data[0].fileId)
        this.contractTableData[index].fileNameArr.push(res.data[0].fileName)
      } else {
        this.$message.error('网络异常，请重试')
      }
    },
    // 删除合同信息-附件
    delContractFile (rowIndex, fileIndex) {
      this.contractTableData[rowIndex].fileIdArr.splice(fileIndex, 1)
      this.contractTableData[rowIndex].fileNameArr.splice(fileIndex, 1)
    },
    /* ---------E=合同信息---------- */

    /* ---------S=资料信息---------- */
    // 删除资料信息行
    delDatumFileItem (index) {
      this.datumFileTableData.splice(index, 1)
    },
    // 增加资料信息行
    addDatumFileItem () {
      this.datumFileTableData.push(this.$lodash.cloneDeep([this.datumFileItem])[0])
      this.refreshKey = new Date().getTime()
    },

    /* 资料附件-上传成功回调 */
    uploadDatumFileSuccess (res, file, index) {
      if (res.code == 10) {
        this.datumFileTableData[index].files.push({ fileId: res.data[0].fileId, fileName: res.data[0].fileName })
      } else {
        this.$message.error('网络异常，请重试')
      }
    },
    // 删除资料信息-附件
    delDatumFileFile (rowIndex, fileIndex) {
      this.datumFileTableData[rowIndex].files.splice(fileIndex, 1)
    },
    /* ---------E=资料信息---------- */

    checkIdCard (rule, value, callback) {
      this.$http({
        url: '/api/employee/validateIdcard',
        method: 'post',
        data: this.$qs.stringify({ idCard: value })
      }).then(({ data }) => {
        if (this.$lodash.isEmpty(data.data[0])) {
          callback()
        } else {
          callback(new Error(data.data[0]))
        }
      })
    },

    checkEntryDate (rule, value, callback) {
      this.$refs.baseInfoForm.validateField('leaveDate')
      callback()
    },
    checkLeaveDate (rule, value, callback) {
      if (this.$lodash.isEmpty(value)) {
        callback()
      } else {
        if (this.baseInfoForm.entryDate !== '' && new Date(value) < new Date(this.baseInfoForm.entryDate)) {
          callback(new Error('离职日期不能小于入职日期'))
        } else {
          callback()
        }
      }
    },
    checkContractRequired (index) {
      //  合同编号、签订类型、合同区间，要么同时存在，要么同时没有
      var contractNumber = this.contractTableData[index].contractNumber
      var contractCategory = this.contractTableData[index].contractCategory
      var contractStartDate = this.contractTableData[index].contractStartDate
      var contractEndDate = this.contractTableData[index].contractEndDate
      if (this.$lodash.isEmpty(contractNumber) && this.$lodash.isEmpty(contractCategory) && this.$lodash.isEmpty(contractStartDate) && this.$lodash.isEmpty(contractEndDate)) {
        return false
      } else {
        return true
      }
    },
    resetContractFields (index) {
      this.$refs['contractNumber' + index].resetFields()
      this.$refs['contractCategory' + index].resetFields()
      this.$refs['contractStartEndDate' + index].resetFields()
    },
    // 合同编号
    checkContractNumber (rule, value, callback, index) {
      var checkRes = this.checkContractRequired(index)
      if (this.$lodash.isEmpty(value) && checkRes) {
        callback(new Error('请输入合同编号'))
      } else {
        if (!checkRes) {
          this.resetContractFields(index)
        }
        callback()
      }
    },
    // 签订类型
    checkContractCategory (rule, value, callback, index) {
      var checkRes = this.checkContractRequired(index)
      if (this.$lodash.isEmpty(value) && checkRes) {
        callback(new Error('请选择签订类型'))
      } else {
        if (!checkRes) {
          this.resetContractFields(index)
        }
        callback()
      }
    },
    // 合同开始时间
    checkContractStartDate (rule, value, callback, index) {
      var checkRes = this.checkContractRequired(index)
      var isEmpty = this.$lodash.isEmpty(value)
      if (isEmpty && checkRes) {
        callback(new Error('请选择合同开始时间'))
      } else {
        var contractEndDate = this.contractTableData[index].contractEndDate
        if ((!isEmpty) && (!this.$lodash.isEmpty(contractEndDate)) && new Date(value) > new Date(contractEndDate)) {
          this.$refs['contractStartEndDate' + index].validateField('contractEndDate')
          callback()
        } else {
          if (!checkRes) {
            this.resetContractFields(index)
          } else {
            this.$refs['contractStartEndDate' + index].validateField('contractEndDate')
          }
          callback()
        }
      }
    },
    // 合同结束时间
    checkContractEndDate (rule, value, callback, index) {
      var checkRes = this.checkContractRequired(index)
      var isEmpty = this.$lodash.isEmpty(value)
      if (isEmpty && checkRes) {
        callback(new Error('请选择合同结束时间'))
      } else {
        var contractStartDate = this.contractTableData[index].contractStartDate
        if ((!isEmpty) && (!this.$lodash.isEmpty(contractStartDate)) && new Date(value) < new Date(contractStartDate)) {
          callback(new Error('结束日期不能小于开始日期'))
        } else {
          if (!checkRes) {
            this.resetContractFields(index)
          }
          callback()
        }
      }
    },
    checkSetting (rule, value, callback, index) {
      /* TEXTINPUT("50008001","文本输入框"),
              NUMBERINPUT("50008002","数字输入框"),
              DATEINPUT("50008003","日期选择框"),
              DROPDOWNINPUT("50008004","下拉选择框"),
              RADIOINPUT("50008005","单选框"),
              CHECKBOXINPUT("50008006","复选框"), */
      var item = this.settingListInit[index]
      var numberExp = /^(-?\d+)(\.\d+)?$/
      if (this.$lodash.isEmpty(value)) {
        if (item.required) {
          if (item.personalType == '50008001' || item.personalType == '50008002') {
            callback(new Error('请输入' + item.personalName))
          } else {
            callback(new Error('请选择' + item.personalName))
          }
        } else {
          callback()
        }
      } else {
        if (item.personalType == '50008002') {
          // 数字输入框
          if (numberExp.test(value)) {
            if ((!this.$lodash.isEmpty(item.personalValuerange)) && (Number(value) > Number(item.personalValuerange.split(',')[1]) || Number(value) < Number(item.personalValuerange.split(',')[0]))) {
              callback(new Error('取值范围为' + item.personalValuerange.split(',')[0] + '~' + item.personalValuerange.split(',')[1]))
            } else {
              callback()
            }
          } else {
            callback(new Error('请输入正确数字格式'))
          }
        } else if (item.personalType == '50008003') {
          // 数字输入框
          if ((!this.$lodash.isEmpty(item.personalValuerange)) && (new Date(value) > new Date(item.personalValuerange.split(',')[1]) || new Date(value) < new Date(item.personalValuerange.split(',')[0]))) {
            callback(new Error('取值范围为' + item.personalValuerange.split(',')[0] + '~' + item.personalValuerange.split(',')[1]))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    doLeave () {
      this.$router.replace('/employee/index')
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../assets/css/employee.less';
  .add-type-form{
    .el-col{
      min-height: 75px;
      /deep/.el-form-item__content{
        line-height: normal;
      }
    }
    .el-form-item{
      margin-bottom: 0;
    }
  } 
  @media (min-width: 768px){ 
    //>=768的设备 
    .add-type-form{
      .el-col{
        min-height: 120px;
      }
    } 
  }

  @media (min-width: 1024px){ 
    //>=768的设备 
    .add-type-form{
      .el-col{
        min-height: 100px;
      }
    } 
  }
   @media (min-width: 1100px){ 
    //>=768的设备 
    .add-type-form{
      .el-col{
        min-height: 90px;
      }
    } 
  }

@media (min-width: 1200px){ 
  //>=992的设备 
  .add-type-form{
    .el-col{
      min-height: 80px;
    }
  } 
}
  .settingFormCol{
    margin-bottom: 30px;
  }
  .settingTextarea{
    width: calc(66.66% - 30px);
  }
  /deep/.ic-addr {
    margin-top: 9px !important;
  }
</style>
