const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const pluralize = require('pluralize')
const { form, div, ul, li } = hh(h)

function FormFor (selector, params, children) {
  const defaultParams = { acceptCharset: 'UTF-8', method: 'post' }
  const formParams = Object.assign({}, defaultParams, params)

  return form(selector, formParams, children)
}

function ErrorMsg (err) {
  if (!err) { return null }

  const errors = Object.values(err)

  return div('.error-msg', [
    div('.alert.alert-danger',
      `The form contains ${pluralize('error', errors.length, true)}`
    ),
    ul(errors.map(msg => li(msg.message)))
  ])
}

function MessageDesk (messages) {
  const msgTypes = Object.keys(messages)
  const alert = msgType => div(`.alert.alert-${msgType}.my-3`, messages[msgType])

  if (msgTypes.length > 0) { return div(msgTypes.map(alert)) }

  return null
}
function maybeErrorField (name, errors) {
  if (!errors) { return '' }
  if (errors[name]) { return 'is-invalid' }
  return 'is-valid'
}

module.exports = {
  FormFor,
  ErrorMsg,
  MessageDesk,
  maybeErrorField
}
