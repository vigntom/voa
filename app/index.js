const path = require('path')
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const session = require('express-session')
const csrf = require('csurf')
const methodOverride = require('method-override')
const createMongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const paginate = require('express-paginate')
const router = require('./router')
const createAssetsList = require('../lib/assets-list')
const log = require('../lib/logger')
const config = require('../config')

function createApp () {
  const app = express()
  const { pagination } = config.app

  if (config.secret.key && config.secret.key.length < 128) {
    throw new Error('Broken secret keys')
  }

  const overrideMethods = () => methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method
      delete req.body._method
      return method
    }
  })

  const sessionOptions = {
    name: 'voa-session',
    secret: config.secret.key,
    resave: false,
    saveUninitialized: false,
    cookie: {}
  }

  if (config.env !== 'test') {
    const MongoStore = createMongoStore(session)

    sessionOptions.store = new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }

  app.locals.env = config.env
  app.locals.assets = createAssetsList(config.env)

  app.set('view engine', 'ejs')
  app.set('views', path.resolve('app', 'view', 'layouts'))

  if (config.env === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
    app.use(compression())
  }

  app.use('/public', express.static('public'))
  app.use(helmet())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(paginate.middleware(pagination.count, pagination.limit))
  app.use(session(sessionOptions))
  app.use(csrf({ cookie: false }))
  app.use(overrideMethods())

  app.use('/', router())

  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
      return next(err)
    }

    log.warn(`422: Can't verify csrf token authenticity`)
    res.status(422)
    return res.sendFile(path.resolve('public', '422.html'))
  })

  app.use((err, req, res, next) => {
    if (res.headersSend) {
      return next(err)
    }

    log.warn('500: ', err.stack)
    res.status(500)
    return res.sendFile(path.resolve('public', '500.html'))
  })

  return app
}

module.exports = createApp
