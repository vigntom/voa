const express = require('express')
const staticPages = require('./static-pages')
const users = require('./users')
const sessions = require('./sessions')
const accountActivtions = require('./account-activations')
const passwordResets = require('./password-resets')
const search = require('./search')
const polls = require('./polls')
const api = require('./api')
const log = require('../../lib/logger')

function routes (csrfProtection) {
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
  router.get('/search', search.to('search'))
  router.get('/settings', users.to('edit'))

  router.get('/login', sessions.to('new'))
  router.post('/login', sessions.to('create'))
  router.delete('/logout', sessions.to('delete'))

  router.use('/accountActivations', accountActivtions.router)
  router.use('/passwordResets', passwordResets.router)

  router.use('/api', api.router)
  router.use('/ui', users.router)

  return router
}

module.exports = routes
