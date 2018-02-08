const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { Gravatar, MessageDesk } = require('../../../helpers/view-helper')

const { div, h1, span } = hh(h)

module.exports = function Index ({ user, flash }) {
  return div('.main.container-fluid', [
    MessageDesk(flash),
    h1([
      Gravatar({ user }),
      span('.ml-1', user.username)
    ])
  ])
}
