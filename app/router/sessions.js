const User = require('../models/user')
const template = require('../view/sessions')
const { logIn } = require('../view/helpers/session')
const routing = require('../../lib/routing')
const voaView = require('../../lib/view')

const data = {
  new: { title: 'LogIn' }
}

const view = voaView.bind(template, data)

const actions = {
  create (req, res, next) {
    const authenticate = User.authenticateBy('password')

    authenticate(req.body.user, req.body.password, (err, user) => {
      if (err) { return next(err) }
      if (!user) {
        res.locals.flash = { danger: 'Invalid username(email) or password' }
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

        return res.redirect(`/ui/${user.username}`)
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
