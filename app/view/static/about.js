const { div, h1 } = require('../helpers/hyperscript')

module.exports = function About () {
  return div('.main', [
    h1('.page-header', 'About page')
  ])
}
