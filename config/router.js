const express = require('express')
const staticRouter = require('../app/routers/static')
const usersRouter = require('../app/routers/users')
const sessionsRouter = require('../app/routers/sessions')
const log = require('../lib/logger')

function routes () {
  const router = express.Router()

  router.use((req, res, next) => {
    log.debug(req.method, req.url)
    res.locals.session = Object.assign({}, req.session)
    res.locals.csrfToken = req.csrfToken()
    req.session.flash = {}
    next()
  })

  router.get('/', staticRouter.to('home'))
  router.get('/about', staticRouter.to('about'))
  router.get('/contact', staticRouter.to('contact'))
  router.get('/signup', usersRouter.to('new'))

  router.get('/login', sessionsRouter.to('new'))
  router.post('/login', sessionsRouter.to('create'))
  router.delete('/logout', sessionsRouter.to('delete'))

  router.use('/users', usersRouter.router())

  return router
}

module.exports = routes
