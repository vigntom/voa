const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { input, form } = hh(h)

function FormFor (selector, params, children) {
  const defaultParams = { acceptCharset: 'UTF-8', method: 'post' }
  const formParams = Object.assign({}, defaultParams, params)

  return form(selector, formParams, children)
}

function Token ({ id, value }) {
  return input({ type: 'hidden', id, name: '_csrf', value })
}

module.exports = {
  FormFor,
  Token
}
