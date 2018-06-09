#!/usr/bin/env node
require('dotenv').config({ silent: true })

const R = require('ramda')
const faker = require('faker')
const mongoose = require('mongoose')
const User = require('../../app/models/user')
const Poll = require('../../app/models/poll')
const Option = require('../../app/models/option')
const Vote = require('../../app/models/vote')
const createDbConnection = require('../../lib/db')

const db = createDbConnection()
const fakeAccounts = 30
const pollsPerUser = 3
const maxGazers = 100
const fakeChoicesLimits = { min: 2, max: 5 }
const fakeVotesLimits = { min: 0, max: fakeAccounts / 3 }

function cleanDB () {
  console.time('Clean DB')

  return Promise.all([
    User.remove(),
    Poll.remove(),
    Option.remove(),
    Vote.remove()
  ]).catch(() => {
    console.log('Failed to clean db')
  }).then(() => {
    console.timeEnd('Clean DB')
  })
}

const accounts = (function () {
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

  const createTesterUser1 = () => User.create({
    username: 'foobar',
    email: 'foobar@example.com',
    emailProtected: false,
    password: 'qwe321',
    passwordConfirmation: 'qwe321',
    admin: false,
    activated: true,
    activatedAt: Date.now()
  })

  const createTesterUser2 = () => User.create({
    username: 'barfoo',
    email: 'barfoo@example.com',
    emailProtected: true,
    password: 'qwe321',
    passwordConfirmation: 'qwe321',
    admin: false,
    activated: true,
    activatedAt: Date.now()
  })

  return {
    generate: () => Promise.all([
      createAdmin(),
      createServiceUser(),
      createTesterUser1(),
      createTesterUser2()
    ])
  }
})()

const users = (function () {
  const genUsers = () => R.times(fakeUser, fakeAccounts)

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
    }).catch(err => {
      if (err.name === 'ValidationError') {
        return fakeUser()
      }

      console.error(err)
      return process.exit(1)
    })
  }

  return {
    generate () { return Promise.all(genUsers()).then(() => User.find()) }
  }
})()

const polls = (function () {
  const genPolls = (users) => R.times(
    () => createPoolPerUser(users),
    users.length * pollsPerUser
  )

  function fakePoll (user) {
    const currentDate = faker.date.recent()
    const manyYearsAgo = faker.date.past(5, currentDate)
    const createdAt = faker.date.between(manyYearsAgo, currentDate)

    return Poll.create({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      author: user._id,
      stargazers: faker.random.number(maxGazers),
      createdAt
    }).catch(err => {
      if (err.name === 'ValidationError') {
        return fakePoll(user)
      }

      console.error(err)
      return process.exit(1)
    })
  }

  function createPoolPerUser (users) {
    const userIdx = faker.random.number(users.length - 1)
    if (users[userIdx].protected) { return null }
    return fakePoll(users[userIdx])
  }

  function generateFoobarPools (users) {
    const foobar = R.find(R.propEq('username', 'foobar'))(users)
    return Promise.all(
      R.times(() => fakePoll(foobar), pollsPerUser)
    )
  }

  return {
    generate: (users) => Promise.all(genPolls(users))
      .then(() => generateFoobarPools(users))
      .then(() => Poll.find())
  }
})()

const options = (function () {
  const count = () => faker.random.number(fakeChoicesLimits)
  const genOptionsPerPoll = poll => R.times(() => fakeOption(poll), count())
  const genOptions = R.map(genOptionsPerPoll)

  function fakeOption (poll) {
    return Option.create({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      poll: poll._id
    }).catch(err => {
      if (err.name === 'ValidationError') {
        return fakeOption(poll)
      }

      console.error(err)
      return process.exit(1)
    })
  }

  return {
    generate: polls => Promise.all(
      R.flatten(genOptions(polls))
    ).then(() => Option.find())
  }
})()

const votes = (function () {
  const count = () => faker.random.number(fakeVotesLimits)
  const genVotesPerOption = poll => R.times(() => fakeVote(poll), count())
  const genVotes = R.map(genVotesPerOption)

  function fakeVote (option) {
    return Vote.create({
      poll: option.poll,
      option: option._id,
      voter: mongoose.Types.ObjectId(),
      type: 'User'
    }).catch(err => {
      console.log('votes error: ', err)
    })
  }

  return {
    generate: options => Promise.all(
      R.flatten(genVotes(options))
    ).then(() => Vote.find())
  }
})()

function start () {
  console.log('Starting ...')
  console.time('Total: ')
}

Promise.resolve(start())
  .then(cleanDB)
  .then(accounts.generate)
  .then(users.generate)
  .then(polls.generate)
  .then(options.generate)
  .then(votes.generate)
  .catch(err => { console.error('** ERROR: ', err) })
  .then(() => db.connection.close())
  .then(() => {
    console.timeEnd('Total: ')
  })
