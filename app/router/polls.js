const express = require('express')
const R = require('ramda')
const validator = require('validator')
const routing = require('../../lib/routing')
const v = require('../helpers/application-helper')
const template = require('../assets/javascript/polls')
const Poll = require('../models/poll')
const User = require('../models/user')
const paginate = require('express-paginate')

const data = {
  index: { title: 'Polls' },
  show: { title: 'Show polls' },
  new: { title: 'New poll' },
  settings: { title: 'Settings' },
  choices: { title: 'Choices' }
}

const view = v.initViews(template, data)

const actions = {
  index (req, res, next) {
    const q = routing.query
    const sort = mkSortArg(req.query)
    const cond = !(req.session.user && req.session.user.admin)
    const query = q.unrestricted(cond, q.search('name', req.query.q))
    const userQuery = q.unprotected(cond, q.search('username', req.query.q))

    function mkSortArg ({ s, o }) {
      const order = (o === 'asc') ? 'asc' : 'desc'

      if (s === 'stars') { return { stargazers: order } }
      if (s === 'updated') { return { updatedAt: order } }

      return {}
    }

    function sortMenuItem ({ s, o }) {
      if (s === 'stars' && o === 'desc') { return 'Most stars' }
      if (s === 'stars' && o === 'asc') { return 'Fewest stars' }
      if (s === 'updated' && o === 'desc') { return 'Recently updated' }
      if (s === 'updated' && o === 'asc') { return 'Least recently updated' }
      return 'Best match'
    }

    const findAll = Poll
      .find(query)
      .sort(sort)
      .limit(req.query.limit)
      .skip(req.skip)
      .populate('author')
      .lean()

    return Promise.all([
      findAll,
      Poll.count(query),
      User.count(userQuery)
    ]).then(([polls, pollsCount, usersCount]) => {
      const pageCount = Math.ceil(pollsCount / req.query.limit)

      res.locals.polls = polls
      res.locals.pageCount = pageCount
      res.locals.pollsCount = pollsCount
      res.locals.usersCount = usersCount
      res.locals.pages = paginate.getArrayPages(req)(7, pageCount, req.query.page)
      res.locals.menuItem = sortMenuItem(req.query)
      res.locals.query = req.query

      return res.render('application', view.index(res.locals))
    })
      .catch(next)
  },

  new (req, res) {
    const user = req.session.user

    if (!user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/')
    }

    res.locals.poll = new Poll({ author: user._id })
    res.locals.author = user.username
    res.locals.action = {
      link: '/polls',
      name: 'Create'
    }

    return res.render('application', view.new(res.locals))
  },

  create (req, res, next) {
    const user = req.session.user

    if (!user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/')
    }

    const permit = R.pick(['name', 'description', 'choices'])
    const params = R.merge({ author: user._id }, permit(req.body))
    const poll = new Poll(params)

    return poll.save()
      .then(poll => {
        res.redirect(`/polls/${poll._id}`)
      })
      .catch(err => {
        if (err.errors) {
          res.locals.poll = poll
          res.locals.errors = err.errors
          res.locals.author = req.session.user.username
          res.locals.action = {
            link: '/polls',
            name: 'Create'
          }

          return res.render('application', view.new(res.locals))
        }

        return next(err)
      })
  },

  show (req, res, next) {
    const id = req.params.id
    if (!validator.isMongoId(id)) { return next() }

    const findPoll = Poll.findById(id).populate('author', 'username').lean()
    const findVoter = Poll.findVoter({
      id,
      voter: routing.voterQuery(req.session)
    }).lean()

    return Promise.all([findPoll, findVoter])
      .then(([poll, voter]) => {
        res.locals.poll = poll
        res.locals.isVoted = voter.length > 0
        res.locals.canUpdate = isOwner(req.session.user, poll.author)
        res.locals.isAuthenticated = !!req.session.user

        res.render('application', view.show(res.locals))
      })
      .then(poll => {
      })
      .catch(next)
  },

  settings (req, res, next) {
    const id = req.params.id

    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findById(id).populate('author', 'username').lean()
      .then(poll => {
        if (!isOwner(req.session.user, poll.author)) {
          req.session.flash = { danger: "You can't modify this poll" }
          return res.redirect(`/polls/${poll._id}`)
        }

        res.locals.poll = poll
        res.locals.author = poll.author.username
        res.locals.settings = true

        return res.render('application', view.settings(res.locals))
      })
      .catch(next)
  },

  delete (req, res, next) {
    const id = req.params.id

    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findById(id)
      .populate('author', 'username')
      .then(poll => {
        if (!poll.author._id.equals(req.session.user._id)) {
          req.session.flash = { danger: "You can't modify this poll" }
          return res.redirect(`/polls/${poll._id}`)
        }

        return poll.remove()
      })
      .then(poll => {
        req.session.flash = { success: 'Poll is deleted' }
        return res.redirect(`/users/${poll.author._id}`)
      })
      .catch(next)
  },

  update: {
    settings (req, res, next) {
      const id = req.params.id

      if (!validator.isMongoId(id)) { return next() }

      if (!req.session.user) {
        req.session.flash = { danger: 'Please log in' }
        return res.redirect('/login')
      }

      return Poll.findById(id)
        .populate('author', 'username')
        .then(poll => {
          if (!poll._id) {
            req.session.flash = { warning: 'Unknoun poll' }
            return res.redirect('/')
          }

          if (!poll.author._id.equals(req.session.user._id)) {
            req.session.flash = { danger: "You can't modify this poll" }
            return res.redirect(`/polls/${poll._id}`)
          }

          const params = R.pick(['name', 'description'], req.body)

          if (poll.name === params.name && poll.description === params.description) {
            return res.redirect(`/polls/${poll._id}/settings`)
          }

          res.locals.poll = poll
          res.locals.author = poll.author

          return poll.update(
            { $set: { name: params.name, description: params.description } }
          ).then(() => poll)
        })
        .then(poll => {
          req.session.flash = { success: 'Poll settings updated' }
          return res.redirect(`/polls/${poll._id}/settings`)
        })
        .catch((err, poll) => {
          if (err.errors) {
            res.locals.errors = err.errors
            return res.render('application', view.settings(res.locals))
          }
        })
    },

    choices (req, res, next) {
    },

    transfer (req, res, next) {

    }
  }
}

function createRouter () {
  const to = routing.create(actions, view)
  const router = express.Router()

  router.get('/', to('index'))
  router.get('/new', to('new'))
  router.get('/:id', to('show'))

  // router.get('/:id/edit', to('edit'))
  router.get('/:id/settings', to('settings'))
  router.get('/:id/choices', to('choices'))

  router.post('/', to('create'))
  router.delete('/:id', to('delete'))

  // router.patch('/:id', to('update'))
  router.post('/:id/settings', actions.update.settings)
  router.post('/:id/choices', actions.update.choices)
  router.post('/:id/transfer', actions.update.transfer)

  return { to, router }
}

function isOwner (user, author) {
  if (!user) return false
  if (!author) return false
  if (author.equals) return author.equals(user._id)
  if (author._id && author._id.equals) return author._id.equals(user._id)
  return false
}

module.exports = createRouter()
