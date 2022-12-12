const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//css文件打包(分离)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//优化和压缩 CSS
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
//eslint
const ESLintPlugin = require('eslint-webpack-plugin')
//js压缩
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/js/another-module.js'
  },

  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    //清理/dish文件夹
    clean: true
  },

  //模块
  module: {
    //规则
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        //按照顺序写，先sass然后css然后loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2 //碰到import交给postcss-loader, sass-loader加载器
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      //选项browser放到package.json去了
                      //https://github.com/browserslist/browserslist#full-list
                    }
                  ]
                ]
              }
            }
          },
          // 将 Sass 编译成 CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        //webpack5 file-loader即将废弃，asset/resource资源模块可以替代
        type: 'asset/resource',
        generator: {
          filename: 'img/[hash][ext][query]'
        }
      },
      {
        //转换成ES5
        test: /\.m?js$/,
        //排除不应参与转码的库
        exclude: [/(node_modules|bower_components)/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            //避免辅助代码过大
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },

  plugins: [
    //生成新的index.html
    new HtmlWebpackPlugin({
      title: '管理输出',
      favicon: './src/img/favicon.ico' //图标
    }),
    // CSS 提取到单独的文件中
    new MiniCssExtractPlugin({
      filename: 'css/[contenthash:8].css'
    }),
    new ESLintPlugin({
      fix: true, //ESLint自动修复 默认false
      extensions: ['js', 'json'], //检查的扩展名 默认js.
      exclude: '/node_modules/' //要排除的文件或目录 默认'node_modules'
    })
  ],

  //缓存
  optimization: {
    //开发环境下启用 CSS 优化
    minimize: true,
    //优化和压缩 CSS
    //使用minimizer js自带压缩会被覆盖，需要手动添加new TerserPlugin()
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.(sa|sc|c)ss$/
      }),
      new TerserPlugin()
    ],

    splitChunks: {
      //缓存组
      //主文件不再含有来自node_modules目录的vendor代码，减少大小
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all' //两个文件都用了引入lodash，依赖重复,代码分离
        }
      }
    },
    //缓存
    runtimeChunk: 'single',
    //不论是否添加任何新的本地依赖，对于前后两次构建，vendor hash 都应该保持一致
    moduleIds: 'deterministic'
  }

  // watch: true, //开启监听
  // watchOptions: {
  //   ignored: /node_modules/, //排除
  //   aggregateTimeout: 600, //频率
  //   poll: 1000 // 每秒检查一次变动
  // }
}
