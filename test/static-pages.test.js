import req2server from 'supertest'
import server from '../app'
import test from 'ava'

test.cb('Should get home', t => {
  req2server(server).get('/').expect(200, t.end)
})

test.cb('Should get about', t => {
  req2server(server).get('/static/about').expect(200, t.end)
})

test.cb('Should get help', t => {
  req2server(server).get('/static/help').expect(200, t.end)
})

test.cb('Should get not found', t => {
  req2server(server).get('/notFoundPage').expect(404, t.end)
})
