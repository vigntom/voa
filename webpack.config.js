const { resolve, join } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const webpack = require('webpack')

const pathToAssets = resolve(__dirname, 'public', 'assets')
const pathToLayoutsTemplates = resolve(__dirname, 'app', 'pack', 'view', 'layouts')
const pathToLayouts = resolve(__dirname, 'app', 'components', 'layouts')
const appLayout = join(pathToLayouts, 'application.ejs')

module.exports = {
  entry: {
    app: resolve(__dirname, 'app', 'assets', 'index.js')
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: pathToAssets
  },
  plugins: [
    new CleanWebpackPlugin([pathToAssets, appLayout]),
    new HtmlWebpackPlugin({
      title: '<%= title %>',
      content: '<%- content %>',
      filename: appLayout,
      template: join(pathToLayoutsTemplates, 'application.ejs')
    })
  ]
}
