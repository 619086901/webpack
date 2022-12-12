const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  //development开发模式
  //production生产模式,压缩成一行
  mode: 'development',

  //追踪到错误和警告在源代码中的原始位置
  //https://www.webpackjs.com/configuration/devtool/
  //生产环境要删掉
  devtool: 'inline-source-map',

  //devServer
  devServer: {
    contentBase: './dist',
    host: 'localhost',
    port: 8080,
    //开启模块热替换，局部替换文件而不用刷新整个页面
    //要完全启用 HMR
    //需要 webpack.HotModuleReplacementPlugin。
    //如果使用--hot选项启动webpack-dev-server，该插件将自动添加，
    hot: true,
    // proxy: {
    //   '/api': {
    //     target: '代理的目标地址',
    //     //改变请求头源
    //     changeOrigin: true,
    //     //去掉api目录
    //     pathRewrite: { '^/api': '' }
    //   }
    // }
  }
})
