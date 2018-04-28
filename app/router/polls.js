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

    return Poll.findById(id).populate('author', 'username').lean()
      .then(poll => {
        // if (!poll.author._id.equals(req.session.user._id)) {
        if (!isOwner(req.session.user, poll.author)) {
          req.session.flash = { danger: "You can't modify this poll" }
          return res.redirect(`/polls/${poll._id}`)
        }

        res.locals.poll = poll
        res.locals.author = poll.author.username
        res.locals.action = {
          name: 'Update',
          method: 'patch',
          link: `/polls/${poll._id}`
        }

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

    return Poll
      .findById(id)
      .populate('author', 'username')
      .exec((err, poll) => {
        if (err) { next(err) }
        if (!poll.author.equals(req.session.user._id)) {
          req.session.flash = { danger: "You can't modify this poll" }
          return res.redirect(`/polls/${poll._id}`)
        }

        const permit = R.pick(['name', 'description', 'choices'])

        return poll
          .update(permit(req.body))
          .lean()
          .exec(err => {
            if (err && err.errors) {
              res.locals.poll = poll
              res.locals.author = poll.author.username
              res.locals.action = {
                name: 'Update',
                method: 'patch',
                link: `/polls/${poll._id}`
              }
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

function isOwner (user, author) {
  if (!user) return false
  if (!author) return false
  if (author.equals) return author.equals(user._id)
  if (author._id && author._id.equals) return author._id.equals(user._id)
  return false
}

module.exports = createRouter()
