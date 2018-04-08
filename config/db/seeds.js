#!/usr/bin/env node
require('dotenv').config({ silent: true })

const R = require('ramda')
const faker = require('faker')
const User = require('../../app/models/user')
const Poll = require('../../app/models/poll')
const db = require('../../lib/db')

const fakeAccounts = 100
const pollsPerUser = 3
const maxGazers = 1000
const fakeChoicesLimits = { min: 2, max: 9 }
const fakeVotesLimits = { min: 1, max: 1000 }

const createAdmin = () => User.create({
  username: 'admin',
  email: 'admin@example.com',
  password: 'qwe321',
  passwordConfirmation: 'qwe321',
  admin: true,
  activated: true,
  activatedAt: Date.now()
})

const createUser = () => User.create({
  username: 'foobar',
  email: 'foobar@example.com',
  password: 'qwe321',
  passwordConfirmation: 'qwe321',
  admin: false,
  activated: true,
  activatedAt: Date.now()
})

const fakeChoices = () => R.times(() => ({
  key: faker.lorem.word(),
  value: faker.random.number(fakeVotesLimits)
}), faker.random.number(fakeChoicesLimits))

const createUsers = () => R.times(fakeUser, fakeAccounts)

const createPolls = (users) => R.times(
  () => createPoolPerUser(users),
  users.length * pollsPerUser
)

function fakeUser () {
  const currentDate = faker.date.recent()
  const manyYearsAgo = faker.date.past(5, currentDate)
  const createdAt = faker.date.between(manyYearsAgo, currentDate)
  const activatedAt = new Date(
    createdAt.getTime() + faker.random.number({ min: 5 * 60000, max: 120 * 60000 })
  )

  return User.create({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'password',
    passwordConfirmation: 'password',
    activated: true,
    createdAt,
    activatedAt
  })
}

function fakePoll (user) {
  const currentDate = faker.date.recent()
  const manyYearsAgo = faker.date.past(5, currentDate)
  const createdAt = faker.date.between(manyYearsAgo, currentDate)

  return Poll.create({
    name: faker.lorem.word(),
    description: R.replace(/^./, R.toUpper)(faker.lorem.words(faker.random.number(11))),
    author: user._id,
    choices: fakeChoices(),
    stargazers: faker.random.number(maxGazers),
    createdAt
  })
}

function createPoolPerUser (users) {
  const userIdx = faker.random.number(users.length - 1)
  return fakePoll(users[userIdx])
}

Promise.all([ User.remove(), Poll.remove() ])
  .then(() => createAdmin())
  .then(() => createUser())
  .then(() => Promise.all(createUsers()))
  .then(() => User.find())
  .then(users => Promise.all(createPolls(users)))
  .then(() => db.connection.close())
