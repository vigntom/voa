import '../helpers/database'
import User from '../../app/models/user'
import app from '../../index'
import { createDoc, csrf } from '../helpers/client'
import request from 'supertest'
import test from 'ava'

const username = `user-login-${Date.now()}`

const login = {
  username,
  email: `${username}@example.com`,
  password: 'password',
  passwordConfirmation: 'password'
}

test.before(() => {
  return User.create(login)
})

test.after.always(() => {
  return User.remove()
})

test.cb('Invalid singup', t => {
  const agent = request.agent(app)

  function assertNoDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.is(value, expected)
      t.end()
    }
  }

  User.count({}, (err, count) => {
    const assert = assertNoDiff(count)

    t.ifError(err)

    return agent
      .get('/users/new')
      .then(res => {
        return agent.post('/users').send({ _csrf: csrf(res.text) })
      })
      .then(res => {
        const doc = createDoc(res.text)

        t.is(res.statusCode, 200)
        t.is(doc.title, 'Signup | Vote Application')
        t.truthy(doc.querySelector('div.error-msg'))
        t.truthy(doc.querySelector('input.is-invalid'))

        User.count({}, assert)
      })
      .catch(err => {
        t.end(err)
      })
  })
})

test.cb('Valid signup', t => {
  const agent = request.agent(app)

  const username = `user-signup-${Date.now()}`

  function assertDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.not(value, expected)
      t.end()
    }
  }

  User.count({}, (err, count) => {
    const assert = assertDiff(count)
    const loginData = html => ({
      _csrf: csrf(html),
      username,
      email: `${username}@example.com`,
      password: 'password',
      passwordConfirmation: 'password'
    })

    t.ifError(err)

    return agent
      .get('/users/new')
      .then(res => (
        agent
        .post('/users')
        .send(loginData(res.text))
      ))
      .then(res => {
        t.is(res.statusCode, 302)
        t.regex(res.header.location, /users\//)

        return agent.get(res.header.location)
      })
      .then(res => {
        t.is(res.statusCode, 200)
        t.is(createDoc(res.text).title, 'Show Users | Vote Application')

        User.count({}, assert)
      })
      .catch(err => {
        t.end(err)
      })
  })
})
