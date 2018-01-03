const { fill } = require('../helpers/application-helper')
const users = require('../assets/javascript/users')

module.exports = {
  index (params) {
    const title = 'List of Users'
    return fill(title, users.index(params))
  },

  show (params) {
    const title = 'Show User'
    return fill(title, users.show(params))
  },

  new (params) {
    const title = 'Sign up'
    return fill(title, users.new(params))
  }
}
