<template>
  <div class="content">
    <header class="header">
      <div class="header-left">
        <span>需签署的文件：</span>
        <p style="padding-left:15px; font-size:13px;" class="text-center f-cursor pt-5 pr-15 pb-5" :class="{active:index===current}" v-for="(item,index) in operationData" :key="index" @click="handleSelectFile(index,item)">{{item.fileType}}</p>
      </div>
      <div class="header-right">
        <img class="ml-20 f-cursor" src="@/assets/images/icons/ic-account-type13.png" @click="handleClose">
      </div>
    </header>

    <div class="main clearfix">
      <iframe class="fl" :src="operationData[current] ? operationData[current].fileUrl : '' " frameborder="0" width="70%" height="700px"></iframe>
      <div class="fr main-right mr-10">
        <div class="info-top mb-10">
          <p class="info-title">签署信息</p>
          <!-- 2：待员工签署，3：待仕邦签署，5：已完成签署，7：放弃签署 -->
          <img v-if="signType===2" class="sign-type" src="@/assets/images/icons/fileSign-type2.png">
          <img v-if="signType===3" class="sign-type" src="@/assets/images/icons/fileSign-type3.png">
          <img v-if="signType===5" class="sign-type" src="@/assets/images/icons/fileSign-type5.png">
          <img v-if="signType===7" class="sign-type" src="@/assets/images/icons/fileSign-type7.png">
          <el-form class="ml-20" :inline="false" ref="signInfoForm">
            <el-form-item label="员工姓名:">
              <p>{{operationInfo.empName}}</p>
            </el-form-item>
            <el-form-item label="证件号码:">
              <p>{{operationInfo.idCard}}</p>
            </el-form-item>
            <el-form-item label="签约主体:">
              <p>{{operationInfo.optrName}}</p>
            </el-form-item>
            <el-form-item label="文件类型:">
              <p>{{signInfoForm.fileType}}</p>
            </el-form-item>
            <el-form-item label="文件名称:">
              <p>{{signInfoForm.contractName}}</p>
            </el-form-item>
          </el-form>
        </div>
        <div class="operation-center mb-10">
          <p class="info-title">签署操作</p>
          <div class="operation-btn">
            <el-button @click="handleOperation(1)" style="margin-right:50px;" class="s-btn btn--border-blue" size="small">放弃签署</el-button>
            <el-button @click="handleOperation(2)" size="small" type="primary">重新签署</el-button>
          </div>
        </div>
        <div class="record-bottom">
          <p class="info-title">操作记录</p>
          <div class="detail-box">
            <div class="detail" v-for="(item,index) in processMap" :key="index">
              <el-popover placement="left" width="300" trigger="hover">
                <div v-if="item.statusName==='发起签署'" class="mt-10 mb-10 f-cursor one-1" slot="reference">{{item.statusName}}</div>
                <div v-else class="f-cursor one-3" slot="reference">{{item.statusName}}</div>
                <el-form class="ml-20" :inline="false" ref="signInfoForm">
                  <el-form-item label="操作人:">
                    <p>{{item.createName}}</p>
                  </el-form-item>
                  <el-form-item label="操作日期:">
                    <p>{{item.createTime}}</p>
                  </el-form-item>
                  <el-form-item label="操作状态:">
                    <p>{{item.statusName}}</p>
                  </el-form-item>
                  <el-form-item label="原因:" v-if="item.statusName==='重新发起签署' || '放弃签署'">
                    <p v-text="item.cause ? item.cause : '无'"></p>
                  </el-form-item>
                </el-form>
              </el-popover>
              <img v-if="index !== processMap.length-1" src="@/assets/images/icons/bottom-jian.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重新/放弃 签署弹窗 -->
    <div v-if="dialogFormVisible" class="cause-dialog">
      <div  class="cause-view">
        <div class="title-top pl-20 mb-30">{{causeTitle}}</div>
        <el-form class="mr-30 ml-30" :model="causeForm">
          <el-form-item>
            <el-input resize="none" :placeholder="placeholderText" :rows="5" style="height:120px;" type="textarea" v-model="causeForm.cause"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="mt-30 dialog-footer">
          <el-button size="small" class="mr-50" @click="dialogFormVisible = false,causeForm.cause=''">取 消</el-button>
          <el-button size="small" type="primary" @click="handleSave">{{buttonText}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['operationInfo'],
  inject: ['reload'],
  data () {
    return {
      current: 0,
      signInfoForm: {
        fileType: '',
        contractName: ''
      },
      signType: '',
      dialogFormVisible: false,
      causeForm: {
        cause: ''
      },
      causeTitle: '',
      processMap: [],
      previewUrl: '/api/entryresign/pdfView',
      placeholderText: '',
      buttonText: '',
      warningText: '',
      id: '',
      operationData: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http({
        url: '/api/entryresign/file/fileOperate',
        method: 'post',
        data: this.$qs.stringify({
          batchNumber: this.operationInfo.batchNumber,
          empUuid: this.operationInfo.empUuid
        })
      }).then(({ data }) => {
        this.operationData = data.data
        this.signInfoForm.fileType = this.operationData[this.current].fileType
        this.signInfoForm.contractName = this.operationData[this.current].contractName
        this.signType = this.operationData[this.current].signStatus
        this.processMap = this.operationData[this.current].processMap
        this.id = this.operationData[this.current].id
      })
    },
    handleClose () {
      this.$emit('handleClose')
      this.reload()
    },
    /* 文件选择 */
    handleSelectFile (index, item) {
      this.current = index
      this.signType = item.signStatus
      this.signInfoForm.fileType = item.fileType
      this.signInfoForm.contractName = item.contractName
      this.processMap = item.processMap
      this.id = item.id
    },
    /* 放弃&重新签署 */
    handleOperation (type) {
      let that = this
      if (type === 1) {
        that.causeTitle = '放弃原因'
        that.placeholderText = '请输入放弃签署的原因'
        that.buttonText = '确定放弃'
        that.warningText = '放弃签署'
      } else {
        that.causeTitle = '重新签署原因'
        that.placeholderText = '请输入重新签署的原因'
        that.buttonText = '重新签署'
        that.warningText = '重新签署'
      }
      if (that.signType === 2 || that.signType === 3) {
        that.dialogFormVisible = true
      } else {
        that.$message.warning('只有待员工签署、待仕邦签署才允许' + that.warningText)
      }
    },
    /* 确定放弃&重新签署 */
    handleSave () {
      let that = this
      let cause = that.causeForm.cause
      if (cause === '') {
        that.$message.warning('请输入放弃/重新签署原因')
        return false
      }
      let url = ''
      let data = {}
      if (that.buttonText === '确定放弃') {
        url = '/api/entryresign/file/giveUpSign'
        data = that.$qs.stringify({
          id: that.id,
          type: that.operationInfo.useType,
          cause
        })
      } else {
        url = '/api/entryresign/file/reSign'
        data = that.$qs.stringify({
          id: that.id,
          cause
        })
      }
      that.$http({
        url,
        method: 'post',
        data
      }).then(({ data }) => {
        that.causeForm.cause = ''
        that.dialogFormVisible = false
        if (that.buttonText === '确定放弃') {
          that.signType = 7
          that.$message.success('放弃签署成功')
          that.getData()
        } else {
          that.signType = 2
          that.$message.success('重新签署成功')
          that.getData()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  position: relative;
  .header {
      display: flex;
      background: #ffffff;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      padding: 0 20px 0 29px;
      border-bottom: 20px solid #f0f2f5;
      .header-left,.header-right{
        display: flex;
        align-items: center;
      }
      .header-left{
        font-size: 13px;
        color: #222;
      }
      .header-right{
        .el-button{
          width: 100px;
          height: 32px;
        }
      }
      .active{
        border-bottom: 2px solid #409EFF;
      }
  }
  .main{
    margin-top: 65px;
    padding: 20px 0 0 20px;
    .main-right{
      width: 28%;
      .info-top,.operation-center,.record-bottom{
        border: 1px solid #ddd;
        padding: 0 10px;
        position: relative;
        .info-title{
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #ddd;
          padding-left: 10px;
        }
        .sign-type{
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .operation-center{
        .operation-btn{
          height: 60px;
          text-align: center;
          line-height: 60px;
        }
      }
      .record-bottom{
        .detail-box{
          height: 292px;
          overflow-y: scroll;
            .detail{
            display: flex;
            flex-direction: column;
            align-items: center;
            .one-1{
              width: 75px;
              height: 32px;
              background: #93D34D;
              color: #fff;
              text-align: center;
              line-height: 32px;
              border-radius:2px;
            }
            .one-3{
              width: 121px;
              height: 62px;
              text-align: center;
              line-height: 62px;
              background: url('../../assets/images/icons/rhombus.png') no-repeat;
            }
          }
        }
      }
    }
  }
  .cause-dialog{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .cause-view{
      position: fixed;
      width: 600px;
      height: 335px;
      border-radius: 5px;
      background: #fff;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -55%);
      text-align: center;
      border: 1px solid #ddd;
      .title-top{
        font-size: 18px;
        height: 60px;
        line-height: 60px;
        text-align: left;
        border-bottom: 1px solid #BFBFBF;
      }
    }
  }
}
/deep/.el-form-item{
  margin-bottom: 0px !important;
}
</style>
