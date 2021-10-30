<template>
  <div class="spl-container">
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="title-row">
      <el-row class="row" type="flex">
        <el-col :span="rowSpan">
          <p class="display-flex"><label class="text">账单编号：</label>
            <span class="value">{{billInfo.code}}</span></p>
        </el-col>
        <el-col :span="rowSpan">
          <p class="display-flex"><label class="text">账单年月：</label>
            <span class="value">{{billInfo.recDate}}</span></p>
        </el-col>
        <el-col :span="rowSpan">
          <p class="display-flex"><label class="text">账单总金额：</label>
            <span class="value">{{$global.milliFormat(billInfo.receivableAmount, 'keep')}}</span></p>
        </el-col>
      </el-row>
      <el-row class="row" style="margin-top: 25px;" type="flex">
        <el-col :span="rowSpan">
          <p class="display-flex"><label class="text">收款户名：</label>
            <span class="value">{{billInfo.optrCompName}}</span></p>
        </el-col>
        <el-col :span="rowSpan">
          <p class="display-flex"><label class="text">收款银行：</label>
            <span class="value">{{billInfo.recBankName}}&nbsp;{{billInfo.recBankAccount}}</span></p>
        </el-col>
        <el-col :span="rowSpan">
          <p class="display-flex"><label class="text">创建时间：</label>
            <span class="value">{{$moment(billInfo.creatTime).format('YYYY-MM-DD HH:mm:ss')}}</span></p>
        </el-col>
      </el-row>
    </div>

    <div class="detail-title"><p>费用汇总明细
      <span class="fr font-14 pr-20" v-if="billInfo.checkCode">对账识别码： <span class="text-red">{{billInfo.checkCode}}</span></span>
    </p></div>

    <div class="detail-content">
      <el-collapse class="spl-collapse" v-model="activeCollapse">
        <!--薪酬费用-->
        <el-collapse-item class="detail-type detail-type2" name="0">
          <template slot="title">
            <div class="type-title clearfix">
              <p class="title fl">薪酬费用</p>
              <p class="toggle-detail">汇总<i class="ic-toggle-detail"></i></p>
            </div>
          </template>
          <div class="table-content">
            <dTable :data="billInfo.salarySummations" :cancelMinHeight="true" :showEmptyAll="true"
                    :showSelection="false" :showIndex="false" :paging="false">
              <el-table-column prop="type" label="收入类型" min-width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!--薪酬费用类型（1：工资薪金，2：年终奖，3：劳务报酬，4：其它收入）-->
                  <p v-if="scope.row.type==1">正常工资薪金</p>
                  <p v-else-if="scope.row.type==2">年终奖</p>
                  <p v-else-if="scope.row.type==3">劳务报酬所得</p>
                  <p v-else-if="scope.row.type==4">其它收入类型</p>
                  <p v-else>合计</p>
                </template>
              </el-table-column>
              <el-table-column prop="actualAmount" label="实发金额" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="tax" label="个税金额" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="total" label="合计" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
            </dTable>
          </div>
        </el-collapse-item>

        <!--社保/公积金费用-->
        <el-collapse-item class="detail-type detail-type2" name="1">
          <template slot="title">
            <div class="type-title clearfix">
              <p class="title fl">社保/公积金费用</p>
              <p class="toggle-detail">汇总<i class="ic-toggle-detail"></i></p>
            </div>
          </template>
          <div class="table-content">
            <dTable :data="billInfo.socialAccfundFees" :cancelMinHeight="true" :showEmptyAll="true"
                    :showSelection="false" :showIndex="false" :paging="false">
              <el-table-column prop="type" label="费用类型" min-width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!--类型（1：社保费用，2：公积金费用）-->
                  <p v-if="scope.row.type==1">社保</p>
                  <p v-else-if="scope.row.type==2">公积金</p>
                  <p v-else>合计</p>
                </template>
              </el-table-column>
              <el-table-column prop="personTotal" label="个人部分合计" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="companyTotal" label="单位部分合计" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="adjustTotal" label="调整费" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="total" label="合计" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
            </dTable>
          </div>
        </el-collapse-item>

        <!--其他-->
        <el-collapse-item class="detail-type detail-type2" name="2">
          <template slot="title">
            <div class="type-title clearfix">
              <p class="title fl">其他</p>
              <p class="toggle-detail">汇总<i class="ic-toggle-detail"></i></p>
            </div>
          </template>
          <div class="table-content">
            <dTable :data="billInfo.otherFees" :cancelMinHeight="true" :showEmptyAll="true" :showSelection="false"
                    :showIndex="false" :paging="false">
              <el-table-column prop="type" label="费用类型" min-width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!--类型（1：商保，2：残保金，3：安残金，4：附加费，5：服务费）-->
                  <p v-if="scope.row.type==1">商保</p>
                  <p v-else-if="scope.row.type==2">残保金</p>
                  <p v-else-if="scope.row.type==3">安残金</p>
                  <p v-else-if="scope.row.type==4">附加费</p>
                  <p v-else-if="scope.row.type==5">服务费</p>
                  <p v-else>合计</p>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="金额" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="adjustTotal" label="调整费" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="total" label="合计" :formatter="formatterAmount2" min-width="180"
                               :show-overflow-tooltip="true"></el-table-column>
            </dTable>
          </div>
        </el-collapse-item>

        <!--费用明细-->
        <el-collapse-item class="detail-type" name="3">
          <template slot="title">
            <div class="type-title clearfix">
              <p class="title fl">费用明细</p>
              <p class="toggle-detail">明细<i class="ic-toggle-detail"></i></p>
            </div>
          </template>
          <div class="table-content table-content2">
            <splTab :tabs="costData.tabs" v-model="costData.active" @changeTab="changeCostTab" :type="1"
                    class="mb-20"></splTab>
            <!--薪酬-->
            <div v-show="costData.active==0">
              <dTable @fetch="getCostTableData(0)" ref="costTable0" :key="refreahtCostTable0" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="empName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="phone" label="手机号码" min-width="150"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empBankDictName" label="银行名称" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empBankAccountName" label="银行账户名" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empBankAccount" label="银行账号" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="bankBranch" label="开户信息" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="provideType" label="收入类型" min-width="150"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyMonth" label="薪酬年月" min-width="120"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="plannedMoney" label="应发金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="socialSecurityAmount" label="个人社保合计" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="accfundAmount" label="个人公积金" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="taxAmount" label="个税" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="actualAmount" label="实发金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>

                <el-table-column :prop="item.code" :label="item.name" v-for="item in salaryColumns" :key="item.code"
                                 min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <p>{{scope.row.items&&scope.row.items[item.code]?$global.milliFormat(scope.row.items[item.code],
                      'keep'):'0.00'}}</p>
                  </template>
                </el-table-column>

                <el-table-column prop="accumulatedDeduction" label="累计减除费用" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="taxAdditionalItem1" label="累计子女教育扣除" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="taxAdditionalItem7" label="累计赡养老人扣除" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="taxAdditionalItem4" label="累计住房贷款扣除" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="taxAdditionalItem5" label="累计租房租金扣除" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="taxAdditionalItem9" label="累计继续教育扣除" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="itemName" label="年终奖税后调整" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="otherAmount" label="扣减金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>

                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '1')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--社保-->
            <div v-show="costData.active==1">
              <dTable @fetch="getCostTableData(1)" ref="costTable1" :tableHeight="tableHeight" :key="refreahtCostTable1"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="empName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="productName" label="险种方案" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cpTotal" label="社保合计" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="personTotal" label="个人部分合计" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="compTotal" label="单位部分合计" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>

                <el-table-column :prop="item.code" :label="item.name" v-for="item in socialColumns" :key="item.code"
                                 min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <p>{{scope.row.items&&scope.row.items[item.code]?$global.milliFormat(scope.row.items[item.code],
                      'keep'):'0.00'}}</p>
                  </template>
                </el-table-column>

                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '2')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--公积金-->
            <div v-show="costData.active==2">
              <dTable @fetch="getCostTableData(2)" ref="costTable2" :tableHeight="tableHeight" :showSelection="false"
                      :showIndex="true">
                <el-table-column prop="empName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="productName" label="险种方案" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cpTotal" label="公积金合计" min-width="180" :formatter="formatterAmount"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cpTotal" label="个人部分合计" min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span>{{$global.milliFormat(accAdd(scope.row.personAmount['20002001'], scope.row.personAmount['20002002']), 'keep')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="compAmount.20002001" label="单位部分合计" min-width="180"
                                 :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span>{{$global.milliFormat(accAdd(scope.row.compAmount['20002001'], scope.row.compAmount['20002002']), 'keep')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="personBase.20002001" label="公积金个人基数" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cpTotal" label="公积金个人金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="compBase.20002001" label="公积金单位基数" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="compAmount.20002001" label="公积金单位金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="personBase.20002002" label="补充个人基数" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="personAmount.20002002" label="补充个人金额" :formatter="formatterAmount"
                                 min-width="180" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="compBase.20002002" label="补充单位基数" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="compAmount.20002002" label="补充单位金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '3')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--商保-->
            <div v-show="costData.active==3">
              <dTable @fetch="getCostTableData(3)" ref="costTable3" :tableHeight="tableHeight" :showSelection="false"
                      :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="optrCompName" label="供应商" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="productName" label="产品方案" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyStartDate" label="费用开始日期" min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <p>{{ scope.row.fyStartDate?$moment(scope.row.fyStartDate).format('YYYY-MM-DD'):'' }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="fyEndDate" label="费用结束日期" min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <p>{{ scope.row.fyEndDate?$moment(scope.row.fyEndDate).format('YYYY-MM-DD'):'' }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="fee" label="保费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '4')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--服务费-->
            <div v-show="costData.active==4">
              <dTable @fetch="getCostTableData(4)" ref="costTable4" :tableHeight="tableHeight" :showSelection="false"
                      :showIndex="true">
                <el-table-column prop="empName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="120"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="amount" label="服务费金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="detail" label="备注" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '5')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--残保金-->
            <div v-show="costData.active==5">
              <dTable @fetch="getCostTableData(5)" ref="costTable5" :tableHeight="tableHeight" :showSelection="false"
                      :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="socialAddrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fee" label="金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '6')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--安残金-->
            <div v-show="costData.active==6">
              <dTable @fetch="getCostTableData(6)" ref="costTable6" :tableHeight="tableHeight" :showSelection="false"
                      :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fee" label="安残金金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '7')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--附加费-->
            <div v-show="costData.active==7">
              <dTable @fetch="getCostTableData(7)" ref="costTable7" :tableHeight="tableHeight" :showSelection="false"
                      :showIndex="true">
                <el-table-column prop="empName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="feeName" label="附加费名称" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="feeAmount" label="附加费金额" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('cost', '8')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
          </div>
        </el-collapse-item>

        <!--调整费明细-->
        <el-collapse-item class="detail-type" name="4">
          <template slot="title">
            <div class="type-title clearfix">
              <p class="title fl">调整费明细</p>
              <p class="toggle-detail">明细<i class="ic-toggle-detail"></i></p>
            </div>
          </template>
          <div class="table-content table-content2">
            <splTab :tabs="adjustData.tabs" v-model="adjustData.active" @changeTab="changeAdjustTab" :type="1"
                    class="mb-20"></splTab>
            <!--社保-->
            <div v-show="adjustData.active==0">
              <dTable @fetch="getAdjustTableData(0)" ref="adjustTable0" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="diffAmount" label="社保调整费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('adjust', '2')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--公积金-->
            <div v-show="adjustData.active==1">
              <dTable @fetch="getAdjustTableData(1)" ref="adjustTable1" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="diffAmount" label="公积金调整费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('adjust', '3')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--商保-->
            <div v-show="adjustData.active==2">
              <dTable @fetch="getAdjustTableData(2)" ref="adjustTable2" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="optrCompName" label="供应商" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="productName" label="产品方案" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyStartDate" label="费用开始日期" min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <p>{{ scope.row.fyStartDate?$moment(scope.row.fyStartDate).format('YYYY-MM-DD'):'' }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="fyEndDate" label="费用结束日期" min-width="180" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <p>{{ scope.row.fyEndDate?$moment(scope.row.fyEndDate).format('YYYY-MM-DD'):'' }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="diffAmount" label="保费调整费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('adjust', '4')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--服务费-->
            <div v-show="adjustData.active==3">
              <dTable @fetch="getAdjustTableData(3)" ref="adjustTable3" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="120"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="diffAmount" label="服务费调整费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="comment" label="备注" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('adjust', '5')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--残保金-->
            <div v-show="adjustData.active==4">
              <dTable @fetch="getAdjustTableData(4)" ref="adjustTable4" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="employeeName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="employeeIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="diffAmount" label="残保金调整费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('adjust', '6')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
            <!--附加费-->
            <div v-show="adjustData.active==5">
              <dTable @fetch="getAdjustTableData(5)" ref="adjustTable5" :tableHeight="tableHeight"
                      :showSelection="false" :showIndex="true">
                <el-table-column prop="empName" label="姓名" min-width="150" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="empIdCard" label="证件号码" min-width="200" fixed="left"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="addrName" label="参保地" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="fyDate" label="费用年月" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="feeName" label="附加费名称" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="diffAmount" label="附加费调整费" :formatter="formatterAmount" min-width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <template slot="pagination-btns">
                  <el-button size="small" class="btn--border-blue" icon="ic-export-blue"
                             @click="handleExport('adjust', '8')">导出数据
                  </el-button>
                </template>
              </dTable>
            </div>
          </div>
        </el-collapse-item>

      </el-collapse>

    </div>

    <!-- 转账提示 -->
    <el-dialog :visible.sync="submitDialogVisible" :close-on-click-modal="false" width="600px" class="spl-dialog-msg">
      <template slot="title">
        <p class="mb-5"><i class="el-icon-warning text-orange fl" style="font-size: 24px"></i><span
          class="font-18 ml-10" style="line-height: 24px;">转账提示</span></p>
      </template>
      <p class="mt-30 mb-30 pl-40">账单总金额：<span class="text-orange">{{$global.milliFormat(billInfo.receivableAmount, 'keep')}}</span>
      </p>
      <div style="background:#F5F7FA;padding: 18px 17px 17px 40px;">
        <p class="mb-10">当前账单待划款，请提交账单，并汇款至以下账户：</p>
        <p class="mb-10">账户全称：<span v-text="billInfo.optrCompName"></span></p>
        <p class="mb-10">开户银行：<span v-text="billInfo.recBankName"></span></p>
        <p class="mb-10">银行账号：<span class="text-orange" v-text="billInfo.recBankAccount"></span></p>
        <p style="margin-bottom: 2px;"><i class="el-icon-warning fl mr-10" style="font-size: 20px;color: red"></i>对账识别码：<span
          v-text="billInfo.checkCode" class="text-red"></span></p>
        <p class="text-red" style="padding-left: 30px;line-height: 20px;">为保证您的资金安全，方便对账，请您在充值转账时，务必在转账备注中填写此对账识别码</p>
      </div>
      <div slot="footer" class="dialog-footer pt-15">
        <el-button type="primary" @click="submitDialogVisible=false">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dTable from '../../components/common/table'
import splTab from '../../components/common/spl-tab'
import { accAdd2 } from '../../utils/socialAccfundProduct'

export default {
  components: { dTable, splTab },
  data () {
    return {
      pathData: [
        { name: '账单中心' },
        { name: '账单列表', path: '/billManage/index' },
        { name: '查看账单详情' }
      ],
      rowSpan: 8,
      costData: {
        tabs: ['薪酬', '社保', '公积金', '商保', '服务费', '残保金', '安残金', '附加费'],
        active: 0,
        loadIndexArr: [0] // 用于记录是否加载过tab的index
      },
      adjustData: {
        tabs: ['社保', '公积金', '商保', '服务费', '残保金', '附加费'],
        active: 0,
        loadIndexArr: [0] // 用于记录是否加载过tab的index
      },
      activeCollapse: ['0', '1', '2', '3', '4'],
      id: '',
      recCode: '',
      billInfo: {},
      tableHeight: '300px',
      refreahtCostTable0: new Date().getTime(),
      refreahtCostTable1: new Date().getTime(),
      salaryColumns: [], // 工资动态项
      socialColumns: [], // 社保动态项
      submitDialogVisible: false,
      salaryFixedColumns: ['应发金额', '个人社保合计', '个人公积金', '个税', '实发金额', '年终奖税后调整', '扣减金额'] // 用于对动态项的去重复
    }
  },
  created () {
    this.id = this.$route.query.id ? this.$route.query.id : ''
    this.recCode = this.$route.query.recCode ? this.$route.query.recCode : ''
    this.getBillInfo() // 根据账单ID获取账单详情
    this.getSalarySocialColumns(1) // 获取工资动态项
    this.getSalarySocialColumns(2) // 获取工资动态项
    this.$nextTick(() => {
      this.getAdjustTableData(0) // 社保调整明细（分页)
    })
  },
  methods: {
    accAdd (num1, num2) {
      let newNum1 = num1 || 0
      let newNum2 = num2 || 0
      return accAdd2(newNum1, newNum2)
    },
    // 根据账单ID获取账单详情
    getBillInfo () {
      this.$http({
        url: '/api/accountManage/' + this.id,
        method: 'get'
      }).then(({ data }) => {
        let res = data.data[0]
        this.submitDialogVisible = res.receivedStatus != '10056003'
        let item1
        let actualAmount = 0
        let tax = 0
        let total1 = 0
        if (res.salarySummations.length > 0) {
          for (let i = 0; i < res.salarySummations.length; i++) {
            item1 = res.salarySummations[i]
            item1.total = accAdd2(item1.actualAmount, item1.tax)
            actualAmount = accAdd2(actualAmount, item1.actualAmount)
            tax = accAdd2(tax, item1.tax)
            total1 = accAdd2(total1, item1.total)
          }
          res.salarySummations.push({ type: '合计', actualAmount: actualAmount, tax: tax, total: total1 })
        }

        let item2
        let adjustTotal = 0
        let companyTotal = 0
        let personTotal = 0
        let total2 = 0
        if (res.socialAccfundFees && res.socialAccfundFees.length > 0) {
          for (let i = 0; i < res.socialAccfundFees.length; i++) {
            item2 = res.socialAccfundFees[i]
            item2.total = accAdd2(item2.adjustTotal, item2.companyTotal)
            item2.total = accAdd2(item2.total, item2.personTotal)
            adjustTotal = accAdd2(adjustTotal, item2.adjustTotal)
            companyTotal = accAdd2(companyTotal, item2.companyTotal)
            personTotal = accAdd2(personTotal, item2.personTotal)
            total2 = accAdd2(total2, item2.total)
          }
          res.socialAccfundFees.push({
            type: '合计',
            adjustTotal: adjustTotal,
            companyTotal: companyTotal,
            personTotal: personTotal,
            total: total2
          })
        }

        if (res.otherFees && res.otherFees.length > 0) {
          let item3
          let adjustTotal3 = 0
          let amount3 = 0
          let total3 = 0
          for (let i = 0; i < res.otherFees.length; i++) {
            item3 = res.otherFees[i]
            item3.total = accAdd2(item3.adjustTotal, item3.amount)
            adjustTotal3 = accAdd2(adjustTotal3, item3.adjustTotal)
            amount3 = accAdd2(amount3, item3.amount)
            total3 = accAdd2(total3, item3.total)
          }
          res.otherFees.push({ type: '合计', adjustTotal: adjustTotal3, amount: amount3, total: total3 })
        }
        this.billInfo = res
      })
    },
    // 根据账单ID获取账单详情
    getSalarySocialColumns (type) {
      // 1：工资，2：社保
      this.$http({
        url: '/api/accountManage/details/' + type + '/dynamicColumns?recCode=' + this.recCode,
        method: 'get'
      }).then(({ data }) => {
        if (type == 1) {
          let res = data.data[0]
          let newRes = []
          for (let i = 0; i < res.length; i++) {
            if (this.salaryFixedColumns.indexOf(res[i].name) < 0) {
              newRes.push(res[i])
            }
          }
          this.salaryColumns = newRes
          this.refreahtCostTable0 = new Date().getTime()
          this.$nextTick(() => {
            this.getCostTableData(0) // 工资明细（分页)
          })
        } else {
          this.socialColumns = data.data[0]
          this.refreahtCostTable1 = new Date().getTime()
        }
      })
    },

    // 费用明细 -tab
    changeCostTab (obj) {
      let active = obj.active
      if (this.costData.loadIndexArr.indexOf(active) < 0) {
        this.costData.loadIndexArr.push(active)
        this.getCostTableData(active)
      }
    },
    // 费用明细-表格
    getCostTableData (index) {
      let url = ''
      // tabs: ['薪酬', '社保', '公积金', '商保', '服务费', '残保金', '安残金', '附加费'],
      switch (index) {
        case 0:
          url = '/api/accountManage/salaryDetails'
          break
        case 1:
          url = '/api/accountManage/socialDetails'
          break
        case 2:
          url = '/api/accountManage/accfundDetails'
          break
        case 3:
          url = '/api/accountManage/comminsureDetails'
          break
        case 4:
          url = '/api/accountManage/serviceDetails'
          break
        case 5:
          url = '/api/accountManage/disabilityDetails'
          break
        case 6:
          url = '/api/accountManage/aftercareDisabilityDetails'
          break
        case 7:
          url = '/api/accountManage/additionalDetails'
          break
      }
      this.$nextTick(() => {
        this.getCostDetails(index, url)
      })
    },
    // 工资明细（分页)
    getCostDetails (index, url) {
      let params = [
        { property: 'recCode', value: this.recCode }
      ]
      this.$refs['costTable' + index].fetch({
        query: params,
        method: 'post',
        url: url
      })
    },

    // 调整明细 -tab
    changeAdjustTab (obj) {
      let active = obj.active
      if (this.adjustData.loadIndexArr.indexOf(active) < 0) {
        this.adjustData.loadIndexArr.push(active)
        this.getAdjustTableData(active)
      }
    },
    // 调整明细-表格
    getAdjustTableData (index) {
      let url = ''
      // tabs: [''社保', '公积金', '商保', '服务费', '残保金', '附加费'],
      switch (index) {
        case 0:
          url = '/api/accountManage/socialAdjustDetails'
          break
        case 1:
          url = '/api/accountManage/accfundAdjustDetails'
          break
        case 2:
          url = '/api/accountManage/commisureAdjustDetails'
          break
        case 3:
          url = '/api/accountManage/serviceAdjustDetails'
          break
        case 4:
          url = '/api/accountManage/disabilityAdjustDetails'
          break
        case 5:
          url = '/api/accountManage/additionalAdjustDetails'
          break
      }
      this.$nextTick(() => {
        this.getAdjustDetails(index, url)
      })
    },
    // 调整明细（分页)
    getAdjustDetails (index, url) {
      let params = [
        { property: 'recCode', value: this.recCode }
      ]
      this.$refs['adjustTable' + index].fetch({
        query: params,
        method: 'post',
        url: url
      })
    },

    // 导出
    handleExport (type, tab) {
      let url = ''
      if (type == 'cost') {
        //  费用明细 （1：薪酬，2：社保，3：公积金，4：商保，5：服务费，6：残保金，7：安残金，8：附加费）
        url = '/api/accountManage/feeDetails/' + tab + '/export'
      } else {
        //  调整明细 （2：社保，3：公积金，4：商保，5：服务费，6：残保金，8：附加费）
        url = '/api/accountManage/adjustDetails/' + tab + '/export'
      }
      this.$downloadFile(url, 'post', this.$qs.stringify({ recCode: this.recCode }), this.$global.EXCEL)
    },

    formatterAmount2 (row, column, cellValue, index) {
      if (cellValue == null || cellValue == '') {
        return '0.00'
      } else {
        return this.$global.milliFormat(cellValue)
      }
    },
    formatterAmount (row, column, cellValue, index) {
      if (cellValue == null || cellValue == '') {
        return '0.00'
      } else {
        return this.$global.milliFormat(cellValue, 'keep')
      }
    }
  }
}
</script>

<style lang='less' scoped>
  .title-row {
    padding: 30px 0;
    border: 1px solid #CFCFCF;
    .text {
      width: 110px;
      text-align: right;
    }
    .value {
      flex: 1;
    }
  }

  .detail-title {
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    background: #F8F8F8;
    margin-top: 18px;
    font-size: 18px;
  }

  .detail-content {
    padding: 20px;
  }

  .table-content2 {
    padding: 10px 20px 20px 20px;
  }

  .detail-type {
    width: 100%;
    border: 1px solid #CFCFCF;
    margin-bottom: 20px;
    .type-title {
      height: 48px;
      line-height: 48px;
      background-color: #F8F8F8;
      padding-left: 10px;
      padding-right: 30px;
      font-weight: bold;
      .title {
        color: @comFontSizeColor !important;
      }
    }
  }

  /deep/ .el-dialog__headerbtn .el-dialog__close {
    font-size: 16px;
    font-weight: bold;
  }

  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/.detail-type2{
    .el-table__row:last-of-type{
      td{
        border-bottom: none;
      }
    }
  }
</style>
