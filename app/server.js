const path = require('path')
const express = require('express')
const router = require('./components/router')
const compression = require('compression')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const validator = require('express-validator')

function createApp ({ config, log }) {
  const app = express()

  app.use(express.static(path.resolve(config.root, 'public')))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(validator())
  app.use(helmet())

  if (config.env === 'production') {
    app.use(compression())
  }

  app.use('/', router(log))

  return app
}

module.exports = createApp
