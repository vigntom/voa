module.exports = {
  logIn (req, userId, cb) {
    req.session.regenerate(err => {
      if (err) { return cb(err) }
      req.session.userId = userId
      return cb()
    })
  }
}
