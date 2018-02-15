#!/usr/bin/env node
require('dotenv').config({ silent: true })

const R = require('ramda')
const faker = require('faker')
const User = require('../../app/models/user')
const log = require('../../lib/logger')
const createDbConnection = require('../../lib/db')

const mongoose = createDbConnection(log)

const fakeUser = () => User.create({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: 'password',
  passwordConfirmation: 'password',
  activated: true,
  activated_at: Date.now()
})

const createAdmin = () => User.create({
  username: 'admin',
  email: 'admin@example.com',
  password: 'qwe321',
  passwordConfirmation: 'qwe321',
  admin: true,
  activated: true,
  activated_at: Date.now()
})

const createUser = () => User.create({
  username: 'foobar',
  email: 'foobar@example.com',
  password: 'qwe321',
  passwordConfirmation: 'qwe321',
  admin: false,
  activated: true,
  activated_at: Date.now()
})

const createUsers = () => R.times(fakeUser, 100)

User.remove({})
  .then(() => createAdmin())
  .then(() => createUser())
  .then(() => Promise.all(createUsers()))
  .then(() => mongoose.connection.close())
