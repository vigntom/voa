const path = require('path')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { DllPlugin, DefinePlugin } = require('webpack')

module.exports = function vendorConfig ({ root, env, dstPath }) {
  const config = {
    entry: {
      'vendor': ['ramda', 'bootstrap']
    },
    output: {
      path: path.join(dstPath, 'vendor'),
      filename: '[name].dll.js',
      library: '[name]_[hash]'
    },
    devtool: 'none',
    plugins: [
      new CleanWebpackPlugin(path.join(dstPath, 'vendor'), { root }),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      new DllPlugin({
        context: dstPath,
        name: '[name]_[hash]',
        path: path.join(dstPath, 'vendor', '[name]-manifest.json')
      })
    ]
  }

  if (env === 'production') {
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

    return merge(config, {
      plugins: [
        new UglifyJsPlugin({ parallel: true })
      ]
    })
  }

  return config
}
