import '../helpers/database'
import request from 'supertest'
import app from '../../index'
import test from 'ava'
import User from '../../app/models/user'
import { createDoc, csrf, ua } from '../helpers/client'
import fixture from '../fixtures/users'

const users = {}
const login = { main: fixture.admin, spare: fixture.sara }

test.before(t => {
  return Promise.all([
    User.findOne({ username: login.main.username }).then(user => { users.main = user }),
    User.findOne({ username: login.spare.username }).then(user => { users.spare = user })
  ])
})

test.after.always(() => {
  return User.remove()
})

test('Should get signup form', t => (
  request(app)
    .get('/signup')
    .then(res => t.is(res.statusCode, 200))
))

test('Rejected signup without csrfToken', t => (
  request(app).post('/ui/')
    .send({
      username: 'foobar',
      email: 'foobar@example.com',
      password: 'password',
      passwordConfirmation: 'password'
    })
    .then(res => t.is(res.statusCode, 422))
))

test('Should redirect edit when not logged in', t => {
  const agent = request.agent(app)

  return agent.get('/settings')
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
    .then(res => {
      t.is(res.statusCode, 200)
      return res
    })
    .then(res => agent
      .patch(`/ui/${users.main.username}`)
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

test('Should redirect update non own profile', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(res => {
      t.is(res.statusCode, 200)
      return res
    })
    .then(ua.logInAsUser(agent, login.main))
    .then(res => agent.get(res.headers.location))
    .then(res => agent
      .patch(`/ui/${users.spare.username}`)
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

test('should redirect delete when not logged in', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(res => {
      t.is(res.statusCode, 200)
      return res
    })
    .then(res => agent
      .delete(`/ui/${users.spare.username}`)
      .send({ _csrf: csrf(res.text) })
    )
    .then(res => {
      t.is(res.statusCode, 302)
      t.is(res.headers.location, '/login')
    })
})

test.serial('should redirect delete when logged in as a non admin', t => {
  const agent = request.agent(app)

  return User.count({})
    .then(count => {
      return agent.get('/')
        .then(res => {
          t.is(res.statusCode, 200)
          return res
        })
        .then(ua.logInAsUser(agent, login.spare))
        .then(() => agent.get('/search?type=user'))
        .then(res => agent
          .delete(`/ui/${users.spare.username}`)
          .send({ _csrf: csrf(res.text) })
        )
        .then(res => {
          t.is(res.statusCode, 302)
          t.is(res.headers.location, '/')
        })
        .then(() => User.count({}))
        .then(res => t.is(count, res))
    })
})

test('should delete when logged as admin', t => {
  const agent = request.agent(app)

  return User.count({})
    .then(count => {
      return agent.get('/')
        .then(res => {
          t.is(res.statusCode, 200)
          return res
        })
        .then(ua.logInAsUser(agent, login.main))
        .then(() => agent.get('/search?type=user'))
        .then(res => agent
          .delete(`/ui/${users.spare.username}`)
          .send({ _csrf: csrf(res.text) })
        )
        .then(() => User.count({}))
        .then(res => t.is(res - count, -1))
    })
})
