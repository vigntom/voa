const User = require('../models/user')
const sessionsView = require('../assets/javascript/sessions')
const { fill } = require('../helpers/application-helper')
const routing = require('../../lib/routing')
const { logIn } = require('../helpers/sessions-helper')

const view = {
  new (csrfToken, notice) {
    const title = 'Login'
    const params = { csrfToken }

    return fill({ title, notice, page: sessionsView.new(params) })
  }
}

const actions = {
  create (req, res, next) {
    User.authenticate(req.body.user, req.body.password, (err, user) => {
      if (err) {
        const notice = { danger: ['Invalid username(email) or password'] }
        return res.render('application', view.new(req.csrfToken(), notice))
      }

      logIn(req, user.id, err => {
        const { rememberMe } = req.body
        if (err) { return next(err) }

        if (rememberMe && rememberMe === '1') {
          req.session.cookie.maxAge = 2 * 365 * 24 * 3600000
        }

        return res.redirect(`/users/${user.id}`)
      })
    })
  },

  delete (req, res) {
    return req.session.destroy(() => {
      return res.redirect('/')
    })
  }
}

module.exports = {
  to: routing.create(actions, view)
}
