import test from 'ava'
import mongoose from 'mongoose'
import MongoServer from 'mongodb-memory-server'
import User from '../../app/models/user'
import users from '../fixtures/users'

test.before('Start MongoDB Server', t => {
  const mongod = new MongoServer()

  return mongod.getConnectionString()
    .then(uri => {
      mongoose.Promise = Promise
      return mongoose.connect(uri)
    })
    .then(() => {
      return Object.values(users).map(
        user => Object.assign({}, user, { passwordConfirmation: user.password })
      )
    })
    .then(data => {
      return User.insertMany(data)
    })
})
