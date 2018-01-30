const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { FormFor, MessageDesk } = require('../../../helpers/view-helper')

const { div, h1, p, a, label, input, button } = hh(h)

module.exports = function New ({ csrfToken, user, messages = {}}) {
  return div('.main', [
    h1('.page-header', 'Log in'),
    div('.d-flex.justify-content-center', [
      div('.w-30', [
        MessageDesk(messages),
        FormFor('#new-session.new-session', { action: '/login' }, [
          input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
          div('.form-group', [
            input('#session-user.form-control.my-3', {
              name: 'user',
              placeholder: 'Email or Username',
              defaultValue: user
            }),
            input('#session-password.form-control.my-3', {
              name: 'password',
              type: 'password',
              placeholder: 'Password'
            }),
            div('.form-check', [
              label('.form-check-label', [
                input('.form-check-input', {
                  name: 'rememberMe',
                  type: 'checkbox',
                  value: 1
                }),
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
