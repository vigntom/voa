const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const SignUp = require('../users/signup')

const { div, h1 } = hh(h)

module.exports = function Home (params) {
  return div('.jumbotron.jumbotron-fluid.bg-dark-lighter.text-light', [
    div('.container-fluid', [
      div('.main.row', [
        div('.col-lg-7.align-self-center', [
          h1('.text-center', 'Welcome to the Votting Application')
        ]),
        div('.col-lg.mx-4', [
          div('.bg-light.text-dark.rounded.px-3.py-3', [ SignUp(params) ])
        ])
      ])
    ])
  ])
}
