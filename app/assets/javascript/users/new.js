const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const SignUp = require('./signup')
const { ErrorMsg } = require('../../../helpers/view-helper')

const { div, h1 } = hh(h)

module.exports = function New (params) {
  return div('.main', [
    h1('.page-header', 'Sign up'),
    div('.d-flex.justify-content-center', [
      div('.w-50', [
        ErrorMsg(params.errors),
        SignUp(params)
      ])
    ])
  ])
}
