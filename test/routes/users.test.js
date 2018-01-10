import db from '../helpers/database'
import request from 'supertest'
import app from '../../index'
import test from 'ava'
import { JSDOM } from 'jsdom'
import User from '../../app/models/user'

db.setup(User)

test('Should get users index', t => (
  request(app)
  .get('/users')
  .then(res => {
    t.is(res.statusCode, 200)
  })
))

test('Should get signup form', t => (
  request(app)
  .get('/users/new')
  .then(res => {
    t.is(res.statusCode, 200)
  })
))

test('Rejected signup without csrfToken', t => (
  request(app)
  .post('/users')
  .field('username', 'foobar')
  .field('email', 'wrong@email.con')
  .field('password', 'qwe123')
  .field('passwordConfirmation', 'qwe123')
  .then(res => {
    t.is(res.statusCode, 422)
  })
))

test('Invalid signup', t => {
  const agent = request.agent(app)

  return agent
    .get('/users/new')
    .then(res => {
      const dom = new JSDOM(res.text)
      const doc = dom.window.document
      const csrf = doc.querySelector('input[name="_csrf"]').value

      return agent
        .post('/users')
        .send({ _csrf: csrf })
        .then(res => {
          const dom = new JSDOM(res.text)
          const doc = dom.window.document

          t.is(res.statusCode, 200)
          t.is(doc.title, 'Signup | Vote Application')
        })
    })
})

test('Valid signup', t => {
  const agent = request.agent(app)

  return agent
    .get('/users/new')
    .then(res => {
      const dom = new JSDOM(res.text)
      const doc = dom.window.document
      const csrf = doc.querySelector('input[name="_csrf"]').value

      return agent
        .post('/users')
        .send({
          _csrf: csrf,
          username: 'foo',
          email: 'foo@example.com',
          password: 'qwe123',
          passwordConfirmation: 'qwe123'
        })
        .then(res => {
          t.is(res.statusCode, 302)
          t.regex(res.header.location, /\/users\//)
        })
    })
})
