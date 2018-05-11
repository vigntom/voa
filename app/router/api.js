const R = require('ramda')
const express = require('express')
const validator = require('validator')
const Option = require('../models/option')
const Poll = require('../models/poll')
const Vote = require('../models/vote')
const routing = require('../../lib/routing')
const log = require('../../lib/logger')

const actions = {
  poll: {
    show (req, res, next) {
      const id = req.params.id

      if (!validator.isMongoId(id)) {
        return res.json({ error: "Request param doesn't look like mongoId" })
      }

      return Poll.findById(id)
        .populate('author', 'username')
        .populate({ path: 'options', populate: { path: 'votes' } })
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
      const { pollId } = req.params
      const { name, description } = req.body

      Poll.findById(pollId)
        .then(poll => {
          return Option.create({ poll: poll._id, name, description })
        })
        .then(result => {
          return res.json({ success: true })
        })
        .catch(err => {
          return res.json({ success: false, err })
        })
    }
  }
}

function createRouter () {
  const router = express.Router()

  router.get('/poll/:id', actions.poll.show)

  router.post('/option/:pollId', actions.option.create)
  router.post('/vote/:pollId/:optionId', actions.vote.create)

  return { router }
}

function summVotes (poll) {
  const result = Object.assign({}, poll)
  console.log(poll)

  result.options = poll.options.map(x => {
    const y = Object.assign({}, x)
    y.votes = x.votes.length

    return y
  })

  console.log('result: ', result)

  return result
}

module.exports = createRouter()
