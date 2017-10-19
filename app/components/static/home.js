const h = require('hyperscript')
const { div, h1 } = require('hyperscript-helpers')(h)

module.exports = {
  title: 'Home',
  content: div('.home-page',
    h1('Home page')
  )
}
