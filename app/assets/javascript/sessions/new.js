const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { FormFor, Token } = require('../../../helpers/view-helper')

const { div, h1, p, a, label, input, button } = hh(h)

module.exports = function New ({ csrfToken }) {
  return div('.main', [
    h1('.page-header', 'Log in'),
    div('.d-flex.justify-content-center', [
      div('.w-30', [
        FormFor('#new-session.new-session', { action: '/login' }, [
          Token({ id: 'csrf', value: csrfToken }),
          div('.form-group', [
            input('#session-user.form-control.my-3', {
              name: 'user',
              placeholder: 'Email or Username'
            }),
            input('#session-password.form-control.my-3', {
              name: 'password',
              type: 'password',
              placeholder: 'Password'
            }),
            div('.form-check', [
              label('.form-check-label', [
                input('.form-check-input', { type: 'checkbox' }),
                'Remember me on this computer'
              ])
            ]),
            button('.btn.btn-block.btn-primary.my-3', { type: 'submit' }, 'Log In'),
            p(['New to VoA? ', a({ href: '/signup' }, 'Signup now!')])
          ])
        ])
      ])
    ])
  ])
}
