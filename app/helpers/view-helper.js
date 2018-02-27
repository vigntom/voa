const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const pluralize = require('pluralize')
const crypto = require('crypto')
const { form, div, ul, li, image } = hh(h)

function md5 (string) {
  return crypto.createHash('md5')
    .update(string)
    .digest('hex')
}

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
  const alert = msgType => div(`.alert.alert-${msgType}.m-0`, messages[msgType])

  if (msgTypes.length > 0) { return div(msgTypes.map(alert)) }

  return null
}

function maybeErrorField (name, errors) {
  if (!errors) { return '' }
  if (errors[name]) { return 'is-invalid' }
  return 'is-valid'
}

function gravatarUrl (email, size = 80) {
  return `https://secure.gravatar.com/avatar/${md5(email)}?s=${size}`
}

function Gravatar ({ user, size }) {
  return image('.gravatar', { src: gravatarUrl(user.email, size), alt: user.username })
}

module.exports = {
  FormFor,
  ErrorMsg,
  MessageDesk,
  maybeErrorField,
  Gravatar
}
