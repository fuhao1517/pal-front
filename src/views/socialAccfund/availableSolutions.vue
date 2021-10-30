<template>
  <div class="spl-container">
    <breadcrumb :data="pathData"></breadcrumb>
    <splTab :tabs="tabs" v-model="active" @changeTab="changeTab"></splTab>
    <div v-show="active==0">
      <div class="search-row display-flex">
        <span class="ml-20 label">参保地：</span>
        <addrSelector v-model="social.addrVal" :addrArr="social.allAddr"></addrSelector>
        <el-button size="small" type="primary" class="ml-20 w-60" @click="getSocialTableData">查询</el-button>
        <span class="ml-30 label">社保常用地：</span>
        <div class="flex1" ref="socialUsedWidth">
          <span class="tag" :class="{active:index===social.userActive}" v-for="(item,index) in social.usedAddr"
                :key="item.id" @click="selectUsed('social', index)">{{item.name}}</span>
        </div>
      </div>
      <div>
        <dTable @fetch="getSocialTableData" ref="socialTable" style="margin-top: 0;" :tableHeight="tableHeight"
                :showIndex='true' :showSelection='false'>
          <el-table-column prop="addressName" label="参保地" width="180" header-align="center" align="left" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="productName" label="方案名称" width="140" header-align="center" align="left" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="startDate" label="生效时间" width="200" header-align="center" align="left" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{ scope.row.startDate?$moment(scope.row.startDate).format('YYYY-MM-DD'):''}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="zyCycleCode" label="增员投保周期" width="150" header-align="center" align="left" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="jyCycleCode" label="减员投保周期" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="tjCycleCode" label="调基投保周期" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="isComb" label="组成方式" min-width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{ scope.row.isComb==0?'险种组合':'方案组合' }}</p>
            </template>
          </el-table-column>

          <el-table-column prop="leaveDate" label="险种" min-width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover placement="right" width="auto" trigger="hover">
                <dTable :data="scope.row.policySocialItemVos" :cancelMinHeight="true" :showSelection="false" :showIndex="false" :paging="false">
                  <el-table-column min-width="120" property="itemTypeName" label="险种" :show-overflow-tooltip="true"></el-table-column>
                  <el-table-column label="单位" header-align="center" class-name="border-l border-b-none">
                    <el-table-column min-width="150" property="address" label="基数" class-name="border-l">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.compBaseMin}}/{{scope2.row.compBaseMax}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column width="120" property="compRatioMin" label="比例" class-name="border-l">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.compRatioMin | filteraccMul(100)}}%</p>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="个人" header-align="center" class-name="border-l border-b-none">
                    <el-table-column min-width="150" property="address" label="基数" class-name="border-l">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.empBaseMin}}/{{scope2.row.empBaseMax}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column width="120" property="empRatioMin" label="比例" class-name="border-l">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.empRatioMin | filteraccMul(100)}}%</p>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </dTable>
                <el-button type="text" class="text-blue" slot="reference">详情</el-button>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column prop="zyEnddayStr" label="增员截止日" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="jyEnddayStr" label="减员截止日" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="bjEnddayStr" label="补缴截止日" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="text-blue" @click="handleSocialView(scope.row)">查看</el-button>
              <div class="opt-btn-split"></div>
              <el-button type="text" size="small" class="text-blue" @click="getSuppRuleTableData(scope.row,1)">补缴规则
              </el-button>
            </template>
          </el-table-column>
        </dTable>
      </div>
    </div>
    <div v-show="active==1">
      <div class="search-row display-flex">
        <span class="ml-20 label">参保地：</span>
        <addrSelector v-model="accfund.addrVal" :addrArr="accfund.allAddr"></addrSelector>
        <el-button size="small" type="primary" class="ml-20 w-60" @click="getAccfundTableData">查询</el-button>
        <span class="ml-30 label">公积金常用地：</span>
        <div class="flex1" ref="accfundUsedWidth">
          <span class="tag" :class="{active:index===accfund.userActive}" v-for="(item,index) in accfund.usedAddr"
                :key="item.id" @click="selectUsed('accfund', index)">{{item.name}}</span>
        </div>
      </div>
      <div>
        <dTable @fetch="getAccfundTableData" ref="accfundTable" style="margin-top: 0;" :tableHeight="tableHeight"
                :showIndex='true' :showSelection='false'>
          <el-table-column prop="addressName" label="参保地" width="180" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="productName" label="方案名称" width="140" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="startDate" label="生效时间" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p>{{ scope.row.startDate?$moment(scope.row.startDate).format('YYYY-MM-DD'):''}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="zyCycleCode" label="增员投保周期" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="jyCycleCode" label="减员投保周期" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="tjCycleCode" label="调基投保周期" width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="isComb" label="组成方式" min-width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <!--              <p>{{ scope.row.isComb==0?'险种组合':'方案组合' }}</p>-->
              <p>险种组合</p>
            </template>
          </el-table-column>
          <el-table-column prop="leaveDate" label="险种" min-width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="800"
                trigger="hover">
                <el-table :data="scope.row.items">
                  <el-table-column width="100" property="itemTypeName" label="险种"></el-table-column>
                  <el-table-column label="单位" class-name="border-l border-b-none">
                    <el-table-column width="200" property="address" label="基数">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.compBaseMin}}/{{scope2.row.compBaseMax}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column width="200" property="compRatioMin" label="比例">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.compRatioMin | filteraccMul(100)}}%</p>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="个人" class-name="border-l border-b-none">
                    <el-table-column width="200" property="address" label="基数">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.empBaseMin}}/{{scope2.row.empBaseMax}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column width="200" property="empRatioMin" label="比例">
                      <template slot-scope="scope2">
                        <p>{{scope2.row.empRatioMin | filteraccMul(100)}}%</p>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
                <el-button type="text" class="text-blue" slot="reference">详情</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="tbBaseLimit" label="参保基数" width="150" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <p v-if="scope.row.tbBaseLimit=='70006001'">必须整数</p>
              <p v-else-if="scope.row.tbBaseLimit=='70006002'">允许小数</p>
            </template>
          </el-table-column>
          <el-table-column prop="zyEnddayStr" label="增员截止日" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="jyEnddayStr" label="减员截止日" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="bjEnddayStr" label="补缴截止日" min-width="150" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="text-blue" @click="handleAccfundView(scope.row)">查看</el-button>
              <div class="opt-btn-split"></div>
              <el-button type="text" size="small" class="text-blue" @click="getSuppRuleTableData(scope.row,2)">补缴规则
              </el-button>
            </template>
          </el-table-column>
        </dTable>
      </div>
    </div>

    <!--查看-社保-->
    <el-drawer
      title="社保方案查看"
      :visible.sync="social.drawer" :wrapperClosable="false"
      direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <div class="drawer-content">
        <div class="title-row">
          <el-row class="row" type="flex">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">参保地：</label><span
                class="value">{{rowData.base.addressName}}</span></p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">方案名称：</label><span
                class="value">{{rowData.base.productName}}</span></p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">户口性质：</label><span
                class="value">{{rowData.base.hukouTypeName}}</span></p>
            </el-col>
          </el-row>
          <el-row class="row" type="flex" justify="space-around">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">投保周期：</label>
                <span class="value"><span
                  class="p-relative">{{rowData.base.zyCycleCode}}<i class="ic-type ic-increase"></i></span></span>
              </p>
            </el-col>
            <el-col :span="rowSpan">

              <p class="display-flex"><label class="text p-relative text2">{{rowData.base.jyCycleCode}} <i class="ic-type ic-attrition"></i></label></p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text p-relative text2">{{rowData.base.tjCycleCode}}<i class="ic-type ic-adjust"></i></label></p>
            </el-col>
          </el-row>
          <el-row class="row" type="flex" justify="space-around">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">总合计精度：</label>
                <span class="value">{{rowData.base.calAccuCode}}</span>
              </p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">单位合计精度：</label>
                <span class="value">{{rowData.base.compCalAccuCode}}</span>
              </p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">个人合计精度：</label>
                <span class="value">{{rowData.base.empCalAccuCode}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row class="row" type="flex" justify="space-around">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">参保基数：</label>
                <span class="value">{{rowData.base.tbBaseLimit}}</span>
              </p>
            </el-col>
            <el-col :span="rowSpan"></el-col>
            <el-col :span="rowSpan"></el-col>
          </el-row>
        </div>
        <div class="type-list">
          <el-collapse v-model="social.collapseActive">
            <div class="list" v-for="(item,index) in social.collapseList" :key="item.id">
              <el-collapse-item class="el-collapse-item" :name="index">

                <template slot="title">
                  <div class="title clearfix">
                    <i v-if="item.isActive==0 && item.expired==0" class="status ic-effect"></i>
                    <i v-else class="status ic-invalid"></i>
                    <p class="fl">
                      <span>参保地：</span><span class="value value1">{{item.addressName}}</span>
                    </p>
                    <p class="fl">
                      <span>户口性质：</span><span class="value value2">{{item.hukouTypeName}}</span>
                    </p>
                    <p class="fl">
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 方案有效期间：</span><span
                      class="value value3">{{item.startDate?$moment(item.startDate).format('YYYY-MM-DD'):''}}~{{item.endDate?$moment(item.endDate).format('YYYY-MM-DD'):''}}</span>
                    </p>
                    <p class="toggle-detail">展开详情 <i class="ic-toggle-detail"></i></p>
                  </div>
                </template>
                <div class="table-content">
                  <dTable ref="socialTable2" :data="item.policySocialItemVos" :tableHeight="'280px'" style="margin-top: 0;"
                          :showIndex='false' :showSelection='false' :paging="false" :showBottom="true">
                    <el-table-column prop="subProductName" label="子方案" min-width="180" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="itemTypeName" label="险种类别" min-width="180" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="itemName" label="险种名称" min-width="180" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="maleAgeMin" label="最小年龄" width="100" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="maleAgeMax" label="男最大年龄" width="120" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="femaleAgeMax" label="女最大年龄" width="120" :show-overflow-tooltip="true"></el-table-column>

                    <el-table-column label="单位" header-align="center" class-name="border-l border-b-none">
                      <el-table-column prop="compCalAccuCodeName" label="计算精度" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="compBaseMin" label="最低基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="compBaseMax" label="最高基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="compRatioMin" label="比例" width="120" class-name="border-l" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <p>{{scope.row.compRatioMin | filteraccMul(100)}}%</p>
                        </template>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="个人" header-align="center" class-name="border-l border-r border-b-none">
                      <el-table-column prop="empCalAccuCodeName" label="计算精度" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="empBaseMin" label="最低基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="empBaseMax" label="最高基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="empRatioMin" label="比例" width="120" class-name="border-l border-r" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <p>{{scope.row.empRatioMin | filteraccMul(100)}}%</p>
                        </template>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column prop="payFrequencyName" label="费用频率" width="100" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="fixMonth" label="指定费用月份" width="120" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="ruleTypeName" label="费用规则" width="120" :show-overflow-tooltip="true"></el-table-column>

                    <el-table-column prop="fySettleMonth" label="社保周期首月指定" width="180" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="perMonthAmt" label="每月收费额（元/人/月）" width="180" :show-overflow-tooltip="true"></el-table-column>
                    <template slot="bottom-btns">
                      <div>
                        <span class="detail detail1">各频率缴费金额：每月: {{item.policySocialItemVos | filterSocialCyleAmount(10008001)}}</span>
                        <span class="detail">每年: {{item.policySocialItemVos | filterSocialCyleAmount(10008004)}}</span>
                        <span class="detail">一次性: {{item.policySocialItemVos | filterSocialCyleAmount(10008005)}}</span>
                        <span class="detail">合计: {{item.policySocialItemVos | filterSocialCyleAmount(0)}}</span>
                      </div>
                    </template>
                  </dTable>
                </div>

              </el-collapse-item>
            </div>

          </el-collapse>
        </div>
      </div>
    </el-drawer>
    <!--查看-社保-->

    <!--查看-公积金-->
    <el-drawer
      title="公积金方案查看"
      :visible.sync="accfund.drawer" :wrapperClosable="false"
      direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <div class="drawer-content">
        <div class="title-row">
          <el-row class="row" type="flex">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">参保地：</label><span
                class="value">{{rowData.base.addressName}}</span></p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">方案名称：</label><span
                class="value">{{rowData.base.productName}}</span></p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">参保基数：</label><span
                class="value">{{rowData.base.tbBaseLimit}}</span></p>
            </el-col>
          </el-row>
          <el-row class="row" type="flex" justify="space-around">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">投保周期：</label>
                <span class="value"><span
                  class="p-relative">{{rowData.base.jyCycleCode}}<i class="ic-type ic-attrition"></i></span></span>
              </p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text p-relative text2">{{rowData.base.zyCycleCode}}<i class="ic-type ic-increase"></i></label></p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text p-relative text2">{{rowData.base.tjCycleCode}}<i class="ic-type ic-adjust"></i></label></p>
            </el-col>
          </el-row>
          <el-row class="row" type="flex" justify="space-around">
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">总合计精度：</label>
                <span class="value">{{rowData.base.calAccuCode}}</span>
              </p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">单位合计精度：</label>
                <span class="value">{{rowData.base.compCalAccuCode}}</span>
              </p>
            </el-col>
            <el-col :span="rowSpan">
              <p class="display-flex"><label class="text">个人合计精度：</label>
                <span class="value">{{rowData.base.empCalAccuCode}}</span>
              </p>
            </el-col>
          </el-row>
        </div>
        <div class="type-list">
          <el-collapse v-model="accfund.collapseActive">
            <div class="list" v-for="(item,index) in accfund.collapseList" :key="item.id">
              <el-collapse-item class="el-collapse-item" :name="index">

                <template slot="title">
                  <div class="title clearfix">
                    <i v-if="item.isActive==0 && item.expired==0" class="status ic-effect"></i>
                    <i v-else class="status ic-invalid"></i>
                    <p class="fl">
                      <span>参保地：</span><span class="value value1">{{item.addressName}}</span>
                    </p>
                    <p class="fl">
                      <span>方案有效期间：</span><span
                      class="value value3">{{item.startDate?$moment(item.startDate).format('YYYY-MM-DD'):''}}~{{item.endDate?$moment(item.endDate).format('YYYY-MM-DD'):''}}</span>
                    </p>
                    <p class="toggle-detail">展开详情 {{item.policySocialItemVos}}<i class="ic-toggle-detail"></i></p>
                  </div>
                </template>
                <div class="table-content">
                  <dTable ref="socialTable" :paging="false" :data="item.items" :tableHeight="'280px'" style="margin-top: 0;"
                          :showIndex='false' :showSelection='false'>
                    <el-table-column prop="itemTypeName" label="险种类别" min-width="180" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="maleAgeMin" label="最小年龄" width="100" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="maleAgeMax" label="男最大年龄" width="120" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="femaleAgeMax" label="女最大年龄" width="120" :show-overflow-tooltip="true"></el-table-column>

                    <el-table-column label="单位" header-align="center" class-name="border-l border-b-none">
                      <el-table-column prop="compCalAccuCodeName" label="计算精度" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="compBaseMin" label="最低基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="compBaseMax" label="最高基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="compRatioMin" label="比例" width="120" class-name="border-l" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <p>{{scope.row.compRatioMin | filteraccMul(100)}}%</p>
                        </template>
                      </el-table-column>
                    </el-table-column>

                    <el-table-column label="个人" header-align="center" class-name="border-l border-r border-b-none">
                      <el-table-column prop="empCalAccuCodeName" label="计算精度" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="empBaseMin" label="最低基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="empBaseMax" label="最高基数" width="120" class-name="border-l" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="empRatioMin" label="比例" width="120" class-name="border-l border-r" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <p>{{scope.row.empRatioMin | filteraccMul(100)}}%</p>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </dTable>
                  <div class="table-bottom clearfix">
                    <div class="clearfix fl mt-10 mr-10">
                      <div class="fl type">单位</div>
                      <div class="fl type-limit">最低金额：{{item.items | filterAccfundAmount('comMinAmount')}}</div>
                      <div class="fl type-limit">最高金额：{{item.items | filterAccfundAmount('comMaxAmount')}}</div>
                    </div>
                    <div class="clearfix fl mt-10 mr-10">
                      <div class="fl type">个人</div>
                      <div class="fl type-limit">最低金额：{{item.items | filterAccfundAmount('empMinAmount')}}</div>
                      <div class="fl type-limit">最高金额：{{item.items | filterAccfundAmount('empMaxAmount')}}</div>
                    </div>
                    <div class="clearfix fl mt-10">
                      <div class="fl type">合计</div>
                      <div class="fl type-limit">最低金额：{{item.items | filterAccfundAmount('sumMinAmount')}}</div>
                      <div class="fl type-limit">最高金额：{{item.items | filterAccfundAmount('sumMaxAmount')}}</div>
                    </div>
                  </div>
                </div>

              </el-collapse-item>
            </div>

          </el-collapse>
        </div>
      </div>
    </el-drawer>
    <!--查看-公积金-->

    <!--查看-补缴规则（社保+公积金）-->
    <el-drawer
      title="补缴规则查看"
      :visible.sync="payBack.drawer" :wrapperClosable="false"
      direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <div class="drawer-content">
        <div class="payback-title">
          <span>参保地：{{payBack.addressName}}</span><span class="ml-141">补缴截止日: {{payBack.bjDeadDay}}</span>
        </div>
        <div class="payback-table">
          <dTable :data="payBack.items" ref="socialSuppRuleTable" :paging="false" :tableHeight="'280px'" style="margin-top: 0;"
                  :showIndex='true' :showSelection='false'>
            <el-table-column prop="typeName" label="险种类别" min-width="80" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="allowSuppTypeName" label="可允许补缴类型" min-width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="allowMonths" label="允许补缴时间" min-width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="suppRatioRuleName" label="补缴比例规则" min-width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="suppBaseRuleName" label="补缴基数规则" min-width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="baseScope" label="基数范围" min-width="180" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div v-if="showType==1">
                  <el-popover placement="right" width="400" trigger="hover">
                    <el-table :data="scope.row.detailVOS">
                      <el-table-column width="100" prop="typeName" label="险种名称"></el-table-column>
                      <el-table-column width="100" prop="baseScope" label="基数范围"></el-table-column>
                      <el-table-column width="100" prop="startDate" property="endDate" label="启用日期"></el-table-column>
                      <el-table-column width="100" prop="endDate" property="address" label="失效日期"></el-table-column>
                    </el-table>
                    <span class="text-blue" slot="reference">{{ scope.row.baseScope}}</span>
                  </el-popover>
                </div>
                <div v-else>
                  <p>{{ scope.row.baseScope}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="defaultInsured" label="默认不参保" min-width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="acrossMonth" label="不允许跨月补缴" min-width="180" :show-overflow-tooltip="true"></el-table-column>
          </dTable>
          <p class="mt-20"><span class="fw-blod">补缴规则：</span>当前设置的补缴规则均为可补缴险种规则设置，未设置的险种系统均以不可补缴的形式进行处理</p>
        </div>
      </div>
    </el-drawer>
    <!--查看-补缴规则（社保+公积金）-->

  </div>
</template>
<script>
  
  import dTable from '../../components/common/table'
  import splTab from '../../components/common/spl-tab'
  import addrSelector from '../../components/common/addrSelector'
  import {getSocialCyleAmount, getAccfundAmount, accMul} from '../../utils/socialAccfundProduct'
  import {caclUsedAddr} from '../../utils/caclUsedItem'

  export default {
    components: {splTab, addrSelector, dTable},
    data() {
      return {
        pathData: [{name: '社保公积金'}, {name: '可用方案'}],
        active: 0,
        tabs: ['社保', '公积金'],
        social: {
          allAddr: [],
          usedAddr: [],
          userActive: -1,
          addrVal: '',
          drawer: false,
          collapseActive: [],
          collapseList: [{id: 0}, {id: 1}]
        },
        accfund: {
          allAddr: [],
          usedAddr: [],
          userActive: 2,
          addrVal: '',
          drawer: false,
          collapseActive: [],
          collapseList: [{id: 0}, {id: 1}]
        },
        payBack: {
          drawer: false,
          addressName: '',
          bjDeadDay: '',
          items: []
        },
        rowSpan: 8,
        rowData: {
          base: {},
          voList: {
            items: [{}]
          }
        },
        showType: 0 //标识补缴规则 类型 1社保2公积金
      }
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 320 + 'px'
      }
    },
    created() {
      let that = this
      this.$nextTick(() => {
        that.getSocialTableData()
        that.getAccfundTableData()
        that.getAddr(1)
        that.getAddr(2)
      })
    },
    mounted() {
    },
    methods: {
      /* 常用地 */
      selectUsed(type, index) {
        if (type === 'social') {
          this.social.addrVal = ''
          this.social.userActive = index
          this.getSocialTableData('used')
        } else {
          this.accfund.addrVal = ''
          this.accfund.userActive = index
          this.getAccfundTableData('used')
        }
      },
      getSocialTableData(type) {
        var params = []
        var addrVal = ''
        if (type == 'used') {
          if (this.social.userActive == this.social.usedAddr.length - 1) {
            addrVal = ''
          } else {
            addrVal = this.social.usedAddr[this.social.userActive].name
          }
        } else {
          this.social.userActive = -1
          addrVal = this.social.addrVal
        }
        params = [
          {property: 'addressName', value: addrVal},
          {property: 'custId', value: this.$store.state.userData.custId + ''}
        ]
        this.$refs.socialTable.fetch({
          query: params,
          method: 'post',
          url: '/api/socialAccfund/socialList'
        })
      },
      getAccfundTableData(type) {
        var params = []
        var addrVal = ''
        if (type == 'used') {
          if (this.accfund.userActive == this.accfund.usedAddr.length - 1) {
            addrVal = ''
          } else {
            addrVal = this.accfund.usedAddr[this.accfund.userActive].name
          }
        } else {
          this.accfund.userActive = -1
          addrVal = this.accfund.addrVal
        }
        params = [
          {property: 'addressName', value: addrVal},
          {property: 'custId', value: this.$store.state.userData.custId + ''}
        ]
        this.$refs.accfundTable.fetch({
          query: params,
          method: 'post',
          url: '/api/socialAccfund/accfundList'
        })
      },
      getSuppRuleTableData(row, type) {
        this.showType = type
        var url = ''
        if (type == 1) {
          url = '/api/socialAccfund/socialSuppRuleView'
        } else {
          url = '/api/socialAccfund/accfundSuppRuleView'
        }
        this.$http({
          url: url,
          method: 'get',
          params: {
            addressId: row.addressId
          }
        }).then(({data}) => {
          this.payBack.addressName = data.addressName
          this.payBack.bjDeadDay = row.bjEnddayStr
          this.payBack.items = data.items
          this.payBack.drawer = true
        })
      },
      //  查看社保
      handleSocialView(row) {
        this.$http({
          url: '/api/socialAccfund/socialView',
          method: 'get',
          params: {
            id: row.id,
            productCode: row.productCode
          }
        }).then(({data}) => {
          this.social.drawer = true
          this.social.collapseActive = [0]
          if (data.data.length > 0) {
            this.rowData = data.data[0]
            this.social.collapseList = data.data[0].voList
          }
        }).catch((data) => {
          this.social.drawer = false
        })
      },

      //  查看公积金
      handleAccfundView(row) {
        this.$http({
          url: '/api/socialAccfund/accfundView',
          method: 'get',
          params: {
            id: row.id,
            productCode: row.productCode
          }
        }).then(({data}) => {
          this.accfund.drawer = true
          this.accfund.collapseActive = [0]
          if (data.data.length > 0) {
            this.rowData = data.data[0]
            this.accfund.collapseList = data.data[0].voList
          }
        }).catch((data) => {
          this.accfund.drawer = false
        })
      },
      handleSocialAccfundPayBackView(row, type) {
        this.payBack.drawer = true
        this.getSocialSuppRuleTableData()
      },
      // 获取参保地
      getAddr(type) {
        let that = this
        this.$http({
          url: '/api/socialAccfund/addr',
          method: 'get',
          params: {type: type}
        }).then(({data}) => {
          if (type == 1) {
            this.social.allAddr = data
            this.$nextTick(function () {
              that.social.usedAddr = caclUsedAddr(that, data, 'socialUsedWidth')
            })
            console.info(that.social.usedAddr)
          } else {
            this.accfund.allAddr = data
          }
        })
      },

      changeTab(item) {
        let that = this
        if (item.active == 1 && this.accfund.usedAddr.length < 1) {
          this.$nextTick(function () {
            that.accfund.usedAddr = caclUsedAddr(that, that.accfund.allAddr, 'accfundUsedWidth')
          })
        }
      }

    },
    filters: {
      filterSocialCyleAmount(rows, type) {
        let res = getSocialCyleAmount(rows, type)
        return res
      },
      filterAccfundAmount(rows, type) {
        let res = getAccfundAmount(rows, type)
        return res
      },
      filteraccMul(value1, value2) {
        let mul = accMul(value1, value2)
        return mul
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
    border: 1px solid rgba(206, 206, 206, 1);
    border-radius: 0px 2px 2px 0px;
    margin-right: 10px;
    cursor: pointer;
  }

  .tag:hover, .tag.active {
    background-color: #dddddd;
  }
</style>
