const modal = require('../modal')
const h = require('../../helpers/hyperscript')
const OptionsGroupBlock = require('../options-group')

const { div, h2 } = h

function Options ({ poll, csrfToken, errors }) {
  return div('.mt-3', [
    div('.voa-item.clearfix', [
      div('.choice-group', { 'data-poll-id': poll._id }, OptionsGroupBlock({ poll })),
      modal.Delete({ poll, csrfToken })
    ])
  ])
}

function Page (options) {
  return div('.container', [
    div('.border-bottom', h2('Options')),
    Options(options)
  ])
}

module.exports = Page
