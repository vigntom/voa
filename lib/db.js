const mongoose = require('mongoose')

const nodeEnv = process.env.NODE_ENV

const dbURI = (function findDbURI (env) {
  if (env === 'test') {
    return process.env.MONGODB_URI_TEST
  }

  return process.env.MONGODB_URI
}(nodeEnv))

function createDbConnection (log) {
  mongoose.Promise = Promise

  mongoose.connect(dbURI, {
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

  process.on('SIGTERM', () => {
    mongoose.connection.close(() => {
      log.warn(`Mongoose (${nodeEnv}) connection: terminated`)
      process.exit(0)
    })
  })
}

module.exports = createDbConnection
