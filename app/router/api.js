const express = require('express')
const validator = require('validator')
const Poll = require('../models/poll')
const routing = require('../../lib/routing')

const actions = {
  poll: {
    show (req, res, next) {
      const id = req.params.id

      if (!validator.isMongoId(id)) {
        return res.json({ error: "Request param doesn't look like mongoId" })
      }

      return Poll.findById(id).populate('author', 'username').lean()
        .then(poll => {
          res.json(summVotes(poll))
        })
        .catch(err => {
          res.json(err.message)
        })
    },

    update (req, res, next) {
      const { id, choice } = req.params
      const voter = routing.voterQuery(req.session)

      if (!validator.isMongoId(id)) {
        return res.json({ error: "Request poll id doesn't look like mongoId" })
      }

      Poll.pushVote(id, choice, voter)
        .then(poll => {
          res.json({ result: 'ok' })
        }).catch(err => {
          res.json({ error: err.message, result: 'error' })
        })
    }
  }
}

function createRouter () {
  const router = express.Router()

  router.get('/poll/:id', actions.poll.show)
  router.patch('/poll/:id/:choice', actions.poll.update)

  return { router }
}

function summVotes (poll) {
  const result = Object.assign({}, poll)

  result.choices = poll.choices.map(x => {
    const y = Object.assign({}, x)
    y.votes = x.votes.length

    return y
  })

  return result
}

module.exports = createRouter()
