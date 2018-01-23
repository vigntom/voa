const bunyan = require('bunyan')
const debugStream = require('bunyan-debug-stream')
const fs = require('fs')
const path = require('path')
const config = require('../config/environment')

const env = process.env.NODE_ENV
const options = config[env].log
const logDir = path.resolve(__dirname, '..', 'log')
const name = 'voa'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const loggers = {
  production () {
    return bunyan.createLogger({
      name: config.name,
      level: options.level
    })
  },

  development () {
    const basepath = path.resolve(__dirname, '..')

    return bunyan.createLogger({
      name,
      streams: [{
        level: options.level,
        path: path.join(logDir, 'development.log'),
        period: '1d',
        count: '3'
      }, {
        level: options.level,
        type: 'raw',
        stream: debugStream({ basepath, forceColor: true })
      }],
      serializers: debugStream.serializers
    })
  },

  test () {
    return bunyan.createLogger({ name, level: options.level })
  }
}

function createLogger (env) {
  if (env && loggers[env]) { return loggers[env]() }
  return loggers.development()
}

module.exports = createLogger(env)
