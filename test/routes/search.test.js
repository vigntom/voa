import request from 'supertest'
import test from 'ava'
import '../helpers/database'
import { ua } from '../helpers/client'
import fixture from '../fixtures/users'
import app from '../..'

const login = fixture.sara

test('Should get users index as unauthenticated user', t => {
  const agent = request.agent(app)

  t.plan(2)

  return agent.get('/')
    .then(res => t.is(res.statusCode, 200))
    .then(res => agent.get('/search?type=user'))
    .then(res => {
      t.is(res.statusCode, 200)
    })
})

test('Should get users index as authenticated user', t => {
  const agent = request.agent(app)

  t.plan(2)

  return agent.get('/')
    .then(res => {
      t.is(res.statusCode, 200)
      return res
    })
    .then(ua.logInAsUser(agent, login))
    .then(res => agent.get('/search?type=user'))
    .then(res => {
      t.is(res.statusCode, 200)
    })
})

test('Should get polls index as unauthenticated user', t => {
  const agent = request.agent(app)

  t.plan(2)

  return agent.get('/')
    .then(res => t.is(res.statusCode, 200))
    .then(res => agent.get('/search?type=poll'))
    .then(res => {
      t.is(res.statusCode, 200)
    })
})

test('Should get polls index as authenticated user', t => {
  const agent = request.agent(app)

  t.plan(2)

  return agent.get('/')
    .then(res => {
      t.is(res.statusCode, 200)
      return res
    })
    .then(ua.logInAsUser(agent, login))
    .then(res => agent.get('/search?type=polls'))
    .then(res => {
      t.is(res.statusCode, 200)
    })
})

test('Should get search result without type', t => {
  const agent = request.agent(app)

  t.plan(3)

  return agent.get('/')
    .then(res => t.is(res.statusCode, 200))
    .then(res => agent.get('/search'))
    .then(res => {
      t.is(res.statusCode, 200)
      return res
    })
    .then(res => agent.get('/search?type='))
    .then(res => t.is(res.statusCode, 200))
})
