const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { gravatarUrl } = require('../../../helpers/users-helper')

const { div, h1, image, span } = hh(h)

module.exports = function Index ({ user }) {
  return div('.main.container-fluid', [
    h1([
      image({ src: gravatarUrl(user.email), alt: user.username }),
      span('.ml-1', user.username)
    ])
  ])
}
