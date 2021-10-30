<template>
    <div>
      <!-- 更换密码 -->
      <el-dialog title="修改用户密码" class="spl-dialog" :visible.sync="passwordDialog" :close-on-click-modal="false" width="600px" center :before-close="cancelEditPassword">
        <el-form :model="password" ref="password" label-width="156px">
          <div class="add-ruleForm">
            <el-form-item label="用户名" :rules="[{ required: true, message: '', trigger: 'blur'}]">
              <p>{{username}}</p>
            </el-form-item>

            <!--
            :rules="[{ required: true, message: '请输入当前密码', trigger: 'blur'},{validator:this.validUserPassword,trigger:'blur'}]">
            -->
            <el-form-item label="旧密码" prop="oldPassWord" :rules="[{ required: true, message: '请输入当前密码', trigger: 'blur'}]">
              <el-input v-model="password.oldPassWord" type="password" placeholder="请输入" class="w-320" autocomplete="new-password"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="newPassWord" :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' },{validator:this.checkPassword1,trigger:'blur'}]">
              <el-input v-model="password.newPassWord" type="password" placeholder="密码不能纯数字" class="w-320" autocomplete="new-password"></el-input>
            </el-form-item>

            <el-form-item label="确认新密码" prop="checkNew" :rules="[{ required: true, message: '请再次输入新密码', trigger: 'blur' },{validator:this.checkPassword2,trigger:'blur'}]">
              <el-input v-model="password.checkNew" type="password" placeholder="请输入" class="w-320" autocomplete="new-password"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer operate-btns-bottom" style="padding-top: 30px;padding-bottom: 40px;">
          <el-button @click="cancelEditPassword" class="mr-40">取 消</el-button>
          <el-button type="primary" :loading="passwordBtnLoading" @click="savePassword">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'updatePsw',
  data () {
    return {
      username: this.$store.state.username,
      passwordBtnLoading: false,
      password: {
        oldPassWord: '',
        newPassWord: '',
        checkNew: ''
      },
      base64 : require('js-base64').Base64
    }
  },
  props: {
    passwordDialog: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  created () {
  },
  methods: {
    /* 修改用户登录密码-取消 */
    cancelEditPassword (done) {
      this.password = {
        oldPassWord: '',
        newPassWord: '',
        checkNew: ''
      }
      this.passwordBtnLoading = false
      this.$refs.password.resetFields()
      // if (typeof done === 'function') {
      //   done()
      // } else {
      //   this.passwordDialog = false
      // }
      this.$emit('changePswDialog', false)
    },
    /* 修改用户登录密码-保存 */
    savePassword () {
      this.$refs.password.validate((valid) => {
        if (valid) {
          this.passwordBtnLoading = true
          this.saveEdit({
            // password: this.password.oldPassWord,
            // newpassword: this.password.newPassWord,
            // checkpassword: this.password.checkNew

            // mobile: this.$store.state.userData.mobile,
            // msgCode: this.secondForm.phoneCode,
            username: this.$store.state.username,
            password: this.base64.encode(this.$store.state.username + this.password.oldPassWord),
            newpassword: this.base64.encode(this.$store.state.username + this.password.newPassWord),
            checkpassword: this.base64.encode(this.$store.state.username + this.password.checkNew)
          }, '修改成功')
          // 关闭修改密码窗口
        }
      })
    },
    /* 保存 */
    saveEdit (editInfo, successMsg, callback) {
      var setData = editInfo
      setData.username = this.username
      this.$http({
        url: '/api/sys/modify/password',
        method: 'post',
        data: editInfo
      }).then(({ data }) => {
        if (data.data[0].status === 1) {
          if (successMsg) {
            this.$message.success(successMsg)
          }
          this.cancelEditPassword()
        } else {
          var msg = data.data[0].msg ? data.data[0].msg : '修改失败'
          this.$message.error(msg)
          this.passwordBtnLoading = false
        }
      }).catch(data => {
        this.passwordBtnLoading = false
      })
    },
    /* 密码校验规则-不能输入纯数字或空 */
    checkPassword1 (rule, value, callback) {
      var regex = new RegExp(this.$global.pswRegExp)
      if (!regex.test(value)) {
        callback(new Error(this.$global.pswRegExpMsg))
      } else if (this.password.checkNew != '') {
        this.$refs.password.validateField('checkNew')
      }
      callback()
    },
    /* 密码校验规则-两次密码不一致 */
    checkPassword2 (rule, value, callback) {
      if (this.password.newPassWord != '' && this.password.checkNew != '' && this.password.newPassWord != this.password.checkNew) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    /* 验证用户旧密码 */
    /* validUserPassword (rule, value, callback) {
            if (value != undefined && value != null && value != '') {
              this.$http({
                url: '/sys/modify/password',
                method: 'post',
                data: {
                  userId: this.userId,
                  password: this.password.oldPassWord
                }
              }).then(({ data }) => {
                if (data.code == -1) {
                  if (!data.data) {
                    callback(new Error(data.msg))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              })
            }
          }, */
  }
}
</script>

<style lang='less' scoped>

</style>
