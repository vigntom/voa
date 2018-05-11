const w = require('../helpers')
const h = require('../helpers/hyperscript')
const { div, label, input, small, button } = h

function Username ({ user, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'username',
    value: user.username,
    placeholder: 'Pic a username'
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'signup-username' }, 'Username'),
    input('#signup-username', options)
  ])
}

function Email ({ user, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'email',
    type: 'email',
    value: user.email,
    placeholder: 'Enter email'
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'signup-email' }, 'Email'),
    input('#signup-email', options)
  ])
}

function Password ({ user, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'password',
    type: 'password',
    placeholder: 'Password'
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'signup-password' }, 'Password'),
    input('#signup-password', options)
  ])
}

function Confirmation ({ user, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'passwordConfirmation',
    type: 'password',
    placeholder: 'Confirmation'
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'signup-confirmation' }, 'Confirmation'),
    input('#signup-confirmation', options),
    small('#password-help.form-text.text-muted',
      'Use at least one letter, one number and six characters.'
    )
  ])
}

function SignUp (options) {
  const { csrfToken } = options

  return w.FormFor('#new-user.new-user', { action: '/ui' }, [
    input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
    Username(options),
    Email(options),
    Password(options),
    Confirmation(options),
    button('.btn.btn-block.btn-primary.my-4', { type: 'submit' }, 'Signup for VoA')
  ])
}

module.exports = SignUp
