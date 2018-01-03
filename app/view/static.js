const { fill } = require('../helpers/application-helper')
const staticView = require('../assets/javascript/static')

module.exports = {
  home (params) {
    const title = 'Home'
    return fill(title, staticView.home(params))
  },

  about (params) {
    const title = 'About'
    return fill(title, staticView.about(params))
  },

  contact (params) {
    const title = 'Sign up'
    return fill(title, staticView.contact(params))
  }
}
