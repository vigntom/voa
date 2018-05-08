const express = require('express')
const validator = require('validator')
const Option = require('../models/option')
const Poll = require('../models/poll')
const Vote = require('../models/vote')
const routing = require('../../lib/routing')

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
          res.json(summVotes(poll))
        })
        .catch(err => {
          res.json(err.message)
        })
    },

    choice: {
      update (req, res, next) {
        const { id, choice } = req.params
        const voter = routing.createVoter(id, choice, req.session)

        if (!validator.isMongoId(id)) {
          return res.json({ error: "Request poll id doesn't look like mongoId" })
        }

        return Vote.create(voter)
          .then(() => res.json({ success: true }))
          .catch(error => res.json({ success: false, error }))
      },

      create (req, res, next) {
        const { id } = req.params
        const { name, description } = req.body

        if (!validator.isMongoId(id)) {
          return res.json({ error: "Request poll id doesn't look like mongoId" })
        }

        Poll.findById(id)
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
}

function createRouter () {
  const router = express.Router()

  router.get('/poll/:id', actions.poll.show)
  router.patch('/poll/:id/choice/:choice', actions.poll.choice.update)
  router.post('/poll/:id/choice', actions.poll.choice.create)

  return { router }
}

function summVotes (poll) {
  const result = Object.assign({}, poll)

  result.options = poll.options.map(x => {
    const y = Object.assign({}, x)
    y.votes = x.votes.length

    return y
  })

  return result
}

module.exports = createRouter()
