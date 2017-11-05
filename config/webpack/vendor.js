const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const { DllPlugin, DefinePlugin } = require('webpack')

module.exports = function vendorConfig (dstPath) {
  return {
    entry: {
      'utils': ['ramda'],
      'bootstrap': ['bootstrap'],
      'react': ['react', 'react-dom']
    },
    output: {
      filename: 'vendor/[name].bundle.js',
      library: '[name]_[hash]'
    },
    devtool: 'source-map',
    plugins: [
      new CleanWebpackPlugin([path.join(dstPath, 'vendor')]),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new DllPlugin({
        path: path.join(dstPath, 'vendor', '[name]-manifest.json'),
        name: '[name]_[hash]'
      }),
      new ManifestPlugin({ fileName: 'vendor/manifest.json' })
    ]
  }
}
