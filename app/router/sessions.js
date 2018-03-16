const User = require('../models/user')
const sessionsView = require('../assets/javascript/sessions')
const { createView } = require('../helpers/application-helper')
const routing = require('../../lib/routing')
const { logIn } = require('../helpers/sessions-helper')

const view = {
  new (options) {
    const page = sessionsView.new(options)
    return createView({ title: 'Login', options, page })
  }
}

const actions = {
  create (req, res, next) {
    const authenticate = User.authenticateBy('password')

    authenticate(req.body.user, req.body.password, (err, user) => {
      if (err) { return next(err) }
      if (!user) {
        res.locals.flash = { danger: ['Invalid username(email) or password'] }
        res.locals.user = req.body.user
        return res.render('application', view.new(res.locals))
      }

      if (!user.activated) {
        req.session.flash = { warning: [
          'Account not activated. ',
          'Check your email for the activation link. '
        ]}

        return res.redirect('/')
      }

      logIn(req, user, err => {
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
