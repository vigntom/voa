import '../helpers/database'
import User from '../../app/models/user'
import app from '../../index'
import { createDoc, ua } from '../helpers/client'
import request from 'supertest'
import test from 'ava'

test('Invalid singup', t => {
  const agent = request.agent(app)

  t.plan(3)

  function assertNoDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.is(value, expected)
    }
  }

  return User.count({})
    .then(count => {
      return agent
        .get('/signup')
        .then(ua.signUpAsUser(agent))
        .then(res => {
          const doc = createDoc(res.text)

          t.is(res.statusCode, 200)
          t.is(doc.title, 'Signup | Vote Application')
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

  t.plan(5)

  function assertDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.not(value, expected)
    }
  }

  return User.count({})
    .then(count => {
      const loginData = {
        username: 'newUser',
        email: 'newUser@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }

      return agent
        .get('/signup')
        .then(ua.signUpAsUser(agent, loginData))
        .then(res => {
          t.is(res.statusCode, 302)
          t.is(res.header.location, '/')

          return agent.get(res.header.location)
        })
        .then(res => {
          const doc = createDoc(res.text)
          t.is(res.statusCode, 200)
          t.is(createDoc(res.text).title, 'Home | Vote Application')
          t.truthy(doc.querySelector('div.alert.alert-info'))
          return assertDiff(count)
        })
    })
    .then(assert => {
      User.count({}).then(assert)
    })
})
