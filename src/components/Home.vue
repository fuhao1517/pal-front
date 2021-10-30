<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside style="z-index:5555;" :width="isCollapse ? '64px' : '230px'">
      <div class="logo">
        <el-image class="logo-img" :src="userInfo.logoUrl" fit="cover"></el-image>
        <p :title="userInfo.company" class="enterprise-name">{{userInfo.company}}</p>
      </div>
      <!-- <div class="toggle-button" style="padding: 10px 0" @click="isCollapse = !isCollapse">
         <el-tooltip v-show="isCollapse" class="item" effect="light" content="展开" placement="right">
           <i class="el-icon-s-unfold font-20"></i>
         </el-tooltip>

         <el-tooltip v-show="!isCollapse" class="item" effect="light" content="收起" placement="right">
           <i class="el-icon-s-fold font-20"></i>
         </el-tooltip>
       </div>-->
      <!-- 侧边栏菜单区域 -->
      <el-menu background-color="#2A3B67" text-color="#fff" text-size="24px" active-text-color="#ffffff" unique-opened
               :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath"
               @select="handleSelect">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="(item,index) in menulist" :key="index" v-if="item.childTrees.length>0">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="item.frontCls+' ic-menu-icon'"></i>
            <!-- 文本 -->
            <span slot="title">{{item.name}}</span>
          </template>

          <!--第三级菜单-->

          <el-submenu :index="subItem2.id + ''" v-for="(subItem2, subIndex) in item.childTrees" :key="subItem2.id"
                      v-if="subItem2.childTrees.length>0">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="subItem2.frontCls+' ic-menu-icon'"></i>
              <!-- 文本 -->
              <span slot="title">{{subItem2.name}}</span>
            </template>
            <el-menu-item :index="'/' + subItem3.url" v-for="subItem3 in subItem2.childTrees" :key="subItem3.id"
                          @click="saveNavState('/'+subItem3.url)">
              <template slot="title">
                <!-- 图标 -->
                <i :class="subItem3.iconClass+' ic-menu-icon'"></i>
                <!-- 文本 -->
                <span>{{ subItem3.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <!-- 二级菜单区域 -->
          <el-menu-item :index="'/' + subItem.url" v-for="subItem in item.childTrees" :key="subItem.id"
                        @click="saveNavState('/'+subItem.url)" v-if="subItem.childTrees.length==0">
            <template slot="title">
              <!-- 图标 -->
              <i :class="subItem.iconClass+' ic-menu-icon'"></i>
              <!-- 文本 -->
              <span>{{ subItem.name }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="'/' + item.url" @click="saveNavState('/'+item.url)">
          <!-- 图标 -->
          <i :class="item.iconClass+' ic-menu-icon'"></i>
          <!-- 文本 -->
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 头部和右侧主体 -->
    <el-container>
      <!-- 头部 -->
      <el-header style="z-index:9990;">
        <div class="search-box">
          <el-autocomplete
            class="header-search"
            v-model="searchWord"
            :fetch-suggestions="querySearch"
            placeholder="请输入搜索内容"
            :trigger-on-focus="false"
            :popper-append-to-body="false"
            @select="handleSearch">
            <i class="search-icon el-icon-search" slot="suffix" @click.stop="stop()"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
            </template>
          </el-autocomplete>
        </div>
        <img class="userImg" src="../assets/images/icons/ic-account-type7.png" alt="">
        <el-dropdown class="el-dropdown">
          <span class="el-dropdown-link">
            {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="passwordDialog=true">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="info">
          <div class="number">{{infoNumber}}</div>
          <img class="info-img" src="../assets/images/icons/ic-account-type10.png" alt="">
        </div>

        <el-dropdown class="el-dropdown" style="margin-right: 0;">
          <p class="el-dropdown-link">
            <img @click="accountSettings" class="set" src="../assets/images/icons/ic-account-type8.png" alt="">
          </p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="accountSettings">设置账户</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="line"></div>
        <el-dropdown class="el-dropdown">
          <p class="el-dropdown-link">
            <img @click="dialogVisible=true" class="out" src="../assets/images/icons/ic-account-type9.png" alt="">
          </p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogVisible=true">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 右侧主体 -->
      <el-main>
        <div class="main-container">
          <router-view :key="routerViewKey"></router-view>
        </div>
      </el-main>
    </el-container>
    <!-- 退出登录弹窗 -->
    <el-dialog title="确认提示" :visible.sync="dialogVisible" width="600px" :close-on-click-modal='false'
               :show-close='false'>
      <div class="title">
        <img class="mr-20" src="../assets/images/icons/ic-account-type11.png" alt="">
        <p class="login-out">退出系统确认</p>
      </div>
      <p class="warning mt-10">确定要退出登录吗？</p>
      <div class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" style="margin-left:50px;" type="primary" @click="logout">确认</el-button>
      </div>
    </el-dialog>

    <!-- 绑定手机号弹窗 -->
    <el-dialog class="phone-dialog" title="绑定手机号" :visible.sync="bindPhoneDialogVisible" width="600px"
               :close-on-click-modal='false' :show-close='false'>
      <p class="phone-title">您的账号存在安全风险，我们已经为您采取保护措施，建议您先绑定手机号</p>
      <el-form class="el-form" :model="phoneForm" ref="phoneForm" label-width="100px">
        <el-form-item prop="phone" label="手机号"
                      :rules="[{ required: true, message: '请输入手机号',trigger:'blur'}, { validator:this.$global.isPhoneValidator, trigger:'blur'}]">
          <el-input type="text" v-model="phoneForm.phone" style="width:360px;"></el-input>
        </el-form-item>

        <!--<el-form-item prop="authCode" label="短信验证码" :error="phoneForm.errorMsg" :rules="[{ required: true, message: '请输入验证码',trigger:'blur'}]">-->
        <el-form-item prop="authCode" label="短信验证码" :rules="[{ required: true, message: '请输入验证码',trigger:'blur'}]">
          <el-input type="text" v-model="phoneForm.authCode" style="width:240px;"></el-input>
          <el-button @click="handleSendCode" :disabled="phoneForm.isSendPhone"
                     v-text="phoneForm.sendPhoneText"></el-button>
        </el-form-item>
        <el-form-item label-width="0">
            <el-button size="small" style="width:103px" type="primary" @click="handleBindPhone" :loading="phoneForm.btnLoading">确认</el-button>
            <el-button size="small" @click="bindPhoneDialogVisible=false" style="margin-left: 100px;">取 消</el-button>
        </el-form-item>
      </el-form>
      <p class="footer-info">您可使用此手机号找回密码</p>
      <p class="footer-info">请勿随意泄露手机号，以防被不法分子利用，骗取账号信息</p>
    </el-dialog>

    <updatePsw :passwordDialog="passwordDialog" @changePswDialog="changePswDialog"></updatePsw>
  </el-container>
</template>

<script>
import updatePsw from '@/components/common/updatePsw'

export default {
  components: { updatePsw },
  inject: ['reload'],
  data () {
    return {
      infoNumber: 0,
      userInfo: {
        username: '',
        company: '',
        logoUrl: ''
      },
      dialogVisible: false,
      bindPhoneDialogVisible: false,
      phoneForm: {
        phone: '',
        authCode: '',
        stamp: '',
        isSendPhone: false,
        sendPhoneText: '发送验证码',
        btnLoading: false,
        errorMsg: ''
      },
      passwordDialog: false,
      // 左侧菜单数据
      menulist: [],
      currentInfo: {},
      companyInfo: {},
      imageUrl: '',
      isCollapse: false,
      activePath: '/index',
      companyHeaderImageUrl: '',
      routerViewKey: new Date().getTime(),
      searchWord: '',
      menuSearchList: []
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.$store.commit('updateActivePath', val.path)
        var meta = val.meta
        if (meta && meta.parentPath && meta.parentPath != null && meta.parentPath !== '') {
          this.handleSelect(meta.parentPath)
        } else {
          this.handleSelect(val.path)
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created () {
    // 在生命周期钩子中获取所有数据
    this.getMenuList()
    this.getCurrentInfo()
    var meta = this.$route.meta
    var activePath = this.$store.state.activePath
    if (meta && meta.parentPath && meta.parentPath != null && meta.parentPath !== '') {
      activePath = meta.parentPath
    }
    if (activePath) {
      this.activePath = activePath
    }
  },
  mounted () {
    // this.getMenuList()
  },
  methods: {
    /* 绑定手机号-发送验证码 */
    handleSendCode () {
      this.$refs.phoneForm.validateField('phone', (errorMessage) => {
        if (!errorMessage) {
          this.phoneForm.stamp = String(new Date().getTime())
          this.$http({
            url: '/api/sys/mobile/send/code',
            method: 'POST',
            data: {
              type: 'register',
              mobile: this.phoneForm.phone,
              stamp: this.phoneForm.stamp
            }
          }).then(({ data }) => {
            let s = 60
            let that = this
            that.phoneForm.isSendPhone = true
            that.phoneForm.sendPhoneText = '重新获取(' + s + 's)'
            this.timer = setInterval(function () {
              if (s > 0) {
                that.phoneForm.sendPhoneText = '重新获取(' + s + 's)'
              } else {
                that.phoneForm.isSendPhone = false
                that.phoneForm.sendPhoneText = '重新获取'
                clearInterval(that.timer)
              }
              --s
            }, 1000)
          })
        }
      })
    },
    changePswDialog (status) {
      this.passwordDialog = status
    },
    /* 绑定手机号 */
    handleBindPhone () {
      this.phoneForm.btnLoading = true
      this.$refs.phoneForm.validate((valid) => {
        if (valid) {
          // 先校验手机号码+短信验证码
          if (this.phoneForm.stamp == '') {
            this.$message.warning('请先获取验证码')
            this.phoneForm.btnLoading = false
            return false
          }
          this.$http({
            url: '/api/sys/mobile/validate/code',
            method: 'POST',
            data: {
              type: 'register',
              mobile: this.phoneForm.phone,
              stamp: this.phoneForm.stamp,
              msgCode: this.phoneForm.authCode
            }
          }).then(({ data }) => {
            if (data.data[0].status === 1) {
              //  成功
              // this.phoneForm.errorMsg = ''
              this.setPhone()
            } else {
              // this.phoneForm.errorMsg = '验证码不正确'
              this.$message.error('验证码不正确')
              this.phoneForm.btnLoading = false
            }
            console.log('phoneForm.errorMsg==' + this.phoneForm.errorMsg)
          })
        } else {
          this.phoneForm.btnLoading = false
        }
      })
    },
    setPhone () {
      this.$http({
        url: '/api/sys/modify/user',
        method: 'POST',
        data: {
          username: this.$store.state.username,
          mobile: this.phoneForm.phone
        }
      }).then(({ data }) => {
        if (data.data[0].status === 1) {
          //  成功
          this.bindPhoneDialogVisible = false
          this.$message.success('绑定成功')
        } else {
          this.$message.warning(data.data[0].msg)
        }
        this.phoneForm.btnLoading = false
      }).catch((data) => {
        this.phoneForm.btnLoading = false
      })
    },
    querySearch (queryString, cb) {
      var menuSearchList = this.menuSearchList
      var results = queryString ? menuSearchList.filter(this.createFilter(queryString)) : menuSearchList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSearch (item) {
      this.$router.push('/' + item.url)
    },
    stop () {
      return false
    },
    accountSettings () {
      this.$router.push('/accountSettings')
    },
    logout () {
      this.$http({
        url: '/api/sys/logout',
        method: 'post',
        data: {}
      }).then(({ data }) => {
        this.$store.dispatch('clearLoginInfo')
        this.$router.replace('/login')
      })
    },
    // 获取所有的菜单数据
    async getMenuList () {
      const { data: res } = await this.$http.post('/api/sys/menu')
      if (res.data[0]) {
        this.menulist = res.data[0]
        this.getMenuSearchList(this.menulist)
        console.log(this.menuSearchList)
        // this.reload() 刷新页面的数据
      } else {
      }
      // this.reload()
    },
    getMenuSearchList (menulist) {
      menulist.forEach((item, index) => {
        if (item.childTrees && item.childTrees.length > 0) {
          this.getMenuSearchList(item.childTrees)
        } else {
          this.menuSearchList.push(item)
        }
      })
    },
    // 获取当前登录用户的信息
    getCurrentInfo () {
      this.$http({
        url: '/api/sys/get/user/' + this.$store.state.username,
        method: 'post',
        data: {}
      }).then(({ data }) => {
        this.userInfo = data.data[0]
        this.$store.commit('updateUserData', data.data[0])
        if (this.$lodash.isEmpty(data.data[0].mobile)) {
            if (this.$store.state.isLogin){
                this.bindPhoneDialogVisible = true
                this.$store.commit('isLogin', false)
            }
        }
      })
    },
    saveNavState (activePath) {
      this.routerViewKey = this.$global.UUID()
      this.$store.commit('updateActivePath', activePath)
      this.activePath = activePath // 从本地回话存储中取出
      this.$router.replace({
        path: activePath,
        query: {
          randomStr: this.$global.UUID() // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
        }
      })
      // this.reload()
    },
    viewReload () {
      this.routerViewKey = this.$global.UUID()
    },
    handleSelect (index) {
      this.activePath = index
    }
  }
}
</script>
<style lang="less" scoped>
  .home-container {
    height: 100%;
    max-width: 100%;
    box-sizing: border-box;
    /deep/.el-container{
      max-width: calc(100% - 231px);
      width: calc(100% - 230px);
    }
    /deep/ .el-dialog__header {
      border-bottom: 1px solid #BFBFBF;
    }
    .title {
      display: flex;
      align-items: center;
      img {
        margin-left: 36px;
      }
    }
    .login-out {
      font-size: 18px;
      color: #606266;
    }
    .warning {
      margin-left: 86px;
      margin-bottom: 50px;
    }
    .dialog-footer {
      text-align: center;
    }
    .phone-dialog {
      /deep/ .el-dialog__body {
        padding: 28px 0 0 55px;
        /deep/ .el-form-item, .is-required {
          margin-top: 30px;
          margin-left: 7px;
          /deep/ .el-button--default {
            width: 103px;
            height: 36px;
            margin-left: 17px;
            color: #409EFF;
            text-align: center;
            line-height: 36px;
            padding: 0;
            border-color: #409EFF;
          }
        }
        /deep/ .el-form-item:last-child {
          margin: 69px 0 19px 85px;
          /deep/ .el-button--primary {
            width: 320px;
            height: 36px;
            margin: 0 auto;
          }
        }
        .footer-info {
          color: #909399;
        }
        .footer-info:last-child {
          padding: 0px 0 19px 0;
        }
      }
    }

    .el-aside {
      /*display: inline-block;*/
      width: 230px;
      height: 100%;
      background: url("../assets/images/bg-2.png") no-repeat;
      background-size: cover;
      .logo {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        .logo-img {
          width: 27px;
          height: 29px;
          margin-right: 11px;
        }
        .enterprise-name {
          width: 166px;
          height: 29px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 19px;
          color: #fff;
        }
      }
      .toggle-button {
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
      }
      .el-menu {
        border-right: none;
        font-size: 25px;
        background: none !important;
      }
      /deep/ .el-menu-item {
        background: none !important;
      }
      /deep/ .el-submenu .el-menu, .el-submenu .el-menu-item {
        background: none !important;
      }
      /deep/ .el-submenu__icon-arrow, .el-icon-arrow-down {
        color: #fff;
      }
      .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow,
      .el-submenu__icon-arrow {
        color: #ffffff;
      }
      /deep/ .el-submenu__title {
        background: none !important;
      }
      /deep/ .el-menu-item.is-active {
        background: #409EFF !important;
      }
      .el-submenu.is-opened {
        background: none !important;
      }

    }
    .el-header {
      /*display: flex;
      justify-content: flex-end;
      align-items: center;*/
      position: fixed;
      width: 100%;
      padding-right: 230px;
      color: #fff;
      font-size: 20px;
      background-color: #ffffff;
      text-align: right;
      padding-right: 230px;
      overflow: hidden;
      .search-box {
        display: inline-block;
        /deep/.el-autocomplete-suggestion li{
          text-align: left;
        }
        /deep/.el-autocomplete-suggestion__list li:hover{
          background-color: #ECF5FF;
          color: #409EFF;
        }
        /deep/.search-icon {
          color: #C0C4CC;
          font-size: 18px;
          margin-top: 7px;
          margin-right: 5px;
          cursor: pointer;
        }
        .header-search {
          width: 280px;
          margin-right: 30px;
        }
      }
      .userImg{
        display: inline-block;
        vertical-align: middle;
      }
      .container {
        background-color: #fff;
        padding: 20px;
      }
      .el-dropdown {
        margin: 0 20px 0 10px;
        cursor: pointer;
      }
      .info {
        display: inline-block;
        position: relative;
        cursor: pointer;
        vertical-align: middle;
        margin-top: 7px;
        .number {
          position: absolute;
          top: -3px;
          right: -5px;
          width: 14px;
          height: 14px;
          background: #FD6154;
          border-radius: 50%;
          font-size: 10px;
          text-align: center;
          line-height: 14px;
        }
      }
      .set {
        display: inline-block;
        margin-left: 23px;
        vertical-align: middle;
      }
      .line {
        display: inline-block;
        vertical-align: middle;
        width: 1px;
        height: 60px;
        background: #ddd;
        margin: 0 20px;
      }
      .out {
        display: inline-block;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .el-main {
      background-color: @bodyBaseBgc;
      height: 100%;
    }
  }
</style>
