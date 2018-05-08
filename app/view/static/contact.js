const { div, h1 } = require('../helpers/hyperscript')

module.exports = function Contact () {
  return div('.main', [
    h1('.page-header', 'Contact page')
  ])
}
