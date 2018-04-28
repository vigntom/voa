const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const Settings = require('./settings')

const { div, h2 } = hh(h)

module.exports = function New (options) {
  return div('.main.container.mt-3', [
    div('.voa-board.w-75.m-auto', [
      w.MessageDesk(options.flash),
      div('.voa-item', [ h2('Create a new poll') ]),
      Settings(options)
    ])
  ])
}
