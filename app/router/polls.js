const express = require('express')
const R = require('ramda')
const validator = require('validator')
const routing = require('../../lib/routing')
const v = require('../helpers/application-helper')
const template = require('../assets/javascript/polls')
const Poll = require('../models/poll')
const User = require('../models/user')
const paginate = require('express-paginate')
// const log = require('../../lib/logger.js')

const data = {
  index: { title: 'Polls' },
  show: { title: 'Show polls' },
  new: { title: 'New poll' },
  edit: { title: 'Edit poll' }
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

    return Promise.all([
      Poll.find(query).sort(sort).limit(req.query.limit).skip(req.skip).populate('author').lean(),
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

    return res.render('application', view.new(res.locals))
  },

  create (req, res, next) {
    const user = req.session.user

    if (!user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/')
    }

    const params = R.merge({ author: user._id }, pollParams(req.body))
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
          return res.render('application', view.new(res.locals))
        }

        return next(err)
      })
  },

  show (req, res, next) {
    const id = req.params.id
    if (!validator.isMongoId(id)) { return next() }

    const findPoll = Poll.findById(id).populate('author', 'username').lean()
    const findVoter = Poll.findVoter({ id, voter: routing.voterQuery(req.session) }).lean()

    return Promise.all([findPoll, findVoter])
      .then(([poll, voter]) => {
        res.locals.poll = poll
        res.locals.isVoted = voter.length > 0

        res.render('application', view.show(res.locals))
      })
      .then(poll => {
      })
      .catch(next)
  },

  edit (req, res, next) {
    const id = req.params.id

    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findById(id).lean()
      .then(poll => {
        if (poll.author !== req.session.user._id) {
          req.session.flash = { danger: "You can't modify this poll" }
          return res.redirect(`/polls/${poll._id}`)
        }

        res.locals.poll = poll
        return res.render('application', view.edit(res.locals))
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

    return Poll.findById(id, (err, poll) => {
      if (err) { next(err) }
      if (poll.author !== req.session.user._id) {
        req.session.flash = { danger: "You can't modify this poll" }
        return res.redirect(`/polls/${poll._id}`)
      }

      poll.set(pollParams(req.body))

      return poll.save((err) => {
        if (err && err.errors) {
          res.locals.poll = poll
          res.locals.errors = err.errors
          return res.render('application', view.edit(res.locals))
        }

        if (err) { return next(err) }

        req.session.flash = { success: 'Poll updated' }

        return res.redirect(`/polls/${poll._id}`)
      })
    })
  },

  delete (req, res, next) {
    const id = req.params.id

    if (!validator.isMongoId(id)) { return next() }

    if (!req.session.user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findById(id, (err, poll) => {
      if (err) { return next(err) }
      if (poll.author !== req.session.user._id) {
        req.session.flash = { danger: "You can't modify this poll" }
        return res.redirect(`/polls/${poll._id}`)
      }

      return poll.remove(err => {
        if (err) { return next(err) }
        req.session.flash = { success: `Poll is deleted` }
        return res.redirect('/polls/')
      })
    })
  }
}

function createRouter () {
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

function pollParams (params) {
  const fields = ['name', 'description', 'choices']
  const pickOrBlank = R.compose(
    R.pick(fields),
    R.merge(R.__, params),
    R.mergeAll,
    R.map(x => ({ [x]: '' }))
  )

  return pickOrBlank(fields)
}

module.exports = createRouter()
