import '../helpers/setup-browser-env'
import req2server from 'supertest'
import server from '../../index'
import test from 'ava'

test.cb('Should get users index', t => {
  req2server(server).get('/users').expect(200, t.end)
})
