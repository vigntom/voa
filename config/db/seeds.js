#!/usr/bin/env node
require('dotenv').config({ silent: true })

const R = require('ramda')
const faker = require('faker')
const mongoose = require('mongoose')
const User = require('../../app/models/user')
const Poll = require('../../app/models/poll')
const db = require('../../lib/db')

const fakeAccounts = 100
const pollsPerUser = 3
const maxGazers = 100
const fakeChoicesLimits = { min: 2, max: 5 }
const fakeVotesLimits = { min: 1, max: 11 }

const createAdmin = () => User.create({
  username: 'admin',
  email: 'admin@example.com',
  password: 'qwe321',
  passwordConfirmation: 'qwe321',
  admin: true,
  protected: true,
  activated: true,
  activatedAt: Date.now()
})

const createServiceUser = () => User.create({
  username: 'neither',
  email: 'service@example.com',
  password: '*',
  passwordConfirmation: '*',
  admin: false,
  protected: true,
  activated: true,
  activatedAt: Date.now()
})

const createTesterUser = () => User.create({
  username: 'foobar',
  email: 'foobar@example.com',
  emailProtected: false,
  password: 'qwe321',
  passwordConfirmation: 'qwe321',
  admin: false,
  activated: true,
  activatedAt: Date.now()
})

const fakeChoices = () => R.times(i => ({
  name: faker.lorem.word() + '-' + i,
  description: faker.lorem.sentence(),
  votes: R.times(
    i => ({
      voter: mongoose.Types.ObjectId(),
      type: 'Session'
    }),
    faker.random.number(fakeVotesLimits)
  )
}), faker.random.number(fakeChoicesLimits))

const createUsers = () => R.times(fakeUser, fakeAccounts)

const createPolls = (users) => R.times(
  () => createPoolPerUser(users),
  users.length * pollsPerUser
)

const createFriendship = (users) => {
  R.times(
    () => randomFriendship(users),
    users.length * 2
  )

  return users
}

const createPending = (users) => {
  R.times(
    () => randomPending(users),
    users.length
  )

  return users
}

const createRequests = (users) => {
  R.times(
    () => randomRequest(users),
    users.length
  )

  return users
}

function fakeUser () {
  const currentDate = faker.date.recent()
  const manyYearsAgo = faker.date.past(5, currentDate)
  const createdAt = faker.date.between(manyYearsAgo, currentDate)
  const activatedAt = new Date(
    createdAt.getTime() + faker.random.number({ min: 5 * 60000, max: 120 * 60000 })
  )

  return User.create({
    username: faker.internet.userName().replace(/(\.)|(_)/, '-'),
    email: faker.internet.email(),
    password: 'password',
    passwordConfirmation: 'password',
    activated: true,
    createdAt,
    activatedAt
  }).catch(fakeUser)
}

function fakePoll (user) {
  const currentDate = faker.date.recent()
  const manyYearsAgo = faker.date.past(5, currentDate)
  const createdAt = faker.date.between(manyYearsAgo, currentDate)

  return Poll.create({
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    author: user._id,
    choices: fakeChoices(),
    stargazers: faker.random.number(maxGazers),
    createdAt
  }).catch(fakePoll)
}

function createPoolPerUser (users) {
  const userIdx = faker.random.number(users.length - 1)
  if (users[userIdx].protected) { return null }
  return fakePoll(users[userIdx])
}

function randomCommonUsers (users) {
  const u1 = faker.random.number(users.length - 1)
  const u2 = faker.random.number(users.length - 1)

  if (u1 === u2) { return randomCommonUsers(users) }
  if (users[u1].protected) { return randomCommonUsers(users) }
  if (users[u2].protected) { return randomCommonUsers(users) }
  return [ users[u1], users[u2] ]
}

function randomFriendship (users) {
  const [u1, u2] = randomCommonUsers(users)

  return User.findById(u1._id).addFriend({ _id: u2._id })
    .catch(err => {
      if (!err.errors) console.log(err.message)
    })
}

function randomPending (users) {
  const [u1, u2] = randomCommonUsers(users)

  return User.findById(u1._id).acceptFriendship({ _id: u2._id })
    .catch(err => {
      if (!err.errors) console.log(err.message)
    })
}

function randomRequest (users) {
  const [u1, u2] = randomCommonUsers(users)

  return User.findById(u1._id).requestFriendship({ _id: u2._id })
    .catch(err => {
      if (!err.errors) console.log(err.message)
    })
}

Promise.all([ User.remove(), Poll.remove() ])
  .then(() => createAdmin())
  .then(() => createServiceUser())
  .then(() => createTesterUser())
  .then(() => Promise.all(createUsers()))
  .then(() => User.find())
  .then(users => Promise.all(createRequests(users)))
  .then(users => Promise.all(createPending(users)))
  .then(users => Promise.all(createFriendship(users)))
  .then(users => Promise.all(createPolls(users)))
  .catch(err => { console.error('** ERROR: ', err.message) })
  .then(() => db.connection.close())
