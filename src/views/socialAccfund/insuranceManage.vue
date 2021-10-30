<template>
  <div class="content spl-container">
    <div class="loading-mask-none" v-loading="mainLoading.isLoading" :element-loading-text="mainLoading.mainLoadingText"
         :element-loading-spinner="$global.elementLoadingSpinner">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <splTab :tabs="tabs" v-model="tabActive"></splTab>
    <div class="search-row clearfix" style="padding-top: 10px;">
      <div class="header-top clearfix">
        <div class="fl search-l search-l-input pt-20" v-show="tabActive==0">
          <span class="inlineBlock w-90 text-right mr-5">投保地：</span>
          <addrSelector width="220px" v-model="search.addrVal" :addrArr="social.allAddr" @changeAddrSelect="getAddrId"></addrSelector>
        </div>
        <div class="fl search-l search-l-input pt-20" v-show="tabActive==1">
          <span class="inlineBlock w-90 text-right mr-5">投保地：</span>
          <addrSelector width="220px" v-model="search.addrVal" :addrArr="accfund.allAddr" @changeAddrSelect="getAddrId"></addrSelector>
        </div>
        <div class="filter-date fl pt-20" style="margin-right:135px">
          <span class="inlineBlock w-90 text-right mr-5">费用年月：</span>
          <el-date-picker v-model="search.costMonth" type="month" class="date-editor2" value-format="yyyy-MM"></el-date-picker>
        </div>
        <div class="filter-date fl pt-20">
          <el-input placeholder="请输入证件号码\姓名查询" class="ml-20 w-220" v-model="search.searchWord"></el-input>
          <el-button type="primary" class="search-btn ml-10 w-60" @click="getSocialTableData" v-show="tabActive==0">查询</el-button>
          <el-button type="primary" class="search-btn ml-10 w-60" @click="getAccfundTableData" v-show="tabActive==1">查询</el-button>
          <el-popover placement="bottom" width="100%" popper-class="seach-popover" :visible-arrow="false" trigger="click" v-model="showSelectForm">
            <div class="show-select-form">
              <el-form ref="selectForm" :model="search" class="select-form">
                <el-row class="select-form-el-row" type="flex" justify="space-around">
                  <el-col :span="14" class="select-form-el-col">
                    <el-form-item label="证件号码：" label-position="right" label-width="108px">
                      <el-input type="textarea" class="w-220" style="margin-left: -5px;" v-model="search.empIdCards" placeholder="一行只可输入一个身份证"></el-input>
                      <span class="text-red ml-10">已输入{{search.searchIdCardsLength}}个</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" class="select-form-el-col text-right pr-5">
                    <el-button size="small" type="primary" class="s-btn" @click="getSocialTableData" icon="el-icon-search" v-show="tabActive==0">查询</el-button>
                    <el-button size="small" type="primary" class="s-btn" @click="getAccfundTableData" icon="el-icon-search" v-show="tabActive==1">查询</el-button>
                    <el-button size="small" @click="resetSelectForm" icon="el-icon-refresh-left" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-button slot="reference" icon="ic-filter-blue" class="ml-5">筛选</el-button>
          </el-popover>
        </div>
        <div class="add-data fr pt-20">
          <!--          <el-button v-show="tabActive==0" size="small" type="primary" class="w-60" @click="getSocialTableData">查询</el-button>-->
          <!--          <el-button v-show="tabActive==1" size="small" type="primary" class="w-60" @click="getAccfundTableData">查询</el-button>-->
          <el-dropdown>
            <el-button class="ml-5" size="small" type="primary" icon="el-icon-plus">单个添加</el-button>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/socialAccfund/increase">
                <el-dropdown-item>录入增员</el-dropdown-item>
              </router-link>
              <router-link to="/socialAccfund/tuneBase">
                <el-dropdown-item>录入调基</el-dropdown-item>
              </router-link>
              <router-link to="/socialAccfund/decrease">
                <el-dropdown-item>录入减员</el-dropdown-item>
              </router-link>
              <router-link to="/socialAccfund/increase">
                <el-dropdown-item>录入补缴</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
          <router-link to="/socialAccfund/import">
            <el-button size="small" class="bc-blue mr-30 ml-15" icon="ic-import-blue">批量导入</el-button>
          </router-link>
        </div>
      </div>
      <div class="apply-state header-bottom clearfix pl-30">
        <div class="fl mt-20 search-l">
          <span class="inlineBlock w-90 text-right">申报状态：</span>
          <el-checkbox-group class="inlineBlock" v-model="search.declareStatus">
            <el-checkbox label="1" class="mr-20">未提交申报</el-checkbox>
            <el-checkbox label="3" class="mr-20">已提交申报</el-checkbox>
            <el-checkbox label="5" class="mr-20">申报成功</el-checkbox>
            <el-checkbox label="6" class="mr-20">申报失败</el-checkbox>
            <el-checkbox label="7" class="mr-20">作废</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="fl text-left mt-20">
          <span class="inlineBlock w-90 text-right">申报类型：</span>
          <el-checkbox-group class="inlineBlock" v-model="search.declareType">
            <el-checkbox class="mr-20" label="1">增员</el-checkbox>
            <el-checkbox class="mr-20" label="2">减员</el-checkbox>
            <el-checkbox class="mr-20" label="3">调基</el-checkbox>
            <el-checkbox class="mr-20" label="5">补缴</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div v-show="tabActive==0">
      <div class="handle-btn">
        <div class="fr mr-25">
          <el-button size="small" type="primary" @click="changeSocialState(null,3)">提交</el-button>
          <el-button class="bc-blue" size="small" @click="changeSocialState(null,1)">撤回</el-button>
          <el-button class="bc-blue" size="small" @click="changeSocialState(null,7)">作废</el-button>
          <el-button class="bc-blue" size="small" @click="exportSocialData">导出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <dTable class="pb-20" @fetch="getSocialTableData" @selection-change="getSocialSelectRow" ref="socialTable" :tableHeight="tableHeight" :paging="true" :showSelection="true" :showIndex="true">
        <el-table-column prop="name" label="姓名" width="150" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="declareType" label="申报类型" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.fyDate?$moment(scope.row.fyDate).format('YYYY-MM'):''}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="declareStatus" label="申报状态" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.socialInfoVO[0].declareStatus}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="failCause" label="失败原因" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.socialInfoVO[0].failCause}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="productNick" label="方案名称" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-popover placement="left" width="400" trigger="hover">
              <!--              方案组成-->
              <dTable v-if="scope.row.parentSocialProductId!=null&&scope.row.parentSocialProductId!=''"
                      :data="scope.row.socialInfoVO[0]?scope.row.socialInfoVO[0].employeeSonChangeVOs:[]" :paging="false" :cancel-min-height="true">
                <el-table-column width="100" property="productName" label="子方案"></el-table-column>
                <el-table-column width="100" property="itemTypeName" label="险种">
                  <template slot-scope="scope2">
                    <span v-for="(item,index) in scope2.row.socialChangeItemVOs?scope2.row.socialChangeItemVOs:[]" :key="index">
                      {{item.itemTypeName}}<span v-show="scope2.row.socialChangeItemVOs&&scope2.row.socialChangeItemVOs.length>(index+1)">/</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column width="100" label="费用年月">{{ scope.row.fyDate?$moment(scope.row.fyDate).format('YYYY-MM'):''}}</el-table-column>
                <el-table-column width="100" property="declareStatus" label="申报状态"></el-table-column>
                <el-table-column width="100" property="failCause" label="失败原因"></el-table-column>
              </dTable>
              <!--              险种组成-->
              <dTable v-else
                      :data="scope.row.socialInfoVO[0]&&scope.row.socialInfoVO[0].employeeSonChangeVOs[0]&&scope.row.socialInfoVO[0].employeeSonChangeVOs[0].socialChangeItemVOs?scope.row.socialInfoVO[0].employeeSonChangeVOs[0].socialChangeItemVOs:[]"
                      :paging="false" :cancel-min-height="true">
                <el-table-column width="100" property="itemTypeName" label="险种"></el-table-column>
                <el-table-column width="100" label="费用年月">{{ scope.row.fyDate?$moment(scope.row.fyDate).format('YYYY-MM'):''}}</el-table-column>
                <el-table-column width="100" property="declareStatus" label="申报状态">{{scope.row.socialInfoVO[0].declareStatus}}</el-table-column>
                <el-table-column width="100" property="failCause" label="失败原因">{{scope.row.socialInfoVO[0].failCause}}</el-table-column>
              </dTable>
              <span class="text-blue" slot="reference">{{ scope.row.socialInfoVO[0].productNick}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="empTbBase" label="参保基数" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p v-if="scope.row.declareTypeCode==2"></p>
            <p v-else>{{ $global.milliFormat(scope.row.socialInfoVO[0].empTbBase)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="总合计" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p v-if="scope.row.declareTypeCode==2"></p>
            <p v-else>{{ scope.row.socialInfoVO[0].total}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="companyTotal" label="单位合计" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p v-if="scope.row.declareTypeCode==2"></p>
            <p v-else>{{ scope.row.socialInfoVO[0].companyTotal}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="employeeTotal" label="个人合计" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p v-if="scope.row.declareTypeCode==2"></p>
            <p v-else>{{ scope.row.socialInfoVO[0].employeeTotal}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createType" label="数据形成方式" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p v-if="scope.row.createType!=null && scope.row.createType=='页面新增'">{{'录入'}}</p>
            <p v-else-if="scope.row.createType!=null && (scope.row.createType=='Excel导入'||scope.row.createType=='手动导入') ">{{'导入'}}</p>
            <p v-else>{{scope.row.createType}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="productType" label="方案种类" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p v-if="scope.row.productType!=null && scope.row.productType=='五险合一'">{{'险种组成'}}</p>
            <p v-else-if="scope.row.productType!=null && scope.row.productType=='五险分开'">{{'方案组成'}}</p>
            <p v-else></p>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="创建时间" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):'' }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button class="mr-10" type="text" size="small" @click.stop="handleSocialView(scope.row)">查看</el-button>
            <div class="opt-btn-split"></div>
            <el-dropdown>
              <el-button type="text" size="small" @click.stop="">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changeSocialState(scope.row,1)">撤回</el-dropdown-item>
                <el-dropdown-item @click.native="changeSocialState(scope.row,7)">作废</el-dropdown-item>
                <el-dropdown-item @click.native="changeSocialState(scope.row,3)">提交</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </dTable>
    </div>
    <div v-show="tabActive==1">
      <div class="handle-btn">
        <div class="fr mr-25">
          <el-button size="small" type="primary" @click="changeAccfundState(null,3)">提交</el-button>
          <el-button class="bc-blue" size="small" @click="changeAccfundState(null,1)">撤回</el-button>
          <el-button class="bc-blue" size="small" @click="changeAccfundState(null,7)">作废</el-button>
          <el-button class="bc-blue" size="small" @click="exportAccfundData">导出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <dTable class="pb-20" @fetch="getAccfundTableData" @selection-change="getAccfundSelectRow" ref="accfundTable" :tableHeight="tableHeight" :paging="true" :showSelection="true" :showIndex="true">
        <el-table-column prop="name" label="姓名" width="150" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true" fixed="left"></el-table-column>
        <el-table-column prop="addrName" label="参保地" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="declareType" label="申报类型" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="fyDate" label="费用年月" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.fyDate?$moment(scope.row.fyDate).format('YYYY-MM'):''}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="declareStatus" label="申报状态" width="200" :show-overflow-tooltip="true">

        </el-table-column>
        <el-table-column prop="failCause" label="失败原因" width="200" :show-overflow-tooltip="true">

        </el-table-column>
        <el-table-column prop="productNick" label="方案名称" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="hover">
              <el-table :data="scope.row.itemBase">
                <el-table-column width="100" property="itemTypeName" label="险种"></el-table-column>
                <el-table-column width="100" label="费用年月">{{ scope.row.fyDate?$moment(scope.row.fyDate).format('YYYY-MM'):''}}</el-table-column>
                <el-table-column width="100" property="address" label="申报状态">{{ scope.row.declareStatus?scope.row.declareStatus:''}}</el-table-column>
                <el-table-column width="100" property="address" label="失败原因">{{ scope.row.failCause?scope.row.failCause:''}}</el-table-column>
              </el-table>
              <span class="text-blue" slot="reference">{{ scope.row.productNick}}</span>
              <!--              <el-button slot="reference">{{ scope.row.productNick}}</el-button>-->
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="empTbBase" label="参保基数" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{$global.milliFormat(scope.row.empTbBase)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="总合计" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{$global.milliFormat(scope.row.companyTotal + scope.row.employeeTotal)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="companyTotal" label="单位合计" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{$global.milliFormat(scope.row.companyTotal)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="employeeTotal" label="个人合计" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{$global.milliFormat(scope.row.employeeTotal)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createType" label="数据形成方式" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="productType" label="方案种类" width="200" :show-overflow-tooltip="true">险种组成</el-table-column>
        <el-table-column prop="createName" label="创建人" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="创建时间" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):'' }}</p>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button class="mr-10" type="text" size="small" @click.stop="handleAccfundView(scope.row)">查看</el-button>
            <div class="opt-btn-split"></div>
            <el-dropdown>
              <el-button type="text" size="small" @click.stop="">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="changeAccfundState(scope.row,1)">撤回</el-dropdown-item>
                <el-dropdown-item @click.native="changeAccfundState(scope.row,7)">作废</el-dropdown-item>
                <el-dropdown-item @click.native="changeAccfundState(scope.row,3)">提交</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </dTable>
    </div>
    </div>

    <!--查看-社保-->
    <el-drawer :visible.sync="social.drawer" :wrapperClosable="false" direction="rtl"
               :modal="false" custom-class="spl-detail-drawer">
      <template slot="title">
        <div>
          <span>{{rowViewInfo.employeeIntegrateSocialCheckVO?rowViewInfo.employeeIntegrateSocialCheckVO.empName:''}}({{rowViewInfo.employeeIntegrateSocialCheckVO?rowViewInfo.employeeIntegrateSocialCheckVO.idCard:''}})</span>
          <i v-if="rowViewInfo.employeeIntegrateSocialCheckVO!=null && rowViewInfo.employeeIntegrateSocialCheckVO.sex=='1'" class="ic-male"></i>
          <i v-else class="ic-female"></i>
        </div>
      </template>
      <div class="drawer-content social-drawer-content">
        <div class="title-row" v-if="rowViewInfo.employeeIntegrateSocialCheckVO">
          <el-row class="row">
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">姓名：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.empName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">证件号码：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.idCard}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">户口性质：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.residenceType}}</span></p>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">参保地：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.socialAddrName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">户籍市：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.addrCityName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">参保户口性质：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.socialResidenceType}}</span></p>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">申报类型：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.changeTypeName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">方案名称：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.productNick}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">基数：</label><span class="value">{{$global.milliFormat(rowViewInfo.employeeIntegrateSocialCheckVO.base)}}</span></p>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">费用年月：</label><span class="value">{{rowViewInfo.employeeIntegrateSocialCheckVO.fyDate}}</span></p>
            </el-col>
            <el-col :span="spanRow" v-for="(item,index) in rowViewInfo.suppInfos" :key="index" style="margin-bottom: 15px;">
              <p class="display-flex"><label class="text">{{item.columName}}：</label><span class="value">{{item.columValue}}</span></p>
            </el-col>
          </el-row>
        </div>
        <div class="type-list" v-if="rowViewInfo.allItems">
          <dTable ref="socialTable2" :data="rowViewInfo.allItems" :spanMethod="socialSpanMethod" :tableHeight="'280px'" style="margin-top: 0;"
                  :showEmptyAll="true"
                  :cancelMinHeight='true' :paging="false"
                  :showBottom="true" :showIndex='false'
                  :showSelection='false'>
            <el-table-column v-if="rowViewInfo.employeeIntegrateSocialCheckVO.parentProductId!=null&&rowViewInfo.employeeIntegrateSocialCheckVO.parentProductId!=''" prop="childProductName"
                             label="子方案名称" min-width="180"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="itemName" label="缴纳险种" min-width="180" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column label="单位" header-align="center" class-name="border-l border-b-none">
              <el-table-column prop="compBase" label="单位基数" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{$global.milliFormat(scope.row.compBase)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="compRatio" label="单位比例" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.compRatio | filteraccMul(100)}}%</p>
                </template>
              </el-table-column>
              <el-table-column prop="compBaseMax" label="单位费用" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.compBase | filterAmount(scope.row.compRatio,scope.row.compPrecision)}}</p>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="个人" header-align="center" class-name="border-l border-r border-b-none">
              <el-table-column prop="empBase" label="个人基数" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{$global.milliFormat(scope.row.empBase)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="empRatio" label="个人比例" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.empRatio | filteraccMul(100)}}%</p>
                </template>
              </el-table-column>
              <el-table-column prop="compBaseMax" label="个人费用" width="120" class-name="border-l border-r" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.empBase | filterAmount(scope.row.empRatio,scope.row.empPrecision)}}</p>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="payFrequencyName" label="合计" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p>{{scope.row | filterRowSumAmount}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="payFrequencyName" label="申报状态" min-width="120" :show-overflow-tooltip="true">{{rowViewInfo.employeeIntegrateSocialCheckVO.sonProductVOS[0].declareStatusName}}
            </el-table-column>

            <template slot="bottom-btns">
              <div>
                <span class="detail detail1">社保合计：{{rowViewInfo.allItems | filterAllSumAmount}}</span>
                <span class="detail">个人合计: {{rowViewInfo.allItems | filterEmpSumAmount}}</span>
                <span class="detail">单位合计: {{rowViewInfo.allItems | filterCompSumAmount}}</span>
              </div>
            </template>
          </dTable>
        </div>
      </div>
    </el-drawer>
    <!--查看-社保-->

    <!--查看-公积金-->
    <el-drawer :visible.sync="accfund.drawer" :wrapperClosable="false" direction="rtl"
               :modal="false" custom-class="spl-detail-drawer">
      <template slot="title">
        <div>
          <span>{{rowViewInfo.employeeIntegrateAccfundCheckVO?rowViewInfo.employeeIntegrateAccfundCheckVO.empName:''}}({{rowViewInfo.employeeIntegrateAccfundCheckVO?rowViewInfo.employeeIntegrateAccfundCheckVO.idCard:''}})</span>
          <i v-if="rowViewInfo.employeeIntegrateAccfundCheckVO!=null && rowViewInfo.employeeIntegrateAccfundCheckVO.sex=='1'" class="ic-male"></i>
          <i v-else class="ic-female"></i>
        </div>
      </template>
      <div class="drawer-content social-drawer-content">
        <div class="title-row" v-if="rowViewInfo.employeeIntegrateAccfundCheckVO">
          <el-row class="row">
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">姓名：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.empName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">证件号码：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.idCard}}</span></p>
            </el-col>
            <!--            <el-col :span="spanRow">-->
            <!--              <p class="display-flex"><label class="text">户口性质：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.residenceType}}</span></p>-->
            <!--            </el-col>-->
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">参保地：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.accfundAddrName}}</span></p>
            </el-col>
          </el-row>
          <!--<el-row class="row">-->
          <!--            <el-col :span="spanRow">-->
          <!--              <p class="display-flex"><label class="text">参保户口性质：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.accfundResidenceType}}</span></p>-->
          <!--            </el-col>-->
          <!--</el-row>-->
          <el-row class="row">
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">户籍市：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.addrCityName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">申报类型：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.changeTypeName}}</span></p>
            </el-col>
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">方案名称：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.productNick}}</span></p>
            </el-col>
          </el-row>
          <el-row class="row">
            <!--            <el-col :span="spanRow">-->
            <!--              <p class="display-flex"><label class="text">基数：</label><span class="value">{{$global.milliFormat(rowViewInfo.employeeIntegrateAccfundCheckVO.base)}}</span></p>-->
            <!--            </el-col>-->
            <el-col :span="spanRow">
              <p class="display-flex"><label class="text">费用年月：</label><span class="value">{{rowViewInfo.employeeIntegrateAccfundCheckVO.fyDate}}</span></p>
            </el-col>
            <el-col :span="spanRow" v-for="(item,index) in rowViewInfo.suppInfos" :key="index" style="margin-bottom: 15px;">
              <p class="display-flex"><label class="text">{{item.columName}}：</label><span class="value">{{item.columValue}}</span></p>
            </el-col>
          </el-row>
        </div>
        <div class="type-list" v-if="rowViewInfo.employeeIntegrateAccfundCheckVO && rowViewInfo.employeeIntegrateAccfundCheckVO.items">
          <dTable ref="socialTable2" :data="rowViewInfo.employeeIntegrateAccfundCheckVO.items" :tableHeight="'280px'" style="margin-top: 0;"
                  :spanMethod="accfundSpanMethod"
                  :cancelMinHeight='true' :showEmptyAll="true" :paging="false" :showBottom="true"
                  :showIndex='false'
                  :showSelection='false'>
            <el-table-column prop="itemName" label="缴纳险种" min-width="180" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column label="单位" header-align="center" class-name="border-l border-b-none">
              <el-table-column prop="compBase" label="单位基数" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{$global.milliFormat(scope.row.compBase)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="compRatio" label="单位比例" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.compRatio | filteraccMul(100)}}%</p>
                </template>
              </el-table-column>
              <el-table-column prop="compBaseMax" label="单位费用" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.compBase | filterAmount(scope.row.compRatio,scope.row.compPrecision)}}</p>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="个人" header-align="center" class-name="border-l border-r border-b-none">
              <el-table-column prop="empBase" label="个人基数" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{$global.milliFormat(scope.row.empBase)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="empRatio" label="个人比例" width="120" class-name="border-l" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.empRatio | filteraccMul(100)}}%</p>
                </template>
              </el-table-column>
              <el-table-column prop="compBaseMax" label="个人费用" width="120" class-name="border-l border-r" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p>{{scope.row.empBase | filterAmount(scope.row.empRatio,scope.row.empPrecision)}}</p>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="payFrequencyName" label="合计" min-width="100" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p>{{scope.row | filterRowSumAmount}}</p>
              </template>
            </el-table-column>
            <el-table-column label="申报状态" min-width="120" :show-overflow-tooltip="true">
              {{rowViewInfo.employeeIntegrateAccfundCheckVO.declearStatusName}}
            </el-table-column>

            <template slot="bottom-btns">
              <div>
                <span class="detail detail1">公积金合计：{{rowViewInfo.employeeIntegrateAccfundCheckVO.items | filterAllSumAmount}}</span>
                <span class="detail">个人合计: {{rowViewInfo.employeeIntegrateAccfundCheckVO.items | filterEmpSumAmount}}</span>
                <span class="detail">单位合计: {{rowViewInfo.employeeIntegrateAccfundCheckVO.items | filterCompSumAmount}}</span>
              </div>
            </template>
          </dTable>
        </div>
      </div>
    </el-drawer>
    <!--查看-公积金-->
  </div>
</template>

<script>
  import dTable from '../../components/common/table'
  import splTab from '../../components/common/spl-tab'
  import addrSelector from '../../components/common/addrSelector'
  import {accMul, calFee, getAccfundAmount, getSocialCyleAmount, accAdd2, toFixedValueByCode} from '../../utils/socialAccfundProduct'

  export default {
    components: {dTable, splTab, addrSelector},
    data() {
      return {
        pathData: [
          {name: '社保公积金'},
          {name: '参保管理'}
        ],
        tabs: ['社保', '公积金'],
        tabActive: 0,
        social: {
          allAddr: [],
          drawer: false,
          selectRows: []
        },
        accfund: {
          allAddr: [],
          drawer: false,
          selectRows: []
        },
        spanRow: 8,
        rowViewInfo: {},
        search: {
          addrVal: '',
          addrId: '',
          costMonth: '',
          declareStatus: [],
          declareType: [],
          empIdCards: '',
          setEmpIdCards: [],
          searchIdCardsLength: 0,
          searchWord: ''
        },
        showSelectForm: false,
        mainLoading: {
          isLoading: false,
          mainLoadingText: '正在导出...'
        },
      }
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 400 + 'px'
      }
    },
    created() {
      this.$nextTick(() => {
        this.getSocialTableData()
        this.getAccfundTableData()
        this.getAddr(1)
        this.getAddr(2)
      })
    },
    watch: {
      'search.empIdCards'(newValue, oldValue) {
        var obj = this.$global.getIdCardRow(this.search.empIdCards)
        this.search.searchIdCardsLength = obj.num
        this.search.setEmpIdCards = obj.value
      }
    },
    methods: {
      getSocialTableData() {
        var params = []
        params.push({property: 'loadData', value: '1'})
        if (this.search.addrId) {
          params.push({property: 'addrId', value: this.search.addrId})
        }
        if (this.search.costMonth) {
          params.push({property: 'fyDate', value: this.search.costMonth})
        }
        if (this.search.declareStatus.length > 0) {
          params.push({property: 'declareStatus_m', value: this.search.declareStatus})
        }
        if (this.search.declareType.length > 0) {
          params.push({property: 'declareType_m', value: this.search.declareType})
        }
        if (this.search.setEmpIdCards != null && this.search.setEmpIdCards.length > 0 && this.showSelectForm) {
          params.push({property: 'idCardArray', value: this.search.setEmpIdCards})
        }
        if (this.search.searchWord) {
          params.push({property: 'searchWord', value: this.search.searchWord})
        }
        this.$refs.socialTable.fetch({
          query: params,
          method: 'post',
          url: '/api/employee/socailList'
        })
      },
      getAccfundTableData() {
        var params = []
        if (this.search.addrId) {
          params.push({property: 'addrId', value: this.search.addrId})
        }
        if (this.search.costMonth) {
          params.push({property: 'fyDate', value: this.search.costMonth})
        }
        if (this.search.declareStatus.length > 0) {
          params.push({property: 'declareStatus_m', value: this.search.declareStatus})
        }
        if (this.search.declareType.length > 0) {
          params.push({property: 'declareType_m', value: this.search.declareType})
        }
        if (this.search.setEmpIdCards != null && this.search.setEmpIdCards.length > 0) {
          params.push({property: 'idCardArray', value: this.search.setEmpIdCards})
        }
        if (this.search.searchWord) {
          params.push({property: 'searchWord', value: this.search.searchWord})
        }
        this.$refs.accfundTable.fetch({
          query: params,
          method: 'post',
          url: '/api/employee/accfundList'
        })
      },
      handleSocialView(row) {
        let fyDate = row.fyDate ? this.$moment(row.fyDate).format('YYYY-MM') : ''
        this.$http({
          url: '/api/employee/employeeIntergrateSocialCheck/social/' + row.employeeId + '/' + row.addrId + '/' + row.socialInfoVO[0].uuid + '?fyDate=' + fyDate + '&parentSocialProductId=' +
            (row.parentSocialProductId == null ? '' : row.parentSocialProductId),
          method: 'GET'
        }).then(({data}) => {
          let result = data.data[0];
          this.rowViewInfo = result
          var allItems = []
          for (var i in result.employeeIntegrateSocialCheckVO.sonProductVOS) {
            for (var j in result.employeeIntegrateSocialCheckVO.sonProductVOS[i].items) {
              result.employeeIntegrateSocialCheckVO.sonProductVOS[i].items[j].childProductName = result.employeeIntegrateSocialCheckVO.sonProductVOS[i].childProductName
              allItems.push(result.employeeIntegrateSocialCheckVO.sonProductVOS[i].items[j])
            }
          }
          this.rowViewInfo.allItems = allItems
          this.social.drawer = true
        })
      },
      handleAccfundView(row) {
        this.$http({
          url: '/api/employee/employeeIntergrateAccfundCheck/accfund/' + row.uuid,
          method: 'GET'
        }).then(({data}) => {
          let result = data.data[0];
          this.rowViewInfo = result
          this.accfund.drawer = true
        })
      },
      getSocialSelectRow(rows) {
        this.social.selectRows = rows
      },
      getAccfundSelectRow(rows) {
        this.accfund.selectRows = rows
      },
      socialSpanMethod({row, column, rowIndex, columnIndex}) {
        // console.info(row)
        // console.info(column)
        // console.info(rowIndex)
        // console.info(columnIndex)
        let that = this;
        let allItems = that.rowViewInfo.allItems;
        if (that.rowViewInfo.employeeIntegrateSocialCheckVO.parentProductId != null && that.rowViewInfo.employeeIntegrateSocialCheckVO.parentProductId != '') {
          if (columnIndex === 0 || columnIndex === 9) {
            var start = -1
            var end = -1
            for (let i = 0; i < allItems.length; i++) {
              if (start > 0) {
                continue;
              }
              if (allItems[i].childProductName == row.childProductName) {
                start = i
                for (let j = 0; j < allItems.length; j++) {
                  if (allItems[j].childProductName == row.childProductName && end < j) {
                    end = j
                  }
                }
              }
            }
            if (start == end) {
              return [1, 1];
            }
            if (rowIndex == start) {
              return [end - start + 1, 1]
            }
            if (end != start && rowIndex <= end) {
              return [0, 0];
            }
          }
        } else {
          if (columnIndex === 8) {
            if (rowIndex === 0) {
              return {
                rowspan: allItems.length,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
      },
      accfundSpanMethod({row, column, rowIndex, columnIndex}) {
        // console.info(row)
        // console.info(column)
        // console.info(rowIndex)
        // console.info(columnIndex)
        let that = this;
        let allItems = that.rowViewInfo.employeeIntegrateAccfundCheckVO.items;
        if (columnIndex === 8) {
          if (rowIndex === 0) {
            return {
              rowspan: allItems.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      changeSocialState(row, newState) {
        var selectRows = []
        if (row == null) {
          selectRows = this.social.selectRows
        } else {
          selectRows.push(row)
        }
        if (selectRows == null || selectRows.length <= 0) {
          this.$message.warning('请选择需要操作的数据')
          return
        }

        var changes = []
        for (let i = 0; i < selectRows.length; i++) {
          var row = selectRows[i]
          if (newState == 3 && row.socialInfoVO[0].changeDeclareStatus != 1) { // 提交
            this.$message.error('请选择未提交申报的数据进行操作')
            return
          }
          if (newState == 1 && row.socialInfoVO[0].changeDeclareStatus != 3) { // 撤回
            this.$message.error('请选择已提交申报-待申报的数据进行操作')
            return
          }
          if (newState == 7 && row.socialInfoVO[0].changeDeclareStatus != 1) { // 作废
            this.$message.error('请选择未提交申报的数据进行操作')
            return
          }
          changes.push({
            id: row.socialInfoVO[0].id,
            employeeId: row.employeeId,
            idCard: row.idCard,
            empName: row.name,
            productName: row.socialInfoVO[0].productName,
            tbDate: row.tbDate,
            fyDate: row.fyDate,
            parentSocialProductId: row.parentSocialProductId,
            changeType: row.declareTypeCode,
            socialAddrId: row.addrId,
            socialAddrName: row.addrName,
            optrCompId: row.oprCompId,
            lastChangeId: row.socialInfoVO[0].lastChangeId,
            declareStatus: row.socialInfoVO[0].changeDeclareStatus,
            customerId: row.siteOneId,
            siteId: row.siteTwoId,
            socialProductId: row.socialInfoVO[0].socialProductId,
            createTime: row.createTime
          })
        }
        this.$http({
          url: '/api/employee/social/updateStatus',
          method: 'POST',
          data: {
            changes: changes,
            status: newState
          }
        }).then(({data}) => {
          this.$message.success('状态修改成功')
          this.getSocialTableData()
        })
      },
      changeAccfundState(row, newState) {
        var selectRows = []
        if (row == null) {
          selectRows = this.accfund.selectRows
        } else {
          selectRows.push(row)
        }
        if (selectRows == null || selectRows.length <= 0) {
          this.$message.warning('请选择需要操作的数据')
          return
        }

        var changes = []
        for (let i = 0; i < selectRows.length; i++) {
          var row = selectRows[i]
          if (newState == 3 && row.declareStatusCode != 1) { // 提交
            this.$message.error('只有未提交申报的记录，才允许提交')
            return
          }
          if (newState == 1 && row.declareStatusCode != 3) { // 撤回
            this.$message.error('只有已提交申报-待申报的记录，才允许撤回')
            return
          }
          if (newState == 7 && row.declareStatusCode != 1) { // 作废
            this.$message.error('只有未提交申报的记录，才允许作废')
            return
          }
          changes.push({
            id: row.changeId,
            employeeId: row.employeeId,
            idCard: row.idCard,
            empName: row.name,
            accfundAddrId: row.addrId,
            accfundAddrName: row.addrName,
            productName: row.accfundProductName,
            optrCompId: row.oprCompId,
            tbDate: row.tbDate,
            fyDate: row.fyDate,
            accfundProductId: row.productId,
            lastChangeId: row.lastChangeId,
            changeType: row.declareTypeCode,
            declareStatus: row.declareStatusCode,
            customerId: row.siteOneId,
            siteId: row.siteTwoId
          })
        }
        this.$http({
          url: '/api/employee/accfund/updateStatus',
          method: 'POST',
          data: {
            changes: changes,
            status: newState
          }
        }).then(({data}) => {
          this.$message.success('状态修改成功')
          this.getAccfundTableData()
        })
      },

      exportSocialData() {
        let that = this;
        var params = {
          addrId: '',
          fyDate: '',
          declareStatus_m: '',
          declareType_m: ''
        }
        if (that.search.addrId) {
          params.addrId = that.search.addrId
        }
        if (that.search.costMonth) {
          params.fyDate = that.search.costMonth
        }
        if (that.search.declareStatus.length > 0) {
          var declareStatus = ''
          that.search.declareStatus.forEach(item => {
            declareStatus = declareStatus + ',' + item
          })
          params.declareStatus_m = declareStatus
        }
        if (that.search.declareType.length > 0) {
          var declareType = ''
          that.search.declareType.forEach(item => {
            declareType = declareType + ',' + item
          })
          params.declareType_m = declareType
        }
        if (that.search.setEmpIdCards != null && that.search.setEmpIdCards.length > 0) {
          params.idCardArray = that.search.setEmpIdCards
        }
        if (that.search.searchWord) {
          params.searchWord = that.search.searchWord
        }
        let selectRows = that.social.selectRows;
        var keys = [];
        if (selectRows != null && selectRows.length > 0) {
          for (let i = 0; i < selectRows.length; i++) {
            keys.push(selectRows[i].key)
          }
          params.ids = keys
        }
        that.mainLoading.isLoading = true
        that.mainLoading.mainLoadingText = '正在导出...'
        that.$downloadFile(
          '/api/employee/socialdeclare/export',
          'post',
          params,
          that.$global.EXCEL,
          '',
          function () {
            that.mainLoading.isLoading = false
          }
        )
      },

      exportAccfundData(switchValue) {
        let that = this;
        var params = {
          addrId: '',
          fyDate: '',
          declareStatus_m: '',
          declareType_m: ''
        }
        if (that.search.addrId) {
          params.addrId = that.search.addrId
        }
        if (that.search.costMonth) {
          params.fyDate = that.search.costMonth
        }
        if (that.search.declareStatus.length > 0) {
          var declareStatus = ''
          that.search.declareStatus.forEach(item => {
            declareStatus = declareStatus + ',' + item
          })
          params.declareStatus_m = declareStatus
        }
        if (that.search.declareType.length > 0) {
          var declareType = ''
          that.search.declareType.forEach(item => {
            declareType = declareType + ',' + item
          })
          params.declareType_m = declareType
        }
        if (that.search.setEmpIdCards != null && that.search.setEmpIdCards.length > 0) {
          params.idCardArray = that.search.setEmpIdCards
        }
        if (that.search.searchWord) {
          params.searchWord = that.search.searchWord
        }
        let selectRows = that.accfund.selectRows;
        var ids = [];
        if (selectRows != null && selectRows.length > 0) {
          for (let i = 0; i < selectRows.length; i++) {
            ids.push(selectRows[i].changeId)
          }
          params.ids = ids
        }
        that.mainLoading.isLoading = true
        that.mainLoading.mainLoadingText = '正在导出...'
        that.$downloadFile(
          '/api/employee/accfunddeclare/export',
          'post',
          params,
          that.$global.EXCEL,
          '',
          function () {
            that.mainLoading.isLoading = false
          }
        )
      },

      // 获取参保地
      getAddr(type) {
        this.$http({
          url: '/api/socialAccfund/addr',
          method: 'get',
          params: {type: type}
        }).then(({data}) => {
          if (type == 1) {
            this.social.allAddr = data
          } else {
            this.accfund.allAddr = data
          }
        })
      },
      getAddrId(item) {
        console.info(item)
        this.search.addrId = item.id
      },
      // 重置搜索框
      resetSelectForm() {
        this.search.empIdCards = ''
        this.search.setEmpIdCards = ''
        this.search.searchIdCardsLength = 0
      },
    },
    filters: {
      filterAmount(base, feeRatio, calAccuCode) {
        let res = calFee(base, feeRatio, calAccuCode)
        return res
      },
      filterRowSumAmount(row) {
        let res1 = calFee(row.compBase, row.compRatio, row.compPrecision)
        let res2 = calFee(row.empBase, row.empRatio, row.empPrecision)
        let accAdd = accAdd2(res1, res2)
        return accAdd
      },
      filterAllSumAmount(rows) {
        if (rows == null || rows == undefined) {
          return 0
        }
        var compSum = 0
        var empSum = 0
        var compTotalPrecision = ''
        var empTotalPrecision = ''
        var totalPrecision = ''
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          totalPrecision = row.totalPrecision
          compTotalPrecision = row.compTotalPrecision
          let res1 = calFee(row.compBase, row.compRatio, row.compPrecision)
          empTotalPrecision = row.empTotalPrecision
          let res2 = calFee(row.empBase, row.empRatio, row.empPrecision)
          compSum = accAdd2(compSum, res1)
          empSum = accAdd2(empSum, res2)
        }
        compSum = toFixedValueByCode(compSum, compTotalPrecision)
        empSum = toFixedValueByCode(empSum, empTotalPrecision)
        let accAdd = accAdd2(compSum, empSum);
        return toFixedValueByCode(accAdd, totalPrecision)
      },
      filterCompSumAmount(rows) {
        if (rows == null || rows == undefined) {
          return 0
        }
        var sum = 0
        var compTotalPrecision = ''
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          compTotalPrecision = row.compTotalPrecision
          let res1 = calFee(row.compBase, row.compRatio, row.compPrecision)
          sum = accAdd2(sum, res1)
        }
        console.info(111)
        return toFixedValueByCode(sum, compTotalPrecision)
      },
      filterEmpSumAmount(rows) {
        if (rows == null || rows == undefined) {
          return 0
        }
        var sum = 0
        var empTotalPrecision = 0
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i]
          empTotalPrecision = row.empTotalPrecision
          let res2 = calFee(row.empBase, row.empRatio, row.empPrecision)
          sum = accAdd2(sum, res2)
        }
        return toFixedValueByCode(sum, empTotalPrecision)
      },
      filteraccMul(value1, value2) {
        let mul = accMul(value1, value2)
        // mul = this.$mloabl.milliFormat(mul);
        return mul
      },
      filterAdd(value1, value2) {
        let mul = accAdd2(value1, value2)
        // mul = this.$mloabl.milliFormat(mul);
        return mul
      }
    }
  }
</script>

<style scoped lang="less">
  .content {
    .handle-btn {
      height: 50px;
      background: #f2f2f2;
      line-height: 50px;
    }

    .search-l {
      width: 25%;
      max-width: 750px;
      min-width: 600px;
    }

    .search-l-input {
      min-width: 370px;
    }

    /deep/ .el-table {
      margin-top: 0;
    }
  }
  .social-drawer-content {
    /deep/.pal-pagination{
      border-top: none;
    }
  }
</style>
