const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { FormFor, maybeError, Gravatar } = require('../../../helpers/view-helper')

const { div, label, input, button, a } = hh(h)

function Username ({ user, errors }) {
  const options = maybeError({
    name: 'username',
    defaultValue: user.username
  }, errors, { placement: 'top' })

  return div('.form-group', [
    label({ htmlFor: 'edit-username' }, 'Username'),
    input('#edit-username.form-control', options)
  ])
}

function Email ({ user, errors }) {
  const options = maybeError({
    name: 'email',
    type: 'email',
    defaultValue: user.email
  }, errors, { placement: 'top' })

  return div('.form-group', [
    label({ htmlFor: 'edit-email' }, 'Email'),
    input('#edit-email.form-control', options)
  ])
}

function Password ({ user, errors, name }) {
  const options = maybeError({
    name,
    type: 'password'
  }, errors, { placement: 'top' })

  return div('.form-group', [
    label({ htmlFor: 'edit-password' }, 'Password'),
    input(`#edit-${name}.form-control`, options)
  ])
}

function EditPage ({ user, errors, csrfToken }) {
  return div('.main.container.my-5.p-5', [
    div('.row.justify-content-center', [
      div('.gravatar-edit.col-3', [
        Gravatar({ user, size: '160px' }),
        button('.btn.btn-outline-secondary.btn-gravatar.mt-1', [
          a({ href: 'http://gravatar.com/emails', target: '_blank' }, 'change')
        ])
      ]),

      div('.col-5.mb-3', [
        FormFor('#edit-user.edit-user', { action: `/users/${user.id}` }, [
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
