const express = require('express')
const createLayout = require('../app/helpers/application-helper')
const home = require('../app/view/static/home.js')
const about = require('../app/view/static/about')

const router = express.Router()

function getTo (route, page) {
  return router.get(route, (req, res) => {
    res.render('application', page)
  })
}

function componentsRouter (config, log) {
  const layout = createLayout(config.env)

  router.use((req, res, next) => {
    log.debug(req.method, req.url)
    next()
  })

  getTo('/', layout(home))
  getTo('/about', layout(about))

  return router
}

module.exports = componentsRouter
