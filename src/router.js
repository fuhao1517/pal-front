// 路由文件
import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
// 导入 vue 和 vue-router  相当于
// <script src="vue.js">  <script src="vue-router.js">

// 添加路由规则
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

// 暴露
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/about'
    }, // 重定向
    {
      path: '/login',
      component: () => import('./components/Login.vue')
    },
    {
      path: '/about', // 首页介绍页面
      component: () => import('./views/About')
    },
    {
      path: '/home',
      component: () => import('./components/Home'),
      // redirect: '/welcome',
      children: [
      // 这个链接跳到对应的组件
      // 首页
        {
          path: '/index',
          component: () => import('./views/index/index')
        },
        /* 人员管理 */
        // 员工列表
        {
          path: '/employee/index',
          component: () => import('./views/employee/index')
        },
        // 入离职管理--入职管理
        {
          path: '/employee/entryManage/index',
          component: () => import('./views/employee/entryManage/index')
        },
        // 入离职管理--入职登记表
        {
          path: '/employee/entryManage/entryTable',
          component: () => import('./views/employee/entryManage/entryTable')
        },
        /* 添加员工 */
        {
          path: '/employee/empAdd',
          component: () => import('./views/employee/empAdd'),
          meta: {
            parentPath: '/employee/index'
          }
        },
        /* 人员-完善资料 */
        {
          path: '/employee/improveData',
          component: () => import('./views/employee/improveData'),
          meta: {
            parentPath: '/employee/index'
          }
        },
        /* 导入员工 */
        {
          path: '/employee/toLead',
          component: () => import('./views/employee/toLead'),
          meta: {
            parentPath: '/employee/index'
          }
        },
        /* 人员管理-在保名册 */
        {
          path: '/employee/registerList',
          component: () => import('./views/employee/registerList')
        },
        /* 考勤管理 */
        {
          path: '/employee/checkWork',
          component: () => import('./views/employee/checkWork')
        },
        /* 考勤管理详情 */
        {
          path: '/employee/checkWorkDetail',
          component: () => import('./views/employee/checkWorkDetail')
        },
        /* 考勤管理导入 */
        {
          path: '/employee/checkWorkImport',
          component: () => import('./views/employee/checkWorkImport')
        },
        /* 绩效管理 */
        {
          path: '/employee/performance',
          component: () => import('./views/employee/performance')
        },
        /* 绩效管理导入 */
        {
          path: '/employee/performanceImport',
          component: () => import('./views/employee/performanceImport')
        },
        /* 商保-产品方案 */
        {
          path: '/commerceInsurance/index',
          component: () => import('./views/commerceInsurance/index')
        },
        /* 商保-投保管理 */
        {
          path: '/commerceInsurance/insuranceAdmin',
          component: () => import('./views/commerceInsurance/insuranceAdmin')
        },
        /* 商保-增员批量导入 */
        {
          path: '/commerceInsurance/addImport',
          component: () => import('./views/commerceInsurance/addImport'),
          meta: {
            parentPath: '/commerceInsurance/insuranceAdmin'
          }
        },
        /* 商保-录入增员 */
        {
          path: '/commerceInsurance/enteringAdd',
          component: () => import('./views/commerceInsurance/enteringAdd'),
          meta: {
            parentPath: '/commerceInsurance/insuranceAdmin'
          }
        },
        /* 商保-录入减员 */
        {
          path: '/commerceInsurance/enteringDelete',
          component: () => import('./views/commerceInsurance/enteringDelete'),
          meta: {
            parentPath: '/commerceInsurance/insuranceAdmin'
          }
        },
        /* 社保公积金-导入 */
        {
          path: '/socialAccfund/import',
          component: () => import('./views/socialAccfund/import'),
          meta: {
            parentPath: '/socialAccfund/insuranceManage'
          }
        },

        /* 社保公积金-可用方案 */
        {
          path: '/socialAccfund/availableSolutions',
          component: () => import('./views/socialAccfund/availableSolutions')
        },
        /* 社保公积金-参保管理 */
        {
          path: '/socialAccfund/insuranceManage',
          component: () => import('./views/socialAccfund/insuranceManage')
        },
        /* 社保公积金-增员 */
        {
          path: '/socialAccfund/increase',
          component: () => import('./views/socialAccfund/increase'),
          meta: {
            parentPath: '/socialAccfund/insuranceManage'
          }
        },
        /* 社保公积金-减员 */
        {
          path: '/socialAccfund/decrease',
          component: () => import('./views/socialAccfund/decrease'),
          meta: {
            parentPath: '/socialAccfund/insuranceManage'
          }
        },
        /* 社保公积金-调基 */
        {
          path: '/socialAccfund/tuneBase',
          component: () => import('./views/socialAccfund/tuneBase'),
          meta: {
            parentPath: '/socialAccfund/insuranceManage'
          }
        },
        /* 薪酬管理-累计专项列表 */
        {
          path: '/accumSpecial/index',
          component: () => import('./views/salary/accumSpecial/index')
        },
        /* 薪酬管理-薪酬规则查询 */
        {
          path: '/salary/ruleSearch',
          component: () => import('./views/salary/ruleSearch')
        },
        // 薪酬管理-薪酬发放列表
        {
          path: '/salaryPayment/index',
          component: () => import('./views/salary/salaryPayment/index')
        },
        // 薪酬管理-薪酬发放列表
        {
          path: '/salaryAccounting/index',
          component: () => import('./views/salary/salaryAccounting/index')
        },
        // 薪酬管理-个税明细列表
        {
          path: '/salary/taxDetail',
          component: () => import('./views/salary/taxDetail')
        },
        // 薪酬管理-个税计算器
        {
          path: '/salary/taxCalculator/index',
          component: () => import('./views/salary/taxCalculator/index')
        },
        // 账单管理-账单管理列表页
        {
          path: '/billManage/index',
          component: () => import('./views/billManage/index')
        },
        // 账单管理-维护员工薪资卡
        {
          path: '/billManage/salaryCardMainten',
          component: () => import('./views/billManage/salaryCardMainten')
        },
        // 入离职管理-入离职添加
        {
          path: '/employee/addEntry',
          component: () => import('./views/employee/entryExitManage/entry/addEntry'),
          meta: {
            parentPath: '/employee/entryManage/index'
          }
        },
        // 入离职管理-离职管理
        {
          path: '/employee/exitAdmin',
          component: () => import('./views/employee/entryExitManage/exit/exitAdmin')
        },
        // 账单管理-账单管理详情页
        {
          path: '/billManage/billView',
          component: () => import('./views/billManage/billView'),
          meta: {
            parentPath: '/billManage/index'
          }
        },
        // 文件签署-文件管理
        {
          path: '/fileSign/index',
          component: () => import('./views/fileSign/index')
        },
        // 文件签署-签署管理
        {
          path: '/fileSign/signAdmin',
          component: () => import('./views/fileSign/signAdmin')
        },
        // 文件签署-发起签署
        {
          path: '/fileSign/startSign',
          component: () => import('./views/employee/fileSign/startSign'),
          meta: {
            parentPath: '/fileSign/signAdmin'
          }
        },
        // 发票管理-发票信息
        {
          path: '/invoice/info',
          component: () => import('./views/invoice/info')
        },
        /* 开票列表 */
        {
          path: '/invoice/list',
          component: () => import('./views/invoice/list')
        },
        /* 政策信息-理赔指引 */
        {
          path: '/policylibrary/claimsGuide',
          component: () => import('./views/policylibrary/claimsGuide')
        },
        // 政策查询-政策信息库
        {
          path: '/policylibrary/policyInfo',
          component: () => import('./views/policyQuery/policyInfoWarehouse')
        }
      ]
    },
    {
      path: '/home2',
      component: () => import('./components/Home2'),
      // redirect: '/welcome',
      children: [
      // 这个链接跳到对应的组件
      // 找回密码
        {
          path: '/retrievePsd',
          component: () => import('./views/retrievePsd/index'),
          meta: {
            title: '重置密码',
            // 缓存首页
            keepAlive: true
          }
        },
        {
          path: '/accountSettings',
          component: () => import('./views/accountSettings/index')
        }
      ]
    }
  ]
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  // const targetPath = router.history.pending.fullPath
  console.log('isChunkLoadFailed==' + isChunkLoadFailed)
  if (isChunkLoadFailed) {
    // 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
    // router.replace(targetPath)
    location.reload()
  }
})

router.onReady(vm => {
  try {
    let LoadingChunkPath = window.sessionStorage.getItem('LoadingChunkPath')

    const path = vm.path
    if (LoadingChunkPath) {
      if (path !== LoadingChunkPath && path !== '/') {
        window.sessionStorage.setItem('LoadingChunkPath', vm.path)
        router.replace(vm.path)
      } else {
        router.replace(LoadingChunkPath)
      }
    }
  } catch (e) {
    console.log(e)
  }
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由  /^\-[1-9][0-9]*$/
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // var patt = /Verification[0-9]{1}/
  var reg1 = new RegExp('/verification[0-9]{1}')
  // console.log(reg1.test(to.path))
  // console.log(reg2.test(to.path))
  // console.log(to.path)
  if (to.path === '/login' || to.path === '/About' || reg1.test(to.path)) return next()
  const tokenStr = store.state.token
  // console.log(tokenStr)
  // if (!tokenStr) return next('/login')
  next()
})

export default router
