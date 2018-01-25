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
        if (err) { next(err) }
        res.redirect(`/users/${user.id}`)
      })
    })
  },

  delete (req, res) {
    req.session.destroy()
    return res.redirect('/')
  }
}

module.exports = routing.create(actions, view)
