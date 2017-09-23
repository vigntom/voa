const bunyan = require('bunyan')
const fs = require('fs')
const path = require('path')

const name = 'voa'
const nodeEnv = process.env.NODE_ENV || 'development'
const logPeriod = process.env.LOG_PERIOD || '1d'
const logCount = process.env.LOG_COUNT || 1
const logLevel = process.env.LOG_LEVEL || 'info'
const logDir = './log'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

function createLogger (env) {
  if (env === 'production') {
    return bunyan.createLogger({
      name,
      streams: [{
        path: path.join(logDir, `${nodeEnv}.log`),
        period: logPeriod,
        count: logCount,
        level: logLevel
      }, {
        level: 'info',
        stream: process.stdout
      }]
    })
  }

  if (env === 'test') {
    return bunyan.createLogger({ name })
  }

  return bunyan.createLogger({
    name,
    streams: [{
      level: logLevel,
      path: path.join(logDir, `${nodeEnv}.log`)
    }, {
      level: 'info',
      stream: process.stdout
    }, {
      level: 'error',
      stream: process.stderr
    }]
  })
}

module.exports = createLogger(nodeEnv)
