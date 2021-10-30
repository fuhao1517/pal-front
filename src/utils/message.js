import { MessageBox } from 'element-ui'
let count = 0
function common (type, msg, title, callback) {
  if (count == 0) {
    MessageBox.confirm(msg, title || '提示', {
      customClass: 'spl-confirm',
      showConfirmButton: false,
      showCancelButton: false,
      type: type,
      closeOnClickModal: false,
      dangerouslyUseHTMLString: true
    }).catch(() => {
      count = 0
      window.clearTimeout(timeId)
    })
    count = 5000
    var timeId = setTimeout(function () {
      count = 0
      MessageBox.close()
      if (callback) {
        callback()
      }
    }, 5000)
  } else {
    setTimeout(function () {
      count = 0
      common(msg, title, callback)
    }, 5000)
  }
}
export default {
  install (Vue) {
    Vue.prototype.$message = {// 全局方法
      success: function (msg, title, callback) { // 获取url中的参数
        common('success', msg, title, callback)
      },
      error: function (msg, title, callback) { // 获取url中的参数
        common('error', msg, title, callback)
      },
      warning: function (msg, title, callback) { // 获取url中的参数
        common('warning', msg, title, callback)
      }
    }
  }
}
