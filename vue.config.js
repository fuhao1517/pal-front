const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')// 引入path模块
function resolve (dir) {
  return path.join(__dirname, dir)// path.join(__dirname)设置绝对路径
}
module.exports = {
  configureWebpack: { // webpack 配置
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `[name].[hash].js`,
      chunkFilename: `[name].[hash].js`
    },
    plugins: [
      new MiniCssExtractPlugin({
        // 修改打包后css文件名
        filename: `css/[name].[hash].css`,
        chunkFilename: `css/[name].[hash].css`,
        ignoreOrder: true
      })
    ],
    performance: {
	    hints: "warning", // 枚举
	    hints: "error", // 性能提示中抛出错误
	    hints: false, // 关闭性能提示
	    maxAssetSize: 200000, // 整数类型（以字节为单位）
	    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
	    assetFilter: function(assetFilename) {
	      // 提供资源文件名的断言函数
	      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
	    }
	  }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/css/global.less')] // 引入全局样式变量
    }
  },
  // 修改打包后img文件名
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        options.name = `img/[name].[hash].[ext]`
        options.fallback = {
          loader: 'file-loader',
          options: {
            name: `img/[name].[hash].[ext]`
          }
        }
        return options
      })
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
    // set第一个参数：设置的别名，第二个参数：设置的路径
  },
  outputDir: 'dist', // build输出目录
  assetsDir: 'assets', // 静态资源目录（js, css, img）
  lintOnSave: false, // 是否开启eslint
  devServer: {
    open: false, // 是否自动弹出浏览器页面   （本地可以自己设置  部署到服务器  这里不要随意改动）
    host: '0.0.0.0',
    port: '8888',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://192.168.0.99:8088',
        // target: 'http://172.172.4.86:8088/pal-api',  // 如要修改成本地服务参考这个（改了不要提交到svn）
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        timeout: 10 * 60 * 1000
      }
    }
  }

}
