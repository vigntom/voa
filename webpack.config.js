const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const { resolve } = require('path')

const pathToAssets = resolve(__dirname, 'public', 'assets')

module.exports = {
  entry: {
    application: resolve(__dirname, 'app', 'assets', 'index.js')
  },
  output: {
    filename: '[name].js',
    path: pathToAssets
  },
  devtool: 'eval',
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }, {
      test: /\.(scss)$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin([pathToAssets]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ]
}
