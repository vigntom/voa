const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const pluralize = require('pluralize')

const { div, ul, li, form, label, input, small, button } = hh(h)

function ErrorMsg (errors) {
  if (!Array.isArray(errors)) { return null }

  return div('.error-msg', [
    div('.alert.alert-danger',
      `The form contains ${pluralize('error', errors.length)}`
    ),
    ul(errors.map(msg => li(msg.message)))
  ])
}

function SignUp ({ user, errors, csrfToken }) {
  return form('#new-user.new-user', {
    acceptCharset: 'UTF-8',
    action: '/users',
    method: 'post'
  }, [
    input({ type: 'hidden', id: 'csrf', name: '_csrf', value: csrfToken }),
    ErrorMsg(errors),
    div('.form-group', [
      label({ htmlFor: 'signup-username' }, 'Username'),
      input('#signup-username.form-control', {
        name: 'username',
        value: user.username,
        placeholder: 'Pic a username'
      })
    ]),
    div('.form-group', [
      label({ htmlFor: 'signup-email' }, 'Email'),
      input('#signup-email.form-control', {
        name: 'email',
        type: 'email',
        value: user.email,
        placeholder: 'Enter email'
      })
    ]),
    div('.form-group', [
      label({ htmlFor: 'signup-password' }, 'Password'),
      input('#signup-password.form-control', {
        name: 'password',
        type: 'password',
        'aria-describedby': 'password-help',
        placeholder: 'Password'
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
    div('.form-check', [
      label('.form-check-label', [
        input('.form-check-input', { type: 'checkbox' }),
        'Check me out'
      ])
    ]),
    button('.btn.btn-block.btn-primary', { type: 'submit' }, 'Signup for VoA')
  ])
}

module.exports = SignUp
