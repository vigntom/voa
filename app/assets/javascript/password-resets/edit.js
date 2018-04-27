const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')

const { div, h1, input, button } = hh(h)

function EditPassword ({ name, placeholder, errors }) {
  const options = { type: 'password', name, placeholder }
  const elemOptions = w.maybeError(options, errors, { placement: 'top' })
  return div('.form-group', [
    input('#edit-password.form-control', elemOptions)
  ])
}

function ResetPassword ({ user, token, errors, csrfToken }) {
  console.log(errors)
  const action = `/passwordResets/${token}`
  return div('.main', [
    h1('.page-header', 'Reset password'),
    div('.d-flex.justify-content-center', [
      div('.w-30', [
        w.FormFor('#reset-password.reset-password', { action }, [
          input({ type: 'hidden', name: '_method', value: 'patch' }),
          input({ type: 'hidden', name: '_csrf', value: csrfToken }),
          input({ type: 'hidden', name: 'email', value: user.email }),

          EditPassword({
            name: 'password',
            placeholder: 'password',
            errors
          }),

          EditPassword({
            name: 'passwordConfirmation',
            placeholder: 'confirmation',
            errors
          }),

          button('.btn.btn-block.btn-primary.my-3', { type: 'submit' }, 'Submit')
        ])
      ])
    ])
  ])
}

module.exports = ResetPassword
