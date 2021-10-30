<template>
  <div class="content">

    <div class="header">
      <div class="header-left">
        <img src="../assets/images/SPF-Pal-log-1.png" alt="" />
      </div>
      <div class="header-right">
        <p>商务代表 服务热线：400-716-2588</p>
        <div class="header-button">
          <el-button size="small" @click="dialogFormVisible = true">商务合作</el-button>
          <el-button size="small" type="primary" @click="handleGoRegister">登录</el-button>
        </div>
      </div>
    </div>

    <div class="nav-img">
      <el-carousel
        height="800px"
        arrow="nerver"
      >
        <el-carousel-item
          v-for="(item, index) in imgArr"
          :key="index"
        >
          <img
            :src="item.url"
            alt=""
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="center-info">
      <div class="info-top">
        <div class="info-list">
          <div class="list-item">
            <h4>10<span class="font-30">+</span></h4>
            <p>十七年行业经验</p>
          </div>
          <div class="list-item">
            <h4>4</h4>
            <p>四大产品群</p>
          </div>
          <div class="list-item">
            <h4>3</h4>
            <div>
              <p>三大行业解决方案 :</p>
              <p>金融 物流 零售</p>
            </div>
          </div>
          <div class="list-item">
            <h4>98<span class="font-30">%</span></h4>
            <p>客户续约率</p>
          </div>
        </div>
        <div class="info-detail">
          <div class="detail-left">
            仕邦集团（以下简称“仕邦”）作为人力资源外包服务商，拥有仕邦人力（以劳动力解决方案为主的业务）、南方仕通（人事外包SAAS级事务处理服务、灵活用工）、湾区保险（保险服务）三大业务版块。全国60多家分支机构，实现人力资源服务全方位覆盖，
            发挥线上、线下的交付网络体系优势，为企业客户提供顾问式服务和系统平台支撑，实现企业效益最大化
          </div>
          <div class="detail-right">
            <img
              src="../assets/images/introduce-1.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="info-bottom">
        <h3>关于我们</h3>
        <div class="line"></div>
        <div class="number-list">
          <div class="list-item">
            <div>60+</div>
            <p>分支机构</p>
          </div>
          <div class="list-item">
            <div>300+</div>
            <p>城市覆盖</p>
          </div>
          <div class="list-item">
            <div>1000+</div>
            <p>服务客户</p>
          </div>
          <div class="list-item">
            <div>30W+</div>
            <p>服务员工，超过30万</p>
          </div>
        </div>
      </div>
    </div>

    <div class="introduce">
      <div class="item">
        <div class="img">
          <img
            src="../assets/images/introduce-7.png"
            alt=""
          />
        </div>
        <div class="item-bottom">
          <h3>公司简介</h3>
          <p>
            仕邦作为华南人力资源服务行业龙头企业，品牌
            强度为715，品牌价值为3.22亿元，品牌影响力
            华南首屈一指。HROOT“2019大中华区最佳人
            力资源服务品牌”排名中，仕邦位列人力资源外
            包行业综合排名第八、华南区域第一。
          </p>
        </div>
      </div>
      <div class="item">
        <div class="img">
          <img
            src="../assets/images/introduce-8.png"
            alt=""
          />
        </div>
        <div class="item-bottom">
          <h3>人资外包服务商</h3>
          <p>
            作为人力资源行业首家引进世界级咨询机构lBM
            的企业，仕邦人力信息技术和运营模式创新开始
            了全面提升。在IBM的指导下，借鉴了华为等知
            名企业的先进经验，并建立了自己的产品体系，
            成为了人力资源行业内第一家“以产品化建制” 的人力资源外包服务商。
          </p>
        </div>
      </div>
      <div class="item">
        <div class="img">
          <img
            src="../assets/images/introduce-9.png"
            alt=""
          />
        </div>
        <div class="item-bottom">
          <h3>企业价值</h3>
          <p>
            仕邦已获得人力资源流程化管理平台等32项软件
            著作权和5项技术专利，并获取3项高新技术产品
            认证，已成功申报广州市科技创新小巨人企业，
            并获得国家高新技术企业认证,通过系统创新、产
            品研发以及人工智能技术运用，在同业中率先推 动智能化“减重革命”。
          </p>
        </div>
      </div>
    </div>

    <div class="scope-list">
      <div class="title">
        <h3>业务范围</h3>
        <div class="line"></div>
      </div>
      <div class="list-bottom">
        <div class="list list-one">
          <div class="list-item1">
            <img
              src="../assets/images/icon-4.png"
              alt=""
            />
            <p>劳务派遣 HRO</p>
          </div>
          <div class="list-item2">
            <div class="triangle"></div>
            <p>劳动关系管理</p>
            <p>入离职人事管理</p>
            <p>社保公积金管理</p>
            <p>工资税务管理</p>
          </div>
        </div>
        <div class="list list-two">
          <div class="list-item3">
            <img
              src="../assets/images/icon-2.png"
              alt=""
            />
            <p>服务外包 BPO</p>
          </div>
          <div class="list-item4">
            <div class="triangle"></div>
            <p>岗位外包</p>
            <p>业务流程外包</p>
          </div>
        </div>
        <div class="list list-three">
          <div class="list-item5">
            <img
              src="../assets/images/icon-3.png"
              alt=""
            />
            <p>员工福利外包 BMO</p>
          </div>
          <div class="list-item6">
            <div class="triangle"></div>
            <p>劳动关系管理</p>
            <p>入离职人事管理</p>
            <p>社保公积金管理</p>
            <p>工资税务管理</p>
          </div>
        </div>
        <div class="list list-four">
          <div class="list-item7">
            <img
              src="../assets/images/icon-1.png"
              alt=""
            />
            <p>人事代理 HRBPO</p>
          </div>
          <div class="list-item8">
            <div class="triangle"></div>
            <p>社保、公积金代理</p>
            <p>薪酬服务</p>
            <p>安残服务</p>
            <p>增值服务</p>
          </div>
        </div>
      </div>
    </div>

    <div class="enterprise">
      <div class="title">
        <h3>1000+家企业的共同选择</h3>
        <div class="line"></div>
      </div>
      <div class="enterprise-bottom">
        <ul>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-9.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-26.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-4.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-19.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-14.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-24.png"
              alt=""
            />
          </li>
        </ul>
        <ul>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-2.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-25.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-18.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-12.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-17.png"
              alt=""
            />
          </li>
        </ul>
        <ul>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-8.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-21.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-11.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-15.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-6.png"
              alt=""
            />
          </li>
        </ul>
        <ul>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-23.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-22.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-13.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-1.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-10.png"
              alt=""
            />
          </li>
        </ul>
        <ul>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-20.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-16.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-7.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-3.png"
              alt=""
            />
          </li>
          <li>
            <img
              src="../assets/images/enterprises/enterprise-5.png"
              alt=""
            />
          </li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <div class="footer-top">
        <div class="top-left">
          <img
            class="SPF-Pal-log"
            src="../assets/images/SPF-Pal-log-2.png"
            alt=""
          />
          <ul>
            <li>华南区 广州仕邦人力资源有限公司（广州总公司）</li>
            <li>电话：+86 20 66608848</li>
            <li>传真：+86 20 87551114</li>
            <li>地址：广州天河北路183号大都会广场21楼整层</li>
          </ul>
        </div>
        <div class="top-right">
          <img
            src="../assets/images/QR-code-2.png"
            alt=""
          />
          <img
            src="../assets/images/QR-code-1.png"
            alt=""
          />
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy;</span><a style="color: #303133;" href="https://beian.miit.gov.cn/" target="_blank">2011 仕邦人力资源有限公司 版权所有 粤ICP备09126418号-1</a>
      </div>
    </div>

    <!-- 商务合作弹窗 -->
    <el-dialog class="el-dialog-form" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false" width="810px">
      <img class="close" src="../assets/images/icons/ic-account-type6.png" @click="dialogFormVisible = false">
      <h2 class="text-center">商务合作</h2>
      <p class="title text-center">请如实填写您的联系方式，提交申请后，专属顾问会尽快与您联系</p>

      <el-form class="el-form" :model="cooperationForm" ref="cooperationForm">
        <el-form-item prop="company" label="企业名称" :rules="[{ required: true, message: '请填写企业名称',trigger:'blur'}]">
          <el-input type="text" v-model="cooperationForm.company"></el-input>
        </el-form-item>
        <el-form-item prop="realname" label="您的姓名" :rules="[{ required: true, message: '请填写您的姓名',trigger:'blur'}]">
          <el-input type="text" v-model="cooperationForm.realname"></el-input>
        </el-form-item>
        <el-form-item prop="contact" label="联系方式" :rules="[{ required: true, message: '请填写联系方式',trigger:'blur'}]">
          <el-input type="text" v-model="cooperationForm.contact"></el-input>
        </el-form-item>

        <el-form-item prop="product" label="合作产品" :rules="[{ required: true, message: '请选择合作产品',trigger:'blur'}]">
          <el-select placeholder="" v-model="cooperationForm.product" style="width:380px">
            <el-option label="劳务派遣" value="劳务派遣"></el-option>
            <el-option label="服务外包" value="服务外包"></el-option>
            <el-option label="员工福利外包" value="员工福利外包"></el-option>
            <el-option label="人事代理" value="人事代理"></el-option>
            <el-option label="我的更多需求" value="我的更多需求"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="el-form-item2" prop="others" label="更多需求">
          <el-input class="input el-textarea" resize="none" placeholder="请描述您的问题或您宝贵的建议，建议 200字以内" type="textarea" v-model="cooperationForm.others"/>
        </el-form-item>

        <el-form-item>
          <el-button style="width:380px;height:50px;font-size:18px;margin-top:20px;" type="primary"  @click="handleSubmit">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgArr: [
        { url: require('../assets/images/about-1.jpg') },
        { url: require('../assets/images/about-2.jpg') },
        { url: require('../assets/images/about-3.jpg') },
        { url: require('../assets/images/about-4.jpg') }
      ],
      dialogFormVisible: false,
      cooperationForm: {
        company: '',
        realname: '',
        contact: '',
        product: '',
        others: ''
      }
    }
  },
  methods: {
    /* 登录 */
    handleGoRegister () {
      this.$router.push('/login')
    },
    /* 提交申请 */
    handleSubmit () {
      this.$refs.cooperationForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: '/api/sys/business/record',
            method: 'POST',
            data: this.cooperationForm
          }).then(({ data }) => {
            if (data.code == 10) {
              this.$message.success('提交成功!')
              this.dialogFormVisible = false
              this.cooperationForm = {
                company: '',
                realname: '',
                contact: '',
                product: '',
                others: ''
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.content {
  position: relative;
  /deep/.el-dialog__header {
    padding: 0;
  }
  /deep/.el-form-item__content {
    line-height: 12px;
  }
  .el-dialog-form {
    text-align: center;
    .close {
      position: absolute;
      right: -40px;
      top: -40px;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
    .title {
      margin: 20px 0 16px 0;
      color: #909399;
    }
    .el-form {
      /deep/.el-form-item,.is-required{
        width: 380px;
        margin: 0 auto;
        margin-top: 15px ! important;
      }
      /deep/.el-form-item:first-child{
        margin-top: 0 ! important;
      }
      /deep/.el-form-item__label{
        position: absolute;
        left: 0;
        bottom: -1px;
        z-index: 999;
        color: #909399;
      }
      /deep/.el-form-item2{
        /deep/.el-form-item__label{
          top: -6px;
        }
      }
      /deep/.el-form-item__content:nth-child(1){
        margin: 0 auto;
      }
      /deep/.el-input{
        width: 380px;
        border-bottom:1px solid #ddd;
      }
      /deep/.el-input__inner{
        border: none;
        text-indent: 7em;
      }
      /deep/.el-form-item__error{
        left: 0;
      }
      .el-form-item {
        position: relative;
        .name {
          position: absolute;
          bottom: 12px;
          left: 270px;
          color: #909399 !important;
        }
        .input {
          width: 380px;
          height: 24px;
          outline: none;
          border: none;
          border-bottom: 1px solid #ddd;
          text-indent: 5em;
          padding-bottom: 4px;
        }
      }
      /deep/.el-textarea__inner {
        width: 318px;
        position: absolute;
        right: 0px;
        border: none;
        background: #fff;
        height: 50px;
        resize: none;
        border: none;
        padding-left: 45px;
      }
      /deep/.el-textarea {
        height: 125px !important;
      }
      /deep/.el-textarea__inner {
        height: 125px;
      }
    }
  }
  .header {
    height: 90px;
    padding: 0 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #909399;
    .header-left {
      display: flex;
      justify-content: start;
      align-items: center;

      img {
        width: 173px;
        height: 42px;
        margin-left: 156px;
      }
    }
    .header-right {
      display: flex;
      justify-content: start;
      align-items: center;
      .header-button {
        margin-left: 51px;
        display: flex;
        justify-content: start;
        /deep/.el-button:first-child {
          border: 1px solid #409eff;
          color: #409eff;
          margin-right: 20px;
        }
        /deep/.el-button:last-child {
          padding: 0 30px;
        }
      }
    }
  }
  .nav-img {
    /deep/.el-carousel__indicator--horizontal {
      margin-bottom: 192px;
      width: 60px;
      height: 4px;
    }
  }
  .center-info {
    width: 1576px;
    height: 1677px;
    position: absolute;
    top: 630px;
    left: 50%;
    margin-left: -788px;
    padding-top: 91px;
    z-index: 2;
    background: url('../assets/images/bg-1.png') no-repeat;
    .info-top {
      opacity: 0.8;
      padding: 27px 31px 0 31px;
      box-sizing: border-box;
      margin: 0 auto;
      width: 1376px;
      height: 778px;
      background: #f8f8fb;
      .info-list {
        height: 263px;
        background: #2f81f2;
        display: flex;
        justify-content: center;
        .list-item {
          width: 25%;
          height: 100%;
          text-align: center;
          color: #fff;
          border-right: 1px solid #95b8ed;
          h4 {
            font-size: 60px;
            margin: 78px 0 20px 0;
          }
        }
        div:nth-child(4) {
          border-right: none;
        }
      }
      .info-detail {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 102px;
        .detail-left {
          width: 523px;
          height: 118px;
          line-height: 25px;
          font-size: 14px;
          color: #808080;
          text-indent: 2em;
        }
        .detail-right {
          width: 448px;
          height: 252px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .info-bottom {
      margin-top: 113px;
      text-align: center;
      h3 {
        margin: 0 0 13px 0;
        font-size: 30px;
        font-weight: 400;
      }
      .line {
        width: 68px;
        height: 4px;
        background: #409eff;
        margin: 0 auto;
      }
      .number-list {
        margin-top: 70px;
        display: flex;
        justify-content: space-around;
        .list-item {
          display: flex;
          flex-flow: column;
          justify-content: center;
          div {
            display: flex;
            flex-flow: column;
            justify-content: center;
            width: 148px;
            height: 168px;
            margin-bottom: 29px;
            background-image: url('../assets/images/hexagon.png');
            color: #fff;
            font-size: 40px;
          }
          p {
            color: #333;
            font-size: 20px;
          }
        }
      }
    }
  }
  .introduce {
    margin-top: 1277px;
    background: #f8f8fb;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    padding: 80px 360px;
    .item {
      width: 375px;
      height: 500px;
      z-index: 20000;
      background: #fff;
      border: 1px solid #cecece;
      box-sizing: border-box;
      display: flex;
      flex-flow: column;
      justify-content: start;
      .img {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 29px 0 0 0;
        img {
          width: 192px;
          height: 192px;
        }
      }
      .item-bottom {
        padding: 43px 40px 18px 40px;
        h3 {
          margin: 0 0 27px 0;
        }
        p {
          line-height: 28px;
        }
      }
    }
    .item:hover {
      background: url('../assets/images/introduce-10.png') no-repeat;
      color: #fff;
      .img {
        visibility: hidden;
      }
      .item-bottom {
        background: rgba(0, 0, 0, 0.3);
      }
    }
    .item:nth-child(1):hover {
      background: url('../assets/images/introduce-10.png') no-repeat;
    }
    .item:nth-child(2):hover {
      background: url('../assets/images/introduce-11.png') no-repeat;
    }
    .item:nth-child(3):hover {
      background: url('../assets/images/introduce-12.png') no-repeat;
    }
  }
  .scope-list {
    .title {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      margin-top: 112px;
      h3 {
        font-size: 30px;
        color: #333333;
        font-weight: 400;
        margin: 0 0 11px 0;
      }
      .line {
        width: 68px;
        height: 4px;
        background: #409eff;
      }
    }
    .list-bottom {
      display: flex;
      justify-content: center;
      margin: 51px 0 137px 0;
      .list {
        color: #fff;
        height: 320px;
        display: flex;
        .list-item1,
        .list-item3,
        .list-item5,
        .list-item7 {
          width: 240px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          color: #fff;
          img {
            margin-top: 51px;
          }
          p {
            margin: 37px 0 96px 0;
          }
        }
        .list-item1 {
          background: linear-gradient(
            0deg,
            rgba(64, 158, 255, 1) 0%,
            rgba(163, 208, 255, 1) 100%
          );
        }
        .list-item3 {
          background: linear-gradient(
            0deg,
            rgba(128, 122, 240, 1) 0%,
            rgba(193, 189, 254, 1) 100%
          );
        }
        .list-item5 {
          background: linear-gradient(
            0deg,
            rgba(16, 169, 162, 1) 0%,
            rgba(144, 251, 247, 1) 100%
          );
        }
        .list-item7 {
          background: linear-gradient(
            0deg,
            rgba(226, 135, 6, 1) 0%,
            rgba(253, 195, 113, 1) 100%
          );
        }
        .list-item2,
        .list-item4,
        .list-item6,
        .list-item8 {
          position: relative;
          width: 0px;
          transition: width 1s;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          border-right: 5px solid #ffffff;
          overflow: hidden;
          .triangle {
            position: absolute;
            left: 0;
            top: 179px;
            width: 0px;
            height: 0px;
            border-width: 20px;
            border-style: solid;
          }
          p {
            width: 148px;
            height: 40px;
            border: 1px solid #fff;
            text-align: center;
            line-height: 40px;
            margin-top: 20px;
          }
          p:nth-child(1) {
            margin-top: 0;
          }
        }
        .list-item2 {
          background: url('../assets/images/scope-1.png') no-repeat;
          .triangle {
            border-color: transparent transparent transparent #65b0ff;
          }
        }
        .list-item4 {
          background: url('../assets/images/introduce-3.png') no-repeat;
          .triangle {
            border-color: transparent transparent transparent #9994f5;
          }
        }
        .list-item6 {
          background: url('../assets/images/scope-1.png') no-repeat;
          .triangle {
            border-color: transparent transparent transparent #47ccc6;
          }
        }
        .list-item8 {
          background: url('../assets/images/scope-4.png') no-repeat;
          .triangle {
            border-color: transparent transparent transparent #ed9f31;
          }
        }
      }
      .list-one:hover {
        .list-item1 {
          margin-right: 0;
        }
        .list-item2 {
          display: flex;
          width: 226px;
        }
      }
      .list-two:hover {
        .list-item3 {
          margin-right: 0;
        }
        .list-item4 {
          display: flex;
          width: 226px;
        }
      }
      .list-three:hover {
        .list-item5 {
          margin-right: 0;
        }
        .list-item6 {
          display: flex;
          width: 226px;
        }
      }
      .list-four:hover {
        .list-item7 {
          margin-right: 0;
        }
        .list-item8 {
          display: flex;
          width: 226px;
        }
      }
    }
  }
  .enterprise {
    height: 810px;
    background: url('../assets/images/introduce-2.png') no-repeat;
    border-bottom: 5px solid #409eff;
    .title {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      h3 {
        margin: 113px 0 12px 0;
        font-size: 30px;
        color: #333333;
        font-weight: 400;
      }
      .line {
        width: 68px;
        height: 4px;
        background: #409eff;
      }
    }
    .enterprise-bottom {
      display: flex;
      justify-content: center;
      ul {
        width: 225px;
        li {
          margin-top: 50px;
        }
      }
    }
  }
  .footer {
    .footer-top {
      display: flex;
      justify-content: space-around;
      .top-left {
        .SPF-Pal-log {
          margin: 35px 0 34px 0;
        }
        ul {
          margin-bottom: 59px;
          margin-top: 0;
          li {
            color: #909399;
            font-size: 14px;
            line-height: 21px;
          }
        }
      }
      .top-right {
        margin-top: 104px;
        img:nth-child(1) {
          margin-right: 60px;
        }
      }
    }
    .footer-bottom {
      height: 70px;
      background: #f8f8fb;
      text-align: center;
      line-height: 70px;
    }
  }
}
</style>
