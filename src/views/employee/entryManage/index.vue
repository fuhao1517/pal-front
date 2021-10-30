<template>
  <div class="content spl-container">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <splTab :tabs="tabs" v-model="tabActive" :key="refreshTab"></splTab>
    <div class="search-row-btn header-right">
      <!-- <el-button size="small" @click="refreshTable">
        <i class="el-icon-refresh" style="color: black;"></i>刷新
      </el-button> -->
      <router-link to="/employee/addEntry">
        <el-button size="small" type="primary" class="opt-btn">添加待入职</el-button>
      </router-link>
      <router-link to="/employee/entryManage/entryTable">
        <el-button size="small" type="primary" class="ml-10">入职登记表</el-button>
      </router-link>
    </div>
    <div class="search-row clearfix pt-30" style="padding-bottom:7px;">
      <el-input placeholder="请输入证件号码\姓名\手机号码查询" class="ml-20 w-260" v-model="searchWord"></el-input>
      <el-button size="small" type="primary" class="ml-20" @click="getTableData('',true)">查询</el-button>
      <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
        <div class="show-select-form">
          <el-form ref="selectForm" :model="selectForm" class="select-form">
            <el-row class="select-form-el-row" type="flex" justify="space-around">
              <el-col :span="10" class="select-form-el-col">
                <el-form-item label="入职主体:" class="ml-20" style="display: flex; align-items: center;">
                  <el-select v-model="selectForm.subject">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in entrySubjectList" :key="item.id"
                               :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" class="select-form-el-col">
                <el-form-item label="是否已发起签署：" style="display: flex; align-items: center;">
                  <el-checkbox-group class="inlineBlock" v-model="selectForm.signFlag" style="display: flex; align-items: center;">
                    <el-checkbox label="1" class="mr-20">已发起</el-checkbox>
                    <el-checkbox label="0" class="mr-20">未发起</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>

              <el-col :span="10" class="select-form-el-col">
                <el-form-item label="证件号码:" style="display: flex; align-items: center;">
                  <el-input type="textarea" class="w-200" v-model="selectForm.empIdCards" placeholder="一行只可输入一个身份证"></el-input>
                  <span class="text-red ml-10">已输入{{selectForm.searchIdCardsLength}}个</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="select-form-el-col">
                <el-button size="small" type="primary" class="s-btn" @click="getTableData('',true);" icon="el-icon-search">查询</el-button>
                <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
              </el-col>

            </el-row>
          </el-form>
        </div>
        <el-button slot="reference" icon="ic-filter-blue" class="ml-10">筛选</el-button>
      </el-popover>
      <div class="fr" v-show="tabActive==0">
        <el-button size="small" class="btn--border-blue" @click="sureEntry('pendingTable')">确认入职</el-button>
        <el-button class="btn--border-blue" size="small" @click="giveUpEntry('pendingTable')">放弃入职</el-button>
        <el-button class="btn--border-blue" size="small" @click="reCollect('pendingTable')">重新收集入职登记表</el-button>
        <el-button class="btn--border-blue" size="small" @click="doSignFile('pendingTable')">发起入职文件签署</el-button>
      </div>
      <div class="fr" v-show="tabActive==1">
        <el-button size="small" class="btn--border-blue" @click="reCollect('alreadyTable')">重新收集入职登记表</el-button>
        <el-button size="small" class="btn--border-blue" @click="doSignFile('alreadyTable')">发起入职文件签署</el-button>
      </div>
    </div>
    <div v-show="tabActive==0">
      <!-- 表格 -->
      <dTable class="pb-20" @fetch="getTableData('pendingTable',true)" @selection-change="getSelectRow" ref="pendingTable" :tableHeight="tableHeight" :paging="true" :showSelection="true"
              :showIndex="true">
        <el-table-column prop="name" label="姓名" width="150" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="telephone" label="手机号码" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="optrCompName" label="入职主体" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="collectStatusName" label="资料状态" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="entryStatusName" label="入职状态" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="signFlag" label="是否已发起签署" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="f-cursor" v-if="scope.row.signFlag==0">未发起</span>
            <span v-else class="text-blue f-cursor" @click="viewSignFile(scope.row)">已发起</span>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):'' }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button class="mr-10" type="text" size="small" @click.stop="showInfo(scope.row)">查看</el-button>
            <div class="opt-btn-split"></div>
            <el-button class="mr-10" type="text" size="small" @click.stop="editInfo(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </dTable>
      <el-button class="footer-button" @click="exportData" icon="ic-export-white" size="small" type="primary">导出</el-button>

    </div>
    <div v-show="tabActive==1">
      <!-- 表格 -->
      <dTable class="pb-20" @fetch="getTableData('alreadyTable',true)" @selection-change="getSelectRow" ref="alreadyTable" :tableHeight="tableHeight" :paging="true" :showSelection="true"
              :showIndex="true">
        <el-table-column prop="name" label="姓名" width="150" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="telephone" label="手机号码" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="optrCompName" label="入职主体" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="collectStatusName" label="资料状态" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="entryStatusName" label="入职状态" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="signFlag" label="是否已发起签署" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="f-cursor" v-if="scope.row.signFlag==0">未发起</span>
            <span v-else class="text-blue f-cursor" @click="viewSignFile(scope.row)">已发起</span>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):'' }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button class="mr-10" type="text" size="small" @click.stop="showInfo(scope.row)">查看</el-button>
            <!--            <div class="opt-btn-split"></div>-->
            <!--            <el-button class="mr-10" type="text" size="small" @click.stop="editInfo(scope.row)">编辑</el-button>-->
          </template>
        </el-table-column>
      </dTable>
      <el-button class="footer-button" @click="exportData" icon="ic-export-white" size="small" type="primary">导出</el-button>
    </div>
    <div v-show="tabActive==2">
      <!-- 表格 -->
      <dTable class="pb-20" @fetch="getTableData('giveUpTable',true)" @selection-change="getSelectRow" ref="giveUpTable" :tableHeight="tableHeight" :paging="true" :showSelection="true"
              :showIndex="true">
        <el-table-column prop="name" label="姓名" width="150" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="telephone" label="手机号码" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="optrCompName" label="入职主体" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="collectStatusName" label="资料状态" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="entryStatusName" label="入职状态" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="signFlag" label="是否已发起签署" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="f-cursor" v-if="scope.row.signFlag==0">未发起</span>
            <span v-else class="text-blue f-cursor" @click="viewSignFile(scope.row)">已发起</span>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):'' }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button class="mr-10" type="text" size="small" @click.stop="showInfo(scope.row)">查看</el-button>
            <!--            <div class="opt-btn-split"></div>-->
            <!--            <el-button class="mr-10" type="text" size="small" @click.stop="editInfo(scope.row)">编辑</el-button>-->
          </template>
        </el-table-column>
      </dTable>
      <el-button class="footer-button" @click="exportData" icon="ic-export-white" size="small" type="primary">导出</el-button>

    </div>

    <!--查看-->
    <el-drawer :visible.sync="showDetailDrawer" :withHeader='false' :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <div class="clearfix header">
        <div class="fl mr-60 clearfix">
          <img class="mt-10 fl ml-30 mr-20" src="@/assets/images/default-img.png" alt="">
          <span>{{rowViewInfo.name}}</span>
        </div>
        <div class="fl">签约主体:{{rowViewInfo.optrCompName}}</div>
        <div class="fl mr-200 ml-200">资料状态:{{rowViewInfo.collectStatusName}}</div>
        <div class="fl">入职状态:{{rowViewInfo.entryStatusName}}</div>
        <div class="fr">
          <!--<el-button size="small" @click="saveEditResult" type="primary">保存</el-button>-->
          <img style="position: relative;top: 3px;" class="ml-20 mr-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="handleClose">
        </div>
      </div>
      <el-tabs v-model="detailTabActive2">

        <el-tab-pane label="入职登记表" name="入职登记表">
          <div class="item-content item-content-table" v-for="(item, index) in rowViewInfo.msgDataList" :key="index">
            <p class="title mb-20 ml-10">{{item.groupName}}</p>
            <el-row class="ml-40">
              <el-col :span="itemField.fieldType==50008007?24:8" style="min-height: 100px" v-for="(itemField, index2) in item.fields" :key="index2">
                <p class="text item-text mb-10">{{itemField.fieldName}}：</p>
                <span class="value item-value" v-if="itemField.fieldType=='50008003'">{{itemField.value?$moment(itemField.value).format('YYYY-MM-DD'):''}}</span>
                <span class="value item-value" style="width: 66.66%;min-height: 60px;margin-bottom: 15px" v-else-if="itemField.fieldType=='50008007'">{{itemField.value}}</span>
                <span class="value item-value" v-else>{{itemField.value}}</span>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="入职材料" name="入职材料">
          <div v-for="(item, index) in rowViewInfo.registrationData" :key="index">
            <p class="title mb-20 ml-10">{{item.groupName}}</p>
            <div class="clearfix materials" v-for="(itemField, index2) in item.fields" :key="index2">
              <p style="font-size:16px;" class="mb-10 ml-10">{{itemField.fieldName}}</p>
              <div v-for="(materialsItem, index3) in itemField.materialsItems" :key="index3">
                <el-image class="materials-img fl" :src="materialsItem.serverUrl" :preview-src-list="[materialsItem.serverUrl]" fit="contain"></el-image>
              </div>
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </el-drawer>
    <!--查看-->

    <!--编辑-->
    <el-drawer :visible.sync="showEditDetailDrawer" :withHeader='false' :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <div>
        <div class="clearfix header-edit">
          <div class="fl mr-60 clearfix">
            <img class="mt-10 fl ml-30 mr-20" src="@/assets/images/default-img.png" alt="">
            <span>{{rowEditInfo.emp.name}}</span>
          </div>
          <div class="fl">签约主体:{{rowEditInfo.emp.optrCompName}}</div>
          <div class="fl" style="width: 30%;max-width: 420px">资料状态:{{rowEditInfo.collectStatusName}}</div>
          <div class="fl">入职状态:{{rowEditInfo.entryStatusName}}</div>
          <div class="fr">
            <el-button size="small" @click="saveEditResult" type="primary">保存</el-button>
            <img style="position: relative;top: 3px;" class="ml-20 mr-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="showEditDetailDrawer=false">
          </div>
        </div>

        <el-tabs v-model="detailTabActive3">
          <el-tab-pane label="入职登记表" name="入职登记表">
            <div class="item-content item-content-table" v-for="(item, groupIndex) in rowEditInfo.templateInfo" :key="groupIndex">
              <p class="title mb-20 ml-10">{{item.groupName}}</p>
              <el-row class="ml-40">
                <el-col :span="itemField.fieldType==50008007?24:8" v-for="(itemField, itemIndex) in item.fields" :key="itemIndex">
                  <!-- 
                     <el-option label="文本输入框" value="50008001"></el-option>
                      <el-option label="数值输入框" value="50008002"></el-option>
                      <el-option label="日期选择框" value="50008003"></el-option>
                      <el-option label="下拉选择框" value="50008004"></el-option>
                      <el-option label="复选框" value="50008006"></el-option>
                      <el-option label="文本域" value="50008007"></el-option>
                      <el-option label="地区选择框" value="50008010"></el-option>
                      <el-option label="省市选择器" value="50008011"></el-option>
                      
                   -->
                  <div v-if="itemField.fieldType!=50008010&&itemField.fieldType!=50008011">
                    <el-form label-position="top" :inline="true" :model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex]" :ref="'infoForm'+groupIndex+itemIndex"  :class="{'itemFieldTextareaForm':itemField.fieldType==50008007}">
                      <el-form-item style="width:80%;" :label="itemField.fieldName" prop="value"
                                    :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!=null &&itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请填写'+itemField.fieldName,
                                    trigger:'blur'},{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!=null &&itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请填写'+itemField.fieldName,
                                    trigger:'change'}, { validator:(rule, value, callback)=>checkFieldNumberType(rule, value, callback, itemField.fieldType), trigger:'blur'}]">
                        <!--文本框-->
                        <el-input style="width: 100%" v-if="itemField.fieldType==50008001" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].value"
                                  :disabled="(itemField.fieldName=='姓名'||itemField.fieldName=='证件号码')&&!rowEditInfo.updateTag"
                                  @change="changeItem($event,itemField.uuid)"></el-input>
                        <!--数字框-->
                        <el-input style="width: 100%" v-if="itemField.fieldType==50008002" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].value"
                                  @change="changeItem($event,itemField.uuid)"></el-input>
                        <!--日期-->
                        <el-date-picker style="width: 100%" 
                                        v-else-if="itemField.fieldType==50008003"
                                        v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].value"  @change="changeItem($event,itemField.uuid)"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        placeholder="选择日期">
                        </el-date-picker>
                        <!--下拉选择框-->
                        <el-select style="width: 100%" v-else-if="itemField.fieldType==50008004" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].value"
                                   @change="changeItem($event,itemField.uuid)"
                                   placeholder="请选择">
                          <el-option
                            v-for="(item,index) in  itemField.inputValuesList"
                            :key="index"
                            :label="item.inputValue"
                            :value="item.inputValue">
                          </el-option>
                        </el-select>

                        <!--文本域-->
                        <el-input type="textarea" style="width: 100%" width="100%" :rows="4" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].value" v-else-if="itemField.fieldType==50008007" resize="none"></el-input>
                      
                       <!--复选框-->
                       <!-- <span v-for="(it,index) in itemField.inputValuesList" :key="index">{{it.inputValue}}</span> -->
                       <div v-if="itemField.fieldType==50008006">
                          <el-checkbox-group v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].value">
                          <el-checkbox v-for="(it,index) in itemField.inputValuesList" :key="index" :label="it.inputValue">{{it.inputValue}}</el-checkbox>
                          </el-checkbox-group>
                       </div>
                        
                      </el-form-item>
                    </el-form>
                  </div>
                  <!-- 地区选择器 -->
                  <div class="display-flex" v-if="itemField.fieldType==50008010">
                    <el-form class="itemFieldAddrForm" :inline="true" :model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex]" :ref="'infoForm'+groupIndex+itemIndex">
                      <p style="margin-bottom:0px;" :class="{'required': itemField.mustInput=='MUST'}">{{itemField.fieldName}}</p>
                      <el-form-item class="addr-select" prop="province"
                                    :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请选择'+itemField.fieldName,
                                    trigger:'change'}]">
                        <!--                    {"province":"广东省","city":"韶关市","area":"始兴县","detail":"隘子镇石井村岭头组18号"}-->
                        <el-select style="width:85px"
                                   v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].province" ref="addrProvinceId3" placeholder="请选择"
                                   @change="(val)=>getCitysByProvinceIdAndClear(val ,groupIndex,itemIndex)" clearable>
                          <el-option v-for="item in employeeDataDict.provinces" :key="item.dictCode" :label="item.dictName"
                                     :value="item.dictCode+'|'+item.dictName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="addr-select" label="" prop="city" :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请选择'+itemField.fieldName,
                                    trigger:'change'}]">
                        <el-select style="width:85px" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].city" ref="addrCityId3" placeholder="请选择"
                                   @change="getCountryByCityIdAndClear($event ,groupIndex,itemIndex)" clearable>
                          <el-option v-for="item in rowEditInfo.templateInfo[groupIndex].fields[itemIndex].addrCityList" :key="item.dictCode" :label="item.dictName"
                                     :value="item.dictCode+'|'+item.dictName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="addr-select" label="" prop="area" :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请选择'+itemField.fieldName,
                                    trigger:'change'}]">
                        <el-select style="width:85px" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].area" ref="addrAreaId3" placeholder="请选择"
                                   @change="changeAddressItem($event ,groupIndex,itemIndex)" clearable>
                          <el-option v-for="item in rowEditInfo.templateInfo[groupIndex].fields[itemIndex].addrCountryList" :key="item.dictCode" :label="item.dictName"
                                     :value="item.dictCode+'|'+item.dictName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="flex1" label="" prop="detail" :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请填写'+itemField.fieldName,
                                    trigger:'blur'}]">
                        <el-input v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].detail" placeholder="详细地址"
                                  @change="changeAddressItem($event,itemField.uuid)" class="w-p100"
                                  :maxlength="100"
                                  clearable></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                   <!-- 省市选择器 -->
                  <div class="display-flex" v-if="itemField.fieldType==50008011">
                    <el-form class="itemFieldAddrForm" :inline="true" :model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex]" :ref="'infoForm'+groupIndex+itemIndex">
                      <p style="margin-bottom:0px;" :class="{'required': itemField.mustInput=='MUST'}">{{itemField.fieldName}}</p>
                      <el-form-item class="addr-select" prop="province"
                                    :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请填写'+itemField.fieldName,
                                    trigger:'change'}]">
                        <!--                    {"province":"广东省","city":"韶关市","area":"","detail":""}-->
                        <el-select style="width:150px"
                                   v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].province" ref="addrProvinceId3" placeholder="请选择"
                                   @change="(val)=>getCitysByProvinceIdAndClear(val ,groupIndex,itemIndex)" clearable>
                          <el-option v-for="item in employeeDataDict.provinces" :key="item.dictCode" :label="item.dictName"
                                     :value="item.dictCode+'|'+item.dictName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="addr-select" label="" prop="city" :rules="[{ required: itemField.mustInput=='MUST'?true:false,
                                    message: itemField.fieldComment!='null'&&itemField.fieldComment!=''?itemField.fieldComment:'请填写'+itemField.fieldName,
                                    trigger:'change'}]">
                        <el-select style="width:150px" v-model="rowEditInfo.templateInfo[groupIndex].fields[itemIndex].city" ref="addrCityId3" placeholder="请选择"
                                   clearable>
                          <el-option v-for="item in rowEditInfo.templateInfo[groupIndex].fields[itemIndex].addrCityList" :key="item.dictCode" :label="item.dictName"
                                     :value="item.dictCode+'|'+item.dictName"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>

          <el-tab-pane label="入职材料" name="入职材料">

            <div v-for="(item, groupIndex) in rowEditInfo.registrationInfo" :key="groupIndex">
              <p class="title mb-20 ml-10">{{item.groupName}}</p>
              <div class="clearfix file-box" v-for="(file, index) in item.fields" :key="index">
                <p class="ml-30 mt-20 file-name">{{file.fieldName}}</p>
                <el-upload
                  class="upload-demo"
                  action="/api/api/file/upload"
                  :on-remove="handleRemove"
                  :on-success="handSuccess"
                  :before-upload="beforeAvatarUpload"
                  :file-list="file.fileList"
                  list-type="picture">
                  <el-button id="upload-button" class="fl mt-15 ml-20" size="small" type="primary" @click="getGroupName(item.groupName,file.uuid)">
                    <img src="@/assets/images/icons/upload-button.png" alt="">
                    <div class="upload-text">
                      <p v-text="'上传'+file.fieldName+'照片'"></p>
                      <p style="font-size:10px;">文件大小不超过2M</p>
                    </div>
                  </el-button>
                </el-upload>

              </div>
            </div>
            <!--    -->
            <!--            <div v-for="(item, index) in rowEditInfo.registrationInfo" :key="index">-->
            <!--              <p class="title ml-10">{{item.groupName}}</p>-->
            <!--              <div class="clearfix" v-for="(file, index) in item.fields" :key="index">-->
            <!--                <el-divider content-position="left">{{file.fieldName}}</el-divider>-->
            <!--                <el-upload class="upload-demo" action="/api/api/file/upload" :on-remove="handleRemove" :on-success="handSuccess" :file-list="file.fileList" list-type="picture">-->
            <!--                  <el-button class="upload-button" size="small" type="primary" @click="getGroupName(item.groupName,file.uuid)">点击上传</el-button>-->
            <!--                </el-upload>-->
            <!--              </div>-->
            <!--            </div>-->
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
    <!--编辑-->

    <!-- 签署状态 -->
    <el-drawer :with-header="false" :withHeader="false" :show-close="false" :visible.sync="operationDrawer" :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <operationDrawer :operationData="operationData" :operationInfo="operationInfo"/>
    </el-drawer>
    <!-- 签署状态 -->
  </div>
</template>

<script>
  import dTable from '../../../components/common/table'
  import splTab from '../../../components/common/spl-tab'
  import addrSelector from '../../../components/common/addrSelector'
  import operationDrawer from './operationDrawer'
  import {accMul, calFee, getAccfundAmount, getSocialCyleAmount, accAdd2} from '../../../utils/socialAccfundProduct'

  export default {
    components: {dTable, splTab, addrSelector, operationDrawer},
    data() {
      return {
        spanRow: 8,
        pathData: [
          {name: '人员管理'},
          {name: '入职管理'}
        ],
        tabs: ['待入职(0)', '已入职(0)', '放弃入职(0)'],
        tabActive: 0,
        searchWord: '',
        showSelectForm: false,
        selectForm: {
          subject: '',
          signFlag: [],
          empIdCards: '',
          setEmpIdCards: [],
          searchIdCardsLength: 0
        },
        entrySubjectList: [{id: 1, name: '1212'}],
        selectRows: [],
        showDetailDrawer: false,
        rowViewInfo: {}, // 查看数据
        rowEditInfo: {emp: {name: ''}}, // 编辑数据
        detailTabs: ['入职登记表', '入职材料'],
        detailTabActive: 0,
        detailTabActive2: '入职登记表',
        detailTabActive3: '入职登记表',
        showEditDetailDrawer: false,
        fileList: [], // 附件集合
        infoForm: {
          empUuid: '',
          userId: '',
          userName: '',
          itemList: '',
          materialList: ''
        }, // 提交编辑的表单
        infoFromTemp: [],
        employeeDataDict: {provinces: [{dictCode: 1, dictName: '广东'}]},
        addrCityList: [],
        addrCountryList: [],
        groupName: '',
        fileUuid: '',
        refreshTab: new Date().getTime(),
        operationDrawer: false,
        operationData: [{}],
        operationInfo: {},
      }
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 400 + 'px'
      }
    },
    created() {
      this.$nextTick(() => {
        // this.getTableData('pendingTable')
        this.getSubjectList()
        this.getEmployeeDataDict()
        this.refreshTable()
      })
    },
    watch: {
      'selectForm.empIdCards'(newValue, oldValue) {
        var obj = this.$global.getIdCardRow(this.selectForm.empIdCards)
        this.selectForm.searchIdCardsLength = obj.num
        this.selectForm.setEmpIdCards = obj.value
      }
    },
    methods: {
      // 获取表格数据
      getTableData(val, useTabActive) {
        let that = this
        var params = []
        // queryCond 姓名/手机号码/身份证
        // optrCompName入职主体名称
        // signFlag 是否放弃签署0否 1是
        // idCards身份证数组
        params.push({property: 'queryCond', value: this.searchWord})
        params.push({property: 'useType', value: 1})
        if (this.showSelectForm) {
          params.push({property: 'optrCompName', value: this.selectForm.subject})
          params.push({property: 'signFlag', value: this.selectForm.signFlag})
          params.push({property: 'idCards', value: this.selectForm.setEmpIdCards})
        }
        if (val == 'pendingTable' || (useTabActive && this.tabActive == 0)) { // 待入职
          params.push({property: 'entryStatus', value: ['0']})
          this.$refs.pendingTable.fetch({
            query: params,
            method: 'post',
            url: '/api/entryresign/emp/empList',
            callback: function (data) {
              that.tabs[0] = '待入职(' + data.records + ')'
              that.refreshTab = new Date().getTime()
            }
          })
        } else if (val == 'alreadyTable' || (useTabActive && this.tabActive == 1)) { // 已入职
          params.push({property: 'entryStatus', value: ['1']})
          this.$refs.alreadyTable.fetch({
            query: params,
            method: 'post',
            url: '/api/entryresign/emp/empList',
            callback: function (data) {
              that.tabs[1] = '已入职(' + data.records + ')'
              that.refreshTab = new Date().getTime()
            }
          })
        } else if (val == 'giveUpTable' || (useTabActive && this.tabActive == 2)) { // 放弃
          params.push({property: 'entryStatus', value: ['2']})
          this.$refs.giveUpTable.fetch({
            query: params,
            method: 'post',
            url: '/api/entryresign/emp/empList',
            callback: function (data) {
              that.tabs[2] = '放弃入职(' + data.records + ')'
              that.refreshTab = new Date().getTime()
            }
          })
        }
        that.handleClose()
      },
      // 重置搜索框
      resetSelectForm() {
        this.selectForm.subject = ''
        this.selectForm.signFlag = []
        this.selectForm.setEmpIdCards = []
        this.selectForm.empIdCards = ''
        this.selectForm.searchIdCardsLength = ''
      },

      showInfo(row) {
        let that = this
        that.$http({
          url: 'api/entryresign/emp/viewEmp',
          method: 'GET',
          params: {
            id: row.id
          }
        }).then(({data}) => {
          let result = data.data
          that.rowViewInfo = result
          that.showDetailDrawer = true
        })
      },
      // 点击编辑按钮
      editInfo(row) {
        let that = this
        that.$http({
          url: 'api/entryresign/emp/preEditEmp',
          method: 'GET',
          params: {
            id: row.id
          }
        }).then(({data}) => {
          let result = data.data.data
          that.rowEditInfo = result
          var itemList = []
          var materialList = []

          var templateInfoArrays = [];
          var registrationArrays = [];
          for (let i = 0; i < that.rowEditInfo.templateInfo.length; i++) {
            let element = that.rowEditInfo.templateInfo[i];
            let fieldElements = element.fields;
            if (fieldElements != null && fieldElements.length > 0 && fieldElements[0].fieldType == 50008008) {
              for (let j = 0; j < fieldElements.length; j++) {
                var resultFileList = []
                if (fieldElements[j].materialsItems != null && fieldElements[j].materialsItems.length > 0) {
                  for (let k = 0; k < fieldElements[j].materialsItems.length; k++) {
                    console.info(fieldElements[j].materialsItems[k])
                    resultFileList.push(
                      {
                        'name': fieldElements[j].materialsItems[k].fileName,
                        'url': fieldElements[j].materialsItems[k].serverUrl,
                        'uid': fieldElements[j].materialsItems[k].fileId
                      }
                    );
                  }
                }
                fieldElements[j].fileList = resultFileList
              }
              registrationArrays.push(element)
              materialList = materialList.concat(fieldElements);
            } else {
              for (let j = 0; j < fieldElements.length; j++) {
                let fieldElement = fieldElements[j];
                if (fieldElement.fieldType == 50008010||fieldElement.fieldType == 50008011) {
                  if (fieldElement.value != null && fieldElement.value != '') {
                    let parse = JSON.parse(fieldElement.value);
                    this.$set(fieldElement, 'province', parse.province)
                    this.$set(fieldElement, 'city', parse.city)
                    this.$set(fieldElement, 'area', parse.area)
                    this.$set(fieldElement, 'detail', parse.detail)
                  } else {
                    this.$set(fieldElement, 'province', '')
                    this.$set(fieldElement, 'city', '')
                    this.$set(fieldElement, 'area', '')
                    this.$set(fieldElement, 'detail', '')
                  }
                }

                if (fieldElement.fieldType == 50008003) {
                  if (fieldElement.value != null && fieldElement.value != '') {
                    this.$set(fieldElement, 'value', that.$moment(fieldElement.value).format('YYYY-MM-DD'))
                  } else {
                    this.$set(fieldElement, 'value', '')
                  }
                }

                // 复选框
                if (fieldElement.fieldType == 50008006) {
                  if(fieldElement.value&&fieldElement.value!=''){
                    fieldElement.value = JSON.parse(fieldElement.value)
                  }else{
                    fieldElement.value = []
                  }
                  
                }
              }
              templateInfoArrays.push(element)
              itemList = itemList.concat(fieldElements)
            }
          }
          that.rowEditInfo.templateInfo = templateInfoArrays
          that.rowEditInfo.registrationInfo = registrationArrays

          //初始化 地区下拉框
          templateInfoArrays.forEach((templateInfo, k) => {
            let fields = templateInfo.fields;
            fields.forEach((field, l) => {
              if (fields[l].province == null || fields[l].province == '') {
                return true
              }
              let provinceId = that.getCodeByName(that.employeeDataDict.provinces, fields[l].province);
              if (provinceId==null || provinceId == 0) {
                return true
              }
              that.$http({
                url: '/api/employee/getCitysByProvinceId',
                method: 'post',
                data: that.$qs.stringify({
                  provinceId: Number(provinceId)
                })
              }).then(({data}) => {
                that.$set(that.rowEditInfo.templateInfo[k].fields[l], 'addrCityList', data.data[0])
                let cityId = that.getCodeByName(data.data[0], fields[l].city);
                if (cityId==null || cityId == 0) {
                  return true
                }
                that.getCountryByCityId(cityId, k, l);
              })
            })
          })
          that.showEditDetailDrawer = true
          // 转换保存表单
          that.infoForm.empUuid = result.empUuid
          that.infoForm.itemList = itemList
          that.infoForm.materialList = materialList
          console.info(that.rowEditInfo)
        })
      },
      // 保存编辑结果
      saveEditResult() {
        console.info(this.infoForm)
        let that = this
        let infoFormValid = true
        // 校验自定义字段
        for (var q = 0; q < this.rowEditInfo.templateInfo.length; q++) {
          let rowEditInfoElement = this.rowEditInfo.templateInfo[q].fields
          for (let i = 0; i < rowEditInfoElement.length; i++) {
            this.$refs['infoForm' + q + i][0].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
          }
        }
        console.info(this.infoForm)
        console.log(infoFormValid)
        if (infoFormValid) {
          // 处理复选框的数据
          var addrObj = null
          var province = ''
          var city = ''
          for (var q = 0; q < this.rowEditInfo.templateInfo.length; q++) {
            let rowEditInfoElement = this.rowEditInfo.templateInfo[q].fields
            for (let i = 0; i < rowEditInfoElement.length; i++) {
              if(rowEditInfoElement[i].fieldType=='50008006'){
                rowEditInfoElement[i].value = JSON.stringify(rowEditInfoElement[i].value)
              }else if(rowEditInfoElement[i].fieldType=='50008011'){
                province = rowEditInfoElement[i].province.split("|")
                city = rowEditInfoElement[i].city.split("|")
                addrObj = {
                  province: province.length>1?province[1]:province[0],
                  city: city.length>1?city[1]:city[0],
                  area: '',
                  detail: ''
                }
                rowEditInfoElement[i].value = JSON.stringify(addrObj)
              }
            }
          }
          that.$http({
            url: '/api/entryresign/emp/editEmp',
            method: 'post',
            data: that.infoForm
          }).then(({data}) => {
            console.info(data)
            this.$message.success('保存成功')
            that.showEditDetailDrawer = false;
            that.refreshTable()
          })
        }
      },

      // 获取选中的行
      getSelectRow(rows) {
        this.selectRows = rows
      },
      // 获取行id字符拼接
      getSelectRowsIds(tableRef) {
        let ids = this.$refs[tableRef].getSelectionsArr('id')
        if (ids == null || ids.length == 0) {
          this.$message.warning('请选择需要操作的数据')
          return ''
        }
        var id = ''
        for (let i = 0; i < ids.length; i++) {
          id = id + ids[i] + ','
        }
        return id
      },
      // 刷新表格
      refreshTable() {
        console.info('refresh')
        this.getTableData('pendingTable', false)
        this.getTableData('alreadyTable', false)
        this.getTableData('giveUpTable', false)
      },
      // 确认入职
      sureEntry(tableRef) {
        let that = this
        let ids = that.getSelectRowsIds(tableRef)
        if (ids == '') {
          return
        }
        that.$http({
          url: '/api/entryresign/emp/confirmEntry',
          method: 'POST',
          params: {
            id: ids,
            type: 1
          }
        }).then(({data}) => {
          let result = data.data[0]
          if (result.code == '506') {
            that.$message.error(result.msg)
          } else {
            that.$message.success('确认入职,操作成功!')
            that.refreshTable()
          }
        })
      },
      // 放弃入职
      giveUpEntry(tableRef) {
        let that = this
        let ids = that.getSelectRowsIds(tableRef)
        if (ids == '') {
          return
        }
        that.$http({
          url: '/api/entryresign/emp/giveUpEntry',
          method: 'POST',
          params: {
            id: ids,
            type: 1
          }
        }).then(({data}) => {
          let result = data.data[0]
          if (result.code == '506') {
            that.$message.error(result.msg)
          } else {
            that.$message.success('放弃入职,操作成功!')
            that.refreshTable()
          }
        })
      },

      // 发起签署
      doSignFile(tableRef) {
        let ids = this.$refs[tableRef].getSelectionsArr('workUuid')
        this.$http({
          url: '/api/entryresign/file/preLaunchSign',
          method: 'post',
          data: {
            effectUuids: ids,
            type: '1' // 1入职2离职(这个页面发起的是入职)
          }
        }).then(({data}) => {
          this.$router.push('/fileSign/startSign?batchNum=' + data.data[0] + '&type=1')
        })
      },

      //重新收集入职登记表
      reCollect(tableRef) {
        let that = this;
        let ids = that.getSelectRowsIds(tableRef);
        if (ids == '') {
          return
        }
        that.$http({
          url: '/api/entryresign/emp/reCollect',
          method: 'POST',
          params: {
            id: this.selectRows[0].id,
          }
        }).then(({data}) => {
          let result = data.data[0];
          if (result.code == '506') {
            that.$message.error(result.msg)
          } else {
            that.$message.success('重新收集入职登记表,操作成功!')
            that.refreshTable();
          }
        })
      },
      handleClose() {
        this.showSelectForm = false
        this.showDetailDrawer = false
        this.showEditDetailDrawer = false
      },
      //获取主体集合
      getSubjectList() {
        let that = this;
        that.$http({
          url: '/api/entryresign/entrySubjectList',
          method: 'GET'
        }).then(({data}) => {
          let result = data.data[0];
          that.entrySubjectList = result;
          if (result.length == 1) {
            that.selectForm.subject = result[0].name
          }
        })
      },
      exportData() {
        var params = {}
        params.queryCond= this.searchWord
        if (this.showSelectForm) {
          params.optrCompName=this.selectForm.subject
          params.signFlag= this.selectForm.signFlag
          params.idCards= this.selectForm.setEmpIdCards
        }
        params.entryStatus= [this.tabActive]
        if (this.tabActive==0){
          params.ids = this.$refs['pendingTable'].getSelectionsArr('id')
        }else if (this.tabActive==1){
          params.ids = this.$refs['alreadyTable'].getSelectionsArr('id')
        }else if (this.tabActive==2){
          params.ids = this.$refs['giveUpTable'].getSelectionsArr('id')
        }
        this.$downloadFile(
          '/api/entryresign/emp/exportEmpList',
          'post',
          params,
          this.$global.EXCEL
        )
      },
      //删除文件
      handleRemove(file, fileList) {
        let that = this;
        let materialList = that.infoForm.materialList;
        for (let i = 0; i < materialList.length; i++) {
          let material = materialList[i];
          let materialsItems = materialList[i].materialsItems;
          for (let j = 0; j < materialsItems.length; j++) {
            let materialsItem = materialsItems[j];
            if (materialsItem.fileId == file.uid) {
              materialList[i].materialsItems.splice(j, 1)
            }
          }
        }
        that.infoForm.materialList = materialList
        console.info(that.infoForm.materialList)
      },
      //上传成功
      handSuccess(response, file, fileList) {
        let fileResult = response.data[0];
        let that = this;
        let materialList = that.infoForm.materialList;
        for (let i = 0; i < materialList.length; i++) {
          let material = materialList[i];
          if (material.groupName == that.groupName && material.uuid == that.fileUuid) {
            if (materialList[i].materialsItems == null || materialList[i].materialsItems == '') {
              materialList[i].materialsItems = []
            }
            materialList[i].materialsItems.push({
              fileId: response.data[0].fileId
            })
          }
        }
        that.infoForm.materialList = materialList
        console.info(that.infoForm.materialList)
      },
      beforeAvatarUpload(file) {
        var isJPG = file.type.indexOf();
        var formatList = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
        for (let i = 0; i < formatList.length; i++) {
          isJPG = file.type.indexOf(formatList[i]) > 0
          if (isJPG) {
            break;
          }
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg, jpeg ,gif ,png ,bmp 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      getGroupName(groupName, fileUuid) {
        console.info(groupName)
        console.info(fileUuid)
        this.groupName = groupName
        this.fileUuid = fileUuid
      },
      changeItem(event, fieldUuid) {
        let that = this;
        let itemList = that.infoForm.itemList;
        for (let i = 0; i < itemList.length; i++) {
          if (itemList[i].uuid == fieldUuid) {
            itemList[i].value = event
          }
        }
        console.info(event)
        console.info(fieldUuid)
        console.info(that.infoForm)
      },
      changeAddressItem(event, fieldUuid) {
        let that = this;
        let itemList = that.infoForm.itemList;
        for (let i = 0; i < itemList.length; i++) {
          let item = itemList[i];
          if (item.uuid == fieldUuid) {
            let province = item.province != null && item.province.split('|').length > 1 ? item.province.split('|')[1] : '';
            let city = item.city != null && item.city.split('|').length > 1 ? item.city.split('|')[1] : '';
            let area = item.area != null && item.area.split('|').length > 1 ? item.area.split('|')[1] : '';
            var json = JSON.stringify({"province": province, "city": city, "area": area, "detail": item.detail})
            that.infoForm.itemList[i].value = json
          }
        }
        console.info(event)
        console.info(fieldUuid)
        console.info(that.infoForm)
      },
      //获取人员相关字典值
      getEmployeeDataDict() {
        this.$http({
          url: '/api/employee/getEmployeeDataDict',
          method: 'post'
        }).then(({data}) => {
          this.employeeDataDict = data.data[0]

        })
      },
      // 根据省份ID获取地市列表
      getCitysByProvinceIdAndClear(id, groupIndex, itemIndex) {
        let that = this;
        console.info(id, groupIndex, itemIndex)
        id = id.split('|')[0];
        console.info(that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex])
        that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex].city = ''
        that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex].area = ''
        that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex].detail = ''
        that.addrCityList = []
        that.addrCountryList = []
        if (id == 'null' || id == '') {
          return false
        }
        that.getCitysByProvinceId(id, groupIndex, itemIndex)
      },
      getCitysByProvinceId(id, groupIndex, itemIndex) {
        let that = this;
        that.$http({
          url: '/api/employee/getCitysByProvinceId',
          method: 'post',
          data: that.$qs.stringify({
            provinceId: Number(id)
          })
        }).then(({data}) => {
          that.$set(that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex], 'addrCityList', data.data[0])
        })
      },
      // 根据市ID获取区级列表
      getCountryByCityIdAndClear(id, groupIndex, itemIndex) {
        let that = this;
        console.info(id, groupIndex, itemIndex)
        id = id.split('|')[0];
        console.info(that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex])
        // {"province":"广东省","city":"韶关市","area":"始兴县","detail":"隘子镇石井村岭头组18号"}
        that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex].area = ''
        that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex].detail = ''
        if (id == 'null' || id == '') {
          return false
        }
        that.getCountryByCityId(id, groupIndex, itemIndex)
      },
      getCountryByCityId(id, groupIndex, itemIndex) {
        let that = this;
        that.$http({
          url: '/api/employee/getCountryByCityId',
          method: 'post',
          data: that.$qs.stringify({
            cityId: Number(id)
          })
        }).then(({data}) => {
          // that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex].addrCountryList = data.data[0]
          that.$set(that.rowEditInfo.templateInfo[groupIndex].fields[itemIndex], 'addrCountryList', data.data[0])
        })
      },
      /* 入职管理-查看签署文件 */
      viewSignFile(row) {
        this.operationInfo = row
        this.$http({
          url: '/api/entryresign/file/viewSignFile',
          method: 'post',
          data: this.$qs.stringify({
            id: row.id,
            type: 1
          })
        }).then(({data}) => {
          this.operationData = data.data
          this.operationDrawer = true
        })
      },

      getCodeByName(list, name) {
        if (list == null || list.length < 1) {
          return 0;
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].dictName == name) {
            return list[i].dictCode
          }
        }
      },
      checkFieldNumberType(rule, value, callback, fieldType){
        // 校验数值类型
         var numberExp = /^(-?\d+)(\.\d+)?$/
         if(fieldType=='50008002'){
          if (value==''||numberExp.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确数值格式'))
          }
         }else{
           callback()
         }
        
      }
    },
    filters: {}
  }
</script>

<style scoped lang="less">
  .content {
    position: relative;

    .handle-btn {
      height: 50px;
      background: #F2F2F2;
      line-height: 50px;
    }

    .search-l {
      width: 60%;
      max-width: 750px;
      min-width: 600px
    }

    .search-l-input {
      min-width: 370px
    }

    /deep/ .el-table {
      margin-top: 0;
    }

    .header-right {
      right: 10px;
      top: 8px;
      position: absolute;
    }

    .footer-button {
      position: relative;
      bottom: 66px;
      left: 20px;
    }
  }

  .header {
    position: fixed;
    width: 87%;
    background: #fff;
    z-index: 10;
    height: 110px;
    line-height: 90px;
    border-bottom: 20px solid #e2e4e8;
  }

  .header-edit {
    position: fixed;
    width: 87%;
    background: #fff;
    z-index: 10;
    height: 90px;
    line-height: 90px;
    border-bottom: 20px solid #e2e4e8;
  }

  .title {
    font-size: 16px;
    font-weight: bold;;
  }

  .file-box {
    min-height: 215px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 33px;
  }

  .file-name {
    font-size: 16px;
  }

  .item-content {
    border-bottom: 1px solid #ddd;
    margin: 0 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;
  }

  /deep/ .el-tabs__item, .is-top, .is-active {
    width: 120px;
    text-align: center;
  }

  .item-value {
    display: inline-block;
    width: 80%;
    min-height: 32px;
    line-height: 32px;
    background: rgba(248, 248, 248, 1);
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 2px;
    padding-left: 5px;
  }

  .materials {
    min-height: 215px;
    border-bottom: 1px solid #CECECE;
  }

  .materials:last-child {
    border-bottom: none;
  }

  .materials-img {
    width: 201px;
    height: 133px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(227, 227, 227, 1);
    border-radius: 5px;
    margin: 10px 40px 0 30px;
    padding: 10px;
  }

  .upload-button {
    position: absolute;
    right: 20px;
    top: 0px;
  }

  /deep/ .el-tabs__nav-scroll {
    margin-top: 115px;
  }

  /deep/ .el-upload-list__item {
    width: 200px;
    height: 132px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(227, 227, 227, 1);
    border-radius: 5px;
    margin: 14px 40px 0px 30px;
    float: left;
  }

  /deep/ .el-upload-list__item-name {
    display: none;
  }

  /deep/ .el-upload-list__item-thumbnail {
    width: 163px;
    height: 100%;
  }

  /deep/ .el-upload-list__item-status-label {
    display: none;
  }

  .el-upload-list__item-status-label {
    display: none;
  }

  /deep/ #upload-button > span {
    width: 186px;
    height: 30px;
    border-radius: 5px;
    display: flex;
    align-items: center;

    .upload-text {
      color: #fff;
      font-size: 14px;
      border-left: 1px solid #fff;
      margin-left: 11px;
      padding-left: 11px;
    }
  }

  /deep/ .el-form-item__label {
    line-height: 0px;
  }

  /deep/ .el-form-item {
    margin-bottom: 40px;
  }
  /deep/.itemFieldTextareaForm{
    width: 100%;
    .el-form-item{
      width: calc(66.66% - 100px)!important;
    }
    /deep/.el-form-item {
      margin-bottom: 30px!important;
    }
  }
  .item-content-table{
    /deep/ .el-form-item {
      margin-bottom: 0px;
      min-height: 100px;
    }
    /deep/.itemFieldAddrForm{
      min-height: 100px;
      /deep/ .el-form-item {
        margin-bottom: 0px;
        min-height: auto;
      }
    }
  }
  

    @media (min-width: 768px){ 
    //>=768的设备 
    .item-content-table{
      /deep/ .el-form-item {
        min-height: 120px;
      }
      /deep/.itemFieldAddrForm{
        min-height: 120px;
      }
    }
  }

  @media (min-width: 1024px){ 
    //>=768的设备 
    .item-content-table{
      /deep/ .el-form-item {
        min-height: 100px;
      }
      /deep/.itemFieldAddrForm{
        min-height: 100px;
      }
    }
  }
   @media (min-width: 1100px){ 
    //>=768的设备 
    .item-content-table{
      /deep/ .el-form-item {
        min-height: 90px;
      }
      /deep/.itemFieldAddrForm{
        min-height: 90px;
      }
    }
  }

@media (min-width: 1200px){ 
  //>=992的设备 
  .item-content-table{
    /deep/ .el-form-item {
      min-height: 80px;
    }
    /deep/.itemFieldAddrForm{
      min-height: 80px;
    }
  }
}

</style>
