import '../helpers/database'
import app from '../../index'
import { createDoc, csrf, ua } from '../helpers/client'
import request from 'supertest'
import test from 'ava'
import users from '../fixtures/users'

const login = users.bob

test('Login with valid information followed by logout', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(ua.logInAsUser(agent, login))
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
  const loginWithRemember = Object.assign({}, login, { rememberMe: '1' })

  return agent.get('/')
    .then(ua.logInAsUser(agent, loginWithRemember))
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
    .then(ua.logInAsUser(agent, login))
    .then(res => agent.get(res.header.location))
    .then(res => {
      const session = res.headers['set-cookie']
      t.falsy(session)
    })
})

test('Should remember user when invalid login', t => {
  const agent = request.agent(app)
  const username = 'wrongLogin'
  const failLogin = Object.assign({}, login, { username })

  return agent.get('/')
    .then(ua.logInAsUser(agent, failLogin))
    .then(res => {
      const doc = createDoc(res.text)
      t.is(res.statusCode, 200)
      t.is(doc.querySelector('input[name=user]').value, username)
    })
})
