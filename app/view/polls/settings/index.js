const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const EditGroup = require('./edit-group')
const NavBar = require('../nav-bar')
const modal = require('./modal')

const { div, label, input, h1, a, span, ul, li, h2, h6, p, button } = h

function Name ({ poll, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'name',
    value: poll.name
  }, errors, { placement: 'top' })

  return div('.form-row', [
    div('.col-auto', [
      label({ htmlFor: 'settings-name' }, 'Name'),
      input('#settings-name', options)
    ])
  ])
}

function Description ({ poll, errors }) {
  const options = w.maybeError({
    className: 'form-control',
    name: 'description',
    value: poll.description
  }, errors)

  return div('.form-group.my-4', [
    label({ htmlFor: 'settings-description' }, 'Description'),
    input('#settings-description', options)
  ])
}

function MainOptions ({ poll, csrfToken, errors }) {
  const author = poll.author.username
  const pollname = poll.name

  return w.FormFor('#settings.pt-3', {
    action: w.path({ author, pollname, rest: 'settings' })
  }, [
    input({ name: '_csrf', value: csrfToken, type: 'hidden' }),

    Name({ poll, errors }),
    Description({ poll, errors }),

    button('.btn.btn-primary', { type: 'submit' }, 'Update')
  ])
}

function DangerZone () {
  const modalButton = target => ({
    type: 'button',
    'data-toggle': 'modal',
    'data-target': target
  })

  return div('.border.border-danger.rounded.p-1', [
    ul('.list-group.list-group-flush', [
      li('.list-group-item', [
        button('.btn.btn-outline-danger.float-right.w-15',
          modalButton('#transfer-modal'),
          'Transfer'
        ),

        h6('Transfer ownership'),
        p('Transfer this poll to another user')
      ]),

      li('.list-group-item', [
        button('.btn.btn-outline-danger.float-right.w-15',
          modalButton('#delete-modal'),
          'Delete'
        ),

        h6('Deleter this poll'),
        p('Delete this poll.')
      ])
    ])
  ])
}

function Settings (options) {
  return div('.container', [
    div('.border-bottom', [ h2('Settings') ]),
    MainOptions(options),

    div('.mt-5.py-3', [ h2('Danger Zone') ]),
    DangerZone(),

    modal.Transfer(options),
    modal.Delete(options)
  ])
}

function Page (options) {
  const { poll, canUpdate } = options
  const author = poll.author.username
  const pollname = poll.name

  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        div('.py-3', [
          h1('.h3', [
            a({ href: w.path({ author }) }, author),
            span('.slash', ' / '),
            a({ href: w.path({ author, pollname }) }, pollname)
          ])
        ]),

        NavBar({ poll, canUpdate, active: 'Settings' })
      ])
    ]),

    div('.bg-white', [
      div('.container.py-5', [
        w.MessageDesk(options.flash),
        div('.row.justify-content-center.bg-white', [
          div('.col-3', [ EditGroup(options) ]),
          div('.col-7', [ Settings(options) ])
        ])
      ])
    ])
  ])
}

module.exports = Page
