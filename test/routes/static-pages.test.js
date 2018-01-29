import request from 'supertest'
import server from '../../index'
import test from 'ava'

test('Should get home', t => {
  return request(server)
    .get('/')
    .then(res => t.is(res.statusCode, 200))
})

test('Should get about', t => {
  return request(server)
    .get('/about')
    .then(res => t.is(res.statusCode, 200))
})

test('Should get contact', t => {
  return request(server)
    .get('/contact')
    .then(res => t.is(res.statusCode, 200))
})

test('Should get not found', t => {
  return request(server)
    .get('/notFoundPage')
    .then(res => t.is(res.statusCode, 404))
})
