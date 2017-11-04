const { DefinePlugin } = require('webpack')

module.exports = function developmentConfig () {
  return {
    entry: ['./index.js', 'bootstrap'],
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
          'sass-loader'
        ]
      }]
    },
    plugins: [
      new DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ]
  }
}
