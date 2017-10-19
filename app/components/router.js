const express = require('express')
const staticPagesRouter = require('./static/router')
const layout = require('./layout/app')
const home = require('./static/home')

function componentsRouter (log) {
  const router = express.Router()

  router.use((req, res, next) => {
    log.debug(req.method, req.url)
    next()
  })

  router.get('/', (req, res) => {
    res.send(layout(home))
  })

  router.use('/static', staticPagesRouter(layout))

  return router
}

module.exports = componentsRouter
