module.exports = {
  production: {
    log: { console: 'warn' }
  },

  development: {
    log: { console: 'trace', file: 'debug' }
  },

  test: {
    log: { console: 'error', file: 'warn' }
  }
}
