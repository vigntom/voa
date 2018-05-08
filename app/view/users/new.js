const { div, h1 } = require('../helpers/hyperscript')
const SignUp = require('./signup')

module.exports = function New (params) {
  return div('.main.container.mt-3.mb-5', [
    div('.w-50.m-auto', [
      h1('.page-header', 'Sign up'),
      SignUp(params)
    ])
  ])
}
