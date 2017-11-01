const h = require('hyperscript')
const hh = require('hyperscript-helpers')

const { div, h1, h2, a, hr } = hh(h)

module.exports = div('.container',
  div('.jumbotron', [
    h1('Welcome to the Votting Application'),
    h2('This is the home page'),
    hr('.my-4'),
    a('.btn.btn-lg.btn-primary', { href: '#' }, 'Sign up now!')
  ])
)
