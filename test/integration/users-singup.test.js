import '../helpers/database'
import User from '../../app/models/user'
import app from '../../index'
import { createDoc, ua } from '../helpers/client'
import request from 'supertest'
import test from 'ava'

const login = {
  username: 'testUser1',
  email: 'testUser1@example.com',
  password: 'password',
  passwordConfirmation: 'password'
}

test.before(() => {
  return User.create(login)
})

test.after.always(() => {
  return User.remove()
})

test('Invalid singup', t => {
  const agent = request.agent(app)

  function assertNoDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.is(value, expected)
    }
  }

  return User.count({})
    .then(count => {
      return agent
        .get('/users/new')
        .then(ua.signUpAsUser(agent))
        .then(res => {
          const doc = createDoc(res.text)

          t.is(res.statusCode, 200)
          t.is(doc.title, 'Signup | Vote Application')
          t.truthy(doc.querySelector('div.error-msg'))
          t.truthy(doc.querySelector('input.is-invalid'))

          return assertNoDiff(count)
        })
    })
    .then(assert => {
      User.count({}).then(assert)
    })
})

test('Valid signup', t => {
  const agent = request.agent(app)

  function assertDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.not(value, expected)
    }
  }

  return User.count({})
    .then(count => {
      const loginData = {
        username: 'testUser2',
        email: 'testUser2@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }

      return agent
        .get('/users/new')
        .then(ua.signUpAsUser(agent, loginData))
        .then(res => {
          t.is(res.statusCode, 302)
          t.regex(res.header.location, /users\//)

          return agent.get(res.header.location)
        })
        .then(res => {
          const doc = createDoc(res.text)
          t.is(res.statusCode, 200)
          t.is(createDoc(res.text).title, 'Show Users | Vote Application')
          t.truthy(doc.querySelector('div.alert.alert-success'))
          return assertDiff(count)
        })
    })
    .then(assert => {
      User.count({}).then(assert)
    })
})
