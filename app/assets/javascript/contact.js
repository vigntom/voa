const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { div, h1 } = hh(h)

module.exports = function Contact () {
  return div('.main', [
    h1('Contact page')
  ])
}
