import '../helpers/database'
import test from 'ava'
import User from '../../app/models/user'

const login = {
  username: 'foo',
  email: 'foo@example.com',
  password: 'abc123',
  passwordConfirmation: 'abc123'
}

const authenticate = User.authenticateBy('password')

test.before(() => {
  const user = new User(login)
  return user.save()
})

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
    t.truthy(err)
    t.end()
  })
})

test.cb('should not authenticate if wrong email', t => {
  const email = 'foowrong@example.com'
  const password = login.password
  authenticate(email, password, (err, user) => {
    t.truthy(err)
    t.end()
  })
})

test.cb('should not authenticate if wrong password', t => {
  const username = login.usernam
  const password = 'wrong'
  authenticate(username, password, (err, user) => {
    t.truthy(err)
    t.end()
  })
})

test.cb('should authenticate if correct username password', t => {
  const username = login.username
  const password = login.password
  authenticate(username, password, (err, user) => {
    t.ifError(err)
    t.end()
  })
})

test.cb('should authenticate if correct email password', t => {
  const email = login.email
  const password = login.password
  authenticate(email, password, (err, user) => {
    t.ifError(err)
    t.end()
  })
})
