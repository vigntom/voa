const express = require('express')
const { fullTitle } = require('../app/helpers/application-helper')
const createAssetsList = require('../lib/assets-list')
const layout = require('../app/assets/javascript/layout')
const home = require('../app/assets/javascript/home')
const about = require('../app/assets/javascript/about')
const contact = require('../app/assets/javascript/contact')
const { renderToString } = require('react-dom/server')

const router = express.Router()

function createLayoutFills (env) {
  return ({ title, content }) => ({
    env,
    title: fullTitle(title),
    assets: createAssetsList(env),
    content: renderToString(layout({ page: content }))
  })
}

function getTo (route, page) {
  return router.get(route, (req, res) => {
    res.render('application', page)
  })
}

function componentsRouter (config, log) {
  const fill = createLayoutFills(config.env)

  router.use((req, res, next) => {
    log.debug(req.method, req.url)
    next()
  })

  getTo('/', fill({ title: 'Home', content: home }))
  getTo('/about', fill({ title: 'About', content: about }))
  getTo('/contact', fill({ title: 'Contact', content: contact }))

  return router
}

module.exports = componentsRouter
