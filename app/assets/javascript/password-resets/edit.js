const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { FormFor, ErrorMsg, maybeErrorField } = require('../../../helpers/view-helper')

const { div, h1, input, button } = hh(h)

function ResetPassword ({ user, token, errors, csrfToken }) {
  const action = `/passwordResets/${token}`
  return div('.main', [
    h1('.page-header', 'Reset password'),
    div('.d-flex.justify-content-center', [
      div('.w-30', [
        FormFor('#reset-password.reset-password', { action }, [
          input({ type: 'hidden', name: '_method', value: 'patch' }),
          input({ type: 'hidden', name: '_csrf', value: csrfToken }),
          input({ type: 'hidden', name: 'email', value: user.email }),
          ErrorMsg(errors),
          div('.form-group', [
            input('#edit-password.form-control', {
              name: 'password',
              type: 'password',
              placeholder: 'password',
              className: maybeErrorField('password', errors)
            })
          ]),

          div('.form-group', [
            input('#edit-confirmation.form-control', {
              name: 'passwordConfirmation',
              type: 'password',
              placeholder: 'confirmation',
              className: maybeErrorField('passwordConfirmation', errors)
            })
          ]),

          button('.btn.btn-block.btn-primary.my-3', { type: 'submit' }, 'Submit')
        ])
      ])
    ])
  ])
}

module.exports = ResetPassword
