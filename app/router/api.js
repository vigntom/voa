const R = require('ramda')
const express = require('express')
const Option = require('../models/option')
const Poll = require('../models/poll')
const Vote = require('../models/vote')
const routing = require('../../lib/routing')
const log = require('../../lib/logger')
const OptionsGroupBlock = require('../view/polls/options-group')
const VoteDesk = require('../view/polls/show/vote-desk')
const { MessageDesk } = require('../view/helpers')

function checkOwner (user) {
  return poll => {
    if (!poll.author.equals(user._id)) {
      return Promise.reject(new Error('Permisssion denied'))
    }

    return poll
  }
}

function sendOptionGroup (req, res, freeChoice) {
  const flash = MessageDesk({ success: 'Options updated' }).outerHTML

  function content (poll) {
    if (freeChoice) {
      const isVoted = false
      const isAuthenticated = !!req.session.user

      return VoteDesk({ poll, isVoted, isAuthenticated })
    }

    return OptionsGroupBlock({ poll })
  }

  return poll => {
    const sortByCreation = R.sortBy(R.prop('createdAt'))
    const pollSorted = R.merge(poll, { options: sortByCreation(poll.options) })

    return res.json({
      success: true,
      content: content(pollSorted).outerHTML,
      flash
    })
  }
}

const actions = {
  poll: {
    show (req, res, next) {
      const id = req.params.id

      return Poll.findById(id)
        .populate('author', 'username')
        .populateOptionsAndVotes()
        .lean()
        .then(poll => {
          const result = R.clone(poll)

          result.options = R.map(opt => {
            const result = R.clone(opt.toObject())
            result.votes = opt.votes.length
            return result
          }, poll.options)

          return res.json(result)
        })
        .catch(err => {
          return res.json(err.message)
        })
    }
  },

  vote: {
    create (req, res, next) {
      const { pollId, optionId } = req.params

      return Option.findById(optionId)
        .then(opt => {
          if (!opt.poll.equals(pollId)) {
            log.warn('Poll and option mismatch')
            return Promise.reject(new Error('Permisssion denied'))
          }

          const voter = routing.createVoter(opt.poll._id, opt._id, req.session)
          return Vote.create(voter)
        })
        .then(() => res.json({ success: true }))
        .catch(error => res.json({ success: false, error }))
    }
  },

  option: {
    create (req, res, next) {
      const { poll, name, description, freeChoice } = req.body

      Option.create({ poll, name, description })
        .then(() => Poll.findById(poll)
          .populate('author', 'username')
          .populate('votes', 'voter')
          .populateOptionsAndVotes()
          .lean()
        )
        .then(sendOptionGroup(req, res, freeChoice))
        .catch(err => {
          log.error(err)
          return res.json({ success: false, errors: err.errors })
        })
    },

    update (req, res, next) {
      const id = req.params.optionId
      const { poll, description } = req.body
      const name = req.body.name.trim()

      if (!req.session.user) {
        return res.json({ success: false, err: 'Not authenticated' })
      }

      return Poll.findById(poll)
        .then(checkOwner(req.session.user))
        .then(() => Option.findByIdAndUpdate(
          id,
          { name, description },
          { runValidators: true }
        ))
        .then(option => Poll.findById(option.poll).populateOptions())
        .then(sendOptionGroup(req, res))
        .catch(err => {
          log.error(err)
          res.json({ success: false, errors: err.errors })
        })
    },

    delete (req, res, next) {
      const id = req.params.optionId
      const { poll } = req.body

      if (!req.session.user) {
        return res.json({ success: false, err: 'Not authenticated' })
      }

      Poll.findById(poll)
        .then(checkOwner(req.session.user))
        .then(() => Option.findByIdAndDelete(id))
        .then(option => {
          return Vote.remove({ option: id })
            .then(() => option)
        })
        .then(option => Poll.findById(option.poll).populateOptions())
        .then(sendOptionGroup(req, res))
        .catch(err => {
          log.error(err)
          return res.json({ success: false })
        })
    }
  }
}

function createRouter () {
  const router = express.Router()

  router.get('/poll/:id', actions.poll.show)

  router.post('/option', actions.option.create)
  router.post('/vote/:pollId/:optionId', actions.vote.create)

  router.patch('/option/:optionId', actions.option.update)
  router.delete('/option/:optionId', actions.option.delete)
  return { router }
}

module.exports = createRouter()
