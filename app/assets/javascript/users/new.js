const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const SignUp = require('./signup')
const { ErrorMsg } = require('../../../helpers/view-helper')

const { div, h1 } = hh(h)

module.exports = function New (params) {
  return div('.main.container.mt-3.mb-5', [
    div('.w-50.m-auto', [
      h1('.page-header', 'Sign up'),
      ErrorMsg(params.errors),
      SignUp(params)
    ])
  ])
}
