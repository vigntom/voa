const express = require('express')
const { fill } = require('../helpers/application-helper')
const usersView = require('../assets/javascript/users')
const User = require('../models/user')
const R = require('ramda')
const { logIn } = require('../helpers/sessions-helper')
const routing = require('../../lib/routing')

const renderer = res => page => res.render('application', page)

function userParams (params) {
  const fields = ['username', 'email', 'password', 'passwordConfirmation']
  const pickOrblank = R.compose(
    R.pick(fields),
    R.merge(R.__, params),
    R.mergeAll,
    R.map(x => ({ [x]: '' }))
  )

  return pickOrblank(fields)
}

const view = {
  index (users) {
    return fill({
      title: 'Users',
      page: usersView.index({ users })
    })
  },

  show (user) {
    return fill({
      title: 'Show Users',
      page: usersView.show({ user })
    })
  },

  new (csrfToken, user = new User(), errors) {
    return fill({
      title: 'Signup',
      page: usersView.new({ csrfToken, user, errors })
    })
  },

  edit (csrfToken, user, errors) {
    return fill({
      title: 'Edit User',
      page: usersView.edit({ csrfToken, user, errors })
    })
  }
}

const actions = {
  index (req, res, next) {
    return User.find({}, (err, users) => {
      if (err) { next(err) }
      return renderer(res)(view.index(users))
    })
  },

  show (req, res, next) {
    const id = req.params.id
    const isObjectId = /^[a-f0-9]{24}$/i.test(id)

    if (!isObjectId) { return next('route') }

    return User.findById(id, (err, user) => {
      if (err) { return next(err) }

      return renderer(res)(view.show(user))
    })
  },

  new (req, res) {
    return res.render('application', view.new(req.csrfToken()))
  },

  create (req, res, next) {
    const user = new User(userParams(req.body))

    return user.save((err, who) => {
      if (err) {
        return renderer(res)(view.new(req.csrfToken(), user, err.errors))
      }

      return logIn(req, user.id, err => {
        if (err) { next(err) }
        req.session.flash = { success: 'Welcome to the Votting Application' }
        return res.redirect(`/users/${who.id}`)
      })
    })
  },

  edit (req, res, next) {
    return User.findById(req.params.id, (err, user) => {
      if (err) { return next(err) }

      return renderer(res)(view.edit(req.csrfToken(), user))
    })
  },

  update (req, res, next) {
    const id = req.session.userId

    function updateUser (err, user) {
      if (err) { return next(err) }

      user.set(userParams(req.body))
      user.save((err) => {
        if (err && err.errors) {
          return renderer(res)(view.edit(req.csrfToken(), user, err.errors))
        }

        if (err) {
          return next(err)
        }

        req.session.flash = { success: 'Profile updated' }
        return res.redirect(`/users/${user.id}`)
      })
    }

    return User.findById(id, updateUser)
  }
}

const to = routing.create(actions, view)

function createUserRouter () {
  const router = express.Router()

  router.get('/', to('index'))
  router.get('/new', to('new'))
  router.get('/:id', to('show'))
  router.get('/:id/edit', to('edit'))

  router.post('/', to('create'))
  router.patch('/:id', to('update'))

  return router
}

module.exports = Object.assign({}, actions, {
  router: createUserRouter
})

module.exports = {
  to,
  router: createUserRouter
}
