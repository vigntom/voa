import request from 'supertest'
import app from '../../index'
import test from 'ava'

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
