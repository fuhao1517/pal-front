<template>
<div ref="componertFlowImgDiv" class="flow-img-div" :class="{'have-stepVOList-div':stepVOListIndex!='', 'flow-img--div-sm': isChild, 'have-flow-birth-apply': flowType==1, 'child-flow-birth-apply': isChild&&stepCode=='20301002'&&flowType==1}">
  <!-- 主流程-工伤 -->
    <div ref="componertFlowImg" class="flow-img clearfix" v-if="!isChild&&flowType==0" :style="[{width: stepVOListIndex!=''?215+152*flowData.length+66+'px':215+152*flowData.length+'px'},scaleStyle]">
                <div class="flow-node start-end">开始</div>
                <div class="fl clearfix" v-for="(item, index) in flowData" :key="item.id">
                  <!-- <span>{{stepVOListIndex==''}}</span>
                  <span>{{!(item.stepVOList&&item.stepVOList.length>0)&&stepVOListIndex!=(index+1)}}</span> -->
                    <i class="ic-flow-arrow" v-if="stepVOListIndex==''||(!(item.stepVOList&&item.stepVOList.length>0)&index!=(stepVOListIndex+1))"></i>
                    <!-- 有并列流程 -->
                    <div  class="fl cleafix" v-if="item.stepVOList&&item.stepVOList.length>0">
                        <i class="ic-flow-arrow2-l"></i>
                        <div class="arrow2-area">
                          <div class="arrow2-area-t clearfix">
                            <div class="flow-node node-core" :class="{'have-sign': flowType==0, active: active==index+'0'}" @click="handleClickStep(item.stepVOList[0], index+'0')">
                              <p class="text">{{item.stepVOList[0].stepName}}</p>
                              <div class="detail-sign">...</div>
                              </div>
                          </div>
                          <div class="arrow2-area-b clearfix">
                            <div class="flow-node node-core" :class="{'have-sign': flowType==0, active: active==index+'1'}" @click="handleClickStep(item.stepVOList[1], index+'1')">
                              <p class="text">{{item.stepVOList[1].stepName}}</p>
                              <div class="detail-sign">...</div>
                              </div>
                        </div>
                        </div>
                        <i class="ic-flow-arrow2-r"></i>
                    </div>
                    <!-- 单一流程 -->
                    <div class="fl cleafix" v-else>
                      <div class="flow-node node-core" :class="{'have-sign': flowType==0, active: active==index}" @click="handleClickStep(item, index)">
                          <p class="text">{{item.stepName}}</p>
                          <div class="detail-sign">...</div>
                      </div>
                      
                    </div>
                
                </div>

                <i class="ic-flow-arrow" v-if="stepVOListIndex!=flowData.length-1"></i>
                <div class="flow-node start-end">结束</div>
               
    </div>
<!-- 主流程-生育 -->
    <div ref="componertFlowImg" class="flow-img clearfix" v-if="!isChild&&flowType==1" :style="[scaleStyle]">
            <!-- 20301001：生育报备申请， 20301002：生育待遇报销申请 -->
                <div class="flow-node start-end">开始</div>
                <div class="fl clearfix">
                    <i class="ic-flow-arrow"></i> 
                    <!-- 单一流程 -->
                    <div class="fl cleafix">
                      <div class="flow-node node-core have-sign" :class="{active: active==0}" @click="handleClickStep('', 0, '20301001')">
                          <p class="text">备案申请</p>
                          <div class="detail-sign">...</div>
                      </div>
                    </div>
                    <i class="ic-flow-arrow"></i> 
                    <div class="fl cleafix">
                      <div class="flow-node node-core">
                          <p class="text">理赔岗备案初审</p>
                      </div>
                    </div>
                    <i class="ic-flow-arrow"></i> 
                     <div class="fl cleafix">
                      <div class="flow-node node-core">
                          <p class="text">医保局审核备案</p>
                      </div>
                    </div>
                    <i class="ic-flow-arrow"></i> 
                     <div class="fl cleafix">
                      <div class="flow-node node-core">
                          <p class="text">接收备案结果</p>
                      </div>
                    </div>
                </div>

                <!-- 生育-待遇报销申请 -->
                <div class="birth-apply">
                <i class="birth-split-arrow"></i>
                  <div class="flow-node node-core have-sign" :class="{active: active==1}" @click="handleClickStep('', 1, '20301002')">
                    <p class="text">待遇报销申请</p>
                    <div class="detail-sign">...</div>
                  </div>
                  <i class="ic-flow-arrow"></i>
                  <div class="flow-node node-core"><p class="text">理赔待遇初审</p></div>
                  <i class="ic-flow-arrow2-l"></i>
                  <div class="arrow2-area">
                      <div class="arrow2-area-t clearfix">
                      <div class="flow-node node-core"><p class="text">社保局审核津贴费用</p></div>
                      <i class="ic-flow-arrow"></i>
                      <div class="flow-node node-core"><p class="text">接收费用报销结果</p></div>
                      </div>
                      <div class="arrow2-area-b clearfix">
                      <div class="flow-node node-core"><p class="text">医保局审核医疗费用</p></div>
                      <i class="ic-flow-arrow"></i>
                      <div class="flow-node node-core"><p class="text">接收费用报销结果</p></div>
                      </div>
                  </div>
                  <i class="ic-flow-arrow2-r"></i>
                  <div class="flow-node start-end">结束</div>
                
                </div>
                
    </div>

<!-- 子流程 -->
    <div class="flow-img clearfix" :class="{'flow-img-20301001':flowType==1&&stepCode=='20301001','flow-img-20301002':flowType==1&&stepCode=='20301002'}" 
    :style="{width: flowType==0?232+153*flowData.length+'px':''}" v-if="isChild">
      <!-- 工伤 -->
      <div class="clearfix" v-if="flowType==0">
          <div class="flow-node start-end">开始</div>
          <div class="fl clearfix" v-for="(item, index) in flowData" :key="item.id">
            <i class="ic-flow-arrow" v-if="stepVOListIndex==''||(!(item.stepVOList&&item.stepVOList.length>0)&index!=(stepVOListIndex+1))"></i>
            <!-- 单一流程 -->
            <div class="fl cleafix">
              <div class="flow-node node-core" :class="{'info-node-core': index==0}">
                <p class="text">{{item.stepName}}</p>
              </div>   
            </div>
        </div>

        <i class="ic-flow-arrow"></i>
        <div class="flow-node start-end">结束</div>
      </div>

      <!-- 生育 20301001：生育报备申请， 20301002：生育待遇报销申请-->
      <!-- 生育报备申请 -->
      <div class="clearfix" v-if="flowType==1&&stepCode=='20301001'">
          <div class="flow-node start-end">开始</div>
          <!-- 单一流程 -->
          <div class="fl clearfix">
            <i class="ic-flow-arrow"></i>
            <div class="fl cleafix">
              <div class="flow-node node-core info-node-core">
                <p class="text">备案申请</p>
              </div>   
            </div>
            <i class="ic-flow-arrow"></i>
            <div class="fl cleafix">
              <div class="flow-node node-core">
                <p class="text">理赔岗备案初审</p>
              </div>   
            </div>
            <i class="ic-flow-arrow"></i>
            <div class="fl cleafix">
              <div class="flow-node node-core">
                <p class="text">医保局申请备案</p>
              </div>   
            </div>
            <i class="ic-flow-arrow"></i>
            <div class="fl cleafix">
              <div class="flow-node node-core">
                <p class="text">接收备案结果</p>
              </div>   
            </div>
          </div>
           <i class="ic-flow-arrow"></i>
        <div class="flow-node start-end" style="width: 110px">进入待遇申报</div>

       
      </div>

      <!-- 生育待遇报销申请 -->
       <div class="clearfix" v-if="flowType==1&&stepCode=='20301002'" style="">
          <div class="flow-node start-end" style="width: 178px">开始（可由备案申请接入）</div>
          <!-- 单一流程 -->
          <div class="fl clearfix">
            <i class="ic-flow-arrow"></i>
            <div class="fl cleafix">
              <div class="flow-node node-core info-node-core">
                <p class="text">待遇报销申请</p>
              </div>   
            </div>
             <i class="ic-flow-arrow"></i>
            <div class="fl cleafix">
              <div class="flow-node node-core">
                <p class="text">理赔待遇初审</p>
              </div>   
            </div>
            <!-- 有并列流程 -->
            <div  class="fl cleafix">
              <i class="ic-flow-arrow2-l"></i>
              <div class="arrow2-area">
                <div class="arrow2-area-t clearfix">
                  <div class="fl cleafix">
                    <div class="flow-node node-core">
                    <p class="text" style="padding: 0 15px">社保局审核津贴费用</p>
                  </div>
                  <i class="ic-flow-arrow"></i>
                  <div class="fl cleafix">
                    <div class="flow-node node-core">
                      <p class="text" style="padding: 0 15px">接收费用报销结果</p>
                    </div>   
                  </div>
                </div>
                </div>
                <div class="arrow2-area-b clearfix">
                 <div class="fl cleafix">
                    <div class="flow-node node-core">
                    <p class="text" style="padding: 0 15px">医保局审核医疗费用</p>
                  </div>
                  <i class="ic-flow-arrow"></i>
                  <div class="fl cleafix">
                    <div class="flow-node node-core">
                      <p class="text" style="padding: 0 15px">接收费用报销结果</p>
                    </div>   
                  </div>
              </div>
              </div>
            
            </div>
            <i class="ic-flow-arrow2-r"></i>
            <!-- 单一流程 -->
            <!-- <div class="fl cleafix" v-else>
              <div class="flow-node node-core">
                <p class="text">{{item.stepName}}</p>
              </div>   
            </div> -->
            </div>
          </div>
          <div class="flow-node start-end">结束</div>

       
      </div>
               
    </div>

</div>
</template>
<script>
export default {
  name: 'addrSelector',
  data () {
    return {
        active: 0,
        stepVOListIndex: ''
    }
  },
  props: ['flowData', 'flowType', 'isChild', 'stepCode', 'scaleStyle'],
  watch: {
    flowData (newValue, oldValue) {
      if(!this.isChild){
        this.findStepVOListIndex()
        this.findStepActive()
        
      }
    },
    flowType (newValue, oldValue) {
      
    }
  },
  components: {},
  created () {
    if(!this.isChild){
      this.findStepVOListIndex()
      this.findStepActive()
    }
   
  },
  mounted () {
  },
  beforeDestroy () { // 在组件生命周期结束的时候销毁。
    
  },
  methods: {
   handleClickStep (obj, active, stepCode) {
     let item = {}
     if(this.flowType==0){
      //  工伤
      item = obj
     }else{
      //  生育 <!-- 20301001：生育报备申请， 20301002：生育待遇报销申请 -->
      this.flowData.forEach((it,index) => {
      if(it.stepCode == stepCode){
        item = it
      }
    })
     }
     
    this.active = active
    this.$emit('handleClickStep', {addressName: item.addressName, socialConfigId: item.socialConfigId, stepCode: item.stepCode, stepName: item.stepName})
   },
  //  找到并列流程的index
   findStepVOListIndex (){
    let stepVOListIndex = ''
    this.flowData.forEach((it,index) => {
      if(it.stepVOList&&it.stepVOList.length>0){
        stepVOListIndex = index
      }
    })
    this.stepVOListIndex = stepVOListIndex
   },
  //  找到默认加载的详细子流程
   findStepActive (){
    this.active=0
    if(this.flowType==0){
      // 工伤
      let item = this.flowData[0]
      this.$emit('handleClickStep', {addressName: item.addressName, socialConfigId: item.socialConfigId, stepCode: item.stepCode, stepName: item.stepName})
    }else{
      // 生育
      this.flowData.forEach((item,index) => {
        if(item.stepCode=='20301001'){
          this.$emit('handleClickStep', {addressName: item.addressName, socialConfigId: item.socialConfigId, stepCode: item.stepCode, stepName: item.stepName})
        }
      })
       
    }
   }
  }
}
</script>

<style lang="less" scoped>
.flow-img-div{
  height: 150px;
  overflow: auto;
}
.have-stepVOList-div{
  height: 254px;
  .flow-img{
    margin-top: 80px;
  }
}
.flow-img{
  position: relative;
  margin: 35px 20px 20px 20px;
  .flow-node{
    text-align: center;
    position: relative;
    z-index: 2;
    float: left;
  }
  .start-end{
    display: inline-block;
    width: 80px;
    height: 40px;
    line-height: 40px;
    background: #93D34D;
    border-radius: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    margin-top: 15px;
  }
  .ic-flow-arrow{
    float: left;
    width: 32px;
    height: 15px;
    vertical-align: middle;
    background: url("../../assets/images/policy/ic-flow-arrow.png");
    margin: 28px 10px 0 10px;
  }
  .birth-split-arrow{
    display: inline-block;
    width: 708px;
    height: 137px;
    vertical-align: middle;
    background: url("../../assets/images/policy/birth-split-arrow.png");
    position: absolute;
    left: 42px;
    top: 31px;
  }
  .ic-flow-arrow2-l{
    float: left;
    width: 61px;
    height: 143px;
    vertical-align: middle;
    background: url("../../assets/images/policy/ic-flow-arrow2-l.png");
    margin: -36px 10px 0 10px;
  }
  .ic-flow-arrow2-r{
    float: left;
    width: 50px;
    height: 137px;
    vertical-align: middle;
    background: url("../../assets/images/policy/ic-flow-arrow2-r.png");
    margin: -32px 10px 0 10px;
  }
  .node-core{
    display: inline-block;
    width: 100px;
    height: 70px;
    background: #E3F0FF;
    border-radius: 6px;
    font-size: 14px;
    color: #606266;
    line-height: 18px;
    .text{
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
    .detail-sign{
      position: absolute;
      width: 30px;
      height: 30px;
      background: #E3F0FF;
      border: 1px solid #B2D6FF;
      box-shadow: 0px 0px 3px 0px rgba(20, 91, 55, 0.35);
      border-radius: 50%;
      font-size: 14px;
      font-weight: bold;
      color: #606266;
      line-height: 20px;
      bottom: -15px;
      left: 50%;
      margin-left: -15px;
    }
  }
  .have-sign{
      cursor: pointer;
  }
  .node-core.active{
    background: #409EFF;
    color: #ffffff;
    .detail-sign{
      background: #FFFFFF;
      border: 1px solid #409EFF;
      box-shadow: 0px 0px 3px 0px rgba(20, 91, 55, 0.35);
      border-radius: 50%;
      color: #409EFF;
    }
  }
  .arrow2-area{
    float: left;
    // .arrow2-area-t{
      margin-top: -62px;
    // }
    .arrow2-area-b{
      margin-top: 56px;
    }
  }
}
.have-flow-birth-apply{
   height: 254px;
  .flow-img{
    width: 1515px;
    margin-top: 20px;
  }
  .birth-apply{
    display: inline-block;
    margin-left: 70px;
    margin-top: 62px;
    .flow-node{
      .text{
        padding: 0px;
      }
    }
    .arrow2-area{
      .text{
        padding: 0 15px;
      }
    }
  }
}
.child-flow-birth-apply{
  height: 180px!important;
   .flow-img{
    width: 1000px;
    margin-top: 50px!important;
  }
}
.flow-img--div-sm{
  height: 150px;
    .flow-img{
      margin-left: 0;
      margin-top: 50px;
      .arrow2-area{
        margin-top: -46px;
      }
       .arrow2-area-b{
        margin-top: 15px;
      }
      .ic-flow-arrow2-l{
      float: left;
      width: 59px;
      height: 104px;
      vertical-align: middle;
      background: url("../../assets/images/policy/ic-flow-arrow2-l-sm.png");
      margin: -19px 10px 0 10px;
    }
    .ic-flow-arrow2-r{
      float: left;
      width: 57px;
      height: 96px;
      vertical-align: middle;
      background: url("../../assets/images/policy/ic-flow-arrow2-r-sm.png");
      margin: -15px 10px 0 10px;
    }
    .info-node-core{
      border: 2px solid #409EFF;
      color: #409EFF;
    }
  }
  .flow-img-20301001{
    width: 900px;
  }
  .flow-img-20301002{
    width: 1000px;
  }
}
/* 屏幕小于1440px */
// @media screen and (max-width: 1440px)  {
//   .flow-img{
//     transform: scale(0.6);
//   }
//   .flow-img--div-sm{
//     .flow-img{
//       transform: scale(0.6);
//     }
//   }
// }

// /* 屏幕等于1440px */
// @media screen and (max-width: 1440px) and (min-width: 1440px)  {
//    .flow-img{
//     transform: scale(0.6);
//   }
// }

// /* 屏幕大于1440px */
// @media screen and (min-width:1441px) {
//    .flow-img{
//     transform: scale(0.6);
//   }
// }
</style>
