const path = require('path')
const throng = require('throng')
const log = require('./lib/logger')
const config = require('./config')
const createApp = require('./app')
const db = require('./lib/db')

const app = createApp()

switch (config.env) {
  case 'test':
    handleNotFound(app)
    break

  default:
    throng({
      workers: config.web.concurrency || 1,
      master: initApp,
      grace: 1000,

      start (id) {
        process.on('SIGTERM', clean(id))
        process.on('SIGINT', clean(id))

        if (config.env === 'development') { require('reload')(app) }

        startApp(app, `W:(${id}) -> `)
      }
    })
}

function initApp () {
  log.info(`Application starting in ${config.env} mode`)
}

function handleNotFound (app) {
  app.use((req, res, next) => {
    log.warn(`404: Page(${req.url}) not found`)
    res.status(404)
    res.sendFile(path.resolve('public', '404.html'))
  })

  return app
}

function startApp (app, msg) {
  return handleNotFound(app).listen(config.port, () => {
    log.info(`(${msg}) Listening on ${config.web.port}`)
  })
}

function clean (id) {
  return () => {
    log.info(`Worker ${id} stopped`)

    return db.connection.close().then(() => {
      log.warn(`Mongoose connection terminated`)
      return process.exit(0)
    })
  }
}

module.exports = app
