const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { DefinePlugin, DllReferencePlugin } = require('webpack')

module.exports = function developmentConfig ({ root, dstPath }) {
  return {
    entry: './index.js',
    output: {
      filename: 'application.js'
    },
    devtool: 'eval',
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap'
        ]
      }, {
        test: /\.(ttf|svg|eot|otf|woff|woff2)$/,
        loader: 'url-loader'
      }]
    },
    plugins: [
      new CleanWebpackPlugin(dstPath, { root, exclude: ['vendor'] }),
      new DefinePlugin({
        'process.env': { 'NODE_ENV': JSON.stringify('development') }
      }),
      new DllReferencePlugin({
        context: dstPath,
        manifest: require(path.join(dstPath, 'vendor/utils-manifest.json'))
      }),
      new DllReferencePlugin({
        context: dstPath,
        manifest: require(path.join(dstPath, 'vendor/chart-manifest.json'))
      }),
      new DllReferencePlugin({
        context: dstPath,
        manifest: require(path.join(dstPath, 'vendor/vendor-manifest.json'))
      })
    ]
  }
}
