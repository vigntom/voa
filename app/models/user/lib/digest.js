const bcrypt = require('bcrypt')
const crypto = require('crypto')

const cost = 10

function digest (token, cb) {
  return bcrypt.hash(token, cost, cb)
}

function newToken (n, cb) {
  return crypto.randomBytes(n, (err, buf) => {
    if (err) return cb(err)
    const result = buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
    return cb(null, result)
  })
}

function authenticate (token, hash, cb) {
  return bcrypt.compare(token, hash, (err, res) => {
    if (err) { return cb(err) }
    return cb(null, res)
  })
}

module.exports = {
  digest,
  newToken,
  authenticate
}
