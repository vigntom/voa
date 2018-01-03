const express = require('express')
const staticRouter = require('../app/routers/static')
const usersRouter = require('../app/routers/users')

function routes (bParser, csrfProtection) {
  const router = express.Router()

  router.use((req, res, next) => {
    const log = req.app.locals.log
    log.debug(req.method, req.url)
    req.app.locals.messages = req.flash()
    next()
  })

  router.get('/', csrfProtection, staticRouter.home())
  router.get('/about', staticRouter.about())
  router.get('/contact', staticRouter.contact())
  router.get('/signup', csrfProtection, usersRouter.actions.new())

  router.use('/users', usersRouter.router(bParser, csrfProtection))

  return router
}

module.exports = routes
