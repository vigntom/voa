import test from 'ava'
import db from '../helpers/database'
import User from '../../app/models/user'

db.setup(User)

const login = {
  username: 'foo',
  email: 'foo@example.com',
  password: 'abc123',
  passwordConfirmation: 'abc123'
}

test.cb('should be valid', t => {
  const user = new User(login)

  user.validate(v => {
    t.ifError(v)
    t.end()
  })
})

test.cb('username should be present', t => {
  const user = new User(login)

  user.username = '   '

  user.validate(v => {
    t.truthy(v.errors.username)
    t.end()
  })
})

test.cb('email should be present', t => {
  const user = new User(login)

  user.email = '   '

  user.validate(v => {
    t.truthy(v.errors.email)
    t.end()
  })
})

test.cb('username should not be too long', t => {
  const user = new User(login)

  user.username = 'a'.repeat(51)

  user.validate(v => {
    t.truthy(v.errors.username)
    t.end()
  })
})

test.cb('email should not be too long', t => {
  const user = new User(login)

  user.email = 'a'.repeat(244) + '@example.com'

  user.validate(v => {
    t.truthy(v.errors.email)
    t.end()
  })
})

;(function () {
  const validAddresses = [
    'user@example.com',
    'USER@example.NET',
    'foo_MOO-boo@li.bu.pos.de',
    'sun.SiM@pOps.fr',
    'alise+bob@security.tw'
  ]

  const validateAddress = (t, address) => v => {
    t.ifError(v)
    t.end()
  }

  validAddresses.forEach(address => {
    test.cb(`email ${address} should be valid`, t => {
      const user = new User(login)
      user.email = address

      user.validate(validateAddress(t, address))
    })
  })
}())

;(function () {
  const invalidAddresses = [
    'foo@comma,one',
    'foo_without_at',
    'foo@dot.at.the.end.',
    'foo@underscore_between.net',
    'foo@plus+between.us'
  ]

  const validateAddress = (t, address) => v => {
    t.truthy(v.errors.email)
    t.end()
  }

  invalidAddresses.forEach(address => {
    test.cb(`email ${address} should be rejected`, t => {
      const user = new User(login)

      user.email = address
      user.validate(validateAddress(t, address))
    })
  })
}())

test.serial.cb('username should be unique', t => {
  const user = new User(login)

  function validate (v) {
    t.truthy(v.errors.username)
    t.end()
  }

  function saveAndValidate (err) {
    const clone = new User(login)

    t.ifError(err)
    clone.validate(validate)
  }

  user.save(saveAndValidate)
})

test.serial.cb('email should be unique', t => {
  const user = new User(login)

  function validate (v) {
    t.truthy(v.errors.username)
    t.end()
  }

  function saveAndValidate (err) {
    const clone = new User(login)

    t.ifError(err)
    clone.validate(validate)
  }

  user.save(saveAndValidate)
})

test('email should be lowercase', t => {
  const email = 'FOO1@exAmpLE.CoM'
  const user = new User(Object.assign({}, login, { email }))

  t.is(user.email, email.toLowerCase())
})
