<template>
  <div class="password-container">
    <div class="password-main input-select-40">
      <div class="password-main-container">
        <!-- steps条 -->
        <el-steps :active="active" class="spl-step" align-center finish-status="success" process-status="finish">
          <el-step title="填写账户名"></el-step>
          <el-step title="验证身份"></el-step>
          <el-step title="设置新密码"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 中间的框部分 -->
        <!--第一步-->
        <div v-show="active==0">
          <el-form ref="firstForm" :model="firstForm" class="form-item-mb30" label-width="150px">
            <el-form-item label="账户名:" prop="userName"
                          :rules="{ required: true, message: '请输入账户名', trigger: 'blur'}">
              <el-input v-model="firstForm.userName" class="w-320" placeholder="请输入账户名"></el-input>
            </el-form-item>
            <el-form-item label="验证码:" prop="imgCode"
                          :rules="[{ required: true, message: '请输入验证码', trigger: 'blur'},{min: 4, message: '验证码不正确',trigger: 'blur'},{validator:this.checkImgCode,trigger:'blur'}]">
              <el-input v-model="firstForm.imgCode" style="width:110px" placeholder="请输入验证码"></el-input>
              <img :src="firstForm.imgcodeSrc" class="imgcode">
              <span class="ml-5">看不清? <span class="f-cursor text-blue" @click="getNewcodeImg()">换一张</span></span>
            </el-form-item>
            <el-form-item>
              <el-button @click="verifyFirstForm()" type="primary" class="submit-btn s-btn"
                          :loading="firstForm.btnLoading"
                          style="width:100px">下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--第二步-->
        <div v-show="active==1">
          <el-form ref="secondForm" :model="secondForm" label-width="150px">
            <el-form-item label="账户名:">
              <p v-text="secondForm.userName"></p>
            </el-form-item>
            <el-form-item label="手机号:">
              <p v-text="secondForm.hidePhone"></p>
            </el-form-item>
            <el-form-item v-show="secondForm.phoneRight" label="请填写手机验证码:" prop="phoneCode" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur'},,{validator:this.checkPhoneCode,trigger:'blur'}]">
              <el-input v-model="secondForm.phoneCode" style="width:170px" ></el-input>
              <el-button @click="sendPhoneCode()" class="s-btn btn--border-blue ml-10" style="width:135px;"  :disabled="secondForm.isSendPhone"
                          v-text="secondForm.sendPhoneText"></el-button>
            </el-form-item>
            <el-form-item>
              <el-button :loading="secondForm.btnLoading" @click="verifySecondForm()" type="primary" v-show="secondForm.phoneRight"
                          class="submit-btn s-btn">下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!--第三步-->
        <div v-show="active==2">
          <el-form :model="thirdForm" status-icon ref="thirdForm" label-width="150px">
            <el-form-item label="设置新密码" prop="password"
                          :rules="[{ required: true, message: '请输入', trigger: 'blur' },{validator:this.checkPassword1,trigger:'blur'}]">
              <el-input type="password" v-model="thirdForm.password" class="w-320" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword"
                          :rules="[{ required: true, message: '请输入', trigger: 'blur' },{validator:this.checkPassword2,trigger:'blur'}]">
              <el-input type="password" v-model="thirdForm.checkPassword" class="w-320"
                        autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="verifyThirdForm()" type="primary" class="submit-btn s-btn">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!--第四步-->
        <div v-show="active==4" class="tip-box text-center" style="margin-top: 160px;">
          <div class="pic inlineBlock">
            <i class="el-icon-success text-blue icon-success fl"></i>
            <div class="fl">
              <p class="succuss-text text-left">新密码设置成功！</p>
              <p class="text-left text-gray">请牢记您新设置的密码。</p>
              <p class="text-left mt-10 f-cursor a-link" @click="doLogin">返回登陆页</p>
            </div>
          </div>
        </div>
      </div>
      <img class="bottom-bg" src="@/assets/images/rePsd-b-bg.png" fit="cover">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      firstForm: {
        userName: '',
        imgCode: '',
        imgcodeSrc: '',
        stamp: '',
        btnLoading: false,
        checkImgCode: false
      },

      secondForm: {
        userName: '',
        phone: '',
        hidePhone: '',
        phoneCode: '',
        phoneRight: true,
        sendPhoneText: '获取短信验证码',
        isSendPhone: false,
        btnLoading: false,
        checkPhoneCode: false
      },

      thirdForm: {
        password: '',
        checkPassword: '',
        btnLoading: true
      },

      base64 : require('js-base64').Base64,
      timer: null
    }
  },
  mounted () {
    this.getNewcodeImg()
  },
  methods: {
    getNewcodeImg () {
      this.firstForm.stamp = String(new Date().getTime())
      this.firstForm.imgcodeSrc = '/api/api/sys/validate/image/code/' + this.firstForm.stamp
    },
    // 验证第一步 验证图片验证码是否正确
    verifyFirstForm () {
      this.firstForm.btnLoading = true
      this.firstForm.checkImgCode = true
      this.$refs.firstForm.validate((valid) => {
        this.firstForm.checkImgCode = false
        if (valid) {
          this.secondForm.userName = this.firstForm.userName
          this.getUserPhone()
        } else {
          this.firstForm.btnLoading = false
        }
      })
    },
    // 通过账户名获取手机号码
    getUserPhone () {
      this.$http({
        url: '/api/sys/get/userMobile/' + this.firstForm.userName,
        method: 'post',
        data: {}
      }).then(({ data }) => {
        let mobile = data.data[0]
        if (mobile.status === 0) {
          this.secondForm.hidePhone = '未绑定手机号，请联系商务代表或客服修改密码'
          this.secondForm.phoneRight = false
        } else {
          this.secondForm.phone = mobile
          this.secondForm.hidePhone = this.$global.hidePhoneHandle(mobile)
        }
        this.firstForm.btnLoading = false
        ++this.active
      }).catch((data) => {
        this.firstForm.btnLoading = false
      })
    },
    //  发送短信验证码
    sendPhoneCode () {
      this.$http({
        url: '/api/sys/mobile/send/code',
        method: 'post',
        data: {
          type: 'forgetpwd',
          mobile: this.secondForm.phone,
          stamp: this.firstForm.stamp,
          imageCode: this.firstForm.imgCode
        }
      }).then(({ data }) => {
        if (data.data[0].status === 1) {
          var s = 120
          var that = this
          that.secondForm.isSendPhone = true
          that.secondForm.sendPhoneText = '重新获取(' + s + 's)'
          var timer = setInterval(function () {
            if (s > 0) {
              that.secondForm.sendPhoneText = '重新获取(' + s + 's)'
            } else {
              that.secondForm.isSendPhone = false
              that.secondForm.sendPhoneText = '重新获取'
              clearInterval(timer)
            }
            --s
          }, 1000)
        } else {
          this.$message.error('发送失败，请重试')
        }
      })
    },

    // 验证第二步
    verifySecondForm () {
      this.secondForm.btnLoading = true
      this.secondForm.checkPhoneCode = true
      this.$refs.secondForm.validate((valid) => {
        this.secondForm.checkPhoneCode = false
        if (valid) {
          ++this.active
        } else {
          this.secondForm.btnLoading = false
        }
      })
    },

    checkPassword1 (rule, value, callback) {
      var regex = new RegExp(this.$global.pswRegExp)
      if (!regex.test(value)) {
        callback(new Error(this.$global.pswRegExpMsg))
      } else if (this.thirdForm.checkPassword != '') {
        this.$refs.thirdForm.validateField('checkPassword')
      }
      callback()
    },
    checkPassword2 (rule, value, callback) {
      if (this.thirdForm.password != '' && this.thirdForm.checkPassword != '' && this.thirdForm.password != this.thirdForm.checkPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    },

    // 第一步-验证图片验证码
    checkImgCode (rule, value, callback) {
      if (this.firstForm.checkImgCode) {
        this.$http({
          url: '/api/sys/validate/image/code/' + this.firstForm.stamp + '/' + this.firstForm.imgCode,
          method: 'get'
        }).then(({ data }) => {
          if (data.data[0].status === 1) { // 如果图片验证成功
            callback()
          } else {
            callback(new Error('验证码不正确'))
          }
        })
      } else {
        callback()
      }
    },
    // 第二步-验证手机验证码
    checkPhoneCode (rule, value, callback) {
      if (this.secondForm.checkPhoneCode) {
        this.$http({
          url: '/api/sys/mobile/validate/code',
          method: 'post',
          data: {
            type: 'forgetpwd',
            mobile: this.secondForm.phone,
            stamp: this.firstForm.stamp,
            msgCode: this.secondForm.phoneCode,
            imageCode: this.firstForm.imgCode
          }
        }).then(({ data }) => {
          if (data.data[0].status === 1) {
            callback()
          } else {
            callback(new Error('验证码不正确'))
          }
        })
      } else {
        callback()
      }
    },

    // 验证第三步
    verifyThirdForm () {
      this.thirdForm.btnLoading = true
      this.$refs.thirdForm.validate((valid) => {
        if (valid) {
          this.submitThirdForm()
        } else {
          this.thirdForm.btnLoading = false
        }
      })
    },

    //  第三步-提交
    submitThirdForm () {
      let that = this
      this.$http({
        url: '/api/sys/forget/password',
        method: 'post',
        data: {
          type: 'forgetpwd',
          stamp: this.firstForm.stamp,
          username: this.firstForm.userName,
          mobile: this.secondForm.phone,
          msgCode: this.secondForm.phoneCode,
          password: this.base64.encode(this.secondForm.phoneCode + this.thirdForm.password),
          checkPassword: this.base64.encode(this.secondForm.phoneCode + this.thirdForm.checkPassword)
        }
      }).then(({ data }) => {
        if (data.data[0].status === 1) {
          this.active = 4
          this.timer = setTimeout(() => {
            that.doLogin()
          }, 5000)
        } else {
          this.thirdForm.btnLoading = false
          if (data.data[0].msg) {
            this.$message.error(data.data[0].msg)
          } else {
            this.$message.error(this.$global.errorMsg)
          }
        }
      }).catch((data) => {
        this.thirdForm.btnLoading = false
      })
    },

    doLogin () {
      clearInterval(this.timer)
      this.$router.replace('/login')
    }
  }
}
</script>
<style lang="less" scoped>
  .password-container {
    background-color: #ffffff;
    height: 100%;
  }

  .password-main {
    background-color: #ffffff;
  }

  .password-main-container {
    position: relative;
    max-width: @mainContainerWidth;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 93px;
    padding-top: 150px;
    height: calc(100% - 93px);
    z-index: 10;
  }

  /deep/ .el-input__inner {
    border-left: none;
    border-top: none;
    border-right: none;
    border-radius: 0;
  }

  .submit-btn {
    width: 320px !important;
    margin-top: 20px;
  }

  .imgcode {
    width: 96px;
    height: 40px;
    vertical-align: middle;
    margin-left: 10px;
  }

  .bottom-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 93px;
  }

  .el-form {
    width: 470px;
    margin: auto;
    margin-top: 150px;
  }

  .demo-ruleForm {
    margin-top: 0px;
    margin-left: -20px;
  }

  .tip-box {
    .icon-success{
      font-size: 28px;
      margin-top: 13px;
      margin-right: 15px;
    }
    img {
      display: inline-block;
      width: 65px;
      height: 65px;
      vertical-align: middle;
      transform: scale(0.8);
      margin-top: -40px;
      margin-right: 10px;
    }
    .el-button {
      margin-top: 50px;
    }
    .succuss-text {
      color: @blueColor;
      font-size: 24px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

  .tip-box1 {
    width: 100px;
    margin: auto;
    margin-top: 10px;
  }
</style>
