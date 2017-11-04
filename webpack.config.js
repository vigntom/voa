const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { ProvidePlugin } = webpack

const srcPath = path.resolve(__dirname, 'app', 'assets')
const dstPath = path.resolve(__dirname, 'public', 'assets')

const config = {
  context: srcPath,
  output: {
    path: dstPath
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new CleanWebpackPlugin([dstPath], { exclude: ['vendor'] }),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ]
}

module.exports = function buildConfig (env) {
  function envOrDefaultConfig (env) {
    const concreteEnvs = ['production', 'vendor']
    const envConfig = env =>
      require(path.resolve('config', 'webpack', env))

    if (concreteEnvs.includes(env)) {
      return envConfig(env)(dstPath)
    }

    return envConfig('development')(dstPath)
  }

  return merge(config, envOrDefaultConfig(env))
}
