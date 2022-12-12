const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  //production生产环境
  mode: 'production',

  //https://www.webpackjs.com/configuration/devtool/
  devtool: 'source-map'
})
