<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="clearfix">
      <div class="fl header-left">
        <p class="fl">发票详情</p>
        <img v-if="eTicket=='2'" class="ml-20 fl" src="@/assets/images/icons/invoice2.png">
      </div>
      <div class="fr mr-20">
        <el-button v-if="eTicket=='2'" @click="download()" type="primary" class="s-btn"><img class="mr-10" src="@/assets/images/icons/ic-account-type25.png">下载发票</el-button>
        <img class="ml-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="handleClose">
      </div>
    </header>
    <div class="panel panel-default m-panel01">
      <div class="panel-heading panel-heading01">
        发票信息
        <label v-if="eTicket==2">-电子发票</label>
      </div>
      <div class="header-right">
        <img class="ml-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="handleClose">
      </div>
      <div class="panel-body">
        <div class="row m-frm01 m-two-10 pb-0 clearfix" id="onbill">
          <div class="col-md-1 fl">
            <em class="ic-bill-normal" v-if="receiptStatus==1"></em>
            <em class="ic-bill-red" v-if="receiptStatus==2"></em>
          </div>
          <div class="col-md-3">
            <label class="lab required-pre">发票号码：</label>
            <label class="text">
              {{receiptNumber}}
            </label>
          </div>
          <div class="col-md-3">
            <label class="lab required-pre">发票代码：</label>
            <label class="text">
              {{receiptCode}}
            </label>
          </div>
          <div class="col-md-3">
            <label class="lab required-pre">开票日期：</label>
            <label class="text">
              {{issureDateView}}
            </label>
          </div>
        </div>

        <div class="togglebox">
          <div class="m-line06 f-cb">
            <el-collapse class="spl-collapse" v-model="activeCollapse">
              <el-collapse-item name="0">
                <template slot="title">
                  <label class="lab f-cursor fr mt--10 invoice-toggle-detail">
                    <i class="text u-aim" v-show="activeCollapse.indexOf('0')<0">显示明细</i>
                    <i class="text u-aim" v-show="activeCollapse.indexOf('0')>-1">隐藏明细</i>
                    <i class="ic-toggle-detail"></i>
                  </label>
                </template>
                <div class="detail dp-none">
                  <div class="row m-frm01 pt-0 pb-0 clearfix">
                    <div class="col-md-3">
                      <label class="lab required">开票类型：</label>
                      <label class="text" v-if="typeCode=='1'">地税发票</label>
                      <label class="text"
                             v-if="typeCode=='1'&& zzsTypeCode=='20031001'">增值税专用发票</label>
                      <label class="text"
                             v-if="typeCode=='1'&& zzsTypeCode=='20031002'">增值税普通发票</label>
                    </div>
                    <div class="col-md-3">
                      <label class="lab required">开票方式：</label>
                      <label class="text">
                        {{receiptWayName}}
                      </label>
                    </div>
                  </div>
                  <table class="table table-bordered td-hd30 normal th-center mt-10 mb-0">
                    <thead class="thead-bg01">
                    <th class="th-bor w-140">账单编号</th>
                    <th class="th-bor w-260">开票项目</th>
                    <!--<%--<th class="th-bor w-80">可开票金额</th>--%>-->
                    <th class="th-bor w-80">开票金额</th>
                    <th class="th-bor w-80">差额征税金额</th>
                    <!--<%--<th class="th-bor w-80">计税金额</th>--%>-->
                    </thead>
                    <tbody id="itembox-0" class="itembox">
                    <!--<c:forEach items="${receivableFeeDtoList}" var="dto">-->
                    <tr name="trRow" class="ver-mid newitem" v-for="(item, index) in receivableFeeDTOList" :key="index">
                      <td align="left" class="showdetail">
                        <el-popover placement="right" width="auto" trigger="hover">
                          <dTable :data="item.itemList" :cancelMinHeight="true" :showSelection="false"
                                  :showIndex="false" :paging="false">
                            <el-table-column width="150" property="recItemName" label="收款项目"></el-table-column>
                            <el-table-column width="100" property="recItemAmount" label="收款金额"
                                             :formatter="formatterAmount"></el-table-column>
                            <el-table-column width="100" property="retAmount" label="退款金额"
                                             :formatter="formatterAmount"></el-table-column>
                          </dTable>
                          <el-button type="text" slot="reference" v-text="item.recCode"></el-button>
                        </el-popover>
                      </td>
                      <!--<c:if test="${dto.receiptItemNameShow==1}">-->
                      <td align="right"><label class="lh-30">{{item.receiptItemName}}</label>
                      </td>
                      <!--<%-- <td title="allowReceiptAmount" align="right" rowspan="${dto.receiptItemNameCount}">${dto.allowReceiptAmount}</td>--%>-->
                      <td title="receiptAmount" align="right">
                        {{item.receiptAmount}}
                      </td>
                      <td title="balanceTaxAmount" align="right">
                        {{item.balanceTaxAmount}}
                      </td>
                      <!--<%-- <td title="taxAmount" align="right" class="last-td" rowspan="${dto.receiptItemNameCount}">${dto.taxAmount}</td>--%>-->
                      <!--</c:if>-->
                    </tr>
                    <!--</c:forEach>-->
                    <tr id="newitem-last">
                      <td align="center" colspan="2">合计</td>
                      <!--<%--<td id="tdAllowReceiptAmount" align="right">0</td>--%>-->
                      <td id="tdReceiptAmount" align="right">{{receiptTotalAmount}}</td>
                      <td id="tdBalanceTaxAmount" align="right">{{balanceTaxTotalAmount}}</td>
                      <!--<%--<td id="tdTaxAmount" align="right">0</td>--%>-->
                    </tr>
                    </tbody>
                  </table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div id="billmode" class="mt-25">
          <div class="m-bill01" id="billstub_0">
            <dl class="mb-0 mt-0">
              <dt class="hd f-cb clearfix"><em class="fl ic-ma" id="billMa">{{receiptCode}}</em>
                <!--<%--（增值税普通发票）-ic-stub-01/（增值税专用发票）-ic-stub-02--%>-->
                <em class="fl ic-stub ic-stub-02"></em>
                <em class="fl ic-stub ic-stub-02" v-if="zzsTypeCode=='20031001'"></em>
                <em class="fl ic-stub ic-stub-01" v-if="zzsTypeCode=='20031002'"></em>
                <p class="fl">
                  <b class="num" id="billNum">
                    {{receiptNumber}}
                  </b>
                  <em class="date"><i class="lab">开票日期：</i><i class="text" id="billDate">
                    {{issureDateView}}</i></em>
                </p>
              </dt>
              <dd class="item-1">
                <table class="table table-bordered td-font01 normal bor-b-1">
                  <tbody>
                  <tr>
                    <td class="w-30" align="center" valign="top">购买方</td>
                    <td align="left" class="wd-01 msg01">
                      <p><em class="lab">名 <i class="pl-30 ml-10"></i>&nbsp;称：</em><i class="text">{{paymentName}}</i>
                      </p>
                      <p><em class="lab">纳税人识别号：</em><i class="text">{{payNumber}}</i></p>
                      <p><em class="lab">地 址 、电 话：</em><i class="text">{{payAddressMobile}}</i></p>
                      <p><em class="lab">开户行及账号：</em><i class="text">{{payBankAccount}}</i></p></td>
                    <td class="w-30" align="center">密 码 区</td>
                    <td align="center" class="wd-01"></td>
                  </tr>
                  </tbody>
                </table>
                <table class="table table-bordered td-font01 normal text">
                  <thead>
                  <tr>
                    <th class="w-140"><em class="lab">货物或应税劳务、服务名称</em></th>
                    <th class="text-c"><em class="lab">规 格 型 号</em></th>
                    <th class="text-c"><em class="lab">单 位</em></th>
                    <th class="text-c"><em class="lab">数 量</em></th>
                    <th class="w-120 text-c"><em class="lab">单 价</em></th>
                    <th class="text-c"><em class="lab">金 额</em></th>
                    <th class="text-c"><em class="lab">税 率</em></th>
                    <th class="text-c"><em class="lab">税 额</em></th>
                  </tr>
                  </thead>
                  <tbody class="td-b-n">
                  <!--<c:forEach items="${dto.receipt.receiptItemList}" var="item">-->
                  <tr name="trItemRow" v-for="item in receiptItemList">
                    <td class="w-30 pl-10 bor-t-n" align="left">
                      <p class="hd-01" style="width: 386px"><i class="text">{{item.receiptItemName}}</i></p>
                    </td>
                    <td align="center" class="ver-top">
                    </td>
                    <td align="center" class="ver-top">
                    </td>
                    <td align="center" class="ver-top">
                      <p class="hd-01"><i class="text">1</i></p>
                    </td>
                    <td align="center" class="ver-top">
                      <p class="hd-01"><i title="tdItemPrice" class="text">{{item.receiptItemPrice}}</i></p>
                    </td>
                    <td align="center">
                      <p class="hd-01"><i title="tdItemAmount" class="text">
                        {{item.amount}}
                      </i></p>
                    </td>
                    <td align="center" class="ver-top">
                      <p class="hd-01"><i class="text">{{item.taxRateStr}}</i></p>
                    </td>
                    <td align="center">
                      <p class="hd-01"><i title="tdItemTaxAmount" class="text">{{item.taxAmount}}</i></p>
                    </td>
                  </tr>
                  <!--</c:forEach>-->
                  </tbody>
                  <tfoot>
                  <tr>
                    <td class="w-30 pl-10 bor-t-n" align="left">
                      <p class="lab text-center">合<i class="pl-30"></i>计</p>
                    </td>
                    <td align="center" class="ver-top bor-t-n">
                    </td>
                    <td align="center" class="ver-top bor-t-n">
                    </td>
                    <td align="center" class="ver-top bor-t-n">
                    </td>
                    <td align="center" class="ver-top bor-t-n">
                    </td>
                    <td align="center" class="bor-t-n">
                      <i id="iReceiptTotalAmount" class="text">0</i>
                    </td>
                    <td align="center" class="ver-top bor-t-n">
                    </td>
                    <td align="center" class="bor-t-n">
                      <i id="iReceiptTaxTotalAmount" class="text">￥0</i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <em class="lab">价税合计（大写）</em>
                    </td>
                    <td colspan="7">
                      <span class="text"><i class="ic-del"></i>{{upperAmount}}</span>
                      <label style="margin-left: 30%;">
                        <em class="lab">（小写）</em>
                        <i class="text">￥{{amount}}</i>
                      </label>
                    </td>
                  </tr>
                  </tfoot>
                </table>
                <table class="table table-bordered td-font01 normal bor-b-1">
                  <tbody>
                  <tr>
                    <td class="w-30" align="center" valign="top">销 售 方</td>
                    <td align="left" class="wd-01 msg01">
                      <p><em class="lab">名 <i class="pl-30 ml-10"></i>&nbsp;称：</em><i
                        class="text">{{collectionName}}</i>
                      </p>
                      <p><em class="lab">纳税人识别号：</em><i class="text">{{number}}</i></p>
                      <p><em class="lab">地 址 、电 话：</em><i
                        class="text">{{collectionAddressMobile}}</i></p>
                      <p><em class="lab">开户行及账号：</em><i class="text">{{collectionBankAccount}}</i>
                      </p></td>
                    <td class="w-30" align="center">备 注</td>
                    <td align="left" class="wd-01 ver-top">
                      <em class="text">{{comment}}</em></td>
                  </tr>
                  </tbody>
                </table>
              </dd>
              <dd class="font"><i class="ft01"></i><i class="ft02"></i><i class="ft03"></i></dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dTable from '../../components/common/table'

export default {
  components: { dTable },
  name: 'invoiceDetail',
  props: ['message', 'type', 'rowId'],
  data () {
    return {
      // 导航
      pathData: [{ name: '发票管理' }, { name: '发票详情' }],
      id: '',
      eTicket: '',
      receiptStatus: '',
      receiptNumber: '',
      receiptCode: '',
      issureDateView: '',
      paymentName: '',
      payNumber: '',
      payAddressMobile: '',
      payBankAccount: '',
      collectionName: '',
      number: '',
      collectionAddressMobile: '',
      collectionBankAccount: '',
      comment: '',
      amount: '',
      upperAmount: '',
      activeCollapse: '',
      typeCode: '',
      zzsTypeCode: '',
      receiptWayName: '',
      iReceiptTaxTotalAmount: '',
      iReceiptTotalAmount: '',
      receiptItemList: [],
      files: [
        {
          id: '',
          fileId: '',
          fileName: ''
        }
      ],
      receivableFeeDTOList: [],
      balanceTaxTotalAmount: '',
      receiptTotalAmount: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.id = this.message
      this.getInvoiceInfo()
    })
  },
  methods: {
    /* 关闭 */
    handleClose () {
      this.$emit('handleClose')
    },
    getInvoiceInfo () {
      let id = this.id
      let type = this.type
      this.$http({
        url: '/api/receipt/invoiceView',
        method: 'get',
        params: {
          'receiptId': id,
          'type': type
        }
      }).then(({ data }) => {
        let r = data.data[0]
        this.receiptNumber = r.receiptDTO.receipt.receiptNumber
        this.eTicket = r.receiptDTO.receipt.electronicTicket
        this.receiptStatus = this.type
        this.issureDateView = r.receiptDTO.issureDateView
        this.receiptCode = r.receiptDTO.receipt.receiptCode
        this.paymentName = r.receiptDTO.receipt.paymentName
        this.payNumber = r.receiptDTO.receipt.payNumber
        this.payAddressMobile = r.receiptDTO.receipt.payAddressMobile
        this.payBankAccount = r.receiptDTO.receipt.payBankAccount
        this.collectionName = r.receiptDTO.receipt.collectionName
        this.number = r.receiptDTO.receipt.number
        this.collectionAddressMobile = r.receiptDTO.receipt.collectionAddressMobile
        this.collectionBankAccount = r.receiptDTO.receipt.collectionBankAccount
        this.amount = r.receiptDTO.receipt.amount
        this.upperAmount = r.receiptDTO.receipt.upperAmount
        this.typeCode = r.receiptDTO.receipt.typeCode
        this.receiptWayName = r.receiptDTO.receipt.receiptWayName
        this.comment = r.receiptDTO.receipt.comment
        this.receiptItemList = r.receiptDTO.receipt.receiptItemList

        // 统计收款单的开票总额和差额征税金额
        let receiptTotalAmount = 0; let balanceTaxTotalAmount = 0
        for (let idx in r.receivableFeeDTOList) {
          let recItemTotal = { 'recItemName': '合计', 'recItemAmount': '0', 'retAmount': '0' }
          let receivableFee = r.receivableFeeDTOList[idx]
          let recItemAmount = 0; let retAmount = 0
          // 统计费用的总计
          for (let i in receivableFee.itemList) {
            recItemAmount += receivableFee.itemList[i].recItemAmount
            retAmount += receivableFee.itemList[i].retAmount
          }
          recItemTotal.recItemAmount = recItemAmount
          recItemTotal.retAmount = retAmount
          receiptTotalAmount += receivableFee.receiptAmount
          balanceTaxTotalAmount += receivableFee.balanceTaxAmount
          receivableFee.itemList.push(recItemTotal)
        }
        this.receivableFeeDTOList = r.receivableFeeDTOList
        this.receiptTotalAmount = this.formatterAmount(null,null,receiptTotalAmount,null)
        this.balanceTaxTotalAmount = this.formatterAmount(null,null,balanceTaxTotalAmount,null)
      }).catch(data => {
      })
    },
    download () {
      let id = this.id
      this.$http({
        url: '/api/receipt/preInvoiceDownload',
        method: 'get',
        params: {
          'receiptId': id
        }
      }).then(({ data }) => {
        if (data.code === '10') {
          this.$downloadFile(
            '/api/receipt/invoiceDownload',
            'get',
            { 'receiptId': id }
          )
        } else {
          this.$message.error(data.data[0])
        }
      }).catch(data => {
      })
    },
    formatterAmount (row, column, cellValue, index) {
      return this.$global.milliFormat(cellValue)
    },
    /**
       * 设置异常数据时的默认值
       * @param val
       * @returns {*}
       */
    setDefaultValue (val) {
      if (val == undefined || val == null || val == '') { return 0 } else { return val }
    },
    /**
       * 设置精度
       * @param val
       * @returns {string|number}
       */
    setFloat2Bit (val) {
      if (val == undefined || val == null || val == '') { return 0 } else { return parseFloat(val).toFixed(2) }
    }
  },
  watch: {
    message: function (oid, nid) {
      this.id = this.message
      this.getInvoiceInfo()
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/invoice/detail.less';
  header{
    height: 50px;
    line-height: 50px;
    margin-top: 80px;
    background: #F8F8F8;
    .header-left{
      display: flex;
      align-items: center;
      margin-left: 40px;
      p{
        font-size:18px;
        font-weight: bold;
      }
    }
  }
  .header-right{
    display: none;
  }
</style>
