<template>
  <div class="content spl-container">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>

    <div class="search-row mt-20">
            <el-row :gutter="20">
              <el-col :span="8">
                <span class="inlineBlock text-right mr-5 pl-20 required-pre">参保地：</span>
                <addrSelector width="100%" class="addr-input" v-model="search.addrVal" :addrArr="search.allAddr" @changeAddrSelect="getAddrId"></addrSelector>
              </el-col>
              <el-col :span="10">
                <span>类型：</span>
                <el-select v-model="search.type" placeholder="请选择" class="mr-20 type-select">
                  <!-- 0是工伤，1是生育 -->
                  <el-option label="工伤" value="0"></el-option>
                  <el-option label="生育" value="1"></el-option>
                </el-select>
                <el-button type="primary" @click="query">查询</el-button>
              </el-col>
            </el-row>
    </div>
    <div class="split-line"><div class="line"></div></div>

    <div class="content-b">
      <!-- 0是工伤，1是生育 -->
      <p class="type-title">{{flowType==0?'工伤':'生育'}}</p>

      <div class="text-center" v-if="flowStatus==0">
        <img class="policy-nodata" src="@/assets/images/policy-nodata.png" alt />
        <p class="nodata-text mb-30">请选择参保地以查询当地理赔政策！</p>
      </div>

      <div class="text-center" v-else-if="flowStatus==1">
        <img class="policy-nodata" src="@/assets/images/policy-addr-nodata.png" alt />
        <p class="nodata-text mb-30">当前参保地暂未设置{{flowType==0?'工伤':'生育'}}理赔流程，如有需要请联系客服！</p>
      </div>
 
      <div v-else-if="flowStatus==2">
        <div class="flow-area">
          <div class="area-header">流程图 <i class="el-icon-zoom-in icon-onsize font-20 ml-10" :class="{'diaable-icon-onsize':scalc==1}" @click="handleScale(0)"></i> <i @click="handleScale(1)"  :class="{'diaable-icon-onsize':scalc==0.1}" class="el-icon-zoom-out icon-onsize font-20 ml-10"></i></div>
          
          <flowImg ref="flowImgMain" :flowData="flowData" :scaleStyle="scaleStyle" :flowType="flowType" @handleClickStep="handleClickStep"></flowImg>
         
        </div>

        <div class="flow-detail-area">
            <!-- 生育 20301001：生育报备申请， 20301002：生育待遇报销申请-->
          <div class="area-header">{{stepCode=='20301001'?'备案申请':stepCode=='20301002'?'待遇报销申请':stepName}}-流程资料信息</div>
          <div class="flow-info">
            <!-- 有子流程 -->
            <div v-if="haveChild">
              <p class="dialog-box-title">{{stepCode=='20301001'?'备案申请':stepCode=='20301002'?'待遇报销申请':stepName}}流程图</p>
              <flowImg :flowData="flowDataChild" :isChild="true" :flowType="flowType" :stepCode="stepCode" @handleClickStep="handleClickStep"></flowImg> 
              

              <div class="dialog-box" :class="{'dialog-box-birth': stepCode=='20301002'}">  
                <span class="arrow bot"></span>  
                <span class="arrow top"></span>  
                <!-- 有资料信息 -->
                <!--  flowInfoChild: {fileInfo: [], resoureItemInfoList: [], otherInfo: '', attentionInfo: ''}, // 子流程-资料信息 -->
                <div class="info-detail" v-if="flowInfoChild.fileInfo.length!=0||flowInfoChild.resoureItemInfoList.length!=0||flowInfoChild.otherInfo!=''||flowInfoChild.attentionInfo!=''">

                  <el-row :gutter="24">
                    <el-col :span="12" class="info-detail-l">
                      <div class="info-type">
                        <p class="info-title">附件资料</p>
                        <div class="info-content">
                          <ul>
                            <li v-for="item in flowInfoChild.fileInfo" :key="item.fileId" @click="downFile(item.fileId)"><i class="ic-excel"></i><span class="text">{{item.fileName}}</span><i class="ic-download"></i></li>
                          </ul>
                        </div>
                      </div>
                      <div class="info-type info-type-b">
                        <p class="info-title">主题信息</p>
                        <div class="info-item-list" v-for="(item,index) in flowInfoChild.resoureItemInfoList" :key="item.id">
                          <p class="item-title">{{index+1}}、主题{{index+1}}：{{item.resourceName}}</p>
                          <ul>
                            <li class="" v-for="(it, ind) in item.resourceItemlist" :key="it.id">{{ind+1}}、{{it.itemName}}</li>
                          </ul>
                        </div>
                      </div>
                    
                    </el-col>
                    <el-col :span="12" class="info-detail-r">
                    <div class="info-type">
                        <p class="info-title">其他资料</p>
                        <div class="info-content">
                          <p class="info-desc">{{flowInfoChild.otherInfo}}</p>
                        </div>
                    </div>
                      <div class="info-type info-type-b">
                        <p class="info-title">注意事项</p>
                        <div class="info-content">
                          <p class="info-desc">{{flowInfoChild.attentionInfo}}</p>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <!-- 没有资料信息 -->
                <div class="text-center" v-else>
                  <img class="policy-nodata" style="margin-top: 30px" src="@/assets/images/policy/info-nodata.png" alt />
                  <p class="nodata-text mb-30">未找到资料信息</p>
                </div>
              </div>
            </div>
              <!-- 没有子流程 -->
            <div class="text-center" v-else>
              <img class="policy-flow-nodata" src="@/assets/images/policy-flow-nodata.png" alt />
              <p class="nodata-text">流程暂缺</p>
            </div>

            </div>
          </div>
        </div>
      </div>

      <el-dialog title="请选择参保地" :visible.sync="dialogFormVisible" width="520px" :show-close="true" :close-on-click-modal="false">
        <div class="mt-90">
          <div class="all-addr-box ml-50">
            <span>参保地：</span>
            <addrSelector v-model="search.addrVal" :addrArr="search.allAddr" @changeAddrSelect="getAddrId"></addrSelector>
            <p class="attention ml-70">注：选定参保地后才能查看对应参保地政策内容。</p>
          </div>
          <div class="text-center mt-110">
            <el-button size="small" class="mr-60 w-90" @click="dialogFormVisible=false,search.addrVal=''">取消</el-button>
            <el-button size="small" class="w-90" type="primary" @click="query">确认</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import addrSelector from '../../components/common/addrSelector'
import flowImg from '../../components/common/flow-img'
export default {
  components: {addrSelector, flowImg},
  data () {
    return {
      pathData: [{ name: '政策查询' }, { name: '理赔指引' }],
      search: {
        allAddr: [],
        addrVal: '',
        addrId: '',
        type: '0'
      },
      flowType: '0',  // 传到流程组件里的type
      flowStatus: 0,  // 0: 请选择参保地, 1: 当前参保地暂未设置, 2: 当前参保地有流程
      flowData: [], //  主流程
      flowDataChild: [], // 子流程-流程
      flowInfoChild: {fileInfo: [], resoureItemInfoList: [], otherInfo: '', attentionInfo: ''}, // 子流程-资料信息
      stepName: '',
      stepCode: '',
      haveChild: true,
      dialogFormVisible: true,
      scalc: 1,
      marginLeft: 20,
      scaleStyle: {
        
      }
    }
  },
  watch: {
    
  },
  computed: {
    
  },
  mounted () {
    this.getAddr()
    window.addEventListener("resize", this.onresizeHandle);
  },
  destroyed() {
    window.removeEventListener("resize", this.onresizeHandle);
  },
  methods: {
    onresizeHandle (){
      console.log('onresizeHandle22')
      if(!this.$refs.flowImgMain){
        return false
      }
      let flowImgDivWidth = this.$refs.flowImgMain.$refs.componertFlowImgDiv.offsetWidth
      let flowImgWidth = this.$refs.flowImgMain.$refs.componertFlowImg.offsetWidth
      if(flowImgDivWidth>(flowImgWidth)){
        this.scalc = 1
        this.marginLeft = 20
        this.scaleStyle = {
          transform: 'scale('+this.scalc+')',
          marginLeft: this.marginLeft + 'px'
        }
        return false
      }
      let scalc = flowImgDivWidth/flowImgWidth
      let marginLeft = -(flowImgWidth-flowImgDivWidth)/2
      scalc = scalc>1?1:scalc-0.05
      this.scalc = scalc
      this.marginLeft = marginLeft
      this.scaleStyle = {
        transform: 'scale('+scalc+')',
        marginLeft: marginLeft+'px'
      }
    },
    // 放大缩小
    handleScale (type) {
      let scalc = this.scalc
      if(type==0){
        // 放大
        if(scalc>1){
          return false
        }
        let flowImgWidth = this.$refs.flowImgMain.$refs.componertFlowImg.offsetWidth
        this.scalc += 0.1
        if(this.scalc>1){
          this.scalc = 1
          this.marginLeft += (flowImgWidth*(1-scalc))/2
        }else{
          this.marginLeft += (flowImgWidth*0.1)/2
        }
        this.scaleStyle = {
          transform: 'scale('+this.scalc+')',
          marginLeft: this.marginLeft + 'px'
        }
      }else{
        // 缩小
        if(scalc<0.1){
          return false
        }
        console.log(this.$refs.flowImgMain.$refs.componertFlowImg.offsetWidth)
        let flowImgWidth = this.$refs.flowImgMain.$refs.componertFlowImg.offsetWidth
        this.scalc -= 0.1
        if(this.scalc<0.1){
          this.scalc = 0.1
          this.marginLeft -= (flowImgWidth*(scalc-0.1))/2
        }else{
          this.marginLeft -= (flowImgWidth*0.1)/2
        }
        this.scaleStyle = {
          transform: 'scale('+this.scalc+')',
          marginLeft: this.marginLeft + 20 + 'px'
        }
      }
      
    },
     // 获取参保地
    getAddr(type) {
      this.$http({
        url: '/api/social/claims/accidentstep/getSocialAddr',
        method: 'get'
      }).then(({data}) => {
        this.search.allAddr = data.data[0]
      })
    },
    getAddrId(item) {
      console.info(item)
      this.search.addrId = item.id
    },
    query(){
      if(this.search.addrVal==''){
        this.$message.warning('请选择参保地')
        this.flowStatus = 0
        return false
      }
      this.flowType = this.search.type
      let that = this
       this.$http({
        url: '/api/social/claims/accidentstep/queryJobStepList',
        method: 'post',
        data: that.$qs.stringify({addressId: that.search.addrId, claimsType: that.search.type})
      }).then(({data}) => {
        that.dialogFormVisible = false
        if(data.data[0]&&data.data[0].length>0){
          that.flowData = data.data[0]
          that.flowStatus = 2
        }else{
          that.flowStatus = 1
        }
        
        this.$nextTick(() => {
          that.onresizeHandle()
        })
            
      })
    },
    handleClickStep(obj){
      let that = this
      this.stepCode = obj.stepCode
      this.$http({
        url: '/api/social/claims/accidentstep/workingInjuryDataEdit',
        method: 'post',
        data: that.$qs.stringify({addressName: obj.addressName, socialConfigId: Number(obj.socialConfigId), stepCode: obj.stepCode})
      }).then(({data}) => {
        // if(data.data[0]&&data.data[0].length>1){
          // that.haveChild = true
          var res = data.data[0]
          var infoObj = {fileInfo: res.fileInfo, resoureItemInfoList: [], otherInfo: '', attentionInfo: ''}
          res.resoureItemInfoList.forEach(it => {
          if(it.resourceType==0){
            //  主题
            infoObj.resoureItemInfoList.push(it)
          }else if(it.resourceType==1){
            //  其他资料
            infoObj.otherInfo += it.resourceName
          }else if(it.resourceType==2){
            //  注意事项
            infoObj.attentionInfo += it.resourceName
          }
          })
          
          that.flowInfoChild = infoObj
          let stepName = obj.stepName
          that.stepName = stepName
          // flowDataChild 处理子流程
          if(this.search.type==0){
            // 工伤
            
            var flowDataChild = []
            if(stepName=="工伤报备"){
              flowDataChild = [{stepName: '提交资料'},{stepName: '资料复核'}]
            }else if(stepName=="工伤认定"){
              flowDataChild = [{stepName: '提交资料'},{stepName: '资料复核'},{stepName: '接收受理通知书'},{stepName: '接收认定结果'},{stepName: '查看认定结果'}]
            }else if(stepName=="异地鉴定"||stepName=="劳动能力鉴定"){
              flowDataChild = [{stepName: '提交资料'},{stepName: '资料复核'},{stepName: '接收受理通知书'},{stepName: '接收鉴定结果'},{stepName: '客服接收鉴定结果'}]
            }else{
              flowDataChild = [{stepName: '提交资料'},{stepName: '资料复核'},{stepName: '接收受理通知书'},{stepName: '接收审核结果'},{stepName: '客服接收审核结果'}]
            }
            this.flowDataChild = flowDataChild
          }else{
            // 生育 <!-- 20301001：生育报备申请， 20301002：生育待遇报销申请 -->
            
          }
          
        // }else{
        //   that.haveChild = false
        // }
        
      })
    },

     //  下载文件
    downFile (fileId) {
      this.$downloadFile('/api/file/download/' + fileId, 'get', {})
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  // height: 100%;
  // position: relative;
}
.addr-input{
  width: calc(100% - 100px);;
  max-width: 280px;
}
.type-select{
  width: calc(100% - 170px);;
  max-width: 280px;
}
.split-line{
  padding: 0 20px;
  .line{
    border-top: 1px solid #DDDDDD;
  }
}
.type-title{
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  padding: 15px 0;
}
.content-b{
  // width: 100%;
  // height: calc(100% - 140px);
  // background-color: pink;
  // position: absolute;
  padding: 0 40px 10px 40px;
  .policy-nodata{
    display: inline-block;
    margin-top: 100px;
  }
  .policy-flow-nodata{
    display: inline-block;
    margin-top: 60px;
    margin-bottom: 30px;
  }
  .nodata-text{
    font-size: 14px;
    color: #C3C3C3;
  }
}
.flow-area{
  border: 1px solid #DDDDDD;
  width: 100%;
  // height: 305px;
  margin-bottom: 15px;
}
.area-header{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #F8F8F8;
  font-size: 14px;
  color: #303133;
  padding-left: 20px;
  box-sizing: border-box;
}
.flow-detail-area{
  border: 1px solid #DDDDDD;
  width: 100%;
  position: relative;
  .dialog-box-title{
    position: absolute;
    top: 70px;
    left: 20px;
    font-size: 14px;
    color: #303133;
    // padding-left: 20px;
  }
  /deep/.el-row{
    margin: 0!important;
  }
  .info-detail-l{
    border-right: 1px solid  #DDDDDD;
    padding: 0 20px!important;
  }
  .info-detail-r{
    padding: 0 20px!important;
  }
  .info-type{
    min-height: 85px;
    border-bottom: 1px solid #DDDDDD;
    padding-bottom: 15px;
  }
  .info-type-b{
    border-bottom: none;
    padding-top: 15px;
    .info-item-list{
       font-size: 14px;
        color: #606266;
        padding-left: 20px;
      .item-title{
       margin-top: 15px;
      }
      ul{
        margin: 0;
        padding: 0;
      }
      li{
        margin-top: 15px;
        padding-left: 20px;
      }
    }
  }
  .info-title{
    font-size: 14px;
    font-weight: bold;
    color: #303133;
  }
  .info-content{
    font-size: 14px;
    color: #606266;
    padding-left: 20px;
    ul{
      margin: 0;
      padding: 0;
    }
    li{
      display: inline-block;
       margin-right: 50px;
       margin-top: 15px;
       cursor: pointer;
       .text{
          vertical-align: middle;
       }
    }
    .ic-excel{
      display: inline-block;
      width: 15px;
      height: 16px;
      vertical-align: middle;
      background: url("../../assets/images/icons/ic-excel.png");
       margin-right: 10px;
    }
    .ic-download{
      display: inline-block;
      width: 14px;
      height: 14px;
      background: url("../../assets/images/icons/ic-account-type35.png");
      vertical-align: middle;
      margin-left: 10px;
    }
    .info-desc{
      margin-top: 15px;
    }
  }
}
.flow-info{
  padding: 15px 20px 30px 20px;
  box-sizing: border-box;
}
.dialog-box {  
  position: relative;  
  box-shadow: 0px 0px 3px 0px rgba(20, 91, 55, 0.35);
  min-height: 200px;
  padding: 22px 0;
  box-sizing: border-box;
  span.arrow {  
    width:0;   
    height:0;   
    font-size:0;   
    overflow:hidden;   
    position:absolute;  
    &.bot{  
      border-width: 15px;   
      border-style: solid dashed dashed;   
      border-color: transparent transparent #DDDDDD transparent;   
      left: 166px;   
      top: -30px;  
    }  
    &.top{  
      border-width:13px;   
      border-style:solid dashed dashed;   
      border-color:transparent transparent #fff transparent;   
      left:168px;   
      top:-26px;  
    }  
  }  
}
.dialog-box-birth{
  span.arrow { 
    &.bot{  
      left: 265px;   
    }  
    &.top{   
      left:267px;  
    }  
  }
}
.all-addr-box{
  .attention{
    color:#FF2424;
    margin-top: 13px;
  }
  .footer-btn{
      text-align: center;
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
}
.icon-onsize{
  vertical-align: middle;
  cursor: pointer;
  color: #3DA5FC;
}
.diaable-icon-onsize{
  color: #dddddd;
  cursor: default;
}
    
</style>
