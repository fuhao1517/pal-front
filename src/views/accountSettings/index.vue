<template>
  <div class="account-container">
    <div class="account-container-main">
      <router-link to="/index">
        <el-button class="s-btn w-90" icon="el-icon-arrow-left">返回首页</el-button>
      </router-link>
      <!-- 用户上传 -->
      <div class="text-center mt-40">
        <el-image v-if="imageUrl" :src="imageUrl" fit="cover" style="min-width: 200px; min-height: 120px;" :preview-src-list="imageUrlPreview"></el-image>
        <img v-else src="../../assets/images/default-headImg.png" width="104px" height="119px" style="border-radius: 115px">
        <div>
          <el-upload ref="upload" :action="this.$global.uploadImgUrl" :headers="this.$global.setUploadHeaders" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :show-file-list="false" accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF" :auto-upload="true" :multiple="false">
            <el-button type="text">上传logo</el-button>
          </el-upload>
        </div>
      </div>
      <div class="type-list">
        <!-- 公司名称 -->
        <el-row class="edit-type">
          <el-col :span="24">
            <img class="icon ic-account-type1" src="@/assets/images/icons/ic-account-type1.png" alt="" width="20px" height="22px">
            <span class="text required">公司名称</span>
            <span>{{userInfo.company}}</span>
          </el-col>
        </el-row>
        <!-- 用户名： -->
        <el-row class="edit-type">
          <el-col :span="24">
            <img class="icon ic-account-type2" src="@/assets/images/icons/ic-account-type2.png" alt="" width="20px" height="20px">
            <span class="text required">用户名</span>
            <span>{{userInfo.username}}</span>
          </el-col>
        </el-row>
        <!-- 手机号码： -->
        <el-row class="edit-type">
          <el-col :span="17">
            <img class="icon ic-account-type3" src="@/assets/images/icons/ic-account-type3.png" alt="" width="16px" height="22px">
            <span class="text required">手机号码</span>
            <span>{{userInfo.mobile}}</span>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple userrole text-right">
              <el-button type="primary" class="s-btn" @click="doChangePhone">修改</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 用户邮箱：-->
        <el-row class="edit-type">
          <el-col :span="17">
            <div class="clearfix">
              <img class="icon ic-account-type4" src="@/assets/images/icons/ic-account-type4.png" alt="" width="20px" height="16px">
              <span class="text required">用户邮箱</span>
              <span v-show="!isEditUserEmail">{{userInfo.email}}</span>
              <el-form :model="editUserEmail" ref="editUserEmail" class="inlineBlock" v-show="isEditUserEmail">
                <el-form-item prop="email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
                  <el-input class="w-250" v-model="editUserEmail.email"></el-input>
                </el-form-item>
              </el-form>

            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple userrole text-right" v-show="!isEditUserEmail">
              <el-button type="primary" class="s-btn" @click="isEditUserEmail=true">修改</el-button>
            </div>
            <div class="grid-content bg-purple userrole text-right" v-show="isEditUserEmail">
              <el-button class="s-btn" @click="cancelEditUserEmail">取消</el-button>
              <el-button type="primary" class="s-btn" @click="saveEditUserEmail">保存</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 用户密码 -->
        <el-row class="edit-type">
          <el-col :span="17">
            <img class="icon ic-account-type5" src="@/assets/images/icons/ic-account-type5.png" alt="" width="20px" height="25px">
            <span class="text required">用户密码</span>
            <span>******</span>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple userrole text-right">
              <el-button type="primary" class="s-btn" @click="passwordDialog=true">修改</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 更换手机号 -->
    <el-dialog title="修改手机号码" class="spl-dialog" :visible.sync="editPhoneDialog" :close-on-click-modal="false" width="600px" center :before-close="cancelChangePhone">
      <!-- 更换手机号-旧 -->
      <el-form v-show="changePhoneStep==1" :model="oldPhoneForm" ref="oldPhoneForm" label-width="130px">
        <div class="add-ruleForm">
          <el-form-item label="当前手机号" :rules="{ required: true, message: '', trigger: 'blur' }">
            <p v-text="oldPhoneForm.phone"></p>
          </el-form-item>

          <el-form-item label="图片验证码" prop="imgCode" :rules="{ required: true, message: '请输入图片验证码', trigger: 'blur' }">
            <el-input v-model="oldPhoneForm.imgCode" placeholder="请输入图片验证码" class="w-150 mr-15"></el-input>
            <img :src="oldPhoneForm.imgCodeUrl" class="imgCode" width="110px" height="36px">
            <span class="ml-10 inlineBlock lh-com">看不清？<span class="text-blue f-cursor" @click="changeImgCode">换一张</span></span>
          </el-form-item>

          <el-form-item label="短信验证码" prop="verifyCode" :rules="{ required: true, message: '请输入短信验证码', trigger: 'blur' }">
            <el-input v-model="oldPhoneForm.verifyCode" placeholder="请输入短信验证码" class="w-150"></el-input>
            <el-button class="s-btn btn--border-blue ml-15" style="width: 110px;" @click="sendPhoneCode" :disabled="oldPhoneForm.isSendOldPhone" v-text="oldPhoneForm.sendOldPhoneText"></el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 更换手机号-新 -->
      <el-form v-show="changePhoneStep==2" :model="newPhoneForm" ref="newPhoneForm" label-width="130px">
        <div class="add-ruleForm">
          <el-form-item label="新手机号" prop="phone" :rules="[{ required: true, message: '请输入新手机号', trigger: 'blur' },{validator:this.$global.isPhoneValidator,trigger:'blur'}]">
            <el-input v-model="newPhoneForm.phone" placeholder="请输入新手机号" class="mr-15" style="width: 370px;"></el-input>
          </el-form-item>

          <el-form-item label="短信验证码" prop="verifyCode" :rules="{ required: true, message: '请输入短信验证码', trigger: 'blur' }">
            <el-input v-model="newPhoneForm.verifyCode" placeholder="请输入短信验证码" style="width: 244px;"></el-input>
            <el-button class="s-btn btn--border-blue" style="width: 110px;margin-left: 17px;" @click="sendPhoneCode" :disabled="newPhoneForm.isSendNewPhone" v-text="newPhoneForm.sendNewPhoneText"></el-button>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer operate-btns-bottom" style="padding-top: 30px;padding-bottom: 40px;">
        <el-button @click="cancelChangePhone" class="mr-60 w-90">取 消</el-button>
        <el-button type="primary" class="w-90" :loading="changePhoneLoading" @click="changePhoneSave">确 认</el-button>
      </div>
    </el-dialog>

    <updatePsw :passwordDialog="passwordDialog" @changePswDialog="changePswDialog"></updatePsw>

  </div>
</template>
<script>
import updatePsw from '@/components/common/updatePsw'
export default {
  components: { updatePsw },
  data () {
    return {
      imageUrl: '', // 企业logo
      imageUrlPreview: [], // 图片预览
      isEditUserEmail: false,
      changePhoneStep: 1,
      changePhoneLoading: false,
      editPhoneDialog: false,
      username: '', // 用户名
      oldPhoneForm: {
        phone: '',
        setPhone: '',
        imgCode: '',
        verifyCode: '',
        stamp: '',
        imgCodeUrl: '',
        isSendOldPhone: false,
        sendOldPhoneText: '发送验证码'
      },
      newPhoneForm: {
        phone: '',
        verifyCode: '',
        isSendNewPhone: '',
        sendNewPhoneText: '发送验证码'
      },

      passwordDialog: false,
      // passwordBtnLoading: false,
      // password: {
      //   oldPassWord: '',
      //   newPassWord: '',
      //   checkNew: ''
      // },
      userId: '',
      userInfo: {},
      editUserEmail: {
        email: ''
      },
      timer: null
    }
  },
  created () {
    this.userId = this.$route.query.userId
    this.$nextTick(() => {
      this.getUserInfo()
      this.changeImgCode()
    })
  },
  filters: {
    parseRoles (value) {
      if (value && value.length > 0) {
        var roleNames = []
        value.forEach(item => {
          roleNames.push(item.roleName)
        })
        return roleNames.join(',')
      }
      return ''
    }
  },
  methods: {
    /* 获取用户信息 */
    getUserInfo () {
      this.$http({
        url: '/api/sys/get/user/' + this.$store.state.username,
        method: 'post',
        data: {}
      }).then(({ data }) => {
        this.userInfo = data.data[0]
        this.oldPhoneForm.phone = data.data[0].mobile
        this.editUserEmail.email = data.data[0].email
        this.imageUrl = data.data[0].logoUrl
        this.imageUrlPreview = [this.imageUrl]
        if (this.userInfo.mobile) {
          this.oldPhoneForm.setPhone = this.userInfo.mobile.replace(this.userInfo.mobile.substring(3, 7), '****')
        }
      })
    },
    /* 上传文件之前的钩子 */
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    /* 上传成功回调 */
    handleAvatarSuccess (res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      // this.imageUrlPreview = [this.imageUrl]
      let that = this
      this.saveEdit(
        { logoUrl: res.data[0].fileUrl }, '', function () {
          that.getUserInfo()
        }
      )
    },
    /* 更换邮箱 */
    saveEditUserEmail () {
      let that = this
      this.$refs['editUserEmail'].validate((valid) => {
        if (valid) {
          this.saveEdit({
            email: this.editUserEmail.email
          }, '保存成功', function () {
            that.userInfo.email = that.editUserEmail.email
            that.isEditUserEmail = false
            that.getUserInfo()
          })
        }
      })
    },
    /* 更换邮箱-取消 */
    cancelEditUserEmail () {
      this.$refs.editUserEmail.resetFields()
      this.editUserEmail.email = this.userInfo.email
      this.isEditUserEmail = false
    },
    /* 保存 */
    saveEdit (editInfo, successMsg, callback) {
      var setData = editInfo
      // console.log(editInfo)
      setData.username = this.userInfo.username
      this.$http({
        url: '/api/sys/modify/user',
        method: 'post',
        data: editInfo
      }).then(({ data }) => {
        if (data.data[0].status === 1) {
          if (successMsg) {
            this.$message.success(successMsg)
          }
          if (callback) {
            callback()
          }
        } else {
          var msg = data.data[0].msg ? data.data[0].msg : '保存失败'
          this.$message.error(msg)
        }
      })
    },
    /* 修改手机号 */
    doChangePhone () {
      this.editPhoneDialog = true
    },
    /* 修改手机号-取消 */
    cancelChangePhone (done) {
      this.changePhoneStep = 1
      this.oldPhoneForm.imgCode = ''
      this.oldPhoneForm.verifyCode = ''
      this.oldPhoneForm.isSendOldPhone = false
      this.oldPhoneForm.sendOldPhoneText = '发送验证码'
      this.$refs.oldPhoneForm.resetFields()

      this.newPhoneForm.phone = ''
      this.newPhoneForm.verifyCode = ''
      this.newPhoneForm.isSendNewPhone = false
      this.newPhoneForm.sendNewPhoneText = '发送验证码'
      this.$refs.newPhoneForm.resetFields()
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (typeof done === 'function') {
        done()
      } else {
        this.editPhoneDialog = false
      }
    },
    /* 修改手机号-更换验证码 */
    changeImgCode () {
      this.oldPhoneForm.stamp = String(new Date().getTime())
      // console.log('changeImgCode==' + this.oldPhoneForm.stamp)
      this.oldPhoneForm.imgCodeUrl = '/api/api/sys/validate/image/code/' + this.oldPhoneForm.stamp
    },
    /* 修改手机号-发送短信验证码 */
    sendPhoneCode () {
      var validResult = true
      if (this.changePhoneStep === 2) {
        this.$refs.newPhoneForm.validateField('phone', (errorMessage) => {
          if (errorMessage) {
            validResult = false
          }
        })
      }
      if (!validResult) {
        return false
      }
      var stamp = this.oldPhoneForm.stamp
      this.$http({
        url: '/api/sys/mobile/send/code',
        method: 'post',
        data: {
          type: 'changephone',
          mobile: this.oldPhoneForm.phone,
          stamp: stamp
        }
      }).then(({ data }) => {
        var s = 60
        var that = this
        if (this.changePhoneStep === 1) {
          that.oldPhoneForm.isSendOldPhone = true
          that.oldPhoneForm.sendOldPhoneText = '重新获取(' + s + 's)'
          this.timer = setInterval(function () {
            if (s > 0) {
              that.oldPhoneForm.sendOldPhoneText = '重新获取(' + s + 's)'
            } else {
              that.oldPhoneForm.isSendOldPhone = false
              that.oldPhoneForm.sendOldPhoneText = '重新获取'
              clearInterval(that.timer)
            }
            --s
          }, 1000)
        } else {
          that.newPhoneForm.isSendNewPhone = true
          that.newPhoneForm.sendNewPhoneText = '重新获取(' + s + 's)'
          this.timer = setInterval(function () {
            if (s > 0) {
              that.newPhoneForm.sendNewPhoneText = '重新获取(' + s + 's)'
            } else {
              that.newPhoneForm.isSendNewPhone = false
              that.newPhoneForm.sendNewPhoneText = '重新获取'
              clearInterval(that.timer)
            }
            --s
          }, 1000)
        }
      })
    },
    /* 修改手机号-保存 */
    changePhoneSave () {
      if (this.changePhoneStep === 1) {
        this.$refs.oldPhoneForm.validate((valid) => {
          if (valid) {
            // 校验旧手机
            var that = this
            this.validPhoneCode(this.oldPhoneForm.phone, this.oldPhoneForm.verifyCode, function () {
              if (that.timer) {
                clearInterval(that.timer)
              }
              that.changePhoneStep = 2
              that.newPhoneForm.isSendNewPhone = false
            })
          }
        })
      } else {
        //  校验新手机
        this.$refs.newPhoneForm.validate((valid) => {
          var that = this
          if (valid) {
            this.validPhoneCode(this.newPhoneForm.phone, this.newPhoneForm.verifyCode, function () {
              that.saveEdit({
                mobile: that.newPhoneForm.phone
              }, '保存成功')
              that.cancelChangePhone()
              that.getUserInfo()
            })
          }
        })
      }
    },
    /* 校验验证码 */
    validPhoneCode (phone, code, callBack) {
      this.$http({
        url: '/api/sys/mobile/validate/code',
        method: 'post',
        data: {
          type: 'changephone',
          mobile: phone,
          stamp: this.oldPhoneForm.stamp,
          imageCode: this.oldPhoneForm.imgCode,
          msgCode: code
        }
      }).then(({ data }) => {
        if (data.data[0].status === 1) {
          if (callBack) {
            callBack()
          }
        } else {
          var msg = data.data[0].msg ? data.data[0].msg : '验证失败'
          this.$message.error(msg)
        }
      })
    },
    changePswDialog (status) {
      this.passwordDialog = status
    }
  }
}
</script>
<style lang="less" scoped>
.account-container {
  height: calc(100% - 40px);
  padding: 20px 0;
}

.account-container-main {
  max-width: @mainContainerWidth;
  width: 100%;
  margin: 0 auto;
  min-height: 100%;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}

/deep/ .el-button [class*='el-icon-'] + span {
  margin-left: 0;
}

.username {
  margin-top: 107px;
}

.usertime {
  margin-top: 190px;
  display: flex;
  flex: 1;
  text-align: right;
}

.row-small {
  margin-left: 0px;
}

.userinfo {
  background-color: #bac9e2;
  color: #58a3f7;
  font-size: 18px;
  margin-left: 0px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.usetip {
  color: #409eff;
  margin-left: 55px;
}

.type-list {
  padding: 0 30px;
}

.edit-type {
  padding: 0 20px;
  border-bottom: 1px solid #dfdfdf;
  min-height: 60px;
  line-height: 60px;
  .s-btn {
    width: 80px;
  }
  .icon {
    vertical-align: middle;
    margin-top: -4px;
  }
  .ic-account-type1 {
    margin-top: -10px;
  }
  .ic-account-type3 {
    margin-top: -5px;
  }
  .ic-account-type5 {
    margin-top: -13px;
  }
  .text {
    display: inline-block;
    width: 70px;
    text-align: right;
    margin-left: 10px;
    margin-right: 20px;
  }
}
.edit-type:last-of-type {
  border-bottom: none;
}
.imgCode {
  vertical-align: middle;
}
</style>
