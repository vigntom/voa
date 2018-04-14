const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const { DefinePlugin, DllReferencePlugin } = require('webpack')

module.exports = function productionConfig ({ root, dstPath }) {
  return {
    entry: {
      application: './index.js'
    },
    output: {
      filename: '[name].[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: { modules: false, minimize: true }
          },
          'postcss-loader?sourceMap',
          'resolve-url-loader',
          'sass-loader?sourceMap'
          ]
        })
      }, {
        test: /\.(ttf|svg|eot|otf|woff|woff2)$/,
        loader: 'url-loader'
      }]
    },
    plugins: [
      new CleanWebpackPlugin(dstPath, { root }),
      new DefinePlugin({
        'process.env': { 'NODE_ENV': JSON.stringify('development') }
      }),
      new UglifyJsPlugin({
        sourceMap: true,
        parallel: true
      }),
      new ExtractTextPlugin({
        filename: '[name].[contenthash].css'
      }),
      new WebpackMd5Hash(),
      new ManifestPlugin(),
      new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        manifestVariable: 'webpackManifest'
      })
    ]
  }
}
