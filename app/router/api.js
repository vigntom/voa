const express = require('express')
const validator = require('validator')
const Poll = require('../models/poll')

const actions = {
  poll: {
    show (req, res, next) {
      const id = req.params.id

      if (!validator.isMongoId(id)) {
        return res.json({ error: "Request param doesn't look like mongoId" })
      }

      return Poll.findById(id).populate('author', 'username').lean()
        .then(poll => {
          const result = Object.assign({}, poll)

          result.choices = poll.choices.map(x => {
            const y = Object.assign({}, x)
            y.votes = x.votes.length

            return y
          })

          res.json(result)
        })
        .catch(err => {
          res.json(err.message)
        })
    }
  }
}

function createRouter () {
  const router = express.Router()

  router.get('/poll/:id', actions.poll.show)

  return { router }
}

module.exports = createRouter()
