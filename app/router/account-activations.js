const express = require('express')
const User = require('../models/user')
const routing = require('../../lib/routing')
const validator = require('validator')
const { logIn } = require('../helpers/sessions-helper')
const log = require('../../lib/logger')

const view = {}

const actions = {
  edit (req, res, next) {
    const authenticate = User.authenticateBy('activation')
    const email = req.query.email.toString()
    const token = req.params.token.toString()

    if (!validator.isEmail(email)) {
      return invalidActivationLink('Invalid email')
    }

    function invalidActivationLink (msg) {
      if (msg) { log.warn(msg) }
      req.session.flash = { danger: 'Invalid activation link' }
      return res.redirect('/')
    }

    function logInAs (user) {
      return logIn(req, user, err => {
        if (err) { return next(err) }

        req.session.flash = { success: 'Acctount activated!' }

        return res.redirect(`/users/${user._id}`)
      })
    }

    function saveUser (user) {
      return user.save((err, who) => {
        if (err) { return next(err) }
        return logInAs(user)
      })
    }

    return authenticate(email, token, (err, user) => {
      if (err) { return invalidActivationLink() }
      if (!user) { return invalidActivationLink() }
      if (user.activated) { return invalidActivationLink() }

      user.activated = true
      user.activatedAt = Date.now()

      return saveUser(user)
    })
  }
}

module.exports = (function () {
  const to = routing.create(actions, view)
  const router = express.Router()

  router.get('/:token/edit', to('edit'))

  return { to, router }
}())
