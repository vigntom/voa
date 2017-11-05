const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { div, h1, form, label, input, small, button } = hh(h)

module.exports = function Home () {
  return div('.main', [
    div('.jumbotron.jumbotron-fluid.bg-dark-lighter.text-light', [
      div('.container', [
        div('.row', [
          div('.col-lg-7.align-self-center', [
            h1('Welcome to the Votting Application')
          ]),
          div('.col-lg.mx-4', [
            div('.bg-light.text-dark.rounded.px-3.py-3', [
              form([
                div('.form-group', [
                  label({ htmlFor: 'signup-username' }, 'Username'),
                  input('#signup-username.form-control', {
                    placeholder: 'Pic a username'
                  })
                ]),
                div('.form-group', [
                  label({ htmlFor: 'signup-email' }, 'Email'),
                  input('#signup-email.form-control', {
                    type: 'email',
                    placeholder: 'Enter email'
                  })
                ]),
                div('.form-group', [
                  label({ htmlFor: 'signup-password' }, 'Password'),
                  input('#signup-password.form-control', {
                    type: 'password',
                    'aria-describedby': 'password-help',
                    placeholder: 'Password'
                  }),
                  small('#password-help.form-text.text-muted',
                    'Use at least one letter, one number and six characters.'
                  )
                ]),
                div('.form-check', [
                  label('.form-check-label', [
                    input('.form-check-input', { type: 'checkbox' }),
                    'Check me out'
                  ])
                ]),
                button('.btn.btn-block.btn-primary', { type: 'submit' }, 'Signup for VoA')
              ])
            ])
          ])
        ])
      ])
    ]),
    div('.poll-tags.container', [
    ])
  ])
}
