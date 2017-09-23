import {} from 'dotenv/config'
import req2server from 'supertest'
import test from 'ava'
import server from './../app/index'

test.cb('Server starts', t => {
  req2server(server)
    .get('/')
    .end((err, res) => {
      t.ifError(err, "Errors aren't allowed")
      t.end()
    })
})
