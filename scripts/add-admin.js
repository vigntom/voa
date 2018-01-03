#!/usr/bin/env node

require('dotenv').config({ silent: true })
const path = require('path')
const config = require('../config/app.json')
const createDbConnection = require('../lib/db')
const createLogger = require('../lib/logger')
const User = require('../app/models/user')

const log = createLogger(Object.assign({}, config, {
  log_dir: path.resolve(__dirname, '..', 'log'),
  env: 'development'
}))

createDbConnection(log)

User.collection.drop()

User.create({
  username: 'admin',
  email: 'admin@example.com',
  password: 'qaz123',
  passwordConfirmation: 'qaz123'
}, (err, user) => {
  if (err) { return log.warn(err) }
  log.info(`User ${user.username} saved with id ${user._id}`)
})
