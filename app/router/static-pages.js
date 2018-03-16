const { createView } = require('../helpers/application-helper')
const staticView = require('../assets/javascript/static')
const User = require('../models/user')
const routing = require('../../lib/routing')

const view = {
  home (options) {
    return createView({ title: 'Home', options, page: staticView.home(options) })
  },

  about (options) {
    return createView({ title: 'About', options, page: staticView.about(options) })
  },

  contact (options) {
    return createView({ title: 'Contact', options, page: staticView.contact(options) })
  }
}

const actions = {
  home (req, res) {
    res.locals.user = new User()
    return res.render('application', view.home(res.locals))
  }
}

module.exports = {
  to: routing.create(actions, view)
}
