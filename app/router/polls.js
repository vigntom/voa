const express = require('express')
const R = require('ramda')
const paginate = require('express-paginate')
const routing = require('../../lib/routing')
const voaView = require('../../lib/view')
const template = require('../view/polls')
const Poll = require('../models/poll')
const Option = require('../models/option')
const Vote = require('../models/vote')
const User = require('../models/user')

const data = {
  index: { title: 'Polls' },
  show: { title: 'Show polls' },
  new: { title: 'New poll' },
  settings: { title: 'Settings' }
}

const view = voaView.bind(template, data)

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

    return res.render('application', view.new(res.locals))
  },

  create (req, res, next) {
    const user = req.session.user

    if (!user) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/')
    }

    const permit = R.pick(['name', 'description'])
    const params = R.merge({ author: user._id }, permit(req.body))

    Poll.create(params)
      .then(poll => {
        return res.redirect(`/ui/${user.username}/${poll.name}`)
      })
      .catch(err => {
        if (err.errors) {
          res.locals.poll = params
          res.locals.errors = err.errors
          res.locals.author = user.username

          return res.render('application', view.new(res.locals))
        }
      })
  },

  show (req, res, next) {
    const author = req.params.author
    const pollname = req.params.pollname
    const userId = req.session.user ? req.session.user._id : req.session.id
    const isVoted = R.compose(R.contains(userId), R.map(R.prop('voter')))

    return User.findOne({ username: author })
      .then(user => {
        return Poll.findOne({ author: user._id, name: pollname })
          .populate('author', 'username')
          .populate('votes', 'voter')
          .populate({ path: 'options', populate: { path: 'votes' } })
          .lean()
      })
      .then((poll) => {
        res.locals.poll = poll
        res.locals.isVoted = isVoted(poll.votes)
        res.locals.canUpdate = isOwner(req.session.user, poll.author)
        res.locals.isAuthenticated = !!req.session.user

        res.render('application', view.show(res.locals))
      })
      .then(poll => {
      })
      .catch(next)
  },

  settings (req, res, next) {
    const { author, pollname } = req.params
    const current = req.session.user

    if (!current) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findOne({ author: current._id, name: pollname })
      .populate('author', 'username')
      .lean()
      .then(poll => {
        if (poll.author.username !== author) {
          req.session.flash = { danger: 'Insufficient privileges' }
          return res.redirect(`/ui/${author}/${pollname}`)
        }

        res.locals.poll = poll
        res.locals.author = poll.author.username
        res.locals.settings = true
        // res.locals.activePage = template.pollSettings

        return res.render('application', view.settings(res.locals))
      })
      .catch(next)
  },

  options (req, res, next) {
    const { author, pollname } = req.params
    const current = req.session.user

    if (!current) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findOne({ author: current._id, name: pollname })
      .populate('author', 'username')
      .populate('options')
      .lean()
      .then(poll => {
        if (poll.author.username !== author) {
          req.session.flash = { danger: 'Insufficient privileges' }
          return res.redirect(`/ui/${author}/${pollname}`)
        }

        res.locals.poll = poll
        res.locals.author = poll.author.username
        res.locals.options = true
        // res.locals.activePage = template.pollOptions

        return res.render('application', view.settings(res.locals))
      })
  },

  contributors (req, res, next) {
  },

  delete (req, res, next) {
    const { author, pollname } = req.params
    const current = req.session.user

    if (!current) {
      req.session.flash = { danger: 'Please log in' }
      return res.redirect('/login')
    }

    return Poll.findOne({ author: current._id, name: pollname })
      .populate('author', 'username')
      .then(poll => {
        if (poll.author.username !== author) {
          req.session.flash = { danger: "You can't modify this poll" }
          return res.redirect(`/ui/${author}/${pollname}`)
        }

        return poll.remove()
      })
      .then(poll => {
        req.session.flash = { success: 'Poll is deleted' }
        return res.redirect(`/ui/${author}`)
      })
      .catch(next)
  },

  update: {
    settings (req, res, next) {
      const { author, pollname } = req.params
      const current = req.session.user

      if (!current) {
        req.session.flash = { danger: 'Please log in' }
        return res.redirect('/login')
      }

      return Poll.findOne({ author: current._id, name: pollname })
        .populate('author', 'username')
        .then(poll => {
          if (!poll._id) {
            req.session.flash = { warning: 'Unknoun poll' }
            return res.redirect('/')
          }

          if (poll.author.username !== author) {
            req.session.flash = { danger: "You can't modify this poll" }
            return res.redirect(`/polls/${poll._id}`)
          }

          const params = R.pick(['name', 'description'], req.body)

          if (poll.name === params.name && poll.description === params.description) {
            return res.redirect(`/ui/${author}/${pollname}/settings`)
          }

          res.locals.poll = poll
          res.locals.author = poll.author
          res.locals.settings = true

          poll.set({ name: params.name, description: params.description })

          return poll.save()
        })
        .then(poll => {
          req.session.flash = { success: 'Poll settings updated' }
          return res.redirect(`/ui/${author}/${poll.name}/settings`)
        })
        .catch((err, poll) => {
          if (err.errors) {
            res.locals.errors = err.errors
            return res.render('application', view.settings(res.locals))
          }

          return next(err)
        })
    },

    options (req, res, next) {
      const { author, pollname } = req.params
      const current = req.session.user
      const options = req.body.options

      if (!current) {
        req.session.flash = { danger: 'Please log in' }
        return res.redirect('/login')
      }

      return Poll.findOne({ author: current._id, name: pollname })
        .populate('author', 'username')
        .then(poll => {
          if (!poll._id) {
            req.session.flash = { warning: "Can't find pool" }
            return res.redirect('/')
          }

          if (poll.author.username !== author) {
            req.session.flash = { danger: 'Insufficient privileges' }
            return res.redirect(`/ui/${author}/${pollname}/options`)
          }

          res.locals.poll = poll
          res.locals.author = poll.author
          res.locals.options = true

          return Promise.all(
            R.map(
              id => Option.findByIdAndUpdate(id, options.update[id]),
              R.keys(options.update)
            )
          ).then(() => {
            if (options.new) {
              return Option.insertMany(R.map(R.merge({ poll: poll._id }), options.new))
            }
          }).then(() => {
            if (options.remove) {
              return Promise.all(
                R.map(
                  id => Option.findByIdAndDelete(id),
                  R.keys(options.remove)
                )
              ).then(() => {
                return Promise.all(
                  R.map(
                    id => Vote.findOneAndDelete({ option: id }),
                    R.keys(options.remove)
                  )
                )
              })
            }
          }).catch(next)
        })
        .then(() => {
          req.session.flash = { success: 'Options updated' }
          return res.redirect(`/ui/${author}/${pollname}/options`)
        })
        .catch((err, poll) => {
          if (err.errors) {
            res.locals.errors = err.errors
            return res.render('application', view.settings(res.locals))
          }

          return next(err)
        })
    },

    contributors (req, res, next) {
      const { author, pollname } = req.params
      const current = req.session.user

      if (!current) {
        req.session.flash = { danger: 'Please log in' }
        return res.redirect('/login')
      }

      return res.redirect(`/ui/${author}/${pollname}/contributors`)
    },

    transfer (req, res, next) {
      const { author, pollname } = req.params
      const current = req.session.user

      if (!current) {
        req.session.flash = { danger: 'Please log in' }
        return res.redirect('/login')
      }

      return res.redirect(`/ui/${author}/${pollname}/transfer`)
    }
  }
}

function createRouter () {
  const to = routing.create(actions, view)
  const router = express.Router()

  router.get('/:author/new', to('new'))
  router.get('/:author/:pollname', to('show'))
  router.get('/:author/:pollname/settings', to('settings'))
  router.get('/:author/:pollname/options', to('options'))
  router.get('/:author/:pollname/contributors', to('contributors'))

  router.post('/:author/', to('create'))
  router.delete('/:author/:pollname', to('delete'))

  router.post('/:author/:pollname/settings', actions.update.settings)
  router.post('/:author/:pollname/options', actions.update.options)
  router.post('/:author/:pollname/contributors', actions.update.contributors)
  router.post('/:authro/:pollname/transfer', actions.update.transfer)

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
