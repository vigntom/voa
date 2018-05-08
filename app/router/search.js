const express = require('express')
const routing = require('../../lib/routing')
const users = require('./users')
const polls = require('./polls')

const actions = {
  search (req, res, next) {
    const type = req.query.type

    if (type && type.toUpperCase() === 'USER') {
      return users.to('index')(req, res, next)
    }

    return polls.to('index')(req, res, next)
  }
}

function createRouter () {
  const to = routing.create(actions, {})
  const router = express.Router()

  router.get('/', to('search'))

  return { to, router }
}

module.exports = createRouter()
