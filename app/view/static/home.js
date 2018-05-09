const SignUp = require('../users/signup')
const { MessageDesk } = require('../helpers')
const { div, h1 } = require('../helpers/hyperscript')

module.exports = function Home (params) {
  return div('.jumbotron.jumbotron-fluid.bg-dark-lighter.text-light', [
    MessageDesk(params.flash),
    div('.container-fluid.my-5', [
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