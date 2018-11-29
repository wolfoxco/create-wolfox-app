// eslint-env node, amd
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: './src/front/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), 'dist')
  },
  plugins: [
    new CleanWebpackPlugin([ '../dist' ], { allowExternal: true }),
    new HTMLWebpackPlugin({
      title: 'BookBuilder',
      meta: { viewport: 'width=device-width, initial-scale=1' }
    })
  ],
  module: {
    rules: [{
      test: /\.(png|svg|jpg|gif)$/,
      use: [ 'file-loader' ]
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: { presets: [ '@babel/preset-env' ] }
      }
    }]
  }
}
