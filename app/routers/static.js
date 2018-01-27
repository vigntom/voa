const { fill } = require('../helpers/application-helper')
const staticView = require('../assets/javascript/static')
const User = require('../models/user')
const routing = require('../../lib/routing')

const view = {
  home (csrfToken) {
    const params = { user: new User(), csrfToken }
    return fill({ title: 'Home', page: staticView.home(params) })
  },

  about () {
    return fill({ title: 'About', page: staticView.about() })
  },

  contact () {
    return fill({ title: 'Contact', page: staticView.contact() })
  }
}

const actions = {
}

module.exports = {
  to: routing.create(actions, view)
}
