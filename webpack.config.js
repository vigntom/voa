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
  module: {
    rules: [{
      test: /\.(scss)$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => ([
              require('precss'),
              require('autoprefixer')
            ])
          }
        },
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
