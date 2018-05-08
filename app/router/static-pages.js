const User = require('../models/user')
const template = require('../view/static')
const routing = require('../../lib/routing')
const voaView = require('../../lib/view')

const data = {
  home: { title: 'Home' },
  about: { title: 'About' },
  contact: { title: 'Contact' }
}

const view = voaView.bind(template, data)

const actions = {
  home (req, res) {
    res.locals.user = new User()
    return res.render('application', view.home(res.locals))
  }
}

module.exports = {
  to: routing.create(actions, view)
}
