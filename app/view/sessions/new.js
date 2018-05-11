const w = require('../helpers')
const h = require('../helpers/hyperscript')

const { div, h1, span, a, label, input, button } = h

module.exports = function New ({ csrfToken, user, flash }) {
  return div('.main.cointainer.mt-3.mb-5', [
    div('.w-30.m-auto', [
      h1('.page-header', 'Log in'),
      w.MessageDesk(flash),
      w.FormFor('#new-session.new-session', { action: '/login' }, [
        input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
        div('.form-group', [
          input('#session-user.form-control.my-3', {
            name: 'user',
            placeholder: 'Email or Username',
            value: user
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
              'Remember me',
              span('.sep', ''),
              a({ href: '/passwordResets/new' }, '(Forgot password?)')
            ])
          ]),
          button('.btn.btn-block.btn-primary.my-3', { type: 'submit' }, 'Log In'),
          'New to VoA?',
          span('.sep', '/'),
          a({ href: '/signup' }, 'Signup now!')
        ])
      ])
    ])
  ])
}
