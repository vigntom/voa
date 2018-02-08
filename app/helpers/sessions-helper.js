module.exports = {
  logIn (req, user, cb) {
    req.session.regenerate(err => {
      if (err) { return cb(err) }
      req.session.user = user
      return cb()
    })
  }
}
