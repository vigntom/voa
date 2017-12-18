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
