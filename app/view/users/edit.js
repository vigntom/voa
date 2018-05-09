const w = require('../helpers')
const h = require('../helpers/hyperscript')

const { div, label, input, button, a } = h

function Username ({ user, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'username',
    defaultValue: user.username
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'edit-username' }, 'Username'),
    input('#edit-username', options)
  ])
}

function Email ({ user, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'email',
    type: 'email',
    defaultValue: user.email
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'edit-email' }, 'Email'),
    input('#edit-email', options)
  ])
}

function Password ({ user, errors, name }) {
  const options = w.maybeError({
    className: 'form-control',
    name,
    type: 'password'
  }, errors)

  return div('.form-group', [
    label({ htmlFor: 'edit-password' }, 'Password'),
    input(`#edit-${name}`, options)
  ])
}

function EditPage ({ user, errors, csrfToken, flash }) {
  const author = user.username

  return div('.main.container.my-5.p-5', [
    div('.row.justify-content-center', [
      w.MessageDesk(flash),
      div('.gravatar-edit.col-3', [
        w.Gravatar({ user, size: '160px' }),
        button('.btn.btn-outline-secondary.btn-gravatar.mt-1', [
          a({ href: 'http://gravatar.com/emails', target: '_blank' }, 'change')
        ])
      ]),

      div('.col-5.mb-3', [
        w.FormFor('#edit-user.edit-user', { action: w.path({ author }) }, [
          input({ name: '_method', value: 'patch', type: 'hidden' }),
          input({ name: '_csrf', value: csrfToken, type: 'hidden' }),

          Username({ user, errors }),
          Email({ user, errors }),
          Password({ user, errors, name: 'password' }),
          Password({ user, errors, name: 'passwordConfirmation' }),

          div('.form-check.border-top.my-3.py-3', [
            input('#edit-email-protection.form-check-input', {
              type: 'checkbox',
              name: 'emailProtected',
              value: true,
              defaultChecked: user.emailProtected
            }),
            label('.form-check-label', {
              htmlFor: 'edit-email-protection'
            }, 'Keep my email address private')
          ]),

          button('.btn.btn-secondary.my-2', {
            type: 'submit'
          }, 'Save changes')
        ])
      ])
    ])
  ])
}

module.exports = EditPage
