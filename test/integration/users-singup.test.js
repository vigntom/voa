import db from '../helpers/database'
import User from '../../app/models/user'
import { JSDOM } from 'jsdom'
import app from '../../index'
import request from 'supertest'
import test from 'ava'

db.setup(User)

function createDoc (textAsHtml) {
  const dom = new JSDOM(textAsHtml)
  return dom.window.document
}

function csrf (textAsHtml) {
  const selector = 'input[name="_csrf"]'
  return createDoc(textAsHtml).querySelector(selector).value
}

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
        return agent
          .post('/users')
          .send({ _csrf: csrf(res.text) })
          .then(res => {
            t.is(res.statusCode, 200)
            t.is(createDoc(res.text).title, 'Signup | Vote Application')

            User.count({}, assert)
          })
      })
  })
})

test.cb('Valid signup', t => {
  const agent = request.agent(app)

  function assertDiff (expected) {
    return (err, value) => {
      t.ifError(err)
      t.not(value, expected)
      t.end()
    }
  }

  User.count({}, (err, count) => {
    const assert = assertDiff(count)

    t.ifError(err)

    return agent
      .get('/users/new')
      .then(res => {
        const currentAgent = agent
          .post('/users')
          .send({
            _csrf: csrf(res.text),
            username: 'validSignup',
            email: 'validSignup@example.com',
            password: 'qwe123',
            passwordConfirmation: 'qwe123'
          })

        currentAgent.redirects().then(res => {
          t.is(res.statusCode, 200)
          t.is(createDoc(res.text).title, 'Show Users | Vote Application')
          t.end()
        })

        currentAgent.then(res => {
          t.is(res.statusCode, 302)
          t.regex(res.header.location, /\users\//)

          User.count({}, assert)
        })
      })
  })
})
