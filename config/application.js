const path = require('path')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cookieSession = require('cookie-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const routes = require('./router')
const createAssetsList = require('../lib/assets-list')

function createApp ({ config, log }) {
  const app = express()

  app.locals.title = 'Votting Application'
  app.locals.log = log
  app.locals.env = config.env
  app.locals.assets = createAssetsList(config.env)

  app.set('view engine', 'ejs')
  app.set('views', path.resolve(config.root, 'app', 'view', 'layouts'))

  app.use('/public', express.static(path.resolve(config.root, 'public')))

  app.use(helmet())
  app.use(cookieSession({
    name: 'session',
    keys: ['test']
  }))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(csrf({ cookie: false }))

  app.use(flash())

  if (config.env === 'production') {
    app.use(compression())
  }

  app.use('/', routes())

  if (config.env === 'development') {
    require('reload')(app)
  }

  app.use((req, res, next) => {
    log.warn(`404: Page(${req.url}) not found`)
    res.status(404)
    res.sendFile(path.resolve(config.root, 'public', '404.html'))
  })

  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') { return next(err) }

    log.warn(`422: Can't verify csrf token authenticity`)
    res.status(422)
    res.sendFile(path.resolve(config.root, 'public', '422.html'))
  })

  app.use((err, req, res, next) => {
    if (res.headersSend) { return next(err) }

    log.warn('500: ', err.stack)
    res.status(500)
    res.sendFile(path.resolve(config.root, 'public', '500.html'))
  })

  return app
}

module.exports = createApp
