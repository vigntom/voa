const express = require('express')
const staticPagesRouter = require('./static/router')
const createLayout = require('./layouts/layout')
const home = require('./static/home')

function componentsRouter (config, log) {
  const router = express.Router()
  const layout = createLayout(config.env)

  router.use((req, res, next) => {
    log.debug(req.method, req.url)
    next()
  })

  router.get('/', (req, res) => {
    res.render('application', layout(home))
  })

  router.use('/static', staticPagesRouter(layout))

  return router
}

module.exports = componentsRouter
