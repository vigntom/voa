const server = require('./config/application')
const throng = require('throng')
const log = require('./lib/logger')
const createDbConnection = require('./lib/db')

const config = {
  root: __dirname,
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  key1: process.env.SECRET_KEY1,
  key2: process.env.SECRET_KEY2
}

const app = server({ config })
const workers = process.env.WEB_CONCURRENCY || 1

createDbConnection(log)

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
