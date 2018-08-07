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

const password = process.env.DEMOPASS || '123qwe'
const db = createDbConnection()
const fakeAccounts = 30
const pollsPerUser = 3
const maxGazers = 100
const fakeChoicesLimits = { min: 2, max: 5 }
const fakeVotesLimits = { min: 0, max: fakeAccounts / 3 }

const admin = {
  username: 'admin',
  email: 'admin@example.com',
  password,
  passwordConfirmation: password,
  admin: true,
  protected: true,
  activated: true,
  activatedAt: Date.now()
}

const tester1 = {
  username: 'foo',
  email: 'foo@example.com',
  emailProtected: false,
  password,
  passwordConfirmation: password,
  admin: false,
  activated: true,
  activatedAt: Date.now()
}

const tester2 = {
  username: 'bar',
  email: 'bar@example.com',
  emailProtected: true,
  password,
  passwordConfirmation: password,
  admin: false,
  activated: true,
  activatedAt: Date.now()
}

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
  const createAdmin = () => User.create(admin)
  const createTesterUser1 = () => User.create(tester1)
  const createTesterUser2 = () => User.create(tester2)

  return {
    generate: () => Promise.all([
      createAdmin(),
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
      password,
      passwordConfirmation: password,
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

  function generateTesterPools (users, tester) {
    const testerUser = R.find(R.propEq('username', tester))(users)

    return Promise.all(
      R.times(() => fakePoll(testerUser), pollsPerUser)
    )
  }

  return {
    generate: (users) => Promise.all(genPolls(users))
      .then(() => generateTesterPools(users, tester1.username))
      .then(() => generateTesterPools(users, tester2.username))
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
