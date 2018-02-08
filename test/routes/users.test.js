import '../helpers/database'
import request from 'supertest'
import app from '../../index'
import test from 'ava'
import User from '../../app/models/user'
import { createDoc, csrf, ua } from '../helpers/client'

const users = {}

const login = {
  main: {
    username: 'main',
    email: 'main@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  },
  spare: {
    username: 'spare',
    email: 'spare@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
}

test.before(t => {
  return Promise.all([
    User.create(login.main).then(user => { users.main = user }),
    User.create(login.spare).then(user => { users.spare = user })
  ])
})

test.after.always(() => {
  return User.remove()
})

test('Should get users index', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(ua.logInAsUser(agent, login.main))
    .then(res => agent.get('/users'))
    .then(res => {
      t.is(res.statusCode, 200)
    })
})

test('Should get signup form', t => (
  request(app)
  .get('/users/new')
  .then(res => { t.is(res.statusCode, 200) })
))

test('Rejected signup without csrfToken', t => (
  request(app).post('/users')
  .send({
    username: 'foobar',
    email: 'foobar@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  })
  .then(res => {
    t.is(res.statusCode, 422)
  })
))

test('Should redirect edit when not logged in', t => {
  const agent = request.agent(app)

  return agent.get(`/users/${users.main.id}/edit`)
    .then(res => {
      t.is(res.statusCode, 302)
      t.is(res.headers.location, '/login')

      return agent.get(res.headers.location)
    })
    .then(res => {
      const doc = createDoc(res.text)
      t.truthy(doc.querySelector('.alert.alert-danger'))
    })
})

test('Should redirect update when not logged in', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(res => agent
      .patch(`/users/${users.main.id}`)
      .send({ _csrf: csrf(res.text) })
    )
    .then(res => {
      t.is(res.statusCode, 302)
      t.is(res.headers.location, '/login')

      return agent.get(res.headers.location)
    })
    .then(res => {
      const doc = createDoc(res.text)

      t.truthy(doc.querySelector('.alert.alert-danger'))
    })
})

test('Should redirect edit non own profile', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(ua.logInAsUser(agent, login.main))
    .then(res => agent.get(`/users/${users.spare.id}/edit`))
    .then(res => {
      t.is(res.statusCode, 302)
      t.is(res.headers.location, '/')

      return agent.get(res.headers.location)
    })
    .then(res => {
      const doc = createDoc(res.text)

      t.falsy(doc.querySelector('.alert'))
    })
})

test('Should redirect update non own profile', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(ua.logInAsUser(agent, login.main))
    .then(res => agent.get(res.headers.location))
    .then(res => agent
      .patch(`/users/${users.spare.id}`)
      .send({ _csrf: csrf(res.text) }))
    .then(res => {
      t.is(res.statusCode, 302)
      t.is(res.headers.location, '/')

      return agent.get(res.headers.location)
    })
    .then(res => {
      const doc = createDoc(res.text)

      t.falsy(doc.querySelector('.alert'))
    })
})

test('Should redirect index when not logged in', t => {
  const agent = request.agent(app)

  return agent.get('/users')
    .then(res => {
      t.is(res.statusCode, 302)
      t.is(res.headers.location, '/login')
    })
})
