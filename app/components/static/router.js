const express = require('express')
const about = require('./about')
const help = require('./help')

function staticPagesRouter (layout) {
  const router = express.Router()

  router.get('/about', (req, res) => {
    res.send(layout(about))
  })

  router.get('/help', (req, res) => {
    res.send(layout(help))
  })

  return router
}

module.exports = staticPagesRouter
