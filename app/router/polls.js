const express = require('express')
const routing = require('../../lib/routing')
const v = require('../helpers/application-helper')
const template = require('../assets/javascript/polls')
const Poll = require('../models/poll')
const User = require('../models/user')
const paginate = require('express-paginate')
const log = require('../../lib/logger.js')

const data = {
  index: { title: 'Polls' },
  show: { title: 'Show polls' },
  new: { title: 'New poll' },
  edit: { title: 'Edit poll' }
}

const view = v.initViews(template, data)

const actions = {
  index (req, res, next) {
    const sort = mkSortArg(req.query)

    function mkSortArg ({ s, o }) {
      if (o !== 'asc' && o !== 'desc') {
        log.warn('Unkown polls query option: ', o)
        return {}
      }

      if (s === 'stars') { return { stargazers: o } }
      if (s === 'updated') { return { updatedAt: o } }
    }

    function sortMenuItem ({ s, o }) {
      if (s === 'stars' && o === 'desc') { return 'Most stars' }
      if (s === 'stars' && o === 'asc') { return 'Fewest stars' }
      if (s === 'updated' && o === 'desc') { return 'Recently updated' }
      if (s === 'updated' && o === 'asc') { return 'Least recently updated' }
      return 'Best match'
    }

    return Promise.all([
      Poll.find().sort(sort).limit(req.query.limit).skip(req.skip).populate('author').lean(),
      Poll.count(),
      User.count()
    ]).then(([polls, pollsCount, usersCount]) => {
      const pageCount = Math.ceil(pollsCount / req.query.limit)

      res.locals.polls = polls
      res.locals.pageCount = pageCount
      res.locals.pollsCount = pollsCount
      res.locals.usersCount = usersCount
      res.locals.pages = paginate.getArrayPages(req)(7, pageCount, req.query.page)
      res.locals.menuItem = sortMenuItem(req.query)

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
    console.log('body: ', req.body)

    res.redirect('/polls/new')
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

module.exports = createRouter()
