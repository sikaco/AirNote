const {resolve} = require('path')
const webpack = require('webpack')
const Merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')
const autoprefixer = require('autoprefixer')

const commonCfg = {
  entry: {
    vendor: [
      'lodash',
      'mobx',
      'mobx-react',
      'mobx-react-devtools',
      'moment',
      'react',
      'react-dom',
      'react-hot-loader'
    ]
  },
  context: resolve(__dirname, 'src'),
  output: {
    path: resolve(__dirname, 'dist'),
    publicPath: '/'	// 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
}

const devCfg = {
  entry: {
    main: [
      'react-hot-loader/patch',	// 开启 React 代码的模块热替换(HMR)
      'webpack-dev-server/client?http://localhost:8080',	// 为 webpack-dev-server 的环境打包代码, 然后连接到指定服务器域名与端口
      'webpack/hot/only-dev-server',	// 为热替换(HMR)打包好代码	// only- 意味着只有成功更新运行代码才会执行热替换(HMR)

      './index.tsx'	// 我们 app 的入口文件
    ],
  },
  output: {
    filename: '[name].js',	// 输出的打包文件
    devtoolModuleFilenameTemplate: 'file://[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: 'file://[absolute-resource-path]?[hash]',
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,	// 开启服务器的模块热替换(HMR)
    contentBase: resolve(__dirname, 'dist'),	// 输出文件的路径
    publicPath: '/',	// 和上文 output 的“publicPath”值保持一致
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'happypack/loader?id=ts',
        exclude: /node_modules/
      },
      {
        test: /\.(css)$/,
        loader: 'happypack/loader?id=css'
      },
      {
        test: /\.(less)$/,
        loader: 'happypack/loader?id=less'
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'ts',
      loaders: [{
        loader: 'babel-loader'
      }, {
        path: 'ts-loader',
        query: {happyPackMode: true}
      }]
    }),
    new HappyPack({
      id: 'css',
      loaders: [{
        loader: 'style-loader'
      }, {
        path: 'css-loader',
        query: {sourceMap: true}
      }]
    }),
    new HappyPack({
      id: 'less',
      loaders: [{
        loader: 'style-loader'
      }, {
        path: 'css-loader',
        query: {sourceMap: true}
      }, {
        path: 'less-loader',
        query: {sourceMap: true}
      }]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: [
        'vendor', // 指定公共 bundle 的名字。
        'manifest'
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'demo',
      template: resolve(__dirname, 'dist') + '/index.html' // 模板路径
    }),
    new webpack.HotModuleReplacementPlugin(),	// 开启全局的模块热替换(HMR)
    new webpack.NamedModulesPlugin(),	// 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
  ],
}

const prodCfg = {
  entry: {
    main: [
      './index.tsx'	// 我们 app 的入口文件
    ]
  },
  output: {
    filename: '[name].[chunkHash:6].js',	// 输出的打包文件
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'happypack/loader?id=ts',
        exclude: /node_modules/
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', {
            path: 'postcss-loader',
            query: {
              plugins: function () {
                return [autoprefixer('last 2 versions', 'ie 10')]
              }
            }
          },'less-loader']
        })
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'ts',
      loaders: [{
        loader: 'babel-loader'
      }, {
        path: 'ts-loader',
        query: {happyPackMode: true}
      }]
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ]
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: [
        'vendor', // 指定公共 bundle 的名字。
        'manifest'
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'demo',
      template: resolve(__dirname, 'dist') + '/index.html' // 模板路径
    }),
    new ExtractTextPlugin('[name].css')
  ],
}

module.exports = function (env) {
  return env === 'prod' ? Merge(commonCfg, prodCfg) : Merge(commonCfg, devCfg)
}