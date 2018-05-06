import test from 'ava'
import mongoose from 'mongoose'
import MongoServer from 'mongodb-memory-server'
import User from '../../app/models/user'
import users from '../fixtures/users'
import R from 'ramda'
// import createConnection from '../../lib/db'

// const connection = createConnection()

const fixture = {
  user: obj => R.merge(obj, { passwordConfirmation: obj.password })
}

test.before('Start MongoDB Server', t => {
  const mongod = new MongoServer({
    binary: { version: '3.6.4' }
  })
  return mongod.getConnectionString()
    .then(uri => {
      mongoose.Promise = Promise
      return mongoose.connect(uri)
    })
    .then(() => {
      return R.map(fixture.user, R.values(users))
    })
    .then(data => {
      return User.insertMany(data)
    })

  // const data = R.map(fixture.user, R.values(users))
  // return User.insertMany(data)
})

module.exports = { fixture }
