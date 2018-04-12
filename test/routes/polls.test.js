import '../helpers/database'
import request from 'supertest'
import app from '../../index'
import test from 'ava'
import { createDoc, csrf, ua } from '../helpers/client'

test('Guest request polls', t => {
  const agent = request.agent(app)

  return agent.get('/polls')
    .then(res => t.is(res.statusCode, 200))
    .catch(t.ifError)
})