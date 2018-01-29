const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const { gravatarUrl } = require('../../../helpers/users-helper')
const { FormFor, ErrorMsg, maybeErrorField } = require('../../../helpers/view-helper')

const { div, h1, label, input, button, image, a } = hh(h)

function EditPage ({ user, errors, csrfToken }) {
  return div('.main', [
    h1('.page-header', 'Update your profile'),
    div('.d-flex.justify-content-center', [
      div('.w-40', [
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

          button('.btn.btn-block.btn-primary.my-2', {
            type: 'submit'
          }, 'Save changes')
        ]),

        div('.gravatar-edit', [
          image('.my-2.mr-2', { src: gravatarUrl(user.email), alt: user.username }),
          a({ href: 'http://gravatar.com/emails', target: '_blank' }, 'change')
        ])
      ])
    ])
  ])
}

module.exports = EditPage
