const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const webpack = require('webpack')
const path = require('path')
const { DefinePlugin, DllReferencePlugin } = webpack

module.exports = function productionConfig (dstPath) {
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
            'postcss-loader',
            'sass-loader'
          ]
        })
      }]
    },
    plugins: [
      new DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
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
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: require(path.join(dstPath, 'vendor', 'utils-manifest.json'))
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: require(path.join(dstPath, 'vendor', 'bootstrap-manifest.json'))
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: require(path.join(dstPath, 'vendor', 'react-manifest.json'))
      }),
      new DllReferencePlugin({
        context: '.',
        manifest: require(path.join(dstPath, 'vendor', 'hyperscript-manifest.json'))
      })
    ]
  }
}
