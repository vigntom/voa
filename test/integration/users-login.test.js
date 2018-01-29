import '../helpers/database'
import User from '../../app/models/user'
import app from '../../index'
import { createDoc, csrf } from '../helpers/client'
import request from 'supertest'
import test from 'ava'
import cookie from 'cookie'

const username = `user-login`

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

test('Login with valid information followed by logout', t => {
  const agent = request.agent(app)

  return agent
    .get('/login')
    .then(res => {
      return agent
        .post('/login')
        .send({
          _csrf: csrf(res.text),
          user: username,
          password: 'password'
        })
    })
    .then(res => {
      t.is(res.statusCode, 302)
      t.regex(res.header.location, /users\//)

      return agent.get(res.header.location)
    })
    .then(res => {
      const doc = createDoc(res.text)

      t.is(res.statusCode, 200)
      t.is(doc.querySelectorAll('a[href="/login"]').length, 0)
      t.truthy(doc.querySelector('a[href="/logout"]'))
      t.truthy(doc.querySelector('a[href^="/users/"]'))

      return agent.delete('/logout').send({ _csrf: csrf(res.text) })
    })
    .then(res => {
      t.is(res.statusCode, 302)

      return agent.get(res.header.location)
    })
    .then(res => {
      const doc = createDoc(res.text)
      t.truthy(doc.querySelector('a[href="/login"]'))
      t.is(doc.querySelectorAll('a[href="/logout"]').length, 0)
      t.is(doc.querySelectorAll('a[href^="/users/"]').length, 0)
    })
})

test('Login with remembering', t => {
  const agent = request.agent(app)

  return agent
    .get('/login')
    .then(res => {
      return agent
        .post('/login')
        .send({
          _csrf: csrf(res.text),
          user: login.username,
          password: login.password,
          rememberMe: '1'
        })
    })
    .then(res => agent.get(res.header.location))
    .then(res => {
      const session = res.headers['set-cookie']

      // const expires = Date.parse(cookie.parse(session[0]).Expires)
      // const date = Date.parse(res.header.date)
      // t.true(expires - date >= 2 * 365 * 24 * 3600 * 1000)

      t.truthy(session)
    })
})

test('Login without remembering', t => {
  const agent = request.agent(app)

  return agent
    .get('/login')
    .then(res => {
      return agent
        .post('/login')
        .send({
          _csrf: csrf(res.text),
          user: login.username,
          password: login.password
        })
    })
    .then(res => agent.get(res.header.location))
    .then(res => {
      const session = res.headers['set-cookie']
      t.falsy(session)
    })
})
