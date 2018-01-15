import request from 'supertest'
import server from '../../index'
import test from 'ava'

test.cb('Should get home', t => {
  request(server).get('/').expect(200, t.end)
})

test.cb('Should get about', t => {
  request(server).get('/about').expect(200, t.end)
})

test.cb('Should get contact', t => {
  request(server).get('/contact').expect(200, t.end)
})

test.cb('Should get not found', t => {
  request(server).get('/notFoundPage').expect(404, t.end)
})
