const w = require('../helpers')
const h = require('../helpers/hyperscript')

const { h1, div, input, button } = h

module.exports = function New ({ csrfToken, errors }) {
  const options = w.maybeError({
    className: 'form-control my-3',
    name: 'email',
    placeholder: 'Email'
  }, errors)

  return div('.main.container.my-5.py-5', [
    div('.w-30.m-auto', [
      h1('.page-header', 'Forgot password'),
      w.MessageDesk(errors),
      w.FormFor('#new-password-resets.new-password-resets', { action: '/passwordResets' }, [
        input('#csrf', { type: 'hidden', name: '_csrf', value: csrfToken }),
        div('.form-group', [
          input('#password-resets-email', options)
        ]),
        button('.btn.btn-block.btn-primary.my-3', { type: 'submit' }, 'Submit')
      ])
    ])
  ])
}
