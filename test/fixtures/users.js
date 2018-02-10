const faker = require('faker')
const R = require('ramda')

const namedUsers = {
  admin: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password',
    admin: true
  },

  bob: {
    username: 'bob',
    email: 'bob@yahoo.com',
    password: 'password'
  },

  sara: {
    username: 'sara',
    email: 'sara@example.org',
    password: 'password'
  },

  den: {
    username: 'den',
    email: 'den@example.us',
    password: 'password'
  }
}

const createFakeUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: 'password'
})

function combineUsers ([id, acc], user) {
  const key = `user-${id}`
  const result = R.merge(acc, { [key]: user })
  return [id + 1, result]
}

const fakeUsers = R.compose(
  R.last,
  R.reduce(combineUsers, [0, {}]),
  R.times(createFakeUser)
)

module.exports = R.merge(namedUsers, fakeUsers(2))
