const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { Gravatar, MessageDesk } = require('../../../helpers/view-helper')

const { div, h1 } = hh(h)

module.exports = function Index (options) {
  return div('.main.container-fluid', [
    MessageDesk(options.flash),
    h1('.page-header', 'Polls')
  ])
}
