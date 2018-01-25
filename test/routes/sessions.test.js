import app from '../../index'
import request from 'supertest'
import test from 'ava'

test('should get new', t =>
  request(app).get('/login').then(res =>
    t.is(res.statusCode, 200)
  )
)
