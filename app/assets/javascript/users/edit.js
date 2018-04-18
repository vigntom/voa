const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { FormFor, ErrorMsg, maybeErrorField, Gravatar } = require('../../../helpers/view-helper')

const { div, h1, label, input, button, a } = hh(h)

function EditPage ({ user, errors, csrfToken }) {
  return div('.main.container.mt-3', [
    h1('.page-header', 'Update your profile'),
    div('.row.mt-4', [
      div('.gravatar-edit.col-3', [
        div('.py-3', [ Gravatar({ user, size: '160px' }) ]),
        button('.btn.btn-outline-secondary.btn-gravatar', [
          a({ href: 'http://gravatar.com/emails', target: '_blank' }, 'change')
        ])
      ]),

      div('.col-5.mb-3', [
        FormFor('#edit-user.edit-user', { action: `/users/${user.id}` }, [
          input({ name: '_method', value: 'patch', type: 'hidden' }),
          input({ name: '_csrf', value: csrfToken, type: 'hidden' }),
          ErrorMsg(errors),
          div('.form-group', [
            label({ htmlFor: 'edit-username' }, 'Username'),
            input('#edit-username.form-control', {
              name: 'username',
              defaultValue: user.username,
              className: maybeErrorField('username', errors)
            })
          ]),

          div('.form-group', [
            label({ htmlFor: 'edit-email' }, 'Email'),
            input('#edit-email.form-control', {
              name: 'email',
              type: 'email',
              defaultValue: user.email,
              className: maybeErrorField('email', errors)
            })
          ]),

          div('.form-group', [
            label({ htmlFor: 'edit-password' }, 'Password'),
            input('#edit-password.form-control', {
              name: 'password',
              type: 'password',
              className: maybeErrorField('password', errors)
            })
          ]),

          div('.form-group', [
            label({ htmlFor: 'edit-confirmation' }, 'Confirmation'),
            input('#edit-confirmation.form-control', {
              name: 'passwordConfirmation',
              type: 'password',
              className: maybeErrorField('passwordConfirmation', errors)
            })
          ]),

          div('.form-check.border-top.my-3.py-3', [
            input('#edit-email-protection.form-check-input', {
              type: 'checkbox',
              defaultValue: user.emailProtected,
              name: 'emailProtected'
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
