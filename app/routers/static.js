const { fill } = require('../helpers/application-helper')
const staticView = require('../assets/javascript/static')
const User = require('../models/user')

module.exports = {
  home: () => (req, res) => {
    const title = 'Home'
    const params = {
      user: req.app.locals.user || new User(),
      errors: req.app.locals.errors,
      csrfToken: req.csrfToken()
    }
    const view = fill({ title, page: staticView.home(params) })

    return res.render('application', view)
  },

  about: () => (req, res) => {
    const title = 'About'
    const view = fill({ title, page: staticView.about() })
    return res.render('application', view)
  },

  contact: () => (req, res) => {
    const title = 'Contact'
    const view = fill({ title, page: staticView.contact() })
    return res.render('application', view)
  }
}
