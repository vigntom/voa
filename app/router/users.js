const express = require('express')
const R = require('ramda')
const validator = require('validator')
const paginate = require('express-paginate')
const User = require('../models/user')
const Poll = require('../models/poll')
const { createView } = require('../helpers/application-helper')
const usersView = require('../assets/javascript/users')
const routing = require('../../lib/routing')
const mailer = require('../../lib/mailer')

const renderer = res => page => res.render('application', page)
const defaultParams = [
  'username',
  'email',
  'password',
  'passwordConfirmation',
  'emailProtected'
]

const userParams = R.pick(defaultParams)

const view = {
  index (options) {
    const page = usersView.index(options)
    return createView({ title: 'Users', options, page })
  },

  show (options) {
    const page = usersView.show(options)
    return createView({ title: 'Show Users', options, page })
  },

  new (options) {
    const page = usersView.new(options)
    return createView({ title: 'Signup', options, page })
  },

  edit (options) {
    const page = usersView.edit(options)
    return createView({ title: 'Edit User', options, page })
  }
}

const actions = {
  index (req, res, next) {
    const q = routing.query
    const sort = mkSortArg(req.query)
    const cond = !(req.session.user && req.session.user.admin)
    const query = q.unprotected(cond, q.search('username', req.query.q))
    const pollQuery = q.unrestricted(cond, q.search('name', req.query.q))

    function mkSortArg ({ s, o }) {
      const order = (o === 'asc') ? 'asc' : 'desc'

      if (s === 'joined') { return { activatedAt: order } }
      if (s === 'polls') { return { polls: order } }

      return {}
    }

    function sortMenuItem ({ s, o }) {
      if (s === 'joined') {
        if (o === 'asc') { return 'Least recently joined' }
        return 'Most recently joined'
      }

      if (s === 'polls') {
        if (o === 'asc') { return 'Fewest polls' }
        return 'Most polls'
      }

      return 'Best match'
    }

    return User.count(query)
      .then(usersCount => {
        if (req.skip >= usersCount) {
          req.skip = req.skip - req.query.limit
          if (req.skip < 0) req.skip = 0
          res.locals.paginate.page = res.locals.paginate.page - 1
        }

        return usersCount
      })
      .then(usersCount => {
        return Promise.all([
          User.find(query).sort(sort).limit(req.query.limit).skip(req.skip).lean(),
          usersCount,
          Poll.count(pollQuery)
        ])
      })
      .then(([users, usersCount, pollsCount]) => {
        const pageCount = Math.ceil(usersCount / req.query.limit)

        res.locals.users = users
        res.locals.pageCount = pageCount
        res.locals.usersCount = usersCount
        res.locals.pollsCount = pollsCount
        res.locals.pages = paginate.getArrayPages(req)(5, pageCount, req.query.page)
        res.locals.menuItem = sortMenuItem(req.query)
        res.locals.query = req.query

        req.session.state = { users: req.originalUrl }

        renderer(res)(view.index(res.locals))
      })
      .catch(next)
  },

  show (req, res, next) {
    const id = req.params.id
    const q = routing.query
    const query = q.search('name', req.query.q)

    if (!validator.isMongoId(id)) { return next('route') }

    return User.findById(id).populate({
      path: 'pollList',
      match: query
    }).lean()
      .then(user => {
        res.locals.user = user
        res.locals.userQuery = req.query
        renderer(res)(view.show(res.locals))
      })
      .catch(next)
  },

  new (req, res) {
    res.locals.user = new User()
    return renderer(res)(view.new(res.locals))
  },

  create (req, res, next) {
    const user = new User(userParams(req.body))

    return user.save((err, who) => {
      if (err && err.errors) {
        res.locals.user = user
        res.locals.errors = err.errors
        return renderer(res)(view.new(res.locals))
      }

      if (err) { return next(err) }

      mailer.accountActivation(who, (err, info) => {
        if (err) { return next(err) }
      })

      req.session.flash = { info: 'Please check your email to activate account.' }
      return res.redirect('/')
    })
  },

  edit (req, res, next) {
    const id = req.params.id

    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    if (req.session.user._id !== req.params.id) {
      return res.redirect('/')
    }

    return User.findById(id)
      .then(user => {
        res.locals.user = user
        renderer(res)(view.edit(res.locals))
      })
      .catch(next)
  },

  update (req, res, next) {
    const id = req.params.id

    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    if (req.session.user._id !== req.params.id) {
      return res.redirect('/')
    }

    function updateUser (err, user) {
      if (err) { return next(err) }
      const isPassword = x => x === 'password' || x === 'passwordConfirmation'
      const params = R.compose(
        R.pickBy((val, key) => !(!val && isPassword(key))),
        userParams
      )

      user.set(params(req.body))
      user.save((err) => {
        if (err && err.errors) {
          res.locals.user = user
          res.locals.errors = err.errors
          return renderer(res)(view.edit(res.locals))
        }

        if (err) { return next(err) }

        req.session.flash = { success: 'Profile updated' }
        return res.redirect(`/users/${user.id}/edit`)
      })
    }

    return User.findById(id, updateUser)
  },

  delete (req, res, next) {
    const id = req.params.id
    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    if (!req.session.user.admin) {
      return res.redirect('/')
    }

    return Poll.updateMany({ author: id }, { $set: { restricted: true } })
      .then(() => User.findByIdAndRemove(id))
      .then(user => {
        req.session.flash = { success: `User '${user.username}' is deleted` }
        return User.findOne({ username: 'neither' }).lean()
      })
      .then(neither => {
        return Poll.movePolls(id, neither._id)
      })
      .then(() => {
        return res.redirect(req.session.state.users)
      })
      .catch(next)
  }
}

function createUserRouter () {
  const to = routing.create(actions, view)

  const router = express.Router()

  router.get('/', to('index'))
  router.get('/new', to('new'))
  router.get('/:id', to('show'))
  router.get('/:id/edit', to('edit'))

  router.post('/', to('create'))
  router.patch('/:id', to('update'))
  router.delete('/:id', to('delete'))

  return { to, router }
}

module.exports = createUserRouter()
