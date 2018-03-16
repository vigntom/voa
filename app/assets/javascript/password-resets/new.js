const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { FormFor, MessageDesk, ErrorMsg, maybeErrorField } = require('../../../helpers/view-helper')

const { h1, div, input, button } = hh(h)

module.exports = function New ({ csrfToken, errors, flash }) {
  return div('.main', [
    h1('.page-header', 'Forgot password'),
    div('.d-flex.justify-content-center', [
      div('.w-30', [
        MessageDesk(flash),
        ErrorMsg(errors),
        FormFor('#new-password-resets.new-password-resets', { action: '/passwordResets' }, [
          input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
          div('.form-group', [
            input('#password-resets-email.form-control.my-3', {
              name: 'email',
              placeholder: 'Email',
              className: maybeErrorField('email', errors)
            })
          ]),
          button('.btn.btn-block.btn-primary.my-3', { type: 'submit' }, 'Submit')
        ])
      ])
    ])
  ])
}
