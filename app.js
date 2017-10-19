const path = require('path')
const server = require('./app/server')
const throng = require('throng')
const config = require('./config.json')
const createLogger = require('./lib/logger')

const appConfig = Object.assign(config, {
  root: __dirname,
  log_dir: path.resolve(__dirname, 'log'),
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development'
})

const log = createLogger(appConfig)
const app = server({ log, config: appConfig })

const workers = process.env.WEB_CONCURRENCY || 1

switch (config.env) {
  case 'production':
    throng({
      workers,
      master () {
        log.info(`Application mode ${config.env}`)
      },

      start (id) {
        process.on('SIGTERM', () => {
          log.info(`Worker ${id} stopped`)
          process.exit()
        })

        app.listen(config.port, () => {
          log.info(`Listening on port ${config.port} (id=${id})`)
        })
      }

    })

    break

  case 'test':
    break

  default:
    log.info(`Application starting in ${config.env} mode`)

    app.listen(config.port, () => {
      log.info(`Listening on ${config.port}`)
    })
}

module.exports = app
