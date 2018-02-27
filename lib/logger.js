const bunyan = require('bunyan')
const debugStream = require('bunyan-debug-stream')
const fs = require('fs')
const path = require('path')
const config = require('../config')

const env = process.env.NODE_ENV
const logDir = path.resolve(__dirname, '..', 'log')
const name = 'voa'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const loggers = {
  production () {
    return bunyan.createLogger({
      name,
      level: config.logger.console
    })
  },

  development () {
    const basepath = path.resolve(__dirname, '..')

    return bunyan.createLogger({
      name,
      streams: [{
        level: config.logger.file,
        path: path.join(logDir, 'development.log'),
        period: '1d',
        count: '3'
      }, {
        level: config.logger.console,
        type: 'raw',
        stream: debugStream({ basepath, forceColor: true })
      }],
      serializers: debugStream.serializers
    })
  },

  test () {
    const basepath = path.resolve(__dirname, '..')

    return bunyan.createLogger({
      name,
      level: config.logger.file,
      streams: [{
        level: 'debug',
        path: path.join(logDir, 'test.log'),
        period: '1d',
        count: '3'
      }, {
        level: config.logger.console,
        type: 'raw',
        stream: debugStream({ basepath, forceColor: true })
      }],
      serializers: debugStream.serializers
    })
  }
}

function createLogger (env) {
  if (env && loggers[env]) { return loggers[env]() }
  return loggers.development()
}

module.exports = createLogger(env)
