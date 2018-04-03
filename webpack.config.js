const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { DefinePlugin, ProvidePlugin } = webpack

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
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jquery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
}

module.exports = function buildConfig (env) {
  const srcPath = path.resolve(__dirname, 'app', 'assets')
  const dstPath = path.resolve(__dirname, 'public', 'assets')

  function findOptions (env) {
    const options = { root: __dirname, srcPath, dstPath }

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
