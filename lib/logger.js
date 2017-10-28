const bunyan = require('bunyan')
const debugStream = require('bunyan-debug-stream')
const fs = require('fs')
const path = require('path')

function createLogger (config) {
  const { name, env } = config
  const options = config[env]

  if (!fs.existsSync(config.log_dir)) {
    fs.mkdirSync(config.log_dir)
  }

  if (env === 'production') {
    return bunyan.createLogger({
      name,
      streams: [{
        path: path.join(config.log_dir, `${env}.log`),
        period: options.log_period,
        count: options.log_count,
        level: options.log_level
      }]
    })
  }

  if (env === 'test') {
    return bunyan.createLogger({ name, level: options.log_level })
  }

  return bunyan.createLogger({
    name,
    streams: [{
      level: options.log_level,
      path: path.join(config.log_dir, `${env}.log`)
    }, {
      level: options.log_level,
      type: 'raw',
      stream: debugStream({
        basepath: config.root,
        forceColor: true
      })
    }],
    serializers: debugStream.serializers
  })
}

module.exports = createLogger
