const mongoose = require('mongoose')
const config = require('../config')
const log = require('./logger')

const nodeEnv = process.env.NODE_ENV

function createDbConnection () {
  mongoose.Promise = Promise

  mongoose.connect(config.db.uri, {
    useMongoClient: true
  })

  mongoose.connection.on('connected', () => {
    log.info(`Mongoose (${nodeEnv}) connection: opened`)
  })

  mongoose.connection.on('disconnected', () => {
    log.info(`Mongoose (${nodeEnv}) connection: disconnected`)
  })

  mongoose.connection.on('error', (err) => {
    log.error(`Mongoose (${nodeEnv}) connection error: ${err.message}`)
  })

  return mongoose
}

module.exports = createDbConnection()
