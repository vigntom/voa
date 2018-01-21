const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const pluralize = require('pluralize')
const { FormFor, Token } = require('../../../helpers/view-helper')

const { div, ul, li, label, input, small, button } = hh(h)

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

function maybeErrorField (name, errors) {
  if (!errors) { return '' }
  if (errors[name]) { return 'is-invalid' }
  return 'is-valid'
}

function SignUp ({ user, errors, csrfToken }) {
  return FormFor('#new-user.new-user', { action: '/users' }, [
    Token({ id: 'csrf', value: csrfToken }),
    ErrorMsg(errors),
    div('.form-group', [
      label({ htmlFor: 'signup-username' }, 'Username'),
      input('#signup-username.form-control', {
        name: 'username',
        defaultValue: user.username,
        placeholder: 'Pic a username',
        className: maybeErrorField('username', errors)
      })
    ]),
    div('.form-group', [
      label({ htmlFor: 'signup-email' }, 'Email'),
      input('#signup-email.form-control', {
        name: 'email',
        type: 'email',
        defaultValue: user.email,
        placeholder: 'Enter email',
        className: maybeErrorField('email', errors)
      })
    ]),
    div('.form-group', [
      label({ htmlFor: 'signup-password' }, 'Password'),
      input('#signup-password.form-control', {
        name: 'password',
        type: 'password',
        'aria-describedby': 'password-help',
        placeholder: 'Password',
        className: maybeErrorField('password', errors)
      }),
      small('#password-help.form-text.text-muted',
        'Use at least one letter, one number and six characters.'
      )
    ]),
    div('.form-group', [
      label({ htmlFor: 'signup-confirmation' }, 'Confirmation'),
      input('#signup-confirmation.form-control', {
        name: 'passwordConfirmation',
        type: 'password',
        'aria-describedby': 'password-help',
        placeholder: 'Confirmation'
      })
    ]),
    button('.btn.btn-block.btn-primary.my-4', { type: 'submit' }, 'Signup for VoA')
  ])
}

module.exports = SignUp
