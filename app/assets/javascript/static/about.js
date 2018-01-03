const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { div, h1 } = hh(h)

module.exports = function About () {
  return div('.main', [
    h1('.page-header', 'About page')
  ])
}
