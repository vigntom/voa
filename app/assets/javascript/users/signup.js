const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')

const { div, label, input, small, button } = hh(h)

function Username ({ user, errors }) {
  const options = {
    name: 'username',
    defaultValue: user.username,
    placeholder: 'Pic a username'
  }

  return div('.form-group', [
    label({ htmlFor: 'signup-username' }, 'Username'),
    input(
      '#signup-username.form-control',
      w.maybeError(options, errors, { placement: 'top' }))
  ])
}

function Email ({ user, errors }) {
  const options = {
    name: 'email',
    type: 'email',
    defaultValue: user.email,
    placeholder: 'Enter email'
  }

  return div('.form-group', [
    label({ htmlFor: 'signup-email' }, 'Email'),
    input(
      '#signup-email.form-control',
      w.maybeError(options, errors, { placement: 'top' })
    )
  ])
}

function Password ({ user, errors }) {
  const options = {
    name: 'password',
    type: 'password',
    placeholder: 'Password'
  }

  return div('.form-group', [
    label({ htmlFor: 'signup-password' }, 'Password'),
    input(
      '#signup-password.form-control',
      w.maybeError(options, errors, { placement: 'top' })
    )
  ])
}

function Confirmation ({ user, errors }) {
  const options = {
    name: 'passwordConfirmation',
    type: 'password',
    placeholder: 'Confirmation'
  }

  return div('.form-group', [
    label({ htmlFor: 'signup-confirmation' }, 'Confirmation'),
    input(
      '#signup-confirmation.form-control',
      w.maybeError(options, errors, { placement: 'top' })
    ),
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
