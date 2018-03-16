const express = require('express')
const staticPages = require('./static-pages')
const users = require('./users')
const sessions = require('./sessions')
const accountActivtions = require('./account-activations')
const passwordResets = require('./password-resets')
const log = require('../../lib/logger')

function routes () {
  const router = express.Router()

  router.use((req, res, next) => {
    log.trace(req.method, req.url)
    res.locals.csrfToken = req.csrfToken()
    res.locals.flash = Object.assign({}, req.session.flash)
    res.locals.session = req.session
    req.session.flash = {}
    next()
  })

  router.get('/', staticPages.to('home'))
  router.get('/about', staticPages.to('about'))
  router.get('/contact', staticPages.to('contact'))
  router.get('/signup', users.to('new'))

  router.get('/login', sessions.to('new'))
  router.post('/login', sessions.to('create'))
  router.delete('/logout', sessions.to('delete'))

  router.use('/users', users.router)
  router.use('/accountActivations', accountActivtions.router)
  router.use('/passwordResets', passwordResets.router)

  return router
}

module.exports = routes
