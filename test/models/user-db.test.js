import '../helpers/database'
import test from 'ava'
import User from '../../app/models/user'
import fixture from '../fixtures/users'

const login = fixture.sara

const authenticate = User.authenticateBy('password')

test.after.always(() => {
  return User.remove()
})

test.cb('username should be unique', t => {
  const user = new User(login)
  user.validate(v => {
    t.truthy(v.errors.username)
    t.end()
  })
})

test.cb('email should be unique', t => {
  const user = new User(login)
  user.validate(v => {
    t.truthy(v.errors.email)
    t.end()
  })
})

test.cb('should not authenticate if wrong username', t => {
  const username = 'wrongfoo'
  const password = login.password
  authenticate(username, password, (err, user) => {
    t.falsy(err)
    t.falsy(user)
    t.end()
  })
})

test.cb('should not authenticate if wrong email', t => {
  const email = 'foowrong@example.com'
  const password = login.password
  authenticate(email, password, (err, user) => {
    t.falsy(err)
    t.falsy(user)
    t.end()
  })
})

test.cb('should not authenticate if wrong password', t => {
  const username = login.usernam
  const password = 'wrong'
  authenticate(username, password, (err, user) => {
    t.falsy(err)
    t.falsy(user)
    t.end()
  })
})

test.cb('should authenticate if correct username password', t => {
  const username = login.username
  const password = login.password
  authenticate(username, password, (err, user) => {
    t.falsy(err)
    t.truthy(user)
    t.end()
  })
})

test.cb('should authenticate if correct email password', t => {
  const email = login.email
  const password = login.password
  authenticate(email, password, (err, user) => {
    t.falsy(err)
    t.truthy(user)
    t.end()
  })
})

test.cb('passwrod can be "*" (service user)', t => {
  const login = {
    username: 'someServiceAccount',
    email: 'serviceAccount@example.com',
    password: '*',
    passwordConfirmation: '*'
  }

  const user = new User(login)

  user.validate(v => {
    t.falsy(v)
    t.end()
  })
})

test.cb('should not authenticate if service acount (password = *)', t => {
  const login = {
    username: 'someServiceAccount',
    email: 'serviceAccount@example.com',
    password: '*',
    passwordConfirmation: '*'
  }

  const user = new User(login)

  user.save(() => {
    authenticate(login.username, '*', (err, user) => {
      t.falsy(err)
      t.falsy(user)
      t.end()
    })
  })
})
