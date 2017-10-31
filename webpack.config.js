const { resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const pathToAssets = resolve(__dirname, 'public', 'assets')

module.exports = {
  entry: {
    application: resolve(__dirname, 'app', 'assets', 'index.js')
  },
  output: {
    filename: '[name].js',
    path: pathToAssets
  },
  plugins: [
    new CleanWebpackPlugin([pathToAssets])
  ]
}
