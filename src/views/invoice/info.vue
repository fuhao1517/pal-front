<template>
  <div class="spl-container">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="clearfix">
      <p class="fl header-left">发票信息</p> <img v-if="eTicket=='2'" class="ml-20 fl" src="@/assets/images/icons/invoice2.png">
    </header>
    <div class="info-content">
      <div class="m-bill02 mb-15" v-for="(item, index) in recipientSettings" :key="'recipientSettings' +index">
        <table style="margin-bottom:0px;" class="table table-bordered td-font01 pd-8 mb-0 td-h30 normal">
          <tbody>
          <tr>
            <td class="text-center bold bg-F0F1F5" rowspan="4" style="width: 25px;">购买方</td>
            <td class="bold w-140">付款方名称</td>
            <td class="w-p30">{{item.payerName}}</td>
            <td class="bold w-140">付款方开户行</td>
            <td class="w-p30">{{item.payerBankName}}</td>
          </tr>
          <tr>
            <td class="bold">纳税人识别号</td>
            <td>{{item.payerIdentifier}}</td>
            <td class="bold">付款方账号</td>
            <td>{{item.payerAccount}}</td>
          </tr>
          <tr>
            <td class="bold">付款方地址</td>
            <td>{{item.payerAddress}}</td>
            <td class="bold">付款方电话</td>
            <td>{{item.payerPhone}}</td>
          </tr>
          <tr>
            <td class="bold">备注</td>
            <td colspan="3">{{item.receiptComment}}</td>
          </tr>
          </tbody>
        </table>
        <table class="table table-bordered normal text mb-0 th-h30 td-h30 bor-t-n">
          <thead class="thead-bg01">
          <tr>
            <th class="bg-F0F1F5 th-bor wd-03 text-c">业务类别</th>
            <th class="bg-F0F1F5 th-bor text-c wd-03">预计开票日期</th>
            <th class="bg-F0F1F5 th-bor text-c wd-03">自动申请开票</th>
            <th class="bg-F0F1F5 th-bor text-c wd-03">发票类型</th>
            <th class="bg-F0F1F5 th-bor text-c wd-05">计税项</th>
            <th class="bg-F0F1F5 th-bor text-c wd-05">差额增税项</th>
            <th class="bg-F0F1F5 th-bor text-c wd-05">开票项目名称</th>
          </tr>
          </thead>
          <tbody>
          <tr class="itemsub" v-for="(r, ind) in item.recipientItems" :key="'recipientItems' + ind">
            <td>
              {{r.customerTypeName}}
            </td>
            <td align="center">
              {{r.planInvoiceMonthName}}{{r.planInvoiceDay}}日
            </td>
            <td class="bor-r-n" align="center">
              {{r.autoApplyInvoiceName}}
            </td>
            <td align="center">
              {{r.invoiceType}}
            </td>
            <td class="pd-0" colspan="4">
              <table class="table table-bordered normal text mb-0 th-h30 td-h30 bor-t-n">
                <tbody class="typebody">
                <tr class="typesub" v-for="(ti, i) in r.taxItems" :key="'taxItems' + i">
                  <td class="w-p20">
                    {{ti.taxItems}}
                  </td>
                  <td class="w-p20">
                    {{ti.balanceIncTaxItems}}
                  </td>
                  <td class="w-p20">
                    {{ti.projectName}}
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="panel panel-default m-panel06 nonReceiptSurcharge-panel mt-10" v-if="item.nonReceiptItems.length>0">
          <div class="panel-heading panel-heading01">
            <label class="font-col">
              <div class="u-actbtn01 fl mr-5 nonReceiptSwitch" data-settingIndex="0" a="on" style="background: #3DA5FC;">
                <!--<div class="u-actbtn01 fl mr-5 nonReceiptSwitch" data-settingIndex="0" a="off" style="background: rgb(204, 204, 204);">-->
                <span></span>
                <span></span>
                <div style="left: 22px"></div>
              </div>
              <div style="left: 1px"></div>
              <span>不到账开票设置</span>
            </label>
          </div>
          <div class="panel-body pt-10 nonReceiptContent">
            <table class="table table-bordered normal text mb-0 th-h30 td-h30 bor-r-n">
              <thead class="thead-bg01">
              <tr>
                <th class="th-bor text-c w-130">业务类型</th>
                <th class="th-bor text-c w-130">附加费名目</th>
                <!-- <%&#45;&#45;
                 <th class="th-bor text-c" style="width: 130px">发票类型</th>
                 &#45;&#45;%>-->
                <th class="th-bor text-c" style="width: 130px">发票所属类别</th>
                <th class="th-bor text-c" style="width: 150px">是否计入税收管理费</th>
                <th class="th-bor text-c" style="width: 130px">登账附件类型</th>
              </tr>
              </thead>
              <tbody class="itembody nonReceipt-tbody">
              <tr class="typesub" v-for="(nr,j) in item.nonReceiptItems" :key="'nonReceiptItems'+j">
                <td align="center">
                  {{nr.customerTypeName}}
                </td>
                <td align="center">{{nr.addfeeitem}}</td>
                <!-- <%&#45;&#45;
                 <td align="center">
                   <c:if test="${non.invoiceType=='20031001'}">增值税专用发票</c:if>
                   <c:if test="${non.invoiceType=='20031002'}">增值税普通发票</c:if>
                 </td>
                 &#45;&#45;%>-->
                <td align="center">
                  {{nr.invoiceUnderType}}
                </td>
                <td align="center">
                  {{nr.ifTaxmanageFeeName}}
                </td>
                <td align="center">
                  {{nr.accountAttachType}}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <div class="panel panel-default m-panel06 mt-15 send-info">
      <div class="panel-heading panel-heading01">
        <i class="ic-contract-1">发票寄送信息</i>
      </div>
      <div class="panel-body pt-0">
        <div class="pl-10">
          <div class="row m-frm01 pt-0 clearfix">
            <div class="col-md-6">
              <label class="lab">发票收件人：</label>
              <label class="text w-p14">
                {{recipient}}
              </label>
            </div>
            <div class="col-md-6">
              <label class="lab">收件人电话：</label>
              <label class="text w-p14">
                {{recipientPhone}}
              </label>
            </div>
          </div>
          <div class="row m-frm01 pt-0 clearfix">
            <div class="col-md-6">
              <label class="lab">发票寄送地址：</label>
              <label class="text">
                {{recipientAddress}}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'info',
  data () {
    return {
      // 导航
      pathData: [{ name: '发票管理' }, { name: '企业开票信息' }],
      id: '',
      recipientSettings: [],
      recipient: '',
      recipientAddress: '',
      recipientPhone: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.getInvoiceInfo()
    })
  },
  methods: {
    getInvoiceInfo () {
      this.$http({
        url: '/api/receipt/getInvoiceInfo',
        method: 'post'
      }).then(({ data }) => {
        let d = data.data[0]
        this.recipientPhone = d.recipientPhone
        this.recipientAddress = d.recipientAddress
        this.recipient = d.recipient
        let recipientSettings = d.recipientSettings
        for (let i in recipientSettings) {
          let item = {}
          item.payerName = recipientSettings[i].payerName
          item.payerBankName = recipientSettings[i].payerBankName
          item.payerIdentifier = recipientSettings[i].payerIdentifier
          item.payerAccount = recipientSettings[i].payerAccount
          item.payerAddress = recipientSettings[i].payerAddress
          item.payerPhone = recipientSettings[i].payerPhone
          item.receiptComment = recipientSettings[i].receiptComment

          let receiptItems = recipientSettings[i].nonReceiptItems
          item.nonReceiptItems = []
          for (let j in receiptItems) {
            let non = {}
            non.customerTypeName = receiptItems[j].customerTypeName
            non.addfeeitem = receiptItems[j].addfeeitem
            non.invoiceUnderType = receiptItems[j].invoiceUnderType
            non.ifTaxmanageFeeName = receiptItems[j].ifTaxmanageFeeName
            non.accountAttachType = receiptItems[j].accountAttachType
            item.nonReceiptItems.push(non)
          }

          let recipientItems = recipientSettings[i].recipientItems
          item.recipientItems = []
          for (let j in recipientItems) {
            let recipientItem = {}
            recipientItem.customerTypeName = recipientItems[j].customerTypeName
            recipientItem.planInvoiceMonthName = recipientItems[j].planInvoiceMonthName
            recipientItem.planInvoiceDay = recipientItems[j].planInvoiceDay
            recipientItem.autoApplyInvoiceName = recipientItems[j].autoApplyInvoiceName
            recipientItem.invoiceType = recipientItems[j].invoiceType
            recipientItem.taxItems = recipientItems[j].taxItems
            recipientItem.balanceIncTaxItems = recipientItems[j].balanceIncTaxItems
            recipientItem.projectName = recipientItems[j].projectName

            recipientItem.taxItems = []
            let t = recipientItems[j].taxVO
            for (let j in t) {
              let ti = {}
              ti.taxItems = t[j].taxItems
              ti.balanceIncTaxItems = t[j].balanceIncTaxItems
              ti.projectName = t[j].projectName
              recipientItem.taxItems.push(ti)
            }
            item.recipientItems.push(recipientItem)
          }

          this.recipientSettings.push(item)
        }
      }).catch(data => {
      })
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
        font-size:18px;
        font-weight: bold;
      }
    }
  .table{
    margin-bottom: 0;
  }
  .info-content{
    padding: 10px;
  }
  .send-info{
    border: 1px solid #dddddd;
    .m-frm01{
      padding-top: 5px;
    }
  }
  .nonReceiptSurcharge-panel{
    .table{
      border-top: 1px solid #F0F1F5;
    }
    .thead-bg01{
      background-color: #F8F8F8;
      .th-bor{
        border-color: #F0F1F5;
        text-align: left;
      }
    }
    .nonReceiptContent{
      padding: 10px 20px;
    }
    .nonReceipt-tbody{
      td{
        border-color: #F0F1F5;
      }
    }
  }
  .table > thead > tr > th, .table > tbody > tr > td{
    text-align: left;
  }
  .typebody{
    tr:last-of-type{
      td{
        border-bottom: none;
      }
    }
    tr:first-of-type{
      td{
        border-top: none;
      }
    }
    td:first-of-type{
      border-left: none;
    }
  }
</style>
