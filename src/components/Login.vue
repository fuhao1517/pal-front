<template>
  <div class="content">
    <div class="login">
      <div class="title">
        <img src="../assets/images/icons/pal-logo-2.png" alt="" />
        <div class="text">
          <h3>仕邦客户服务系统</h3>
          <p>Seebon Enterprise Service System</p>
        </div>
      </div>
      <el-form ref="loginForm" :model="loginForm" label-width="0" >
        <el-form-item prop="username" :rules="[{ required: true, message: '请填写用户名称', trigger: 'blur'}]">
          <img class="icon-img" src="../assets/images/icons/ic-account-type2.png" alt="" />
          <el-input type="text" class="user-input" placeholder="请输入用户名" v-model="loginForm.username" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>

        <el-form-item prop="password" :rules="[{ required: true, message: '请填写密码', trigger: 'blur' }]">
          <img class="icon-img" src="../assets/images/icons/ic-account-type5.png" alt="" />
          <el-input type="password" class="user-input" placeholder="请输入登录密码" v-model="loginForm.password" @keyup.enter.native="handleSubmit"></el-input>
        </el-form-item>

        <el-form-item label="" prop="code"
                      :rules="[{ required: true, message: '请输入验证码', trigger: 'blur'},{min: 4, message: '验证码不正确',trigger: 'blur'}]">
          <el-input v-model="loginForm.code" style="width:110px" placeholder="请输入验证码"></el-input>
          <img :src="imgcodeSrc" class="imgcode ml-10" style="height: 40px;width: 90px;">
          <span class="ml-5">看不清? <span class="f-cursor text-blue" @click="getNewcodeImg()">换一张</span></span>
        </el-form-item>

        <el-form-item class="select">
          <el-checkbox class="checked-remember" v-model="checked">记住账号</el-checkbox>
          <el-link :underline="false" class="forget-paw fr" @click="handleGoToMima">忘记密码</el-link>
        </el-form-item>

        <el-form-item class="submit">
          <el-button size="small" type="primary" @click="handleSubmit">登录</el-button>
        </el-form-item>

      </el-form>
      <p class="copyright"><span>&copy</span><a style="color: #ffffff;" href="https://beian.miit.gov.cn/" target="_blank">2011 仕邦人力资源有限公司 版权所有 粤ICP备09126418号-1</a></p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        stamp: '',
        code: ''
      },
      checked: false,
      imgcodeSrc: '',
      base64 : require('js-base64').Base64
    }
  },
  mounted () {
    this.getCookie()
    this.getNewcodeImg()
  },
  methods: {
    getNewcodeImg () {
      this.loginForm.stamp = String(new Date().getTime())
      this.imgcodeSrc = '/api/api/sys/validate/image/code/' + this.loginForm.stamp
    },
    /* 登录 */
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let pwd = this.loginForm.code + this.loginForm.password;
          this.$http({
            url: '/api/sys/login',
            method: 'POST',
            data: {
              username: this.loginForm.username,
              password: this.base64.encode(pwd),
              stamp: this.loginForm.stamp,
              code: this.loginForm.code
            }
          }).then(({ data }) => {
            if (data.data[0].token == '' || data.data[0].token == null) {
              this.$message.error('用户名或者密码错误')
              return
            }
            /* 存储token 到浏览器 */
            if (this.checked) {
              this.$store.commit('updateRememberPsw', true)
            } else {
              this.$store.commit('updateRememberPsw', false)
            }

            this.$store.commit('isLogin', true)
            this.$store.commit('updateUsername', this.loginForm.username)
            this.$store.commit('updateToken', data.data[0].token)
            this.$store.commit('updateActivePath', '/index')
            this.$router.replace('/index')
          })
        }
      })
    },
    // 读取cookie
    getCookie () {
      let username = this.$store.state.username
      let rememberPsw = this.$store.state.rememberPsw
      if (rememberPsw === 'true' || rememberPsw === true) {
        this.checked = true
        this.loginForm.username = username
      }
    },
    /* 忘记密码 */
    handleGoToMima () {
      this.$router.push('/retrievePsd')
    }
  }
}
</script>

<style scoped lang="less">
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('../assets/images/register-bg1.png') center no-repeat;
  .login {
    text-align: center;
    width: 680px;
    height: 680px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -340px;
    margin-left: -340px;
    background: url('../assets/images/register-bg2.png');
    .title {
      display: flex;
      justify-content: center;
      margin: 175px 0 33px 0;
      img {
        margin-right: 19px;
      }
      .text {
        color: #04578E;
        h3 {
          font-size: 33px;
          font-weight: 400;
          letter-spacing:6.5px;
        }
        p {
          font-size: 19px;
        }
      }
    }
    /deep/.el-form {
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
    }
    /deep/.el-form-item .is-required{
      display: flex;
      justify-content: center;
    }

    /deep/.el-form-item{
      margin-bottom: 10px;
    }
    /deep/.el-form-item:first-child, /deep/.el-form-item:nth-of-type(2){
      margin-bottom: 20px;
    }
    /deep/.el-form-item__content{
        display: flex;
        align-items: center;
        margin:  0 auto;
        margin-left: 0 !important;
        width: 320px;
        position: relative;
        .icon-img{
          display: inline-block;
          width: 26px;
          height: 26px;
          position: absolute;
          top: 7px;
          left: 12px;
          z-index: 999;
        }
      }
    /deep/.user-input .el-input__inner{
      text-indent: 3em;
    }
      /deep/.el-input__inner{
          height: 40px !important;
          background:#fff;
          border-radius:2px;
          border: none;
          box-shadow:0px 2px 14px 0px rgba(138,138,138,0.15);
        }
    /deep/.select {
      margin: 0 auto;
      width: 320px;
      display: flex;
      justify-content: space-between;
      .forget-paw{
        margin-left: 175px;
        color: #909399;
      }
    }
    .submit {
      width: 320px;
      margin: 0 auto;
      .el-button {
        width: 100%;
        height: 40px;
        font-size: 16px;
      }
    }
  }
  .copyright{
    position: fixed;
    color: #fff;
    font-size: 16px;
    bottom: 35px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
