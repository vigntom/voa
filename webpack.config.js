const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { DefinePlugin, ProvidePlugin, DllReferencePlugin } = webpack

// process.traceDeprecation = true

function basicConfig ({ env, srcPath, dstPath }) {
  return {
    context: srcPath,
    output: {
      path: dstPath
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    },
    plugins: [
      new DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(env)
        }
      }),
      new CleanWebpackPlugin([dstPath], { exclude: ['vendor'] }),
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jquery': 'jquery',
        Popper: ['popper.js', 'default']
      }),
      new DllReferencePlugin({
        context: path.join(dstPath),
        manifest: require(path.join(dstPath, 'vendor', 'utils-manifest.json'))
      }),
      new DllReferencePlugin({
        context: path.join(dstPath),
        manifest: require(path.join(dstPath, 'vendor', 'bootstrap-manifest.json'))
      }),
      new DllReferencePlugin({
        context: path.join(dstPath),
        manifest: require(path.join(dstPath, 'vendor', 'react-manifest.json'))
      })
    ]
  }
}

module.exports = function buildConfig (env) {
  const srcPath = path.resolve(__dirname, 'app', 'assets')
  const dstPath = path.resolve(__dirname, 'public', 'assets')

  function findOptions (env) {
    const options = { srcPath, dstPath }

    if (env && env.production) {
      return Object.assign(options, { env: 'production' })
    }

    return Object.assign(options, { env: 'development' })
  }

  function execVendorConfig (options) {
    const config = require('./config/webpack/vendor')
    return config(options)
  }

  const options = findOptions(env)
  if (env && env.vendor) { return execVendorConfig(options) }

  const config = require(`./config/webpack/${options.env}`)
  return merge(basicConfig(options), config(options))
}
