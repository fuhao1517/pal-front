<template>
  <div class="spl-container content">
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="clearfix">
        <div class="pt-20 ml-20 fl header-left">
          <addrSelector placeholder="请选择参保地" ref="addrSelector" v-model="socialOrAccfund.addrVal" :addrArr="socialOrAccfund.allAddr" @change="selectaddrVal"></addrSelector>
        </div>
        <div class="fr mr-20 pt-30 header-right" @click="lookVideo">
          <img class="video-ico" src="@/assets/images/policyQuery/video-ico.png" alt="">
          <span class="video-text">视频讲解：广州</span>
        </div>
    </header>
    <div class="bottom-box mt-20 ml-20 mr-20">
      <nav class="left-nav mr-20">
        <div style="height:50px;">
          <splTab :tabs="tabs" v-model="active" @changeTab="changeTab"></splTab>
        </div>
        <div class="policy-group pt-50">
          <p class="group-title" v-text="active===0?'社保政策分组：':'公积金政策分组：'"></p>
          <el-tree :highlight-current="true" :data="socialOrAccfundPolicyInfoArr" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false" :check-on-click-node="true"></el-tree>
        </div>
      </nav>
      <div class="right-box">
          <p class="right-box-title">
            <span>内容</span>
          </p>
          <div class="right-content" v-if="isDetail===1">
            <div class="name-time">
              <span class="issuer">发布人：{{createName}}</span>
              <span class="release-time">发布时间：{{createTime}}</span>
            </div>
            <div v-html="socialOrAccfundInfoDetail" class="content-detail"></div>
          </div>
          <div class="empty-bg-box" v-if="isDetail===0">
            <img class="empty-bg" src="@/assets/images/policyQuery/empty-bg.png" alt="">
            <span>暂无政策</span>
          </div>
      </div>
    </div>

    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="请选择参保地" :visible.sync="dialogFormVisible" width="520px" :show-close="true">
      <div class="mt-90">
        <div class="all-addr-box ml-50">
          <span>参保地：</span>
          <addrSelector placeholder="请选择参保地" v-model="socialOrAccfund.addrVal" :addrArr="socialOrAccfund.allAddr"></addrSelector>
          <p class="attention ml-70">注：选定参保地后才能查看对应参保地政策内容。</p>
        </div>
        <div class="footer-btn mt-110">
          <el-button size="small" class="mr-60" @click="dialogFormVisible=false,socialOrAccfund.addrVal=''">取消</el-button>
          <el-button size="small" type="primary" @click="selectaddrVal">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="广州政策讲解" :visible.sync="dialogFormVisibleVideo" width="840px" :show-close="true">
        <video controls preload="auto" width="800px" height="600px">
            <source src="http://www.seebon.com/vedio/2020socialaccfundinfo.mp4" type="video/mp4">
        </video>
    </el-dialog>
  </div>
</template>

<script>
import splTab from '../../components/common/spl-tab'
import addrSelector from '../../components/common/addrSelector'
export default {
  components: { addrSelector, splTab },
  data () {
    return {
      pathData: [{ name: '首页' }, { name: '政策查询' }, { name: '政策信息库' }],
      socialOrAccfund: {
        allAddr: [],
        addrVal: '',
        addrValId: ''
      },
      tabs: ['社保', '公积金'],
      active: 0,
      socialOrAccfundPolicyInfoArr: [],
      dialogFormVisible: true,
      dialogFormVisibleVideo: false,
      isDetail: 0,
      createName: '',
      createTime: '',
      socialOrAccfundInfoDetail: '',
      defaultProps: {
        children: '',
        label: 'groupName'
      }
    }
  },
  mounted () {
    this.getAddr()
    this.getSocialOrAccfundPolicyInfo(0)
  },
  methods: {
    handleNodeClick (data) {
      if (this.socialOrAccfund.addrVal === '') {
        this.$message.warning('请选择参保地！')
      } else {
        this.findSocialOrganizationDetail(data.id)
      }
    },
    /* 选择参保地 */
    selectaddrVal () {
      this.socialOrAccfund.addrValId = this.$refs.addrSelector.getIdByAddrName(this.socialOrAccfund.addrVal)
      this.dialogFormVisible = false
    },
    /* tab切换 */
    changeTab (item) {
      this.getSocialOrAccfundPolicyInfo(item.active)
    },
    /* 获取参保地 */
    getAddr (type) {
      this.$http({
        url: '/api/social/claims/accidentstep/getSocialAddr',
        method: 'get',
        params: {}
      }).then(({ data }) => {
        this.socialOrAccfund.allAddr = data.data[0]
      })
    },
    /* 获取社保&公积金政策信息分组结构 */
    getSocialOrAccfundPolicyInfo (active) {
      let url = ''
      if (active === 0) {
        url = '/api/policyinfo/policy/searchSocialOrganization'
        this.defaultProps.children = 'policySocialOrganizationList'
      } else {
        url = '/api/policyinfo/policy/searchAccfundOrganizationByPolicyAddrId'
        this.defaultProps.children = 'policyAccfundOrganizationList'
      }
      this.$http({
        url,
        method: 'post',
        data: {}
      }).then(({ data }) => {
        this.socialOrAccfundPolicyInfoArr = data.data[0]
      })
    },
    /* 获取社保&公积金政策信息查看详情 */
    findSocialOrganizationDetail (id) {
      let url = ''
      if (this.active === 0) {
        url = '/api/policyinfo/policy/findSocialOrganizationDetailByOrgId'
      } else {
        url = '/api/policyinfo/policy/findAccfundOrganizationDetailByOrgId'
      }
      this.$http({
        url,
        method: 'post',
        data: this.$qs.stringify({
          organizationId: id,
          policyAddrId: this.socialOrAccfund.addrValId
        })
      }).then(({ data }) => {
        let res = data.data[0]
        if (res) {
          this.createName = res.createName
          this.createTime = res.createTime
          if(res.socialInfoDetail){
            this.socialOrAccfundInfoDetail = res.socialInfoDetail
          }
          if(res.accfundInfoDetail){
            this.socialOrAccfundInfoDetail = res.accfundInfoDetail
          }
          this.isDetail = 1
        } else {
          this.isDetail = 0
        }
      })
    },
    /* 视频讲解 */
    lookVideo () {
      this.dialogFormVisibleVideo = true
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.el-input.el-input--suffix{
    width: 320px !important;
  }
  .content{
    .all-addr-box{
      .attention{
        color:#FF2424;
        margin-top: 13px;
      }
    }
    .footer-btn{
      text-align: center;
      .el-button.el-button--small{
        width: 90px !important;
      }
    }

    header{
      .header-left{
        /deep/.el-input.el-input--suffix{
          width: 280px !important;
        }
      }
      .header-right{
        display: flex;
        align-items: center;
        cursor: pointer;
        .video-ico{
          width: 20px;
          height: 14px;
          margin-right:8px;
        }
        .video-text{
          font-size: 12px;
          color: #3DA5FC;
        }
      }

    }
    .bottom-box{
      display: flex;
      height: 668px;
      padding-bottom: 17px;
      position: relative;
      .left-nav{
        width: 280px;
        border: 1px solid #ddd;
        cursor: pointer;
        /deep/.spl-tabs0{
          width: 280px;
          height: 50px;
          position: absolute;
          left: 1px;
          top: 1px;
        }
        /deep/.spl-tabs0 .spl-tabs-header .span-tabs{
          min-width: 110px !important;
        }
        .policy-group{
          height: 615px;
          overflow-y: scroll;
          overflow-x: hidden;
          .group-title{
            margin: 20px 0 0 20px;
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
      .right-box{
        flex: 1;
        border: 1px solid #ddd;
        position: relative;
        overflow-y: scroll;
        .right-box-title{
          width: 100%;
          height: 50px;
          line-height: 50px;
          background: #F8F8F8;
          span{
            margin-left: 21px;
          }
        }
        .right-content{
          padding-left: 20px;
          .name-time{
            color: #777777;
            font-size: 14px;
            margin: 20px 0;
            .issuer{
              margin-right: 42px;
            }
          }

        }
        .empty-bg-box{
            width: 264px;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -125px;
            margin-left: -132px;
          .empty-bg{
            width: 264px;
            height: 166px;
            margin-bottom: 30px;
          }
          span{
            font-size: 14px;
            color: #C3C3C3;
          }
        }
      }
    }
  }
</style>
