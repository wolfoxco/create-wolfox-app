const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    port: 4000,
    historyApiFallback: true,
    proxy: {
      '/backend': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/backend' : '' }
      }
    }
  }
})
