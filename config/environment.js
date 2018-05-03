module.exports = {
  production: {
    log: { console: 'info' }
  },

  development: {
    log: { console: 'trace', file: 'debug' }
  },

  test: {
    log: { console: 'debug', file: 'info' }
  }
}
