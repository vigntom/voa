import test from 'ava'
import mongoose from 'mongoose'
import MongoServer from 'mongodb-memory-server'

test.before('Start MongoDB Server', t => {
  const mongod = new MongoServer()

  return mongod.getConnectionString()
    .then(uri => {
      mongoose.Promise = Promise
      return mongoose.connect(uri, { useMongoClient: true })
    })
})
