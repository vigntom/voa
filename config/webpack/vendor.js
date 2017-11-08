const path = require('path')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { DllPlugin, DefinePlugin } = require('webpack')

module.exports = function vendorConfig ({ env, dstPath }) {
  const config = {
    entry: {
      'utils': ['ramda'],
      'bootstrap': ['bootstrap'],
      'react': ['react', 'react-dom']
    },
    output: {
      path: dstPath,
      filename: 'vendor/[name].dll.js',
      library: '[name]_[hash]'
    },
    plugins: [
      new CleanWebpackPlugin([path.join(dstPath, 'vendor')]),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      new DllPlugin({
        path: path.join(dstPath, 'vendor', '[name]-manifest.json'),
        name: '[name]_[hash]'
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
