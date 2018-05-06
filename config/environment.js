module.exports = {
  production: {
    log: { console: 'info' }
  },

  development: {
    log: { console: 'trace', file: 'debug' }
  },

  test: {
    log: { console: 'error', file: 'warn' }
  }
}
