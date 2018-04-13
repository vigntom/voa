const faker = require('faker')
const R = require('ramda')

const namedUsers = {
  admin: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password',
    admin: true,
    activated: true,
    activated_at: Date.now()
  },

  service: {
    username: 'service',
    email: 'service@example.com',
    password: '*',
    admin: false,
    activated: true,
    activated_at: Date.now()
  },

  bob: {
    username: 'bob',
    email: 'bob@yahoo.com',
    password: 'password',
    activated: true,
    activated_at: Date.now()
  },

  sara: {
    username: 'sara',
    email: 'sara@example.org',
    password: 'password',
    activated: true,
    activated_at: Date.now()
  },

  den: {
    username: 'den',
    email: 'den@example.us',
    password: 'password',
    activated: true,
    activated_at: Date.now()
  }
}

const createFakeUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: 'password',
  activated: true,
  activated_at: Date.now()
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
