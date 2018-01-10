const express = require('express')
const staticRouter = require('../app/routers/static')
const usersRouter = require('../app/routers/users')

function routes () {
  const router = express.Router()

  router.use((req, res, next) => {
    const log = req.app.locals.log
    log.debug(req.method, req.url)
    req.app.locals.messages = req.flash()
    next()
  })

  router.get('/', staticRouter.home())
  router.get('/about', staticRouter.about())
  router.get('/contact', staticRouter.contact())
  router.get('/signup', usersRouter.actions.new())

  router.use('/users', usersRouter.router())

  return router
}

module.exports = routes
