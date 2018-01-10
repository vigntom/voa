const express = require('express')
const { fill } = require('../helpers/application-helper')
const usersView = require('../assets/javascript/users')
const User = require('../models/user')
const R = require('ramda')

const actions = {
  index: () => (req, res, next) => {
    const title = 'Users'

    return User.find({}, (err, users) => {
      if (err) { next(err) }
      const view = fill({ title, page: usersView.index({ users }) })

      return res.render('application', view)
    })
  },

  show: (objId) => (req, res, next) => {
    const title = 'Show Users'
    const params = req.params
    const id = objId || params.id
    const isObjectId = /^[a-f0-9]{24}$/i.test(id)

    if (!isObjectId) { return next('route') }

    return User.findById(id, (err, user) => {
      if (err) { return next(err) }
      const view = fill({ title, page: usersView.show({ user }) })

      return res.render('application', view)
    })
  },

  new: (user, errors) => (req, res) => {
    const title = 'Signup'
    const params = {
      user: user || new User(),
      errors: errors,
      csrfToken: req.csrfToken()
    }

    const view = fill({ title, page: usersView.new(params) })

    return res.render('application', view)
  },

  create: () => (req, res) => {
    const userFields = ['username', 'email', 'password', 'passwordConfirmation']
    const user = new User(R.pick(userFields, req.body))

    return user.save((err, who) => {
      if (err) { return actions.new(user, err.errors)(req, res) }

      req.flash('success', 'Welcome to the Votting Application')
      return res.redirect(`/users/${who.id}`)
    })
  }
}

function createUserRouter () {
  const router = express.Router()

  router.get('/', actions.index())
  router.get('/new', actions.new())
  router.get('/:id', actions.show())

  router.post('/', actions.create())

  return router
}

module.exports = {
  actions,
  router: createUserRouter
}
