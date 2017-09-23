const log = require('./app/lib/logger')
const app = require('./app/index')
const throng = require('throng')

const port = process.env.PORT || 5000
const workers = process.env.WEB_CONCURRENCY || 1
const env = process.env.NODE_ENV

if (env !== 'test') {
  throng({
    workers,
    master () {
      log.info(`Application mode ${env}`)
    },

    start (id) {
      process.on('SIGTERM', () => {
        log.info(`Worker ${id} stopped`)
        process.exit()
      })

      app.listen(port, () => {
        log.info(`Listening on port ${port} (id=${id})`)
      })
    }

  })
} else {
  log.info(`Application starting in ${env} mode`)

  app.listen(port, () => {
    log.info(`Listening on ${port}`)
  })
}
